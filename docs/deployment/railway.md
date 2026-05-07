# Railway Deployment

## Services

Recommended MVP Railway setup:

- `web`: Next.js application.
- `supabase`: managed outside Railway through Supabase Cloud.
- `jobs`: optional future worker for reminders, syncs, and scheduled notifications.

## Environment Variables

```txt
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_DATABASE_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
STRIPE_SUCCESS_URL=
STRIPE_CANCEL_URL=
YOOKASSA_SHOP_ID=
YOOKASSA_SECRET_KEY=
YOOKASSA_RETURN_URL=
RESEND_API_KEY=
```

## Deployment Rules

- Keep service role keys server-only.
- Run migrations before production deploys.
- Use Railway variables per environment.
- Keep preview deployments pointed at a non-production Supabase project.
- Add health checks once the first Next app is initialized.
