# Routing Structure

## Route Groups

```txt
app/
├── (marketing)/
│   ├── page.tsx
│   └── pricing/page.tsx
├── (booking)/
│   └── book/[businessSlug]/page.tsx
├── (dashboard)/
│   ├── dashboard/page.tsx
│   ├── dashboard/bookings/page.tsx
│   ├── dashboard/calendar/page.tsx
│   ├── dashboard/customers/page.tsx
│   ├── dashboard/services/page.tsx
│   ├── dashboard/staff/page.tsx
│   └── dashboard/settings/page.tsx
├── (auth)/
│   ├── sign-in/page.tsx
│   ├── sign-up/page.tsx
│   └── reset-password/page.tsx
└── api/
    ├── webhooks/supabase/route.ts
    └── webhooks/stripe/route.ts
```

## MVP Routes

`/`

Marketing or product entry. For an early MVP, this can be compact and conversion-focused.

`/book/[businessSlug]`

Customer-facing booking flow. Mobile-first, fast, and distraction-free.

`/dashboard`

Business overview with upcoming bookings, availability health, and revenue snapshot.

`/dashboard/bookings`

Booking list, status changes, cancellation, rescheduling, and manual booking creation.

`/dashboard/calendar`

Availability and appointment timeline.

`/dashboard/services`

Service catalog, durations, prices, buffers, and visibility.

`/dashboard/settings`

Business profile, booking policy, notifications, integrations, and team preferences.

## Routing Rules

- Use route groups for product surfaces, not for URL design.
- Put surface-specific layouts inside their route group.
- Use server components for initial data whenever possible.
- Use loading and error boundaries at dashboard and booking-flow levels.
- Keep API routes mostly for webhooks and third-party callbacks.

