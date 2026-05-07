export const SUBSCRIPTION_PRICE = {
  amountCents: 14900,
  amountRubles: 149,
  currency: "RUB",
  interval: "month",
  trialDays: 14,
  weeklyFreeBookingLimit: 5,
} as const;

export const SUBSCRIPTION_FEATURES = [
  "Unlimited weekly bookings",
  "Dashboard access for daily operations",
  "Services and availability management",
] as const;

