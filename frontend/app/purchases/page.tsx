"use client";

import { useRequireAuth } from "@/lib/utils/auth-redirect";
import { PurchasesDisplay } from "@/components/purchases/purchases-display";
import { useOrders } from "@/lib/hooks/useOrders";
import { useState } from "react";

export default function PurchasesPage() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const { orders, isLoading, error, downloadProduct } = useOrders();
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const handleDownload = async (productId: string, orderId: string) => {
    try {
      setIsDownloading(productId);
      const downloadUrl = await downloadProduct(productId, orderId);
      if (downloadUrl) {
        window.location.href = downloadUrl;
      }
    } catch {
      // Error handled by hook
    } finally {
      setIsDownloading(null);
    }
  };

  if (authLoading || !user) {
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
    <PurchasesDisplay
      orders={orders}
      isLoading={isLoading}
      error={error}
      onDownload={handleDownload}
      isDownloading={isDownloading}
    />
  );
}
