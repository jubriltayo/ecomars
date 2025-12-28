import { ProductCard } from "./product-card";
import { ProductCardData } from "@/lib/types";

interface ProductGridProps {
  products: ProductCardData[];
  showActions?: boolean;
  onDelete?: (productId: string) => void;
}

export function ProductGrid({
  products,
  showActions = false,
  onDelete,
}: ProductGridProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showActions={showActions}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
