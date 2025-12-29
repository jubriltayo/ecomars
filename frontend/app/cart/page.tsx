"use client";

import { CartDisplay } from "@/components/cart/cart-display";
import { useCart } from "@/lib/contexts/cart-context";
import { useRequireAuth } from "@/lib/utils/auth-redirect";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const { user } = useRequireAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  return (
    <CartDisplay
      items={items}
      totalItems={totalItems}
      totalPrice={totalPrice}
      onRemove={removeFromCart}
      onUpdateQuantity={updateQuantity}
      onClearCart={clearCart}
      onCheckout={handleCheckout}
    />
  );
}
