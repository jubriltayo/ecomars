"use client";

import { CartItems } from "./cart-items";
import { OrderSummary } from "./order-summary";
import { EmptyCart } from "./empty-cart";
import { CartItem } from "@/lib/types";

interface CartDisplayProps {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  onCheckout?: () => void; // Make it optional
}

export function CartDisplay({
  items,
  totalItems,
  totalPrice,
  onRemove,
  onUpdateQuantity,
  onClearCart,
  onCheckout,
}: CartDisplayProps) {
  if (items.length === 0) {
    return <EmptyCart />;
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
        <div className="lg:col-span-2">
          <CartItems
            items={items}
            onRemove={onRemove}
            onUpdateQuantity={onUpdateQuantity}
            onClearCart={onClearCart}
          />
        </div>

        {/* Order Summary */}
        <OrderSummary
          totalItems={totalItems}
          totalPrice={totalPrice}
          onCheckout={onCheckout}
        />
      </div>
    </div>
  );
}
