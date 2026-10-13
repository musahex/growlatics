import { chromium } from '/Users/moses/bat/career-ops/node_modules/playwright-core/index.mjs'
const [,, base, tag, outDir] = process.argv
const widths = [[1440, 900], [1024, 768], [820, 1180], [390, 844]]
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const rows = []
for (const theme of ['light', 'dark']) for (const reduced of [false, true]) for (const [w, h] of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme, reducedMotion: reduced ? 'reduce' : 'no-preference', hasTouch: w < 1024 && w !== 820 ? true : false })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.evaluate((t) => { try { localStorage.setItem('theme', t) } catch {} ; document.documentElement.dataset.theme = t }, theme)
  await page.waitForTimeout(2500)
  const info = () => page.evaluate(() => {
    const f = document.querySelector('footer').getBoundingClientRect()
    const cur = [...document.querySelectorAll('div[aria-hidden]')].find((d) => d.style.zIndex.includes('z-cursor'))
    const link = cur?.children[0], ring = cur?.children[1]
    const m = ring && /translate3d\(([-\d.]+)px, ?([-\d.]+)px/.exec(ring.style.transform)
    const canvas = document.querySelector('[data-system-stage="fixed"] canvas')
    return { footerTop: f.top, cursor: !!cur, linkOp: link ? +link.style.opacity : 0, ringX: m ? +m[1] : null, ringY: m ? +m[2] : null, gl: !!canvas, tier: canvas ? (canvas.getContext ? 'canvas' : '') : 'none' }
  })
  // Wall time alone is not enough on SwiftShader: frames can take 200-650 ms and the scheduler caps a damping
  // step at 50 ms, so the ring and hairline ease slowly in real time. Also wait for frames; a real lock
  // or a drawn hairline never releases however many frames pass.
  const frames = (n) => page.evaluate((n) => new Promise((r) => { const f = () => (--n > 0 ? requestAnimationFrame(f) : r()); requestAnimationFrame(f) }), n)
  // Put the acts/footer boundary at 60% of the viewport.
  await page.evaluate(() => { const f = document.querySelector('footer'); scrollTo({ top: f.getBoundingClientRect().top + scrollY - innerHeight * 0.6, behavior: 'instant' }) })
  await page.waitForTimeout(1200)
  let viol = 0, linkV = 0, samples = 0
  const ft = (await info()).footerTop
  // Fast sweeps over the scene then into the footer (tests 2 and 3).
  for (let x = 40; x + 30 < w; x += Math.max(60, w / 12)) {
    await page.mouse.move(x, ft - 220, { steps: 2 })
    await page.mouse.move(x + 30, ft - 40, { steps: 3 })
    for (const dy of [20, 60, 120]) {
      if (ft + dy > h - 2) continue
      await page.mouse.move(x + 30, ft + dy, { steps: 2 })
      await page.waitForTimeout(260)
      if ((await info()).linkOp > 0.05) linkV++ // the hairline is refused at once outside the acts: no frame allowance
      await frames(12)
      const s = await info(); samples++
      const locked = s.ringX != null && Math.hypot(s.ringX - (x + 30), s.ringY - (ft + dy)) > 12
      if (s.linkOp > 0.05) linkV++
      if (locked) { viol++; if (w === 820) console.error("lock", x + 30, ft + dy, s.ringX, s.ringY) }
    }
  }
  if (w === 1440 && theme === 'light' && !reduced) await page.screenshot({ path: `${outDir}/${tag}-boundary-1440-light.png` })
  if (w === 1440 && theme === 'dark' && !reduced) await page.screenshot({ path: `${outDir}/${tag}-boundary-1440-dark.png` })
  // Test 4: cursor held over the footer while scrolling to the bottom (stage pauses).
  await page.mouse.move(w / 2, h - 60)
  await page.mouse.wheel(0, 4000); await page.waitForTimeout(800)
  await page.mouse.move(w / 2 + 3, h - 61); await page.waitForTimeout(300); await frames(12)
  const b = await info()
  const staleLock = b.ringX != null && (Math.hypot(b.ringX - (w / 2 + 3), b.ringY - (h - 61)) > 12 || b.linkOp > 0.05)
  // Test 5: back up, the scene is still drawing.
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await page.waitForTimeout(800)
  const up = await info()
  rows.push({ tag, theme, reduced, w, gl: up.gl, cursor: b.cursor, samples, footerLines: linkV, footerRingLocks: viol, staleLockAtBottom: staleLock, errors: errors.length, errText: errors.slice(0, 2).join(' | ').slice(0, 200) })
  await ctx.close()
}
await browser.close()
console.log(JSON.stringify(rows))
