"use client";

import { useFormState, useFormStatus } from 'react-dom';
import Link from "next/link";

import { PageSurface } from "@/components/layout/page-surface";
import type { AuthActionState } from "@/features/auth/actions";
import { signInAction, signUpAction } from "@/features/auth/actions";

const initialState: AuthActionState = {
  status: "idle",
  message: "",
};

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
};

export function AuthForm({ mode }: AuthFormProps) {
  const isSignUp = mode === "sign-up";
  const [state, action] = useFormState(
    isSignUp ? signUpAction : signInAction,
    initialState,
  );
  const { pending: isPending } = useFormStatus();

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 py-8 text-foreground safe-bottom safe-top">
      <PageSurface tone="elevated" className="w-full max-w-[420px] p-5">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold"
        >
          <span className="grid size-8 place-items-center rounded-md bg-foreground text-[13px] font-bold text-background">
            B
          </span>
          BookingOS
        </Link>

        <div>
          <p className="text-xs font-semibold text-muted-foreground">
            {isSignUp ? "Create account" : "Welcome back"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold">
            {isSignUp ? "Start your workspace." : "Sign in to dashboard."}
          </h1>
        </div>

        <form action={action} className="mt-6 grid gap-4">
          {isSignUp && (
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground">
                Full name
              </span>
              <input
                name="fullName"
                required
                autoComplete="name"
                className="touch-target rounded-lg border border-border bg-surface/80 px-3 text-sm shadow-panel outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
                placeholder="Maya Stone"
              />
            </label>
          )}

          <label className="grid gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">
              Email
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="touch-target rounded-lg border border-border bg-surface/80 px-3 text-sm shadow-panel outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
              placeholder="you@studio.com"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">
              Password
            </span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              className="touch-target rounded-lg border border-border bg-surface/80 px-3 text-sm shadow-panel outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
              placeholder="At least 8 characters"
            />
          </label>

          {state.message && (
            <div
              className={
                state.status === "success"
                  ? "rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
                  : "rounded-md bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"
              }
            >
              {state.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="touch-target mt-1 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-panel transition-transform duration-200 ease-premium hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
          >
            {isPending ? "Please wait" : isSignUp ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
          <Link
            href={isSignUp ? "/sign-in" : "/sign-up"}
            className="font-semibold text-primary"
          >
            {isSignUp ? "Sign in" : "Create one"}
          </Link>
        </p>
      </PageSurface>
    </main>
  );
}
