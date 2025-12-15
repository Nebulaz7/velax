"use client";

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Loader2 } from "lucide-react";

export default function LoginButton() {
  const account = useCurrentAccount();

  if (account) {
    // Show a mini profile if logged in
    return (
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {account.address.slice(0, 4)}...{account.address.slice(-4)}
        </span>
        {/* The ConnectButton handles the 'Disconnect' logic automatically when clicked again */}
        <div className="opacity-0 w-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 transition-all">
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="custom-connect-wrapper">
      {/* This button opens the modal. 
          Users select "Sui Wallet" -> "Google" for zkLogin.
       */}
      <ConnectButton
        connectText="Login with Google"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition-all"
      />
    </div>
  );
}
