"use client";

import { useSponsoredTx } from "@/hooks/useSponsoredTx"; // Use our custom hook
import { Transaction } from "@mysten/sui/transactions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Gavel } from "lucide-react";
import { PACKAGE_ID } from "@/utils/constants"; // We'll create this file next
import Image from "next/image";

interface AuctionProps {
  auction_id: string;
  seller: string;
  image_url: string;
  end_time: number;
  highest_bid: number;
}

export function AuctionCard({ auction: data }: { auction: AuctionProps }) {
  const executeSponsored = useSponsoredTx();

  const handleBid = async () => {
    try {
      const tx = new Transaction();

      // 1. Calculate Bid Amount (Current Bid + 1 SUI)
      // Note: In production, check the real on-chain bid first.
      const bidAmount = BigInt(data.highest_bid) + BigInt(1_000_000_000); // +1 SUI

      // 2. Split coins for the bid
      const [coin] = tx.splitCoins(tx.gas, [bidAmount]);

      // 3. Call the Move Contract
      tx.moveCall({
        target: `${PACKAGE_ID}::auction::place_bid`,
        arguments: [
          tx.object(data.auction_id), // The Auction Object
          coin, // The Payment
          tx.object("0x6"), // The Clock
        ],
      });

      // 4. Sponsor & Execute
      const res = await executeSponsored(tx);
      alert(`Bid Placed! Digest: ${res.digest.slice(0, 10)}...`);
    } catch (err) {
      console.error("Bid Failed:", err);
      alert("Bid failed. See console.");
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800">
      {/* Image Section */}
      <div className="relative aspect-square w-full bg-slate-100">
        {data.image_url ? (
          <img
            src={data.image_url}
            alt="NFT"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            No Image
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white border-0">
          <Timer size={14} className="mr-1" />
          {new Date(data.end_time).toLocaleDateString()}
        </Badge>
      </div>

      {/* Info Section */}
      <CardHeader className="p-4 pb-2">
        <h3 className="font-bold text-lg truncate">
          Velax Item #{data.auction_id.slice(0, 4)}
        </h3>
        <p className="text-xs text-muted-foreground truncate">
          Seller: {data.seller}
        </p>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="flex justify-between items-end mt-2">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase">
              Current Bid
            </p>
            <p className="text-xl font-bold text-blue-600">
              {(Number(data.highest_bid) / 1_000_000_000).toFixed(2)} SUI
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button onClick={handleBid} className="w-full font-bold gap-2">
          <Gavel size={16} />
          Place Bid (Instant Refund)
        </Button>
      </CardFooter>
    </Card>
  );
}
