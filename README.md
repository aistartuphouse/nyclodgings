# AI Startup House Lodging site

Marketing and request front end for the residency housing: Mansfield and
Seton in Manhattan, Capitol in Downtown Austin. Since 2026-09-08 the site
takes applications only (no instant booking); the housing team creates every
booking and sends a payment link from its own console. This repository
contains the front end only; the booking/payment backend is operated
separately and is not part of this codebase.

## Stack

- Next.js 16 (App Router) + Tailwind CSS 4
- React Three Fiber hero scene (desktop only, static fallback elsewhere)
- Self-hosted fonts: Exo 2 (display), Inter (body), JetBrains Mono
- Palette and typography match aistartuphouse.com

## Run locally

```bash
bun install
bun run dev     # http://localhost:3010
bun run build   # production build
```

Node/npm also works (`npm install && npm run dev`).

## Environment

Copy `.env.local.example` to `.env.local`.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Booking backend base URL. Without it, marketing pages render fully; live price quotes and checkout are disabled. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL used in metadata, sitemap and robots (e.g. `https://lodgings.aistartuphouse.com`). |

## Content

Building copy, rates, photos and included-amenities lists live in
`lib/buildings.ts` and `public/images/`. Tax bands and booking copy are in
`app/page.tsx`. Pricing shown in the UI is display-only; the backend quote
is authoritative at checkout.

## Deploying under lodgings.aistartuphouse.com

Two options:

1. Point the subdomain at the existing production deployment (recommended;
   booking keeps working with zero setup): add the domain to the current
   Vercel project and create a DNS `CNAME lodgings -> cname.vercel-dns.com`.
2. Deploy this repository to your own hosting and set the two environment
   variables above. Booking requires `NEXT_PUBLIC_BACKEND_URL` to point at
   the operator's backend.
