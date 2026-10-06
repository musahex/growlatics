# GitHub Pages preview

A private-ish review copy of branch `v2` at **https://musahex.github.io/growlatics/**. Production stays **https://growlatics.us** (Hostinger, built with plain `npm run build`); nothing here changes it.

## What differs in a preview build
Set by `NEXT_PUBLIC_SITE_ENV=preview` (unset = production, byte-for-byte as before):
- `basePath: '/growlatics'` (`next.config.mjs`); the manifest link uses `NEXT_PUBLIC_BASE_PATH`.
- Every page gets `<meta name="robots" content="noindex, nofollow">` (`lib/seo.ts`, `app/not-found.tsx`).
- `scripts/preview-postbuild.mjs` (run by `postbuild`, no-op in production) writes `out/robots.txt` as `Disallow: /` and prefixes `out/site.webmanifest` paths.
- Canonical, OG, JSON-LD and the sitemap still point at https://growlatics.us.

## Run it
```sh
gh workflow run deploy.yml --ref v2 --repo musahex/growlatics
```
GitHub only dispatches workflows that exist on the default branch (`main`), and only `deploy.yml` does. So on `v2`, `deploy.yml` is a manual-only wrapper that calls `.github/workflows/preview-pages.yml` (which always builds `v2`). Repo Settings › Pages must have Source = GitHub Actions, and the `github-pages` environment allows branch `v2` (added 2026-10-07 for this preview).

Never push `main` while remote `main` is `8925b85`: its old `deploy.yml` publishes the old site to Pages on every push.

Local check: `NEXT_PUBLIC_SITE_ENV=preview npm run build && mkdir -p $TMPDIR/pv && cp -R out $TMPDIR/pv/growlatics && python3 -m http.server --directory $TMPDIR/pv`, then open http://localhost:8000/growlatics/. Rebuild with plain `npm run build` before any Hostinger upload.

## Remove it
1. Settings › Pages › **Unpublish site** (or `gh api -X DELETE repos/musahex/growlatics/pages` to drop the Pages config entirely). Check https://musahex.github.io/growlatics/ returns 404.
2. Remove the `v2` deploy rule: Settings › Environments › github-pages › Deployment branches, delete `v2`.
3. On `v2`, revert the two commits "Add manual GitHub Pages preview deployment" and "Run the Pages preview through deploy.yml" (before merging `v2` into `main` for Hostinger).
