"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductGrid } from "@/components/products/product-grid";
import { useProducts } from "@/lib/hooks/useProducts";
import { convertToProductCardData } from "@/lib/utils/product-utils";

export function FeaturedProducts() {
  const { products, isLoading } = useProducts(6, 0);

  if (isLoading) {
    return (
      <section>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground">
              Discover amazing digital products from creators
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/products">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[400px] rounded-2xl bg-gradient-card border glass animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  const featuredProducts = convertToProductCardData(products.slice(0, 3)); // Show only 3

  // If no products or API fails, don't show this section
  if (!featuredProducts || featuredProducts.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <p className="text-muted-foreground">
            Discover amazing digital products from creators
          </p>
        </div>
        <Button asChild variant="ghost">
          <Link href="/products">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <ProductGrid products={featuredProducts} />
    </section>
  );
}
