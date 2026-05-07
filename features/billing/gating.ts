import "server-only";

import { addDays, startOfWeek } from "@/lib/utils/date";
import { SUBSCRIPTION_PRICE } from "@/config/subscription";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type PremiumGate = {
  isPremium: boolean;
  isTrialing: boolean;
  trialEndsAt: string;
  weeklyBookingCount: number;
  weeklyBookingLimit: number;
  remainingWeeklyBookings: number;
  reason: "active" | "trialing" | "limited";
};

export async function getPremiumGateForBusiness(
  businessId: string,
): Promise<PremiumGate> {
  const supabase = createSupabaseAdminClient();
  const now = new Date();

  const [{ data: business }, { data: subscription }, { count }] = await Promise.all([
    supabase
      .from("businesses")
      .select("created_at")
      .eq("id", businessId)
      .single(),
    supabase
      .from("subscriptions")
      .select("status,trial_ends_at,current_period_ends_at")
      .eq("business_id", businessId)
      .maybeSingle(),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("business_id", businessId)
      .gte("created_at", startOfWeek(now).toISOString())
      .neq("status", "cancelled"),
  ]);

  const trialStart = business?.created_at ? new Date(business.created_at) : now;
  const defaultTrialEndsAt = addDays(trialStart, SUBSCRIPTION_PRICE.trialDays).toISOString();
  const trialEndsAt = subscription?.trial_ends_at ?? defaultTrialEndsAt;
  const isTrialing =
    subscription?.status === "trialing" || new Date(trialEndsAt).getTime() > now.getTime();
  const isActive =
    subscription?.status === "active" &&
    (!subscription.current_period_ends_at ||
      new Date(subscription.current_period_ends_at).getTime() > now.getTime());
  const weeklyBookingCount = count ?? 0;
  const remainingWeeklyBookings = Math.max(
    SUBSCRIPTION_PRICE.weeklyFreeBookingLimit - weeklyBookingCount,
    0,
  );

  return {
    isPremium: isActive || isTrialing,
    isTrialing,
    trialEndsAt,
    weeklyBookingCount,
    weeklyBookingLimit: SUBSCRIPTION_PRICE.weeklyFreeBookingLimit,
    remainingWeeklyBookings,
    reason: isActive ? "active" : isTrialing ? "trialing" : "limited",
  };
}

export function canCreateBooking(gate: PremiumGate) {
  return gate.isPremium || gate.weeklyBookingCount < gate.weeklyBookingLimit;
}
