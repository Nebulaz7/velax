import { SuiClient } from "@mysten/sui/client";
import { createClient } from "@supabase/supabase-js";

// --- CONFIG ---
const SUPABASE_URL = "https://urqzczkgwrmzcuxiomez.supabase.co";
const SUPABASE_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVycXpjemtnd3JtemN1eGlvbWV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjAyMTI2MiwiZXhwIjoyMDgxNTk3MjYyfQ.7Z7eG2iIa0W26V9RMHr8J8iWwD6jeELK1avSP16DEQs";
const PACKAGE_ID =
  "0xd1c395da20567fff79185d374be6d5d3f41fed6f4f0bb874c5ea198d803cd84c";

const client = new SuiClient({ url: "https://fullnode.testnet.sui.io:443" });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

let createdCursor: any = null;
let bidCursor: any = null;

async function runIndexer() {
  console.log("🚀 Smart Indexer started...");

  while (true) {
    try {
      // 1. Process New Auctions
      const createdEvents = await client.queryEvents({
        query: { MoveEventType: `${PACKAGE_ID}::auction::AuctionCreated` },
        cursor: createdCursor,
        order: "ascending",
      });

      for (const event of createdEvents.data) {
        createdCursor = {
          txDigest: event.id.txDigest,
          eventSeq: event.id.eventSeq,
        };
        const data = event.parsedJson as any;

        // --- THE FIX: Fetch extra details from the chain ---
        console.log(`🔍 Fetching details for ${data.auction_id}...`);

        const auctionObj = await client.getObject({
          id: data.auction_id,
          options: { showContent: true },
        });

        // Extract fields safely
        const content = auctionObj.data?.content as any;
        const fields = content?.fields;

        // Get the NFT details (it's wrapped inside the auction)
        // Note: In our contract, the NFT is in a dynamic field or Option.
        // For hackathon speed, we might just have to rely on the event for image,
        // but let's try to get the starting bid from the auction object.
        const currentBid = fields?.highest_bid || 0;

        // For the Name/Desc, if we didn't emit it, we might have to use a placeholder
        // or fetch the NFT ID if accessible.
        // TIP: For now, let's allow the frontend to update these via Supabase later
        // OR just default them if missing.

        // Ideally, we would fetch the NFT object here, but it's wrapped.
        // Let's Insert what we have + the correct starting bid.

        const { error } = await supabase.from("auctions").upsert(
          {
            auction_id: data.auction_id,
            seller: data.seller,
            image_url: data.image_url, // Event has this
            end_time: Number(data.end_time),
            highest_bid: Number(currentBid), // <--- FIXED: Use real price from object
            starting_price: Number(currentBid),
            is_active: true,
            // If we can't get name from chain easily without contract change,
            // we will parse it from the 'image_url' or leave blank for now.
            name: "Velax Item",
            description: "No description",
          },
          { onConflict: "auction_id" }
        );

        if (error) console.error("❌ DB Error:", error.message);
        else console.log(`✅ Indexed: ${data.auction_id}`);
      }

      // 2. Process Bids
      const bidEvents = await client.queryEvents({
        query: { MoveEventType: `${PACKAGE_ID}::auction::BidPlaced` },
        cursor: bidCursor,
        order: "ascending",
      });

      for (const event of bidEvents.data) {
        bidCursor = {
          txDigest: event.id.txDigest,
          eventSeq: event.id.eventSeq,
        };
        const data = event.parsedJson as any;

        console.log(
          `💰 Bid by ${data.bidder} on ${data.auction_id}: ${data.amount}`
        );

        // Update Price AND Bidder
        const { error } = await supabase
          .from("auctions")
          .update({
            highest_bid: Number(data.amount),
            highest_bidder: data.bidder, // <--- CAPTURE THE WINNER
          })
          .eq("auction_id", data.auction_id);

        if (error) console.error("   ❌ DB Error:", error.message);
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.error("⚠️ Retrying...", errorMessage);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

runIndexer();
