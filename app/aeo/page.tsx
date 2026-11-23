import Image from 'next/image'
import { aeo as a } from '@/content'
import { ldJson, pageJsonLd, pageMetadata, serviceJsonLd } from '@/lib/seo'
import { cn } from '@/lib/utils'
import PageHero from '@/components/patterns/PageHero'
import HandoffStrip from '@/components/patterns/HandoffStrip'
import SignalRail from '@/components/patterns/SignalRail'
import Ledger from '@/components/patterns/Ledger'
import Statement from '@/components/patterns/Statement'
import { flat } from '@/components/patterns/glass'
import { glassClass } from '@/components/ui/Glass'
import Mark from '@/components/brand/Mark'
import Button from '@/components/ui/Button'
import Section from '@/components/ui/Section'
import SectionHeader from '@/components/ui/SectionHeader'
import Reveal from '@/components/ui/Reveal'
import AnswerPanel from '@/components/aeo/AnswerPanel'
import WhatsAppMessage from '@/components/aeo/WhatsAppMessage'
import WhatsAppFab from '@/components/aeo/WhatsAppFab'

export const metadata = pageMetadata(a.route, a.seo)

const chip = 'rounded-sm border border-line px-2 py-1 font-mono text-data text-text-2'
const dot = (lit: boolean) => cn('size-3 shrink-0 rounded-full border', lit ? 'border-signal bg-signal' : 'border-line-3 bg-bg')

/** Heading beside its content from lg. */
function Split({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return <div className={cn('grid gap-10 lg:gap-16', wide ? 'lg:grid-cols-2' : 'lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]')}>{children}</div>
}

export default function AeoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(serviceJsonLd(a.name, a.route, a.hero.lead)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(pageJsonLd(a.route, a.seo)) }} />

      {/* 1 · Hero. The AI answer sits beside the text from lg (where the network figure goes on other pages) and under it below. */}
      <PageHero
        hero={a.hero}
        stage={
          <div className="pointer-events-auto absolute right-0 top-1/2 w-[44%] -translate-y-1/2">
            <AnswerPanel />
          </div>
        }
      >
        <AnswerPanel className="lg:hidden" />
      </PageHero>

      {/* 2 · The shift: three figures, then before / now. */}
      <Section id="shift" rule aria-labelledby="shift-h">
        <SectionHeader id="shift-h" eyebrow={a.shift.eyebrow} heading={a.shift.heading} />
        <Reveal as="ul" group className="mt-12 grid gap-x-8 md:grid-cols-3">
          {a.shift.stats.map((s) => (
            <Reveal as="li" item key={s.value} className="border-t border-line py-6">
              <p className="text-display-l text-signal-ink">{s.value}</p>
              <p className="mt-3 max-w-measure text-body-s text-text-2">{s.body}</p>
            </Reveal>
          ))}
        </Reveal>
        <p className="mt-4 text-body-s text-text-3">
          {a.shift.sourceNote}{' '}
          {a.shift.sources.map((s, i) => (
            <span key={s.href}>
              {i > 0 && ' · '}
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline decoration-line-3 underline-offset-4 hover:text-text">
                {s.label}
              </a>
            </span>
          ))}
        </p>

        <Reveal as="ol" group className="mt-16 border-b border-line">
          <li aria-hidden className="hidden grid-cols-2 gap-8 border-t border-line py-3 md:grid">
            <p className="font-mono text-data uppercase text-text-3">{a.shift.before}</p>
            <p className="font-mono text-data uppercase text-signal-ink">{a.shift.now}</p>
          </li>
          {a.shift.rows.map((r) => (
            <Reveal as="li" item key={r.now} className="grid gap-3 border-t border-line py-5 md:grid-cols-2 md:gap-8">
              <p className="flex items-start gap-3 text-body text-text-3 line-through decoration-line-3">
                <span aria-hidden className={cn(dot(false), 'mt-1.5')} />
                <span>
                  <span className="mr-2 font-mono text-data-s uppercase no-underline md:hidden">{a.shift.before}</span>
                  {r.before}
                </span>
              </p>
              <p className="flex items-start gap-3 text-body font-semibold text-text">
                <span aria-hidden className={cn(dot(true), 'mt-1.5')} />
                <span>
                  <span className="mr-2 font-mono text-data-s uppercase text-signal-ink md:hidden">{a.shift.now}</span>
                  {r.now}
                </span>
              </p>
            </Reveal>
          ))}
        </Reveal>
      </Section>

      {/* 3 · Live check: the audit as a readout. */}
      <Section id="live-check" tone="surface" aria-labelledby="live-h">
        <SectionHeader id="live-h" eyebrow={a.liveCheck.eyebrow} heading={a.liveCheck.heading} />
        <Reveal as="ul" group className="mt-12 grid gap-x-8 md:grid-cols-3">
          {a.liveCheck.cards.map((c, i) => (
            <Reveal as="li" item key={c.label} className="border-t border-line py-6">
              <p className="font-mono text-data uppercase text-text-3">{c.label}</p>
              <p className={cn('mt-3 text-title', i === 1 ? 'text-signal-ink' : i === 2 ? 'text-text-3' : 'text-text')}>{c.value}</p>
              <p className="mt-2 max-w-measure text-body-s text-text-2">{c.sub}</p>
            </Reveal>
          ))}
        </Reveal>
        <div className="mt-12">
          <Statement text={a.liveCheck.line} />
        </div>
      </Section>

      {/* 4 · How AI decides: six things, a scorecard. */}
      <Section id="checks" rule aria-labelledby="checks-h">
        <Split>
          <SectionHeader id="checks-h" eyebrow={a.checks.eyebrow} heading={a.checks.heading} body={a.checks.intro} />
          <Reveal as="ol" group className="border-b border-line lg:mt-14">
            {a.checks.items.map((c, i) => (
              <Reveal as="li" item key={c.title} className="grid grid-cols-[2rem_1fr] gap-x-3 border-t border-line py-5">
                <span className="pt-1 font-mono text-data text-text-3">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-body-l font-semibold text-text">{c.title}</h3>
                  <p className="mt-1 max-w-measure text-body-s text-text-2">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </Reveal>
        </Split>
        <div className="mt-16">
          <Statement text={a.checks.line} />
        </div>
      </Section>

      {/* 5 · Be everywhere AI looks: the handoff strip as a hub. */}
      <Section id="everywhere" rule aria-labelledby="every-h">
        <SectionHeader id="every-h" eyebrow={a.everywhere.eyebrow} heading={a.everywhere.heading} body={a.everywhere.line} />
        <div className="mt-12">
          <HandoffStrip glass upstream={a.everywhere.upstream} current={a.everywhere.current} downstream={a.everywhere.downstream} />
        </div>
      </Section>

      {/* 6 · What we do: three tracks on one rail. */}
      <Section id="system" tone="surface" aria-labelledby="system-h">
        <SectionHeader id="system-h" eyebrow={a.system.eyebrow} heading={a.system.heading} />
        <SignalRail className="mt-16" items={a.system.columns.map((c) => ({ index: c.when, title: c.title, body: c.body, tags: c.tags }))} />
        <p className="mt-12 max-w-measure text-body-l text-text-2">{a.system.line}</p>
      </Section>

      {/* 7 · How it works: four steps with their timing. */}
      <Section id="how" rule aria-labelledby="how-h">
        <SectionHeader id="how-h" eyebrow={a.how.eyebrow} heading={a.how.heading} />
        <SignalRail className="mt-16" items={a.how.steps.map((s, i) => ({ index: String(i + 1).padStart(2, '0'), title: s.title, body: s.body, note: s.when }))} />
        <div className="mt-16">
          <Statement text={a.how.timeline} />
          <p className="mt-6 max-w-measure text-body-l text-text-2">{a.how.faster}</p>
        </div>
      </Section>

      {/* 8 · How we measure, and what you get. */}
      <Section id="measure" tone="surface" aria-labelledby="measure-h">
        <SectionHeader id="measure-h" eyebrow={a.measure.eyebrow} heading={a.measure.heading} />
        <Reveal group className="mt-12 grid gap-8 md:grid-cols-2">
          {[a.measure.agencies, a.measure.us].map((col, k) => {
            const us = k === 1
            return (
              <Reveal item key={col.label} className={cn(us ? glassClass('base', { signal: true }, cn('p-6', flat)) : 'rounded-liquid border border-line p-6')}>
                <p className={cn('font-mono text-data uppercase', us ? 'text-signal-ink' : 'text-text-3')}>{col.label}</p>
                <ul className="mt-4 grid gap-2">
                  {col.items.map((it) => (
                    <li key={it} className={cn('flex items-center gap-3 text-body', us ? 'text-text' : 'text-text-3')}>
                      <span aria-hidden className={dot(us)} />
                      {it}
                    </li>
                  ))}
                </ul>
                <p className={cn('mt-5 text-body-s', us ? 'font-semibold text-text' : 'text-text-3')}>{col.line}</p>
              </Reveal>
            )
          })}
        </Reveal>

        <h3 className="mt-16 text-title text-text">{a.get.heading}</h3>
        <Reveal as="ul" group className="mt-6 border-b border-line">
          {a.get.items.map((g) => (
            <Reveal as="li" item key={g} className="flex items-start gap-4 border-t border-line py-4 text-body text-text">
              <span aria-hidden className={cn(dot(true), 'mt-1.5')} />
              {g}
            </Reveal>
          ))}
        </Reveal>
      </Section>

      {/* 9 · Proof. */}
      <Section id="proof" rule aria-labelledby="proof-h">
        <Split wide>
          <div>
            <SectionHeader id="proof-h" eyebrow={a.proof.eyebrow} heading={a.proof.heading} body={a.proof.body} />
            <p className="mt-6 max-w-measure text-body text-text">
              <strong className="font-semibold">{a.proof.reference.split('.')[0]}.</strong> {a.proof.reference.split('. ').slice(1).join('. ')}
            </p>
          </div>
          <Reveal>
            <figure className={glassClass('base', {}, cn('overflow-hidden p-2', flat))}>
              <Image src={a.proof.image.src} alt={a.proof.image.alt} width={a.proof.image.width} height={a.proof.image.height} unoptimized className="h-auto w-full rounded-liquid-inner" />
            </figure>
          </Reveal>
        </Split>
      </Section>

      {/* 10 · Your part. */}
      <Section id="your-part" rule aria-labelledby="part-h">
        <SectionHeader id="part-h" eyebrow={a.yourPart.eyebrow} heading={a.yourPart.heading} />
        <Reveal as="ul" group className="mt-12 grid gap-x-8 md:grid-cols-3">
          {a.yourPart.items.map((it, i) => (
            <Reveal as="li" item key={it.title} className="border-t border-line py-6">
              <p className="font-mono text-data text-text-3">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 text-title text-text">{it.title}</h3>
              <p className="mt-3 max-w-measure text-body-s text-text-2">{it.body}</p>
            </Reveal>
          ))}
        </Reveal>
        <p className="mt-8 max-w-measure text-body text-text-2">
          <strong className="font-semibold text-text">{a.yourPart.line.split(',')[0]},</strong>
          {a.yourPart.line.split(',').slice(1).join(',')}
        </p>
      </Section>

      {/* 11 · Investment. */}
      <Section id="investment" tone="dark" rule aria-labelledby="invest-h">
        <Split wide>
          <Reveal group>
            <Reveal item as="p" className="mb-4 text-label uppercase text-signal-ink">
              {a.investment.eyebrow}
            </Reveal>
            <Reveal item>
              <h2 id="invest-h" className="text-display-xl text-text">
                {a.investment.range}
              </h2>
            </Reveal>
            <Reveal item as="p" className="mt-4 max-w-measure text-body-l text-text-2">
              {a.investment.body}
            </Reveal>
            <Reveal item as="p" className="mt-6 text-display-m text-text">
              {a.investment.line}
            </Reveal>
          </Reveal>
          <Reveal as="ul" group className="border-b border-line lg:mt-2">
            {a.investment.items.map((it) => (
              <Reveal as="li" item key={it.title} className="flex items-start gap-4 border-t border-line py-4 text-body">
                <span aria-hidden className={cn(dot(true), 'mt-1.5')} />
                <span>
                  <strong className="font-semibold text-text">{it.title}</strong>
                  {it.body && <span className="text-text-2"> {it.body}</span>}
                </span>
              </Reveal>
            ))}
          </Reveal>
        </Split>
      </Section>

      {/* 12 · FAQ. */}
      <Section id="faq" rule space="tight" aria-labelledby="faq-h">
        <Split>
          <SectionHeader id="faq-h" heading={a.faq.heading} />
          <Ledger rows={a.faq.items.map((q) => ({ term: q.question, description: q.answer }))} />
        </Split>
      </Section>

      {/* 13 · Final call: WhatsApp first, the site's number for calls. */}
      <Section id="audit" tone="dark" rule aria-labelledby="audit-h">
        <Reveal group className="flex flex-col items-center text-center">
          <Mark size={88} state="converge" />
          <Reveal item as="p" className="mt-10 text-label uppercase text-signal-ink">
            {a.finalCta.eyebrow}
          </Reveal>
          <Reveal item>
            <h2 id="audit-h" className="mt-4 max-w-3xl text-display-l text-text">
              {a.finalCta.heading}
            </h2>
          </Reveal>
          <Reveal item as="p" className="mt-6 max-w-measure text-body-l text-text-2">
            {a.finalCta.body}
          </Reveal>
          <Reveal item className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button href={a.finalCta.primary.href} size="lg" arrow>
              {a.finalCta.primary.label}
            </Button>
            <Button href={a.finalCta.secondary.href} variant="secondary" size="lg">
              {a.finalCta.secondary.label}
            </Button>
          </Reveal>
          <Reveal item as="p" className="mt-6 text-body-s text-text-3">
            {a.finalCta.note}
          </Reveal>
          <Reveal item className="mt-12 flex w-full justify-center">
            <WhatsAppMessage />
          </Reveal>
        </Reveal>
      </Section>

      <WhatsAppFab />
    </>
  )
}
