"use client";

import { useRequireAuth } from "@/lib/utils/auth-redirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, DollarSign, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { graphqlRequest, productsMutations } from "@/lib/graphql/client";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/products/product-form";

export default function CreateProductPage() {
  const { user, isLoading } = useRequireAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    formData: { title: string; description: string; price: string },
    file: File | null
  ) => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const price = parseFloat(formData.price);

    try {
      setIsSubmitting(true);

      // 1. First create the product in Hasura
      const { data: productData, errors: productErrors } = await graphqlRequest(
        productsMutations.createProduct,
        {
          input: {
            title: formData.title,
            description: formData.description,
            price: price,
          },
        }
      );

      if (productErrors || !productData?.createProduct) {
        throw new Error("Failed to create product");
      }

      const productId = productData.createProduct.id;

      // 2. Upload the file to our backend
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("productId", productId);

      const uploadResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
        }/api/upload`,
        {
          method: "POST",
          credentials: "include",
          body: uploadFormData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      const uploadResult = await uploadResponse.json();

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Upload failed");
      }

      toast.success("Product created successfully!");
      router.push(`/dashboard/products`);
    } catch (error: any) {
      console.error("Error creating product:", error);
      toast.error(error.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
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
      <div>
        <Button
          variant="ghost"
          asChild
          className="pl-0 mb-4 hover:bg-transparent"
        >
          <Link href="/dashboard/products" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Product</h1>
        <p className="text-muted-foreground">
          Sell your digital product on Ecomars
        </p>
      </div>

      <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
