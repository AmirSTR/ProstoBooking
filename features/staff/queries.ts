import "server-only";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPremiumGateForBusiness, type PremiumGate } from "@/features/billing/gating";
import { formatMoney } from "@/features/bookings/queries";
import type { Enums } from "@/lib/supabase";

export type DashboardBooking = {
  id: string;
  time: string;
  client: string;
  service: string;
  duration: string;
  status: string;
};

export type DashboardService = {
  id: string;
  name: string;
  duration: string;
  price: string;
  isVisible: boolean;
};

export type DashboardScheduleSetting = {
  label: string;
  value: string;
};

export type MasterDashboardData = {
  business: {
    id: string;
    name: string;
    slug: string;
    currency: string;
  };
  metrics: {
    bookings: string;
    revenue: string;
    openSlots: string;
  };
  upcomingBookings: DashboardBooking[];
  services: DashboardService[];
  scheduleSettings: DashboardScheduleSetting[];
  premiumGate: PremiumGate;
};

type MembershipResult = {
  role: Enums<"business_member_role">;
  businesses: {
    id: string;
    name: string;
    slug: string;
    currency: string;
  } | null;
};

type BookingResult = {
  id: string;
  starts_at: string;
  ends_at: string;
  status: Enums<"booking_status">;
  customer_name: string;
  services: {
    name: string;
    duration_minutes: number;
    price_cents?: number;
  } | null;
};

export async function getMasterDashboardData(): Promise<MasterDashboardData> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/sign-in");
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("business_members")
    .select("role,businesses(id,name,slug,currency)")
    .eq("profile_id", user.id)
    .limit(1)
    .returns<MembershipResult[]>();

  if (membershipError) {
    throw new Error("Unable to load business membership.");
  }

  const business = memberships?.[0]?.businesses;

  if (!business) {
    throw new Error("No business is connected to this account.");
  }

  const todayRange = getTodayRange();

  const [
    { data: upcomingBookings, error: upcomingError },
    { data: services, error: servicesError },
    { data: todayBookings, error: todayBookingsError },
    { data: availability, error: availabilityError },
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select("id,starts_at,ends_at,status,customer_name,services(name,duration_minutes)")
      .eq("business_id", business.id)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(5)
      .returns<BookingResult[]>(),
    supabase
      .from("services")
      .select("id,name,duration_minutes,price_cents,is_visible")
      .eq("business_id", business.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("bookings")
      .select("id,services(price_cents)")
      .eq("business_id", business.id)
      .gte("starts_at", todayRange.start)
      .lte("starts_at", todayRange.end)
      .neq("status", "cancelled")
      .returns<Array<{ id: string; services: { price_cents: number } | null }>>(),
    supabase
      .from("availability_rules")
      .select("weekday,start_time,end_time,buffer_minutes")
      .eq("business_id", business.id)
      .eq("is_active", true)
      .order("weekday", { ascending: true }),
  ]);

  if (upcomingError) {
    throw new Error("Unable to load upcoming bookings.");
  }

  if (servicesError) {
    throw new Error("Unable to load services.");
  }

  if (todayBookingsError) {
    throw new Error("Unable to load dashboard metrics.");
  }

  if (availabilityError) {
    throw new Error("Unable to load schedule settings.");
  }

  const revenueCents = (todayBookings ?? []).reduce(
    (total, booking) => total + (booking.services?.price_cents ?? 0),
    0,
  );

  const premiumGate = await getPremiumGateForBusiness(business.id);

  return {
    business,
    metrics: {
      bookings: String(todayBookings?.length ?? 0),
      revenue: formatMoney(revenueCents, business.currency),
      openSlots: String(availability?.length ?? 0),
    },
    upcomingBookings: (upcomingBookings ?? []).map((booking) => ({
      id: booking.id,
      time: formatTime(booking.starts_at),
      client: booking.customer_name,
      service: booking.services?.name ?? "Service",
      duration: `${booking.services?.duration_minutes ?? 0} min`,
      status: formatStatus(booking.status),
    })),
    services: (services ?? []).map((service) => ({
      id: service.id,
      name: service.name,
      duration: `${service.duration_minutes} min`,
      price: formatMoney(service.price_cents, business.currency),
      isVisible: service.is_visible,
    })),
    scheduleSettings: buildScheduleSettings(availability ?? []),
    premiumGate,
  };
}

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function formatStatus(status: Enums<"booking_status">) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildScheduleSettings(
  availability: Array<{
    weekday: number;
    start_time: string;
    end_time: string;
    buffer_minutes: number;
  }>,
) {
  if (availability.length === 0) {
    return [
      { label: "Working days", value: "Not configured" },
      { label: "Hours", value: "Not configured" },
      { label: "Buffer time", value: "Not configured" },
      { label: "Booking window", value: "30 days" },
    ];
  }

  const weekdays = availability.map((rule) => weekdayLabel(rule.weekday));
  const firstRule = availability[0];

  return [
    { label: "Working days", value: compactWeekdays(weekdays) },
    {
      label: "Hours",
      value: `${trimTime(firstRule.start_time)} - ${trimTime(firstRule.end_time)}`,
    },
    { label: "Buffer time", value: `${firstRule.buffer_minutes} min` },
    { label: "Booking window", value: "30 days" },
  ];
}

function weekdayLabel(weekday: number) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][weekday] ?? "Day";
}

function compactWeekdays(weekdays: string[]) {
  return Array.from(new Set(weekdays)).join(", ");
}

function trimTime(value: string) {
  return value.slice(0, 5);
}
