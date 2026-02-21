'use client'

import { useState, useEffect, useRef } from 'react'
import { getFramePath, TOTAL_FRAMES } from '@/lib/frame-map'

export interface PreloaderResult {
  images: HTMLImageElement[]
  isLoaded: boolean
  loadProgress: number
}

function isMobile(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 768
}

export function useImagePreloader(): PreloaderResult {
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [loadProgress, setLoadProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  // Track if the effect has been torn down (StrictMode / unmount)
  const cancelledRef = useRef(false)

  useEffect(() => {
    cancelledRef.current = false

    // Mobile skips every other frame → 150 images instead of 300
    const skip = isMobile() ? 2 : 1
    const cache: HTMLImageElement[] = new Array(TOTAL_FRAMES)

    const indices: number[] = []
    for (let i = 0; i < TOTAL_FRAMES; i += skip) indices.push(i)

    const total = indices.length
    let loaded  = 0

    // ── Throttled state flush ─────────────────────────────────────────────────
    // Calling setImages 300 times causes 300 re-renders.
    // Instead, flush at most once every ~100 ms and always on completion.
    let flushTimer: ReturnType<typeof setTimeout> | null = null
    function scheduleFlush(final: boolean) {
      if (final) {
        if (flushTimer) clearTimeout(flushTimer)
        if (cancelledRef.current) return
        setImages([...cache])
        setLoadProgress(1)
        setIsLoaded(true)
        return
      }
      if (!flushTimer) {
        flushTimer = setTimeout(() => {
          flushTimer = null
          if (cancelledRef.current) return
          setImages([...cache])
          setLoadProgress(loaded / total)
        }, 100)
      }
    }

    function loadImage(index: number): Promise<void> {
      return new Promise((resolve) => {
        const img = new Image()
        // Hint to the browser: high priority for first phase, low for rest
        ;(img as HTMLImageElement & { fetchpriority?: string }).fetchpriority =
          index < 30 ? 'high' : 'low'
        img.src = getFramePath(index)
        img.decoding = 'async'

        img.onload = () => {
          cache[index] = img
          loaded++
          const final = loaded === total
          scheduleFlush(final)
          resolve()
        }

        img.onerror = () => {
          loaded++
          const final = loaded === total
          scheduleFlush(final)
          resolve()
        }
      })
    }

    // ── Phase 1: hero frames in parallel (not sequential) ─────────────────────
    // Load the first 30 frames all at once — browser can pipeline them.
    const heroEnd    = Math.min(30, indices.length)
    const heroFrames = indices.slice(0, heroEnd)
    const rest       = indices.slice(heroEnd)

    // ── Phase 2: remaining in parallel batches of 20 ──────────────────────────
    async function run() {
      // Hero frames: all in parallel
      await Promise.all(heroFrames.map(loadImage))

      // Remaining frames: batches of 20 for controlled network pressure
      const BATCH = 20
      for (let b = 0; b < rest.length; b += BATCH) {
        if (cancelledRef.current) break
        await Promise.all(rest.slice(b, b + BATCH).map(loadImage))
      }
    }

    run()

    return () => {
      cancelledRef.current = true
      if (flushTimer) clearTimeout(flushTimer)
    }
  }, [])

  return { images, isLoaded, loadProgress }
}
