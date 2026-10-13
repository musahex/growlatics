// Production export check, shared by PR CI, the deploy workflow (before upload) and scripts/deploy/selftest.sh.
//   node scripts/deploy/validate-export.mjs [dir=out]     exit 1 on any problem
//   node scripts/deploy/validate-export.mjs --self-test   proves the checks catch what they should
// Complements scripts/seo-crawl.mjs (per-page SEO); this one guards the artifact as a whole. See docs/deployment/CI_CD.md.
import { existsSync, readFileSync, readdirSync, statSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

export const ROUTES = ['/', '/about/', '/services/', '/services/sales-bpo/', '/services/performance-marketing/',
  '/services/customer-operations/', '/services/technology/', '/services/voice-ai-testing/', '/work/', '/contact/']
const SITE = 'https://growlatics.us'

export function validate(dir, { legalApproved = process.env.NEXT_PUBLIC_LEGAL_APPROVED === '1' } = {}) {
  const problems = []
  const bad = (m) => problems.push(m)
  const read = (f) => readFileSync(join(dir, f), 'utf8')
  if (!existsSync(dir)) return [`${dir} does not exist`]

  for (const f of ['index.html', '404.html', '.htaccess', 'robots.txt', 'sitemap.xml'])
    if (!existsSync(join(dir, f))) bad(`missing ${f}`)
  if (!existsSync(join(dir, '_next/static'))) bad('missing _next/static/')

  for (const r of ROUTES) {
    const f = join(r.slice(1), 'index.html')
    if (!existsSync(join(dir, f))) { bad(`route ${r} missing (${f})`); continue }
    const html = read(f)
    if (/<meta[^>]+name="robots"[^>]+noindex/.test(html)) bad(`route ${r} is noindex (preview build?)`)
    const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1]
    if (canonical !== SITE + r) bad(`route ${r} canonical ${canonical}`)
  }

  // Dev route and unapproved legal drafts never ship (scripts/postbuild.mjs drops them).
  for (const d of ['lab', ...(legalApproved ? [] : ['privacy', 'terms'])])
    if (existsSync(join(dir, d))) bad(`${d}/ must not be exported`)
  // GitHub Pages leftovers mean a preview artifact.
  if (existsSync(join(dir, '.nojekyll'))) bad('.nojekyll present (GitHub Pages artifact)')

  // Preview basePath anywhere in the export (HTML, RSC payloads, JS, CSS, manifest).
  const files = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? files(join(d, f)) : [join(d, f)]))
  for (const f of files(dir)) {
    if (!/\.(html|txt|js|css|json|webmanifest|xml)$/.test(f)) continue
    const s = readFileSync(f, 'utf8')
    if (/["'(]\/growlatics\/|musahex\.github\.io/.test(s)) bad(`preview path in ${f.slice(dir.length + 1)}`)
  }

  if (existsSync(join(dir, 'robots.txt'))) {
    const robots = read('robots.txt')
    if (/^Disallow:\s*\/\s*$/m.test(robots)) bad('robots.txt disallows everything')
    if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) bad('robots.txt has no production Sitemap line')
  }
  if (existsSync(join(dir, 'sitemap.xml'))) {
    const locs = [...read('sitemap.xml').matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1])
    for (const r of ROUTES) if (!locs.includes(SITE + r)) bad(`sitemap.xml misses ${r}`)
    for (const l of locs) if (!l.startsWith(SITE + '/')) bad(`sitemap.xml has foreign <loc> ${l}`)
  }
  if (existsSync(join(dir, '.htaccess')) && !/^ErrorDocument 404 \/404\.html$/m.test(read('.htaccess')))
    bad('.htaccess lacks ErrorDocument 404 /404.html')
  return problems
}

function selfTest() {
  const root = mkdtempSync(join(tmpdir(), 'gl-validate-'))
  const make = (name, mutate) => {
    const d = join(root, name)
    const put = (f, s) => { mkdirSync(join(d, f, '..'), { recursive: true }); writeFileSync(join(d, f), s) }
    put('_next/static/chunks/a.js', 'x')
    put('404.html', '<meta name="robots" content="noindex">')
    put('.htaccess', 'ErrorDocument 404 /404.html\n')
    put('robots.txt', `User-Agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)
    put('sitemap.xml', ROUTES.map((r) => `<url><loc>${SITE}${r}</loc></url>`).join(''))
    for (const r of ROUTES) put(join(r.slice(1), 'index.html'), `<link rel="canonical" href="${SITE}${r}"/>`)
    mutate?.(d, put)
    return d
  }
  const cases = {
    good: [null, 0],
    noHtaccess: [(d) => rmSync(join(d, '.htaccess')), /missing \.htaccess/],
    missingRoute: [(d) => rmSync(join(d, 'work'), { recursive: true }), /route \/work\/ missing/],
    noindex: [(d, put) => put('about/index.html', `<meta name="robots" content="noindex, nofollow"><link rel="canonical" href="${SITE}/about/"/>`), /noindex/],
    previewPath: [(d, put) => put('_next/static/chunks/b.js', 'a="/growlatics/_next/x"'), /preview path/],
    legalDraft: [(d, put) => put('terms/index.html', ''), /terms\/ must not/],
    lab: [(d, put) => put('lab/index.html', ''), /lab\/ must not/],
    nojekyll: [(d, put) => put('.nojekyll', ''), /nojekyll/],
    disallow: [(d, put) => put('robots.txt', 'User-agent: *\nDisallow: /\n'), /disallows/],
  }
  let failed = 0
  for (const [name, [mutate, expect]] of Object.entries(cases)) {
    const p = validate(make(name, mutate), { legalApproved: false })
    const ok = expect === 0 ? p.length === 0 : p.some((m) => expect.test(m))
    if (!ok) { failed++; console.log(`FAIL ${name}: ${JSON.stringify(p)}`) }
  }
  const legalOk = validate(make('legalOk', (d, put) => put('terms/index.html', '')), { legalApproved: true })
  if (legalOk.length) { failed++; console.log(`FAIL legalOk: ${JSON.stringify(legalOk)}`) }
  rmSync(root, { recursive: true, force: true })
  console.log(failed ? `self-test: ${failed} case(s) failed` : `self-test: ${Object.keys(cases).length + 1} cases pass`)
  process.exitCode = failed ? 1 : 0
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv[2] === '--self-test') selfTest()
  else {
    const dir = process.argv[2] || 'out'
    const problems = validate(dir)
    for (const p of problems) console.log(' - ' + p)
    console.log(`export ${dir}: ${problems.length} problem(s)`)
    process.exitCode = problems.length ? 1 : 0
  }
}
