"use client";

import { CheckoutDisplay } from "@/components/checkout/checkout-display";
import { EmptyCheckout } from "@/components/checkout/empty-checkout";
import { useCart } from "@/lib/contexts/cart-context";
import { useRequireAuth } from "@/lib/utils/auth-redirect";
import { Loading } from "@/components/ui/loading";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isLoading } = useRequireAuth("/login");

  if (isLoading) {
    return <Loading message="Checking authentication..." fullScreen />;
  }

  if (!user) {
    return null;
  }

  if (items.length === 0) {
    return <EmptyCheckout />;
  }

  return (
    <CheckoutDisplay
      items={items}
      totalPrice={totalPrice}
      onClearCart={clearCart}
    />
  );
}
