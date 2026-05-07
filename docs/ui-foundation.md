# UI Foundation

## What Was Added

- Global styles with Inter, safe-area handling, smooth motion, and premium surfaces.
- Tokenized color, radius, shadow, spacing, and animation primitives.
- Tailwind config aligned with shadcn/ui CSS variables.
- Reusable layout primitives for container, mobile shell, section spacing, page surfaces, and bottom navigation.

## Telegram-Style Foundation

The UI direction borrows the best parts of Telegram-like mobile products:

- Bottom-first navigation.
- Light translucent surfaces.
- Compact rounded panels.
- Clear hierarchy with minimal decoration.
- Fast, smooth transitions.
- Thumb-friendly tap targets.

## Component Usage

```tsx
import { Calendar, Home, Settings, Users, WalletCards } from "lucide-react";

import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { MobileAppShell } from "@/components/layout/mobile-app-shell";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/bookings", label: "Bookings", icon: WalletCards },
  { href: "/dashboard/customers", label: "Clients", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileAppShell bottomNavigation={<BottomNavigation items={items} />}>
      {children}
    </MobileAppShell>
  );
}
```

## MVP Fit

This keeps the app visually coherent before business logic exists. The team can now build booking screens, auth screens, and dashboard pages using the same spacing, navigation, and surface model from day one.

