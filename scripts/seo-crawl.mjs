// SEO crawl of the static export: node scripts/seo-crawl.mjs (after `npm run build`).
// Checks per page: title, description, canonical, OG/Twitter, robots, H1 count, heading order,
// JSON-LD types, internal links (dead, '#', legal drafts), and click depth to service pages.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const OUT = 'out'
const SITE = 'https://growlatics.us'
const pages = []
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? (f !== '_next' && walk(p)) : f.endsWith('.html') && pages.push(p) })
walk(OUT)

const attr = (tag, name) => (tag.match(new RegExp(`${name}="([^"]*)"`)) || [])[1]
const meta = (html, key) => { for (const m of html.matchAll(/<meta [^>]*>/g)) if (attr(m[0], 'name') === key || attr(m[0], 'property') === key) return attr(m[0], 'content'); return undefined }
const routeOf = (p) => '/' + p.slice(OUT.length + 1).replace(/index\.html$/, '').replace(/\.html$/, '')
const exists = (href) => { const clean = href.split(/[?#]/)[0]; if (!clean) return true; const p = join(OUT, clean); return existsSync(join(p, 'index.html')) || (existsSync(p) && statSync(p).isFile()) }

const links = {}, problems = [], rows = []
for (const p of pages.sort()) {
  const html = readFileSync(p, 'utf8')
  const route = routeOf(p)
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1]
  const canonical = attr((html.match(/<link rel="canonical"[^>]*>/) || [''])[0], 'href')
  const robots = meta(html, 'robots')
  const body = html.replace(/<script[\s\S]*?<\/script>/g, '')
  const heads = [...body.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1])
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1])
  const jsonld = ld.flatMap((t) => { const j = JSON.parse(t); return (j['@graph'] || [j]).map((x) => x['@type']) })
  // Factual-only structured data: none of these may appear (IA §7, brief §5).
  const banned = ld.join('').match(/"(address|aggregateRating|review|ratingValue|foundingDate|numberOfEmployees|offers|price|LocalBusiness)"/g)
  const hrefs = [...body.matchAll(/<a [^>]*href="([^"]*)"/g)].map((m) => m[1].replace(/&amp;/g, '&'))
  links[route] = hrefs.filter((h) => h.startsWith('/')).map((h) => h.split(/[?#]/)[0])
  const skip = []; for (let i = 1; i < heads.length; i++) if (heads[i] > heads[i - 1] + 1) skip.push(`h${heads[i - 1]}→h${heads[i]}`)
  const noindex = /noindex/.test(robots || '')
  const r = { route, title, desc: meta(html, 'description')?.length ?? 0, canonical, ogImg: !!meta(html, 'og:image'), ogUrl: meta(html, 'og:url'), tw: meta(html, 'twitter:card'), robots: robots || '', h1: heads.filter((h) => h === 1).length, skip: skip.join(' '), jsonld: jsonld.join(',') }
  rows.push(r)
  const err = (m) => problems.push(`${route}: ${m}`)
  if (!title) err('no <title>')
  if (banned) err(`JSON-LD has ${[...new Set(banned)].join(' ')}`)
  for (const icon of ['/favicon.ico', '/apple-icon.png', '/icon.svg', '/site.webmanifest']) if (!html.includes(`href="${icon}`)) err(`no ${icon} link`)
  if (r.h1 !== 1) err(`${r.h1} h1`)
  if (skip.length) err(`heading skip ${r.skip}`)
  if (!noindex) {
    if (!r.desc) err('no description')
    if (canonical !== SITE + route) err(`canonical ${canonical}`)
    if (!r.ogImg || !r.tw) err('missing OG image / twitter card')
    if (r.ogUrl !== SITE + route) err(`og:url ${r.ogUrl}`)
  } else if (canonical && canonical !== SITE + route) err(`noindex page has foreign canonical ${canonical}`)
  for (const h of hrefs) {
    if (h === '#' || h === '') err(`empty/# link`)
    else if (/^\/(privacy|terms)\//.test(h) && !/^\/(privacy|terms)/.test(route)) err(`links to draft ${h}`)
    else if (h.startsWith('/') && !exists(h)) err(`dead link ${h}`)
  }
}

// Click depth from / (BFS over internal links).
const depth = { '/': 0 }, q = ['/']
while (q.length) { const r = q.shift(); for (const h of links[r] || []) if (!(h in depth)) { depth[h] = depth[r] + 1; q.push(h) } }
for (const s of ['/services/sales-bpo/', '/services/performance-marketing/', '/services/customer-operations/', '/services/technology/'])
  if (!(depth[s] <= 2)) problems.push(`${s}: click depth ${depth[s] ?? '∞'} (> 2)`)

// Sitemap / robots.
const sitemap = existsSync(join(OUT, 'sitemap.xml')) ? readFileSync(join(OUT, 'sitemap.xml'), 'utf8') : ''
const inMap = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1].replace(SITE, ''))
for (const r of rows) {
  const ni = /noindex/.test(r.robots)
  if (ni && inMap.includes(r.route)) problems.push(`sitemap lists noindex ${r.route}`)
  if (!ni && !inMap.includes(r.route) && r.route !== '/404' && r.route !== '/404/') problems.push(`sitemap misses indexable ${r.route}`)
}
for (const u of inMap) if (!exists(u)) problems.push(`sitemap lists missing ${u}`)

console.table(rows.map(({ route, title, desc, h1, skip, robots, jsonld }) => ({ route, title: title?.slice(0, 50), desc, h1, skip, robots, jsonld })))
console.log('robots.txt:\n' + (existsSync(join(OUT, 'robots.txt')) ? readFileSync(join(OUT, 'robots.txt'), 'utf8') : 'MISSING'))
console.log('sitemap:', inMap.join(' '))
console.log('click depth:', JSON.stringify(depth))
console.log(`\n${problems.length} problem(s)`); problems.forEach((p) => console.log(' - ' + p))
process.exitCode = problems.length ? 1 : 0
