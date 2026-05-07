# Folder Structure

```txt
.
├── app/
│   ├── (marketing)/
│   ├── (booking)/
│   ├── (dashboard)/
│   ├── (auth)/
│   ├── api/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── layout/
│   └── marketing/
├── features/
│   ├── availability/
│   ├── bookings/
│   ├── customers/
│   ├── services/
│   ├── staff/
│   └── billing/
├── lib/
│   ├── env/
│   ├── supabase/
│   ├── auth/
│   └── utils/
├── config/
├── styles/
├── supabase/
│   ├── migrations/
│   ├── policies/
│   └── seed/
├── docs/
└── railway/
```

## Directory Roles

`app`

Next.js App Router entrypoint. Route groups separate public booking, dashboard, auth, and marketing surfaces without leaking URL prefixes.

`components/ui`

shadcn/ui primitives only. These should remain low-level and reusable.

`components/layout`

Application shells, mobile navigation, dashboard frame, page headers, and responsive layout primitives.

`features`

Vertical product modules. Each feature should be able to hold `components`, `actions`, `queries`, `schemas`, `types`, and `constants` as it grows.

`lib/supabase`

Browser client, server client, admin client, middleware helpers, and typed database helpers.

`config`

Navigation, product constants, booking rules, pricing config, and metadata defaults.

`styles`

Global CSS, Tailwind token layers, theme variables, and motion primitives.

`railway`

Deployment notes and future Railway-specific service files.

