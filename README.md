# Growlatics Website

A premium interactive landing page for Growlatics, a growth operations partner helping businesses scale through performance marketing, sales operations, customer support, and technology systems.

The site is built as a modern 3D-enabled marketing website with light/dark mode, scroll-based animations, an interactive growth-network background, and a custom cursor experience.

---

## Tech Stack

### Core Framework

- **Next.js** — React framework for production web applications
- **React** — component-based UI
- **TypeScript** — typed JavaScript for safer development

### Styling & UI

- **Tailwind CSS** — utility-first styling
- **CSS Variables** — light/dark theme tokens
- **Responsive Design** — mobile, tablet, and desktop layouts

### Animation & Interaction

- **Framer Motion** — scroll animations, transitions, and motion effects
- **Three.js** — 3D rendering engine
- **React Three Fiber** — React renderer for Three.js
- **Custom Cursor System** — desktop-only interactive cursor
- **View Transitions API** — smooth light/dark theme switching where supported

### 3D / Visual System

- Global interactive 3D growth background
- Hero-specific cursor-reactive growth network
- Scroll-driven 3D growth window
- Theme-aware light and dark visual modes

---

## Project Structure

```txt
app/
  layout.tsx              # Root layout, global wrappers, cursor/background
  page.tsx                # Main landing page structure
  globals.css             # Global styles, theme variables, cursor styles

components/
  layout/
    Header.tsx            # Site header, nav, theme toggle

  sections/
    Hero.tsx              # Main hero section
    HeroInteractiveField.tsx
    ThreeGrowthWindow.tsx
    ServicesSection.tsx
    GrowthSystemSection.tsx
    OutcomesSection.tsx
    FinalCTA.tsx

  three/
    GlobalGrowthScene.tsx # Global 3D background scene

  ui/
    Button.tsx
    ThemeToggle.tsx
    InteractiveCursor.tsx
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

The site will be available at:

```txt
http://localhost:3000
```

---

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Creates an optimized production build.

```bash
npm run start
```

Runs the production build locally after `npm run build`.

```bash
npm run lint
```

Runs linting checks if configured in the project.

---

## Static export and the system lab

`npm run build` writes the static site to `out/` (`output: 'export'`, `trailingSlash: true`); upload `out/` to Hostinger. `npm run start` does not serve an export: use any static server on `out/`.

`/lab/system/` is a dev-only test bench for the 3D system (every tier and act layout). It is available under `npm run dev`; the `postbuild` script deletes `out/lab/` and its chunk, so it never ships. Call `npx next build` directly and the lab stays in `out/`: always build with `npm run build`.

Check the export with `node scripts/seo-crawl.mjs` (exits 1 on any SEO problem).

---

## Production Build

Before deploying, always run:

```bash
npm run build
```

A successful build confirms:

- TypeScript compiles correctly
- Next.js production bundle is valid
- Routes and components compile successfully
- No blocking build-time errors exist

To test the production build locally:

```bash
npm run build
npm run start
```

Then open:

```txt
http://localhost:3000
```

---

## Deployment

This project is suitable for deployment on platforms such as:

- **Vercel** — recommended for Next.js
- **Netlify**
- **AWS Amplify**
- **Cloudflare Pages**
- Any Node-compatible hosting environment

### Recommended: Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Use the default Next.js build settings:
   - Build command:

```bash
npm run build
```

   - Output handled automatically by Vercel.
4. Deploy.

---

## Environment Variables

This project currently does not require mandatory environment variables for the landing page.

If future integrations are added, such as:

- booking form provider
- CRM integration
- analytics
- email capture
- API routes

create a `.env.local` file:

```bash
touch .env.local
```

Example:

```env
NEXT_PUBLIC_SITE_URL=https://growlatics.com
NEXT_PUBLIC_ANALYTICS_ID=
```

Never commit private API keys to Git.

---

## Key Features

### Light / Dark Mode

The website supports both light and dark themes.

Theme selection is:

- stored in `localStorage`
- applied through a theme attribute/class
- animated with a smooth transition
- designed to preserve the same layout and interaction model in both modes

Dark mode provides a cinematic 3D look, while light mode uses a warm editorial visual style.

---

### Global 3D Background

The site includes a fixed global 3D background layer using React Three Fiber and Three.js.

It provides:

- connected nodes
- subtle particles
- scroll-responsive depth movement
- theme-aware lighting
- ambient growth-system visuals

The canvas is non-interactive and does not block page clicks.

---

### Hero Interactive Field

The hero section includes a dedicated interactive network background.

It is designed to feel like a growing operating system network:

- nodes
- connecting lines
- branching growth paths
- cursor-following glow
- subtle parallax
- light/dark theme support

The interaction is strongest in safe visual areas and avoids distracting from the headline, body copy, CTAs, and capability card.

---

### Custom Cursor

A desktop-only custom cursor is included.

It features:

- small center dot
- smooth trailing ring
- hover states for links, buttons, cards, and CTAs
- theme-aware styling
- dark-section detection for visibility
- native cursor hiding when active

The cursor is disabled on:

- mobile/touch devices
- coarse pointer devices
- reduced-motion environments

---

### Scroll-Driven 3D Growth Window

The `ThreeGrowthWindow` section presents a scroll-driven 3D growth system.

It covers:

1. Attention
2. Convert
3. Close
4. Support
5. Scale

The section uses sticky scrolling, animated 3D nodes, and progressive stage content.

---

## Performance Notes

The project has been designed with performance in mind:

- Uses a limited number of 3D objects
- Caps device pixel ratio for WebGL rendering
- Avoids unnecessary React re-renders during cursor and mouse movement
- Uses refs and `requestAnimationFrame` for smooth interaction
- Disables heavy 3D/cursor behaviour on mobile where appropriate
- Uses CSS transforms and opacity for animation where possible

---

## Accessibility Notes

The site includes several accessibility-conscious choices:

- Real HTML text is used instead of rendering text inside canvas
- CTAs and navigation remain standard interactive elements
- Reduced-motion users receive simplified animation behaviour
- Custom cursor is disabled where inappropriate
- Text contrast should be checked in both light and dark modes before production release

Recommended pre-launch checks:

- keyboard navigation
- focus states
- reduced-motion mode
- mobile readability
- contrast on muted text
- link and button accessibility labels

---

## Browser Support

Recommended modern browsers:

- Chrome
- Edge
- Safari
- Firefox

The best experience is available on modern desktop browsers with WebGL support.

Fallback behaviour should remain usable on mobile and lower-powered devices.

---

## Pre-Deployment Checklist

Before going live:

- [ ] Run `npm run build`
- [ ] Test desktop at 1280px, 1440px, and larger
- [ ] Test tablet at 768px and 1024px
- [ ] Test mobile at 375px and 430px
- [ ] Check light and dark mode
- [ ] Confirm theme toggle works
- [ ] Confirm custom cursor does not show alongside the system cursor
- [ ] Confirm cursor remains visible on dark sections
- [ ] Confirm no horizontal overflow
- [ ] Confirm nav links scroll to correct sections
- [ ] Confirm CTA buttons point to the correct booking/contact destination
- [ ] Replace temporary logo/wordmark with final SVG logo
- [ ] Test production build locally with `npm run start`

---

## Future Improvements

Potential next steps:

- Add final SVG logo asset
- Add real booking/contact integration
- Add analytics
- Add SEO metadata and Open Graph images
- Add sitemap and robots configuration
- Add form handling or CRM integration
- Optimize 3D assets further after design approval
- Add case studies or proof points once available

---

## Notes for Developers

When editing the project:

- Keep the text content as HTML for SEO and accessibility.
- Do not move the entire website into a canvas.
- Keep 3D effects supportive, not dominant.
- Maintain the same visual system across light and dark mode.
- Avoid increasing particle counts or adding heavy animation loops unless tested.
- Run `npm run build` after major visual or structural changes.

---

## Brand Direction

Growlatics should feel:

- premium
- technical
- conversion-focused
- operationally sharp
- growth-oriented
- modern but not gimmicky

The visual system should communicate one connected growth engine across:

- marketing
- sales
- customer support
- technology
- digital systems
