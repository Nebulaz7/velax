"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import LoginButton from "./components/LoginButton";
import { useCurrentAccount } from "@mysten/dapp-kit";

// Type definition for our data
type Item = {
  id: number;
  title: string;
  price: number;
  blob_id: string;
  seller: string;
  status: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const account = useCurrentAccount();

  // 1. Fetch Data from Supabase
  useEffect(() => {
    const fetchItems = async () => {
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
      setLoading(false);
    };

    fetchItems();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="border-b bg-white dark:bg-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-purple-500">
          Velax
        </h1>
        <div className="flex gap-4 items-center">
          {account && (
            <a
              href="/create"
              className="text-sm font-medium hover:underline text-gray-600 dark:text-gray-300"
            >
              + Sell Item
            </a>
          )}

          {/* The New Button handles both Google and Wallet connections */}
          <LoginButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          The Campus Marketplace
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Buy and sell textbooks, gear, and furniture securely. Powered by{" "}
          <span className="text-blue-500 font-bold">Sui</span> &{" "}
          <span className="text-purple-500 font-bold">Walrus</span>.
        </p>
      </section>

      {/* The Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
              >
                {/* WALRUS IMAGE SOURCE */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={`https://aggregator.walrus-testnet.walrus.space/v1/${item.blob_id}`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback if Walrus is slow
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400x300?text=Walrus+Loading...";
                    }}
                  />
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                      {item.title || "Untitled Item"}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                      {(item.price / 1_000_000_000).toFixed(1)} SUI
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-4 truncate">
                    Seller: {item.seller.slice(0, 6)}...{item.seller.slice(-4)}
                  </p>

                  <button
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    onClick={() =>
                      alert(`Buying functionality coming in Day 4!`)
                    }
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">
              No items found. Be the first to list something!
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
