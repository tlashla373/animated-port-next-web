'use client'

import { useEffect, useRef } from 'react'

const FOOTER_STATS = [
  { val: '20+',  label: 'Years'       },
  { val: '4',    label: 'Services'    },
  { val: '24/7', label: 'Operations'  },
]

export default function GlobeFooter() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.4
  }, [])

  return (
    <footer id="contact" className="relative h-screen w-full overflow-hidden bg-[#050505]">  

      {/* ── Video background ─────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        src="/globe-loop.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-55"
      />

      {/* ── Gradient veil — top and bottom fade to bg ────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-t via-transparent to-[#050505]/80 pointer-events-none" />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-6 text-center">

        <p className="text-[10px] tracking-[0.45em] uppercase text-[#C9B99A] mb-7 font-light">
          Get In Touch
        </p>

        <h2 className="text-4xl md:text-[5rem] font-light leading-[1.1] text-white">
          Colombo to Anywhere.
          <br />
          We Move Your World.
        </h2>

        {/* Stats */}
        <div className="flex gap-14 md:gap-20 mt-14">
          {FOOTER_STATS.map(({ val, label }) => (
            <div key={label} className="text-center">
              <p className="text-4xl font-light text-white tabular-nums">{val}</p>
              <p className="text-[10px] tracking-[0.25em] text-white/80 uppercase mt-2 font-light">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Contact details */}
        <div className="mt-12 flex flex-col items-center gap-2 text-white/80 text-[11px] tracking-widest font-light">
          <p>No. 200 George R De Silva Mawatha, Colombo 13</p>
          <p>+94 11 239 5030 &nbsp;·&nbsp; +94 11 239 5922 &nbsp;·&nbsp; +94 71 414 1734</p>
          <p>sales1@royalasiashipping.com</p>
          <p className="text-white/80 text-[10px] mt-1">Mon – Fri &nbsp;08:30 – 17:30 &nbsp;·&nbsp; Sat &nbsp;08:30 – 13:30</p>
        </div>
      </div>

      {/* ── Footer bar ────────────────────────────────────────────────────── */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-between px-10 md:px-16 text-white/80 text-[10px] tracking-[0.3em] uppercase font-light">
        <span>© 2026 Royal Asia Shipping Co. (Pvt) Ltd</span>
        <span>Colombo, Sri Lanka</span>
      </div>
    </footer>
  )
}
