'use client'

import { useState, useEffect, type RefObject } from 'react'

/**
 * Returns a normalised scroll progress value [0, 1] for the given container
 * element. 0 = top of container aligned with viewport top.
 *           1 = bottom of container aligned with viewport bottom.
 *
 * Works with Lenis (which still fires native scroll events on window).
 */
export function useScrollProgress(containerRef: RefObject<HTMLElement>): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function update() {
      if (!container) return
      const rect             = container.getBoundingClientRect()
      const scrollableHeight = container.offsetHeight - window.innerHeight
      // rect.top is negative once we've scrolled past the top of the container
      const scrolled = -rect.top
      const raw      = scrolled / scrollableHeight
      setProgress(Math.min(1, Math.max(0, raw)))
    }

    window.addEventListener('scroll', update, { passive: true })
    update() // run once on mount

    return () => window.removeEventListener('scroll', update)
  }, [containerRef])

  return progress
}
