import { chromium } from '/Users/moses/bat/career-ops/node_modules/playwright-core/index.mjs'
const base = process.argv[2]
const pages = ['/', '/services/', '/services/sales-bpo/', '/services/performance-marketing/', '/services/customer-operations/', '/services/technology/', '/services/voice-ai-testing/', '/about/', '/work/', '/contact/']
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const out = []
for (const theme of ['light', 'dark']) for (const [w, h] of [[1440, 900], [1024, 768], [820, 1180], [390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: theme, hasTouch: w === 390, isMobile: w === 390 })
  for (const path of pages) {
    const p = await ctx.newPage(); const errs = []
    p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
    const res = await p.goto(base + path, { waitUntil: 'networkidle' })
    // Walk the page so lazy stages load.
    for (let y = 0; y < 30000; y += h) { const done = await p.evaluate((y) => (scrollTo({ top: y, behavior: 'instant' }), y > document.body.scrollHeight), y); await p.waitForTimeout(120); if (done) break }
    await p.waitForTimeout(600)
    const r = await p.evaluate(() => {
      const bad = []
      for (const st of document.querySelectorAll('[data-system-stage]')) {
        const fixed = st.dataset.systemStage === 'fixed'
        const box = (fixed ? st.parentElement : st).getBoundingClientRect()
        if (fixed && getComputedStyle(st.parentElement).clipPath === 'none') bad.push('fixed stage wrapper not clipped')
        // Every painted descendant must lie inside its container, or be clipped by an overflow:hidden ancestor inside it.
        for (const el of st.querySelectorAll('canvas, svg, [data-spatial-label], div')) {
          const e = el.getBoundingClientRect(); if (!e.width || !e.height) continue
          let clipped = false
          for (let a = el.parentElement; a && a !== st.parentElement; a = a.parentElement) { const cs = getComputedStyle(a); if (cs.overflow === 'hidden' || cs.clipPath !== 'none') { const ab = a.getBoundingClientRect(); if (ab.left >= box.left - 1 && ab.right <= box.right + 1 && ab.top >= box.top - 1 && ab.bottom <= box.bottom + 1) { clipped = true; break } } }
          if (fixed) clipped = true // the wrapper's clip-path clips everything inside it
          if (!clipped && (e.left < box.left - 1 || e.right > box.right + 1 || e.top < box.top - 1 || e.bottom > box.bottom + 1)) bad.push(`${el.tagName} escapes ${st.dataset.systemStage} stage`)
        }
      }
      const hdr = document.querySelector('header'); const hz = hdr ? +getComputedStyle(hdr).zIndex || 0 : 0
      const canvases = [...document.querySelectorAll('canvas')].map((c) => +getComputedStyle(c.closest('[data-system-stage]') || c).zIndex || 0)
      if (canvases.some((z) => z >= hz && hz)) bad.push('canvas stacks at/above header')
      return { stages: document.querySelectorAll('[data-system-stage]').length, canvases: canvases.length, bad: [...new Set(bad)] }
    })
    // Mobile menu at 390: open it and make sure the top element in its middle is the menu, not a network layer.
    if (w === 390) {
      const btn = p.locator('button[aria-controls="mobile-menu"]').first()
      if (await btn.count()) { await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await btn.click(); await p.waitForTimeout(500)
        const hit = await p.evaluate(() => { const m = document.getElementById('mobile-menu').getBoundingClientRect(); const el = document.elementFromPoint(innerWidth / 2, m.top + Math.min(m.height, 200) / 2); return el?.closest('canvas,[data-system-stage]') ? 'network layer above menu' : null })
        if (hit) r.bad.push(hit) }
    }
    out.push({ theme, w, path, status: res.status(), ...r, errs: errs.length, e: errs[0]?.slice(0, 120) })
    await p.close()
  }
  await ctx.close()
}
await b.close()
for (const o of out) if (o.bad.length || o.errs || o.status !== 200) console.log('PROBLEM', JSON.stringify(o))
console.log('checked', out.length, 'page/width/theme runs; stages seen', out.reduce((a, o) => a + o.stages, 0), 'canvases', out.reduce((a, o) => a + o.canvases, 0))
