import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase";

export type PublicBookingService = {
  id: string;
  name: string;
  description: string;
  duration: string;
  durationMinutes: number;
  price: string;
  priceCents: number;
};

export type PublicBookingDate = {
  id: string;
  label: string;
  day: string;
  month: string;
  weekday: number;
};

export type PublicBookingTime = {
  dateId: string;
  value: string;
};

export type PublicBookingPageData = {
  business: Pick<Tables<"businesses">, "id" | "name" | "slug" | "currency" | "timezone">;
  services: PublicBookingService[];
  dates: PublicBookingDate[];
  times: PublicBookingTime[];
};

type AvailabilityRule = Pick<
  Tables<"availability_rules">,
  "weekday" | "start_time" | "end_time" | "buffer_minutes"
>;

export async function getPublicBookingPageData(
  businessSlug: string,
): Promise<PublicBookingPageData> {
  const supabase = await createSupabaseServerClient();

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id,name,slug,currency,timezone")
    .eq("slug", businessSlug)
    .single();

  if (businessError || !business) {
    throw new Error("Business was not found.");
  }

  const [{ data: services, error: servicesError }, { data: availability, error: availabilityError }] =
    await Promise.all([
      supabase
        .from("services")
        .select("id,name,description,duration_minutes,price_cents,is_visible")
        .eq("business_id", business.id)
        .eq("is_visible", true)
        .order("created_at", { ascending: true }),
      supabase
        .from("availability_rules")
        .select("weekday,start_time,end_time,buffer_minutes")
        .eq("business_id", business.id)
        .eq("is_active", true),
    ]);

  if (servicesError) {
    throw new Error("Unable to load services.");
  }

  if (availabilityError) {
    throw new Error("Unable to load availability.");
  }

  const dates = buildBookingDates(availability ?? []);
  const times = buildBookingTimes(dates, availability ?? []);

  return {
    business,
    services: (services ?? []).map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description ?? "Book this service online.",
      duration: `${service.duration_minutes} min`,
      durationMinutes: service.duration_minutes,
      price: formatMoney(service.price_cents, business.currency),
      priceCents: service.price_cents,
    })),
    dates,
    times,
  };
}

function buildBookingDates(availability: AvailabilityRule[]) {
  if (availability.length === 0) {
    return [];
  }

  const availableWeekdays = new Set(availability.map((rule) => rule.weekday));
  const formatter = new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "2-digit",
  });
  const dates: PublicBookingDate[] = [];
  const today = new Date();

  for (let offset = 0; offset < 14 && dates.length < 7; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);

    const weekday = date.getDay();
    if (availableWeekdays.size > 0 && !availableWeekdays.has(weekday)) {
      continue;
    }

    const parts = formatter.formatToParts(date);
    const label = parts.find((part) => part.type === "weekday")?.value ?? "";
    const month = parts.find((part) => part.type === "month")?.value ?? "";
    const day = parts.find((part) => part.type === "day")?.value ?? "";

    dates.push({
      id: toDateId(date),
      label,
      month,
      day,
      weekday,
    });
  }

  return dates;
}

function buildBookingTimes(
  dates: PublicBookingDate[],
  availability: AvailabilityRule[],
) {
  return dates.flatMap((date) => {
    const rules = availability.filter((rule) => rule.weekday === date.weekday);

    return rules.flatMap((rule) =>
      buildTimesForRule(rule).map((time) => ({
        dateId: date.id,
        value: time,
      })),
    );
  });
}

function buildTimesForRule(rule: AvailabilityRule) {
  const start = timeToMinutes(rule.start_time);
  const end = timeToMinutes(rule.end_time);
  const step = Math.max(rule.buffer_minutes, 15);
  const times: string[] = [];

  for (let minute = start; minute < end; minute += step) {
    times.push(minutesToTime(minute));
  }

  return times.slice(0, 12);
}

function timeToMinutes(value: string) {
  const [hours = "0", minutes = "0"] = value.split(":");

  return Number(hours) * 60 + Number(minutes);
}

function minutesToTime(value: number) {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function toDateId(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatMoney(priceCents: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}
