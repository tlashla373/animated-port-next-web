'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useImagePreloader } from '@/hooks/useImagePreloader'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { progressToFrame } from '@/lib/frame-map'
import CanvasSequence from './CanvasSequence'
import SectionContent from './section-content/SectionContent'
import HeroLogo from './HeroLogo'

export default function MasterScrollScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { images, isLoaded, loadProgress } = useImagePreloader()
  const scrollProgress = useScrollProgress(containerRef as React.RefObject<HTMLElement>)
  const currentFrame   = progressToFrame(scrollProgress)

  return (
    // ── Outer: scrollable height controls the journey duration ────────────
    // id="master-scroll" lets the navbar compute exact scrollY targets
    <div
      id="master-scroll"
      ref={containerRef}
      className="relative h-[350vh] md:h-[500vh]"
    >
      {/* ── Inner: sticky viewport panel — never moves ─────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">

        {/* ── Loading overlay ─────────────────────────────────────────── */}
        <motion.div
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: 'easeInOut' }}
          style={{ pointerEvents: isLoaded ? 'none' : 'all' }}
          className="absolute inset-0 z-50 bg-[#050505] flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-5">
            <p className="text-[10px] tracking-[0.48em] uppercase text-white/25 font-light">
              Port Authority
            </p>
            <div className="relative w-52 h-px bg-white/10 overflow-hidden">
              <motion.div
                style={{ scaleX: loadProgress, transformOrigin: 'left center' }}
                className="absolute inset-0 bg-[#C9B99A]"
              />
            </div>
            <p className="text-[10px] tracking-widest text-white/20 tabular-nums">
              {Math.round(loadProgress * 100)}%
            </p>
          </div>
        </motion.div>

        {/* ── Canvas: draws the sequence frame ────────────────────────── */}
        <CanvasSequence images={images} currentFrame={currentFrame} />

        {/* ── Text overlays: section content ──────────────────────────── */}
        <SectionContent currentFrame={currentFrame} />
        {/* ── Cinematic logo: hero-centre → navbar (outside SectionContent so
             it isn't clipped by the section's blur filter) ────────────── */}
        <HeroLogo currentFrame={currentFrame} />
      </div>
    </div>
  )
}
