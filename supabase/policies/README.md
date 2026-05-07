# RLS Policies

The initial schema keeps tenant access scoped through `business_members`.

## Public Access

- Anonymous users can read public business rows only when the business has at least one visible service.
- Anonymous users can read visible services.
- Anonymous users can read active staff profiles and active availability.
- Anonymous users can create bookings only for visible services.

## Authenticated Business Access

- Business members can read business-owned records.
- Business admins and owners can manage services, staff, availability, blocked times, and memberships.
- Members can read and update bookings for their business.
- Customers are private to authenticated business members.

## Security Notes

- `SUPABASE_SERVICE_ROLE_KEY` must never be used in client components.
- Public booking inserts intentionally allow anonymous users for conversion.
- Production booking creation should add rate limits, captcha, and server-side validation before launch.
- RLS is the final tenant boundary; application checks are still useful for UX but not enough alone.
