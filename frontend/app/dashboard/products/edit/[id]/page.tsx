"use client";

import { useRequireAuth } from "@/lib/utils/auth-redirect";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  graphqlRequest,
  productsQueries,
  productsMutations,
  Product,
} from "@/lib/graphql/client";
import { useRouter, useParams } from "next/navigation";
import { ProductForm } from "@/components/products/product-form";

export default function EditProductPage() {
  const { user, isLoading } = useRequireAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && productId) {
      fetchProduct();
    }
  }, [user, productId]);

  const fetchProduct = async () => {
    try {
      setIsFetching(true);
      const { data } = await graphqlRequest<{ product: Product }>(
        productsQueries.getProduct,
        { id: productId }
      );

      if (data?.product) {
        setProduct(data.product);
      } else {
        toast.error("Product not found");
        router.push("/dashboard/products");
      }
    } catch (error: any) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
      router.push("/dashboard/products");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (
    formData: { title: string; description: string; price: string },
    file: File | null
  ) => {
    const price = parseFloat(formData.price);

    try {
      setIsSubmitting(true);

      // Prepare update data
      const updateData: any = {
        title: formData.title,
        description: formData.description,
        price: price,
      };

      // If new file is uploaded, handle it
      if (file) {
        // Upload new file (backend will delete old file)
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
          const errorText = await uploadResponse.text();
          throw new Error(`Upload failed: ${errorText}`);
        }

        const uploadResult = await uploadResponse.json();

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Upload failed");
        }

        // Add file info to update data
        updateData.fileUrl = uploadResult.fileUrl;
        updateData.fileName = uploadResult.fileName;
        updateData.fileSize = uploadResult.fileSize;
      }

      // Update product in Hasura
      const { data: updateDataResult, errors } = await graphqlRequest(
        productsMutations.updateProduct,
        {
          id: productId,
          input: updateData,
        }
      );

      if (errors) {
        throw new Error(errors[0]?.message || "Failed to update product");
      }

      toast.success("Product updated successfully!");
      router.push(`/dashboard/products`);
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(error.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isFetching || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto rounded-full bg-gradient-primary animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
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
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">Update your digital product</p>
      </div>

      <ProductForm
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
    </div>
  );
}
