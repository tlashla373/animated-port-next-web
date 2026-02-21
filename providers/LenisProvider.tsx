'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import Lenis from 'lenis'

// Module-level singleton — always holds the live instance regardless of
// React render cycles. Safe to read outside hooks (e.g. inside click handlers).
let _lenis: Lenis | null = null
export function getLenis(): Lenis | null { return _lenis }

const LenisContext = createContext<Lenis | null>(null)
export function useLenis() { return useContext(LenisContext) }

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
      infinite: false,
    })

    _lenis = lenisInstance
    setLenis(lenisInstance)

    let rafId: number
    function raf(time: number) {
      lenisInstance.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenisInstance.destroy()
      _lenis = null
      setLenis(null)
    }
  }, [])

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  )
}
