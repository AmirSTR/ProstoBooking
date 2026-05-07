import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

type PageSurfaceProps = ComponentPropsWithoutRef<"div"> & {
  tone?: "default" | "elevated";
};

export function PageSurface({
  className,
  tone = "default",
  children,
  ...props
}: PageSurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-4 sm:p-5",
        tone === "default" && "premium-panel",
        tone === "elevated" && "telegram-surface",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
