"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/app/actions/auth";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create account
          </h1>
          <p className="text-sm text-text-secondary">
            Set up your account and start generating content.
          </p>
        </header>

        <form action={action} className="card p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="form-label">
              Your name
            </label>
            <input id="name" name="name" required className="form-input" />
            {state?.errors?.name && (
              <p className="text-sm text-error">{state.errors.name[0]}</p>
            )}
          </div>

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
            <p className="text-xs text-text-muted">
              At least 8 characters.
            </p>
            {state?.errors?.password && (
              <p className="text-sm text-error">{state.errors.password[0]}</p>
            )}
          </div>

          {state?.message && <p className="text-sm text-error">{state.message}</p>}

          <button type="submit" disabled={pending} className="btn-primary mt-2 self-start">
            {pending ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-text-secondary text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:text-accent-hover">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
