'use client'

import { getSectionOpacity } from '@/lib/frame-map'

interface Props {
  currentFrame: number
}

export default function HeroContent({ currentFrame }: Props) {
  const opacity = getSectionOpacity('hero', currentFrame)

  if (opacity === 0) return null

  const blur = opacity < 1 ? `blur(${(1 - opacity) * 6}px)` : 'blur(0px)'
  const y    = (1 - opacity) * 28

  return (
    <section
      aria-label="Hero — Port Authority Private Aviation"
      style={{
        opacity,
        filter:    blur,
        transform: `translateY(${y}px)`,
      }}
      className="absolute inset-0 flex flex-col justify-end
                 pb-20 pl-10 pr-8
                 md:pl-24 md:pb-28"
    >
      {/* Label */}
      <p
        className="text-[10px] tracking-[0.48em] uppercase text-[#C9B99A] mb-5 font-light"
        style={{ letterSpacing: `${0.3 + (1 - opacity) * 0.2}em` }}
      >
        Port Authority
      </p>

      {/* Headline */}
      <h1 className="text-4xl md:text-[5.5rem] font-light leading-[1.04] text-white max-w-2xl">
        The Sky Is Not a Limit.
        <br />
        It Is Where You Belong.
      </h1>

      {/* Sub-text */}
      <p className="text-sm tracking-widest text-white/55 mt-6 max-w-sm leading-[1.9] font-light">
        Elite private aviation. Uncompromising access.
        <br />
        Designed for those who demand more.
      </p>

      {/* CTA */}
      <button
        className="pointer-events-auto mt-10 text-[10px] tracking-[0.3em] uppercase
                   text-white border-b border-white/25 pb-px w-fit
                   transition-colors duration-500 hover:border-white/70"
        aria-label="Request access to Port Authority private aviation"
      >
        Request Access →
      </button>
    </section>
  )
}
