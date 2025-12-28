"use client";

import { useAuthContext } from "@/lib/contexts/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function useRequireAuth(redirectTo: string = "/login") {
  const { user, isLoading } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && !user) {
      // Get current path for return URL
      const currentPath = window.location.pathname + window.location.search;
      const returnUrl = encodeURIComponent(currentPath);

      // Add returnUrl to redirect if not already present
      const redirectUrl = redirectTo.includes("?")
        ? `${redirectTo}&returnUrl=${returnUrl}`
        : `${redirectTo}?returnUrl=${returnUrl}`;

      router.push(redirectUrl);
    }
  }, [user, isLoading, router, redirectTo]);

  return { user, isLoading };
}
