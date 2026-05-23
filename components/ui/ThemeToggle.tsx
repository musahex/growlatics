'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={[
        'flex h-8 w-8 items-center justify-center rounded-lg',
        'border transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40',
        // light mode
        'border-[rgba(10,9,8,0.12)] bg-[rgba(10,9,8,0.05)] text-[#6A6460]',
        'hover:border-[rgba(10,9,8,0.22)] hover:bg-[rgba(10,9,8,0.1)] hover:text-[#0C0B0A]',
        // dark mode overrides
        'dark:border-white/[0.1] dark:bg-white/[0.06] dark:text-[#A8A09A]',
        'dark:hover:border-white/[0.2] dark:hover:bg-white/[0.12] dark:hover:text-white',
      ].join(' ')}
    >
      {theme === 'dark' ? (
        <Sun size={15} aria-hidden />
      ) : (
        <Moon size={15} aria-hidden />
      )}
    </button>
  )
}
