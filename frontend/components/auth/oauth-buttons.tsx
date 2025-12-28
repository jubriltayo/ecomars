"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

interface OAuthButtonsProps {
  onGoogleLogin: () => void;
  onGithubLogin: () => void;
  isLoading: boolean;
}

export function OAuthButtons({
  onGoogleLogin,
  onGithubLogin,
  isLoading,
}: OAuthButtonsProps) {
  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full hover:bg-accent/10"
          onClick={onGoogleLogin}
          disabled={isLoading}
        >
          <FcGoogle className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="w-full hover:bg-accent/10 relative group"
          onClick={onGithubLogin}
          disabled={isLoading}
        >
          <FaGithub className="mr-2 h-4 w-4" />
          Continue with GitHub
          <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
            Soon
          </span>
          {/* Tooltip on hover */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Coming soon!
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </Button>
      </div>
    </>
  );
}
