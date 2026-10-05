import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// The custom type scale (tailwind.config fontSize) must be registered as font sizes: unknown
// `text-*` classes count as text colours, so cn('text-on-signal', 'text-body-s') dropped the colour.
const twMerge = extendTailwindMerge({
  extend: { classGroups: { 'font-size': [{ text: ['display-xl', 'display-l', 'display-m', 'title', 'body-l', 'body', 'body-s', 'label', 'data', 'data-s'] }] } },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
