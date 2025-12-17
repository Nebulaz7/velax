"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import LoginButton from "./components/LoginButton"; // The button we made earlier
import BuyButton from "./components/BuyButton";
import { useCurrentAccount } from "@mysten/dapp-kit";
import Link from "next/link";

// 1. Define the shape of our data
type Item = {
  id: number;
  title: string;
  price: number;
  blob_id: string; // The Walrus Image ID
  seller: string;
  status: string;
  sui_object_id: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const account = useCurrentAccount();

  // 2. Fetch Data from Supabase
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .eq("status", "listed") // Only show listed items
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching items:", error);
        } else {
          setItems(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* --- NAVBAR --- */}
      <nav className="border-b bg-white dark:bg-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Velax
        </h1>

        <div className="flex gap-4 items-center">
          {/* Only show 'Sell Item' if logged in */}
          {account && (
            <Link
              href="/create"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Sell Item
            </Link>
          )}

          {/* Our Smart Login Button (Google + Wallet) */}
          <LoginButton />
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
          The Campus Marketplace
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Buy and sell textbooks, gear, and furniture securely. <br />
          Powered by <span className="text-blue-500 font-bold">Sui</span> &{" "}
          <span className="text-purple-500 font-bold">Walrus</span>.
        </p>
      </section>

      {/* --- MARKETPLACE GRID --- */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          /* Actual Items */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 flex flex-col"
              >
                {/* WALRUS IMAGE SOURCE */}
                {/* This URL fetches the raw image file directly from the decentralized network */}
                <div className="relative h-48 overflow-hidden bg-gray-100 border-b dark:border-gray-700">
                  <img
                    src={`https://aggregator.walrus-testnet.walrus.space/v1/${item.blob_id}`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback in case Walrus is verifying the blob
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x300?text=Image+Loading...";
                    }}
                  />
                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                    {(item.price / 1_000_000_000).toFixed(1)} SUI
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate mb-1">
                    {item.title || "Untitled Item"}
                  </h3>

                  <p className="text-xs text-gray-500 mb-4 font-mono truncate">
                    Seller: {item.seller.slice(0, 6)}...{item.seller.slice(-4)}
                  </p>

                  <div className="mt-auto">
                    {/* Pass the item data to the button */}
                    <BuyButton
                      listingId={item.sui_object_id}
                      price={item.price}
                      onSuccess={() => alert("Check your dashboard!")}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 text-lg">No items found yet.</p>
            {account ? (
              <Link
                href="/create"
                className="text-blue-500 font-bold hover:underline mt-2 inline-block"
              >
                Be the first to list something!
              </Link>
            ) : (
              <p className="text-sm text-gray-400 mt-2">
                Log in to list an item.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
