"use client";

import { ProductsDisplay } from "@/components/products/products-display";
import { useProducts } from "@/lib/hooks/useProducts";
import { convertToProductCardData } from "@/lib/utils/product-utils";
import { useState } from "react";

export default function ProductsPage() {
  const { products, isLoading, error, refetch } = useProducts();
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);

  const handleLoadMore = async () => {
    try {
      setIsLoadMoreLoading(true);
      await refetch();
    } finally {
      setIsLoadMoreLoading(false);
    }
  };

  const productCardData = convertToProductCardData(products);

  return (
    <ProductsDisplay
      products={productCardData}
      isLoading={isLoading}
      error={error}
      showLoadMore={true}
      onLoadMore={handleLoadMore}
      isLoadMoreLoading={isLoadMoreLoading}
    />
  );
}
