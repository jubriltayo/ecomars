"use client";

import { ProductGrid } from "@/components/products/product-grid";
import { Input } from "@/components/ui/input";
import { Search, Package } from "lucide-react";
import { useState, useEffect } from "react";
import {
  graphqlRequest,
  productsQueries,
  ProductsResponse,
  Product,
} from "@/lib/graphql/client";
import { toast } from "sonner";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data } = await graphqlRequest<ProductsResponse>(
        productsQueries.getProducts,
        { limit: 20, offset: 0 }
      );

      if (data?.products.products) {
        setProducts(data.products.products);
      } else {
        // Fallback to mock data
        setProducts(getMockProducts());
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      setProducts(getMockProducts());
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data fallback with proper typing
  const getMockProducts = (): Product[] => [
    {
      id: "1",
      title: "Digital Marketing Masterclass",
      description: "Complete guide to digital marketing strategies for 2024",
      price: 49.99,
      fileUrl: null,
      fileName: null,
      fileSize: null,
      sellerId: "seller-1",
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "UI/UX Design System",
      description: "Figma design system with 100+ components",
      price: 29.99,
      fileUrl: null,
      fileName: null,
      fileSize: null,
      sellerId: "seller-2",
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Python Data Science Course",
      description: "Learn data science with Python from scratch",
      price: 79.99,
      fileUrl: null,
      fileName: null,
      fileSize: null,
      sellerId: "seller-3",
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "4",
      title: "Music Production Pack",
      description: "Professional sound samples and presets",
      price: 19.99,
      fileUrl: null,
      fileName: null,
      fileSize: null,
      sellerId: "seller-4",
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Convert to ProductCardData format
  const productCardData = filteredProducts.map((product) => ({
    id: product.id,
    title: product.title,
    description: product.description || "",
    price: product.price,
    fileUrl: product.fileUrl || undefined,
  }));

  const showLoadMore = !searchQuery && filteredProducts.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Digital Marketplace</h1>
        <p className="text-muted-foreground">
          Discover amazing digital products from talented creators
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products, creators..."
          className="pl-10 bg-linear-card border"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[400px] rounded-2xl bg-gradient-card border glass animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          {searchQuery && filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary/10 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gradient-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                No products match "{searchQuery}". Try a different search term.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 rounded-lg bg-linear-primary text-white hover:opacity-90 transition-opacity"
              >
                Clear Search
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary/10 flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-gradient-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                No products available
              </h3>
              <p className="text-muted-foreground">
                Check back later for new digital products.
              </p>
            </div>
          ) : (
            <>
              {searchQuery && (
                <p className="text-sm text-muted-foreground">
                  Found {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? "s" : ""} for "{searchQuery}"
                </p>
              )}
              <ProductGrid products={productCardData} />
            </>
          )}

          {/* Load More - Only show when not searching */}
          {showLoadMore && (
            <div className="flex justify-center">
              <button
                onClick={fetchProducts}
                className="px-6 py-3 rounded-lg bg-linear-primary text-white hover:opacity-90 transition-opacity"
              >
                Load More Products
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
