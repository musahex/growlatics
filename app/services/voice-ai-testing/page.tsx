import { voiceAiTesting as v } from '@/content'
import { ldJson, pageJsonLd, pageMetadata, serviceJsonLd } from '@/lib/seo'
import { cn } from '@/lib/utils'
import PageHero from '@/components/patterns/PageHero'
import PageStage from '@/components/pages/PageStage'
import HandoffStrip from '@/components/patterns/HandoffStrip'
import Inspector from '@/components/patterns/Inspector'
import { flatBelowLg } from '@/components/patterns/glass'
import TestConsole from '@/components/patterns/TestConsole'
import SignalRail from '@/components/patterns/SignalRail'
import ConvergenceCTA from '@/components/patterns/ConvergenceCTA'
import Section from '@/components/ui/Section'
import SectionHeader from '@/components/ui/SectionHeader'
import Reveal from '@/components/ui/Reveal'

export const metadata = pageMetadata(v.route, v.seo)

const chip = 'rounded-sm border border-line px-2 py-1 font-mono text-data text-text-2'

/** Heading beside its content from lg (same split the service pages use for short reference sections). */
function Split({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">{children}</div>
}

/** Hairline grid of short items: mono index or label, title, body. No boxes. */
function Grid({ items, cols = 3, titleAs: Title = 'h3' }: { items: { index?: string; title: string; body: string }[]; cols?: 2 | 3 | 4; titleAs?: 'h3' | 'p' }) {
  return (
    <Reveal as="ul" group className={cn('grid gap-x-8', cols === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : cols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2')}>
      {items.map((it, i) => (
        <Reveal as="li" item key={it.title} className="border-t border-line py-6">
          <p className="font-mono text-data uppercase text-text-3">{it.index ?? String(i + 1).padStart(2, '0')}</p>
          <Title className="mt-3 text-title text-text">{it.title}</Title>
          <p className="mt-3 max-w-measure text-body-s text-text-2">{it.body}</p>
        </Reveal>
      ))}
    </Reveal>
  )
}

export default function VoiceAiTestingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(serviceJsonLd(v.name, v.route, v.hero.lead)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(pageJsonLd(v.route, v.seo)) }} />

      <PageHero hero={v.hero} stage={<PageStage act={5} title={v.stageTitle} />}>
        {/* P6: what we test → the test environment → what comes out, live edges (DIRECTION §8.2). */}
        <HandoffStrip glass upstream={v.handoff.upstream} current={v.handoff.current} downstream={v.handoff.downstream} />
        <TestConsole className="mt-6" />
      </PageHero>

      {/* Capability strip: four short facts under the hero, the same hairline dl the service overviews use. */}
      <Section rule space="tight" aria-label="Capabilities">
        <dl className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {v.strip.map((s) => (
            <div key={s.title} className="border-t border-line py-5">
              <dt className="text-body font-semibold text-text">{s.title}</dt>
              <dd className="mt-1 text-body-s text-text-2">{s.body}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="risk" rule aria-labelledby="risk-h">
        <Split>
          <div>
            <SectionHeader id="risk-h" eyebrow={v.problem.eyebrow} heading={v.problem.heading} body={v.problem.body} />
            <p className="mt-4 max-w-measure text-body-l text-text-2">{v.problem.body2}</p>
          </div>
          <Reveal as="ul" group className="border-b border-line lg:mt-14">
            {v.problem.risks.map((r) => (
              <Reveal as="li" item key={r} className="flex items-center gap-4 border-t border-line py-4 text-body text-text">
                <span aria-hidden className="size-3 shrink-0 rounded-full border border-signal bg-signal" />
                {r}
              </Reveal>
            ))}
          </Reveal>
        </Split>
      </Section>

      <Section id="scale" tone="surface" aria-labelledby="scale-h">
        <SectionHeader id="scale-h" eyebrow={v.scale.eyebrow} heading={v.scale.heading} body={v.scale.body} />
        <SignalRail className="mt-16" items={v.scale.levels.map((l) => ({ index: l.level, title: l.title, body: l.body }))} />
      </Section>

      <Section id={v.services.id} rule aria-labelledby="services-h">
        <SectionHeader id="services-h" eyebrow={v.services.eyebrow} heading={v.services.heading} body={v.services.body} />
        <div className="mt-12">
          <Inspector
            label={v.services.heading}
            panelClassName={cn('md:glass md:rounded-liquid md:p-8', flatBelowLg)}
            items={v.services.items.map((s, i) => ({
              id: `s${i + 1}`,
              meta: String(i + 1).padStart(2, '0'),
              label: s.title,
              content: (
                <div>
                  <h3 className="text-title text-text">{s.title}</h3>
                  <p className="mt-4 max-w-measure text-body text-text-2">{s.body}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <li key={t} className={chip}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            }))}
          />
        </div>
      </Section>

      <Section id="deployment" rule aria-labelledby="deploy-h">
        <Split>
          <div>
            <SectionHeader id="deploy-h" eyebrow={v.deployment.eyebrow} heading={v.deployment.heading} body={v.deployment.body} />
            <p className="mt-4 max-w-measure text-body-l text-text-2">{v.deployment.body2}</p>
          </div>
          {/* The call path, top to bottom: a vertical signal rail with the review step lit. */}
          <Reveal as="ol" group className="relative grid gap-8 lg:mt-14">
            <span aria-hidden className="absolute bottom-2 left-1.5 top-2 w-px bg-net-edge-hot">
              <span className="absolute inset-0 motion-safe:animate-travel-y">
                <span className="absolute -left-[2.5px] top-0 size-1.5 rounded-full bg-net-packet motion-reduce:top-1/2" />
              </span>
            </span>
            {v.deployment.flow.map((n, i, all) => {
              const last = i === all.length - 1
              return (
                <Reveal as="li" item key={n.label} className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pl-10">
                  <span aria-hidden className={cn('absolute left-0 top-1.5 size-3 rounded-full border', last ? 'border-signal bg-signal' : 'border-line-3 bg-bg')} />
                  <span className={cn('text-body font-semibold', last ? 'text-text' : 'text-text')}>{n.label}</span>
                  <span className={cn('font-mono text-data uppercase', last ? 'text-signal-ink' : 'text-text-3')}>{n.tag}</span>
                </Reveal>
              )
            })}
          </Reveal>
        </Split>
      </Section>

      <Section id="datasets" tone="surface" aria-labelledby="data-h">
        <Split>
          <div>
            <SectionHeader id="data-h" eyebrow={v.datasets.eyebrow} heading={v.datasets.heading} body={v.datasets.body} />
            <p className="mt-4 max-w-measure text-body-l text-text-2">{v.datasets.body2}</p>
          </div>
          <Reveal as="ul" group className="flex flex-wrap content-start gap-2 self-start lg:mt-14">
            {v.datasets.tags.map((t) => (
              <Reveal as="li" item key={t} className={chip}>
                {t}
              </Reveal>
            ))}
          </Reveal>
        </Split>
      </Section>

      <Section id="qa" rule aria-labelledby="qa-h">
        <SectionHeader id="qa-h" eyebrow={v.qa.eyebrow} heading={v.qa.heading} body={v.qa.body} />
        <SignalRail className="mt-16" items={v.qa.items} />
      </Section>

      <Section id="method" rule aria-labelledby="method-h">
        <SectionHeader id="method-h" eyebrow={v.method.eyebrow} heading={v.method.heading} />
        <div className="mt-12">
          <Grid cols={4} items={v.method.steps} />
        </div>
      </Section>

      <Section id="outputs" tone="surface" aria-labelledby="outputs-h">
        <SectionHeader id="outputs-h" eyebrow={v.outputs.eyebrow} heading={v.outputs.heading} body={v.outputs.body} />
        <div className="mt-12">
          <Grid cols={3} items={v.outputs.items} />
        </div>
      </Section>

      <Section id="industries" rule aria-labelledby="ind-h">
        <SectionHeader id="ind-h" eyebrow={v.industries.eyebrow} heading={v.industries.heading} body={v.industries.body} />
        <Reveal as="ul" group className="mt-12 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {v.industries.items.map((name, i) => (
            <Reveal as="li" item key={name} className="flex items-center gap-4 border-t border-line py-4">
              <span className="w-6 font-mono text-data text-text-3">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-body font-semibold text-text">{name}</span>
            </Reveal>
          ))}
        </Reveal>
      </Section>

      <Section id="why" tone="dark" rule aria-labelledby="why-h">
        <SectionHeader id="why-h" eyebrow={v.why.eyebrow} heading={v.why.heading} body={v.why.body} />
        <div className="mt-12">
          <Grid cols={3} items={v.why.items} />
        </div>
      </Section>

      <ConvergenceCTA heading={v.finalCta.heading} body={v.finalCta.body} primary={v.finalCta.primary} secondary={v.finalCta.secondary} note={null} />
    </>
  )
}
