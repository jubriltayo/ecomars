"use client";

import { useAuthContext } from "@/lib/contexts/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { AuthFooter } from "@/components/auth/auth-footer";
import { useAuthForm } from "@/lib/hooks/useAuthForm";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const { register } = useAuthContext();

  const {
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
    handleGoogleLogin,
    handleGithubLogin,
  } = useAuthForm({
    isLogin: false,
    onSubmit: async (data) => {
      await register(data.name!, data.email, data.password);
      router.push(returnUrl);
    },
  });

  return (
    <AuthCard
      title="Create Account"
      description="Join Ecomars to start selling and buying digital products"
      footer={
        <AuthFooter
          text="Already have an account?"
          linkText="Sign in"
          linkHref={`/login${
            returnUrl !== "/"
              ? `?returnUrl=${encodeURIComponent(returnUrl)}`
              : ""
          }`}
        />
      }
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-4 pl-0 hover:bg-transparent"
        >
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <OAuthButtons
        onGoogleLogin={handleGoogleLogin}
        onGithubLogin={handleGithubLogin}
        isLoading={isLoading}
      />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">OR</span>
        </div>
      </div>

      <AuthForm
        onSubmit={handleSubmit}
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        isLoading={isLoading}
        submitText="Create Account"
        showNameField={true}
        name={name}
        onNameChange={setName}
        showConfirmPassword={true}
        confirmPassword={confirmPassword}
        onConfirmPasswordChange={setConfirmPassword}
      />
    </AuthCard>
  );
}
