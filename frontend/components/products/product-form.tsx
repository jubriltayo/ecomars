"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Upload, DollarSign, FileText, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProductFormData {
  title: string;
  description: string;
  price: string;
}

interface ProductFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    price: number;
    fileName?: string;
    fileUrl?: string;
  };
  onSubmit: (data: ProductFormData, file: File | null) => Promise<void>;
  isSubmitting: boolean;
}

export function ProductForm({
  initialData,
  onSubmit,
  isSubmitting,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price ? initialData.price.toString() : "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Validate file size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size must be less than 100MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/zip",
      "application/x-rar-compressed",
      "application/epub+zip",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/gif",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "File type not supported. Please upload PDF, ZIP, DOC, EPUB, or image files."
      );
      return;
    }

    setSelectedFile(file);
    toast.success("File selected successfully");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0.01 || price > 10000) {
      toast.error("Price must be between $0.01 and $10,000");
      return;
    }

    if (!initialData?.id && !selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    await onSubmit(formData, selectedFile);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Product Details Card */}
          <Card className="bg-linear-card border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Digital Marketing Masterclass"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground">
                  A clear, descriptive title that catches attention
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your product in detail. What will buyers learn or receive?"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground">
                  Be detailed about what buyers will receive
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (USD) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="10000"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="pl-10 bg-background/50"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Price must be between $0.01 and $10,000
                </p>
              </div>
            </CardContent>
          </Card>

          {/* File Upload Card */}
          <Card className="bg-linear-card border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                File Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div
                  className={`border-2 ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-primary/30"
                  } border-dashed rounded-2xl p-8 text-center hover:border-primary/50 transition-colors`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary/10 flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-gradient-primary" />
                  </div>

                  {selectedFile || initialData?.fileName ? (
                    <>
                      <h3 className="font-semibold mb-2">
                        {selectedFile?.name || initialData?.fileName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {selectedFile
                          ? `${(selectedFile.size / (1024 * 1024)).toFixed(
                              2
                            )} MB`
                          : "File already uploaded"}
                      </p>
                      <div className="space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("file-upload")?.click()
                          }
                        >
                          Change File
                        </Button>
                        {selectedFile && (
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setSelectedFile(null)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold mb-2">
                        {isDragging
                          ? "Drop file here"
                          : "Drag & drop or click to upload"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        PDF, ZIP, DOC, EPUB, or images up to 100MB
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                      >
                        Browse Files
                      </Button>
                    </>
                  )}

                  {/* Hidden file input */}
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.zip,.rar,.epub,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
                  />
                </div>

                {(selectedFile || initialData?.fileName) && (
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">
                          {initialData?.id && !selectedFile
                            ? "File already uploaded"
                            : "File ready for upload"}
                        </p>
                        <p className="text-sm text-green-600">
                          {selectedFile?.name || initialData?.fileName}
                          {selectedFile &&
                            ` • ${(selectedFile.size / (1024 * 1024)).toFixed(
                              2
                            )} MB`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Supported Formats:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    PDF
                  </span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    ZIP
                  </span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    DOC/DOCX
                  </span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    EPUB
                  </span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    JPG/PNG
                  </span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    TXT
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview & Submit */}
        <div className="space-y-6">
          {/* Publish Card */}
          <Card className="bg-linear-card border">
            <CardHeader>
              <CardTitle>{initialData?.id ? "Update" : "Publish"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Product will be:</span>
                  <span className="font-medium text-green-600">
                    {initialData?.id
                      ? "Updated Immediately"
                      : "Published Immediately"}
                  </span>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-medium">Platform Fee:</h4>
                  <div className="text-2xl font-bold text-gradient-primary">
                    0%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You receive 100% of the sale price
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-linear-primary text-white hover:opacity-90 py-6 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? initialData?.id
                    ? "Updating Product..."
                    : "Creating Product..."
                  : initialData?.id
                  ? "Update Product"
                  : "Publish Product"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By publishing, you agree to our Terms of Service
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
