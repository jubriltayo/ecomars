"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/contexts/cart-context";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="mx-auto w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center">
          <ShoppingBag className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Add some amazing digital products to your cart and they'll appear here.
        </p>
        <Button asChild className="bg-linear-primary text-white hover:opacity-90">
          <Link href="/products">
            Browse Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground">
          {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-linear-card border flex flex-col md:flex-row gap-6"
            >
              {/* Product Info */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-gradient-primary font-semibold text-lg mt-1">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <Badge className="bg-linear-warm text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Badge>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="h-8 w-8"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 1) {
                          updateQuantity(item.productId, value);
                        }
                      }}
                      className="w-20 text-center"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="h-8 w-8"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      removeFromCart(item.productId);
                      toast.success("Removed from cart");
                    }}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Clear Cart Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                clearCart();
                toast.success("Cart cleared");
              }}
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
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

            <Link
              href="/checkout"
              className="block w-full bg-linear-primary text-white hover:opacity-90 py-6 text-lg rounded-lg text-center"
            >
              Proceed to Checkout
            </Link>

            <div className="text-center text-sm text-muted-foreground">
              <p>30-day money-back guarantee</p>
              <p className="mt-1">Secure payment processing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}