"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase"; // We'll make this helper in a sec
import { AuctionCard } from "@/components/auction/AuctionCard";
import { Skeleton } from "@/components/ui/skeleton";

const MarketPage = () => {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    const { data, error } = await supabase
      .from("auctions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching auctions:", error);
    else setAuctions(data || []);

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Live Auctions</h1>
        <span className="text-muted-foreground text-sm">
          {auctions.length} items active
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {auctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketPage;
