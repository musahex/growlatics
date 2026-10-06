import type { Config } from 'tailwindcss'

// Every value maps to a token in app/globals.css (docs/v2/DIRECTION.md §2–4).
const ch = (name: string) => `rgb(var(${name}) / <alpha-value>)` // opaque channel tokens
const al = (name: string) => `rgb(var(${name}))` // tokens that carry their own alpha

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.ts', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        fine: { raw: '(hover: hover) and (pointer: fine)' },
        touch: { raw: '(hover: none), (pointer: coarse)' },
      },
      colors: {
        bg: ch('--c-bg'),
        surface: ch('--c-surface'),
        elevated: ch('--c-elevated'),
        inset: ch('--c-inset'),
        text: {
          DEFAULT: ch('--c-text'),
          2: ch('--c-text-2'),
          3: ch('--c-text-3'),
          4: ch('--c-text-4'),
        },
        line: {
          DEFAULT: al('--c-line'),
          2: al('--c-line-2'),
          3: al('--c-line-3'),
        },
        'grid-dot': al('--c-grid-dot'),
        signal: {
          DEFAULT: ch('--c-signal'),
          deep: ch('--c-signal-deep'),
          ink: ch('--c-signal-ink'),
          soft: al('--c-signal-soft'),
          line: al('--c-signal-line'),
        },
        glow: al('--c-glow'),
        'on-signal': ch('--c-on-signal'),
        net: {
          dormant: al('--net-dormant'),
          idle: al('--net-idle'),
          active: al('--net-active'),
          edge: al('--net-edge'),
          'edge-hot': al('--net-edge-hot'),
          'edge-broken': al('--net-edge-broken'),
          packet: ch('--net-packet'),
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 1.6rem + 4.6vw, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.035em', fontWeight: '600' }],
        'display-l': ['clamp(2.25rem, 1.5rem + 3vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '600' }],
        'display-m': ['clamp(1.75rem, 1.3rem + 1.8vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '600' }],
        title: ['clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '600' }],
        'body-l': ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.005em' }],
        body: ['1rem', { lineHeight: '1.65' }],
        'body-s': ['0.875rem', { lineHeight: '1.55' }],
        label: ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.14em', fontWeight: '600' }],
        data: ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '500' }],
        'data-s': ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.04em' }],
      },
      spacing: {
        section: 'var(--space-section)',
        'section-tight': 'var(--space-section-tight)',
        gutter: 'var(--gutter)',
        'header-clear': 'var(--header-clear)',
      },
      maxWidth: {
        container: 'var(--container)',
        'container-wide': 'var(--container-wide)',
        measure: '36rem',
        headline: '22ch',
      },
      borderRadius: {
        xs: 'var(--r-xs)',
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
        full: 'var(--r-full)',
        glass: 'var(--r-glass)',
      },
      boxShadow: {
        1: 'var(--sh-1)',
        2: 'var(--sh-2)',
        3: 'var(--sh-3)',
        signal: 'var(--sh-signal)',
        focus: 'var(--focus-ring)',
      },
      zIndex: {
        canvas: 'var(--z-canvas)',
        content: 'var(--z-content)',
        stage: 'var(--z-stage)',
        header: 'var(--z-header)',
        overlay: 'var(--z-overlay)',
        toast: 'var(--z-toast)',
        cursor: 'var(--z-cursor)',
      },
      transitionDuration: {
        instant: '120ms',
        fast: '200ms',
        base: '320ms',
        slow: '560ms',
        slower: '880ms',
        cinematic: '1400ms',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
        in: 'var(--ease-in)',
      },
      backgroundImage: {
        'dot-grid': 'radial-gradient(rgb(var(--c-grid-dot)) 1px, transparent 1px)',
        'pointer-glow': 'radial-gradient(closest-side, rgb(var(--c-glow)), transparent)',
      },
      backgroundSize: {
        grid: '24px 24px',
      },
      keyframes: {
        // a packet travelling along a hairline (P6 handoff strip); disabled under reduced motion
        travel: {
          '0%': { transform: 'translateX(0)', opacity: '0' },
          '10%, 90%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
      },
      animation: {
        travel: 'travel 2.4s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
