'use client'

import { getSectionOpacity } from '@/lib/frame-map'

interface Props {
  currentFrame: number
}

const STATS = [
  { val: '6',    label: 'Continents' },
  { val: '92',   label: 'Countries'  },
  { val: '500+', label: 'Terminals'  },
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
          className="text-[10px] tracking-[0.42em] uppercase text-[#C9B99A] font-light whitespace-nowrap"
          style={{ letterSpacing: `${0.3 + (1 - opacity) * 0.2}em` }}
        >
          04 — Global Network
        </p>
        <div style={{ width: lineW, height: 1, background: '#C9B99A', flexShrink: 0 }} />
      </div>

      {/* Headline */}
      <h2 className="text-4xl md:text-[5rem] font-light leading-[1.1] text-white mb-6">
        Every Continent.
        <br />
        Every Runway.
      </h2>

      {/* Body */}
      <p className="text-sm text-white/50 leading-[1.9] tracking-wide font-light max-w-md mb-10">
        From Teterboro to Tōkyō. Geneva to the Gulf. Port Authority operates
        across 6 continents, 92 countries, and 500+ verified private
        terminals — with 24/7 operational control staffed by aviation
        specialists, not call centres.
      </p>

      {/* Stats */}
      <div className="flex gap-12 md:gap-20">
        {STATS.map(({ val, label }) => (
          <div key={label} className="text-center">
            <p className="text-3xl font-light text-white tabular-nums">{val}</p>
            <p className="text-[10px] tracking-[0.25em] text-white/30 uppercase mt-1 font-light">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
