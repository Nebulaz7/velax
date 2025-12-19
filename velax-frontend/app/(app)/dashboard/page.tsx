"use client";

import { useEffect, useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSponsoredTx } from "@/hooks/useSponsoredTx";
import { Transaction } from "@mysten/sui/transactions";
import { createClient } from "@/lib/supabase";
import { PACKAGE_ID, AUCTION_MODULE } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Coins,
  Trophy,
  Package,
  ShoppingBag,
  ExternalLink,
  Gavel,
  Clock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import { Countdown } from "@/components/ui/countdown";

const MotionDiv = motion.div;

export default function DashboardPage() {
  const account = useCurrentAccount();
  const executeSponsored = useSponsoredTx();
  const supabase = createClient();

  const [myListings, setMyListings] = useState<any[]>([]);
  const [myWins, setMyWins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    if (account) fetchDashboardData();
  }, [account]);

  const fetchDashboardData = async () => {
    if (!account) return;

    // 1. My Listings
    const { data: listings } = await supabase
      .from("auctions")
      .select("*")
      .eq("seller", account.address)
      .order("created_at", { ascending: false });

    // 2. My Wins (Auctions where I am the high bidder AND it has ended)
    const { data: wins } = await supabase
      .from("auctions")
      .select("*")
      .eq("highest_bidder", account.address)
      .order("created_at", { ascending: false });

    setMyListings(listings || []);
    setMyWins(wins || []);
    setLoading(false);
  };

  const handleClaim = async (auction: any) => {
    setClaimingId(auction.auction_id);

    try {
      const tx = new Transaction();

      // Call 'end_auction' to distribute funds/NFT
      tx.moveCall({
        target: `${PACKAGE_ID}::${AUCTION_MODULE}::end_auction`,
        arguments: [
          tx.object(auction.auction_id),
          tx.object("0x6"), // Clock
        ],
      });

      const res = await executeSponsored(tx);
      console.log("Claim Digest:", res.digest);

      toast.success("Claimed Successfully! 🎉", {
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

      // Update UI: Mark locally as inactive or re-fetch
      fetchDashboardData();
    } catch (err: any) {
      console.error("Claim Failed:", err);
      toast.error("Claim Failed", {
        description: err.message,
      });
    } finally {
      setClaimingId(null);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-[#FFFEF9] dark:bg-[#0a0a0a] flex items-center justify-center px-4">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white dark:bg-black border-4 border-black dark:border-white rounded-2xl p-10 shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#fff] max-w-md"
        >
          <div className="p-4 bg-yellow-300 rounded-2xl border-2 border-black inline-block mb-6">
            <Gavel className="h-12 w-12 text-black" />
          </div>
          <h2 className="text-3xl font-black text-black dark:text-white mb-3">
            Connect Your Wallet
          </h2>
          <p className="text-black/60 dark:text-white/60 font-medium mb-6">
            Sign in with Google to view your dashboard, listings, and wins.
          </p>
          <div className="bg-blue-100 dark:bg-blue-900/30 border-2 border-black dark:border-white rounded-xl p-4">
            <p className="text-sm font-bold text-black/70 dark:text-white/70">
              ⚡ Powered by zkLogin — No wallet extension needed!
            </p>
          </div>
        </MotionDiv>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFEF9] dark:bg-[#0a0a0a] mt-20 mx-4 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-black dark:border-white px-4 py-2 text-sm font-bold mb-4 bg-purple-300 text-black shadow-[4px_4px_0px_0px_#000]">
                <Package className="h-4 w-4" />
                Your Activity
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-2">
                Dashboard
              </h1>
              <p className="text-lg text-black/60 dark:text-white/60 font-medium">
                Manage your listings and claim your wins
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
              <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-xl p-4 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
                <p className="text-3xl font-black text-blue-500">
                  {myListings.length}
                </p>
                <p className="text-sm font-bold text-black/60 dark:text-white/60">
                  Listings
                </p>
              </div>
              <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-xl p-4 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
                <p className="text-3xl font-black text-green-500">
                  {myWins.length}
                </p>
                <p className="text-sm font-bold text-black/60 dark:text-white/60">
                  Wins
                </p>
              </div>
            </div>
          </div>
        </MotionDiv>

        {/* Tabs */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-xl p-1 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
            <TabsTrigger
              value="listings"
              className="font-bold rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-none px-6 py-2"
            >
              <Package className="h-4 w-4 mr-2" />
              My Listings
            </TabsTrigger>
            <TabsTrigger
              value="wins"
              className="font-bold rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-none px-6 py-2"
            >
              <Trophy className="h-4 w-4 mr-2" />
              My Wins
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: LISTINGS */}
          <TabsContent value="listings" className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl p-8 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                  <p className="mt-4 font-bold text-black/60 dark:text-white/60">
                    Loading your listings...
                  </p>
                </div>
              </div>
            ) : myListings.length === 0 ? (
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]"
              >
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl border-2 border-black dark:border-white inline-block mb-6">
                  <Package className="h-16 w-16 text-blue-500" />
                </div>
                <h3 className="text-2xl font-black text-black dark:text-white mb-2">
                  No Listings Yet
                </h3>
                <p className="text-black/60 dark:text-white/60 font-medium mb-6 max-w-md mx-auto">
                  You haven&apos;t created any auctions yet. Start selling your
                  items and earn SUI!
                </p>
                <Link href="/create">
                  <Button className="h-14 px-8 font-black bg-blue-500 hover:bg-blue-600 text-white border-2 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                    Create Your First Auction
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </MotionDiv>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((item, index) => {
                  const isEnded = Date.now() > item.end_time;
                  const hasBids = item.highest_bid > 0;

                  return (
                    <MotionDiv
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#fff] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                    >
                      {/* Image */}
                      <div className="relative aspect-video w-full bg-gray-100 dark:bg-gray-900 border-b-2 border-black dark:border-white">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {isEnded ? (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-full border-2 border-black font-bold text-sm shadow-[2px_2px_0px_0px_#000]">
                            Ended
                          </div>
                        ) : (
                          <div className="absolute top-3 right-3 bg-green-400 text-black px-3 py-1.5 rounded-full border-2 border-black font-bold text-sm shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <Countdown targetDate={item.end_time} />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-black text-lg text-black dark:text-white truncate mb-3">
                          {item.name || "Untitled Item"}
                        </h3>

                        {/* Bid Info */}
                        <div className="bg-blue-100 dark:bg-blue-900/30 border-2 border-black dark:border-white rounded-xl p-3 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-black/60 dark:text-white/60">
                              Highest Bid
                            </span>
                            <span className="text-xl font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
                              <Coins className="h-4 w-4" />
                              {(item.highest_bid / 1e9).toFixed(2)} SUI
                            </span>
                          </div>
                        </div>

                        {/* Claim Button */}
                        {isEnded ? (
                          hasBids ? (
                            <Button
                              onClick={() => handleClaim(item)}
                              disabled={!!claimingId}
                              className="w-full h-12 font-black bg-green-500 hover:bg-green-600 text-white border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] hover:shadow-[1px_1px_0px_0px_#000] dark:hover:shadow-[1px_1px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                              {claimingId === item.auction_id ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <>
                                  <Coins className="h-5 w-5 mr-2" />
                                  Claim Funds
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              disabled
                              className="w-full h-12 font-bold bg-gray-300 text-gray-600 border-2 border-black rounded-xl cursor-not-allowed"
                            >
                              No Bids Received
                            </Button>
                          )
                        ) : (
                          <Button
                            disabled
                            className="w-full h-12 font-bold bg-yellow-300 text-black border-2 border-black rounded-xl cursor-not-allowed"
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Auction Active
                          </Button>
                        )}
                      </div>
                    </MotionDiv>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* TAB 2: MY WINS */}
          <TabsContent value="wins" className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl p-8 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
                  <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto" />
                  <p className="mt-4 font-bold text-black/60 dark:text-white/60">
                    Loading your wins...
                  </p>
                </div>
              </div>
            ) : myWins.length === 0 ? (
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]"
              >
                <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-2xl border-2 border-black dark:border-white inline-block mb-6">
                  <Trophy className="h-16 w-16 text-green-500" />
                </div>
                <h3 className="text-2xl font-black text-black dark:text-white mb-2">
                  No Wins Yet
                </h3>
                <p className="text-black/60 dark:text-white/60 font-medium mb-6 max-w-md mx-auto">
                  You haven&apos;t won any auctions yet. Browse the marketplace
                  and start bidding!
                </p>
                <Link href="/market">
                  <Button className="h-14 px-8 font-black bg-green-500 hover:bg-green-600 text-white border-2 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Browse Market
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </MotionDiv>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myWins.map((item, index) => {
                  const isEnded = Date.now() > item.end_time;

                  return (
                    <MotionDiv
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="bg-white dark:bg-black border-2 border-green-500 rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#22c55e] hover:shadow-[6px_6px_0px_0px_#22c55e] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                    >
                      {/* Image */}
                      <div className="relative aspect-video w-full bg-gray-100 dark:bg-gray-900 border-b-2 border-green-500">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1.5 rounded-full border-2 border-black font-bold text-sm shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          WINNING
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-black text-lg text-black dark:text-white truncate mb-3">
                          {item.name || "Untitled Item"}
                        </h3>

                        {/* Bid Info */}
                        <div className="bg-green-100 dark:bg-green-900/30 border-2 border-green-500 rounded-xl p-3 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-black/60 dark:text-white/60">
                              Your Bid
                            </span>
                            <span className="text-xl font-black text-green-600 dark:text-green-400 flex items-center gap-1">
                              <Coins className="h-4 w-4" />
                              {(item.highest_bid / 1e9).toFixed(2)} SUI
                            </span>
                          </div>
                        </div>

                        {/* Claim Button */}
                        {isEnded ? (
                          <Button
                            onClick={() => handleClaim(item)}
                            disabled={!!claimingId}
                            className="w-full h-12 font-black bg-blue-500 hover:bg-blue-600 text-white border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] hover:shadow-[1px_1px_0px_0px_#000] dark:hover:shadow-[1px_1px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                          >
                            {claimingId === item.auction_id ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <>🎁 Claim Your NFT</>
                            )}
                          </Button>
                        ) : (
                          <div className="space-y-2">
                            <Button
                              disabled
                              className="w-full h-12 font-bold bg-yellow-300 text-black border-2 border-black rounded-xl cursor-not-allowed"
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              Ends in: <Countdown targetDate={item.end_time} />
                            </Button>
                            <p className="text-xs text-center text-black/50 dark:text-white/50 font-medium">
                              You can claim after the auction ends
                            </p>
                          </div>
                        )}
                      </div>
                    </MotionDiv>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
