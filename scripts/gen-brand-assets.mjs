// Regenerates the raster brand assets in public/ from the canonical five-bar mark (app/icon.svg geometry)
// with headless Chrome: node scripts/gen-brand-assets.mjs (after `npm run build`, for the Inter font in out/).
// Writes public/{og-image.png (1200×630), logo.png (512), icon-192/512.png} and app/{apple-icon.png (180), favicon.ico (32)}.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, readFileSync, readdirSync, existsSync } from 'node:fs'
import { tmpdir, homedir } from 'node:os'
import { join, resolve } from 'node:path'

// Playwright's chrome-headless-shell (exits after the screenshot; full Chrome --headless=new can hang). CHROME= overrides.
const PW = join(homedir(), 'Library/Caches/ms-playwright')
const CHROME = process.env.CHROME ?? readdirSync(PW).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(PW, d, 'chrome-headless-shell-mac-arm64/chrome-headless-shell')).find(existsSync)
const PUB = resolve('public')
const tmp = mkdtempSync(join(tmpdir(), 'gl-brand-'))
const css = readdirSync('out/_next/static/css').map((f) => readFileSync(join('out/_next/static/css', f), 'utf8')).join('')
const font = (family) => resolve('out' + css.match(new RegExp(`font-family:__${family}_[^;]+;[^}]*?src:url\\((/_next/static/media/[^)]+)\\)[^}]*unicode-range:u\\+00\\?\\?`))[1])

// Canonical mark: viewBox 66×70, bars 10 wide, gap 4, radius 3, heights 32/52/70/86/100 %.
const mark = (h, fill = '#D2401A') =>
  `<svg viewBox="0 0 66 70" height="${h}" width="${(h * 66) / 70}">${[0.32, 0.52, 0.7, 0.86, 1].map((p, i) => `<rect x="${i * 14}" y="${70 - p * 70}" width="10" height="${p * 70}" rx="3" fill="${fill}"/>`).join('')}</svg>`

const shoot = (name, w, h, body, transparent = false) => {
  const file = join(tmp, name + '.html')
  writeFileSync(file, `<!doctype html><html><head><style>
    @font-face{font-family:Inter;font-weight:100 900;src:url(file://${font('Inter')})}
    @font-face{font-family:Mono;src:url(file://${font('JetBrains_Mono')})}
    html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;${transparent ? '' : 'background:#070605;'}font-family:Inter}
  </style></head><body>${body}</body></html>`)
  const out = join(tmp, name + '.png')
  execFileSync(CHROME, ['--user-data-dir=' + join(tmp, 'profile'), '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--window-size=${w},${h}`, ...(transparent ? ['--default-background-color=00000000'] : []), `--screenshot=${out}`, 'file://' + file], { stdio: 'ignore', timeout: 30000 })
  return out
}
const icon = (s, bg) => `<div style="width:${s}px;height:${s}px;display:flex;align-items:center;justify-content:center;${bg ? `background:${bg}` : ''}">${mark(Math.round(s * 0.62))}</div>`

// OG: headline + four systems on one signal line (the network metaphor), no claims, no stats.
const nodes = ['Acquire', 'Sell', 'Operate', 'Build']
const og = `
<div style="position:absolute;inset:0;background:radial-gradient(900px 500px at 85% 20%,rgba(210,64,26,.14),transparent 70%)"></div>
<div style="position:absolute;left:80px;top:72px;display:flex;align-items:center;gap:18px">${mark(44)}<span style="color:#F5F3F0;font-weight:700;font-size:34px;letter-spacing:-.02em">Growlatics</span></div>
<div style="position:absolute;left:80px;top:196px;width:900px;color:#F5F3F0;font-weight:600;font-size:76px;line-height:1.04;letter-spacing:-.035em">We build and operate the systems behind growth.</div>
<div style="position:absolute;left:80px;right:80px;bottom:76px;height:40px">
  <div style="position:absolute;left:6px;right:6px;top:7px;height:2px;background:linear-gradient(90deg,#D2401A,rgba(210,64,26,.25))"></div>
  ${nodes.map((n, i) => `<div style="position:absolute;left:${(i * 100) / 3}%;transform:translateX(${i === 3 ? '-100%' : i ? '-50%' : '0'});display:flex;flex-direction:column;align-items:${i === 3 ? 'flex-end' : i ? 'center' : 'flex-start'};gap:14px">
    <div style="width:16px;height:16px;border-radius:50%;background:${i === 1 ? '#D2401A' : '#070605'};border:2px solid #D2401A;box-sizing:border-box"></div>
    <span style="font-family:Mono;font-size:18px;letter-spacing:.12em;text-transform:uppercase;color:#A8A29A">${n}</span></div>`).join('')}
</div>`

const files = {
  'og-image.png': shoot('og', 1200, 630, og),
  'logo.png': shoot('logo', 512, 512, icon(512, '#FFFFFF')),
  'icon-192.png': shoot('i192', 192, 192, icon(192, '#070605')),
  'icon-512.png': shoot('i512', 512, 512, icon(512, '#070605')),
}
for (const [name, src] of Object.entries(files)) writeFileSync(join(PUB, name), readFileSync(src))
writeFileSync(resolve('app/apple-icon.png'), readFileSync(shoot('apple', 180, 180, icon(180, '#070605'))))

// favicon.ico = one 32×32 PNG wrapped in an ICO header (PNG-in-ICO, supported by every current browser).
const png = readFileSync(shoot('fav', 32, 32, icon(32), true))
const head = Buffer.alloc(22)
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4) // reserved, type icon, 1 image
head.writeUInt8(32, 6); head.writeUInt8(32, 7); head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12) // 32×32, 1 plane, 32 bpp
head.writeUInt32LE(png.length, 14); head.writeUInt32LE(22, 18)
writeFileSync(resolve('app/favicon.ico'), Buffer.concat([head, png]))
console.log('wrote', [...Object.keys(files), 'app/apple-icon.png', 'app/favicon.ico'].join(', '))
