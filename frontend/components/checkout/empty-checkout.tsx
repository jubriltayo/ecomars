"use client";

import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import Link from "next/link";

export function EmptyCheckout() {
  return (
    <div className="text-center py-16 space-y-6">
      <div className="mx-auto w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center">
        <CreditCard className="h-12 w-12 text-white" />
      </div>
      <h1 className="text-3xl font-bold">Your cart is empty</h1>
      <p className="text-muted-foreground max-w-md mx-auto">
        Add products to your cart before checkout.
      </p>
      <Button asChild className="bg-linear-primary text-white hover:opacity-90">
        <Link href="/products">Browse Products</Link>
      </Button>
    </div>
  );
}
