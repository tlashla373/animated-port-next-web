'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { getSectionOpacity } from '@/lib/frame-map'

interface Props {
  currentFrame: number
}

const STATS = [
  { val: '18+',  label: 'Years Operating' },
  { val: '340+', label: 'Aircraft'         },
  { val: '98%',  label: 'On-Time Rate'     },
]

// About section: frames 70–154
// Entry : 70–90   (rise from bottom)
// Hold  : 90–134
// Exit  : 134–154 (fly off top)

export default function AboutContent({ currentFrame }: Props) {
  // ── spring-smoothed frame (must be before early return) ───────────────
  const frameMotion = useMotionValue(currentFrame)
  const smoothFrame = useSpring(frameMotion, { stiffness: 260, damping: 48, mass: 0.6 })
  useEffect(() => { frameMotion.set(currentFrame) }, [currentFrame, frameMotion])

  // Multi-point y: below ─► 0 ─► above   (staggered per element)
  // About section: frames 75–149 (entry 75–93, hold 93–131, exit 131–149)
  const labelY   = useTransform(smoothFrame, [75,  93, 131, 149], ['80px',  '0px', '0px', '-100vh'], { clamp: true })
  const headY    = useTransform(smoothFrame, [78,  96, 129, 147], ['110px', '0px', '0px', '-100vh'], { clamp: true })
  const bodyY    = useTransform(smoothFrame, [81,  99, 127, 145], ['140px', '0px', '0px', '-100vh'], { clamp: true })
  const statsY   = useTransform(smoothFrame, [85, 103, 125, 143], ['170px', '0px', '0px', '-100vh'], { clamp: true })

  // Opacity: fade in on entry, fade out on exit
  const labelOp  = useTransform(smoothFrame, [75,  91, 133, 149], [0, 1, 1, 0], { clamp: true })
  const headOp   = useTransform(smoothFrame, [78,  94, 131, 147], [0, 1, 1, 0], { clamp: true })
  const bodyOp   = useTransform(smoothFrame, [81,  97, 129, 145], [0, 1, 1, 0], { clamp: true })
  const statsOp  = useTransform(smoothFrame, [85, 101, 127, 143], [0, 1, 1, 0], { clamp: true })

  // Visibility gate — returns null when fully outside the section
  const opacity = getSectionOpacity('about', currentFrame)
  if (opacity === 0) return null

  const lineW = opacity * 40

  return (
    <section
      aria-label="About Port Authority"
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center overflow-hidden"
    >
      {/* Section label + rule */}
      <motion.div
        className="flex items-center justify-center gap-3 mb-7"
        style={{ y: labelY, opacity: labelOp }}
      >
        <div style={{ width: lineW / 2, height: 1, background: '#ffffff', flexShrink: 0 }} />
        <p className="text-[10px] tracking-[0.6em] uppercase text-white font-light whitespace-nowrap">
          01 — About
        </p>
        <div style={{ width: lineW / 2, height: 1, background: '#ffffff', flexShrink: 0 }} />
      </motion.div>

      {/* Headline */}
      <motion.h2
        className="font-zalando text-3xl md:text-[3.2rem] font-extrabold leading-[1.1] text-[#F4F0E4] mb-7 max-w-2xl"
        style={{ y: headY, opacity: headOp }}
      >
        A Standard Above Standard.
      </motion.h2>

      {/* Body */}
      <motion.p
        className="font-zalando text-base md:text-2xl lg:text-3xl text-[#F4F0E4] leading-[1.7] font-bold max-w-sm md:max-w-3xl lg:max-w-5xl"
        style={{ y: bodyY, opacity: bodyOp }}
      >
        Port Authority was built for the sovereign traveller — the executive
        who views time as currency and refuses to spend it in terminals. We
        operate a privately managed fleet, handled exclusively by former
        military and commercial aviation professionals with decades of
        precision experience.
      </motion.p>

      {/* Stats row */}
      <motion.div
        className="flex gap-10 mt-10"
        style={{ y: statsY, opacity: statsOp }}
      >
        {STATS.map(({ val, label }) => (
          <div key={label} className="flex flex-col items-center">
            <p className="text-2xl text-white font-bold tabular-nums">{val}</p>
            <p className="text-[10px] tracking-[0.22em] text-white/80 uppercase mt-1 font-bold">
              {label}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
