'use client'

import { useState } from 'react'
import Image from 'next/image'

const ADVANTAGES = [
  {
    title: 'Comprehensive Coverage',
    body:  'From sea freight and air cargo to warehousing and customs clearing — Royal Asia Shipping handles every link in your supply chain under one roof, eliminating handoff delays.',
    image: '/advantage/img_benefits-2.webp',
  },
  {
    title: 'Port Proximity',
    body:  'Our offices at No. 200 George R De Silva Mawatha, Colombo 13 are within walking distance of the Port. Faster berthing coordination, faster clearance, faster delivery.',
    image: '/advantage/img_benefit-3.webp',
  },
  {
    title: 'Expert Professionals',
    body:  'Two decades of experience backed by highly skilled clearing agents, freight specialists and logistics coordinators who manage every shipment with precision and accountability.',
    image: '/advantage/img_benefits-3.webp',
  },
  {
    title: 'Cost-Effective Solutions',
    body:  'We constantly research the best carriers and overseas partners to scrutinise every process, minimise cost and deliver genuine value — not just movement.',
    image: '/advantage/img_benefit-4.webp',
  },
]

export default function AdvantagesSection() {
  const [open, setOpen] = useState<number>(0)

  return (
    <section
      id="advantages"
      className="relative flex flex-col md:flex-row md:items-center md:justify-center min-h-screen bg-[#072841] overflow-hidden px-8 md:px-16 xl:px-24 py-24 gap-10 md:gap-36"
    >
      {/* ── Left: label + accordion ───────────────────────────────────────── */}
      <div className="flex flex-col flex-1 max-w-lg z-10">

        {/* Top label */}
        <p className="text-[9px] tracking-[0.55em] uppercase text-[#7aafd4] font-light mb-10">
          Why Choose Us
        </p>

        {/* Accordion */}
        <div className="flex flex-col flex-1">
          {ADVANTAGES.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.title} className="border-t border-white/15">
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex items-center justify-between w-full py-5 text-left group"
                >
                  <span
                    className={`text-[1.65rem] md:text-[2rem] leading-tight font-light tracking-tight transition-colors duration-300 ${
                      isOpen ? 'text-white' : 'text-white/40 group-hover:text-white/80'
                    }`}
                  >
                    {item.title}
                  </span>

                  {/* +/− icon — plain text, no border circle */}
                  <span className="ml-4 flex-shrink-0 text-[1.4rem] font-extralight text-white/50 leading-none">
                    {isOpen ? '\u2212' : '+'}
                  </span>
                </button>

                {/* Body — slides open below the row header */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-[13px] text-white/60 leading-[1.9] tracking-wide font-light max-w-[360px] pb-7">
                    {item.body}
                  </p>
                </div>
              </div>
            )
          })}
          {/* Bottom border */}
          <div className="border-t border-white/15" />
        </div>
      </div>

      {/* ── Right: image + CTA ───────────────────────────────────────────── */}
      <div className="relative w-full md:w-[520px] h-72 md:h-[560px] overflow-hidden rounded-2xl flex-shrink-0">
        {ADVANTAGES.map((item, i) => (
          <Image
            key={item.image}
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 48vw"
            className={`object-cover object-center transition-opacity duration-700 ${
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
