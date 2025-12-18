import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { createClient } from "@supabase/supabase-js";

// --- CONFIGURATION ---
const SUPABASE_URL = "https://urqzczkgwrmzcuxiomez.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVycXpjemtnd3JtemN1eGlvbWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMjEyNjIsImV4cCI6MjA4MTU5NzI2Mn0.4QlkF_8qQ76rs2YxnyTudtVsXAJJtCRNevz1ZuWUtdQ";
const PACKAGE_ID =
  "0xd1c395da20567fff79185d374be6d5d3f41fed6f4f0bb874c5ea198d803cd84c"; // The one starting with 0x...

const client = new SuiClient({ url: getFullnodeUrl("testnet") });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log("🚀 Indexer started...");
  console.log(`Listening for events from package: ${PACKAGE_ID}`);

  try {
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

        console.log("🔔 Event received:", type);

        if (type.includes("::AuctionCreated")) {
          console.log("📦 New Auction Detected!", data.auction_id);

          const { error } = await supabase.from("auctions").insert({
            auction_id: data.auction_id,
            seller: data.seller,
            image_url: data.image_url,
            end_time: Number(data.end_time),
            highest_bid: 0,
            is_active: true,
          });

          if (error) console.error("❌ Error saving to DB:", error.message);
          else console.log("✅ Saved to Supabase successfully!");
        }
      },
    });

    console.log("✅ Successfully subscribed to events");

    // Handle process termination gracefully
    process.on("SIGINT", () => {
      console.log("\n🛑 Shutting down indexer...");
      unsubscribe();
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      console.log("\n🛑 Shutting down indexer...");
      unsubscribe();
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Failed to subscribe to events:", error);
    process.exit(1);
  }

  // --- KEEP ALIVE LOOP ---
  // Prevents Node.js from exiting
  setInterval(() => {
    console.log("💓 Indexer is still listening...", new Date().toISOString());
  }, 60000);
}

// Keep the process alive by preventing it from exiting
process.stdin.resume();

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
