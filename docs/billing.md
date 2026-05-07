# Billing

The MVP supports two payment providers:

- Stripe subscriptions.
- YooKassa monthly access payments.

## Price

- `149 RUB / month`
- `14 days` free trial.
- After trial, non-premium masters are limited to `5 bookings per week`.

The source of truth is `config/subscription.ts`.

## Provider Setup

Stripe:

- Create a recurring monthly price for `149 RUB`.
- Set `STRIPE_PRICE_ID`.
- Add webhook endpoint `/api/webhooks/stripe`.
- Listen to `checkout.session.completed` and `customer.subscription.*`.
- Stripe webhook verification uses raw request body and `Stripe-Signature`.

YooKassa:

- Set `YOOKASSA_SHOP_ID` and `YOOKASSA_SECRET_KEY`.
- Add webhook endpoint `/api/webhooks/yookassa` in the YooKassa dashboard.
- Listen to `payment.succeeded` and `payment.canceled`.
- YooKassa webhook payload is verified by reading the payment object from the YooKassa API before updating local state.

## Gating

`features/billing/gating.ts` decides access:

- `active` subscription: unlimited bookings.
- `trialing`: unlimited bookings until `trial_ends_at`.
- no active subscription after trial: maximum `5` non-cancelled bookings per week.

Booking creation calls the gate before inserting a booking. Dashboard shows the current plan state and payment CTAs.

## Webhook Idempotency

All provider events are stored in `payment_events` with a unique `(provider, provider_event_id)` constraint.

Duplicate webhooks return success and do not apply changes twice.

## Security

- Stripe webhooks must use the raw request body.
- YooKassa webhooks must not be trusted from payload alone; the payment is verified through YooKassa API.
- Service role writes are isolated in server-only subscription service code.
- UI never imports service role clients.

