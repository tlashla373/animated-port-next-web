'use client'

import { useState } from 'react'
import Image from 'next/image'

const ADVANTAGES = [
  {
    title: 'Global Route Coverage',
    body:  'Our vessels operate on 45+ major trade lanes connecting every deep-water port across six continents. Whatever the destination, Port Authority has a scheduled or chartered route to match.',
    image: '/advantage/img_benefits-2.webp',
  },
  {
    title: '24/7 Port Operations',
    body:  'Round-the-clock operational control means your cargo never waits for business hours. Our port teams manage berthing, loading, documentation, and customs clearance at any hour, in any time zone.',
    image: '/advantage/img_benefit-3.webp',
  },
  {
    title: 'Secure Cargo Handling',
    body:  'ISO-certified handling protocols, real-time GPS tracking, and dedicated cargo officers on every voyage. Your freight arrives in exactly the condition it departed.',
    image: '/advantage/img_benefits-3.webp',
  },
  {
    title: 'Fleet Versatility',
    body:  'From Handysize bulk carriers to VLCC tankers and heavy-lift multi-purpose vessels — we right-size every shipment. No cargo is too large, too complex, or too specialised.',
    image: '/advantage/img_benefit-4.webp',
  },
]

export default function AdvantagesSection() {
  const [open, setOpen] = useState<number>(0)

  return (
    <section
      id="advantages"
      className="relative flex flex-col md:flex-row min-h-screen bg-[#f3ecde] overflow-hidden"
    >
      {/* ── Left: label + accordion ───────────────────────────────────────── */}
      <div className="flex flex-col w-full md:w-[52%] px-10 md:px-14 xl:px-20 pt-28 pb-16 md:py-28 z-10">

        {/* Top label */}
        <p className="text-[9px] tracking-[0.55em] uppercase text-[#5a4a38] font-light mb-10">
          A Better Way to Ship
        </p>

        {/* Accordion */}
        <div className="flex flex-col flex-1">
          {ADVANTAGES.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.title} className="border-t border-[#1a1a1a]/12">
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex items-center justify-between w-full py-5 text-left group"
                >
                  <span
                    className={`text-[1.65rem] md:text-[2rem] leading-tight font-light tracking-tight transition-colors duration-300 ${
                      isOpen ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/40 group-hover:text-[#1a1a1a]/80'
                    }`}
                  >
                    {item.title}
                  </span>

                  {/* +/− icon — plain text, no border circle */}
                  <span className="ml-4 flex-shrink-0 text-[1.4rem] font-extralight text-[#1a1a1a]/50 leading-none">
                    {isOpen ? '\u2212' : '+'}
                  </span>
                </button>

                {/* Body — slides open below the row header */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-[13px] text-[#1a1a1a]/60 leading-[1.9] tracking-wide font-light max-w-[360px] pb-7">
                    {item.body}
                  </p>
                </div>
              </div>
            )
          })}
          {/* Bottom border */}
          <div className="border-t border-[#1a1a1a]/12" />
        </div>
      </div>

      {/* ── Right: image + CTA ───────────────────────────────────────────── */}
      <div className="relative w-full md:w-[48%] h-80 md:h-auto overflow-hidden">
        {ADVANTAGES.map((item, i) => (
          <Image
            key={item.image}
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 48vw"
            className={`object-cover transition-opacity duration-700 ${
              open === i ? 'opacity-100' : 'opacity-0'
            }`}
            priority={i === 0}
          />
        ))}

        {/* CTA button — centred at the bottom of the image */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
          <a
            href="#contact"
            onClick={e => {
              e.preventDefault()
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="flex items-center gap-3 bg-white/95 backdrop-blur-sm text-[#1a1a1a]
                       text-[10px] tracking-[0.28em] uppercase font-medium px-7 py-4 rounded-full
                       hover:bg-[#1a1a1a] hover:text-white transition-colors duration-300
                       shadow-lg shadow-black/10"
          >
            Request a Charter
            <span className="text-sm">⚓</span>
          </a>
        </div>
      </div>
    </section>
  )
}
