// Preview-only postbuild (NEXT_PUBLIC_SITE_ENV=preview, served at /growlatics): block crawlers and point
// the static manifest at the base path. A no-op for production builds. See docs/v2/PREVIEW.md.
import { readFileSync, writeFileSync } from 'node:fs'

if (process.env.NEXT_PUBLIC_SITE_ENV === 'preview') {
  const base = '/growlatics'
  writeFileSync('out/robots.txt', 'User-agent: *\nDisallow: /\n')
  const m = JSON.parse(readFileSync('out/site.webmanifest', 'utf8'))
  m.start_url = `${base}${m.start_url}`
  for (const i of m.icons) i.src = `${base}${i.src}`
  writeFileSync('out/site.webmanifest', JSON.stringify(m, null, 2) + '\n')
}
