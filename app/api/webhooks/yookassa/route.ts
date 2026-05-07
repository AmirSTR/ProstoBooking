import { NextResponse } from "next/server";

import { recordPaymentEvent, upsertSubscription } from "@/features/billing/subscription-service";
import { getYooKassaPayment } from "@/lib/payments/yookassa";
import type { Json } from "@/lib/supabase";

type YooKassaWebhookPayload = {
  type: "notification";
  event: string;
  object: {
    id: string;
    status: string;
    paid?: boolean;
    metadata?: {
      business_id?: string;
    };
  };
};

export async function POST(request: Request) {
  let payload: YooKassaWebhookPayload;

  try {
    payload = (await request.json()) as YooKassaWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!payload.object?.id || !payload.event) {
    return NextResponse.json({ error: "Invalid YooKassa payload." }, { status: 400 });
  }

  let verifiedPayment;

  try {
    verifiedPayment = await getYooKassaPayment(payload.object.id);
  } catch {
    return NextResponse.json({ error: "Unable to verify YooKassa payment." }, { status: 400 });
  }

  if (verifiedPayment.id !== payload.object.id) {
    return NextResponse.json({ error: "Payment verification mismatch." }, { status: 400 });
  }

  if (verifiedPayment.status !== payload.object.status) {
    return NextResponse.json({ error: "Payment status mismatch." }, { status: 400 });
  }

  const businessId =
    verifiedPayment.metadata?.business_id ?? payload.object.metadata?.business_id ?? null;
  const providerEventId = `${payload.event}:${payload.object.id}`;
  const shouldProcess = await recordPaymentEvent({
    provider: "yookassa",
    providerEventId,
    eventType: payload.event,
    businessId,
    payload: payload as unknown as Json,
  });

  if (!shouldProcess) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (businessId && payload.event === "payment.succeeded" && verifiedPayment.paid) {
    await upsertSubscription({
      businessId,
      provider: "yookassa",
      providerPaymentId: verifiedPayment.id,
      status: "active",
      currentPeriodEndsAt: nextMonth().toISOString(),
    });
  }

  if (businessId && payload.event === "payment.canceled") {
    await upsertSubscription({
      businessId,
      provider: "yookassa",
      providerPaymentId: verifiedPayment.id,
      status: "canceled",
    });
  }

  return NextResponse.json({ received: true });
}

function nextMonth() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);

  return date;
}
