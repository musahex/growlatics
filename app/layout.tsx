import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import InteractiveCursor from '@/components/ui/InteractiveCursor'
import { ThemeProvider } from '@/context/ThemeContext'
import { SystemProvider } from '@/components/system/runtime'
import { nav } from '@/content'
import { siteMetadata } from '@/lib/seo'
import { bgHex } from '@/lib/tokens'

// Self-hosted at build time by next/font: no runtime request to Google (DIRECTION §3).
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-sans' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-mono', preload: false })

export const metadata: Metadata = siteMetadata

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: bgHex.light },
    { media: '(prefers-color-scheme: dark)', color: bgHex.dark },
  ],
}

// Runs before paint: applies the stored theme so there is no flash of the wrong theme.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-toast focus:rounded-md focus:bg-elevated focus:px-4 focus:py-3 focus:text-text">
          {nav.skipLink}
        </a>
        <ThemeProvider>
          <SystemProvider>
            <InteractiveCursor />
            <Header />
            <div className="relative z-content">
              <main id="main">{children}</main>
              <Footer />
            </div>
          </SystemProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
