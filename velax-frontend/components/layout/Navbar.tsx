"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButton } from "./AuthButton";
import { AuthHandler } from "./AuthHandler";
import { LayoutDashboard, ShoppingBag, PlusCircle, Gavel } from "lucide-react";
import { cn } from "@/lib/utils"; // shadcn utility

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/market", label: "Market", icon: ShoppingBag },
    { href: "/create", label: "Create", icon: PlusCircle },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Mount the Invisible Handler Here */}
      <AuthHandler />

      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        {/* Logo Area */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-90"
          >
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Gavel size={20} />
            </div>
            <span>Velax</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 transition-colors hover:text-blue-600",
                  pathname === link.href
                    ? "text-blue-600"
                    : "text-muted-foreground"
                )}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side: Auth */}
        <div className="flex items-center gap-4">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
