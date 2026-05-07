"use server";

import { revalidatePath } from "next/cache";

import { canCreateBooking, getPremiumGateForBusiness } from "@/features/billing/gating";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CreateBookingState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createBookingAction(
  _previousState: CreateBookingState,
  formData: FormData,
): Promise<CreateBookingState> {
  const businessId = readFormValue(formData, "businessId");
  const businessSlug = readFormValue(formData, "businessSlug");
  const serviceId = readFormValue(formData, "serviceId");
  const date = readFormValue(formData, "date");
  const time = readFormValue(formData, "time");
  const customerName = readFormValue(formData, "customerName");
  const customerEmail = readOptionalFormValue(formData, "customerEmail");
  const customerPhone = readOptionalFormValue(formData, "customerPhone");

  if (!businessId || !businessSlug || !serviceId || !date || !time || !customerName) {
    return {
      status: "error",
      message: "Please complete every required field before booking.",
    };
  }

  const startsAt = new Date(`${date}T${time}:00.000Z`);

  if (Number.isNaN(startsAt.getTime())) {
    return {
      status: "error",
      message: "The selected date or time is invalid.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const gate = await getPremiumGateForBusiness(businessId);

  if (!canCreateBooking(gate)) {
    return {
      status: "error",
      message: `This master has reached the free limit of ${gate.weeklyBookingLimit} bookings this week.`,
    };
  }

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("id,business_id,duration_minutes,is_visible")
    .eq("id", serviceId)
    .eq("business_id", businessId)
    .eq("is_visible", true)
    .single();

  if (serviceError || !service) {
    return {
      status: "error",
      message: "This service is no longer available.",
    };
  }

  const endsAt = new Date(startsAt);
  endsAt.setMinutes(startsAt.getMinutes() + service.duration_minutes);

  const { error: bookingError } = await supabase.from("bookings").insert({
    business_id: businessId,
    service_id: service.id,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
    status: "pending",
  });

  if (bookingError) {
    return {
      status: "error",
      message: "We could not create this booking. Please try another time.",
    };
  }

  revalidatePath(`/book/${businessSlug}`);
  revalidatePath("/dashboard");

  return {
    status: "success",
    message: "Your appointment request has been created.",
  };
}

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function readOptionalFormValue(formData: FormData, key: string) {
  const value = readFormValue(formData, key);

  return value.length > 0 ? value : null;
}
