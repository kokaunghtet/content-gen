# Project Structure — content-gen

Stack: Next.js 16 (App Router), TypeScript, Prisma + PostgreSQL (Supabase), JWT auth (`jose`), Gemini via `@ai-sdk/google` with OpenRouter/Groq fallback.

## Root

- `proxy.ts` — edge redirect (renamed from `middleware.ts` in Next 16). Protects `/dashboard`, gates `/login` + `/signup` as public-only. UX fast-path, not the real auth gate.
- `next.config.ts`, `prisma.config.ts`, `tsconfig.json`, `eslint.config.mjs` — tooling config.
- `package.json` — dev script forced `--webpack` (Turbopack breaks Prisma's `adapter-pg`, see commit `088096e`).

## `app/` — routing (App Router, folder-based routes)

- `layout.tsx` — root layout, global shell.
- `page.tsx` — landing/home route (`/`).
- `globals.css` — global styles.
- `login/page.tsx`, `signup/page.tsx` — auth UI pages.
- `dashboard/page.tsx` — protected main app page, calls `verifySession()`.
- `dashboard/generator-form.tsx` — client component, form UI, POSTs to `/api/generate`.
- `dashboard/generator-flow.tsx` — orchestrates multi-step generation UI flow.
- `dashboard/platform-picker.tsx` — UI: platform select (Twitter/Instagram/etc).
- `dashboard/style-suggestions.tsx` — UI: emotion/style/audience picker.
- `actions/auth.ts` — Server Actions (`"use server"`): signup/login/logout. bcrypt hash + zod validate, calls `lib/session.ts` to set the session cookie.
- `api/generate/route.ts` — API route, POST. Auth via `getSessionUserId()` → build prompt via `lib/generation-prompts.ts` → call `lib/ai.ts` → save `ContentGeneration` row via `lib/prisma.ts`.
- `api/generate/styles/route.ts` — API route serving style/platform/emotion option lists.

## `lib/` — core logic, non-UI

- `session.ts` — JWT encrypt/decrypt (jose), session cookie create/delete. Requires `SESSION_SECRET`.
- `dal.ts` — auth guard functions: `verifySession()` (Server Components, redirects to `/login`), `getSessionUserId()` (API routes, returns `null` → caller responds 401).
- `validation.ts` — zod schemas, form + API input validation.
- `prisma.ts` — Prisma client instance (imports from `generated/prisma`, not `@prisma/client` — Next 16 quirk).
- `ai.ts` — AI provider abstraction: OpenRouter primary, Groq fallback, 30s timeout, `maxRetries: 1`.
- `generation-prompts.ts` — `PLATFORMS`, `EMOTIONS`, `AGE_GROUPS`, `PLATFORM_GUIDELINES` + system-prompt builder. Single source for adding new platform/emotion/age options.

## `prisma/`

- `schema.prisma` — data model: `User` → `ContentGeneration` → `SavedPost`.
- `migrations/` — SQL migration history.

## How the pieces connect

### Auth flow
`login`/`signup` `page.tsx` (UI form)
→ `app/actions/auth.ts` (Server Action: validates via `lib/validation.ts`, hashes password, calls `lib/session.ts` to mint JWT cookie)
→ `proxy.ts` optimistic-redirects on next navigation
→ protected pages call `lib/dal.ts:verifySession()` server-side (the real gate)
→ `lib/prisma.ts` reads/writes the `User` table.

### Generation flow
`generator-form.tsx` (client, local state)
→ `POST /api/generate`
→ `dal.ts:getSessionUserId()` auth check
→ `lib/generation-prompts.ts` builds the prompt
→ `lib/ai.ts` calls the model (2 parallel calls = 2 variations)
→ `lib/prisma.ts` persists `ContentGeneration`.

### Notes
- No separate state-management library (Redux/Zustand) — state stays local via `useState` in client components.
- No dedicated API-client layer — components call `fetch()` on route handlers directly.

## Suggested TypeScript learning path

1. `page.tsx` files — JSX + props types
2. `generator-form.tsx` / `generator-flow.tsx` — state + event types
3. `validation.ts` — zod schema inference
4. `auth.ts` — Server Actions
5. `dal.ts` / `session.ts` — async guards, JWT typing
6. `ai.ts` — generics/unions, provider fallback logic
