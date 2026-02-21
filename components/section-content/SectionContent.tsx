import HeroContent from './HeroContent'
import AboutContent from './AboutContent'
import AdvantagesContent from './AdvantagesContent'
import GlobalContent from './GlobalContent'

interface SectionContentProps {
  currentFrame: number
}

export default function SectionContent({ currentFrame }: SectionContentProps) {
  return (
    // All four overlays always in the DOM; only opacity changes
    <div className="absolute inset-0 z-10 pointer-events-none select-none">
      <HeroContent       currentFrame={currentFrame} />
      <AboutContent      currentFrame={currentFrame} />
      <AdvantagesContent currentFrame={currentFrame} />
      <GlobalContent     currentFrame={currentFrame} />
    </div>
  )
}
