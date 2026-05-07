"use server";

import { redirect } from "next/navigation";

import { SUBSCRIPTION_PRICE } from "@/config/subscription";
import { getOwnedBusinessForCurrentUser } from "@/features/billing/queries";
import { createStripeClient } from "@/lib/payments/stripe";
import { createYooKassaPayment } from "@/lib/payments/yookassa";
import { requireServerEnv } from "@/lib/env/server";

export async function createStripeCheckoutAction() {
  const business = await getOwnedBusinessForCurrentUser();
  const stripe = createStripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    client_reference_id: business.id,
    customer_email: business.ownerEmail,
    success_url: requireServerEnv("STRIPE_SUCCESS_URL"),
    cancel_url: requireServerEnv("STRIPE_CANCEL_URL"),
    line_items: [
      {
        price: requireServerEnv("STRIPE_PRICE_ID"),
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: SUBSCRIPTION_PRICE.trialDays,
      metadata: {
        business_id: business.id,
      },
    },
    metadata: {
      business_id: business.id,
    },
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  redirect(session.url);
}

export async function createYooKassaCheckoutAction() {
  const business = await getOwnedBusinessForCurrentUser();
  const payment = await createYooKassaPayment({
    businessId: business.id,
    description: `BookingOS subscription for ${business.name}`,
    returnUrl: requireServerEnv("YOOKASSA_RETURN_URL"),
  });

  redirect(payment.confirmation!.confirmation_url!);
}

