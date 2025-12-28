"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { CartItem } from "@/lib/types";
import { toast } from "sonner";

interface CartItemsProps {
  items: CartItem[];
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
}

export function CartItems({
  items,
  onRemove,
  onUpdateQuantity,
  onClearCart,
}: CartItemsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
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
                ${item.price.toFixed(2)}{" "}
              </Badge>
            </div>

            {/* Quantity Display */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">Quantity:</div>
                <div className="px-4 py-2 rounded-lg bg-background border">
                  <span className="font-medium">1</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  (Digital license)
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onRemove(item.productId);
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
            onClearCart();
            toast.success("Cart cleared");
          }}
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </div>
    </div>
  );
}
