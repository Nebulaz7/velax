"use client";

import { useState } from "react";
import { useSponsoredTx } from "@/hooks/useSponsoredTx";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Gavel, Loader2, RefreshCcw } from "lucide-react";
import { PACKAGE_ID, AUCTION_MODULE } from "@/utils/constants";
import { toast } from "sonner"; // Changed from default import to named import

interface AuctionProps {
  auction_id: string;
  seller: string;
  name: string;
  description: string;
  image_url: string;
  end_time: number;
  highest_bid: number; // MIST
}

export function AuctionCard({ auction: data }: { auction: AuctionProps }) {
  const executeSponsored = useSponsoredTx();
  const client = useSuiClient();
  const account = useCurrentAccount();
  const [loading, setLoading] = useState(false);

  // 1. Calculate Minimum Bid (Current + 0.1 SUI)
  const minBidMist = BigInt(data.highest_bid) + BigInt(100_000_000); // +0.1 SUI
  const displayPrice = Number(data.highest_bid) / 1_000_000_000;

  const handleBid = async () => {
    if (!account) return alert("Please connect wallet first");
    setLoading(true);

    try {
      const tx = new Transaction();

      // 2. Find a suitable coin to pay with
      // We cannot use tx.gas because that is the Sponsor's coin!
      const { data: coins } = await client.getCoins({
        owner: account.address,
        coinType: "0x2::sui::SUI",
      });

      // Simple strategy: Find the first coin with enough balance
      // (In production, you'd merge coins here if needed)
      const paymentCoin = coins.find((c) => BigInt(c.balance) >= minBidMist);

      if (!paymentCoin) {
        throw new Error(
          `Insufficient Balance. You need ${(Number(minBidMist) / 1e9).toFixed(
            2
          )} SUI in a single coin.`
        );
      }

      // 3. Add the user's coin to the transaction
      // We perform a "Split" on this specific coin object
      const [bidPayment] = tx.splitCoins(tx.object(paymentCoin.coinObjectId), [
        tx.pure.u64(minBidMist),
      ]);

      // 4. Call the Move Contract
      tx.moveCall({
        target: `${PACKAGE_ID}::${AUCTION_MODULE}::place_bid`,
        arguments: [
          tx.object(data.auction_id), // The Auction
          bidPayment, // The Money (Split from user's coin)
          tx.object("0x6"), // The Clock
        ],
      });

      // 5. Execute Gasless
      const res = await executeSponsored(tx);

      toast.success(`Bid Placed! 🚀 You are now winning: ${data.name}`, {
        position: "top-center",
        duration: 3000,
      });
      console.log("Bid Digest:", res.digest);

      // Reload page after a delay to show new price
      setTimeout(() => window.location.reload(), 2000);
    } catch (err: any) {
      console.error("Bid Failed:", err);
      toast.error(err.message || "Unknown error", {
        position: "top-center",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const isEnded = Date.now() > data.end_time;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800">
      <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-900 group">
        <img
          src={data.image_url}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white border-0">
          <Timer size={14} className="mr-1" />
          {new Date(data.end_time).toLocaleDateString()}
        </Badge>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <h3
              className="font-bold text-lg truncate w-full"
              title={data.name || "Item"}
            >
              {data.name || `Item #${data.auction_id.slice(0, 4)}`}
            </h3>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
              {data.description || "No description"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="flex justify-between items-end bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase">
              Current Bid
            </p>
            <p className="text-xl font-bold text-blue-600">
              {displayPrice.toFixed(2)} SUI
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">Min Bid</p>
            <p className="text-sm font-medium">
              {(Number(minBidMist) / 1e9).toFixed(2)} SUI
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleBid}
          disabled={loading || isEnded}
          className={`w-full font-bold gap-2 ${
            isEnded ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : isEnded ? (
            "Auction Ended"
          ) : (
            <>
              <Gavel size={16} />
              Place Bid
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
