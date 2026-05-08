import "server-only";

import { addDays } from "@/lib/utils/date";
import { SUBSCRIPTION_PRICE } from "@/config/subscription";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase";

type UpsertSubscriptionInput = {
  businessId: string;
  provider: "stripe" | "yookassa";
  status: "trialing" | "active" | "past_due" | "canceled" | "unpaid";
  providerCustomerId?: string | null;
  providerSubscriptionId?: string | null;
  providerPaymentId?: string | null;
  currentPeriodEndsAt?: string | null;
  cancelAtPeriodEnd?: boolean;
};

type RecordPaymentEventInput = {
  provider: "stripe" | "yookassa";
  providerEventId: string;
  eventType: string;
  businessId?: string | null;
  payload: Json;
};

export async function upsertSubscription(input: UpsertSubscriptionInput) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("subscriptions").upsert(
  {
    business_id: input.businessId,
    provider: input.provider,
    provider_customer_id: input.providerCustomerId ?? null,
    provider_subscription_id: input.providerSubscriptionId ?? null,
    // ...
  } as any  // добавить это
)

  if (error) {
    throw new Error("Unable to update subscription.");
  }
}

export async function recordPaymentEvent(input: RecordPaymentEventInput) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("payment_events").insert({
    provider: input.provider,
    provider_event_id: input.providerEventId,
    event_type: input.eventType,
    business_id: input.businessId ?? null,
    payload: input.payload,
  });

  if (error && error.code !== "23505") {
    throw new Error("Unable to record payment event.");
  }

  return !error;
}
