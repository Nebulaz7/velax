"use client";

import { useEffect, useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { supabase } from "@/utils/supabase/client";
import { Transaction } from "@mysten/sui/transactions";

export default function Dashboard() {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [myListings, setMyListings] = useState<any[]>([]);
  const [myOrders, setMyOrders] = useState<any[]>([]); // Items I bought but haven't confirmed
  const [loading, setLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    if (!account) return;

    async function fetchData() {
      // 1. Fetch My Listings (I am the seller)
      const { data: listings } = await supabase
        .from("items")
        .select("*")
        .eq("seller", account!.address);

      // 2. Fetch My Orders (I am the buyer, but status is not complete)
      // Note: We need to update our Indexer to track 'ItemSold' events to fill a 'buyer' column in Supabase
      // For now, we can query on-chain or assume Supabase has a 'buyer' column updated by the indexer.
      // *Hackathon Shortcut:* Just fetch everything and filter in JS if Supabase isn't perfect yet.
      const { data: orders } = await supabase
        .from("items")
        .select("*")
        .eq("status", "sold"); // In a real app, filter by buyer address

      setMyListings(listings || []);
      setMyOrders(orders || []); // Filter this by 'buyer' if you added that column
      setLoading(false);
    }

    fetchData();
  }, [account]);

  // ACTION: Confirm Item (Releases funds to seller)
  async function handleConfirm(listingId: string) {
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::${process.env.NEXT_PUBLIC_MODULE}::confirm_item`,
        arguments: [tx.object(listingId)],
      });

      await signAndExecute({ transaction: tx });
      alert("Funds released to seller!");
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Failed to confirm.");
    }
  }

  if (!account) return <div className="p-20 text-center">Please log in.</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* SECTION 1: ITEMS I BOUGHT (Escrow Actions) */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          📦 Incoming Orders{" "}
          <span className="text-sm bg-yellow-100 text-yellow-800 px-2 rounded">
            Action Required
          </span>
        </h2>
        {myOrders.length === 0 ? (
          <p className="text-gray-500">No active orders.</p>
        ) : (
          <div className="grid gap-4">
            {myOrders.map((item) => (
              <div
                key={item.id}
                className="border p-4 rounded-lg flex justify-between items-center bg-yellow-50 dark:bg-yellow-900/20"
              >
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm">Waiting for you to confirm receipt.</p>
                </div>
                <button
                  onClick={() => handleConfirm(item.sui_object_id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Confirm Receipt & Release Funds
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: MY LISTINGS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">My Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {myListings.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl p-4 dark:border-gray-700"
            >
              <img
                src={`https://aggregator.walrus-testnet.walrus.space/v1/${item.blob_id}`}
                className="h-32 w-full object-cover rounded-lg mb-3"
              />
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                Price: {(item.price / 1e9).toFixed(2)} SUI
              </p>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  item.status === "listed"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100"
                }`}
              >
                {item.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
