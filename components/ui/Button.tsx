import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'text'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold select-none transition-[color,background-color,border-color,box-shadow] duration-fast ease-out disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  // Solid signal with a glass edge: inner top highlight over the signal shadow; the glow deepens on hover.
  primary:
    'bg-signal text-on-signal shadow-[inset_0_1px_0_rgb(255_255_255/0.22),var(--sh-signal)] hover:bg-signal-deep hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_0_0_1px_rgb(210_64_26/0.5),0_10px_32px_-8px_rgb(210_64_26/0.6)] active:bg-signal-deep',
  secondary: 'border border-line-2 bg-transparent text-text hover:border-line-3 hover:bg-signal-soft',
  text: 'px-0 text-signal-ink hover:text-text',
}

const sizes: Record<Size, string> = {
  md: 'min-h-11 px-5 text-body-s',
  lg: 'min-h-12 px-6 text-body',
}

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], variant !== 'text' && sizes[size], variant === 'text' && 'min-h-11 text-body-s', className)
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
  /** Show a trailing arrow (functional affordance). */
  arrow?: boolean
}

type LinkButtonProps = CommonProps & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'>
type NativeButtonProps = CommonProps & { href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>

/** Link when `href` is set (internal → next/link), otherwise a <button>. */
export default function Button(props: LinkButtonProps | NativeButtonProps) {
  const { variant = 'primary', size = 'md', className, children, arrow, ...rest } = props
  const cls = buttonClass(variant, size, className)
  const cursor = variant === 'primary' ? 'cta' : 'interactive'
  const content = (
    <>
      {children}
      {arrow && <ArrowRight size={16} strokeWidth={1.5} aria-hidden />}
    </>
  )

  if ('href' in rest && rest.href !== undefined) {
    const { href, ...anchor } = rest as LinkButtonProps
    const external = /^(https?:|mailto:|tel:)/.test(href)
    return external ? (
      <a href={href} className={cls} data-cursor={cursor} {...anchor}>
        {content}
      </a>
    ) : (
      <Link href={href} className={cls} data-cursor={cursor} {...anchor}>
        {content}
      </Link>
    )
  }
  return (
    <button type="button" className={cls} data-cursor={cursor} {...(rest as NativeButtonProps)}>
      {content}
    </button>
  )
}
