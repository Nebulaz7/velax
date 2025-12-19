"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Gavel,
  Users,
  Clock,
  Wallet,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFFEF9] dark:bg-[#0a0a0a] pt-4">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24 md:py-32">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border-2 border-black dark:border-white px-4 py-2 text-sm font-bold mb-8 bg-yellow-300 dark:bg-yellow-400 text-black shadow-[4px_4px_0px_0px_#000]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
          </span>
          Live on Sui Testnet
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight max-w-4xl mb-6 text-black dark:text-white">
            Fair Auctions with{" "}
            <span className="bg-blue-500 text-white px-4 py-1 inline-block rotate-[-1deg] shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
              Instant Refunds
            </span>
          </h1>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-lg md:text-xl text-black/70 dark:text-white/70 max-w-2xl mb-12 font-medium">
            The first decentralized marketplace where losing bidders get
            refunded instantly in the same transaction block. No locked funds.
            No waiting. No hassle.
          </p>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/market">
            <Button
              size="lg"
              className="h-14 px-8 text-lg font-black bg-blue-500 hover:bg-blue-600 text-white border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-xl"
            >
              Start Bidding <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/create">
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg font-black bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-xl"
            >
              List an Item
            </Button>
          </Link>
        </MotionDiv>

        {/* Stats Bar */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8 mt-16 p-6 border-2 border-black dark:border-white bg-white dark:bg-black rounded-2xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]"
        >
          <div className="text-center px-6">
            <p className="text-3xl md:text-4xl font-black text-blue-500">0ms</p>
            <p className="text-sm font-bold text-black/60 dark:text-white/60">
              Refund Time
            </p>
          </div>
          <div className="w-px bg-black/20 dark:bg-white/20 hidden sm:block"></div>
          <div className="text-center px-6">
            <p className="text-3xl md:text-4xl font-black text-green-500">
              $0.00
            </p>
            <p className="text-sm font-bold text-black/60 dark:text-white/60">
              Gas Fees
            </p>
          </div>
          <div className="w-px bg-black/20 dark:bg-white/20 hidden sm:block"></div>
          <div className="text-center px-6">
            <p className="text-3xl md:text-4xl font-black text-purple-500">
              100%
            </p>
            <p className="text-sm font-bold text-black/60 dark:text-white/60">
              On-Chain
            </p>
          </div>
        </MotionDiv>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-blue-500 border-y-4 border-black dark:border-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-black text-center text-white mb-4">
            How It Works
          </h2>
          <p className="text-center text-white/80 font-medium mb-16 max-w-2xl mx-auto">
            Traditional auctions lock your funds. Velax returns them instantly.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Sign in with Google",
                description:
                  "No wallet extensions needed. Use zkLogin to create a secure wallet with just your Google account.",
                icon: Users,
              },
              {
                step: "02",
                title: "Place Your Bid",
                description:
                  "Browse auctions and bid on items you love. All transactions are gasless - we cover the fees.",
                icon: Gavel,
              },
              {
                step: "03",
                title: "Win or Get Refunded",
                description:
                  "If outbid, your funds return instantly in the same block. If you win, claim your item!",
                icon: Zap,
              },
            ].map((item, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-black border-2 border-black dark:border-white p-8 rounded-2xl shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]"
              >
                <span className="text-6xl font-black text-blue-500/20">
                  {item.step}
                </span>
                <div className="flex items-center gap-3 mb-4 -mt-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-xl border-2 border-black dark:border-white">
                    <item.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-black text-black dark:text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="text-black/70 dark:text-white/70 font-medium">
                  {item.description}
                </p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-black dark:text-white">
            Why Choose Velax?
          </h2>
          <p className="text-center text-black/60 dark:text-white/60 font-medium mb-16 max-w-2xl mx-auto">
            Built for the future of decentralized commerce
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Instant Refunds",
                description:
                  "Outbid? Get your funds back immediately in the same transaction block. No waiting, no claiming.",
                icon: Zap,
                color: "bg-yellow-300",
                iconColor: "text-yellow-700",
              },
              {
                title: "Gasless Transactions",
                description:
                  "Powered by Enoki. Experience Web3 without needing SUI for gas. We sponsor every transaction.",
                icon: Wallet,
                color: "bg-green-300",
                iconColor: "text-green-700",
              },
              {
                title: "zkLogin Auth",
                description:
                  "Sign in with Google. No seed phrases, no browser extensions. Web2 UX meets Web3 security.",
                icon: ShieldCheck,
                color: "bg-purple-300",
                iconColor: "text-purple-700",
              },
              {
                title: "Real-Time Updates",
                description:
                  "Our custom indexer syncs blockchain events instantly. Always see the latest bids and auctions.",
                icon: Clock,
                color: "bg-blue-300",
                iconColor: "text-blue-700",
              },
              {
                title: "Fair & Transparent",
                description:
                  "Built on Sui Move. All bids, refunds, and settlements are verifiable on-chain. No hidden logic.",
                icon: CheckCircle,
                color: "bg-pink-300",
                iconColor: "text-pink-700",
              },
              {
                title: "Community First",
                description:
                  "Designed for students and creators. List, bid, and trade with your community seamlessly.",
                icon: Users,
                color: "bg-orange-300",
                iconColor: "text-orange-700",
              },
            ].map((feature, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group p-6 border-2 border-black dark:border-white rounded-2xl bg-white dark:bg-black shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#fff] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                <div
                  className={`p-3 ${feature.color} rounded-xl border-2 border-black dark:border-white inline-block mb-4`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-black text-black dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-black/70 dark:text-white/70 font-medium">
                  {feature.description}
                </p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-4 bg-black dark:bg-white border-y-4 border-black dark:border-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-white dark:text-black">
            Traditional vs Velax
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Traditional */}
            <MotionDiv
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="p-8 border-2 border-white/30 dark:border-black/30 rounded-2xl bg-white/10 dark:bg-black/10"
            >
              <h3 className="text-2xl font-black text-red-400 mb-6">
                ❌ Traditional Auctions
              </h3>
              <ul className="space-y-4">
                {[
                  "Funds locked until auction ends",
                  "Manual claim process required",
                  "High gas fees for each action",
                  "Complex wallet setup needed",
                  "Opaque auction mechanics",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-white/70 dark:text-black/70 font-medium"
                  >
                    <span className="text-red-400 mt-1">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </MotionDiv>

            {/* Velax */}
            <MotionDiv
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="p-8 border-2 border-green-400 rounded-2xl bg-green-500/20 shadow-[4px_4px_0px_0px_#4ade80]"
            >
              <h3 className="text-2xl font-black text-green-400 mb-6">
                ✓ Velax Auctions
              </h3>
              <ul className="space-y-4">
                {[
                  "Instant atomic refunds",
                  "Automatic - no action needed",
                  "Zero gas fees with Enoki",
                  "Sign in with Google",
                  "Fully transparent on-chain",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-white dark:text-black font-medium"
                  >
                    <span className="text-green-400 mt-1">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-black dark:text-white">
            Built With
          </h2>
          <p className="text-center text-black/60 dark:text-white/60 font-medium mb-16 max-w-2xl mx-auto">
            Powered by cutting-edge blockchain technology
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "Sui", color: "bg-blue-400" },
              { name: "Move", color: "bg-purple-400" },
              {
                name: "Next.js",
                color: "bg-black dark:bg-white text-white dark:text-black",
              },
              { name: "Enoki", color: "bg-green-400" },
              { name: "zkLogin", color: "bg-yellow-400" },
              { name: "Supabase", color: "bg-emerald-400" },
              { name: "TypeScript", color: "bg-blue-500" },
              { name: "Tailwind", color: "bg-cyan-400" },
            ].map((tech, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`${tech.color} px-6 py-3 rounded-full border-2 border-black dark:border-white font-black text-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]`}
              >
                {tech.name}
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-yellow-300 border-t-4 border-black dark:border-white">
        <div className="container mx-auto max-w-4xl text-center">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-black mb-6">
              Ready to Experience <br /> Fair Auctions?
            </h2>
            <p className="text-xl text-black/70 font-medium mb-10 max-w-2xl mx-auto">
              Join the revolution. Bid with confidence knowing you will never
              have locked funds again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/market">
                <Button
                  size="lg"
                  className="h-16 px-10 text-xl font-black bg-black hover:bg-black/80 text-white border-2 border-black shadow-[6px_6px_0px_0px_#3b82f6] hover:shadow-[3px_3px_0px_0px_#3b82f6] hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-xl"
                >
                  Explore Auctions <ChevronRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/create">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 px-10 text-xl font-black bg-white text-black border-2 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-xl"
                >
                  Create Auction
                </Button>
              </Link>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black dark:bg-white border-t-4 border-black dark:border-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl border-2 border-white dark:border-black">
                <Gavel className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white dark:text-black">
                Velax
              </span>
            </div>
            <p className="text-white/60 dark:text-black/60 font-medium">
              Built with ❤️ for Sui Hackathon 2025
            </p>
            <div className="flex gap-6">
              <Link
                href="/market"
                className="text-white/60 dark:text-black/60 hover:text-white dark:hover:text-black font-bold transition-colors"
              >
                Market
              </Link>
              <Link
                href="/create"
                className="text-white/60 dark:text-black/60 hover:text-white dark:hover:text-black font-bold transition-colors"
              >
                Create
              </Link>
              <Link
                href="/dashboard"
                className="text-white/60 dark:text-black/60 hover:text-white dark:hover:text-black font-bold transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
