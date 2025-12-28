"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProductForm } from "./product-form";

interface ProductEditorProps {
  title: string;
  description: string;
  backUrl: string;
  initialData?: {
    id?: string;
    title: string;
    description: string;
    price: number;
    fileName?: string;
    fileUrl?: string;
  };
  onSubmit: (
    formData: { title: string; description: string; price: string },
    file: File | null
  ) => Promise<void>;
  isSubmitting: boolean;
}

export function ProductEditor({
  title,
  description,
  backUrl,
  initialData,
  onSubmit,
  isSubmitting,
}: ProductEditorProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          asChild
          className="pl-0 mb-4 hover:bg-transparent"
        >
          <Link href={backUrl} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Product Form */}
      <ProductForm
        initialData={initialData}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
