"use client";

import { useState } from "react";
import { useSponsoredTx } from "@/hooks/useSponsoredTx";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Button } from "@/components/ui/button";
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
import { Timer, Gavel, Loader2, Coins, Zap, ExternalLink } from "lucide-react";
import { PACKAGE_ID, AUCTION_MODULE } from "@/utils/constants";
import { toast } from "sonner";
import { Countdown } from "@/components/ui/countdown";

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

      toast.success("Bid Placed Successfully! 🎉", {
        description: (
          <a
            href={`https://suiscan.xyz/testnet/tx/${res.digest}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-500 flex items-center gap-1 mt-1"
          >
            View on SuiScan <ExternalLink className="h-3 w-3" />
          </a>
        ),
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
    <div className="group bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#fff] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
      {/* Image */}
      <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-900 overflow-hidden border-b-2 border-black dark:border-white">
        <img
          src={data.image_url}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Time Badge */}
        <div className="absolute top-3 right-3 bg-black dark:bg-white text-white px-3 py-1.5 rounded-full border-2 border-white dark:border-black font-bold text-sm flex items-center gap-2 shadow-[2px_2px_0px_0px_#fff] dark:shadow-[2px_2px_0px_0px_#000]">
          <Timer size={14} />
          <Countdown targetDate={data.end_time} />
        </div>
        {/* Status Badge */}
        {isEnded && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 rounded-full border-2 border-black font-bold text-sm shadow-[2px_2px_0px_0px_#000]">
            Ended
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-black text-xl text-black dark:text-white truncate mb-1"
          title={data.name}
        >
          {data.name || `Item #${data.auction_id.slice(0, 4)}`}
        </h3>
        <p className="text-sm text-black/60 dark:text-white/60 font-medium truncate mb-4">
          {data.description || "No description"}
        </p>

        {/* Current Bid Box */}
        <div className="bg-blue-100 dark:bg-blue-900/30 border-2 border-black dark:border-white rounded-xl p-4 mb-4 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-black/60 dark:text-white/60 uppercase tracking-wide">
                Current Bid
              </p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Coins className="h-5 w-5" />
                {currentBidSUI.toFixed(2)} SUI
              </p>
            </div>
            <div className="p-2 bg-yellow-300 rounded-xl border-2 border-black">
              <Zap className="h-5 w-5 text-black" />
            </div>
          </div>
        </div>

        {/* Bid Button */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={isEnded}
              className={`w-full h-12 font-black text-base border-2 border-black dark:border-white rounded-xl transition-all ${
                isEnded
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] hover:shadow-[1px_1px_0px_0px_#000] dark:hover:shadow-[1px_1px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px]"
              }`}
            >
              {isEnded ? (
                "Auction Ended"
              ) : (
                <>
                  <Gavel size={18} className="mr-2" /> Place Bid
                </>
              )}
            </Button>
          </DialogTrigger>

          {/* Modal Content */}
          <DialogContent className="sm:max-w-md border-4 border-black dark:border-white rounded-2xl shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#fff] bg-white dark:bg-black">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-black dark:text-white">
                Place a Bid
              </DialogTitle>
              <DialogDescription className="text-black/60 dark:text-white/60 font-medium">
                You are bidding on{" "}
                <strong className="text-black dark:text-white">
                  {data.name}
                </strong>
                . Refunds are instant if you are outbid.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Item Preview */}
              <div className="flex items-center gap-4 p-3 bg-gray-100 dark:bg-gray-900 border-2 border-black dark:border-white rounded-xl">
                <img
                  src={data.image_url}
                  alt={data.name}
                  className="w-16 h-16 object-cover rounded-lg border-2 border-black dark:border-white"
                />
                <div>
                  <p className="font-bold text-black dark:text-white">
                    {data.name}
                  </p>
                  <p className="text-sm text-black/60 dark:text-white/60">
                    Current: {currentBidSUI.toFixed(2)} SUI
                  </p>
                </div>
              </div>

              {/* Bid Input */}
              <div className="space-y-2">
                <Label className="font-bold text-black dark:text-white">
                  Your Bid Amount (SUI)
                </Label>
                <Input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  step="0.1"
                  min={minBidSUI}
                  className="h-14 text-xl font-bold border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] bg-yellow-100 dark:bg-yellow-900/30"
                />
                <p className="text-sm font-bold text-black/60 dark:text-white/60">
                  Minimum required: {minBidSUI.toFixed(2)} SUI
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-green-100 dark:bg-green-900/30 border-2 border-black dark:border-white rounded-xl p-3">
                <p className="text-sm font-bold text-black/70 dark:text-white/70">
                  ⚡{" "}
                  <span className="text-green-600 dark:text-green-400">
                    Instant Refund:
                  </span>{" "}
                  If someone outbids you, your SUI is returned automatically!
                </p>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="font-bold border-2 border-black dark:border-white rounded-xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:shadow-[1px_1px_0px_0px_#000] dark:hover:shadow-[1px_1px_0px_0px_#fff] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBid}
                disabled={loading}
                className="font-black bg-blue-500 hover:bg-blue-600 text-white border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] hover:shadow-[1px_1px_0px_0px_#000] dark:hover:shadow-[1px_1px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex-1"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Gavel className="mr-2 h-4 w-4" />
                )}
                Confirm Bid
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
