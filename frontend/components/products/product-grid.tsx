import { ProductCard } from "./product-card";

// Simplify the interface - only what ProductCard needs
export interface ProductCardData {
  id: string;
  title: string;
  description: string;
  price: number;
  fileUrl?: string;
}

interface ProductGridProps {
  products: ProductCardData[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
