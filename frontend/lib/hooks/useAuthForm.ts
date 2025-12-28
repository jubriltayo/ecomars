"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseAuthFormProps {
  isLogin?: boolean;
  onSubmit: (data: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<void>;
}

export function useAuthForm({ isLogin = false, onSubmit }: UseAuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validation
      if (!isLogin) {
        if (!name.trim()) {
          toast.error("Name is required");
          return;
        }
        if (password !== confirmPassword) {
          toast.error("Passwords don't match");
          return;
        }
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters");
          return;
        }
      }

      try {
        setIsLoading(true);
        await onSubmit({
          email,
          password,
          name: !isLogin ? name : undefined,
        });
      } catch (error: any) {
        toast.error(
          error.message || `${isLogin ? "Login" : "Registration"} failed`
        );
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, name, confirmPassword, isLogin, onSubmit]
  );

  const handleOAuth = useCallback((provider: "google" | "github") => {
    if (provider === "github") {
      toast.info("GitHub login is coming soon!", {
        description:
          "We're working on adding GitHub authentication. Please use Google or email for now.",
      });
      return;
    }

    // Google OAuth
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
    window.location.href = `${backendUrl}/api/auth/google`;
  }, []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    handleSubmit,
    handleGoogleLogin: () => handleOAuth("google"),
    handleGithubLogin: () => handleOAuth("github"),
  };
}
