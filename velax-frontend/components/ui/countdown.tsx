"use client";
import { useEffect, useState } from "react";

export function Countdown({ targetDate }: { targetDate: number }) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft("Ended");
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        setIsUrgent(diff < 3600000); // Less than 1 hour
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <span
      className={`font-mono font-bold ${
        isUrgent ? "text-red-500 animate-pulse" : "text-white"
      }`}
    >
      {timeLeft}
    </span>
  );
}
