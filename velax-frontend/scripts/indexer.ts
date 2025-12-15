import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Configuration
const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID!;
const MODULE_NAME = process.env.NEXT_PUBLIC_MODULE!;
const EVENT_TYPE = `${PACKAGE_ID}::${MODULE_NAME}::ItemListed`;

// Connect to Services
const client = new SuiClient({ url: getFullnodeUrl("testnet") });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // <--- MUST use Service Role to write data
);

async function index() {
  console.log(`🤖 Indexer Running...`);
  console.log(`👀 Watching: ${EVENT_TYPE}`);

  while (true) {
    try {
      // 1. Fetch the latest events
      const events = await client.queryEvents({
        query: { MoveEventType: EVENT_TYPE },
        limit: 10,
        order: "descending",
      });

      // 2. Process each event
      for (const event of events.data) {
        const parsed = event.parsedJson as any;

        // Log what we found
        console.log(`Found item: ${parsed.object_id}`);

        // 3. Upsert into Supabase (Insert if new, ignore if exists)
        const { error } = await supabase.from("items").upsert(
          {
            sui_object_id: parsed.object_id,
            seller: parsed.seller,
            price: Number(parsed.price), // Convert BigInt string to Number
            blob_id: parsed.blob_id,
            status: "listed",
          },
          { onConflict: "sui_object_id" }
        ); // Use object_id to prevent duplicates

        if (error) {
          console.error("Supabase Error:", error.message);
        }
      }

      // 4. Wait 5 seconds before checking again (Polling)
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (e) {
      console.error("Indexer Error:", e);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

index();
