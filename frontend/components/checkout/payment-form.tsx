"use client";

import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, CreditCard, Calendar, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentForm({
  clientSecret,
  amount,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Payment system not ready");
      return;
    }

    try {
      setIsProcessing(true);

      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) {
        throw new Error("Card element not found");
      }

      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name,
            email,
          },
        },
      });

      if (error) {
        toast.error("Payment failed");
        onError("Payment failed");
        return;
      }

      toast.success("Payment successful!");
      onSuccess();
    } catch {
      toast.error("Payment failed");
      onError("Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const stripeElementStyle = {
    base: {
      fontSize: "16px",
      color: "#374151",
      "::placeholder": {
        color: "#9CA3AF",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="font-semibold">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50"
            />
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="space-y-4">
        <h3 className="font-semibold">Card Details</h3>

        {/* Card Number */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Card Number
          </Label>
          <div className="p-3 rounded-lg border bg-background/50">
            <CardNumberElement options={{ style: stripeElementStyle }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Expiry Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Expiry Date
            </Label>
            <div className="p-3 rounded-lg border bg-background/50">
              <CardExpiryElement options={{ style: stripeElementStyle }} />
            </div>
          </div>

          {/* CVC */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              CVC
            </Label>
            <div className="p-3 rounded-lg border bg-background/50">
              <CardCvcElement options={{ style: stripeElementStyle }} />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-linear-primary text-white hover:opacity-90 py-6 text-lg"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          "Processing..."
        ) : (
          <>
            <Lock className="mr-2 h-5 w-5" />
            Pay ${amount.toFixed(2)}
          </>
        )}
      </Button>

      {/* Security Note */}
      <div className="text-center text-xs text-muted-foreground">
        <p>Your payment is secured with 256-bit SSL encryption</p>
        <p className="mt-1">We never store your card details</p>
      </div>
    </form>
  );
}
