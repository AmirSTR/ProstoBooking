import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  size?: "sm" | "md" | "lg" | "full";
};

const sizes = {
  sm: "max-w-[520px]",
  md: "max-w-[720px]",
  lg: "max-w-[1280px]",
  full: "max-w-none",
};

export function Container({
  className,
  size = "lg",
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-5 lg:px-8",
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
