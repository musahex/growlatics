import Hero from '@/components/sections/Hero'
import ThreeGrowthWindow from '@/components/sections/ThreeGrowthWindow'
import ServicesSection from '@/components/sections/ServicesSection'
import GrowthSystemSection from '@/components/sections/GrowthSystemSection'
import OutcomesSection from '@/components/sections/OutcomesSection'
import FinalCTA from '@/components/sections/FinalCTA'

export default function Home() {
  return (
    <div>
      <Hero />
      <ThreeGrowthWindow />
      <ServicesSection />
      <GrowthSystemSection />
      <OutcomesSection />
      <FinalCTA />
    </div>
  )
}
