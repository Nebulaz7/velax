module velax_contract::market {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event; // Moved to top level
    use std::string::String;

    // --- Errors ---
    const EIncorrectPayment: u64 = 0;
    const EItemAlreadySold: u64 = 1;
    const ENotBuyer: u64 = 2;

    // --- Structs (Must be 'public' in Move 2024) ---
    public struct Listing has key, store {
        id: UID,
        seller: address,
        buyer: Option<address>,
        price: u64,
        blob_id: String,
        escrow: Balance<SUI>,
        status: u8,
    }

    public struct ItemListed has copy, drop {
        object_id: address,
        seller: address,
        price: u64,
        blob_id: String
    }

    public struct ItemSold has copy, drop {
        object_id: address,
        buyer: address
    }

    // --- Functions ---
    
    // 1. LIST ITEM
    public fun list_item(
        blob_id: String,
        price: u64,
        ctx: &mut TxContext
    ) {
        let id = object::new(ctx);
        let object_id = object::uid_to_address(&id);
        let seller = tx_context::sender(ctx);

        let listing = Listing {
            id,
            seller,
            buyer: option::none(),
            price,
            blob_id,
            escrow: balance::zero(),
            status: 0
        };

        transfer::share_object(listing);

        event::emit(ItemListed {
            object_id,
            seller,
            price,
            blob_id
        });
    }

    // 2. BUY ITEM
    public fun buy_item(
        listing: &mut Listing,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(listing.status == 0, EItemAlreadySold);
        assert!(coin::value(&payment) == listing.price, EIncorrectPayment);

        let buyer = tx_context::sender(ctx);
        let coin_balance = coin::into_balance(payment);
        balance::join(&mut listing.escrow, coin_balance);

        listing.status = 1;
        listing.buyer = option::some(buyer);

        event::emit(ItemSold {
            object_id: object::uid_to_address(&listing.id),
            buyer
        });
    }

    // 3. CONFIRM ITEM
    public fun confirm_item(listing: &mut Listing, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        
        assert!(listing.buyer == option::some(sender), ENotBuyer);
        assert!(listing.status == 1, EItemAlreadySold);

        let amount = balance::value(&listing.escrow);
        let payment = coin::take(&mut listing.escrow, amount, ctx);

        transfer::public_transfer(payment, listing.seller);

        listing.status = 2; 
    }
}