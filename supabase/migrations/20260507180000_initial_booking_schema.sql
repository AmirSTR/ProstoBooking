create extension if not exists "pgcrypto";

create type public.booking_status as enum (
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'no_show'
);

create type public.business_member_role as enum (
  'owner',
  'admin',
  'staff'
);

create type public.payment_provider as enum (
  'stripe',
  'yookassa'
);

create type public.subscription_status as enum (
  'trialing',
  'active',
  'past_due',
  'canceled',
  'unpaid'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  slug text not null unique,
  timezone text not null default 'UTC',
  currency text not null default 'USD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint businesses_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.business_member_role not null default 'staff',
  created_at timestamptz not null default now(),
  unique (business_id, profile_id)
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  description text,
  duration_minutes integer not null,
  price_cents integer not null,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_duration_positive check (duration_minutes > 0),
  constraint services_price_non_negative check (price_cents >= 0)
);

create table public.staff_profiles (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  display_name text not null,
  bio text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.staff_services (
  staff_id uuid not null references public.staff_profiles(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  primary key (staff_id, service_id)
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete restrict,
  staff_id uuid references public.staff_profiles(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.booking_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_time_order check (ends_at > starts_at)
);

create table public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  staff_id uuid references public.staff_profiles(id) on delete cascade,
  weekday smallint not null,
  start_time time not null,
  end_time time not null,
  buffer_minutes integer not null default 15,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint availability_weekday_range check (weekday between 0 and 6),
  constraint availability_time_order check (end_time > start_time),
  constraint availability_buffer_non_negative check (buffer_minutes >= 0)
);

create table public.blocked_times (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  staff_id uuid references public.staff_profiles(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  constraint blocked_times_time_order check (ends_at > starts_at)
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  provider public.payment_provider not null,
  provider_customer_id text,
  provider_subscription_id text,
  provider_payment_id text,
  status public.subscription_status not null default 'trialing',
  price_cents integer not null default 14900,
  currency text not null default 'RUB',
  trial_ends_at timestamptz not null default (now() + interval '14 days'),
  current_period_ends_at timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id),
  constraint subscriptions_price_positive check (price_cents > 0)
);

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider public.payment_provider not null,
  provider_event_id text not null,
  event_type text not null,
  business_id uuid references public.businesses(id) on delete set null,
  payload jsonb not null,
  processed_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

create index businesses_owner_id_idx on public.businesses(owner_id);
create index business_members_profile_id_idx on public.business_members(profile_id);
create index services_business_id_idx on public.services(business_id);
create index staff_profiles_business_id_idx on public.staff_profiles(business_id);
create index customers_business_id_idx on public.customers(business_id);
create index bookings_business_id_starts_at_idx on public.bookings(business_id, starts_at);
create index bookings_customer_id_idx on public.bookings(customer_id);
create index availability_rules_business_id_idx on public.availability_rules(business_id);
create index blocked_times_business_id_starts_at_idx on public.blocked_times(business_id, starts_at);
create index subscriptions_business_id_idx on public.subscriptions(business_id);
create index subscriptions_provider_subscription_id_idx on public.subscriptions(provider, provider_subscription_id);
create index payment_events_provider_event_id_idx on public.payment_events(provider, provider_event_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger businesses_set_updated_at
before update on public.businesses
for each row execute function public.set_updated_at();

create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

create trigger staff_profiles_set_updated_at
before update on public.staff_profiles
for each row execute function public.set_updated_at();

create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

create trigger availability_rules_set_updated_at
before update on public.availability_rules
for each row execute function public.set_updated_at();

create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger auth_users_create_profile
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_business_member(target_business_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.business_members bm
    where bm.business_id = target_business_id
      and bm.profile_id = auth.uid()
  );
$$;

create or replace function public.is_business_admin(target_business_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.business_members bm
    where bm.business_id = target_business_id
      and bm.profile_id = auth.uid()
      and bm.role in ('owner', 'admin')
  );
$$;

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;
alter table public.services enable row level security;
alter table public.staff_profiles enable row level security;
alter table public.staff_services enable row level security;
alter table public.customers enable row level security;
alter table public.bookings enable row level security;
alter table public.availability_rules enable row level security;
alter table public.blocked_times enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_events enable row level security;

create policy "Profiles can read their own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "Profiles can update their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Profiles can insert their own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

create policy "Members can read their businesses"
on public.businesses for select
to authenticated
using (public.is_business_member(id));

create policy "Anyone can read booking business profiles"
on public.businesses for select
to anon, authenticated
using (
  exists (
    select 1
    from public.services s
    where s.business_id = businesses.id
      and s.is_visible = true
  )
);

create policy "Authenticated users can create owned businesses"
on public.businesses for insert
to authenticated
with check (owner_id = auth.uid());

create policy "Admins can update their businesses"
on public.businesses for update
to authenticated
using (public.is_business_admin(id))
with check (public.is_business_admin(id));

create policy "Members can read business memberships"
on public.business_members for select
to authenticated
using (public.is_business_member(business_id));

create policy "Admins can manage business memberships"
on public.business_members for all
to authenticated
using (public.is_business_admin(business_id))
with check (public.is_business_admin(business_id));

create policy "Owners can create their first membership"
on public.business_members for insert
to authenticated
with check (
  profile_id = auth.uid()
  and role = 'owner'
  and exists (
    select 1
    from public.businesses b
    where b.id = business_id
      and b.owner_id = auth.uid()
  )
);

create policy "Anyone can read visible services"
on public.services for select
to anon, authenticated
using (is_visible = true);

create policy "Members can read all business services"
on public.services for select
to authenticated
using (public.is_business_member(business_id));

create policy "Admins can manage services"
on public.services for all
to authenticated
using (public.is_business_admin(business_id))
with check (public.is_business_admin(business_id));

create policy "Anyone can read active staff profiles"
on public.staff_profiles for select
to anon, authenticated
using (is_active = true);

create policy "Members can read all staff profiles"
on public.staff_profiles for select
to authenticated
using (public.is_business_member(business_id));

create policy "Admins can manage staff profiles"
on public.staff_profiles for all
to authenticated
using (public.is_business_admin(business_id))
with check (public.is_business_admin(business_id));

create policy "Anyone can read staff service mappings"
on public.staff_services for select
to anon, authenticated
using (
  exists (
    select 1
    from public.staff_profiles sp
    join public.services s on s.id = staff_services.service_id
    where sp.id = staff_services.staff_id
      and s.business_id = sp.business_id
      and sp.is_active = true
      and s.is_visible = true
  )
);

create policy "Admins can manage staff service mappings"
on public.staff_services for all
to authenticated
using (
  exists (
    select 1
    from public.staff_profiles sp
    join public.services s on s.id = staff_services.service_id
    where sp.id = staff_services.staff_id
      and s.business_id = sp.business_id
      and public.is_business_admin(sp.business_id)
  )
)
with check (
  exists (
    select 1
    from public.staff_profiles sp
    join public.services s on s.id = staff_services.service_id
    where sp.id = staff_services.staff_id
      and s.business_id = sp.business_id
      and public.is_business_admin(sp.business_id)
  )
);

create policy "Members can manage customers"
on public.customers for all
to authenticated
using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

create policy "Public can create bookings"
on public.bookings for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.services s
    where s.id = service_id
      and s.business_id = bookings.business_id
      and s.is_visible = true
  )
);

create policy "Members can read bookings"
on public.bookings for select
to authenticated
using (public.is_business_member(business_id));

create policy "Members can update bookings"
on public.bookings for update
to authenticated
using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

create policy "Anyone can read active availability"
on public.availability_rules for select
to anon, authenticated
using (is_active = true);

create policy "Admins can manage availability"
on public.availability_rules for all
to authenticated
using (public.is_business_admin(business_id))
with check (public.is_business_admin(business_id));

create policy "Members can read blocked times"
on public.blocked_times for select
to authenticated
using (public.is_business_member(business_id));

create policy "Admins can manage blocked times"
on public.blocked_times for all
to authenticated
using (public.is_business_admin(business_id))
with check (public.is_business_admin(business_id));

create policy "Members can read subscriptions"
on public.subscriptions for select
to authenticated
using (public.is_business_member(business_id));

create policy "Admins can manage subscriptions"
on public.subscriptions for all
to authenticated
using (public.is_business_admin(business_id))
with check (public.is_business_admin(business_id));
