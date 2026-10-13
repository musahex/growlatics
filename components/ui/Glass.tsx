import { cn } from '@/lib/utils'

// Glass material surfaces (GLASS_BRIEF §7). Rules, budgets and when not to use: docs/v2/GLASS_SYSTEM.md.
export type GlassVariant = 'base' | 'elevated' | 'dark' | 'light'

const variants: Record<GlassVariant, string> = {
  base: 'glass',
  elevated: 'glass-elevated',
  dark: 'glass-dark',
  light: 'glass-light',
}

/** Class string for a glass surface. `signal` = active state (orange edge + inner glow); `inner` = smaller radius for nested/compact parts. */
export function glassClass(variant: GlassVariant = 'base', { signal = false, inner = false } = {}, className?: string) {
  return cn(variants[variant], signal && 'glass-signal', inner ? 'rounded-liquid-inner' : 'rounded-liquid', className)
}

type Props = React.HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'section' | 'aside' | 'nav' | 'figure' | 'form' | 'ul' | 'li'
  variant?: GlassVariant
  signal?: boolean
  inner?: boolean
}

export default function Glass({ as: Tag = 'div', variant = 'base', signal, inner, className, ...rest }: Props) {
  // The dark variant sits on light backgrounds, so its subtree takes the dark text tokens.
  return <Tag data-surface={variant === 'dark' ? 'dark' : undefined} className={glassClass(variant, { signal, inner }, className)} {...rest} />
}
