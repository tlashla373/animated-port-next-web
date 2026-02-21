'use client'

/**
 * HeroLogo
 *
 * Renders the "Port Authority" wordmark as a scroll-driven cinematic element:
 *   Frame  0  → large, centred in the viewport
 *   Frame 55  → shrunk to navbar size, sitting at the navbar's centre
 *   Frame 50-68 → crossfades with the Navbar's own wordmark (which fades IN)
 *
 * Intentionally placed OUTSIDE HeroContent so it is not clipped by the
 * parent section's `filter: blur()` style during the hero→about transition.
 */

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { getLenis } from '@/providers/LenisProvider'

interface Props {
  currentFrame: number
}

export default function HeroLogo({ currentFrame }: Props) {
  // Measure viewport height once on the client (avoids SSR mismatch)
  const [vh, setVh] = useState(0)
  useEffect(() => {
    setVh(window.innerHeight)
    const onResize = () => setVh(window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── Spring-smoothed frame value ───────────────────────────────────────
  const frameMotion = useMotionValue(currentFrame)
  const smoothFrame = useSpring(frameMotion, {
    stiffness: 280,
    damping:   50,
    mass:      0.6,
  })
  useEffect(() => {
    frameMotion.set(currentFrame)
  }, [currentFrame, frameMotion])

  // ── Transform values ──────────────────────────────────────────────────
  // y: from screen centre to navbar centre (h-20 = 80px, so centre = 40px)
  //   element height ≈ 36px, so to centre: y = 40 - 18 = 22px
  //   at frame 0 centre on screen: y = vh/2 - 18
  const logoY = useTransform(
    smoothFrame,
    [0, 55],
    vh ? [vh / 2 - 18, 22] : [0, 22],
    { clamp: true }
  )

  // Scale: 3.5× at start → 1× (navbar size) at frame 55
  const logoScale = useTransform(smoothFrame, [0, 55], [3.5, 1], { clamp: true })

  // Opacity: fully visible until frame 50, then crossfades out by frame 68
  const logoOpacity = useTransform(smoothFrame, [50, 68], [1, 0], { clamp: true })

  function handleClick() {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { duration: 1.6 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Don't render at all once fully faded (perf)
  if (currentFrame > 80) return null

  return (
    <motion.button
      onClick={handleClick}
      aria-label="Port Authority — scroll to top"
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        x: '-50%',
        y: logoY,
        scale: logoScale,
        opacity: logoOpacity,
        zIndex: 99, // just below Navbar z-[100]
        transformOrigin: 'center center',
        pointerEvents: 'auto',
      }}
      className="flex flex-col items-center leading-none select-none cursor-pointer"
    >
      <span className="text-[6px] tracking-[0.2em] uppercase text-[#C9B99A] font-light">
        Port
      </span>
      <span className="text-[8px] md:text-[8px] tracking-[0.3em] uppercase text-white font-light -mt-0.5">
        Authority
      </span>
    </motion.button>
  )
}
