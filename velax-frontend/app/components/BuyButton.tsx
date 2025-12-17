"use client";

import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";

export default function BuyButton({
  listingId,
  price,
  onSuccess,
}: {
  listingId: string;
  price: number;
  onSuccess?: () => void;
}) {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    if (!account) return alert("Please connect your wallet!");
    setLoading(true);

    try {
      const tx = new Transaction();

      // 1. Split the coin for payment
      const [payment] = tx.splitCoins(tx.gas, [tx.pure.u64(price)]);

      // 2. Call buy_item
      tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::${process.env.NEXT_PUBLIC_MODULE}::buy_item`,
        arguments: [tx.object(listingId), payment],
      });

      // 3. Execute
      await signAndExecute({ transaction: tx });

      alert("Item bought! Go to Dashboard to confirm receipt.");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Purchase failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-lg font-bold hover:opacity-80 disabled:opacity-50"
    >
      {loading
        ? "Processing..."
        : `Buy for ${(price / 1_000_000_000).toFixed(2)} SUI`}
    </button>
  );
}
