"use client";

import { DashboardProducts } from "@/components/products/dashboard-products";
import { useMyProducts, useDeleteProduct } from "@/lib/hooks/useProducts";
import { convertToProductCardData } from "@/lib/utils/product-utils";

export default function MyProductsPage() {
  const { products, isLoading, error, refetch } = useMyProducts();
  const { deleteProduct, isLoading: isDeleting } = useDeleteProduct();

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        refetch();
      } catch {
        // Error is handled by the hook
      }
    }
  };

  const productCardData = convertToProductCardData(products);

  return (
    <div className="space-y-8">
      {/* Products Display */}
      <DashboardProducts
        products={productCardData}
        isLoading={isLoading || isDeleting}
        error={error}
        onDelete={handleDelete}
      />
    </div>
  );
}
