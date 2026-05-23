import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
  hoverable?: boolean
}

export default function GlassCard({
  children,
  className,
  glow = false,
  hoverable = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass rounded-xl p-6',
        glow && 'border-glow',
        hoverable &&
          'transition-all duration-300 hover:border-brand-orange/30 hover:bg-white/[0.08] hover:-translate-y-1 hover:shadow-orange-glow',
        className
      )}
    >
      {children}
    </div>
  )
}
