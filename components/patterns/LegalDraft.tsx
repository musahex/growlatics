import { draftNotice, type LegalDoc } from '@/content'
import Section from '@/components/ui/Section'

/** Draft legal page body: flagged, unlinked, noindex until the owner approves. */
export default function LegalDraft({ doc }: { doc: LegalDoc }) {
  return (
    <Section space="none" className="pb-section pt-32 sm:pt-40">
      <p role="note" className="mb-8 rounded-sm border border-signal-line bg-signal-soft px-4 py-3 text-body-s text-text">
        {draftNotice} {doc.status}
      </p>
      <h1 className="text-display-l text-text">{doc.title}</h1>
      <div className="mt-12 max-w-measure">
        {doc.sections.map((s) => (
          <section key={s.heading} className="border-t border-line py-8">
            <h2 className="text-title text-text">{s.heading}</h2>
            <p className="mt-3 text-body text-text-2">{s.body}</p>
          </section>
        ))}
      </div>
    </Section>
  )
}
