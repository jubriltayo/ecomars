"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Download,
  FileText,
  Calendar,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Order } from "@/lib/types";
import { toast } from "sonner";

interface PurchasesDisplayProps {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  onDownload: (productId: string, orderId: string) => Promise<void>;
  isDownloading: string | null;
}

export function PurchasesDisplay({
  orders,
  isLoading,
  error,
  onDownload,
  isDownloading,
}: PurchasesDisplayProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gradient-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Failed to load purchases</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="bg-linear-card border">
        <CardContent className="py-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary/10 flex items-center justify-center mb-4">
            <Download className="h-8 w-8 text-gradient-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Purchase your first digital product from the marketplace to see it
            here.
          </p>
          <Button
            asChild
            className="bg-linear-primary text-white hover:opacity-90"
          >
            <Link href="/products">Browse Products</Link>
          </Button>
        </CardContent>
      </Card>
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
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">My Purchases</h1>
        <p className="text-muted-foreground">
          Access all your purchased digital products
        </p>
      </div>

      {/* Purchases List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="space-y-4">
            {/* Order Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Order #{order.id.slice(-8)}
                </h3>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      order.status === "completed"
                        ? "text-green-600"
                        : "text-amber-600"
                    }`}
                  >
                    <CheckCircle className="h-3 w-3" />
                    <span className="capitalize">{order.status}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-bold text-gradient-primary text-lg">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              {order.items.map((item) => (
                <Card
                  key={item.id}
                  className="bg-linear-card border overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1">
                          {item.product.title}
                        </h4>
                        <p className="text-gradient-primary font-semibold">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      {item.product.fileUrl && (
                        <Button
                          size="sm"
                          className="bg-linear-primary text-white hover:opacity-90"
                          onClick={() => onDownload(item.productId, order.id)}
                          disabled={isDownloading === item.productId}
                        >
                          {isDownloading === item.productId ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-2" />
                          ) : (
                            <Download className="mr-2 h-3 w-3" />
                          )}
                          Download
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{item.product.fileName || "Digital Download"}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
