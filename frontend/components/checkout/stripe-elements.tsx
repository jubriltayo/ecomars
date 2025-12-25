"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripeElementsProps {
  children: ReactNode;
}

export function StripeElements({ children }: StripeElementsProps) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
