'use client'

import { useEffect, useRef } from 'react'
import { getSectionOpacity } from '@/lib/frame-map'

interface Props {
  currentFrame: number
}

export default function AdvantagesTransition({ currentFrame }: Props) {
  const scrolledRef = useRef(false)

  const opacity = getSectionOpacity('advantages', currentFrame)

  useEffect(() => {
    if (currentFrame >= 320 && !scrolledRef.current) {
      scrolledRef.current = true
      const el = document.getElementById('advantages')
      if (!el) return
      const lenis = (
        window as unknown as {
          __lenis?: { scrollTo: (el: Element, opts: object) => void }
        }
      ).__lenis
      if (lenis) {
        lenis.scrollTo(el, { offset: 0, duration: 1.2 })
      } else {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
    if (currentFrame < 300) {
      scrolledRef.current = false
    }
  }, [currentFrame])

  if (opacity === 0) return null

  const dark  = 1 - opacity
  const cream = opacity

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `linear-gradient(to bottom, rgba(5,5,5,${dark}) 0%, rgba(30,20,12,${dark * 0.8}) 25%, rgba(242,237,228,${cream * 0.85}) 90%)`,
        opacity,
      }}
    />
  )
}
