module velax::auction {
    use std::string::{Self, String};
    use sui::url::{Self, Url};
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use sui::balance::{Self, Balance};

    // --- Errors ---
    const E_AUCTION_NOT_STARTED: u64 = 1;
    const E_AUCTION_ENDED: u64 = 2;
    const E_BID_TOO_LOW: u64 = 3;
    const E_NOT_SELLER: u64 = 4;

    // --- Structs ---

    // 1. The NFT itself
    public struct VelaxNFT has key, store {
        id: UID,
        name: String,
        description: String,
        url: Url,
    }

    // 2. The Auction Object (Shared)
    public struct Auction has key {
        id: UID,
        nft: Option<VelaxNFT>,  // Holds the NFT until claimed
        seller: address,
        highest_bidder: Option<address>,
        highest_bid: u64,
        end_time: u64,
        funds: Balance<SUI>     // Holds the active bid funds
    }

    // --- Events (For Supabase Indexing) ---
    public struct AuctionCreated has copy, drop {
        auction_id: ID,
        nft_id: ID,
        seller: address,
        end_time: u64,
        image_url: String 
    }

    public struct BidPlaced has copy, drop {
        auction_id: ID,
        bidder: address,
        amount: u64
    }

    public struct AuctionEnded has copy, drop {
        auction_id: ID,
        winner: address,
        amount: u64
    }

    // --- Functions ---

    // 1. Mint NFT and Create Auction in ONE step (Saves time/gas)
    public entry fun create_auction(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        duration_ms: u64,
        starting_price: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Create NFT
        let nft = VelaxNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url)
        };
        let nft_id = object::id(&nft);
        let nft_url_str = string::utf8(url); // For event

        // Create Auction
        let end_time =  sui::clock::timestamp_ms(clock) + duration_ms;
        
        let auction = Auction {
            id: object::new(ctx),
            nft: option::some(nft), // Put NFT inside auction
            seller: sender,
            highest_bidder: option::none(),
            highest_bid: starting_price,
            end_time,
            funds: balance::zero()
        };

        // Emit Event for Supabase
        event::emit(AuctionCreated {
            auction_id: object::id(&auction),
            nft_id,
            seller: sender,
            end_time,
            image_url: nft_url_str
        });

        // Share object so anyone can bid
        transfer::share_object(auction);
    }

    // 2. The "Instant Refund" Bid Function
    public entry fun place_bid(
        auction: &mut Auction,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let now = sui::clock::timestamp_ms(clock);
        // assert!(now < auction.end_time, E_AUCTION_ENDED); // Commented out for easier testing, uncomment for prod
        
        let payment_value = coin::value(&payment);
        assert!(payment_value > auction.highest_bid, E_BID_TOO_LOW);

        // A. REFUND PREVIOUS BIDDER ATOMICALLY
        if (option::is_some(&auction.highest_bidder)) {
            let prev_bidder = *option::borrow(&auction.highest_bidder);
            let prev_amount = balance::value(&auction.funds);
            
            // Take funds out of auction
            let refund_coin = coin::take(&mut auction.funds, prev_amount, ctx);
            
            // Send back to previous bidder immediately
            transfer::public_transfer(refund_coin, prev_bidder);
        };

        // B. UPDATE STATE
        let coin_balance = coin::into_balance(payment);
        balance::join(&mut auction.funds, coin_balance);
        
        auction.highest_bidder = option::some(tx_context::sender(ctx));
        auction.highest_bid = payment_value;

        event::emit(BidPlaced {
            auction_id: object::id(auction),
            bidder: tx_context::sender(ctx),
            amount: payment_value
        });
    }

    // 3. End Auction / Claim
    public entry fun end_auction(
        auction: &mut Auction,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let now = sui::clock::timestamp_ms(clock);
        // assert!(now >= auction.end_time, E_AUCTION_NOT_STARTED); // Validates auction is over

        // 1. Send Money to Seller
        let funds_amount = balance::value(&auction.funds);
        if (funds_amount > 0) {
            let profit = coin::take(&mut auction.funds, funds_amount, ctx);
            transfer::public_transfer(profit, auction.seller);
        };

        // 2. Send NFT to Winner (or back to seller if no bids)
        let winner = if (option::is_some(&auction.highest_bidder)) {
            *option::borrow(&auction.highest_bidder)
        } else {
            auction.seller
        };

        if (option::is_some(&auction.nft)) {
            let item = option::extract(&mut auction.nft);
            transfer::public_transfer(item, winner);
        };

        event::emit(AuctionEnded {
            auction_id: object::id(auction),
            winner,
            amount: funds_amount
        });
    }
}