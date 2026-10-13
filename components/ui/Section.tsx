import { cn } from '@/lib/utils'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div' | 'article' | 'header'
  /** Section padding: standard, tight or none. */
  space?: 'standard' | 'tight' | 'none'
  /** Container width: text (1280) or wide (1536). */
  width?: 'text' | 'wide'
  /** `dark` sets data-surface="dark" (tokens re-declared dark in both themes). */
  tone?: 'bg' | 'surface' | 'dark'
  /** Hairline above the section. */
  rule?: boolean
  innerClassName?: string
}

export default function Section({
  as: Tag = 'section',
  space = 'standard',
  width = 'text',
  tone = 'bg',
  rule = false,
  className,
  innerClassName,
  children,
  ...rest
}: SectionProps) {
  return (
    <Tag
      {...(tone === 'dark' && { 'data-surface': 'dark', 'data-cursor-surface': 'dark' })}
      className={cn(
        'relative w-full text-text',
        tone === 'surface' ? 'bg-surface' : 'bg-bg',
        space === 'standard' && 'py-section',
        space === 'tight' && 'py-section-tight',
        rule && 'border-t border-line',
        className,
      )}
      {...rest}
    >
      <div className={cn('mx-auto w-full px-gutter', width === 'wide' ? 'max-w-container-wide' : 'max-w-container', innerClassName)}>
        {children}
      </div>
    </Tag>
  )
}
