import type { Metadata } from 'next'
import SystemLab from '@/components/system/lab/SystemLab'

export const metadata: Metadata = {
  title: 'System lab',
  robots: { index: false, follow: false },
}

export default function SystemLabPage() {
  return <SystemLab />
}
