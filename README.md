# See Night Studio

Brutalist editorial site + type foundry marketplace for **See Night Studio** — a fictional Jakarta-based type foundry. Draws expressive retail and custom typefaces for brands that keep late hours.

Live: [seenightstudio.vercel.app](https://seenightstudio.vercel.app)

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS 4** (CSS custom-property theming, light/dark)
- **lucide-react** — icons
- **zustand** — cart state (localStorage)
- **Supabase** — CMS + storage (`@supabase/ssr`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=<project-url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
ADMIN_PASSWORD=admin123
```

Without Supabase credentials the site falls back to the hardcoded data in `lib/typefaces.ts` and `lib/data.ts`.

### Database setup

Run `supabase/seed.sql` in the Supabase SQL Editor — creates the `typefaces`, `pages`, and `settings` tables, seed data, RLS policies, and the `font-files` storage bucket (idempotent, safe to re-run).

## Scripts

| Command       | Description            |
| ------------- | ---------------------- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build     |
| `npm run start`  | Production server   |
| `npm run lint`   | ESLint              |

## Features

- Home, fonts index, font detail (8 typefaces), about, contact, 404
- Dark/light mode via CSS-variable swap (default light)
- Catalog filtering synced to URL (`?q=&cat=&tag=`)
- Interactive type tester + glyph preview
- **Cart** (localStorage, zustand) with add-to-cart tiers + drawer + toasts
- **Admin dashboard** (`/admin`) — password-based cookie auth, CRUD for typefaces/pages/settings, **font file upload (OTF/TTF/WOFF2)** used for real live previews via the FontFace API
- Sentry-free, static-first with dynamic admin routes

## Admin

See **[ADMIN.md](ADMIN.md)** for the full admin guide: access, pages, database schema, storage, and the font upload flow.

## Project structure

```
app/        # Pages (site + /admin)
components/ # Nav, footer, testers, cart, admin sidebar…
lib/        # Data layer, typefaces, fonts, cart store, supabase clients
supabase/   # seed.sql (+ create-admin.sql)
middleware.ts # Cookie-session guard for /admin/* + x-pathname header
```

## Deploy

Deployed on Vercel. Apply the env vars above in the Vercel project settings, then push to `main`.

Typefaces shown are placeholders — real font family shipping arrives in phase two. See `CONCEPT.md` for the design system and roadmap.