import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FallbackProducts() {
  const fallbackProducts = [
    {
      id: "demo-1",
      title: "UI Design System",
      description: "Complete Figma design system with components and templates",
      price: 49.99,
      fileUrl: "/placeholder.svg",
    },
    {
      id: "demo-2",
      title: "Productivity Bundle",
      description: "Notion templates for productivity and project management",
      price: 29.99,
      fileUrl: "/placeholder.svg",
    },
    {
      id: "demo-3",
      title: "Music Production Kit",
      description: "Royalty-free samples and presets for music production",
      price: 79.99,
      fileUrl: "/placeholder.svg",
    },
  ];

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <p className="text-muted-foreground">
            Explore trending digital products
          </p>
        </div>
        <Button asChild variant="ghost">
          <Link href="/products">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <ProductGrid products={fallbackProducts} />
    </section>
  );
}
