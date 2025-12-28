"use client";

import Link from "next/link";

interface AuthFooterProps {
  text: string;
  linkText: string;
  linkHref: string;
}

export function AuthFooter({ text, linkText, linkHref }: AuthFooterProps) {
  return (
    <p className="text-sm text-muted-foreground">
      {text}{" "}
      <Link
        href={linkHref}
        className="text-primary hover:underline font-medium"
      >
        {linkText}
      </Link>
    </p>
  );
}
