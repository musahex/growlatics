import { contact, site } from '@/content'
import { breadcrumbJsonLd, ldJson, pageMetadata } from '@/lib/seo'
import PageHero from '@/components/patterns/PageHero'
import QualificationFlow from '@/components/patterns/QualificationFlow'
import Section from '@/components/ui/Section'

export const metadata = pageMetadata(contact.route, contact.seo)

const linkCls = 'inline-flex min-h-11 items-center text-body text-text hover:text-signal-ink'

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(breadcrumbJsonLd(contact.route)) }} />
      <PageHero hero={contact.hero} />
      <Section space="none" className="pb-section">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <QualificationFlow id="book" />
          <aside aria-labelledby="direct-h" className="lg:pt-4">
            <h2 id="direct-h" className="text-title text-text">
              {contact.direct.heading}
            </h2>
            <ul className="mt-6 border-t border-line">
              <li className="border-b border-line py-2">
                <a href={`mailto:${site.contact.email}`} className={linkCls}>
                  {site.contact.email}
                </a>
              </li>
              <li className="border-b border-line py-2">
                <a href={site.contact.phoneHref} className={linkCls}>
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex flex-wrap gap-x-6 border-b border-line py-2">
                {site.social.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-body-s text-text-2 hover:text-text">
                    {s.label}
                  </a>
                ))}
              </li>
            </ul>
            <p className="mt-6 text-body-s text-text-3">{site.geography}</p>

            <h2 className="mt-16 text-title text-text">{contact.call.heading}</h2>
            <ol className="mt-6 grid gap-6">
              {(contact.call.items ?? []).map((item, i) => (
                <li key={item.title} className="grid grid-cols-[2rem_1fr] gap-2">
                  <span className="font-mono text-data text-signal-ink">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-body-s text-text-2">
                    <strong className="font-semibold text-text">{item.title}</strong> {item.body}
                  </p>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </Section>
    </>
  )
}
