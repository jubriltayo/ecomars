"use client";

import { useState } from "react";
import { toast } from "sonner";

interface FileUploadResult {
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (
    file: File,
    productId: string
  ): Promise<FileUploadResult> => {
    try {
      setIsUploading(true);

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("productId", productId);

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      const uploadResponse = await fetch(`${backendUrl}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const uploadResult = await uploadResponse.json();

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Upload failed");
      }

      return {
        fileUrl: uploadResult.fileUrl,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
      };
    } catch (error: any) {
      toast.error(error.message || "File upload failed");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading };
}
