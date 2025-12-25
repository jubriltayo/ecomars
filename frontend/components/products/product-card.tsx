"use client";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Edit, Trash2 } from "lucide-react";
import { useCart } from "@/lib/contexts/cart-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    fileUrl?: string;
  };
  showActions?: boolean; // New prop for dashboard view
  onDelete?: (productId: string) => void; // New prop for delete callback
}

export function ProductCard({
  product,
  showActions = false,
  onDelete,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success("Added to cart!");
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/dashboard/products/edit/${product.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && confirm("Are you sure you want to delete this product?")) {
      onDelete(product.id);
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-xl transition-all duration-300 border glass group">
      {/* Clickable Product Image/Icon Area */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="h-48 bg-gradient-primary relative overflow-hidden hover:opacity-90 transition-opacity">
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag className="h-20 w-20 text-white" />
          </div>
        </div>
      </Link>

      {/* Content Area */}
      <div className="flex flex-col grow">
        <CardHeader className="pb-4">
          {/* Clickable Title */}
          <Link
            href={`/products/${product.id}`}
            className="block hover:text-primary transition-colors"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg line-clamp-1">
                {product.title}
              </h3>
              <Badge className="bg-linear-warm text-white whitespace-nowrap">
                ${product.price.toFixed(2)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
              {product.description}
            </p>
          </Link>
        </CardHeader>

        <div className="grow"></div>

        <CardFooter className="pt-4 mt-auto">
          {showActions ? (
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          ) : (
            <Button
              className="w-full bg-linear-primary text-white hover:opacity-90"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}
