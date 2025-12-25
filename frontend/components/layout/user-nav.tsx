"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Package, Download, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/contexts/auth-context";
import Link from "next/link";

export function UserNav() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-muted to-muted/70 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild className="hover:bg-muted/50">
          <Link href="/login" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Log In
          </Link>
        </Button>
        <Button
          asChild
          className="bg-linear-primary hover:opacity-90 text-white"
        >
          <Link href="/signup" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Sign Up
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9 border-2 border-primary/20">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="bg-linear-primary text-white">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/products">
              <Package className="mr-2 h-4 w-4" />
              <span>My Products</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/purchases">
              <Download className="mr-2 h-4 w-4" />
              <span>My Purchases</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
