import { PageSurface } from "@/components/layout/page-surface";

export default function BookingLoading() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh w-full max-w-[520px] flex-col px-4 pb-28 pt-4 safe-bottom safe-top sm:px-5">
        <div className="mb-5 flex items-center justify-between">
          <div className="h-9 w-20 animate-pulse rounded-lg bg-muted" />
          <div className="h-7 w-28 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="space-y-4">
          <div className="h-6 w-40 animate-pulse rounded-full bg-muted" />
          <div className="h-24 w-full animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="mt-7 grid gap-4">
          {[0, 1, 2, 3].map((item) => (
            <PageSurface key={item} className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-5 w-28 animate-pulse rounded bg-muted" />
                </div>
                <div className="size-9 animate-pulse rounded-lg bg-muted" />
              </div>
              <div className="grid gap-2">
                <div className="h-14 animate-pulse rounded-lg bg-muted" />
                <div className="h-14 animate-pulse rounded-lg bg-muted" />
              </div>
            </PageSurface>
          ))}
        </div>
      </div>
    </main>
  );
}

