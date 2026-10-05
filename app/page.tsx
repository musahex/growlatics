import { organizationJsonLd } from '@/lib/seo'
import { HomeStage } from '@/components/home/stage'
import { Capabilities, Connection, Convergence, Global, Hero, Journey, Problem, Why, Work } from '@/components/home/acts'

// Home: nine acts over one fixed system stage (DIRECTION §6.7). clip-path keeps the fixed canvas
// inside the acts (it never paints over the footer) and makes this wrapper the canvas's stacking context.
export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      <div className="relative [clip-path:inset(0)]">
        <HomeStage />
        <Hero />
        <Problem />
        <Connection />
        <Journey />
        <Capabilities />
        <Why />
        <Global />
        <Work />
        <Convergence />
      </div>
    </>
  )
}
