import Link from "next/link";
import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { PageSurface } from "@/components/layout/page-surface";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "Premium Booking SaaS",
  description:
    "A premium mobile-first booking platform for modern service businesses.",
};

const features = [
  {
    title: "Mobile booking flow",
    description:
      "A fast customer journey designed for thumbs, short attention spans, and high conversion.",
  },
  {
    title: "Calm operations",
    description:
      "Daily bookings, customers, services, and staff stay organized in one focused workspace.",
  },
  {
    title: "Premium client feel",
    description:
      "Clean surfaces, confident spacing, and soft motion make the product feel polished from day one.",
  },
];

const schedule = [
  { time: "09:30", service: "Signature Treatment", status: "Confirmed" },
  { time: "11:00", service: "Consultation", status: "Deposit paid" },
  { time: "14:15", service: "Follow-up Session", status: "New" },
];

export default function LandingPage() {
  return (
    <main className="min-h-dvh overflow-hidden text-foreground">
      <section className="relative">
        <Container className="relative z-10 grid min-h-[92svh] content-between gap-10 pb-10 pt-5 safe-top md:min-h-[88svh] md:pb-14 md:pt-8">
          <header className="flex items-center justify-between">
            <Link
              href="/"
              className="touch-target inline-flex items-center gap-2 rounded-lg pr-3 text-sm font-semibold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Premium Booking home"
            >
              <span className="grid size-8 place-items-center rounded-md bg-foreground text-[13px] font-bold text-background">
                B
              </span>
              <span>BookingOS</span>
            </Link>
            <Link
              href="/sign-in"
              className="touch-target inline-flex items-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Sign in
            </Link>
          </header>

          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.62fr)] lg:gap-12">
            <div className="max-w-[680px] animate-rise">
              <p className="mb-4 inline-flex rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-panel backdrop-blur">
                Premium booking for service businesses
              </p>
              <h1 className="max-w-[12ch] text-5xl font-semibold leading-[0.95] sm:text-7xl lg:text-8xl">
                Bookings that feel effortless.
              </h1>
              <p className="mt-5 max-w-[34rem] text-base leading-7 text-muted-foreground sm:text-lg">
                A mobile-first SaaS foundation for salons, clinics, studios, and
                appointment-based teams that care about every detail.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="touch-target inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-panel transition-transform duration-200 ease-premium hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Start free
                </Link>
                <Link
                  href="/book/demo-studio"
                  className="touch-target inline-flex items-center justify-center rounded-lg border border-border bg-surface/80 px-5 py-3 text-sm font-semibold shadow-panel backdrop-blur transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  View booking flow
                </Link>
              </div>
            </div>

            <HeroPreview />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                className={cn(
                  "animate-rise",
                  index === 1 && "[animation-delay:75ms]",
                  index === 2 && "[animation-delay:150ms]",
                )}
              />
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}

function HeroPreview() {
  return (
    <div className="animate-enter lg:justify-self-end">
      <div className="mx-auto w-full max-w-[380px] rounded-[28px] border border-border/80 bg-foreground p-2 shadow-soft">
        <div className="overflow-hidden rounded-[22px] bg-background">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Today</p>
              <p className="text-sm font-semibold">12 bookings</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Live
            </span>
          </div>

          <div className="space-y-3 p-4">
            <PageSurface tone="elevated" className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Next appointment
                  </p>
                  <h2 className="mt-1 text-xl font-semibold leading-tight">
                    Signature Treatment
                  </h2>
                </div>
                <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
                  09:30
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[72%] rounded-full bg-primary" />
              </div>
            </PageSurface>

            <div className="space-y-2">
              {schedule.map((item) => (
                <div
                  key={`${item.time}-${item.service}`}
                  className="flex items-center gap-3 rounded-lg border border-border/70 bg-surface/80 p-3"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-md bg-surface-muted text-xs font-bold">
                    {item.time}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.service}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-lg border border-border/75 bg-surface/80 p-4 shadow-panel backdrop-blur transition-transform duration-200 ease-premium hover:-translate-y-0.5",
        className,
      )}
    >
      <div className="mb-5 h-1.5 w-10 rounded-full bg-primary" />
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </article>
  );
}
