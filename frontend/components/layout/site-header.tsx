"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { UserNav } from "@/components/layout/user-nav";
import { ShoppingCart, Rocket } from "lucide-react";
import { useCart } from "@/lib/contexts/cart-context";

export function SiteHeader() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b glass">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-linear-primary rounded-lg">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient-primary">
                Ecomars
              </span>
            </Link>
          </div>

          {/* Navigation - Always show all menu items */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Marketplace
            </Link>

            {/* Always show Sell - will redirect to login if not authenticated */}
            <Link
              href="/dashboard/products"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Sell
            </Link>

            {/* Always show My Purchases - will redirect to login */}
            <Link
              href="/purchases"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              My Purchases
            </Link>

            {/* Always show Dashboard - will redirect to login */}
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Icon with counter */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative hover:bg-muted"
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-linear-warm text-xs rounded-full flex items-center justify-center text-white">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>
            </Button>

            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
}
