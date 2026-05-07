import "server-only";

import { randomUUID } from "crypto";

import { requireServerEnv } from "@/lib/env/server";

const YOOKASSA_API_URL = "https://api.yookassa.ru/v3";

type YooKassaPayment = {
  id: string;
  status: string;
  paid: boolean;
  metadata?: {
    business_id?: string;
  };
  confirmation?: {
    type: string;
    confirmation_url?: string;
  };
};

type CreateYooKassaPaymentInput = {
  businessId: string;
  description: string;
  returnUrl: string;
};

export async function createYooKassaPayment({
  businessId,
  description,
  returnUrl,
}: CreateYooKassaPaymentInput) {
  const payment = await yookassaRequest<YooKassaPayment>("/payments", {
    method: "POST",
    headers: {
      "Idempotence-Key": randomUUID(),
    },
    body: JSON.stringify({
      amount: {
        value: "149.00",
        currency: "RUB",
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: returnUrl,
      },
      description,
      metadata: {
        business_id: businessId,
        plan: "master_monthly",
      },
      save_payment_method: false,
    }),
  });

  if (!payment.confirmation?.confirmation_url) {
    throw new Error("YooKassa did not return a confirmation URL.");
  }

  return payment;
}

export async function getYooKassaPayment(paymentId: string) {
  return yookassaRequest<YooKassaPayment>(`/payments/${paymentId}`, {
    method: "GET",
  });
}

async function yookassaRequest<T>(
  path: string,
  init: RequestInit,
): Promise<T> {
  const shopId = requireServerEnv("YOOKASSA_SHOP_ID");
  const secretKey = requireServerEnv("YOOKASSA_SECRET_KEY");
  const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");

  const response = await fetch(`${YOOKASSA_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`YooKassa request failed with status ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

