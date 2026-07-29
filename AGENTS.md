# AGENTS.md

## Commands

- `npm run dev` — dev server (Next.js 16)
- `npm run build` — production build
- `npm run lint` — eslint (no formatter, no typecheck script — TS errors surface at build time)
- `npx prisma migrate dev` — run migrations (reads `prisma.config.ts`, loads `.env.local`)
- `npx prisma generate` — regenerate client after schema changes

No test runner configured. No CI workflows.

## Next.js 16 gotchas

- Middleware renamed to **`proxy.ts`** at project root. Do not create `middleware.ts`.
- Prisma client generated to `generated/prisma/`, imported via relative path in `lib/prisma.ts`. Do not import from `@prisma/client`.
- `generated/` is gitignored — must run `npx prisma generate` after clone or schema change.

## Auth

JWT session cookie via `jose`, not database sessions.

- `lib/session.ts` — encrypt/decrypt, create/delete cookie. Requires `SESSION_SECRET` (min 32 chars).
- `lib/dal.ts` — `verifySession()` (redirects, use in Server Components) vs `getSessionUserId()` (returns null, use in API routes for 401).
- `proxy.ts` — edge redirect for `/dashboard` (protected) and `/login`, `/signup` (public-only). UX fast-path only, not security boundary.
- `app/actions/auth.ts` — Server Actions for signup/login/logout with bcrypt + zod.

## Generation flow

`app/dashboard/generator-form.tsx` (client) → `POST /api/generate/route.ts` → `lib/ai.ts` (`generateStructured` with OpenRouter primary → Groq fallback chain) → persists to `ContentGeneration` table.

- `lib/generation-prompts.ts` — all platform/emotion/audience definitions and system-prompt building. Add new values there, not inline in routes.
- `lib/ai.ts` — multi-provider fallback (OpenRouter → Groq), 30s timeout, `maxRetries: 1`. Do not relax timeouts.
- Two parallel generation calls produce two post variations per request.

## Data model

`prisma/schema.prisma` — PostgreSQL. `User` → `ContentGeneration` (one per platform/emotion/prompt) → `SavedPost` (favorite wrapper, not yet wired in UI).

## Env vars

`.env.local` (gitignored), see `.env.example`:
- `DATABASE_URL` — PostgreSQL connection string
- `OPENROUTER_API_KEY` — for OpenRouter (primary AI provider)
- `GROQ_API_KEY` — fallback AI provider
- `SESSION_SECRET` — JWT signing key, min 32 chars

## Project status

Hackathon project. Phases 0–2 done (setup, auth, AI generation). Phase 3 (history, favorites, rate limiting) not started. See `knowledge/todo.md`.

## Commit messages

After finishing a task, generate a one-line commit message summarizing the change (Conventional Commits style, e.g. `fix(feed): restore scroll position on back nav`). Do this every time work is done, even if not asked. Do not add or commit manually.