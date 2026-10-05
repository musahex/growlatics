# Growlatics v2: Phase 7 technical review

Branch `v2-review-tech` from `v2` b38aef3. Worker: worker-gl-review-tech (temp), reviewing code it did not write. Date 2026-10-06.
Gates on the final commit: `npm run build` (static export), `npx tsc --noEmit`, `npm run lint`, `node scripts/seo-crawl.mjs` (0 problems) and the `lib/leads` selfcheck all pass.

## 1. Fixed on this branch

| # | What | Where | Commit |
|---|---|---|---|
| F1 | **The contact form could freeze the browser tab.** `buildMailto` shortened Notes down to `"x…"` and then looped forever when the other fields alone made the mailto URL longer than 2,000 characters (for example a long pasted website URL). I reproduced the hang. The loop now shortens the raw message, so it always ends. The email field is capped at 254 characters and the website field at 200. The selfcheck covers the case. | `lib/leads/index.ts:45-51`, `components/patterns/QualificationFlow.tsx:374,376`, `lib/leads/selfcheck.ts:28-30` | 6bff4f2 |
| F2 | `/work/` main content links to `/services/` ("See the four systems", the anchor text `content/journey.ts` already uses), as IA_AND_COPY §1.4 requires. The link is stored in content and rendered with the About page's link style. | `content/pages.ts` (work → report section), `app/work/page.tsx:38-42` | 750a22a |
| F3 | Removed the unused `@react-three/drei` from `package.json` and the lockfile (45 packages). I used `--package-lock-only` because `node_modules` is a symlink shared with the main checkout, and `main` still builds legacy code. The bundle is unchanged because nothing imported it. | `package.json`, `package-lock.json` | ce31bd2 |
| F4 | **`/lab/system/` is no longer in the production export.** A `postbuild` script deletes `out/lab/` and the lab page chunk. The route still works under `npm run dev`. This is documented in the README. Caveat: running `npx next build` directly skips `postbuild`, so always build with `npm run build`. The deploy workflow already does. | `package.json` scripts, `README.md` "Static export and the system lab" | 090842b |
| F5 | Theme toggle ran DOM writes, `localStorage` and `startViewTransition` inside a `setState` updater. React may call updaters more than once (StrictMode, concurrent re-renders). The next theme is now read from the DOM, side effects run once, then state is set. | `context/ThemeContext.tsx:27-43` | 5ce26d4 |
| F6 | Deleted exports that nothing used: `actLayout`, `ActLayout`, `ACT_COUNT` (`components/system/model/layouts.ts`), `CapabilitySystem` (`model/graph.ts`), `remeasure` (`stage/StageController.ts`) and `hasProof` (`content/proof.ts`). | as listed | deb2c1a |
| F7 | **The live site shows Hostinger's generic 404 page.** Checked live: `https://growlatics.us/zz-not-a-page/` returns 404 with title "This Page Does Not Exist". The export ships `404.html`, but nothing tells Apache/LiteSpeed to use it. Added `public/.htaccess` with `ErrorDocument 404 /404.html`; it is copied to `out/`. Because it is a dotfile, make sure the Hostinger upload includes it. | `public/.htaccess`, README | 53c3d49 |

First Load JS is unchanged: `/` 164 kB, internal pages 139–160 kB.

## 2. Checked and fine

- **Bundle composition.** `three` and `@react-three/fiber` appear only in two lazy chunks (`0c00d19e.*.js` 681 kB raw, `741.*.js` 150 kB). No exported HTML preloads or references them. They load only through `next/dynamic` in `components/system/stage/SystemStage.tsx:20-21` when the device gets tier 2. framer-motion is in the shared chunk.
- **Static export.** No `next/headers`, cookies, route handlers, `revalidate`, server actions or `next/image`. `?system=` is read from `window.location` inside an effect (`QualificationFlow.tsx:177`), so no `useSearchParams` Suspense trap. `dynamicParams = false` plus `generateStaticParams` on `/services/[slug]`.
- **Trailing slashes.** Every internal `href` in source and in `out/**/index.html` ends in `/` (or `/#…`, `/?system=…#book`). `out/404.html` is generated, `noindex`, and links to `/`, `/services/` and `/contact/`.
- **Animation lifecycle.** There is one rAF loop (`runtime/scheduler.ts`). It stops when no tasks are left or the tab is hidden. Window listeners are reference-counted, attached once and fully removed (`SystemProvider.tsx:115-125`). Stage tasks start and stop with an IntersectionObserver and are cleaned up on unmount (`SystemStage.tsx:161-195`); an `on` guard stops the stage controller's reference count from going negative. The cursor removes its task, listener hook and class on cleanup. On a client route change, the fixed home stage unmounts, which clears `sys.live` and the controller. This matches PERF's runtime measurements.
- **Graph and content ids.** All 28 graph nodes resolve to a content label through `getLabel` (scripted check). The FOUNDATION/SYSTEM-3D id gap is closed and `FALLBACK_LABELS` is gone.
- **`lib/leads`.** The subject and body use `encodeURIComponent` (`&`, `—` and `ü` are covered by the selfcheck). Env slots are `NEXT_PUBLIC_LEAD_WEBHOOK_URL` and `NEXT_PUBLIC_BOOKING_URL`; both are inlined at build time, so they must be set when you build, not on the host. The webhook has a 10 s abort timer that is always cleared. `bookingHref` falls back to the raw URL if parsing fails.
- **Type safety.** No `any`, no `@ts-ignore` or `@ts-expect-error`. There are two `eslint-disable` comments: `<img>` for approved proof logos, and one `exhaustive-deps` in the lab.
- **Frozen files.** After FOUNDATION, HOME and PAGES (phases 3/4) did not touch any frozen file. Phase 5/6 edits to frozen files stayed inside what PLAN granted them: PERF changed `globals.css` (bug fixes) and `lib/motion.ts`; SEO changed `lib/seo.ts`, the `app/layout.tsx` metadata and the `Footer` landmarks. The only edit outside any ownership list is PERF's `lib/utils.ts` (tailwind-merge config), which PERF flagged and which is correct. This branch edits no frozen file.

## 3. Found, not fixed (with reasons)

| Sev | Finding | Where | Why left / suggestion |
|---|---|---|---|
| Med | README is stale. It describes the legacy site (Hero, GlobalGrowthScene, ThreeGrowthWindow, custom-cursor background), recommends Vercel, and says `npm run start` previews the build (it does not with `output: 'export'`). I only added an accurate build/export/404 section. | `README.md:40-80`, `:160-185` | A doc rewrite, not a code fix. Rewrite it at final QA. |
| Med | `lib/tokens.ts` is almost entirely dead. Only `bgHex` is imported (`app/layout.tsx:11`); `signal`, `signalHex`, `signalDeepHex`, `textHex`, `text4Hex`, `ink`, `alpha` and `RGB` are unused. The header comment says SYSTEM-3D would replace it. | `lib/tokens.ts:3-14` | Frozen file (god only). Suggest reducing it to `bgHex`. |
| Low | `damp` is defined twice. The `lib/motion.ts` copy and `dampK` are unused; everything uses the scheduler's copy. | `lib/motion.ts:45-46`, `components/system/runtime/scheduler.ts:54` | Frozen file. Delete the `lib/motion` pair. |
| Low | `components/brand/Mark.tsx` still uses framer's `useReducedMotion`. Everything else uses the hydration-safe one in `lib/motion`. It does not throw today because it only changes a variant. | `components/brand/Mark.tsx:3,35` | Frozen (`components/brand`). This is a one-line import swap. |
| Low | `public/images/growlatics-logo.png` is referenced by nothing in v2 and ships to `out/images/`. | `public/images/` | Left in place: an old email or social card might still link to the URL. Delete once that is ruled out. |
| Low | The inline text-link class (`inline-flex min-h-11 items-center text-body-s font-semibold text-signal-ink hover:text-text` + `→`) is copied in 7 places. | `app/about/page.tsx:31`, `app/work/page.tsx:39`, `app/services/page.tsx:46`, `app/services/[slug]/page.tsx:114`, `components/home/acts.tsx:37`, `components/ui/Button.tsx:14`, `components/patterns/QualificationFlow.tsx:404` | This is a refactor across PAGES and HOME files. Have the pages use the `Button` text variant or a shared `TextLink`. |
| Low | If a scheduler task removes itself during a frame, the task right after it is skipped for that frame. Today only the cursor does this, and it is last (order 40), so nothing is affected. | `components/system/runtime/scheduler.ts:27,43-45` | Latent only. Iterate over a copy, or defer removals, if another task ever self-removes. |
| Low | `'var(--z-…)' as unknown as number` casts for `zIndex`. | `InteractiveCursor.tsx:140`, `SystemStage.tsx:212`, `SpatialLabel.tsx:103` | Cosmetic. Use a Tailwind `z-` class or a typed CSS variable. |
| Info | `/privacy/` and `/terms/` ship in `out/` as `noindex`, unlinked drafts, as PLAN intends. | `app/privacy`, `app/terms` | Owner legal decision at final QA. |
| Info | Carried from PERF: real-GPU frame rate is unmeasured; `/` static HTML is 353 kB uncompressed (51 kB gzip) because of dual act figures; act 7 is busy at 1024–1280. | `docs/v2/PERF_A11Y_REPORT.md` §6 | Not re-measured here. |

## 4. Not done

- No frozen-file edits, no redesign, no copy changes beyond the one link (its label reuses existing copy).
- No browser run. The review used the build, the exported HTML, the crawler and Node checks.
