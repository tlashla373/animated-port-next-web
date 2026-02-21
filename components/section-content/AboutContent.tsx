'use client'

import { getSectionOpacity } from '@/lib/frame-map'

interface Props {
  currentFrame: number
}

const STATS = [
  { val: '18+',  label: 'Years Operating' },
  { val: '340+', label: 'Aircraft'         },
  { val: '98%',  label: 'On-Time Rate'     },
]

export default function AboutContent({ currentFrame }: Props) {
  const opacity = getSectionOpacity('about', currentFrame)

  if (opacity === 0) return null

  const blur  = opacity < 1 ? `blur(${(1 - opacity) * 6}px)` : 'blur(0px)'
  const y     = (1 - opacity) * 20
  const lineW = opacity * 40 // animated width of the accent rule

  return (
    <section
      aria-label="About Port Authority"
      style={{
        opacity,
        filter:    blur,
        transform: `translateY(${y}px)`,
      }}
      className="absolute inset-0 flex flex-col justify-center
                 pl-10 md:pl-24 max-w-xl"
    >
      {/* Section label + rule */}
      <div className="flex items-center gap-3 mb-7">
        <div
          style={{ width: lineW, height: 1, background: '#C9B99A', flexShrink: 0 }}
        />
        <p
          className="text-[10px] tracking-[0.42em] uppercase text-[#C9B99A] font-light whitespace-nowrap"
          style={{ letterSpacing: `${0.3 + (1 - opacity) * 0.2}em` }}
        >
          01 — About
        </p>
      </div>

      {/* Headline */}
      <h2 className="text-3xl md:text-[3.2rem] font-light leading-[1.1] text-white mb-7">
        A Standard Above
        <br />
        Standard.
      </h2>

      {/* Body */}
      <p className="text-sm text-white/55 leading-[1.9] tracking-wide font-light max-w-sm">
        Port Authority was built for the sovereign traveller — the executive
        who views time as currency and refuses to spend it in terminals. We
        operate a privately managed fleet, handled exclusively by former
        military and commercial aviation professionals with decades of
        precision experience.
      </p>

      {/* Stats row */}
      <div className="flex gap-10 mt-10">
        {STATS.map(({ val, label }) => (
          <div key={label}>
            <p className="text-2xl font-light text-white tabular-nums">{val}</p>
            <p className="text-[10px] tracking-[0.22em] text-white/35 uppercase mt-1 font-light">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
