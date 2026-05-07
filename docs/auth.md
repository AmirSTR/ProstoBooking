# Auth

Supabase Auth is used for the MVP. Telegram auth can be added later as an additional identity provider, but Supabase email/password gives the cleanest secure baseline with RLS.

## Flow

- `/sign-up` creates a Supabase Auth user with `full_name` metadata.
- The database trigger `public.handle_new_user()` creates the matching `profiles` row.
- `/sign-in` creates a session through Supabase Auth.
- `middleware.ts` refreshes auth cookies with `supabase.auth.getUser()`.
- `app/(dashboard)/layout.tsx` requires an authenticated user before dashboard pages render.
- Dashboard queries read data through `business_members`, so users only see businesses they belong to.
- Public booking pages remain anonymous but only read public booking data.

## Secure Patterns

- Use `supabase.auth.getUser()` for trusted server-side auth checks.
- Never trust `getSession()` alone for authorization.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
- Keep RLS enabled on all tenant-owned tables.
- Filter dashboard data by authenticated membership and let RLS enforce the same boundary.
- Use server actions for sign-in, sign-up, sign-out, and booking creation.

## Routes

- `/sign-in`
- `/sign-up`
- `/dashboard`

## Next Step

After the first authenticated signup, create the user's first `businesses` row and owner `business_members` row in an onboarding server action.

