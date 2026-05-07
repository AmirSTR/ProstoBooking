"use client";

import Link from "next/link";

import { PageSurface } from "@/components/layout/page-surface";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 text-foreground">
      <PageSurface tone="elevated" className="w-full max-w-[420px] p-5">
        <p className="text-xs font-semibold text-muted-foreground">Dashboard error</p>
        <h1 className="mt-2 text-2xl font-semibold">We could not load dashboard.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {error.message || "Please check your account and try again."}
        </p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="touch-target rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            Try again
          </button>
          <Link
            href="/"
            className="touch-target inline-flex items-center rounded-lg border border-border bg-surface px-4 text-sm font-semibold"
          >
            Home
          </Link>
        </div>
      </PageSurface>
    </main>
  );
}

