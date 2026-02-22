import HeroContent from './HeroContent'
import AboutContent from './AboutContent'
import FleetContent from './FleetContent'
import GlobalContent from './GlobalContent'
import AdvantagesTransition from '@/components/section-content/AdvantagesTransition'

interface SectionContentProps {
  currentFrame: number
}

export default function SectionContent({ currentFrame }: SectionContentProps) {
  return (
    // All overlays always in the DOM; only opacity changes
    <div className="absolute inset-0 z-10 pointer-events-none select-none">
      <HeroContent           currentFrame={currentFrame} />
      <AboutContent          currentFrame={currentFrame} />
      <FleetContent          currentFrame={currentFrame} />
      <GlobalContent         currentFrame={currentFrame} />
      <AdvantagesTransition  currentFrame={currentFrame} />
    </div>
  )
}
