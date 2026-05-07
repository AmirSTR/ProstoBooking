"use client";

import { useActionState, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, Check, ChevronLeft, Clock, Sparkles } from "lucide-react";

import { PageSurface } from "@/components/layout/page-surface";
import { createBookingAction } from "@/features/bookings/actions";
import type { PublicBookingPageData } from "@/features/bookings/queries";
import { cn } from "@/lib/utils/cn";

type BookingFlowProps = {
  data: PublicBookingPageData;
};

const initialActionState = {
  status: "idle" as const,
  message: "",
};

export function BookingFlow({ data }: BookingFlowProps) {
  const [actionState, formAction, isPending] = useActionState(
    createBookingAction,
    initialActionState,
  );
  const [selectedService, setSelectedService] = useState(
    data.services[0]?.id ?? "",
  );
  const [selectedDate, setSelectedDate] = useState(data.dates[0]?.id ?? "");
  const selectedDateTimes = useMemo(
    () => data.times.filter((time) => time.dateId === selectedDate),
    [data.times, selectedDate],
  );
  const [selectedTime, setSelectedTime] = useState(
    data.times.find((time) => time.dateId === data.dates[0]?.id)?.value ?? "",
  );
  const service = data.services.find((item) => item.id === selectedService);
  const date = data.dates.find((item) => item.id === selectedDate);
  const canBook = Boolean(service && date && selectedTime);

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh w-full max-w-[520px] flex-col px-4 pb-28 pt-4 safe-bottom safe-top sm:px-5">
        <header className="mb-5 flex items-center justify-between">
          <Link
            href="/"
            className="touch-target inline-flex items-center gap-2 rounded-lg pr-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Back
          </Link>
          <span className="rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-panel">
            {data.business.name}
          </span>
        </header>

        <section className="animate-rise">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-panel backdrop-blur">
            <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
            Book in under a minute
          </p>
          <h1 className="text-4xl font-semibold leading-[1.02] sm:text-5xl">
            Choose your appointment.
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Select a service, pick a date and time, then confirm your booking.
          </p>
        </section>

        <form action={formAction} className="mt-7 flex flex-1 flex-col gap-4">
          <input type="hidden" name="businessId" value={data.business.id} />
          <input type="hidden" name="businessSlug" value={data.business.slug} />
          <input type="hidden" name="serviceId" value={selectedService} />
          <input type="hidden" name="date" value={selectedDate} />
          <input type="hidden" name="time" value={selectedTime} />

          <BookingStep
            eyebrow="Step 1"
            title="Service"
            icon={<Sparkles className="size-4" aria-hidden="true" />}
          >
            <div className="grid gap-3">
              {data.services.length === 0 && (
                <EmptyInline message="No public services are available yet." />
              )}
              {data.services.map((item) => {
                const isActive = selectedService === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedService(item.id);
                    }}
                    className={cn(
                      "rounded-lg border p-4 text-left shadow-panel transition-all duration-200 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-surface/80 hover:-translate-y-0.5 hover:bg-surface",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p
                          className={cn(
                            "mt-1 text-sm leading-6",
                            isActive
                              ? "text-primary-foreground/80"
                              : "text-muted-foreground",
                          )}
                        >
                          {item.description}
                        </p>
                      </div>
                      {isActive && <Check className="size-5 shrink-0" aria-hidden="true" />}
                    </div>
                    <div
                      className={cn(
                        "mt-3 flex items-center gap-2 text-xs font-semibold",
                        isActive ? "text-primary-foreground/80" : "text-muted-foreground",
                      )}
                    >
                      <span>{item.duration}</span>
                      <span className="size-1 rounded-full bg-current" />
                      <span>{item.price}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </BookingStep>

          <BookingStep
            eyebrow="Step 2"
            title="Date"
            icon={<CalendarDays className="size-4" aria-hidden="true" />}
          >
            <div className="grid grid-cols-5 gap-2">
              {data.dates.length === 0 && (
                <div className="col-span-5">
                  <EmptyInline message="Availability has not been configured." />
                </div>
              )}
              {data.dates.map((item) => {
                const isActive = selectedDate === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedDate(item.id);
                      setSelectedTime(
                        data.times.find((time) => time.dateId === item.id)?.value ?? "",
                      );
                    }}
                    className={cn(
                      "touch-target rounded-lg border px-2 py-3 text-center shadow-panel transition-all duration-200 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-surface/80 hover:bg-surface",
                    )}
                  >
                    <span className="block text-[11px] font-semibold opacity-75">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-lg font-semibold leading-none">
                      {item.day}
                    </span>
                  </button>
                );
              })}
            </div>
          </BookingStep>

          <BookingStep
            eyebrow="Step 3"
            title="Time"
            icon={<Clock className="size-4" aria-hidden="true" />}
          >
            <div className="grid grid-cols-3 gap-2">
              {selectedDateTimes.length === 0 && (
                <div className="col-span-3">
                  <EmptyInline message="No times are available for this date." />
                </div>
              )}
              {selectedDateTimes.map((time) => {
                const isActive = selectedTime === time.value;

                return (
                  <button
                    key={`${time.dateId}-${time.value}`}
                    type="button"
                    onClick={() => {
                      setSelectedTime(time.value);
                    }}
                    className={cn(
                      "touch-target rounded-lg border px-3 py-3 text-sm font-semibold shadow-panel transition-all duration-200 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-surface/80 hover:bg-surface",
                    )}
                  >
                    {time.value}
                  </button>
                );
              })}
            </div>
          </BookingStep>

          <BookingStep
            eyebrow="Step 4"
            title="Your details"
            icon={<Check className="size-4" aria-hidden="true" />}
          >
            <div className="grid gap-3">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  Name
                </span>
                <input
                  name="customerName"
                  required
                  autoComplete="name"
                  className="touch-target rounded-lg border border-border bg-surface/80 px-3 text-sm shadow-panel outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
                  placeholder="Your name"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Email
                  </span>
                  <input
                    name="customerEmail"
                    type="email"
                    autoComplete="email"
                    className="touch-target rounded-lg border border-border bg-surface/80 px-3 text-sm shadow-panel outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
                    placeholder="you@email.com"
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Phone
                  </span>
                  <input
                    name="customerPhone"
                    type="tel"
                    autoComplete="tel"
                    className="touch-target rounded-lg border border-border bg-surface/80 px-3 text-sm shadow-panel outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
                    placeholder="+1 555 000 0000"
                  />
                </label>
              </div>
            </div>
          </BookingStep>

          <footer className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[520px] px-4 pb-4 safe-bottom sm:px-5">
            <PageSurface tone="elevated" className="p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {service?.name ?? "Select service"} / {selectedTime || "Time"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {date
                      ? `${date.label}, ${date.month} ${date.day} / ${service?.duration ?? ""}`
                      : "Select a date"}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={!canBook || isPending}
                  className="touch-target shrink-0 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-panel transition-transform duration-200 ease-premium hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-55"
                >
                  {isPending ? "Booking" : "Book"}
                </button>
              </div>
              {actionState.message && (
                <div
                  className={cn(
                    "mt-3 rounded-md px-3 py-2 text-sm font-medium animate-enter",
                    actionState.status === "success"
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive",
                  )}
                >
                  {actionState.message}
                </div>
              )}
            </PageSurface>
          </footer>
        </form>
      </div>
    </main>
  );
}

function BookingStep({
  eyebrow,
  title,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <PageSurface className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">{eyebrow}</p>
          <h2 className="mt-1 text-lg font-semibold">{title}</h2>
        </div>
        <span className="grid size-9 place-items-center rounded-lg bg-surface-muted text-primary">
          {icon}
        </span>
      </div>
      {children}
    </PageSurface>
  );
}

function EmptyInline({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface/60 p-4 text-sm text-muted-foreground">
      {message}
    </div>
  );
}
