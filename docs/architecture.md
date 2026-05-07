# Architecture

## Product Shape

The MVP is a premium mobile-first booking SaaS with three core surfaces:

- Public booking experience for customers.
- Business dashboard for staff and owners.
- Account and billing area for authenticated users.

The architecture favors clear product boundaries over framework cleverness. Booking flows, business settings, availability, customer records, and payments should evolve independently without turning the codebase into one large shared module.

## Layers

`app`

Owns routing, layouts, loading states, error boundaries, metadata, and route-level data composition. Pages should stay thin and delegate product logic to feature modules.

`features`

Owns business capabilities such as bookings, availability, customers, services, staff, and billing. Each feature can contain components, server actions, queries, validation schemas, and local types.

`shared`

Owns reusable, product-agnostic code: UI primitives, formatting helpers, hooks, constants, and generic utilities.

`lib`

Owns infrastructure clients and cross-cutting adapters such as Supabase clients, auth helpers, environment validation, and server-only utilities.

`supabase`

Owns database migrations, seed data, row-level security policies, and local Supabase config.

## Data Flow

1. Route handlers and server components load data through feature queries.
2. Mutations go through server actions located inside the relevant feature.
3. Feature actions validate input with schemas before touching Supabase.
4. Supabase row-level security remains the final authorization boundary.
5. Client components are used for interaction-heavy UI only.

## MVP Principles

- Keep pages thin so route changes do not rewrite product logic.
- Keep features vertical so bookings, services, and customers can ship independently.
- Keep Supabase access centralized enough to enforce auth and tenant boundaries.
- Keep UI tokens explicit so premium polish does not depend on ad hoc Tailwind values.

