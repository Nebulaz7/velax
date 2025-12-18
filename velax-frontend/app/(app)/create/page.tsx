"use client";

import { useState } from "react";
import { useSponsoredTx } from "@/hooks/useSponsoredTx"; // Our custom gasless hook
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, AUCTION_MODULE } from "@/utils/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const executeSponsored = useSponsoredTx();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    price: "1", // Default 1 SUI
  });

  const handleCreate = async () => {
    if (!formData.title || !formData.url)
      return alert("Please fill in all fields");
    setLoading(true);

    try {
      const tx = new Transaction();

      // Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
      const priceInMist = BigInt(parseFloat(formData.price) * 1_000_000_000);
      const durationMs = 24 * 60 * 60 * 1000; // Hardcoded 24 hours for demo

      tx.moveCall({
        target: `${PACKAGE_ID}::${AUCTION_MODULE}::create_auction`,
        arguments: [
          tx.pure.string(formData.title), // Name
          tx.pure.string(formData.description), // Description
          tx.pure.string(formData.url), // Image URL
          tx.pure.u64(durationMs), // Duration
          tx.pure.u64(priceInMist), // Start Price
          tx.object("0x6"), // System Clock
        ],
      });

      // Execute Gasless Transaction
      const res = await executeSponsored(tx);
      console.log("Auction Created!", res);

      // Wait a sec for Indexer to catch up, then go to market
      setTimeout(() => {
        router.push("/market");
      }, 2000);
    } catch (err) {
      console.error("Failed to create auction:", err);
      alert("Creation failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Rocket className="text-blue-600" />
            Create Auction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Item Name</Label>
            <Input
              placeholder="e.g. CyberPunk Ape #402"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              placeholder="Tell the story of this item..."
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              placeholder="https://..."
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Tip: Copy an image address from Google Images or Unsplash for the
              demo.
            </p>
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
              <Input disabled value="24 Hours" />
            </div>
          </div>

          <Button
            className="w-full text-lg font-bold bg-blue-600 hover:bg-blue-700 mt-4"
            size="lg"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : (
              "Mint & List Item"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
