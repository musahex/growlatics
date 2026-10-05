// The nine home acts (DIRECTION §7, IA §5.1). Every act is a data-act section over the fixed stage.
// Sections are not positioned (their backgrounds paint under the fixed canvas); their content is,
// so it paints above it. Copy comes from '@/content' only.
import Link from 'next/link'
import { engagement, getLabel, home, homeUi, journey, schematicLabels, site, systemById, systems, type SystemId } from '@/content'
import { EDGES } from '@/components/system/model/graph'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import SectionHeader from '@/components/ui/SectionHeader'
import Ledger from '@/components/patterns/Ledger'
import SignalRail from '@/components/patterns/SignalRail'
import Inspector from '@/components/patterns/Inspector'
import { CaseStudyList, LogoRow, MetricSlot, TestimonialSlot } from '@/components/patterns/Proof'
import { ActFigure, FocusInAct, SystemIndex } from './stage'
import TraceLanes from './TraceLanes'

const wrap = 'relative mx-auto w-full max-w-container px-gutter'
// Text keeps the left of the viewport; the network owns the right (text-safe zone, §7 act 1).
const col = 'lg:max-w-[58%]'
// Acts with a figure: below lg the figure sits in flow after the heading (it explains what you see, #8);
// on lg the wrapper is static so the figure's absolute desktop SVG spans the whole act.
const actWrap = 'py-section lg:static lg:min-h-screen'

function Act({ n, id, dark, className, children }: { n: number; id: string; dark?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      data-act={n}
      aria-labelledby={`${id}-h`}
      {...(dark && { 'data-surface': 'dark', 'data-cursor-surface': 'dark' })}
      className={cn('border-t border-line text-text', dark && 'bg-bg', className)}
    >
      <div className="relative">{children}</div>
    </section>
  )
}

function MoreLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="mt-10 inline-flex min-h-11 items-center text-body-s font-semibold text-signal-ink hover:text-text">
      {label} →
    </Link>
  )
}

// ── 1 Hero ──
export function Hero() {
  const h = home.hero
  return (
    <section id="hero" data-act={1} aria-labelledby="hero-h" className="text-text">
      <div className="relative lg:flex lg:min-h-screen lg:flex-col">
        {/* lg:static so the lg figure (absolute) spans the whole hero; text stays positioned above the canvas. */}
        <div className={cn(wrap, 'flex flex-1 flex-col pb-section-tight pt-32 lg:static lg:pb-12 lg:pt-28')}>
          {/* Static in SSR: the H1 is the LCP element and never waits for JS. */}
          <div className={cn(col, 'relative')}>
            <p className="mb-5 text-label uppercase text-signal-ink">{h.eyebrow}</p>
            {/* lg: at most 3 lines, so the System index stays above a 900px fold (DIRECTION §7 act 1). */}
            <h1 id="hero-h" className="max-w-headline text-display-xl text-text lg:max-w-none lg:text-[clamp(3.25rem,1.2rem+3.4vw,4.25rem)]">
              {h.heading}
            </h1>
            <p className="mt-6 max-w-measure text-body-l text-text-2">{h.lead}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              {h.primary && (
                <Button href={h.primary.href} size="lg" arrow>
                  {h.primary.label}
                </Button>
              )}
              {h.secondary && (
                <Button href={h.secondary.href} variant="secondary" size="lg">
                  {h.secondary.label}
                </Button>
              )}
            </div>
          </div>
          <ActFigure act={1} title={homeUi.figures.hero} className="mt-12" />
          <div className="relative mt-12 lg:mt-auto lg:max-w-[74%] lg:pt-10">
            <SystemIndex />
          </div>
        </div>
      </div>
    </section>
  )
}

// ── 2 Problem ──
export function Problem() {
  const c = home.problem
  return (
    <Act n={2} id={c.id!}>
      <div className={cn(wrap, actWrap)}>
        <div className={cn(col, 'relative')}>
          <SectionHeader id={`${c.id}-h`} eyebrow={c.eyebrow} heading={c.heading} body={c.body} />
        </div>
        <ActFigure act={2} title={homeUi.figures.problem} className="mt-8" leaks={c.leaks.length} />
        <div className={cn(col, 'relative')}>
          <Ledger className="mt-12" rows={c.leaks.map((l) => ({ term: l.title, description: l.body }))} />
        </div>
      </div>
    </Act>
  )
}

// ── 3 Connection ──
export function Connection() {
  const c = home.connection
  return (
    <Act n={3} id={c.id!}>
      <div className={cn(wrap, actWrap)}>
        <div className={cn(col, 'relative')}>
          <SectionHeader id={`${c.id}-h`} eyebrow={c.eyebrow} heading={c.heading} body={c.body} />
        </div>
        <ActFigure act={3} title={homeUi.figures.connection} className="mt-8" />
        <div className={cn(col, 'relative')}>
          <Ledger className="mt-12" rows={(c.items ?? []).map((i) => ({ term: i.title, description: i.body }))} />
        </div>
      </div>
    </Act>
  )
}

// ── 4 Journey: five stages in normal flow; on lg the fixed stage travels behind them ──
export function Journey() {
  const j = journey
  const total = j.stages.length
  return (
    <Act n={4} id="journey" dark>
      <div className={cn(wrap, 'pb-12 pt-section')}>
        <SectionHeader id="journey-h" eyebrow={j.eyebrow} heading={j.heading} body={j.intro} />
      </div>
      <ol>
        {j.stages.map((s, i) => {
          const owners = s.systems.map((id) => systemById[id])
          const tags = owners[owners.length - 1].tags
          return (
            <li key={s.id} data-journey-stage={i} className="relative lg:flex lg:min-h-screen lg:items-center">
              <div className={cn(wrap, 'py-10 lg:static lg:py-24')}>
                <div className="relative border-l border-line-2 pl-8 lg:max-w-[42%] lg:border-l-0 lg:pl-0">
                  <span aria-hidden className="absolute -left-1.5 top-1 size-3 rounded-full bg-signal lg:hidden" />
                  <div className="lg:glass lg:rounded-lg lg:p-8">
                    <p className="font-mono text-data text-signal-ink">{homeUi.stageIndex(s.number, total)}</p>
                    <h3 className="mt-3 text-label uppercase text-text-3">{s.name}</h3>
                    <p className="mt-2 text-display-m text-text">{s.line}</p>
                    <p className="mt-4 max-w-measure text-body text-text-2">{s.copy}</p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {owners.map((o) => (
                        <li key={o.id} className="rounded-sm bg-signal-soft px-2 py-1 font-mono text-data text-text">
                          {o.verb}
                        </li>
                      ))}
                      {tags.map((t) => (
                        <li key={t} className="rounded-sm border border-line px-2 py-1 font-mono text-data-s text-text-3">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <ActFigure act={4} stage={i} title={homeUi.figures.journey(s.name)} className="mt-8" />
              </div>
            </li>
          )
        })}
      </ol>
      <div className={cn(wrap, 'pb-section')}>
        <MoreLink href={j.closing.href} label={j.closing.label} />
      </div>
    </Act>
  )
}

// Handoffs between systems, read from the graph: who hands work to whom.
const sysOf = (id: string) => id.split('.')[0] as SystemId
const handoffs = EDGES.filter((e) => e.kind === 'handoff').map((e) => [sysOf(e.a), sysOf(e.b)] as const)
const from = (s: SystemId) => Array.from(new Set(handoffs.filter(([, b]) => b === s).map(([a]) => getLabel(a))))
const to = (s: SystemId) => Array.from(new Set(handoffs.filter(([a]) => a === s).map(([, b]) => getLabel(b))))

// ── 5 Capabilities: system inspector, Sell default-open ──
export function Capabilities() {
  const c = home.capabilities
  return (
    <Act n={5} id={c.id!}>
      <div className={cn(wrap, actWrap)}>
        <div className={cn(col, 'relative')}>
          <SectionHeader id={`${c.id}-h`} eyebrow={c.eyebrow} heading={c.heading} body={c.body} />
        </div>
        <ActFigure act={5} title={homeUi.figures.capabilities} className="mt-8" />
        <div className={cn(col, 'relative')}>
          <div className="mt-12">
            <Inspector
              label={c.heading}
              defaultId="sell"
              items={systems.map((s, i) => ({
                id: s.id,
                meta: String(i + 1).padStart(2, '0'),
                label: s.verb,
                content: (
                  <div>
                    <FocusInAct system={s.id} act={5} />
                    <h3 className="text-title text-text">
                      {s.verb} — {s.service}
                    </h3>
                    <p className="mt-4 max-w-measure text-body text-text-2">{s.short}</p>
                    {s.positioning && <p className="mt-4 text-body font-semibold text-text">{s.positioning}</p>}
                    <dl className="mt-6 border-b border-line">
                      {(
                        [
                          [schematicLabels.inputs, from(s.id), false],
                          [schematicLabels.capabilities, s.tags, true],
                          [schematicLabels.outputs, to(s.id), false],
                        ] as const
                      )
                        .filter(([, list]) => list.length > 0)
                        .map(([term, list, lit]) => (
                          <div key={term} className="grid gap-2 border-t border-line py-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
                            <dt className="font-mono text-data uppercase text-text-3">{term}</dt>
                            <dd className="flex flex-wrap gap-2">
                              {list.map((t) => (
                                <span key={t} className={cn('rounded-sm px-2 py-0.5 font-mono text-data', lit ? 'bg-signal-soft text-text' : 'border border-line text-text-2')}>
                                  {t}
                                </span>
                              ))}
                            </dd>
                          </div>
                        ))}
                    </dl>
                    <MoreLink href={s.href} label={s.exploreLabel} />
                  </div>
                ),
              }))}
            />
          </div>
        </div>
      </div>
    </Act>
  )
}

// ── 6 Why integration ──
export function Why() {
  const c = home.why
  const list = (heading: string, items: string[], lit: boolean) => (
    <div>
      <h3 className={cn('text-body-l font-semibold', lit ? 'text-text' : 'text-text-2')}>{heading}</h3>
      <ul className="mt-4 border-b border-line">
        {items.map((t) => (
          <li key={t} className="flex gap-3 border-t border-line py-3 text-body-s text-text-2">
            <span aria-hidden className={cn('mt-2 size-1.5 shrink-0 rounded-full', lit ? 'bg-signal' : 'bg-text-4')} />
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
  return (
    <Act n={6} id={c.id!}>
      <div className={cn(wrap, 'py-section lg:min-h-screen')}>
        <div className={col}>
          <SectionHeader id={`${c.id}-h`} eyebrow={c.eyebrow} heading={c.heading} body={c.body} />
          <div className="mt-12">
            <TraceLanes />
          </div>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {list(homeUi.lanes.separate, c.separate, false)}
            {list(homeUi.lanes.connected, c.connected, true)}
          </div>
          <p className="mt-8 font-mono text-data text-text-3">{c.note}</p>
        </div>
      </div>
    </Act>
  )
}

// ── 7 Global delivery: a 24-hour band, markets at their UTC offsets; no map, no pins ──
export function Global() {
  const c = home.global
  return (
    <Act n={7} id={c.id!}>
      <div className={cn(wrap, actWrap, 'lg:pt-24')}>
        <div className="relative">
          <SectionHeader id={`${c.id}-h`} eyebrow={c.eyebrow} heading={c.heading} />
        </div>
        <ActFigure act={7} title={homeUi.figures.global} className="mt-8" />
        {/* lg: the 24-hour band runs through the gap between heading and body. */}
        <div className={cn(col, 'relative mt-6 lg:mt-[30vh]')}>
          <p className="max-w-measure text-body-l text-text-2">{c.body}</p>
          <p className="mt-6 font-mono text-data uppercase text-text-3">{site.markets.map((m) => m.label).join(' · ')}</p>
          {c.links?.map((l) => <MoreLink key={l.href} href={l.href} label={l.label} />)}
        </div>
      </div>
    </Act>
  )
}

// ── 8 Work: how an engagement runs (four phases) + proof slots that render nothing while empty ──
export function Work() {
  const c = home.work
  return (
    <Act n={8} id={c.id!}>
      <div className={cn(wrap, 'py-section')}>
        <SectionHeader id={`${c.id}-h`} eyebrow={c.eyebrow} heading={c.heading} body={c.body} />
        <SignalRail className="mt-16" items={engagement.steps.map((s) => ({ index: `0${s.number}`, title: s.title, body: s.body }))} />
        <div className="mt-16 grid gap-16 empty:hidden">
          <MetricSlot />
          <CaseStudyList />
          <TestimonialSlot />
          <LogoRow />
        </div>
        {c.links?.map((l) => <MoreLink key={l.href} href={l.href} label={l.label} />)}
      </div>
    </Act>
  )
}

// ── 9 Convergence CTA: every path meets the core, which resolves into the mark ──
export function Convergence() {
  const c = site.finalCta
  return (
    <Act n={9} id="book-cta" dark>
      <ActFigure act={9} title={homeUi.figures.convergence} className="mx-auto max-w-md" />
      <div className={cn(wrap, 'flex flex-col items-center pb-section pt-12 text-center lg:min-h-screen lg:pt-[60vh]')}>
        <h2 id="book-cta-h" className="max-w-3xl text-display-l text-text">
          {c.heading}
        </h2>
        <p className="mt-6 max-w-measure text-body-l text-text-2">{c.body}</p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button href={c.primary.href} size="lg" arrow>
            {c.primary.label}
          </Button>
          <Button href={c.secondary.href} variant="secondary" size="lg">
            {c.secondary.label}
          </Button>
        </div>
        <p className="mt-6 text-body-s text-text-3">{c.note}</p>
      </div>
    </Act>
  )
}
