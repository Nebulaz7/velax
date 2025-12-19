"use client";

import { useEffect, useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSponsoredTx } from "@/hooks/useSponsoredTx";
import { Transaction } from "@mysten/sui/transactions";
import { createClient } from "@/lib/supabase";
import { PACKAGE_ID, AUCTION_MODULE } from "@/utils/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Coins, Trophy } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const account = useCurrentAccount();
  const executeSponsored = useSponsoredTx();
  const supabase = createClient();

  const [myListings, setMyListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    if (account) fetchDashboardData();
  }, [account]);

  const fetchDashboardData = async () => {
    if (!account) return;

    // Fetch listings created by me
    const { data } = await supabase
      .from("auctions")
      .select("*")
      .eq("seller", account.address)
      .order("created_at", { ascending: false });

    setMyListings(data || []);
    setLoading(false);
  };

  const handleClaim = async (auction: any) => {
    setClaimingId(auction.auction_id);

    try {
      const tx = new Transaction();

      // Call 'end_auction' to distribute funds/NFT
      tx.moveCall({
        target: `${PACKAGE_ID}::${AUCTION_MODULE}::end_auction`,
        // ...existing code...
        arguments: [
          tx.object(auction.auction_id),
          tx.object("0x6"), // Clock
        ],
      });

      const res = await executeSponsored(tx);
      console.log("Claim Digest:", res.digest);

      toast.success("Funds Claimed! 💰", {
        description: "The auction is settled. Check your wallet.",
      });

      // Update UI: Mark locally as inactive or re-fetch
      fetchDashboardData();
    } catch (err: any) {
      console.error("Claim Failed:", err);
      toast.error("Error", {
        description: err.message,
      });
    } finally {
      setClaimingId(null);
    }
  };
  // ...existing code...

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Please Connect Wallet</h2>
        <p className="text-muted-foreground">
          You need to sign in to view your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <Tabs defaultValue="listings">
        <TabsList>
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="wins">My Wins (Coming Soon)</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              myListings.map((item) => {
                const isEnded = Date.now() > item.end_time;
                const hasBids = item.highest_bid > 0;

                return (
                  <Card
                    key={item.id}
                    className="border-slate-200 dark:border-slate-800"
                  >
                    <div className="aspect-video w-full bg-slate-100 relative">
                      <img
                        src={item.image_url}
                        className="w-full h-full object-cover"
                      />
                      {isEnded && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
                          ENDED
                        </div>
                      )}
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="truncate text-lg">
                        {item.name || "Item"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Highest Bid:
                        </span>
                        <span className="font-bold text-blue-600">
                          {(item.highest_bid / 1e9).toFixed(2)} SUI
                        </span>
                      </div>

                      {/* CLAIM BUTTON LOGIC */}
                      {isEnded ? (
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => handleClaim(item)}
                          disabled={!!claimingId}
                        >
                          {claimingId === item.auction_id ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            "Claim Funds"
                          )}
                        </Button>
                      ) : (
                        <Button variant="secondary" className="w-full" disabled>
                          Auction Active
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}

            {!loading && myListings.length === 0 && (
              <p className="text-muted-foreground col-span-3 text-center py-10">
                You haven't listed any auctions yet.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
