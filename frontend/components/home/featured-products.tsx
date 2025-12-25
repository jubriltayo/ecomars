import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductGrid } from "@/components/products/product-grid";

export function FeaturedProducts() {
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

      <ProductGrid products={[]} />
    </section>
  );
}
