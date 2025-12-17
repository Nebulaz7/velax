"use client";

import {
  ConnectButton,
  useCurrentAccount,
  useDisconnectWallet,
} from "@mysten/dapp-kit";
import { Loader2, LogOut, Wallet } from "lucide-react";
import { useState, useEffect } from "react";

export default function LoginButton() {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [mounted, setMounted] = useState(false);

  // Fix Next.js hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />;

  // STATE 1: User is Logged In
  if (account) {
    return (
      <div className="flex items-center gap-3">
        {/* Profile Badge */}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Green Status Dot */}
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />

          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 font-mono">
            {account.address.slice(0, 4)}...{account.address.slice(-4)}
          </span>
        </div>

        {/* Custom Disconnect Button */}
        <button
          onClick={() => disconnect()}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
          title="Disconnect"
        >
          <LogOut size={18} />
        </button>
      </div>
    );
  }

  // STATE 2: User is Logged Out
  return (
    <div className="relative">
      {/* This is the magic wrapper. 
        We style the button to look like "Connect / Google", 
        but the actual logic is handled by the SDK's ConnectButton.
      */}
      <ConnectButton
        connectText={
          <span className="flex items-center gap-2">
            <Wallet size={16} />
            Connect / Google
          </span>
        }
        className="bg-black! dark:bg-white! text-white! dark:text-black! font-bold! px-6! py-2.5! rounded-full! transition-transform! hover:scale-105! active:scale-95!"
      />

      {/* Helper text to teach users */}
      <p className="absolute -bottom-6 left-0 right-0 text-[10px] text-center text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
        Select "Sui Wallet" for Google
      </p>
    </div>
  );
}
