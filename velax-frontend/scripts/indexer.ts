import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { createClient } from "@supabase/supabase-js";

// --- CONFIGURATION ---
// 1. Get these from your .env.local or hardcode them here for the script
const SUPABASE_URL = "https://urqzczkgwrmzcuxiomez.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVycXpjemtnd3JtemN1eGlvbWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMjEyNjIsImV4cCI6MjA4MTU5NzI2Mn0.4QlkF_8qQ76rs2YxnyTudtVsXAJJtCRNevz1ZuWUtdQ";
const PACKAGE_ID =
  "0xd1c395da20567fff79185d374be6d5d3f41fed6f4f0bb874c5ea198d803cd84c"; // The one starting with 0x...

// 2. Setup Clients
const client = new SuiClient({ url: getFullnodeUrl("testnet") });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log("🚀 Indexer started...");
  console.log(`Listening for events from package: ${PACKAGE_ID}`);

  // 3. Subscribe to the "AuctionCreated" event
  const unsubscribe = await client.subscribeEvent({
    filter: {
      MoveModule: {
        package: PACKAGE_ID,
        module: "auction",
      },
    },
    onMessage: async (event) => {
      const type = event.type;
      const data = event.parsedJson as any;

      // We only care about AuctionCreated for the marketplace feed
      if (type.includes("::AuctionCreated")) {
        console.log("📦 New Auction Detected!", data.auction_id);
        console.log("   Seller:", data.seller);

        // 4. Save to Supabase
        const { error } = await supabase.from("auctions").insert({
          auction_id: data.auction_id,
          seller: data.seller,
          image_url: data.image_url,
          end_time: Number(data.end_time),
          highest_bid: 0, // Initial bid is 0
          is_active: true,
        });

        if (error) {
          console.error("❌ Error saving to DB:", error.message);
        } else {
          console.log("✅ Saved to Supabase successfully!");
        }
      }
    },
  });

  // Prevent script from exiting
  process.on("SIGINT", async () => {
    console.log("Stopping indexer...");
    await unsubscribe();
    process.exit();
  });
}

main().catch(console.error);
