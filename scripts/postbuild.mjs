// Runs after `next build` (package.json postbuild). See docs/v2/PREVIEW.md and docs/v2/audit/tech-seo.md.
import { readFileSync, rmSync, writeFileSync } from 'node:fs'

// Dev-only pages never ship.
const drop = ['out/lab', 'out/_next/static/chunks/app/lab']
// Unapproved legal drafts stay out of every export until the owner sets NEXT_PUBLIC_LEGAL_APPROVED=1 (brief §16).
if (process.env.NEXT_PUBLIC_LEGAL_APPROVED !== '1')
  for (const p of ['privacy', 'terms']) drop.push(`out/${p}`, `out/_next/static/chunks/app/${p}`)
for (const d of drop) rmSync(d, { recursive: true, force: true })

// GitHub Pages preview (served at /growlatics, every page meta noindex,nofollow).
if (process.env.NEXT_PUBLIC_SITE_ENV === 'preview') {
  const base = '/growlatics'
  // No Disallow: a crawler that may not fetch a page never sees its noindex. GitHub Pages only honours
  // robots.txt at the host root (musahex.github.io/robots.txt), so this file is informational anyway.
  writeFileSync('out/robots.txt', 'User-agent: *\nAllow: /\n')
  const m = JSON.parse(readFileSync('out/site.webmanifest', 'utf8'))
  m.start_url = `${base}${m.start_url}`
  for (const i of m.icons) i.src = `${base}${i.src}`
  writeFileSync('out/site.webmanifest', JSON.stringify(m, null, 2) + '\n')
}
