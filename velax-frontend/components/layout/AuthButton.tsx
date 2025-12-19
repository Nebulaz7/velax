"use client";

import { ConnectButton } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css"; // Ensure styles are loaded

export function AuthButton() {
  return (
    <div className="flex items-center gap-2">
      <ConnectButton className="bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-md cursor-pointer" />
    </div>
  );
}
