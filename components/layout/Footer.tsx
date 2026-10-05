import { Linkedin, Facebook, Instagram, MapPin } from 'lucide-react'
import { FOOTER_CONTENT } from '@/lib/content'

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  LinkedIn: <Linkedin size={18} />,
  Facebook: <Facebook size={18} />,
  Instagram: <Instagram size={18} />,
}

export default function Footer() {
  return (
    <footer data-cursor-surface="dark" className="bg-[#0D0C0B] border-t border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Text wordmark — avoids JPEG white-background inversion issue */}
            <a href="/" className="inline-block mb-5">
              <span className="text-[17px] font-black tracking-[-0.02em] text-white">
                Growlatics
              </span>
            </a>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs mb-6">
              {FOOTER_CONTENT.tagline}
            </p>

            {/* Branches */}
            <div className="flex flex-col gap-2">
              {FOOTER_CONTENT.branches.map((branch) => (
                <div key={branch.city} className="flex items-center gap-2 text-xs text-text-muted">
                  <MapPin size={12} className="text-brand-orange shrink-0" />
                  <span>
                    {branch.city}, {branch.country}
                  </span>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {FOOTER_CONTENT.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-text-muted hover:text-white hover:border-brand-orange/40 transition-all duration-200"
                >
                  {SOCIAL_ICONS[s.label]}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_CONTENT.links).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-sm font-semibold text-white mb-4">{group}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-text-muted hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">{FOOTER_CONTENT.copyright}</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-text-muted hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-text-muted hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
