'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-11 w-11 items-center justify-center rounded-[12px] text-text-3 transition-colors duration-fast ease-out hover:bg-text/[0.06] hover:text-text"
    >
      {/* key: the icon re-mounts on change and turns in (.icon-turn) */}
      {dark ? <Sun key="sun" size={16} strokeWidth={1.5} aria-hidden className="icon-turn" /> : <Moon key="moon" size={16} strokeWidth={1.5} aria-hidden className="icon-turn" />}
    </button>
  )
}
