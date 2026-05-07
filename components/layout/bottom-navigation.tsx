"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils/cn";

export type BottomNavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type BottomNavigationProps = {
  items: BottomNavigationItem[];
  className?: string;
};

export function BottomNavigation({ items, className }: BottomNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[520px] px-3 pb-3 safe-bottom",
        className,
      )}
      aria-label="Primary navigation"
    >
      <div
        className="telegram-surface grid h-[68px] grid-cols-[repeat(var(--nav-items),minmax(0,1fr))] rounded-xl px-2 py-2 shadow-nav"
        style={{ "--nav-items": items.length } as CSSProperties}
      >
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "touch-target flex flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium text-muted-foreground transition-all duration-200 ease-premium",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive && "bg-primary text-primary-foreground shadow-panel",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-5" strokeWidth={2.2} aria-hidden="true" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
