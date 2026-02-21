'use client'

import { useRef, useEffect } from 'react'

interface CanvasSequenceProps {
  images: HTMLImageElement[]
  currentFrame: number
}

export default function CanvasSequence({ images, currentFrame }: CanvasSequenceProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const prevFrameRef = useRef<number>(-1)
  const sizeRef      = useRef({ w: 0, h: 0, dpr: 1 })

  // ── Set canvas physical size (with DPR) on mount + resize ─────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function applySize() {
      const canvas = canvasRef.current
      if (!canvas) return
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        window.innerWidth < 768 ? 1 : 2
      )
      const w = window.innerWidth
      const h = window.innerHeight

      canvas.width        = w * dpr
      canvas.height       = h * dpr
      canvas.style.width  = w + 'px'
      canvas.style.height = h + 'px'

      sizeRef.current   = { w: w * dpr, h: h * dpr, dpr }
      prevFrameRef.current = -1 // invalidate so current frame is redrawn
    }

    applySize()

    let timer: ReturnType<typeof setTimeout>
    function onResize() {
      clearTimeout(timer)
      timer = setTimeout(applySize, 200)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // ── RAF render loop ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // ctx is confirmed non-null here; use a stable ref inside the closure
    const context = ctx

    let rafId: number

    function render() {
      if (prevFrameRef.current !== currentFrame) {
        const img = images[currentFrame]
        if (img && img.complete && img.naturalWidth > 0) {
          const { w: cw, h: ch } = sizeRef.current

          // cover-fit: scale to fill, centre-aligned
          const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
          const dx    = (cw - img.naturalWidth  * scale) / 2
          const dy    = (ch - img.naturalHeight * scale) / 2

          context.clearRect(0, 0, cw, ch)
          context.imageSmoothingEnabled = true
          context.imageSmoothingQuality = window.innerWidth < 768 ? 'medium' : 'high'
          context.drawImage(img, dx, dy, img.naturalWidth * scale, img.naturalHeight * scale)

          prevFrameRef.current = currentFrame
        }
      }
      rafId = requestAnimationFrame(render)
    }

    rafId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(rafId)
  }, [images, currentFrame])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Cinematic sequence — luxury private jet in flight"
      className="absolute inset-0"
    />
  )
}
