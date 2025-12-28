"use client";

import { useRequireAuth } from "@/lib/utils/auth-redirect";
import { ProductEditor } from "@/components/products/product-editor";
import { useProductOperations } from "@/lib/hooks/useProductOperations";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateProductPage() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const router = useRouter();
  const { handleCreateProduct, isCreating } = useProductOperations();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (
    formData: { title: string; description: string; price: string },
    file: File | null
  ) => {
    if (!file) {
      throw new Error("Please select a file to upload");
    }

    const price = parseFloat(formData.price);

    try {
      setIsProcessing(true);
      await handleCreateProduct(
        {
          title: formData.title,
          description: formData.description,
          price: price,
        },
        file
      );
      router.push("/dashboard/products");
    } catch (error) {
      // Error handled by hook
      throw error;
    } finally {
      setIsProcessing(false);
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

  const isSubmitting = isCreating || isProcessing;

  return (
    <ProductEditor
      title="Create New Product"
      description="Sell your digital product on Ecomars"
      backUrl="/dashboard/products"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
