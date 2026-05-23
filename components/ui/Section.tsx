import { cn } from '@/lib/utils'

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  as?: 'section' | 'div' | 'article'
  innerClassName?: string
}

export default function Section({
  children,
  className,
  id,
  as: Tag = 'section',
  innerClassName,
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn('relative w-full py-20 md:py-28 lg:py-32', className)}
    >
      <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', innerClassName)}>
        {children}
      </div>
    </Tag>
  )
}
