"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

interface EmptyCartProps {
  title?: string;
  message?: string;
  buttonText?: string;
  buttonLink?: string;
}

export function EmptyCart({
  title = "Your cart is empty",
  message = "Add some amazing digital products to your cart and they'll appear here.",
  buttonText = "Browse Products",
  buttonLink = "/products",
}: EmptyCartProps) {
  return (
    <div className="text-center py-16 space-y-6">
      <div className="mx-auto w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center">
        <ShoppingBag className="h-12 w-12 text-white" />
      </div>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground max-w-md mx-auto">{message}</p>
      <Button asChild className="bg-linear-primary text-white hover:opacity-90">
        <Link href={buttonLink}>
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
