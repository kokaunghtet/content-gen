"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Log in
          </h1>
          <p className="text-sm text-text-secondary">
            Welcome back. Sign in to generate content.
          </p>
        </header>

        <form action={action} className="card p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="form-input"
            />
            {state?.errors?.email && (
              <p className="text-sm text-error">{state.errors.email[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="form-input"
            />
            {state?.errors?.password && (
              <p className="text-sm text-error">{state.errors.password[0]}</p>
            )}
          </div>

          {state?.message && <p className="text-sm text-error">{state.message}</p>}

          <button type="submit" disabled={pending} className="btn-primary mt-2 self-start">
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-text-secondary text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-accent hover:text-accent-hover">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
