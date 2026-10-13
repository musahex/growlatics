'use client'

// QA lab for the network system: switch act / journey stage / tier / theme / surface / focus,
// replay the intro, see every tier-0 end state, and scroll a mock story through the fixed stage.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { SystemStage } from '../stage/SystemStage'
import { NetworkSVG } from '../render-svg/NetworkSVG'
import { SpatialLabel } from '../overlay/SpatialLabel'
import { setTierOverride, useRuntime } from '../runtime/SystemProvider'
import { useSystem } from '../runtime/useSystem'
import { setAct, setFocus, sys, type Tier } from '../runtime/store'
import { addTask, removeTask, schedulerState } from '../runtime/scheduler'
import { SYSTEMS } from '../model/graph'
import { css } from '../model/palette'

const ACT_NAMES = ['Hero', 'Problem', 'Connection', 'Journey', 'Capabilities', 'Integration', 'Global', 'Work', 'CTA']
const STAGES = ['Attract', 'Qualify', 'Close', 'Retain', 'Scale']

function Btn({ on, onClick, children }: { on?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      style={{
        padding: '6px 10px',
        borderRadius: 6,
        border: `1px solid ${on ? css.signal : css.line3}`,
        color: on ? css.signal : css.text,
        background: 'transparent',
        font: '500 12px/1.2 var(--font-mono, ui-monospace, monospace)',
        minHeight: 32,
      }}
    >
      {children}
    </button>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginBottom: 8 }}>
      <span style={{ width: 72, color: css.label, font: '500 11px var(--font-mono, monospace)', textTransform: 'uppercase' }}>{label}</span>
      {children}
    </div>
  )
}

function Stats() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    let acc = 0, n = 0
    addTask('lab-stats', (dt) => {
      acc += dt
      n++
      if (acc > 0.5 && ref.current) {
        const s = schedulerState()
        ref.current.textContent = `${Math.round(n / acc)} fps · tasks: ${s.tasks.join(', ')} · act ${sys.act.index} (${sys.act.local.toFixed(2)}) · stage ${sys.journey.stage} (${sys.journey.local.toFixed(2)})`
        acc = n = 0
      }
    }, 50)
    return () => removeTask('lab-stats')
  }, [])
  return <span ref={ref} style={{ font: '12px var(--font-mono, monospace)', color: css.label }} />
}

export default function SystemLab() {
  useRuntime()
  const tier = useSystem('tier')
  const theme = useSystem('theme')
  const focus = useSystem('focus')
  const [act, setActState] = useState(1)
  const [stage, setStage] = useState(0)
  const [override, setOverride] = useState<Tier | null>(null)
  const [surface, setSurface] = useState(false)
  const [labels, setLabels] = useState<boolean | 'all'>(true)
  const [mode, setMode] = useState<'manual' | 'scroll'>('manual')
  const [key, setKey] = useState(0)

  // URL state for headless QA: ?act=4&stage=2&tier=1&theme=light&mode=scroll&focus=sell&surface=1
  useEffect(() => {
    const q = new URLSearchParams(location.search)
    if (q.get('act')) setActState(Number(q.get('act')))
    if (q.get('stage')) setStage(Number(q.get('stage')))
    if (q.get('tier')) pickTier(Number(q.get('tier')) as Tier)
    if (q.get('theme')) setTheme(q.get('theme') === 'light' ? 'light' : 'dark')
    if (q.get('mode') === 'scroll') setMode('scroll')
    if (q.get('surface')) setSurface(true)
    if (q.get('labels') === 'all') setLabels('all')
    const f = q.get('focus')
    if (f && (SYSTEMS as readonly string[]).includes(f)) setFocus(f as (typeof SYSTEMS)[number])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    sys.manual = mode === 'manual'
    if (mode === 'manual') setAct(act, 0, stage, 0)
  }, [act, stage, mode])
  useEffect(() => () => {
    sys.manual = false
    setTierOverride(null)
    setFocus(null)
  }, [])

  const pickTier = (t: Tier | null) => {
    setOverride(t)
    setTierOverride(t)
  }
  const setTheme = (t: 'dark' | 'light') => document.documentElement.setAttribute('data-theme', t)
  const replayIntro = () => {
    try {
      sessionStorage.removeItem('gl-intro')
    } catch {}
    setActState(1)
    setKey((k) => k + 1)
  }

  const panel = { position: 'relative', zIndex: 10, padding: 16, maxWidth: 1280, margin: '0 auto' } as const

  return (
    <div style={{ paddingTop: 96, color: css.text }}>
      <div style={panel}>
        <h1 style={{ font: '600 28px/1.2 inherit', marginBottom: 12 }}>System lab</h1>
        <Row label="Mode">
          <Btn on={mode === 'manual'} onClick={() => setMode('manual')}>manual</Btn>
          <Btn on={mode === 'scroll'} onClick={() => setMode('scroll')}>scroll story (fixed stage)</Btn>
        </Row>
        {mode === 'manual' && (
          <>
            <Row label="Act">
              {ACT_NAMES.map((n, i) => (
                <Btn key={n} on={act === i + 1} onClick={() => setActState(i + 1)}>
                  {i + 1} {n}
                </Btn>
              ))}
            </Row>
            <Row label="Stage">
              {STAGES.map((n, i) => (
                <Btn key={n} on={act === 4 && stage === i} onClick={() => (setActState(4), setStage(i))}>
                  {i + 1} {n}
                </Btn>
              ))}
            </Row>
          </>
        )}
        <Row label="Tier">
          <Btn on={override === null} onClick={() => pickTier(null)}>auto</Btn>
          {([0, 1, 2] as Tier[]).map((t) => (
            <Btn key={t} on={override === t} onClick={() => pickTier(t)}>
              {t} {['svg', 'canvas2d', 'webgl'][t]}
            </Btn>
          ))}
          <span style={{ font: '12px var(--font-mono, monospace)', color: css.label }}>active tier: {tier}</span>
        </Row>
        <Row label="Theme">
          <Btn on={theme === 'dark'} onClick={() => setTheme('dark')}>dark</Btn>
          <Btn on={theme === 'light'} onClick={() => setTheme('light')}>light</Btn>
          <Btn on={surface} onClick={() => setSurface((v) => !v)}>data-surface=dark</Btn>
        </Row>
        <Row label="Focus">
          <Btn on={focus === null} onClick={() => setFocus(null)}>none</Btn>
          {SYSTEMS.map((s) => (
            <Btn key={s} on={focus === s} onClick={() => setFocus(s)}>{s}</Btn>
          ))}
        </Row>
        <Row label="Labels">
          <Btn on={labels === true} onClick={() => setLabels(true)}>flagged</Btn>
          <Btn on={labels === 'all'} onClick={() => setLabels('all')}>all</Btn>
          <Btn on={labels === false} onClick={() => setLabels(false)}>off</Btn>
          <Btn onClick={replayIntro}>replay intro</Btn>
        </Row>
        <Stats />
      </div>

      {mode === 'manual' ? (
        <>
          <div data-surface={surface ? 'dark' : undefined} style={{ ...panel, background: surface ? css.bg : undefined }}>
            <SystemStage key={`${key}-${surface}`} intro labels={labels} title="Growlatics network" style={{ aspectRatio: '16 / 10', width: '100%' }}>
              {act === 2 && <SpatialLabel edge="acquire.lead-generation~sell.inbound">Lost lead</SpatialLabel>}
            </SystemStage>
          </div>
          <div style={panel}>
            <h2 style={{ font: '600 18px inherit', margin: '24px 0 8px' }}>Phone (portrait) and tier-0 end states</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              <figure style={{ border: `1px solid ${css.line3}`, borderRadius: 10, padding: 8 }}>
                <SystemStage act={act} stage={stage} portrait labels={labels} style={{ aspectRatio: '4 / 5', width: '100%' }} />
                <figcaption style={{ font: '11px var(--font-mono, monospace)', color: css.label }}>portrait · act {act}</figcaption>
              </figure>
              {ACT_NAMES.flatMap((n, i) =>
                (i === 3 ? STAGES : [n]).map((label, s) => (
                  <figure key={`${i}-${s}`} style={{ border: `1px solid ${css.line3}`, borderRadius: 10, padding: 8 }}>
                    <NetworkSVG act={i + 1} stage={s} labels={labels} style={{ width: '100%', aspectRatio: '16 / 10' }} />
                    <figcaption style={{ font: '11px var(--font-mono, monospace)', color: css.label }}>
                      act {i + 1} · {label}
                    </figcaption>
                  </figure>
                )),
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <SystemStage mode="fixed" intro labels={labels} />
          {ACT_NAMES.map((n, i) => (
            <section
              key={n}
              data-act={i + 1}
              data-surface={i === 3 || i === 8 ? 'dark' : undefined}
              style={{ minHeight: i === 3 ? '500vh' : '100vh', position: 'relative', zIndex: 10, borderTop: `1px solid ${css.line3}` }}
            >
              <div style={{ position: 'sticky', top: 96, padding: 24, maxWidth: 420 }}>
                <p style={{ font: '12px var(--font-mono, monospace)', color: css.label }}>ACT {i + 1}</p>
                <h2 style={{ font: '600 32px/1.1 inherit' }}>{n}</h2>
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  )
}
