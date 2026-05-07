import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type MobileAppShellProps = {
  children: ReactNode;
  bottomNavigation?: ReactNode;
  className?: string;
};

export function MobileAppShell({
  children,
  bottomNavigation,
  className,
}: MobileAppShellProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main
        className={cn(
          "mx-auto flex min-h-dvh w-full max-w-[520px] flex-col px-4 pb-24 pt-4 safe-bottom safe-top sm:px-5",
          "animate-enter",
          className,
        )}
      >
        {children}
      </main>
      {bottomNavigation}
    </div>
  );
}
