"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import { StripeElements } from "./stripe-elements";
import { PaymentForm } from "./payment-form";
import { useOrders } from "@/lib/hooks/useOrders";
import { CartItem } from "@/lib/types";

interface CheckoutDisplayProps {
  items: CartItem[];
  totalPrice: number;
  onClearCart: () => void;
}

export function CheckoutDisplay({
  items,
  totalPrice,
  onClearCart,
}: CheckoutDisplayProps) {
  const { createOrder, isLoading: isCreatingOrder } = useOrders();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleInitializePayment = async () => {
    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        price: item.price,
      }));

      const result = await createOrder(orderItems);

      if (result) {
        setClientSecret(result.clientSecret);
        setOrderId(result.order.id);
      }
    } catch (error: any) {
      console.error("Order creation error:", error);
      toast.error(error.message || "Failed to initialize payment");
    }
  };

  const handlePaymentSuccess = () => {
    toast.success("Payment successful! Your order is being processed.");
    onClearCart();

    // Redirect to purchases page
    setTimeout(() => {
      window.location.href = "/purchases";
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    toast.error(error || "Payment failed");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          asChild
          className="pl-0 mb-4 hover:bg-transparent"
        >
          <Link href="/cart" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase securely</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Order Summary & Security */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Order Summary</h2>
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-linear-card border flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Digital license
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    ${item.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    One-time purchase
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Security Info */}
          <div className="p-6 rounded-2xl bg-gradient-card border">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-green-100">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Your payment is processed securely by Stripe. We never store
                  your card details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Section */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-linear-card border p-6 space-y-4">
            <h2 className="text-xl font-bold">Payment Details</h2>

            <div className="space-y-3">
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

            {!clientSecret ? (
              <Button
                className="w-full bg-linear-primary text-white hover:opacity-90 py-6 text-lg"
                onClick={handleInitializePayment}
                disabled={isCreatingOrder}
              >
                {isCreatingOrder ? "Creating Order..." : "Proceed to Payment"}
              </Button>
            ) : (
              <StripeElements>
                <PaymentForm
                  clientSecret={clientSecret}
                  amount={totalPrice}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </StripeElements>
            )}

            <div className="text-center text-xs text-muted-foreground space-y-1">
              <p>Secure SSL encryption</p>
              <p>30-day money-back guarantee</p>
            </div>
          </div>

          {/* Accepted Cards */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">We accept</p>
            <div className="flex justify-center gap-3">
              <div className="h-8 w-12 bg-blue-100 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">VISA</span>
              </div>
              <div className="h-8 w-12 bg-blue-50 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-blue-800">MC</span>
              </div>
              <div className="h-8 w-12 bg-yellow-100 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-yellow-600">AMEX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
