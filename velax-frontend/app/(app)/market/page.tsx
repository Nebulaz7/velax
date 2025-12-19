"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { AuctionCard } from "@/components/auction/AuctionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Gavel, Flame, Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MotionDiv = motion.div;

const MarketPage = () => {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("auctions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching auctions:", error);
    else setAuctions(data || []);

    setLoading(false);
  };

  const filteredAuctions = auctions.filter(
    (auction) =>
      auction.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeAuctions = filteredAuctions.filter(
    (a) => Date.now() < a.end_time
  );
  const endedAuctions = filteredAuctions.filter(
    (a) => Date.now() >= a.end_time
  );

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
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-black dark:border-white px-4 py-2 text-sm font-bold mb-4 bg-green-300 text-black shadow-[4px_4px_0px_0px_#000]">
                <Flame className="h-4 w-4" />
                Live Marketplace
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-2">
                Live Auctions
              </h1>
              <p className="text-lg text-black/60 dark:text-white/60 font-medium">
                Bid on unique items with instant refunds
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
              <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-xl p-4 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
                <p className="text-3xl font-black text-blue-500">
                  {activeAuctions.length}
                </p>
                <p className="text-sm font-bold text-black/60 dark:text-white/60">
                  Active
                </p>
              </div>
              <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-xl p-4 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
                <p className="text-3xl font-black text-purple-500">
                  {auctions.length}
                </p>
                <p className="text-sm font-bold text-black/60 dark:text-white/60">
                  Total
                </p>
              </div>
            </div>
          </div>
        </MotionDiv>

        {/* Search & Refresh Bar */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40 dark:text-white/40" />
              <Input
                placeholder="Search auctions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 text-lg font-medium border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] bg-white dark:bg-black"
              />
            </div>
            <Button
              onClick={fetchAuctions}
              className="h-14 px-6 font-black bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh
            </Button>
          </div>
        </MotionDiv>

        {/* Active Auctions */}
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-300 rounded-xl border-2 border-black dark:border-white">
              <Gavel className="h-5 w-5 text-black" />
            </div>
            <h2 className="text-2xl font-black text-black dark:text-white">
              Active Auctions
            </h2>
            <span className="ml-auto bg-green-300 text-black font-bold px-3 py-1 rounded-full border-2 border-black text-sm">
              {activeAuctions.length} live
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-[420px] bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] animate-pulse"
                />
              ))}
            </div>
          ) : activeAuctions.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
              <Gavel className="h-16 w-16 mx-auto text-black/20 dark:text-white/20 mb-4" />
              <p className="text-xl font-bold text-black/60 dark:text-white/60">
                No active auctions found
              </p>
              <p className="text-black/40 dark:text-white/40 font-medium mt-2">
                Check back later or create your own!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeAuctions.map((auction, index) => (
                <MotionDiv
                  key={auction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <AuctionCard auction={auction} />
                </MotionDiv>
              ))}
            </div>
          )}
        </MotionDiv>

        {/* Ended Auctions */}
        {endedAuctions.length > 0 && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-300 rounded-xl border-2 border-black dark:border-white">
                <Gavel className="h-5 w-5 text-black" />
              </div>
              <h2 className="text-2xl font-black text-black dark:text-white">
                Ended Auctions
              </h2>
              <span className="ml-auto bg-gray-300 text-black font-bold px-3 py-1 rounded-full border-2 border-black text-sm">
                {endedAuctions.length} ended
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-70">
              {endedAuctions.map((auction, index) => (
                <MotionDiv
                  key={auction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <AuctionCard auction={auction} />
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>
        )}
      </div>
    </div>
  );
};

export default MarketPage;
