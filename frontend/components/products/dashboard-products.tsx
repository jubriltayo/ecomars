"use client";

import { ProductsDisplay } from "./products-display";
import { ProductCardData } from "@/lib/types";

interface DashboardProductsProps {
  products: ProductCardData[];
  isLoading: boolean;
  error: string | null;
  onDelete: (productId: string) => void;
}

export function DashboardProducts({
  products,
  isLoading,
  error,
  onDelete,
}: DashboardProductsProps) {
  return (
    <ProductsDisplay
      products={products}
      isLoading={isLoading}
      error={error}
      title="My Products"
      subtitle="Manage your digital products"
      showActions={true}
      onDelete={onDelete}
      emptyMessage="Create your first product to start selling on Ecomars."
    />
  );
}
