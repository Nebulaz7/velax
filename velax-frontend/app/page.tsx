"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, Gavel } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-600 text-white hover:bg-blue-700 mb-6">
          Now Live on Sui Testnet
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mb-6">
          Fair Auctions with <br />
          <span className="text-blue-600">Instant Refunds.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-10">
          The first decentralized marketplace where losing bidders get refunded
          instantly in the same transaction block. No locking funds, no waiting.
        </p>
        <div className="flex gap-4">
          <Link href="/market">
            <Button
              size="lg"
              className="h-12 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-700"
            >
              Start Bidding <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/create">
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
              List an Item
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto py-20 px-4 grid md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-2xl bg-slate-50 dark:bg-slate-900">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600">
            <Zap size={32} />
          </div>
          <h3 className="text-xl font-bold">Instant Refunds</h3>
          <p className="text-muted-foreground">
            Outbid? Get your funds back immediately. Our smart contract
            processes refunds in the same transaction block.
          </p>
        </div>

        <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-2xl bg-slate-50 dark:bg-slate-900">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600">
            <Gavel size={32} />
          </div>
          <h3 className="text-xl font-bold">Gasless Bidding</h3>
          <p className="text-muted-foreground">
            Powered by Enoki. Experience Web3 without needing to hold SUI for
            gas fees. Just sign and bid.
          </p>
        </div>

        <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-2xl bg-slate-50 dark:bg-slate-900">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold">Fair & Transparent</h3>
          <p className="text-muted-foreground">
            Built on Sui Move. All bids, refunds, and settlements are verifiable
            on-chain. No hidden logic.
          </p>
        </div>
      </section>
    </div>
  );
}
