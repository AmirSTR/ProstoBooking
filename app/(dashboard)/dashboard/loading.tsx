import { PageSurface } from "@/components/layout/page-surface";

export default function DashboardLoading() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh w-full max-w-[520px] flex-col px-4 pb-28 pt-4 safe-bottom safe-top sm:px-5 lg:max-w-[1180px] lg:pb-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-9 w-64 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-11 w-24 animate-pulse rounded-lg bg-muted" />
        </div>
        <section className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <PageSurface key={item} className="p-4">
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              <div className="mt-3 h-8 w-16 animate-pulse rounded bg-muted" />
              <div className="mt-3 h-3 w-28 animate-pulse rounded bg-muted" />
            </PageSurface>
          ))}
        </section>
        <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <PageSurface tone="elevated" className="p-4">
            <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            <div className="mt-4 space-y-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-16 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          </PageSurface>
          <div className="grid gap-4">
            <PageSurface className="h-56 animate-pulse" />
            <PageSurface className="h-52 animate-pulse" />
          </div>
        </section>
      </div>
    </main>
  );
}

