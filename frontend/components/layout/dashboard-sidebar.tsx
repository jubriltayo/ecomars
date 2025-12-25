"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Products",
    href: "/dashboard/products",
    icon: Package,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-64 border-r glass">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Seller Panel</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your products
        </p>
      </div>

      <Separator />

      <nav className="p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
