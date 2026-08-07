// "use client" tells Next.js to render this component in the browser (client-side),
// which is required because we use React state (useState) and form actions.
"use client";

// useActionState: React hook that connects a Server Action to the form.
//   - Tracks the action's return value (validation errors, messages) and
//     whether the action is currently running (pending).
// useState: standard React hook for local component state (password visibility toggle).
import { useActionState, useState } from "react";

// Link: Next.js component for client-side navigation (faster than a plain <a> tag).
import Link from "next/link";

// signup: the Server Action defined in app/actions/auth.ts.
//   It receives FormData, validates it with Zod, hashes the password with bcrypt,
//   creates a new User record in the database, then sets a JWT session cookie
//   on success — or returns validation errors on failure.
import { signup } from "@/app/actions/auth";

export default function SignupPage() {
  // useActionState wires the `signup` Server Action to the form.
  //   state   — the value returned by `signup` on each submission (errors / message).
  //             Starts as `undefined` (the second argument).
  //   action  — the form action handler; pass this to <form action={action}>.
  //   pending — true while the server is processing the form submission.
  const [state, action, pending] = useActionState(signup, undefined);

  // showPassword controls whether the password field renders as plain text or
  // masked dots. Toggled by the eye icon button. Defaults to false (hidden).
  const [showPassword, setShowPassword] = useState(false);

  return (
    // Full-height centred layout — flex-1 makes this <main> grow to fill the page.
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      {/* Constrain the card to a narrow column (max-w-sm = 384 px) */}
      <div className="w-full max-w-sm flex flex-col gap-8">

        {/* ── Page header ── */}
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create account
          </h1>
          <p className="text-sm text-text-secondary">
            Set up your account and start generating content.
          </p>
        </header>

        {/* ── Sign-up form ──
            `action={action}` connects the form to the `signup` Server Action.
            When submitted, Next.js serialises all named inputs as FormData
            and passes them to the action on the server. */}
        <form action={action} className="card p-6 flex flex-col gap-4">

          {/* ── Name field ── */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="form-label">
              Your name
            </label>
            <input id="name" name="name" required className="form-input" />
            {/* Show the first name validation error returned by the server action
                (e.g. "Name is required"). */}
            {state?.errors?.name && (
              <p className="text-sm text-error">{state.errors.name[0]}</p>
            )}
          </div>

          {/* ── Email field ── */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            {/* type="email" enables basic browser-level format validation */}
            <input
              id="email"
              name="email"
              type="email"
              required
              className="form-input"
            />
            {/* Show the first email validation error returned by the server action
                (e.g. "Invalid email", "Email already in use"). */}
            {state?.errors?.email && (
              <p className="text-sm text-error">{state.errors.email[0]}</p>
            )}
          </div>

          {/* ── Password field ── */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="form-label">
              Password
            </label>

            {/* Relative wrapper so the toggle button can be positioned
                absolutely on top of the right edge of the input. */}
            <div className="relative">
              {/* Switching type between "password" (dots) and "text" (visible)
                  is how the show/hide toggle works — no extra library needed. */}
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="form-input w-full pr-10" // pr-10 = right padding so text doesn't overlap the icon
              />

              {/* Eye icon button — toggles password visibility.
                  type="button" is critical: without it the button would default to
                  type="submit" and accidentally submit the form when clicked. */}
              <button
                type="button"
                // Toggle showPassword between true/false on every click.
                // Using the functional form `(v) => !v` is safer than `!showPassword`
                // because it always reads the latest state value.
                onClick={() => setShowPassword((v) => !v)}
                // Dynamic aria-label keeps the button meaningful for screen readers.
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary hover:text-text-primary transition-colors"
              >
                {/* Render the "eye-off" icon when password is visible,
                    and the "eye" icon when password is hidden. */}
                {showPassword ? (
                  // Eye-off SVG (password is currently visible → click to hide)
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" /> {/* diagonal slash */}
                  </svg>
                ) : (
                  // Eye SVG (password is currently hidden → click to reveal)
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* Hint text shown below the input at all times */}
            <p className="text-xs text-text-muted">
              At least 8 characters.
            </p>

            {/* Show the first password validation error returned by the server action
                (e.g. "Password must be at least 8 characters"). */}
            {state?.errors?.password && (
              <p className="text-sm text-error">{state.errors.password[0]}</p>
            )}
          </div>

          {/* General server-side error message (e.g. "Email already registered").
              Set on `state.message` by the signup action for errors that aren't
              tied to a specific field. */}
          {state?.message && <p className="text-sm text-error">{state.message}</p>}

          {/* Submit button — disabled while the action is running to prevent
              duplicate submissions. The label changes to give user feedback. */}
          <button type="submit" disabled={pending} className="btn-primary mt-2 self-end">
            {pending ? "Creating account…" : "Create account"}
          </button>
        </form>

        {/* ── Log-in link ── redirect users who already have an account */}
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
