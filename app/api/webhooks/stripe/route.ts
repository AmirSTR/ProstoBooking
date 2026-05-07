import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { recordPaymentEvent, upsertSubscription } from "@/features/billing/subscription-service";
import { requireServerEnv } from "@/lib/env/server";
import { createStripeClient } from "@/lib/payments/stripe";
import type { Json } from "@/lib/supabase";

export async function POST(request: Request) {
  const stripe = createStripeClient();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      requireServerEnv("STRIPE_WEBHOOK_SECRET"),
    );
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  const businessId = getStripeBusinessId(event);
  const shouldProcess = await recordPaymentEvent({
    provider: "stripe",
    providerEventId: event.id,
    eventType: event.type,
    businessId,
    payload: event as unknown as Json,
  });

  if (!shouldProcess) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const subscriptionId =
      typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

    if (businessId && subscriptionId) {
      await upsertSubscription({
        businessId,
        provider: "stripe",
        providerCustomerId:
          typeof session.customer === "string" ? session.customer : session.customer?.id,
        providerSubscriptionId: subscriptionId,
        status: "trialing",
      });
    }
  }

  if (event.type.startsWith("customer.subscription.")) {
    const subscription = event.data.object as Stripe.Subscription;
    const status = mapStripeStatus(subscription.status);
    const subscriptionBusinessId = subscription.metadata.business_id ?? businessId;

    if (subscriptionBusinessId) {
      await upsertSubscription({
        businessId: subscriptionBusinessId,
        provider: "stripe",
        providerCustomerId:
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id,
        providerSubscriptionId: subscription.id,
        status,
        currentPeriodEndsAt: subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      });
    }
  }

  return NextResponse.json({ received: true });
}

function getStripeBusinessId(event: Stripe.Event) {
  const object = event.data.object as {
    metadata?: { business_id?: string };
    client_reference_id?: string | null;
  };

  return object.metadata?.business_id ?? object.client_reference_id ?? null;
}

function mapStripeStatus(status: Stripe.Subscription.Status) {
  if (status === "active" || status === "trialing") {
    return status;
  }

  if (status === "past_due") {
    return "past_due";
  }

  if (status === "unpaid") {
    return "unpaid";
  }

  return "canceled";
}
