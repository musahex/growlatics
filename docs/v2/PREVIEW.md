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
gh workflow run preview-pages.yml --ref v2
```
The workflow (`.github/workflows/preview-pages.yml`) is manual only and always builds `v2`. Repo Settings › Pages must have Source = GitHub Actions.

Local check: `NEXT_PUBLIC_SITE_ENV=preview npm run build && mkdir -p $TMPDIR/pv && cp -R out $TMPDIR/pv/growlatics && python3 -m http.server --directory $TMPDIR/pv`, then open http://localhost:8000/growlatics/. Rebuild with plain `npm run build` before any Hostinger upload.

## Remove it
1. Settings › Pages › Unpublish site.
2. Delete `.github/workflows/preview-pages.yml`.
3. Or revert the commit "Add manual GitHub Pages preview deployment".
