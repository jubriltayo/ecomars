"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ShoppingBag,
  Download,
  Shield,
  Clock,
  Star,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/lib/hooks/useProducts";
import { toast } from "sonner";
import { useCart } from "@/lib/contexts/cart-context";
import { convertToProductCardDataSingle } from "@/lib/utils/product-utils";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { product, isLoading, error } = useProduct(productId);
  const { addToCart } = useCart();

  useEffect(() => {
    if (error) {
      toast.error("Failed to load product details");
    }
  }, [error]);

  const handleAddToCart = () => {
    if (!product) {
      toast.error("Product not available");
      return;
    }

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
    });

    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!product) {
      toast.error("Product not available");
      return;
    }

    // Add to cart first
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
    });

    // Then redirect to checkout
    toast.success("Added to cart! Redirecting to checkout...");
    router.push("/checkout");
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
          <Link href="/products" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="h-12 w-3/4 bg-gradient-card rounded-lg animate-pulse" />
            <div className="h-4 w-1/4 bg-gradient-card rounded-lg animate-pulse" />
          </div>
          <div className="h-[500px] bg-gradient-card rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-16 space-y-4">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="text-muted-foreground">
          The product you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  const fileSizeInMB = product.fileSize
    ? (product.fileSize / (1024 * 1024)).toFixed(1)
    : "Unknown";

  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <div>
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
          <Link href="/products" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Product Info */}
        <div className="space-y-6">
          {/* Product Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {product.title}
            </h1>
            <div className="flex items-center gap-4">
              <Badge className="bg-linear-warm text-white text-lg px-4 py-1">
                ${product.price.toFixed(2)}
              </Badge>
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description || "No description available."}
            </p>
          </div>

          {/* File Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">File Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-linear-card border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-linear-primary rounded-lg">
                    <Download className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Format</p>
                    <p className="font-medium">
                      {product.fileName?.split(".").pop()?.toUpperCase() ||
                        "PDF"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-linear-card border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-linear-warm rounded-lg">
                    <ShoppingBag className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Size</p>
                    <p className="font-medium">{fileSizeInMB} MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Purchase Card */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="rounded-2xl bg-linear-card border p-6 space-y-6">
            {/* Preview Image */}
            <div className="h-64 rounded-xl bg-gradient-primary flex items-center justify-center">
              <ShoppingBag className="h-24 w-24 text-white" />
            </div>

            {/* Purchase Info */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient-primary">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  One-time purchase
                </p>
              </div>

              <Separator />

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Instant digital download</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Secure payment processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <span className="text-sm">Lifetime access</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleBuyNow}
                  className="w-full bg-linear-primary text-white hover:opacity-90 py-6 text-lg"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Buy Now
                </Button>
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="w-full btn-start-selling py-6 text-lg"
                >
                  Add to Cart
                </Button>
              </div>

              {/* Guarantee */}
              <div className="text-center pt-4">
                <p className="text-xs text-muted-foreground">
                  30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
