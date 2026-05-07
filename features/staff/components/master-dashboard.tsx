import Link from "next/link";
import type { ReactNode } from "react";
import {
  CalendarDays,
  Clock,
  Home,
  ListChecks,
  Plus,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";

import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { PageSurface } from "@/components/layout/page-surface";
import { signOutAction } from "@/features/auth/actions";
import {
  createStripeCheckoutAction,
  createYooKassaCheckoutAction,
} from "@/features/billing/actions";
import type { MasterDashboardData } from "@/features/staff/queries";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/bookings", label: "Bookings", icon: ListChecks },
  { href: "/dashboard/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/dashboard/customers", label: "Clients", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function MasterDashboard({ data }: { data: MasterDashboardData }) {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh w-full max-w-[520px] flex-col px-4 pb-28 pt-4 safe-bottom safe-top sm:px-5 lg:max-w-[1180px] lg:pb-10">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {data.business.name}
            </p>
            <h1 className="mt-1 text-3xl font-semibold leading-tight sm:text-4xl">
              Master dashboard
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <form action={signOutAction}>
              <button
                type="submit"
                className="touch-target rounded-lg border border-border bg-surface/80 px-3 text-sm font-semibold text-muted-foreground shadow-panel transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Sign out
              </button>
            </form>
            <Link
              href={`/book/${data.business.slug}`}
              className="touch-target inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-panel transition-transform duration-200 ease-premium hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Plus className="size-4" aria-hidden="true" />
              Book
            </Link>
          </div>
        </header>

        <SubscriptionBanner data={data} />

        <section className="grid gap-3 sm:grid-cols-3">
          <MetricCard
            label="Bookings"
            value={data.metrics.bookings}
            helper="Scheduled today"
          />
          <MetricCard
            label="Revenue"
            value={data.metrics.revenue}
            helper="From today's bookings"
          />
          <MetricCard
            label="Open slots"
            value={data.metrics.openSlots}
            helper="Active availability rules"
          />
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <PageSurface tone="elevated" className="p-4">
            <SectionHeader
              eyebrow="Upcoming"
              title="Bookings"
              icon={<CalendarDays className="size-4" aria-hidden="true" />}
            />
            <div className="mt-4 space-y-3">
              {data.upcomingBookings.length === 0 && (
                <EmptyBlock message="No upcoming bookings yet." />
              )}
              {data.upcomingBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="flex items-center gap-3 rounded-lg border border-border/70 bg-surface/80 p-3 shadow-panel"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-foreground text-sm font-bold text-background">
                    {booking.time}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold">
                          {booking.client}
                        </h3>
                        <p className="truncate text-xs text-muted-foreground">
                          {booking.service} / {booking.duration}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </PageSurface>

          <div className="grid gap-4">
            <PageSurface className="p-4">
              <SectionHeader
                eyebrow="Catalog"
                title="Services"
                icon={<Sparkles className="size-4" aria-hidden="true" />}
              />
              <div className="mt-4 space-y-3">
                {data.services.length === 0 && (
                  <EmptyBlock message="No services have been created yet." />
                )}
                {data.services.map((service) => (
                  <article
                    key={service.id}
                    className="rounded-lg border border-border/70 bg-surface/80 p-3 shadow-panel"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold">{service.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {service.duration} / {service.price}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          service.isVisible
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {service.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </PageSurface>

            <PageSurface className="p-4">
              <SectionHeader
                eyebrow="Availability"
                title="Schedule"
                icon={<Clock className="size-4" aria-hidden="true" />}
              />
              <div className="mt-4 divide-y divide-border/70 overflow-hidden rounded-lg border border-border/70 bg-surface/80">
                {data.scheduleSettings.map((setting) => (
                  <div
                    key={setting.label}
                    className="flex items-center justify-between gap-4 px-3 py-3"
                  >
                    <span className="text-sm text-muted-foreground">
                      {setting.label}
                    </span>
                    <span className="text-right text-sm font-semibold">
                      {setting.value}
                    </span>
                  </div>
                ))}
              </div>
            </PageSurface>
          </div>
        </section>
      </div>

      <BottomNavigation items={navItems} className="lg:hidden" />
    </main>
  );
}

function SubscriptionBanner({ data }: { data: MasterDashboardData }) {
  const gate = data.premiumGate;

  if (gate.reason === "active") {
    return (
      <PageSurface className="mb-4 p-4">
        <p className="text-xs font-semibold text-muted-foreground">Premium active</p>
        <p className="mt-1 text-sm font-medium">
          Unlimited bookings are enabled for {data.business.name}.
        </p>
      </PageSurface>
    );
  }

  return (
    <PageSurface tone="elevated" className="mb-4 p-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">
            {gate.reason === "trialing" ? "Free trial" : "Weekly limit"}
          </p>
          <h2 className="mt-1 text-lg font-semibold">
            149 RUB/month unlocks unlimited bookings.
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {gate.reason === "trialing"
              ? `Trial ends on ${formatDate(gate.trialEndsAt)}.`
              : `${gate.weeklyBookingCount}/${gate.weeklyBookingLimit} free bookings used this week.`}
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[260px]">
          <form action={createYooKassaCheckoutAction}>
            <button
              type="submit"
              className="touch-target w-full rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-panel"
            >
              Pay YooKassa
            </button>
          </form>
          <form action={createStripeCheckoutAction}>
            <button
              type="submit"
              className="touch-target w-full rounded-lg border border-border bg-surface px-4 text-sm font-semibold shadow-panel"
            >
              Pay Stripe
            </button>
          </form>
        </div>
      </div>
    </PageSurface>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
  }).format(new Date(value));
}

function EmptyBlock({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface/60 p-4 text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <PageSurface className="p-4">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold leading-none">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{helper}</p>
    </PageSurface>
  );
}

function SectionHeader({
  eyebrow,
  title,
  icon,
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-1 text-lg font-semibold">{title}</h2>
      </div>
      <span className="grid size-9 place-items-center rounded-lg bg-surface-muted text-primary">
        {icon}
      </span>
    </div>
  );
}
