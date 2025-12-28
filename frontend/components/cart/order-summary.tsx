"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  totalItems: number;
  totalPrice: number;
  onCheckout?: () => void;
}

export function OrderSummary({
  totalItems,
  totalPrice,
  onCheckout,
}: OrderSummaryProps) {
  return (
    <div className="lg:sticky lg:top-24 self-start">
      <div className="rounded-2xl bg-linear-card border p-6 space-y-6">
        <h2 className="text-xl font-bold">Order Summary</h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform Fee</span>
            <span className="font-medium">$0.00</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-gradient-primary">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {onCheckout ? (
          <Button
            onClick={onCheckout}
            className="w-full bg-linear-primary text-white hover:opacity-90 py-6 text-lg"
          >
            Proceed to Checkout
          </Button>
        ) : (
          <a
            href="/checkout"
            className="block w-full bg-linear-primary text-white hover:opacity-90 py-6 text-lg rounded-lg text-center"
          >
            Proceed to Checkout
          </a>
        )}

        <div className="text-center text-sm text-muted-foreground">
          <p>30-day money-back guarantee</p>
          <p className="mt-1">Secure payment processing</p>
        </div>
      </div>
    </div>
  );
}
