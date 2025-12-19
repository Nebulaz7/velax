"use client";

import { useState } from "react";
import { useSponsoredTx } from "@/hooks/useSponsoredTx";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, AUCTION_MODULE } from "@/utils/constants";
import { createClient } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Rocket,
  ImageIcon,
  Clock,
  Coins,
  FileText,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

export default function CreatePage() {
  const executeSponsored = useSponsoredTx();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    price: "1",
    duration: "24",
  });

  const handleCreate = async () => {
    if (!formData.title || !formData.url) return alert("Fill all fields");
    setLoading(true);

    try {
      const tx = new Transaction();

      const priceInMist = BigInt(parseFloat(formData.price) * 1_000_000_000);
      const hours = parseInt(formData.duration);
      const durationMs = hours * 60 * 60 * 1000;

      tx.moveCall({
        target: `${PACKAGE_ID}::${AUCTION_MODULE}::create_auction`,
        arguments: [
          tx.pure.string(formData.title),
          tx.pure.string(formData.description),
          tx.pure.string(formData.url),
          tx.pure.u64(durationMs),
          tx.pure.u64(priceInMist),
          tx.object("0x6"),
        ],
      });

      const res = await executeSponsored(tx);
      console.log("Tx Digest:", res.digest);

      setTimeout(async () => {
        await supabase
          .from("auctions")
          .update({
            name: formData.title,
            description: formData.description,
            starting_price: Number(priceInMist),
          })
          .eq("image_url", formData.url);

        router.push("/market");
      }, 4000);
    } catch (err) {
      console.error("Failed:", err);
      alert("Failed. See console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF9] dark:bg-[#0a0a0a] pt-26 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-black dark:border-white px-4 py-2 text-sm font-bold mb-6 bg-purple-300 text-black shadow-[4px_4px_0px_0px_#000]">
            <Rocket className="h-4 w-4" />
            List Your Item
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-4">
            Create Auction
          </h1>
          <p className="text-lg text-black/60 dark:text-white/60 font-medium max-w-md mx-auto">
            Mint your item as an NFT and start receiving bids instantly
          </p>
        </MotionDiv>

        {/* Form Card */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-black border-4 border-black dark:border-white rounded-2xl shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#fff] overflow-hidden"
        >
          {/* Card Header */}
          <div className="bg-blue-500 border-b-4 border-black dark:border-white p-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl border-2 border-black">
                <Rocket className="h-6 w-6 text-blue-600" />
              </div>
              Auction Details
            </h2>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Item Name */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base font-black text-black dark:text-white">
                <Tag className="h-4 w-4" />
                Item Name
              </Label>
              <Input
                placeholder="e.g., Vintage Camera"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="h-14 text-lg font-medium border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] focus:shadow-[1px_1px_0px_0px_#000] dark:focus:shadow-[1px_1px_0px_0px_#fff] focus:translate-x-[2px] focus:translate-y-[2px] transition-all bg-white dark:bg-black"
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base font-black text-black dark:text-white">
                <FileText className="h-4 w-4" />
                Description
              </Label>
              <Input
                placeholder="Describe your item..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="h-14 text-lg font-medium border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] focus:shadow-[1px_1px_0px_0px_#000] dark:focus:shadow-[1px_1px_0px_0px_#fff] focus:translate-x-[2px] focus:translate-y-[2px] transition-all bg-white dark:bg-black"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base font-black text-black dark:text-white">
                <ImageIcon className="h-4 w-4" />
                Image URL
              </Label>
              <Input
                placeholder="https://example.com/image.png"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="h-14 text-lg font-medium border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] focus:shadow-[1px_1px_0px_0px_#000] dark:focus:shadow-[1px_1px_0px_0px_#fff] focus:translate-x-[2px] focus:translate-y-[2px] transition-all bg-white dark:bg-black"
              />
              {formData.url && (
                <MotionDiv
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 border-2 border-black dark:border-white rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]"
                >
                  <img
                    src={formData.url}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </MotionDiv>
              )}
            </div>

            {/* Price & Duration Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Price */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-base font-black text-black dark:text-white">
                  <Coins className="h-4 w-4" />
                  Start Price (SUI)
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="h-14 text-lg font-bold border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] focus:shadow-[1px_1px_0px_0px_#000] dark:focus:shadow-[1px_1px_0px_0px_#fff] focus:translate-x-[2px] focus:translate-y-[2px] transition-all bg-yellow-100 dark:bg-yellow-900/30 pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-black/50 dark:text-white/50">
                    SUI
                  </span>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-base font-black text-black dark:text-white">
                  <Clock className="h-4 w-4" />
                  Duration
                </Label>
                <Select
                  onValueChange={(val) =>
                    setFormData({ ...formData, duration: val })
                  }
                  defaultValue="24"
                >
                  <SelectTrigger className="h-14 text-lg font-bold border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] bg-green-100 dark:bg-green-900/30">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
                    <SelectItem value="1" className="font-bold">
                      ⚡ 1 Hour (Quick Test)
                    </SelectItem>
                    <SelectItem value="6" className="font-bold">
                      🕐 6 Hours
                    </SelectItem>
                    <SelectItem value="24" className="font-bold">
                      📅 24 Hours
                    </SelectItem>
                    <SelectItem value="72" className="font-bold">
                      📆 3 Days
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-100 dark:bg-blue-900/30 border-2 border-black dark:border-white rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]">
              <p className="text-sm font-bold text-black/70 dark:text-white/70">
                💡 <span className="text-black dark:text-white">Pro tip:</span>{" "}
                Your item will be minted as an NFT on the Sui blockchain. All
                bids and refunds happen atomically on-chain.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleCreate}
              disabled={loading || !formData.title || !formData.url}
              className="w-full h-16 text-xl font-black bg-blue-500 hover:bg-blue-600 text-white border-4 border-black dark:border-white rounded-xl shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff] hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0px_0px_#000]"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Creating Auction...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <Rocket className="h-6 w-6" />
                  Mint & List Auction
                </span>
              )}
            </Button>
          </div>
        </MotionDiv>

        {/* Bottom Info */}
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-black/50 dark:text-white/50 font-medium">
            🔒 Secured by Sui Blockchain • ⚡ Gasless with Enoki
          </p>
        </MotionDiv>
      </div>
    </div>
  );
}
