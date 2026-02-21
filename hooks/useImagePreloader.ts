'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    // On mobile, load every 2nd frame to halve the payload
    const skip  = isMobile() ? 2 : 1
    const cache: HTMLImageElement[] = new Array(TOTAL_FRAMES)

    // Build the list of indices to load
    const indices: number[] = []
    for (let i = 0; i < TOTAL_FRAMES; i += skip) indices.push(i)

    const total  = indices.length
    let   loaded = 0

    function loadImage(index: number): Promise<void> {
      return new Promise((resolve) => {
        const img = new Image()
        img.src = getFramePath(index)

        img.onload = () => {
          cache[index] = img
          loaded++

          // Snapshot the array so React sees a new reference
          setLoadProgress(loaded / total)
          setImages([...cache])

          if (loaded === total) setIsLoaded(true)
          resolve()
        }

        img.onerror = () => {
          // Silently skip bad frames; canvas will hold previous frame
          loaded++
          setLoadProgress(loaded / total)
          if (loaded === total) setIsLoaded(true)
          resolve()
        }
      })
    }

    // Phase 1: first 30 frames sequential → Hero is visible immediately
    const priority = indices.slice(0, Math.min(30, indices.length))
    // Phase 2: remaining in parallel batches of 10
    const rest     = indices.slice(Math.min(30, indices.length))

    async function run() {
      for (const i of priority) {
        await loadImage(i)
      }
      for (let b = 0; b < rest.length; b += 10) {
        await Promise.all(rest.slice(b, b + 10).map(loadImage))
      }
    }

    run()
  }, [])

  return { images, isLoaded, loadProgress }
}
