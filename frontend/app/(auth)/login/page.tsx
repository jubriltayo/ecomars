"use client";

import { useAuthContext } from "@/lib/contexts/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { AuthFooter } from "@/components/auth/auth-footer";
import { useAuthForm } from "@/lib/hooks/useAuthForm";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const { login } = useAuthContext();

  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleSubmit,
    handleGoogleLogin,
    handleGithubLogin,
  } = useAuthForm({
    isLogin: true,
    onSubmit: async (data) => {
      await login(data.email, data.password);
      router.push(returnUrl);
    },
  });

  return (
    <AuthCard
      title="Welcome Back"
      description="Sign in to your account"
      footer={
        <AuthFooter
          text="Don't have an account?"
          linkText="Sign up"
          linkHref={`/signup${
            returnUrl !== "/"
              ? `?returnUrl=${encodeURIComponent(returnUrl)}`
              : ""
          }`}
        />
      }
    >
      <AuthForm
        onSubmit={handleSubmit}
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        isLoading={isLoading}
        submitText="Sign in"
      />

      <OAuthButtons
        onGoogleLogin={handleGoogleLogin}
        onGithubLogin={handleGithubLogin}
        isLoading={isLoading}
      />
    </AuthCard>
  );
}
