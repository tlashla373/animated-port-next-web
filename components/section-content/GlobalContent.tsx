'use client'

import { getSectionOpacity } from '@/lib/frame-map'

interface Props {
  currentFrame: number
}

const STATS = [
  { val: '2004', label: 'Est. Colombo' },
  { val: '45+',  label: 'Trade Lanes'  },
  { val: '24/7', label: 'Operations'   },
]

export default function GlobalContent({ currentFrame }: Props) {
  const opacity = getSectionOpacity('global', currentFrame)

  if (opacity === 0) return null

  const blur  = opacity < 1 ? `blur(${(1 - opacity) * 6}px)` : 'blur(0px)'
  const y     = (1 - opacity) * 20
  const lineW = opacity * 30

  return (
    <section
      id="network"
      aria-label="Global Network"
      style={{
        opacity,
        filter:    blur,
        transform: `translateY(${y}px)`,
      }}
      className="absolute inset-0 flex flex-col justify-end items-center
                 pb-20 md:pb-28 text-center px-6"
    >
      {/* Section label with bilateral rules */}
      <div className="flex items-center gap-3 mb-7">
        <div style={{ width: lineW, height: 1, background: '#C9B99A', flexShrink: 0 }} />
        <p
          className="font-zalando text-[10px] tracking-[0.42em] uppercase text-[#ffffff] font-light whitespace-nowrap"
          style={{ letterSpacing: `${0.3 + (1 - opacity) * 0.2}em` }}
        >
          04 — Our Network
        </p>
        <div style={{ width: lineW, height: 1, background: '#C9B99A', flexShrink: 0 }} />
      </div>

      {/* Headline */}
      <h2 className="font-zalando text-4xl md:text-[5rem] font-bold leading-[1.1] text-white mb-6">
        Colombo to the World.
        <br />
        Door to Door.
      </h2>

      {/* Body */}
      <p className="font-zalando text-sm text-white/90 leading-[1.9] tracking-wide font-light max-w-md mb-10">
        From our base in Colombo 13 — steps from the Port — Royal Asia Shipping
        connects Sri Lanka to global trade lanes across Asia, the Middle East,
        Europe and beyond, with 24/7 operational control and licensed clearing agents
        on hand at every step.
      </p>

      {/* Stats */}
      <div className="flex gap-12 md:gap-20">
        {STATS.map(({ val, label }) => (
          <div key={label} className="text-center">
            <p className="font-zalando text-3xl font-semibold text-white tabular-nums">{val}</p>
            <p className="font-zalando text-[10px] tracking-[0.25em] text-white/90 uppercase mt-1 font-light">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
