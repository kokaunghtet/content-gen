# Todo — AI Social Media Content Generator

Based on `social_media_content_generator.md`. Note: proposal specifies React + Express + PostgreSQL, but this project is Next.js (App Router) — Next.js API routes replace the separate Express server.

## Phase 0 — Setup

- [x] Create `.env.local` (placeholders exist — still need real `GOOGLE_GENERATIVE_AI_API_KEY` and `DATABASE_URL`)
- [x] Get PostgreSQL running (Supabase free tier, session pooler connection)
- [x] Initialize Prisma: schema for `User`, `ContentGeneration`, `SavedPost` written, migrated (`prisma/migrations/20260716132820_init`)
- [x] Read the guides in `node_modules/next/dist/docs/` before coding — AGENTS.md warns this Next.js version has breaking changes

## Phase 1 — Auth + Dashboard

- [x] Auth: signup/login pages + Server Actions (`app/signup`, `app/login`, `app/actions/auth.ts`). Stateless JWT session cookie via `jose` (`lib/session.ts`), passwords hashed with `bcryptjs`
- [x] Dashboard layout: generator moved to `app/dashboard/page.tsx` (protected via `verifySession()` + `proxy.ts` optimistic redirect). `app/page.tsx` now just redirects based on session. `app/api/generate/route.ts` checks session and returns 401 if unauthenticated; demo-user shim removed

## Phase 2 — AI Core (the demo-maker — prioritize)

- [x] Generation form: business name, platform (FB / IG / LinkedIn / X / TikTok), emotion selector, target audience age group, prompt/goal field (`app/dashboard/generator-form.tsx`)
- [x] API route `app/api/generate/route.ts` — calls LLM via AI SDK with platform-specific + emotion + age-group system prompts (`lib/generation-prompts.ts`), generates 2 variations in parallel
- [x] Output UI: generated post + hashtags + CTA, copy button, regenerate button
- [x] Save each generation to the `ContentGeneration` table (currently attributed to a temporary fixed demo user until Phase 1 auth lands)
- [x] Input validation (zod) — `lib/validation.ts`

## Phase 3 — History + Polish

- [ ] History page: list past generations, search by keyword/platform
- [ ] Favorite + delete actions (`Saved_Posts` table)
- [ ] Content rewrite feature (feed old content back with a new emotion)
- [ ] Mobile-first responsive pass (Tailwind)
- [ ] Rate limiting on the generate endpoint (API quota risk mitigation)
- [ ] Test against the Definition of Done checklist

## Suggested Build Order (hackathon)

Auth eats time. Build the AI generation flow first (form → API route → output UI) for a working demo, then auth, then history. A demo without auth beats auth without a demo.
