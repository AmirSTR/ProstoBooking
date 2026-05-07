# UI System

## Direction

The interface should feel premium, calm, and operational. The mobile booking flow should be tactile and elegant; the dashboard should be dense enough for daily business use without feeling cramped.

## Component Layers

`components/ui`

shadcn/ui primitives such as `Button`, `Input`, `Dialog`, `Sheet`, `Tabs`, `Calendar`, `Select`, and `Toast`.

`components/layout`

Shell components such as `MobileAppShell`, `DashboardShell`, `PageHeader`, `BottomNav`, `ContentRail`, and `SectionStack`.

`features/*/components`

Business components such as `BookingCard`, `AvailabilityGrid`, `ServiceEditor`, `CustomerTimeline`, and `StaffPicker`.

## shadcn/ui Strategy

- Keep generated primitives in `components/ui`.
- Wrap primitives only when the wrapper adds product meaning.
- Use variants for repeated product states such as `premium`, `danger`, `quiet`, and `mobilePrimary`.
- Preserve accessibility defaults from Radix primitives.

## Mobile-First Rules

- Primary actions live in thumb-friendly bottom zones on booking routes.
- Dashboard pages should have a compact mobile summary before lists or grids.
- Use sheets for focused mobile edits and dialogs for desktop confirmation flows.
- Keep tap targets at least `44px`.
- Avoid hover-only behavior for core flows.

## State System

- Empty states must include the next useful action.
- Loading states should preserve layout shape.
- Destructive actions require confirmation.
- Booking status should use consistent labels and color tokens.

