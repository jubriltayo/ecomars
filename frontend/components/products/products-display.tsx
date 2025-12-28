"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Package, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "./product-grid";
import { ProductCardData } from "@/lib/types";

interface ProductsDisplayProps {
  products: ProductCardData[];
  isLoading: boolean;
  error: string | null;
  title?: string;
  subtitle?: string;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  isLoadMoreLoading?: boolean;
  showActions?: boolean;
  onDelete?: (productId: string) => void;
  emptyMessage?: string;
}

export function ProductsDisplay({
  products,
  isLoading,
  error,
  title = "Digital Marketplace",
  subtitle = "Discover amazing digital products from talented creators",
  showLoadMore = false,
  onLoadMore,
  isLoadMoreLoading = false,
  showActions = false,
  onDelete,
  emptyMessage = "Check back later for new digital products.",
}: ProductsDisplayProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClearSearch = () => setSearchQuery("");

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products, creators..."
            className="pl-10 bg-linear-card border"
            disabled
            value=""
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[400px] rounded-2xl bg-gradient-card border glass animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Failed to load products</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
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

      {/* Search Results Info */}
      {searchQuery && filteredProducts.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Found {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""} for "{searchQuery}"
        </p>
      )}

      {/* Products Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary/10 flex items-center justify-center mb-4">
            {searchQuery ? (
              <Search className="h-8 w-8 text-gradient-primary" />
            ) : (
              <Package className="h-8 w-8 text-gradient-primary" />
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {searchQuery ? "No products found" : "No products available"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? `No products match "${searchQuery}". Try a different search term.`
              : emptyMessage}
          </p>
          {searchQuery && (
            <Button
              onClick={handleClearSearch}
              className="bg-linear-primary text-white hover:opacity-90"
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <>
          <ProductGrid
            products={filteredProducts}
            showActions={showActions}
            onDelete={onDelete}
          />

          {/* Load More Button */}
          {showLoadMore && onLoadMore && !searchQuery && (
            <div className="flex justify-center">
              <Button
                onClick={onLoadMore}
                disabled={isLoadMoreLoading}
                className="px-6 py-3 bg-linear-primary text-white hover:opacity-90"
              >
                {isLoadMoreLoading ? "Loading..." : "Load More Products"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
