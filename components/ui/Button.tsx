'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  href?: string
  'data-cursor'?: string
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-brand-orange text-white hover:bg-brand-orange-deep shadow-orange-glow hover:shadow-orange-glow-lg active:scale-95',
  ghost:
    'bg-surface-glass text-white border border-surface-border hover:border-brand-orange/50 hover:bg-white/[0.08] backdrop-blur-sm',
  outline:
    'bg-transparent text-brand-orange border border-brand-orange hover:bg-brand-orange hover:text-white',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      href,
      children,
      'data-cursor': dataCursor,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50 disabled:opacity-50 disabled:pointer-events-none',
      variantStyles[variant],
      sizeStyles[size],
      className,
    )

    if (href) {
      return (
        <a href={href} className={classes} data-cursor={dataCursor}>
          {children}
        </a>
      )
    }

    return (
      <button ref={ref} className={classes} data-cursor={dataCursor} {...props}>
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
export default Button
