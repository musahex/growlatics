import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#D2401A',
          'orange-deep': '#A83216',
          'orange-glow': 'rgba(210, 64, 26, 0.35)',
        },
        surface: {
          base: '#050505',
          subtle: '#08090B',
          elevated: '#0D0D0F',
          glass: 'rgba(255,255,255,0.06)',
          border: 'rgba(255,255,255,0.10)',
        },
        text: {
          primary: '#FFFFFF',
          muted: '#A1A1AA',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(210,64,26,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(210,64,26,0.5)' },
        },
      },
      boxShadow: {
        'orange-glow': '0 0 30px rgba(210, 64, 26, 0.3)',
        'orange-glow-lg': '0 0 60px rgba(210, 64, 26, 0.4)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}

export default config
