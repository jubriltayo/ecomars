"use client";

import { useRequireAuth } from "@/lib/utils/auth-redirect";
import { ProductEditor } from "@/components/products/product-editor";
import { useProduct } from "@/lib/hooks/useProducts";
import { useProductOperations } from "@/lib/hooks/useProductOperations";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditProductPage() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const {
    product,
    isLoading: isFetching,
    error: fetchError,
  } = useProduct(productId);
  const { handleUpdateProduct, isUpdating } = useProductOperations(); // Fixed import
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (fetchError) {
      toast.error("Failed to load product");
      router.push("/dashboard/products");
    }
  }, [fetchError, router]);

  const handleSubmit = async (
    formData: { title: string; description: string; price: string },
    file: File | null
  ) => {
    const price = parseFloat(formData.price);

    try {
      setIsProcessing(true);
      await handleUpdateProduct(
        productId,
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

  if (isFetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto rounded-full bg-gradient-primary animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The product you're trying to edit doesn't exist.
        </p>
        <button
          onClick={() => router.push("/dashboard/products")}
          className="px-4 py-2 rounded-lg bg-linear-primary text-white hover:opacity-90"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const isSubmitting = isUpdating || isProcessing;

  return (
    <ProductEditor
      title="Edit Product"
      description="Update your digital product"
      backUrl="/dashboard/products"
      initialData={{
        id: product.id,
        title: product.title,
        description: product.description || "",
        price: product.price,
        fileName: product.fileName || undefined,
        fileUrl: product.fileUrl || undefined,
      }}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
