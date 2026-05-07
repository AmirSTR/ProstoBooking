import "server-only";

import Stripe from "stripe";

import { requireServerEnv } from "@/lib/env/server";

export function createStripeClient() {
  return new Stripe(requireServerEnv("STRIPE_SECRET_KEY"));
}
