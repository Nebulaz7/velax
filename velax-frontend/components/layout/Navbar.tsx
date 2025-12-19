"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { AuthButton } from "./AuthButton";
import { AuthHandler } from "./AuthHandler";
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  Gavel,
  X,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MotionLink = motion(Link);

const DoubleLineIcon = ({
  size = 30,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 30 30"
    fill="none"
    className={className}
  >
    <rect x="4" y="9" width="24" height="2" rx="1" fill="currentColor" />
    <rect x="4" y="19" width="24" height="2" rx="1" fill="currentColor" />
  </svg>
);

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: "/market", label: "Market", icon: ShoppingBag },
    { href: "/create", label: "Create", icon: PlusCircle },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 flex justify-center border-gray-500 m-0 font-sm p-2 bg-background/70 backdrop-blur-xl z-50 lg:rounded-full lg:mt-5 lg:mx-6 lg:py-2 lg:border lg:shadow-md lg:shadow-blue-500/30"
    >
      {/* Mount the Invisible Handler Here */}
      <AuthHandler />

      <nav className="flex justify-between items-center gap-5 w-full max-w-7xl px-2 md:px-6 h-[3.5rem] mx-auto">
        {/* Logo Area */}
        <div className="flex items-center gap-2 pl-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-90"
          >
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Gavel size={20} />
            </div>
            <span>Velax</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden text-md font-medium text-center md:flex gap-8 text-muted-foreground">
          {links.map((link) => (
            <li key={link.href}>
              <MotionLink
                href={link.href}
                className={cn(
                  "flex items-center gap-2 transition-colors hover:text-blue-600",
                  pathname === link.href
                    ? "text-blue-600"
                    : "text-muted-foreground"
                )}
                whileHover={{ y: -4 }}
                layout
              >
                <link.icon className="inline-block mr-1 mb-0.5" size={18} />
                {link.label}
              </MotionLink>
            </li>
          ))}
        </ul>

        {/* Desktop Auth Button */}
        <div className="hidden md:flex items-center gap-4">
          <AuthButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-foreground p-2 cursor-pointer"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMenuOpen ? (
              <X size={30} className="hidden" />
            ) : (
              <DoubleLineIcon />
            )}
          </motion.div>
        </button>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <motion.div
        initial={{ x: "-100%", y: "-100%" }}
        animate={{
          x: isMenuOpen ? 0 : "-100%",
          y: isMenuOpen ? 0 : "-100%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute py-2 top-0 left-0 w-full md:hidden min-h-[50vh] bg-transparent z-30 flex flex-col"
      >
        {/* Menu Header */}
        <div className="flex justify-between bg-transparent items-center p-3">
          <h1 className="font-md text-xl"></h1>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-foreground p-2 cursor-pointer"
          >
            <X size={30} />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex-1 bg-background pt-4 pb-4 rounded-2xl m-4 shadow-[2px_4px_0px_0px_#3b82f6] border">
          <ul className="flex flex-col gap-6 pl-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "text-2xl border-b-2 border-foreground hover:text-blue-600 transition-colors flex items-center gap-2",
                    pathname === link.href ? "text-blue-600" : "text-foreground"
                  )}
                >
                  {link.label}
                  <link.icon className="inline-block" size={24} />
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth button for mobile */}
          <div className="md:hidden mt-6 ml-4">
            <AuthButton />
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
