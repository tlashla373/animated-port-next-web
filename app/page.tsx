import MasterScrollScene from '@/components/MasterScrollScene'
import AdvantagesSection from '@/components/AdvantagesSection'
import GlobeFooter from '@/components/GlobeFooter'
import FloatingCTA from '@/components/FloatingCTA'

export default function Page() {
  return (
    <main id="home">
      <MasterScrollScene />
      <AdvantagesSection />
      <GlobeFooter />
      <FloatingCTA />
    </main>
  )
}
