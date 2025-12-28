"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface DashboardDisplayProps {
  userName: string;
  productCount: number;
  totalSales?: number;
}

export function DashboardDisplay({
  userName,
  productCount,
  totalSales = 0,
}: DashboardDisplayProps) {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground">
          Manage your products and track sales
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-linear-card border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Products</p>
                <p className="text-3xl font-bold mt-1">{productCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-primary/10">
                <Package className="h-8 w-8 text-gradient-primary" />
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/dashboard/products">Manage Products</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-linear-card border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-3xl font-bold mt-1">
                  ${totalSales.toFixed(2)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-warm/10">
                <ShoppingBag className="h-8 w-8 text-gradient-warm" />
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" disabled>
              View Sales
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <Button
            asChild
            className="w-full justify-start bg-linear-primary text-white hover:opacity-90"
          >
            <Link href="/dashboard/products/new">
              <Package className="mr-2 h-4 w-4" />
              Create New Product
              <ArrowRight className="ml-auto h-4 w-4" />
            </Link>
          </Button>

          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Marketplace
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
