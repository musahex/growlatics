// Post-deploy smoke test over HTTP (no browser). Every check is labelled HTTP; none proves email delivery.
//   node scripts/deploy/smoke.mjs <base_url> <expected_release_id> [--basic] [--local]
// --basic  rollback verification: release marker, home page, 404 only (an older release may have other routes)
// --local  selftest.sh against a plain static server: skips redirects, TLS and .htaccess headers
// Writes a Markdown table to $GITHUB_STEP_SUMMARY when set. Exit 1 on any failure.
import { appendFileSync } from 'node:fs'
import { ROUTES } from './validate-export.mjs'

const [base, expected] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const basic = process.argv.includes('--basic'), local = process.argv.includes('--local')
if (!base || !expected) { console.error('usage: smoke.mjs <base_url> <expected_release_id> [--basic] [--local]'); process.exit(2) }
const SITE = 'https://growlatics.us'
const bust = `smoke=${encodeURIComponent(expected)}` // bypasses CDN copies of the previous release
const url = (p) => new URL(p + (p.includes('?') ? '&' : '?') + bust, base).href
const results = []
const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail })
const skip = (name, why) => results.push({ name, ok: true, detail: `SKIPPED (${why})`, skipped: true })
const get = async (p, opt = {}) => {
  for (let i = 0; ; i++) {
    try { const r = await fetch(url(p), { redirect: 'manual', ...opt }); return { status: r.status, headers: r.headers, body: await r.text(), location: r.headers.get('location') } }
    catch (e) { if (i === 2) return { status: 0, headers: new Headers(), body: '', error: e.message }; await new Promise((s) => setTimeout(s, 3000)) }
  }
}

// The marker can lag behind a CDN for a short while: retry up to ~60s before calling it a failure.
let marker
for (let i = 0; i < (local ? 1 : 12); i++) { marker = await get('/deploy-release.txt'); if (marker.body.split('\n')[0] === expected) break; await new Promise((s) => setTimeout(s, 5000)) }
check('HTTP release marker /deploy-release.txt', marker.body.split('\n')[0] === expected, `got "${marker.body.split('\n')[0] || marker.status}"`)

const home = await get('/')
check('HTTP / 200', home.status === 200, home.status)
const nf = await get(`/smoke-missing-${Date.now()}/`)
check('HTTP unknown URL → 404 (branded page)', nf.status === 404 && /<html/i.test(nf.body), nf.status)

if (!basic) {
  for (const r of ROUTES) {
    const res = r === '/' ? home : await get(r)
    const canon = (res.body.match(/<link rel="canonical" href="([^"]*)"/) || [])[1]
    const noindex = /<meta[^>]+name="robots"[^>]+noindex/.test(res.body)
    check(`HTTP ${r}`, res.status === 200 && !noindex && canon === SITE + r && !/["(]\/growlatics\//.test(res.body),
      `${res.status}${noindex ? ' noindex' : ''}${canon !== SITE + r ? ` canonical=${canon}` : ''}`)
  }
  const robots = await get('/robots.txt')
  check('HTTP robots.txt', robots.status === 200 && robots.body.includes(`Sitemap: ${SITE}/sitemap.xml`) && !/^Disallow:\s*\/\s*$/m.test(robots.body), robots.status)
  const sm = await get('/sitemap.xml')
  check('HTTP sitemap.xml lists the 9 routes', sm.status === 200 && ROUTES.every((r) => sm.body.includes(`<loc>${SITE}${r}</loc>`)), sm.status)

  // Every local asset the home and contact pages reference (chunks, CSS, fonts, images, icons, manifest).
  const contact = await get('/contact/')
  const assets = new Set([...(home.body + contact.body).matchAll(/(?:href|src)="(\/[^"#?]+\.(?:js|css|woff2?|png|jpe?g|svg|ico|webp|webmanifest))"/g)].map((m) => m[1]))
  const bad = []
  for (const a of assets) { const r = await get(a, { method: 'HEAD' }); if (r.status !== 200) bad.push(`${a} ${r.status}`) }
  check(`HTTP ${assets.size} referenced assets load`, assets.size > 5 && !bad.length, bad.slice(0, 5).join(', '))
  check('HTTP contact CTA: home links /contact/, contact has the form and mailto fallback',
    home.body.includes('href="/contact/') && /<form/.test(contact.body) && contact.body.includes('mailto:'), 'delivery to the inbox is NOT checked')

  if (local) for (const n of ['security headers', 'cache headers', 'HTTPS redirect', 'www → apex']) skip(`HTTP ${n}`, 'local static server')
  else {
    const h = home.headers
    const want = { 'x-content-type-options': /nosniff/, 'referrer-policy': /strict-origin/, 'x-frame-options': /SAMEORIGIN/i, 'permissions-policy': /camera=\(\)/, 'content-security-policy': /frame-ancestors/ }
    const miss = Object.entries(want).filter(([k, re]) => !re.test(h.get(k) || '')).map(([k]) => k)
    check('HTTP security headers (.htaccess)', !miss.length, miss.length ? `missing ${miss.join(', ')}` : '')
    check('HTTP HTML Cache-Control no-cache', /no-cache/.test(h.get('cache-control') || ''), h.get('cache-control'))
    const chunk = [...assets].find((a) => a.startsWith('/_next/static/'))
    const ch = chunk && (await get(chunk, { method: 'HEAD' })).headers.get('cache-control')
    check('HTTP /_next/static immutable', /immutable/.test(ch || ''), ch)
    const host = new URL(base).host
    const http = await fetch(`http://${host}/about/`, { redirect: 'manual' }).catch(() => null)
    check('HTTP http:// → https://', http && [301, 302, 307, 308].includes(http.status) && /^https:/.test(http.headers.get('location') || ''), http ? `${http.status} ${http.headers.get('location')}` : 'no answer')
    const www = await fetch(`https://www.${host}/about/`, { redirect: 'manual' }).catch(() => null)
    check('HTTP www → apex (301)', www && www.status === 301 && www.headers.get('location') === `https://${host}/about/`, www ? `${www.status} ${www.headers.get('location')}` : 'no answer')
  }
}

const failed = results.filter((r) => !r.ok)
const table = ['| Check | Result | Detail |', '|---|---|---|', ...results.map((r) => `| ${r.name} | ${r.skipped ? '⏭️' : r.ok ? '✅' : '❌'} | ${String(r.detail ?? '').replace(/\|/g, '\\|')} |`)].join('\n')
console.log(table)
console.log(`\nsmoke ${basic ? '(basic) ' : ''}${base} expecting ${expected}: ${failed.length ? `${failed.length} FAILED` : 'PASS'}`)
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `\n### Smoke test ${basic ? '(basic, rollback) ' : ''}— ${failed.length ? 'FAILED' : 'PASS'}\nHTTP checks only; no browser test, no inbox delivery check.\n\n${table}\n`)
process.exitCode = failed.length ? 1 : 0
