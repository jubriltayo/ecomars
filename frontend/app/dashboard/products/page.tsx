"use client";

import { useRequireAuth } from "@/lib/utils/auth-redirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  graphqlRequest,
  productsQueries,
  productsMutations,
  Product,
} from "@/lib/graphql/client";
import { toast } from "sonner";
import { ProductCard } from "@/components/products/product-card";
import { useRouter } from "next/navigation";

export default function MyProductsPage() {
  const { user, isLoading } = useRequireAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchMyProducts();
    }
  }, [user]);

  const fetchMyProducts = async () => {
    try {
      setIsFetching(true);
      const { data } = await graphqlRequest<{ myProducts: Product[] }>(
        productsQueries.getMyProducts
      );

      if (data?.myProducts) {
        setProducts(data.myProducts);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load your products");
    } finally {
      setIsFetching(false);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const { errors } = await graphqlRequest(productsMutations.deleteProduct, {
        id: productId,
      });

      if (errors) {
        throw new Error(errors[0]?.message || "Failed to delete product");
      }

      // Remove from UI
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast.success("Product deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error(error.message || "Failed to delete product");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto rounded-full bg-gradient-primary animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Button
            variant="ghost"
            asChild
            className="pl-0 mb-4 hover:bg-transparent"
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">My Products</h1>
          <p className="text-muted-foreground">
            Manage your digital products ({products.length} total)
          </p>
        </div>
        <Button
          asChild
          className="bg-linear-primary text-white hover:opacity-90"
        >
          <Link href="/dashboard/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Product
          </Link>
        </Button>
      </div>

      {/* Products Grid */}
      {isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-gradient-card border glass animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card className="bg-linear-card border">
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-primary/10 flex items-center justify-center mb-6">
              <Package className="h-10 w-10 text-gradient-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">No products yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Create your first digital product to start selling on Ecomars.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-linear-primary text-white hover:opacity-90"
            >
              <Link href="/dashboard/products/new">
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Product
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                title: product.title,
                description: product.description || "",
                price: product.price,
                fileUrl: product.fileUrl || undefined,
              }}
              showActions={true}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
