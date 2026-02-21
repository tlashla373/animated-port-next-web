'use client'

import { getSectionOpacity } from '@/lib/frame-map'

interface Props {
  currentFrame: number
}

const PILLARS = [
  {
    num:   '01',
    title: 'Zero-Queue Departure',
    body:  'Skip every checkpoint. Your aircraft boards the moment you arrive. No terminals. No queues. No compromise.',
  },
  {
    num:   '02',
    title: 'Global Concierge',
    body:  'White-glove ground handling at 180+ private FBOs worldwide. Your team, on the ground, before you land.',
  },
  {
    num:   '03',
    title: 'Adaptive Fleet',
    body:  'Light jets to ultra-long-range heavies. Right-sized to every mission, every passenger count, every runway.',
  },
  {
    num:   '04',
    title: 'Absolute Discretion',
    body:  'Your itinerary, your manifest, your terms. Always. Zero third-party data sharing. Full confidentiality protocols.',
  },
]

export default function AdvantagesContent({ currentFrame }: Props) {
  const opacity = getSectionOpacity('advantages', currentFrame)

  if (opacity === 0) return null

  const blur  = opacity < 1 ? `blur(${(1 - opacity) * 6}px)` : 'blur(0px)'
  const lineW = opacity * 40

  return (
    <section
      aria-label="Advantages"
      style={{ opacity, filter: blur }}
      className="absolute inset-0 flex flex-col justify-center items-end
                 pr-10 md:pr-24"
    >
      {/* Section label + rule */}
      <div className="flex items-center gap-3 mb-8 self-end">
        <p
          className="text-[10px] tracking-[0.42em] uppercase text-[#C9B99A] font-light whitespace-nowrap"
          style={{ letterSpacing: `${0.3 + (1 - opacity) * 0.2}em` }}
        >
          02 — Advantages
        </p>
        <div
          style={{ width: lineW, height: 1, background: '#C9B99A', flexShrink: 0 }}
        />
      </div>

      {/* Pillar grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-md text-right">
        {PILLARS.map((p, i) => (
          <div
            key={p.num}
            style={{
              opacity:   Math.max(0, opacity - i * 0.05),
              transform: `translateY(${(1 - opacity) * (12 + i * 4)}px)`,
            }}
          >
            <p className="text-[10px] tracking-[0.35em] text-[#C9B99A] mb-2 font-light">
              {p.num}
            </p>
            <p className="text-sm font-light text-white mb-2 tracking-wide">
              {p.title}
            </p>
            <p className="text-xs text-white/45 leading-[1.85] tracking-wide font-light">
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
