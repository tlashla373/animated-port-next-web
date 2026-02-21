'use client'

const FOOTER_STATS = [
  { val: '92',   label: 'Countries'  },
  { val: '500+', label: 'Terminals'  },
  { val: '24/7', label: 'Operations' },
]

export default function GlobeFooter() {
  return (
    <footer id="contact" className="relative h-screen w-full overflow-hidden bg-[#050505]">  

      {/* ── Video background ─────────────────────────────────────────────── */}
      <video
        src="/globe-loop.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-55"
      />

      {/* ── Gradient veil — top and bottom fade to bg ────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80 pointer-events-none" />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-6 text-center">

        <p className="text-[10px] tracking-[0.45em] uppercase text-[#C9B99A] mb-7 font-light">
          Worldwide Operations
        </p>

        <h2 className="text-4xl md:text-[5rem] font-light leading-[1.1] text-white">
          Wherever You Need to Be.
          <br />
          We Are Already There.
        </h2>

        {/* Stats */}
        <div className="flex gap-14 md:gap-20 mt-14">
          {FOOTER_STATS.map(({ val, label }) => (
            <div key={label} className="text-center">
              <p className="text-4xl font-light text-white tabular-nums">{val}</p>
              <p className="text-[10px] tracking-[0.25em] text-white/35 uppercase mt-2 font-light">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer bar ────────────────────────────────────────────────────── */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-between px-10 md:px-16 text-white/20 text-[10px] tracking-[0.3em] uppercase font-light">
        <span>© 2026 Port Authority</span>
        <span>Private Aviation Group</span>
      </div>
    </footer>
  )
}
