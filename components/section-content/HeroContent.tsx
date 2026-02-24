'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { getSectionOpacity } from '@/lib/frame-map'

interface Props {
  currentFrame: number
}

export default function HeroContent({ currentFrame }: Props) {
  // ── Scroll-driven exit animations (frames 0 → 36) ─────────────────
  // NOTE: hooks must be called unconditionally (before any early return)
  const frameMotion = useMotionValue(currentFrame)

  // Spring smooths the discrete integer steps into a continuous curve
  const smoothFrame = useSpring(frameMotion, {
    stiffness: 280,
    damping:   50,
    mass:      0.6,
  })

  useEffect(() => { frameMotion.set(currentFrame) }, [currentFrame, frameMotion])

  // 0 = start, 1 = fully exited (at frame 36)
  const progress = useTransform(smoothFrame, [0, 50], [0, 1], { clamp: true })

  // Left headline: zoom in + sweep left
  const leftX     = useTransform(progress, [0, 1], ['0vw', '-65vw'])
  const leftScale = useTransform(progress, [0, 1], [1, 1.22])

  // Right headline: zoom in + sweep right
  const rightX     = useTransform(progress, [0, 1], ['0vw', '65vw'])
  const rightScale = useTransform(progress, [0, 1], [1, 1.22])

  // Bottom-left block: slide down + fade
  const bottomLeftY       = useTransform(progress, [0, 1],    ['0%', '50%'])
  const bottomLeftOpacity = useTransform(progress, [0, 0.55], [1, 0])

  // Scroll indicator: fade out early
  const indicatorOpacity = useTransform(progress, [0, 0.35], [1, 0])

  const opacity = getSectionOpacity('hero', currentFrame)
  if (opacity === 0) return null

  const blur = opacity < 1 ? `blur(${(1 - opacity) * 6}px)` : 'blur(0px)'
  const y    = (1 - opacity) * 24

  return (
    <section
      aria-label="Hero — Royal Asia Shipping"
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
        className="absolute top-[18%] left-4 md:left-14 max-w-[46vw] md:max-w-[38vw]"
        style={{ x: leftX, scale: leftScale, transformOrigin: 'left center' }}
      >
        <h1 className="font-zalando text-[clamp(1.55rem,7vw,5rem)] font-semibold leading-[0.95] text-white tracking-tight">
          Secure.<br />Fast.
        </h1>
      </motion.div>

      {/* ── TOP-RIGHT: large headline — zoom + sweep right ────── */}
      <motion.div
        className="absolute top-[62%] md:top-[50%] right-4 md:right-14 max-w-[46vw] md:max-w-[38vw] text-right"
        style={{ x: rightX, scale: rightScale, transformOrigin: 'right center' }}
      >
        <h2 className="font-zalando text-[clamp(1.55rem,7vw,5rem)] font-semibold leading-[0.95] text-white tracking-tight">
          Global.<br />Trackable.
        </h2>
      </motion.div>

      {/* ── BOTTOM-LEFT: sub-heading + body — slide down + fade ─ */}
      <motion.div
        className="absolute bottom-[18%] md:bottom-[20%] left-4 md:left-14 max-w-[160px] md:max-w-[260px]"
        style={{ y: bottomLeftY, opacity: bottomLeftOpacity }}
      >
        <p className="font-zalando text-sm md:text-xl font-semibold text-white leading-snug mb-2 md:mb-3">
          First Class<br />Logistics Services
        </p>
        {/* divider */}
        <div className="w-5 md:w-6 h-px bg-white/80 mb-3 md:mb-4" />
        <p className="font-zalando text-[0.58rem] md:text-[0.78rem] text-white/100 leading-[1.75] md:leading-[1.85] font-light">
          Shipping, Air Cargo, Freight Forwarding,
          Chartering, Warehousing and Cargo Clearing —
          handled by skilled professionals since 2004.
        </p>
      </motion.div>

      {/* ── BOTTOM-RIGHT: scroll indicator — fade out ─────────── */}
      <motion.div
        className="absolute bottom-[10%] right-4 md:right-14 flex items-center gap-2 md:gap-4"
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
          <p className="text-[0.52rem] md:text-[0.58rem] tracking-[0.22em] md:tracking-[0.28em] uppercase text-white/90 font-medium">
            Scroll Down
          </p>
        </div>

        {/* divider */}
        <div className="hidden md:block w-px h-3 bg-white/20" />

        {/* TO START THE JOURNEY */}
        <p className="hidden md:block text-[0.58rem] tracking-[0.22em] uppercase text-white/90 font-light">
          To Start the Journey
        </p>
      </motion.div>

    </section>
  )
}
