# Supabase Setup

## Files

- `supabase/migrations/20260507180000_initial_booking_schema.sql` creates the MVP schema and RLS policies.
- `supabase/policies/README.md` explains access boundaries.
- `lib/supabase/database.types.ts` contains typed table helpers.
- `lib/supabase/client.ts` creates the browser client.
- `lib/supabase/server.ts` creates the App Router server client.
- `lib/supabase/admin.ts` creates a server-only service-role client.
- `.env.example` documents required variables.

## Required Packages

Install these when the Next project is initialized:

```bash
npm install @supabase/ssr @supabase/supabase-js server-only
```

## Import Rules

Use direct imports so client bundles never touch server-only modules:

```ts
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Tables } from "@/lib/supabase";
```

Auth routes and dashboard protection are documented in `docs/auth.md`.

## Environment Variables

Public variables are safe for the browser:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Server-only variables must never be imported into client components:

- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DATABASE_URL`

## Migration Flow

Apply the schema with Supabase CLI once the project is linked:

```bash
supabase db push
```

For production, run migrations before deploying the Railway web service.
