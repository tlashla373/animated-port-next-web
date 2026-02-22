'use client'

import { useState, useEffect } from 'react'
import { getLenis } from '@/providers/LenisProvider'

// Frame index to scroll TO for each section.
// We use start + FADE_BUFFER + 1 (=11) so the previous section has
// completely faded out before the new section text fully appears.
// FADE_BUFFER = 10 (defined in lib/frame-map.ts)
const SECTION_FRAMES: Record<string, number> = {
  '#home':        0,
  '#about':       100,   // About starts frame 75
  '#fleet':       160,   // Fleet starts frame 150
  '#network':     236,   // Global starts frame 225
  '#advantages-seq': 300, // Advantages sequence frames 300–344
}

/**
 * Compute the exact window.scrollY needed to reach a given frame.
 * Reads container dimensions at click-time so it's always accurate.
 */
function getScrollYForFrame(frame: number): number {
  const container = document.getElementById('master-scroll')
  if (!container) return 0
  // scrollable distance = total container height minus one viewport
  const scrollable = container.offsetHeight - window.innerHeight
  return Math.round((frame / 299) * scrollable)
}

/**
 * Scroll to a nav section. Reads getLenis() at call-time — never a stale
 * closure — so it always uses the live Lenis instance.
 */
function navScrollTo(href: string) {
  const lenis = getLenis()

  // Contact scrolls to the DOM element (outside the scroll scene)
  if (href === '#contact') {
    const el = document.getElementById('contact')
    if (!el) return
    const targetY = el.getBoundingClientRect().top + window.scrollY
    if (lenis) {
      lenis.scrollTo(targetY, { duration: 1.6 })
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' })
    }
    return
  }

  // Advantages: scroll the canvas to frame 300 — the transition overlay
  // will auto-scroll to the standalone #advantages section at frame ~320
  if (href === '#advantages') {
    const targetY = getScrollYForFrame(300)
    if (lenis) {
      lenis.scrollTo(targetY, { duration: 1.6 })
    } else {
      window.scrollTo({ top: targetY })
    }
    return
  }

  const frame   = SECTION_FRAMES[href] ?? 0
  const targetY = getScrollYForFrame(frame)

  if (lenis) {
    lenis.scrollTo(targetY, { duration: 1.6 })
  } else {
    window.scrollTo({ top: targetY })
  }
}

const NAV_LINKS = [
  { label: 'Home',        href: '#home'        },
  { label: 'About',       href: '#about'       },
  { label: 'Our Fleet',   href: '#fleet'       },
  { label: 'Network',     href: '#network'     },
  { label: 'Advantages',  href: '#advantages'  },
  { label: 'Contact',     href: '#contact'     },
]

export default function Navbar() {
  // Hide the navbar until images finish loading (same moment HeroLogo appears)
  const [siteLoaded, setSiteLoaded] = useState(false)
  useEffect(() => {
    function onLoaded() { setSiteLoaded(true) }
    window.addEventListener('site-loaded', onLoaded)
    return () => window.removeEventListener('site-loaded', onLoaded)
  }, [])

  // Track current frame from scroll so the wordmark can crossfade with HeroLogo
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    function onScroll() {
      const el = document.getElementById('master-scroll')
      if (!el) return
      const scrollable = el.offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      const progress = Math.max(0, Math.min(1, window.scrollY / scrollable))
      setFrame(Math.round(progress * 299))
    }
    onScroll() // initialise immediately
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Detect when the light Advantages section is visible — switch nav to dark text
  const [isLight, setIsLight] = useState(false)
  useEffect(() => {
    const el = document.getElementById('advantages')
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setIsLight(entry.isIntersecting),
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Wordmark fades IN as HeroLogo fades out (crossfade window: frames 50•68)
  const wordmarkOpacity = Math.min(1, Math.max(0, (frame - 50) / 18))

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] bg-transparent transition-opacity duration-500"
      style={{ opacity: siteLoaded ? 1 : 0, pointerEvents: siteLoaded ? 'auto' : 'none' }}
    >
      <div className="relative flex items-center justify-between px-10 md:px-16 h-16 md:h-20">

        {/* ── Left: Home + About + Our Fleet ──────────────────────────── */}
        <div className="hidden md:flex items-center gap-10">
          <NavBtn light={isLight} onClick={() => navScrollTo('#home')}>Home</NavBtn>
          <NavBtn light={isLight} onClick={() => navScrollTo('#about')}>About</NavBtn>
          <NavBtn light={isLight} onClick={() => navScrollTo('#fleet')}>Our Fleet</NavBtn>
        </div>

        {/* ── Centre: Wordmark (crossfades in as HeroLogo arrives) ──────── */}
        <button
          onClick={() => navScrollTo('#home')}
          style={{ opacity: wordmarkOpacity, transition: 'opacity 0.08s linear' }}
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center leading-none select-none cursor-pointer"
          aria-label="Port Authority — scroll to top"
        >
          <span className={`text-[10px] tracking-[0.52em] uppercase font-light transition-colors duration-300 ${isLight ? 'text-[#8B7355]' : 'text-[#C9B99A]'}`}>
            Port
          </span>
          <span className={`text-[17px] md:text-[19px] tracking-[0.38em] uppercase font-light -mt-0.5 transition-colors duration-300 ${isLight ? 'text-[#1a1a1a]' : 'text-white'}`}>
            Authority
          </span>
        </button>

        {/* ── Right: Network + Advantages + Contact ────────────────────── */}
        <div className="hidden md:flex items-center gap-10">
          <NavBtn light={isLight} onClick={() => navScrollTo('#network')}>Network</NavBtn>
          <NavBtn light={isLight} onClick={() => navScrollTo('#advantages')}>Advantages</NavBtn>
          <NavBtn light={isLight} onClick={() => navScrollTo('#contact')}>Contact</NavBtn>
        </div>

        {/* ── Mobile: hamburger ─────────────────────────────────────────── */}
        <div className="flex md:hidden ml-auto">
          <MobileMenu links={NAV_LINKS} light={isLight} />
        </div>
      </div>
    </nav>
  )
}

function NavBtn({
  onClick,
  children,
  light = false,
}: {
  onClick: () => void
  children: React.ReactNode
  light?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 font-light ${
        light
          ? 'text-[#1a1a1a] hover:text-[#1a1a1a]/40'
          : 'text-white/100 hover:text-white/50'
      }`}
    >
      {children}
    </button>
  )
}

function MobileMenu({
  links,
  light = false,
}: {
  links: { label: string; href: string }[]
  light?: boolean
}) {
  const [open, setOpen] = useState(false)

  function handleClick(href: string) {
    setOpen(false)
    navScrollTo(href)
  }

  const barColor = light ? 'bg-[#1a1a1a]' : 'bg-white'

  return (
    <>
      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="flex flex-col gap-[5px] p-1"
      >
        <span className={`block h-px w-5 ${barColor} transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
        <span className={`block h-px w-5 ${barColor} transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
        <span className={`block h-px w-5 ${barColor} transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#050505]/95 backdrop-blur-md border-t border-white/5 flex flex-col items-center gap-8 py-10">
          {links.map(({ label, href }) => (
            <NavBtn key={href} onClick={() => handleClick(href)}>
              {label}
            </NavBtn>
          ))}
        </div>
      )}
    </>
  )
}
