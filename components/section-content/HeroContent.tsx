'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { getSectionOpacity } from '@/lib/frame-map'

interface Props {
  currentFrame: number
}

export default function HeroContent({ currentFrame }: Props) {
  const opacity = getSectionOpacity('hero', currentFrame)
  if (opacity === 0) return null

  const blur = opacity < 1 ? `blur(${(1 - opacity) * 6}px)` : 'blur(0px)'
  const y    = (1 - opacity) * 24

  // ── Scroll-driven exit animations (frames 0 → 36) ─────────────────
  const frameMotion = useMotionValue(currentFrame)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { frameMotion.set(currentFrame) }, [currentFrame])

  // 0 = start, 1 = fully exited (at frame 36)
  const progress = useTransform(frameMotion, [0, 36], [0, 1], { clamp: true })

  // Left headline: zoom in + sweep left
  const leftX     = useTransform(progress, [0, 1], ['0vw', '-65vw'])
  const leftScale = useTransform(progress, [0, 1], [1, 1.22])

  // Right headline: zoom in + sweep right
  const rightX     = useTransform(progress, [0, 1], ['0vw', '65vw'])
  const rightScale = useTransform(progress, [0, 1], [1, 1.22])

  // Bottom-left block: slide down + fade
  const bottomLeftY       = useTransform(progress, [0, 1],   ['0%', '50%'])
  const bottomLeftOpacity = useTransform(progress, [0, 0.55], [1, 0])

  // Scroll indicator: fade out early
  const indicatorOpacity = useTransform(progress, [0, 0.35], [1, 0])

  return (
    <section
      aria-label="Hero — Port Authority Private Aviation"
      style={{
        opacity,
        filter: blur,
        transform: `translateY(${y}px)`,
        transition: 'opacity 0.1s linear',
      }}
      className="absolute inset-0 pointer-events-none select-none"
    >

      {/* ── TOP-LEFT: large headline — zoom + sweep left ─────── */}
      <motion.div
        className="absolute top-[20%] left-6 md:left-14 max-w-[38vw]"
        style={{ x: leftX, scale: leftScale, transformOrigin: 'left center' }}
      >
        <h1 className="font-zalando text-[clamp(2.1rem,7vw,5rem)] font-semibold leading-[0.95] text-white tracking-tight">
          We are<br />movement
        </h1>
      </motion.div>

      {/* ── TOP-RIGHT: large headline — zoom + sweep right ────── */}
      <motion.div
        className="absolute top-[50%] right-6 md:right-14 max-w-[38vw] text-right"
        style={{ x: rightX, scale: rightScale, transformOrigin: 'right center' }}
      >
        <h2 className="font-zalando text-[clamp(2.1rem,7vw,5rem)] font-semibold leading-[0.95] text-white tracking-tight">
          We are<br />distinction
        </h2>
      </motion.div>

      {/* ── BOTTOM-LEFT: sub-heading + body — slide down + fade ─ */}
      <motion.div
        className="absolute bottom-[20%] left-6 md:left-14 max-w-[260px]"
        style={{ y: bottomLeftY, opacity: bottomLeftOpacity }}
      >
        <p className="font-zalando text-base md:text-xl font-semibold text-white leading-snug mb-3">
          Your freedom to<br />enjoy life
        </p>
        {/* divider */}
        <div className="w-6 h-px bg-white/80 mb-4" />
        <p className="font-zalando text-[0.72rem] md:text-[0.78rem] text-white/100 leading-[1.85] font-light">
          Every flight is designed around your comfort,
          time, and ambitions — so you can focus on
          what truly matters, while we take care of
          everything else.
        </p>
      </motion.div>

      {/* ── BOTTOM-CENTER: CTA buttons ─────────────────────────── 
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-auto">
        <button
          className="flex items-center gap-2 bg-white text-black text-[0.78rem]
                     font-semibold tracking-wide px-6 py-3 rounded-full
                     hover:bg-white/90 transition-colors duration-300"
          aria-label="Book the flight"
        >
          Book the Flight
        </button>
        <button
          className="w-11 h-11 rounded-full border border-white/30 flex items-center
                     justify-center text-white hover:border-white/70 transition-colors duration-300"
          aria-label="Explore"
        >
          {/* plane icon 
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10
                     3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13
                     19v-5.5z"/>
          </svg>
        </button>
      </div> */}
      

      {/* ── BOTTOM-RIGHT: scroll indicator — fade out ─────────── */}
      <motion.div
        className="absolute bottom-[10%] right-6 md:right-14 flex items-center gap-4"
        style={{ opacity: indicatorOpacity }}
      >
        {/* double chevron + SCROLL DOWN */}
        <div className="flex items-center gap-4">
          {/* stacked chevrons — cascade animate downward */}
          <div className="flex flex-col gap-[2px]">
            <svg width="10" height="8" viewBox="0 0 24 14" fill="none"
                 stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                 style={{ animation: 'chevronPulse 1.5s ease-in-out infinite', animationDelay: '0ms' }}>
              <polyline points="2 2 12 10 22 2"/>
            </svg>
            <svg width="10" height="8" viewBox="0 0 24 14" fill="none"
                 stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                 style={{ animation: 'chevronPulse 1.5s ease-in-out infinite', animationDelay: '200ms' }}>
              <polyline points="2 2 12 10 22 2"/>
            </svg>
            <svg width="10" height="8" viewBox="0 0 24 14" fill="none"
                 stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                 style={{ animation: 'chevronPulse 1.5s ease-in-out infinite', animationDelay: '400ms' }}>
              <polyline points="2 2 12 10 22 2"/>
            </svg>
          </div>
          <p className="text-[0.58rem] tracking-[0.28em] uppercase text-white/90 font-medium">
            Scroll Down
          </p>
        </div>

        {/* divider */}
        <div className="w-px h-3 bg-white/20" />

        {/* TO START THE JOURNEY */}
        <p className="text-[0.58rem] tracking-[0.22em] uppercase text-white/90 font-light">
          To Start the Journey
        </p>
      </motion.div>

    </section>
  )
}
