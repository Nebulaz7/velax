"use client";

import { useState } from "react";
import { useSponsoredTx } from "@/hooks/useSponsoredTx";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, AUCTION_MODULE } from "@/utils/constants";
import { createClient } from "@/lib/supabase"; // Import Supabase
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const executeSponsored = useSponsoredTx();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    price: "1",
    duration: "24", // Default 24 hours
  });

  const handleCreate = async () => {
    if (!formData.title || !formData.url) return alert("Fill all fields");
    setLoading(true);

    try {
      const tx = new Transaction();

      // 1. Logic
      const priceInMist = BigInt(parseFloat(formData.price) * 1_000_000_000);

      // Calculate Duration in MS based on selection
      const hours = parseInt(formData.duration);
      const durationMs = hours * 60 * 60 * 1000;

      // 2. Move Call
      tx.moveCall({
        target: `${PACKAGE_ID}::${AUCTION_MODULE}::create_auction`,
        arguments: [
          tx.pure.string(formData.title),
          tx.pure.string(formData.description),
          tx.pure.string(formData.url),
          tx.pure.u64(durationMs), // <--- DYNAMIC DURATION
          tx.pure.u64(priceInMist),
          tx.object("0x6"),
        ],
      });

      // 3. Execute
      const res = await executeSponsored(tx);
      console.log("Tx Digest:", res.digest);

      // --- THE FIX: Save Name/Desc to Supabase Immediately ---
      // The Indexer will fill in the 'auction_id' and 'end_time' later when it spots the event.
      // But we can verify the auction_id from the effects if we want, or just wait for indexer.

      // Actually, simpler hack:
      // Wait 2 seconds for Indexer to insert the row, THEN update it with the name.
      setTimeout(async () => {
        // We find the most recent auction by this seller (us) that has no name
        // This is a rough heuristic but works for hackathons
        /* Ideally, we would parse res.effects to get the object ID, 
           but let's rely on the indexer to do the heavy lifting 
           and we just update the row where image_url matches.
        */
        await supabase
          .from("auctions")
          .update({
            name: formData.title,
            description: formData.description,
            starting_price: Number(priceInMist),
          })
          .eq("image_url", formData.url); // Match by Image URL (unique enough)

        router.push("/market");
      }, 4000); // Wait 4s to ensure Indexer ran first
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed. See console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Rocket className="text-blue-600" /> Create Auction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Item Name</Label>
            <Input
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Price (SUI)</Label>
              <Input
                type="number"
                defaultValue="1"
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Select
                onValueChange={(val) =>
                  setFormData({ ...formData, duration: val })
                }
                defaultValue="24"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Hour (Quick Test)</SelectItem>
                  <SelectItem value="6">6 Hours</SelectItem>
                  <SelectItem value="24">24 Hours</SelectItem>
                  <SelectItem value="72">3 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="w-full mt-4 bg-blue-600"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Mint & List"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
