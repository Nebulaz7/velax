"use client";

import { useState } from "react";
import {
  useCurrentAccount,
  useSignTransaction,
  useSuiClientContext,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Loader2 } from "lucide-react"; // npm install lucide-react

export default function CreateListing() {
  const account = useCurrentAccount();
  const { client } = useSuiClientContext();
  const { mutateAsync: signTransaction } = useSignTransaction();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // For showing "Uploading...", "Signing...", etc.

  // If not logged in, show a warning
  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold mb-4">Please Login to Sell Items</h2>
        <Link href="/" className="text-blue-500 hover:underline">
          Go Back Home
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("Uploading image to Walrus...");

    const sender = account?.address;
    if (!sender) return;

    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get("title") as string;
      const price = formData.get("price") as string;
      const file = formData.get("file") as File;

      // --- STEP 1: Upload to Walrus ---
      const uploadFormData = new FormData();
      uploadFormData.append("file", file); // Must match the .get('file') in the API route

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData, // Do NOT set Content-Type header manually, let fetch do it
      });

      if (!uploadRes.ok) throw new Error("Image upload failed");
      const { blobId } = await uploadRes.json();

      setStatus("Building Transaction...");

      // --- STEP 2: Build the Transaction Logic ---
      const tx = new Transaction();
      tx.setSender(sender);

      // Make sure this matches your .env variables exactly!
      tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::${process.env.NEXT_PUBLIC_MODULE}::list_item`,
        arguments: [
          tx.pure.string(blobId), // The ID from Walrus
          tx.pure.u64(Number(price) * 1_000_000_000), // Convert SUI to MIST
        ],
      });

      // Get the bytes (Logic ONLY, no Gas info yet)
      const kindBytes = await tx.build({
        client: client,
        onlyTransactionKind: true,
      });
      const txBytesBase64 = Buffer.from(kindBytes).toString("base64");

      // --- STEP 3: Request Sponsorship (Backend) ---
      setStatus("Sponsoring Gas (Free for you!)...");
      const sponsorRes = await fetch("/api/sponsor", {
        method: "POST",
        body: JSON.stringify({
          network: "testnet",
          txBytes: txBytesBase64,
          sender,
        }),
      });

      if (!sponsorRes.ok) throw new Error("Sponsorship failed");
      const { bytes: sponsoredBytes, digest } = await sponsorRes.json();

      // --- STEP 4: User Signs ---
      setStatus("Waiting for your signature...");
      const sponsoredTx = Transaction.from(sponsoredBytes);
      const { signature } = await signTransaction({
        transaction: sponsoredTx,
      });

      // --- STEP 5: Execute (Backend) ---
      setStatus("Finalizing Listing...");
      const execRes = await fetch("/api/execute", {
        method: "POST",
        body: JSON.stringify({
          digest,
          signature,
        }),
      });

      if (!execRes.ok) throw new Error("Execution failed");

      alert("Success! Your item is live.");
      router.push("/"); // Redirect to home to see the new item
    } catch (err) {
      console.error(err);
      alert("Failed to list item. Check console.");
    } finally {
      setLoading(false);
      setStatus("");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <Link
            href="/"
            className="flex items-center text-sm hover:underline opacity-80 mb-4"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Market
          </Link>
          <h1 className="text-3xl font-bold">List an Item</h1>
          <p className="opacity-90 mt-2">
            Sell to students on campus securely.
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Item Name
              </label>
              <input
                name="title"
                placeholder="e.g. Calculus Textbook (Used)"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            {/* Price Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price (SUI)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  name="price"
                  type="number"
                  step="0.1"
                  placeholder="0.00"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">SUI</span>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Item Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600 hover:border-blue-500 transition-colors">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input
                        name="file"
                        type="file"
                        className="sr-only"
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin mr-2" size={18} />
                  {status}
                </div>
              ) : (
                "List Item (Gas Free)"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
