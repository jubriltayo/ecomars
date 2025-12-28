"use client";

import { useRequireAuth } from "@/lib/utils/auth-redirect";
import { DashboardDisplay } from "@/components/dashboard/dashboard-display";
import { useMyProducts } from "@/lib/hooks/useProducts";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const { products, isLoading: productsLoading } = useMyProducts();

  if (authLoading || !user) {
    return null;
  }

  return (
    <DashboardDisplay
      userName={user.name}
      productCount={productsLoading ? 0 : products.length}
      totalSales={0}
    />
  );
}
