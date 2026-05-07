# Layout System

## Layout Goals

The booking flow should feel like a premium mobile app. The dashboard should feel like a fast operating surface for a real business owner.

## Layout Primitives

`AppFrame`

Top-level wrapper for authenticated surfaces.

`DashboardShell`

Desktop sidebar, mobile bottom navigation, content header, and main scroll region.

`BookingShell`

Mobile-first flow wrapper with sticky bottom action area and progress context.

`PageHeader`

Consistent title, description, breadcrumbs, and primary actions.

`SectionStack`

Vertical spacing primitive for forms, lists, and settings screens.

`ContentRail`

Constrained content width for forms and detail pages.

## Breakpoints

```txt
mobile: default
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

## Surface Widths

- Booking flow: `max-width: 520px`
- Dashboard content: `max-width: 1280px`
- Settings forms: `max-width: 720px`
- Detail side panels: `360px` to `420px`

## Mobile Navigation

Use bottom navigation for primary dashboard areas:

- Home
- Calendar
- Bookings
- Customers
- Settings

On desktop, the same destinations move to a left sidebar.

## Booking Flow Layout

Recommended steps:

1. Select service.
2. Select staff member or "any available".
3. Select date and time.
4. Enter customer details.
5. Confirm booking.

Each step should be independently linkable enough for recovery, but the MVP can keep it in a single route with query state until analytics or drop-off recovery requires deeper URLs.

