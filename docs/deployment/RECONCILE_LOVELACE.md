# Reconcile the manual lovelace release into v2 (prepared, NOT applied)

2026-10-12, gl-reconcile. Prepared on the throwaway branch `trial/reconcile-lovelace` (local only, never pushed, never merged into `v2` or `main`).

## Why this exists

The owner approved a one-time manual Hostinger release from `origin/claude/determined-lovelace-uv676d` @ `d2dbe47`, run by another session outside the CI/CD pipeline. `v2` does not contain those commits. The pipeline deploys whatever is on `main` (= `v2` after the fast-forward) and replaces the doc root with that build.

**Risk if `v2` is deployed without this merge:** the first CI deploy from `main` removes from production
- the owner-supplied Houston office address (`12123 Garner Mill Lane, Houston`) on /contact/, in the footer and in the Organization JSON-LD `PostalAddress`;
- the whole Voice AI Testing & QA page `/services/voice-ai-testing/` (it would 404) and its entries in the header Services menu, footer, /services/ and sitemap.

The pre-CI site would survive only inside the `v1-…` backup tarball. Merge this before `PRODUCTION_DEPLOY_ENABLED` is ever set to `true`.

## Branches

| Ref | Commit | Notes |
|---|---|---|
| `v2` (base) | `81524c3` | HAG-37 footer fix merged |
| lovelace | `d2dbe47` | forks `v2` at `9f8788a` |
| `trial/reconcile-lovelace` | `16fba46` | `c8a3511` merge + `16fba46` CI route fix |

**lovelace adds (4 commits):** `57a7f05` owner-supplied Houston address (owner-approved for publication) · `a5ccd94` address shown as street + city, geography line removed · `2ab863c` Voice AI Testing & QA page · `d2dbe47` voice-ai visuals (network stage, handoff strip, inspector, live figures).
18 files, +696 −27: new `app/services/voice-ai-testing/page.tsx`, `components/patterns/TestConsole.tsx`, `content/voice-ai.ts`; edits to contact/services pages, Header, Footer, ConvergenceCTA, PageHero, `content/{index,lead,nav,site,types}.ts`, `lib/seo.ts` (PostalAddress + sitemap route), `scripts/seo-crawl.mjs`, `tailwind.config.ts`, `docs/v2/OWNER_VERIFY.md`.

**v2 has that lovelace lacks (6 commits since `9f8788a`):** `e7b0a56` launch-readiness docs, `16390d7` service route fix + Growth Engine cursor, `32875a2` fix-route-engine report, `8f3b103` CI/CD pipeline, `845f3eb`/`81524c3` HAG-37 footer fix.

## Conflicts

**None, textual or file-level.** The two sides touch disjoint file sets (lovelace: site content/components; v2: workflows, `scripts/deploy/*`, `components/system/*`, `InteractiveCursor.tsx`, `app/services/[slug]/page.tsx`, docs). `git merge --no-ff` completed automatically.

**Semantic gaps found and fixed (commit `16fba46`):**

| File | Problem | Fix |
|---|---|---|
| `scripts/deploy/validate-export.mjs` | `ROUTES` (9 routes) lacked `/services/voice-ai-testing/`: the export validator and the smoke test (imports `ROUTES`) would not check the page exists, has its canonical, or is in the sitemap | route added (10) |
| `scripts/deploy/smoke.mjs` | label "sitemap.xml lists the 9 routes" | "lists every route" |
| `docs/v2/audit/shots/fix-route-engine/audit.mjs` | audit page list lacked the route | route added |

Already consistent from lovelace: `lib/seo.ts` `sitemapRoutes` (sitemap now 10 URLs), `scripts/seo-crawl.mjs` (click-depth list includes the page; `address` dropped from the banned JSON-LD keys because the owner approved publishing the address; `LocalBusiness` still banned). `app/services/[slug]` (v2 route fix) and the static `app/services/voice-ai-testing/` coexist: the build emits the page as static `○`.

## Gate results on `trial/reconcile-lovelace` @ `16fba46`

| Gate | Result |
|---|---|
| `npx tsc --noEmit` | PASS |
| `npm run lint` | PASS |
| lead adapter selfcheck (`lib/leads/selfcheck.ts`) | PASS |
| `validate-export.mjs --self-test` | PASS |
| `check-workflows.mjs --self-test` and `check-workflows.mjs` | PASS |
| `npm run build` (plain, no `NEXT_PUBLIC_SITE_ENV`) | PASS; `/services/voice-ai-testing` 3.57 kB, first load 169 kB |
| `node scripts/seo-crawl.mjs` | PASS, 0 problems; 10 sitemap URLs; voice-ai click depth 1 |
| `validate-export.mjs out` | PASS |
| `bash scripts/deploy/selftest.sh` | PASS, 35 checks |
| `footer.mjs` on `out/` served by `python3 -m http.server` | PASS: 16/16 configs (light/dark × reduced/not × 1440/1024/820/390), 0 footer lines, 0 ring locks, 0 page errors |

Export check: `out/services/voice-ai-testing/` exists; "Garner Mill Lane, Houston" present on `/` and `/contact/`.

## Apply (god, after approval)

First confirm the lovelace tip has not moved (the other session may have added commits):

```sh
cd /Users/moses/Growlatics
git fetch origin claude/determined-lovelace-uv676d
git rev-parse origin/claude/determined-lovelace-uv676d   # expect d2dbe47…; if not, redo the merge below
git rev-parse v2                                          # expect 81524c3…
```

If both match, fast-forward `v2` to the trial branch:

```sh
git checkout v2 && git merge --ff-only trial/reconcile-lovelace   # v2 → 16fba46
```

If either moved, redo it on the new tips (no conflicts expected unless someone touched the same files):

```sh
git checkout v2
git merge --no-ff origin/claude/determined-lovelace-uv676d -m "Merge lovelace manual release into v2 (Houston address, Voice AI Testing page)"
git cherry-pick 16fba46     # deploy route list + smoke label
grep -n "voice-ai-testing" scripts/deploy/validate-export.mjs lib/seo.ts scripts/seo-crawl.mjs   # all three must match
```

Then run the gates in a throwaway worktree (never `npm run build` in `/Users/moses/Growlatics`: it clobbers the owner's dev server `.next`):

```sh
W=$TMPDIR/gl-apply; git worktree add --detach $W v2 && cd $W && ln -s /Users/moses/Growlatics/node_modules node_modules
npx tsc --noEmit && npm run lint && node scripts/deploy/validate-export.mjs --self-test && node scripts/deploy/check-workflows.mjs --self-test && node scripts/deploy/check-workflows.mjs \
 && npm run build && node scripts/seo-crawl.mjs && node scripts/deploy/validate-export.mjs out && bash scripts/deploy/selftest.sh
```

Cleanup of the trial: `git worktree remove --force <trial worktree> && git branch -D trial/reconcile-lovelace` (after the apply, or if it is abandoned).

## Follow-ups

- Any further commit on the lovelace branch must be merged the same way before the first CI deploy; compare `git log v2..origin/claude/determined-lovelace-uv676d` (must be empty) right before setting `PRODUCTION_DEPLOY_ENABLED=true`.
- On the first CI deploy the live lovelace build becomes the `v1-…` backup (`HOSTINGER_V1_REVIEWED` flow); rollback to `v1` restores it.
- The manual browser pass now covers 10 pages, including `/services/voice-ai-testing/`.
