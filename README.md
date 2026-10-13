# Growlatics website

Marketing site for Growlatics, an international growth operations partner: four connected systems — Acquire (Performance Marketing), Sell (Sales & BPO), Operate (Customer Operations) and Build (Technology & Development).

Live at **https://growlatics.us**, hosted on **Hostinger** as a static export. There is no server: no API routes, no server rendering, no Node on the host.

Design and content specs: `docs/v2/` (`MASTER_BRIEF.md`, `DIRECTION.md`, `IA_AND_COPY.md`, `PLAN.md`).

## Stack

Next.js 14 (App Router, `output: 'export'`, `trailingSlash: true`) · React 18 · TypeScript · Tailwind CSS (tokens in `app/globals.css`) · Framer Motion · Three.js + React Three Fiber (loaded lazily, tier 2 devices only).

## Structure

```txt
app/                    routes: / /services/ /services/[slug]/ /work/ /about/ /contact/ (+ /privacy/ /terms/ drafts, noindex)
content/                all copy, typed TS modules (single source; no CMS)
components/
  home/                 homepage acts 1–9
  system/               the network: graph model, act layouts, SVG / Canvas2D / WebGL renderers, runtime
  pages/ patterns/      internal-page building blocks (hero, ledger, schematic, handoff strip, rail, CTA, contact flow)
  layout/ brand/ ui/    header, footer, mark, buttons, sections
lib/                    seo, motion constants, utils, leads/ (contact-form adapter)
scripts/                seo-crawl.mjs (export checker), gen-brand-assets.mjs
```

## Develop

```bash
npm ci
npm run dev          # http://localhost:3000
npx tsc --noEmit
npm run lint
```

`/lab/system/` is a dev-only test bench for the network (every tier and act layout). It exists under `npm run dev` only.

## Build

```bash
npm run build                 # writes the static site to out/, then postbuild removes out/lab/
node scripts/seo-crawl.mjs    # checks out/: metadata, links, headings (exits 1 on any problem)
```

Always use `npm run build`: calling `npx next build` directly skips `postbuild`, and the lab ships.
`npm run start` does not serve a static export; preview `out/` with any static file server.

## Deploy (Hostinger)

1. `npm run build` (with the env vars below set, if used).
2. Upload the **contents** of `out/` to the site's `public_html/`.
3. Include `.htaccess` (copied from `public/.htaccess`). It is a dotfile, so some upload tools skip it. Without it Hostinger shows its generic 404 page instead of the branded `404.html`.

`.github/workflows/deploy.yml` is the legacy GitHub Pages deploy; it runs only when triggered by hand.

## Environment variables

Optional. Both are inlined at **build** time, so set them where you run `npm run build`, not on the host.

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_LEAD_WEBHOOK_URL` | Contact form POSTs JSON here. Unset: the form opens a prefilled email. |
| `NEXT_PUBLIC_BOOKING_URL` | Booking link shown after the form. |

Lead adapter self-check: `node -e "require('jiti')(process.cwd()+'/', {alias:{'@':process.cwd()}})('./lib/leads/selfcheck.ts')"`.

## Content rules

- Copy lives in `content/`. Strings marked `verify: true` are claims the owner must confirm before launch.
- Proof (`content/proof.ts`) is empty until there are approved client results; proof components render nothing when empty.
