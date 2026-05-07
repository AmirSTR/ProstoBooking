import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

type SectionStackProps = ComponentPropsWithoutRef<"section"> & {
  spacing?: "sm" | "md" | "lg";
};

const spacingMap = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
};

export function SectionStack({
  className,
  spacing = "md",
  children,
  ...props
}: SectionStackProps) {
  return (
    <section
      className={cn("flex flex-col", spacingMap[spacing], className)}
      {...props}
    >
      {children}
    </section>
  );
}
