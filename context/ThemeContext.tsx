'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to 'dark' for SSR; effect corrects from DOM/localStorage on mount
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = document.documentElement.getAttribute('data-theme') as Theme | null
    const initial: Theme = stored === 'light' ? 'light' : 'dark'
    setTheme(initial)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark'

      const apply = () => {
        document.documentElement.setAttribute('data-theme', next)
        try { localStorage.setItem('theme', next) } catch (_) {}
      }

      if (typeof document !== 'undefined' && 'startViewTransition' in document) {
        document.startViewTransition(apply)
      } else {
        apply()
      }

      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
