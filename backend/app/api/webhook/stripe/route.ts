import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/config";
import { hasuraClient } from "@/lib/hasura";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        if (paymentIntent.metadata?.orderId) {
          await hasuraClient.updateOrderStatus(
            paymentIntent.metadata.orderId,
            "completed",
            paymentIntent.id
          );
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const failedPayment = event.data.object;

        if (failedPayment.metadata?.orderId) {
          await hasuraClient.updateOrderStatus(
            failedPayment.metadata.orderId,
            "failed"
          );
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
