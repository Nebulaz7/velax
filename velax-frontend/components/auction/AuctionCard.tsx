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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Timer, Gavel, Loader2, RefreshCcw } from "lucide-react";
import { PACKAGE_ID, AUCTION_MODULE } from "@/utils/constants";
import { toast } from "sonner";

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
  const [isOpen, setIsOpen] = useState(false); // Controls the modal

  // Math: Calculate Minimum Bid (Current + 0.1 SUI)
  const currentBidSUI = Number(data.highest_bid) / 1_000_000_000;
  const minBidSUI = currentBidSUI + 0.1;

  // State for the user's input (Initialize with min bid)
  const [bidAmount, setBidAmount] = useState<string>(minBidSUI.toString());

  const handleBid = async () => {
    if (!account) return alert("Please connect wallet first");

    // VALIDATION: Ensure bid is high enough
    const bidValue = parseFloat(bidAmount);
    if (isNaN(bidValue) || bidValue < minBidSUI) {
      toast.error(`Minimum bid is ${minBidSUI} SUI`, {
        description: "Bid too low",
      });
      return;
    }

    setLoading(true);

    try {
      const tx = new Transaction();

      // Convert User Input to MIST
      const bidAmountMist = BigInt(Math.floor(bidValue * 1_000_000_000));

      // 1. Find User's Coin
      const { data: coins } = await client.getCoins({
        owner: account.address,
        coinType: "0x2::sui::SUI",
      });

      // Find coin with enough balance
      const paymentCoin = coins.find((c) => BigInt(c.balance) >= bidAmountMist);

      if (!paymentCoin) {
        throw new Error(
          `Insufficient Balance. You need ${bidValue} SUI in a single coin.`
        );
      }

      // 2. Split Coin
      const [bidPayment] = tx.splitCoins(tx.object(paymentCoin.coinObjectId), [
        tx.pure.u64(bidAmountMist),
      ]);

      // 3. Move Call
      tx.moveCall({
        target: `${PACKAGE_ID}::${AUCTION_MODULE}::place_bid`,
        arguments: [tx.object(data.auction_id), bidPayment, tx.object("0x6")],
      });

      // 4. Execute
      const res = await executeSponsored(tx);

      toast.success("Bid Placed! 🚀", {
        description: `You bid ${bidValue} SUI`,
      });
      console.log("Digest:", res.digest);

      setIsOpen(false); // Close modal
      setTimeout(() => window.location.reload(), 2000); // Refresh
    } catch (err: any) {
      console.error("Bid Failed:", err);
      toast.error("Error", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const isEnded = Date.now() > data.end_time;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800">
      {/* Image & Header (Same as before) */}
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
        <h3 className="font-bold text-lg truncate" title={data.name}>
          {data.name || `Item #${data.auction_id.slice(0, 4)}`}
        </h3>
        <p className="text-xs text-muted-foreground truncate">
          {data.description || "No description"}
        </p>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="flex justify-between items-end bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase">
              Current Bid
            </p>
            <p className="text-xl font-bold text-blue-600">
              {currentBidSUI.toFixed(2)} SUI
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {/* --- MODAL TRIGGER --- */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={isEnded}
              className={`w-full font-bold gap-2 ${
                isEnded ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isEnded ? (
                "Auction Ended"
              ) : (
                <>
                  <Gavel size={16} /> Place Bid
                </>
              )}
            </Button>
          </DialogTrigger>

          {/* --- MODAL CONTENT --- */}
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Place a Bid</DialogTitle>
              <DialogDescription>
                You are bidding on <strong>{data.name}</strong>. Refunds are
                instant if you are outbid.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Your Bid Amount (SUI)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    step="0.1"
                    min={minBidSUI}
                    className="pl-8 font-mono text-lg"
                  />
                  <span className="absolute left-3 top-2.5 text-muted-foreground">
                    $
                  </span>
                </div>
                <p className="text-xs text-muted-foreground text-right">
                  Minimum required: {minBidSUI.toFixed(2)} SUI
                </p>
              </div>
            </div>

            <DialogFooter className="flex-col sm:justify-between gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleBid}
                disabled={loading}
                className="bg-blue-600 font-bold w-full sm:w-auto"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  "Confirm Bid"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
