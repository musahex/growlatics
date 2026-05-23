import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import GlobalGrowthScene from '@/components/three/GlobalGrowthScene'
import InteractiveCursor from '@/components/ui/InteractiveCursor'
import { ThemeProvider } from '@/context/ThemeContext'

export const metadata: Metadata = {
  title: 'Growlatics — Marketing that converts. Sales teams that close. Tech that scales.',
  description:
    'Growlatics helps businesses scale through performance marketing, offshore sales operations, customer support, and digital product development.',
  keywords: [
    'performance marketing',
    'sales operations',
    'BPO',
    'customer support',
    'digital development',
    'growth agency',
  ],
  openGraph: {
    title: 'Growlatics',
    description: 'Marketing that converts. Sales teams that close. Tech that scales.',
    siteName: 'Growlatics',
    type: 'website',
  },
}

// Inline script runs synchronously before paint — prevents flash of wrong theme.
const FOUC_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" data-theme="dark" suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden">
        {/* FOUC prevention — must be the very first child of body */}
        <script dangerouslySetInnerHTML={{ __html: FOUC_SCRIPT }} />

        <ThemeProvider>
          {/* Custom cursor — renders nothing on touch/mobile */}
          <InteractiveCursor />

          {/* Fixed 3D canvas — z:0, sits behind all page content */}
          <GlobalGrowthScene />

          {/* Header — fixed, z:50 */}
          <Header />

          {/* z-[1] lifts this wrapper above the fixed canvas (z:0) */}
          <div className="relative z-[1]">
            <main>{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
