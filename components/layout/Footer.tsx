import Link from 'next/link'
import { nav, site } from '@/content'
import Logo from '@/components/brand/Logo'

const linkCls = 'inline-flex min-h-11 items-center text-body-s text-text-2 transition-colors duration-fast ease-out hover:text-text sm:min-h-0 sm:py-1.5'

function FooterLink({ href, label }: { href: string; label: string }) {
  return /^(https?:|mailto:|tel:)/.test(href) ? (
    <a href={href} className={linkCls}>
      {label}
    </a>
  ) : (
    <Link href={href} className={linkCls}>
      {label}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer data-surface="dark" data-cursor-surface="dark" className="border-t border-line bg-bg text-text">
      <div className="mx-auto max-w-container px-gutter py-section-tight">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-body text-text">{site.tagline}</p>
            <p className="mt-2 text-body-s text-text-3">{site.geography}</p>
            <ul className="mt-6 flex flex-wrap gap-x-5">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Growlatics on ${s.label}`} className={linkCls}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {nav.footer.map((col) => (
            <div key={col.heading}>
              <p className="mb-3 font-mono text-data uppercase text-text-3">{col.heading}</p>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <FooterLink {...l} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 text-body-s text-text-3 sm:flex-row sm:justify-between">
          <p>{nav.copyright(new Date().getFullYear())}</p>
          {nav.legal.length > 0 && (
            <ul className="flex gap-5">
              {nav.legal.map((l) => (
                <li key={l.href}>
                  <FooterLink {...l} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  )
}
