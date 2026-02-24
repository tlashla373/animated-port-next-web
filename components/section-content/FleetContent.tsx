'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { getSectionOpacity } from '@/lib/frame-map'

interface Props {
  currentFrame: number
}

const FLEET_STATS = [
  { val: '20+', label: 'Years of Experience' },
  { val: '4',   label: 'Service Divisions'   },
  { val: '24/7', label: 'Support'            },
]

const VESSEL_TYPES = [
  {
    num:   '01',
    title: 'Sea Freight',
    body:  'Full and part container loads, bulk cargo and breakbulk handled through Colombo Port — one of Asia\'s busiest deep-water terminals — and all major global ports.',
  },
  {
    num:   '02',
    title: 'Air Cargo',
    body:  'Time-critical and high-value consignments moved via Bandaranaike International Airport and partner hubs worldwide, with door-to-door tracking and customs support.',
  },
  {
    num:   '03',
    title: 'Warehousing & Distribution',
    body:  'Secure, climate-controlled bonded and free warehousing in Colombo 13, strategically located minutes from the port for fast cargo consolidation and dispatch.',
  },
  {
    num:   '04',
    title: 'In-Bond & Clearing',
    body:  'End-to-end customs brokerage, in-bond cargo management and documentation handled by our licensed clearing agents — minimising delays and compliance risk.',
  },
]

// Fleet section: frames 120–179
// Entry  : 120–135  (rise from bottom)
// Hold   : 135–165
// Exit   : 165–179  (fly off top)

export default function FleetContent({ currentFrame }: Props) {
  // ── spring-smoothed frame ────────────────────────────────────────────
  const frameMotion = useMotionValue(currentFrame)
  const smoothFrame = useSpring(frameMotion, { stiffness: 260, damping: 48, mass: 0.6 })
  useEffect(() => { frameMotion.set(currentFrame) }, [currentFrame, frameMotion])

  // Multi-point y: below ─► 0 ─► above (staggered per element)
  // Fleet section: frames 150–224 (entry 150–168, hold 168–206, exit 206–224)
  const labelY = useTransform(smoothFrame, [150, 168, 206, 224], ['80px',  '0px', '0px', '-100vh'], { clamp: true })
  const headY  = useTransform(smoothFrame, [153, 171, 204, 222], ['110px', '0px', '0px', '-100vh'], { clamp: true })
  const bodyY  = useTransform(smoothFrame, [156, 174, 202, 220], ['140px', '0px', '0px', '-100vh'], { clamp: true })
  const statsY = useTransform(smoothFrame, [160, 178, 200, 218], ['170px', '0px', '0px', '-100vh'], { clamp: true })

  // Opacity: fade in / fade out
  const labelOp = useTransform(smoothFrame, [150, 166, 208, 224], [0, 1, 1, 0], { clamp: true })
  const headOp  = useTransform(smoothFrame, [153, 169, 206, 222], [0, 1, 1, 0], { clamp: true })
  const bodyOp  = useTransform(smoothFrame, [156, 172, 204, 220], [0, 1, 1, 0], { clamp: true })
  const statsOp = useTransform(smoothFrame, [160, 176, 202, 218], [0, 1, 1, 0], { clamp: true })

  // Visibility gate
  const opacity = getSectionOpacity('fleet', currentFrame)
  if (opacity === 0) return null

  const lineW = opacity * 40

  return (
    <section
      id="our-fleet"
      aria-label="Our Fleet"
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center overflow-hidden"
    >
      {/* Section label + rule */}
      <motion.div
        className="flex items-center justify-center gap-3 mb-7"
        style={{ y: labelY, opacity: labelOp }}
      >
        <div style={{ width: lineW / 2, height: 1, background: '#C9B99A', flexShrink: 0 }} />
        <p className="text-[10px] tracking-[0.6em] uppercase text-[#C9B99A] font-light whitespace-nowrap">
          02 — Our Fleet
        </p>
        <div style={{ width: lineW / 2, height: 1, background: '#C9B99A', flexShrink: 0 }} />
      </motion.div>

      {/* Headline */}
      <motion.h2
        className="font-zalando text-3xl md:text-[3.2rem] font-extrabold leading-[1.1] text-[#F4F0E4] mb-7 max-w-2xl"
        style={{ y: headY, opacity: headOp }}
      >
        Steel. Scale. Sovereignty.
      </motion.h2>

      {/* Body */}
      <motion.p
        className="font-zalando text-base md:text-xl lg:text-2xl text-[#F4F0E4] leading-[1.7] font-bold max-w-sm md:max-w-3xl lg:max-w-4xl mb-10"
        style={{ y: bodyY, opacity: bodyOp }}
      >
        Royal Asia Shipping provides comprehensive logistics solutions
        in private operation — 150+ vessels spanning four vessel classes,
        purpose-matched to every trade lane and cargo type across the globe.
      </motion.p>

      {/* Vessel type grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mb-10 text-left"
        style={{ y: bodyY, opacity: bodyOp }}
      >
        {VESSEL_TYPES.map((v) => (
          <div key={v.num} className="flex flex-col gap-1">
            <p className="text-[9px] tracking-[0.35em] text-[#C9B99A] font-light mb-1">{v.num}</p>
            <p className="text-[11px] font-semibold text-white tracking-wide uppercase mb-1">{v.title}</p>
            <p className="text-[10px] text-white/80 leading-[1.7] tracking-wide font-light">{v.body}</p>
          </div>
        ))}
      </motion.div>

      {/* Stats row */}
      <motion.div
        className="flex gap-10 mt-2"
        style={{ y: statsY, opacity: statsOp }}
      >
        {FLEET_STATS.map(({ val, label }) => (
          <div key={label} className="flex flex-col items-center">
            <p className="text-2xl text-white font-bold tabular-nums">{val}</p>
            <p className="text-[10px] tracking-[0.22em] text-white/100 uppercase mt-1 font-bold">
              {label}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
