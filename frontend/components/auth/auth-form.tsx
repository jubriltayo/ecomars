"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

interface AuthFormProps {
  onSubmit: (e: React.FormEvent) => void;
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  isLoading: boolean;
  submitText: string;
  children?: ReactNode;
  showNameField?: boolean;
  name?: string;
  onNameChange?: (value: string) => void;
  showConfirmPassword?: boolean;
  confirmPassword?: string;
  onConfirmPasswordChange?: (value: string) => void;
}

export function AuthForm({
  onSubmit,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  isLoading,
  submitText,
  children,
  showNameField = false,
  name = "",
  onNameChange,
  showConfirmPassword = false,
  confirmPassword = "",
  onConfirmPasswordChange,
}: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {showNameField && onNameChange && (
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="bg-background/50"
            required
            disabled={isLoading}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="bg-background/50"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="bg-background/50"
          required
          disabled={isLoading}
        />
      </div>

      {showConfirmPassword && onConfirmPasswordChange && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            className="bg-background/50"
            required
            disabled={isLoading}
          />
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-linear-primary text-white"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : submitText}
      </Button>

      {children}
    </form>
  );
}
