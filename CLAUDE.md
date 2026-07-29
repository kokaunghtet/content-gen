# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run lint` — eslint
- `npx prisma migrate dev` — run migrations (config in `prisma.config.ts`, schema in `prisma/schema.prisma`)
- `npx prisma generate` — regenerate client after schema changes (output goes to `generated/prisma`, not `node_modules`)

No test runner is set up yet.

## Architecture

Next.js 16 App Router hackathon project: AI social media post generator with auth.

**⚠ Next.js 16 breaks from training-data conventions** — before touching routing, middleware, or config, check `node_modules/next/dist/docs/`. Known diffs already hit in this repo:
- `middleware.ts` is renamed to **`proxy.ts`** (root-level, same matcher config shape).
- Prisma client is generated to `generated/prisma`, imported via relative path in `lib/prisma.ts`, not `@prisma/client`.

**Auth**: stateless JWT session cookie, not a database session table.
- `lib/session.ts` — encrypt/decrypt JWT (`jose`), create/delete the `session` cookie. Requires `SESSION_SECRET` env var.
- `lib/dal.ts` — two verification entry points: `verifySession()` (redirects to `/login`, use in Server Components/pages) vs `getSessionUserId()` (returns `null`, use in API routes to return 401 instead of redirecting).
- `proxy.ts` — edge-level optimistic redirect for `/dashboard` (protected) and `/login`+`/signup` (public-only); this is a UX fast-path, not the security boundary — routes/actions still verify the session server-side.
- `app/actions/auth.ts` — signup/login/logout as Server Actions (`"use server"`), bcrypt password hashing, zod validation via `lib/validation.ts`.

**Generation flow**: `app/dashboard/generator-form.tsx` (client) → `POST app/api/generate/route.ts` → Gemini via Vercel AI SDK (`@ai-sdk/google`, model `gemini-3.5-flash`) with structured output (`Output.object` + zod schema for content/hashtags/cta) → persists to `ContentGeneration` table via `lib/prisma.ts`.
- Platform/emotion/audience-age copy and system-prompt building live in `lib/generation-prompts.ts` — add new platforms/emotions/age groups there (`PLATFORMS`, `EMOTIONS`, `AGE_GROUPS`, `PLATFORM_GUIDELINES`), not inline in the route.
- The Gemini call is capped (`maxRetries: 1`, 15s `abortSignal` timeout) — a prior bug let retries hang for minutes; don't relax this without reason.
- Free-tier Gemini quota is 20 req/day — expect hard quota-exhaustion errors during testing, not just rate limiting.

**Data model** (`prisma/schema.prisma`): `User` → `ContentGeneration` (one generation = one platform/emotion/audience-age/prompt → two post variations) → `SavedPost` (favorite/save wrapper around a generation, not yet wired up in UI).

**Project status**: see `knowledge/todo.md` for phase tracking. Phases 0–2 (setup, auth, AI generation core) are done; Phase 3 (history page, favorite/delete, rate limiting) is not started.

## Commit messages

After finishing a task, generate a one-line commit message summarizing the change (Conventional Commits style, e.g. `fix(feed): restore scroll position on back nav`). Do this every time work is done, even if not asked. Do not add or commit manually.