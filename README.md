# Social Media Content Generator

An AI-powered social media post generator that creates platform-specific content using Google's Gemini API. Generate engaging posts for Facebook, Instagram, and TikTok with tailored tone, target audience, and emotional hooks.

## Features

- **AI-Powered Generation**: Uses Gemini 3.5 Flash to generate two variations of social media posts
- **Multi-Platform Support**: Generates platform-optimized content for Facebook, Instagram, and TikTok
- **Customizable Parameters**:
  - Content styles (Casual, Professional, Humorous, Inspirational, Educational)
  - Target emotions (Happy, Excited, Confident, Thoughtful, Entertained)
  - Target audience age groups (Teens, Young Adults, Adults, Seniors)
- **User Authentication**: Secure signup/login with JWT-based sessions
- **Content Management**: Save and manage generated posts
- **Structured Output**: Generates posts with hashtags and CTAs

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
DATABASE_URL=              # Your database connection URL (Prisma)
GOOGLE_GENERATIVE_AI_API_KEY=  # Google Gemini API key
SESSION_SECRET=            # Secret key for JWT session encryption (min 32 characters)
```

### Running the Project

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Commands

- `npm run dev` — Start development server
- `npm run build` — Create production build
- `npm run lint` — Run ESLint
- `npx prisma migrate dev` — Run database migrations
- `npx prisma generate` — Regenerate Prisma client

## Project Structure

- `app/` — Next.js App Router pages and routes
- `lib/` — Utility functions and shared logic
  - `generation-prompts.ts` — Platform guidelines, emotions, and prompt building
  - `session.ts` — JWT session management
  - `validation.ts` — Zod schemas for API validation
- `prisma/` — Database schema and migrations
- `public/` — Static assets

## Notes

- Gemini API has a free-tier quota of 20 requests/day
- Generation requests are capped with a 15-second timeout and 1 retry limit
