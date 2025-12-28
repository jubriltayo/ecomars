"use client";

import { useCreateProduct, useUpdateProduct } from "./useProducts";
import { useFileUpload } from "./useFileUpload";
import { toast } from "sonner";

export function useProductOperations() {
  const { createProduct, isLoading: isCreating } = useCreateProduct();
  const { updateProduct, isLoading: isUpdating } = useUpdateProduct();
  const { uploadFile, isUploading } = useFileUpload();

  const handleCreateProduct = async (
    productData: { title: string; description: string; price: number },
    file: File
  ) => {
    try {
      // 1. Create product in database
      const productResult = await createProduct(productData);

      if (!productResult?.id) {
        throw new Error("Failed to create product");
      }

      const productId = productResult.id;

      // 2. Upload file
      const fileResult = await uploadFile(file, productId);

      // 3. Update product with file info
      await updateProduct(productId, {
        fileUrl: fileResult.fileUrl,
        fileName: fileResult.fileName,
        fileSize: fileResult.fileSize,
      });

      toast.success("Product created successfully!");
      return productId;
    } catch (error: any) {
      toast.error(error.message || "Failed to create product");
      throw error;
    }
  };

  const handleUpdateProduct = async (
    productId: string,
    productData: { title?: string; description?: string; price?: number },
    file: File | null
  ) => {
    try {
      const updateData: any = { ...productData };

      // If new file is uploaded
      if (file) {
        const fileResult = await uploadFile(file, productId);
        updateData.fileUrl = fileResult.fileUrl;
        updateData.fileName = fileResult.fileName;
        updateData.fileSize = fileResult.fileSize;
      }

      // Update product
      await updateProduct(productId, updateData);
      toast.success("Product updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update product");
      throw error;
    }
  };

  return {
    handleCreateProduct,
    handleUpdateProduct,
    isCreating: isCreating || isUploading,
    isUpdating: isUpdating || isUploading,
  };
}
