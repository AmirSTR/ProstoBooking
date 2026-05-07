# Design Tokens

## Token Philosophy

Design tokens should encode product intent, not just colors. The MVP needs enough structure to feel premium while staying small enough to maintain.

## CSS Variable Groups

```css
:root {
  --background: 42 32% 97%;
  --foreground: 220 20% 10%;

  --surface: 0 0% 100%;
  --surface-muted: 40 24% 94%;
  --surface-elevated: 0 0% 100%;

  --border: 35 18% 86%;
  --ring: 188 70% 32%;

  --primary: 188 70% 28%;
  --primary-foreground: 0 0% 100%;

  --accent: 14 78% 55%;
  --accent-foreground: 0 0% 100%;

  --success: 145 45% 36%;
  --warning: 38 90% 48%;
  --danger: 0 72% 48%;

  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --shadow-soft: 0 12px 32px hsl(220 20% 10% / 0.08);
  --shadow-panel: 0 1px 2px hsl(220 20% 10% / 0.08);
}
```

## Typography

- Use a refined sans family for UI and a warmer display family for brand moments.
- Dashboard text should favor clarity over drama.
- Booking pages can use slightly larger headings and relaxed spacing.

Recommended pairing:

- UI: `Geist Sans` or `Satoshi`
- Display: `Fraunces` or `Canela` if licensed

## Spacing Scale

```txt
4, 8, 12, 16, 20, 24, 32, 40, 48, 64
```

Use the scale consistently. Mobile pages should mostly live between `16` and `24` px gutters.

## Radius

- Controls: `6px`
- Cards and panels: `8px`
- Sheets and large surfaces: `12px`

This keeps the product polished without making the dashboard feel bubbly.

## Semantic Status Tokens

```txt
booking.pending
booking.confirmed
booking.completed
booking.cancelled
payment.paid
payment.refunded
payment.failed
availability.open
availability.blocked
```

Status colors should map to semantic tokens rather than direct Tailwind colors.

