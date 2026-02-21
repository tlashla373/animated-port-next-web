# PORT AUTHORITY — CINEMATIC SCROLLYTELLING
## Production Implementation Plan
### Version 1.0 | February 2026

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Confirmed Asset Inventory](#2-confirmed-asset-inventory)
3. [Full Architecture Explanation](#3-full-architecture-explanation)
4. [Folder & File Structure](#4-folder--file-structure)
5. [Frame Mapping Table](#5-frame-mapping-table)
6. [Scroll Progress Logic](#6-scroll-progress-logic)
7. [Component Specifications](#7-component-specifications)
8. [Hook Specifications](#8-hook-specifications)
9. [Library & Config Files](#9-library--config-files)
10. [Performance Strategy](#10-performance-strategy)
11. [Mobile Optimization Plan](#11-mobile-optimization-plan)
12. [Luxury Micro-Interactions](#12-luxury-micro-interactions)
13. [Content Copy](#13-content-copy)
14. [Accessibility Considerations](#14-accessibility-considerations)
15. [SEO Strategy](#15-seo-strategy)
16. [Dependencies & Installation](#16-dependencies--installation)
17. [Step-by-Step Build Order](#17-step-by-step-build-order)
18. [Full Source Code](#18-full-source-code)

---

## 1. PROJECT OVERVIEW

**Site:** Port Authority — Elite Private Aviation  
**Concept:** A single, continuous, canvas-driven scrollytelling page. The user scrolls once through the entire landing experience. Every section (Hero, About, Advantages, Global Network) is revealed purely by advancing through one master image sequence drawn on a `<canvas>` element. No routing. No page breaks. One scroll journey.

**Aesthetic:** Luxury / cinematic / brutalist-minimal  
**Background:** `#050505`  
**Text:** Pure white (`#FFFFFF`)  
**Accent:** Warm platinum (`#C9B99A`)

---

## 2. CONFIRMED ASSET INVENTORY

| Asset | Path | Details |
|---|---|---|
| Image Sequence | `/public/sequence-master/` | 300 frames |
| Frame naming | `ezgif-frame-001.png` → `ezgif-frame-300.png` | 3-digit zero-padded |
| Globe Video | `/public/globe-loop.mp4` | Footer background |

**CRITICAL NOTE FOR CODING AGENT:**  
The frame filename format is: `ezgif-frame-${String(index).padStart(3, '0')}.png`  
Frames are 1-indexed: first frame = `ezgif-frame-001.png`, last = `ezgif-frame-300.png`.  
Total frame count: **300**

---

## 3. FULL ARCHITECTURE EXPLANATION

### 3.1 Mental Model

```
User scrolls ─────────────────────────────────────────────────────────────►
              │
              ▼
     Lenis smooth scroll
              │
              ▼
     useScrollProgress() → scrollY normalized 0 → 1
              │
              ▼
     MasterScrollScene
     ┌─────────────────────────────────────────────────────────────┐
     │  position: sticky, top: 0, height: 100vh                   │
     │                                                             │
     │  ┌──────────────────────────────────────────────────────┐  │
     │  │  CanvasSequence (z-index: 0)                         │  │
     │  │  Draws ezgif-frame-XXX.png on <canvas>               │  │
     │  │  Frame = Math.round(scrollProgress * 299)            │  │
     │  └──────────────────────────────────────────────────────┘  │
     │                                                             │
     │  ┌──────────────────────────────────────────────────────┐  │
     │  │  SectionContent (z-index: 10)                        │  │
     │  │  Absolutely positioned overlay                        │  │
     │  │  Renders: HeroContent, AboutContent,                 │  │
     │  │           AdvantagesContent, GlobalContent           │  │
     │  │  Each fades based on current frame range             │  │
     │  └──────────────────────────────────────────────────────┘  │
     └─────────────────────────────────────────────────────────────┘
              │
              ▼
     GlobeFooter (normal flow, below sticky container)
     Video background: /public/globe-loop.mp4
```

### 3.2 Scroll Container Height

The outer wrapper (non-sticky) controls how long the scroll journey lasts:

```
Scroll Height = 500vh (desktop) | 350vh (mobile)
```

The sticky child (the panel the user "looks through") stays at `100vh` and never moves. Only the canvas content and text overlays change as the user scrolls.

### 3.3 Data Flow

```
Lenis RAF tick
    │
    ▼
window.scrollY
    │
    ▼
useScrollProgress(ref) → progress: number [0, 1]
    │
    ▼
MasterScrollScene receives progress
    │
    ├──► frameIndex = clamp(round(progress * (TOTAL_FRAMES - 1)), 0, 299)
    │
    ├──► CanvasSequence.draw(images[frameIndex])
    │
    └──► sectionVisibility = getSectionForFrame(frameIndex)
             │
             ▼
         HeroContent    opacity     ← frame 1–70
         AboutContent   opacity     ← frame 71–155
         AdvantagesContent opacity  ← frame 156–210
         GlobalContent  opacity     ← frame 211–300
```

### 3.4 Rendering Loop

- A single `requestAnimationFrame` loop runs inside `CanvasSequence`.
- It checks `currentFrame !== prevFrameRef.current` before calling `ctx.drawImage`.
- This ensures the GPU is only hit when the frame changes — zero wasted draws.
- Lenis is synced to this RAF loop via `lenis.on('scroll', ...)`.

---

## 4. FOLDER & FILE STRUCTURE

```
project_07/
│
├── app/
│   ├── layout.tsx                  ← Root layout, Lenis provider, fonts
│   ├── page.tsx                    ← Entry: renders MasterScrollScene + GlobeFooter
│   └── globals.css                 ← Tailwind base + custom CSS vars
│
├── components/
│   ├── MasterScrollScene.tsx       ← Orchestrator: sticky container, scroll wiring
│   ├── CanvasSequence.tsx          ← Canvas draw loop, DPR, frame rendering
│   ├── GlobeFooter.tsx             ← Video footer section
│   └── section-content/
│       ├── SectionContent.tsx      ← Content router: decides which overlay shows
│       ├── HeroContent.tsx         ← Frames 1–70
│       ├── AboutContent.tsx        ← Frames 71–155
│       ├── AdvantagesContent.tsx   ← Frames 156–210
│       └── GlobalContent.tsx       ← Frames 211–300
│
├── hooks/
│   ├── useImagePreloader.ts        ← Preloads all 300 frames, caches in memory
│   └── useScrollProgress.ts        ← Normalizes scrollY to [0, 1] within a ref
│
├── lib/
│   ├── frame-map.ts                ← SECTION_RANGES, getSectionForFrame()
│   └── animation-config.ts         ← Shared Framer Motion variants
│
├── providers/
│   └── LenisProvider.tsx           ← Lenis init, RAF sync, context
│
└── public/
    ├── sequence-master/
    │   ├── ezgif-frame-001.png
    │   └── ... (300 total)
    └── globe-loop.mp4
```

---

## 5. FRAME MAPPING TABLE

Total frames: **300** (indices 0–299 internally, filenames 001–300)

| Section | Start Frame | End Frame | Frame Count | Scroll % Start | Scroll % End | Content |
|---|---|---|---|---|---|---|
| **Hero** | 1 | 70 | 70 | 0% | 23.3% | Tagline, CTA |
| **About** | 71 | 155 | 85 | 23.3% | 51.7% | Brand story, positioning |
| **Advantages** | 156 | 210 | 55 | 51.7% | 70% | 4 service pillars |
| **Global Network** | 211 | 300 | 90 | 70% | 100% | Worldwide presence |

### Fade Transition Zones (overlap buffer = 10 frames each side)

| Transition | Outgoing | Incoming | Buffer Frames |
|---|---|---|---|
| Hero → About | 60–70 | 71–81 | 10 frames |
| About → Advantages | 145–155 | 156–166 | 10 frames |
| Advantages → Global | 200–210 | 211–221 | 10 frames |

Content overlays use these buffers to cross-fade smoothly. The outgoing section begins `opacity: 1 → 0` at frame `end - 10`, the incoming begins `opacity: 0 → 1` at frame `start`.

### Internal Index Convention

```typescript
// File on disk:  ezgif-frame-001.png  → internal index 0
// File on disk:  ezgif-frame-300.png  → internal index 299

function getFramePath(index: number): string {
  // index is 0-based
  return `/sequence-master/ezgif-frame-${String(index + 1).padStart(3, '0')}.png`
}
```

---

## 6. SCROLL PROGRESS LOGIC

### 6.1 Core Formula

```typescript
// Inside useScrollProgress:
const containerTop = ref.current.offsetTop
const containerHeight = ref.current.offsetHeight   // e.g. 500vh scroll space
const viewportHeight = window.innerHeight

// scrollable distance = total container height minus one viewport
const scrollableDistance = containerHeight - viewportHeight

// progress: 0 when top of container hits top of viewport
//           1 when bottom of container hits bottom of viewport
const rawProgress = (scrollY - containerTop) / scrollableDistance
const progress = Math.min(1, Math.max(0, rawProgress))
```

### 6.2 Frame Index Derivation

```typescript
const TOTAL_FRAMES = 300

function progressToFrame(progress: number): number {
  return Math.min(
    TOTAL_FRAMES - 1,
    Math.max(0, Math.round(progress * (TOTAL_FRAMES - 1)))
  )
}
// progress 0.00 → frame 0   (renders ezgif-frame-001.png)
// progress 0.50 → frame 150 (renders ezgif-frame-151.png)
// progress 1.00 → frame 299 (renders ezgif-frame-300.png)
```

### 6.3 Section Visibility Calculation

```typescript
// lib/frame-map.ts
export const SECTION_RANGES = {
  hero:        { start: 0,   end: 69  },   // 0-indexed
  about:       { start: 70,  end: 154 },
  advantages:  { start: 155, end: 209 },
  global:      { start: 210, end: 299 },
} as const

const FADE_BUFFER = 10  // frames of fade on each side

export function getSectionOpacity(
  section: keyof typeof SECTION_RANGES,
  currentFrame: number
): number {
  const { start, end } = SECTION_RANGES[section]

  if (currentFrame < start - FADE_BUFFER || currentFrame > end + FADE_BUFFER) {
    return 0
  }

  // Fade in
  if (currentFrame >= start - FADE_BUFFER && currentFrame < start) {
    return (currentFrame - (start - FADE_BUFFER)) / FADE_BUFFER
  }

  // Full opacity
  if (currentFrame >= start && currentFrame <= end) {
    return 1
  }

  // Fade out
  if (currentFrame > end && currentFrame <= end + FADE_BUFFER) {
    return 1 - (currentFrame - end) / FADE_BUFFER
  }

  return 0
}
```

### 6.4 Lenis Integration Pattern

```typescript
// providers/LenisProvider.tsx
useEffect(() => {
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.8,   // slower = more cinematic
    touchMultiplier: 1.5,
  })

  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)

  return () => lenis.destroy()
}, [])
```

---

## 7. COMPONENT SPECIFICATIONS

---

### 7.1 `MasterScrollScene.tsx`

**Role:** Root orchestrator for the entire scroll experience.

**Responsibilities:**
- Owns the outer scroll-height container (`h-[500vh]`)
- Owns the inner sticky viewport panel (`sticky top-0 h-screen`)
- Calls `useImagePreloader()` and passes `images[]` down
- Calls `useScrollProgress(containerRef)` to get live `progress`
- Derives `currentFrame` from `progress`
- Renders `CanvasSequence` and `SectionContent` as siblings inside sticky panel

**Props:** none (self-contained)

**Key Logic:**
```typescript
const containerRef = useRef<HTMLDivElement>(null)
const { images, isLoaded, loadProgress } = useImagePreloader()
const scrollProgress = useScrollProgress(containerRef)
const currentFrame = progressToFrame(scrollProgress)
```

**JSX Structure:**
```tsx
<div ref={containerRef} className="relative h-[500vh] md:h-[500vh] h-[350vh]">
  <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
    {/* Loading overlay — fades out when isLoaded */}
    <LoadingOverlay progress={loadProgress} isLoaded={isLoaded} />
    {/* Canvas layer */}
    <CanvasSequence images={images} currentFrame={currentFrame} />
    {/* Text overlay layer */}
    <SectionContent currentFrame={currentFrame} />
  </div>
</div>
```

---

### 7.2 `CanvasSequence.tsx`

**Role:** Pure rendering — draws the correct frame onto a `<canvas>`.

**Props:**
```typescript
interface CanvasSequenceProps {
  images: HTMLImageElement[]   // preloaded image cache
  currentFrame: number          // 0–299
}
```

**Rendering Logic:**
```typescript
useEffect(() => {
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1

  // Set canvas physical pixels
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
  ctx.scale(dpr, dpr)
}, [])  // on mount and resize

// RAF render loop
useEffect(() => {
  let rafId: number
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  const prevFrame = { current: -1 }

  function render() {
    if (currentFrame !== prevFrame.current && images[currentFrame]) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const img = images[currentFrame]
      // Cover-fit scaling (like object-cover)
      const scale = Math.max(
        canvas.width / img.naturalWidth,
        canvas.height / img.naturalHeight
      )
      const x = (canvas.width - img.naturalWidth * scale) / 2
      const y = (canvas.height - img.naturalHeight * scale) / 2

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale)

      prevFrame.current = currentFrame
    }
    rafId = requestAnimationFrame(render)
  }

  rafId = requestAnimationFrame(render)
  return () => cancelAnimationFrame(rafId)
}, [images, currentFrame])
```

**Canvas CSS:**
```css
canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
```

**Window Resize Handling:**
```typescript
useEffect(() => {
  const handleResize = debounce(() => {
    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    // force redraw
    prevFrameRef.current = -1
  }, 200)

  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

---

### 7.3 `SectionContent.tsx`

**Role:** Content router — renders all four section overlays simultaneously; each manages its own opacity via `currentFrame`.

**Props:**
```typescript
interface SectionContentProps {
  currentFrame: number
}
```

**JSX:**
```tsx
<div className="absolute inset-0 z-10 pointer-events-none">
  <HeroContent currentFrame={currentFrame} />
  <AboutContent currentFrame={currentFrame} />
  <AdvantagesContent currentFrame={currentFrame} />
  <GlobalContent currentFrame={currentFrame} />
</div>
```

Each child receives `currentFrame` and independently computes its own `opacity` via `getSectionOpacity()`. They all exist in the DOM at once — only their opacity changes. This avoids React mount/unmount jank.

---

### 7.4 `HeroContent.tsx`

**Frame range:** 0–69  
**Position:** Full-screen centred  
**Content:**

```
TAGLINE:   PORT AUTHORITY
HEADLINE:  The Sky Is Not a Limit.
           It Is Where You Belong.
SUBTEXT:   Elite private aviation. Uncompromising access. Designed for those who demand more.
CTA:       Request Access →
```

**Animation:**
```typescript
const opacity = getSectionOpacity('hero', currentFrame)
const yOffset = (1 - opacity) * 24   // subtle rise on entry

return (
  <motion.div
    style={{ opacity, y: yOffset, filter: `blur(${(1 - opacity) * 4}px)` }}
    className="absolute inset-0 flex flex-col justify-end pb-24 pl-16 pr-8 md:pl-24"
  >
    ...
  </motion.div>
)
```

**Typography spec:**
- Label: `text-xs tracking-[0.3em] uppercase text-[#C9B99A] mb-4`
- Headline: `text-5xl md:text-7xl font-light leading-[1.05] text-white`
- Subtext: `text-sm tracking-widest text-white/60 mt-6 max-w-md`
- CTA: `text-xs tracking-[0.25em] uppercase text-white border-b border-white/30 pb-0.5 mt-10 w-fit`

---

### 7.5 `AboutContent.tsx`

**Frame range:** 70–154  
**Position:** Left-aligned, vertically centred  
**Content:**

```
LABEL:     01 — ABOUT
HEADLINE:  A Standard Above
           Standard.
BODY:      Port Authority was built for the sovereign traveller — the executive who
           views time as currency and refuses to spend it in terminals.
           We operate a privately managed network of aircraft, handled by former
           military and commercial aviation professionals.
STAT ROW:  18+ YEARS  |  340+ AIRCRAFT  |  98% ON-TIME RATE
```

**Position class:** `justify-center pl-16 md:pl-24`

---

### 7.6 `AdvantagesContent.tsx`

**Frame range:** 155–209  
**Position:** Right-aligned grid  
**Content:**

Four pillars displayed as a 2×2 grid (desktop) or vertical stack (mobile):

```
01 — ZERO-QUEUE DEPARTURE
     Skip every checkpoint. Your aircraft boards when you arrive.

02 — GLOBAL CONCIERGE
     White-glove ground handling at 180+ private terminals worldwide.

03 — ADAPTIVE FLEET
     Light jets to ultra-long-range heavy jets. Fleet matched to mission.

04 — ABSOLUTE DISCRETION
     Your itinerary, your manifest, your terms. Always.
```

**Position class:** `justify-center pr-16 md:pr-24 items-end`

Each pillar animates with a staggered reveal (delay: index * 0.08s).

---

### 7.7 `GlobalContent.tsx`

**Frame range:** 210–299  
**Position:** Bottom-centred  
**Content:**

```
LABEL:     04 — GLOBAL NETWORK
HEADLINE:  Every Continent.
           Every Runway.
BODY:      From Teterboro to Tōkyō. Geneva to the Gulf.
           Port Authority operates across 6 continents, 92 countries, and
           500+ verified private terminals.
STATS:     6  CONTINENTS  |  92  COUNTRIES  |  500+  TERMINALS
```

**Position class:** `justify-end pb-24 items-center text-center`

---

### 7.8 `GlobeFooter.tsx`

**Role:** Below the sticky scroll container — normal document flow.

```tsx
export default function GlobeFooter() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050505]">
      {/* Video background */}
      <video
        src="/globe-loop.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      {/* Gradient veil */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
        <p className="text-xs tracking-[0.4em] uppercase text-[#C9B99A] mb-6">
          Worldwide Operations
        </p>
        <h2 className="text-4xl md:text-6xl font-light tracking-tight text-center">
          Wherever You Need to Be.<br />
          We Are Already There.
        </h2>
        <div className="mt-12 flex gap-16 text-center">
          <div>
            <p className="text-4xl font-light">92</p>
            <p className="text-xs tracking-widest text-white/40 mt-1">Countries</p>
          </div>
          <div>
            <p className="text-4xl font-light">500+</p>
            <p className="text-xs tracking-widest text-white/40 mt-1">Terminals</p>
          </div>
          <div>
            <p className="text-4xl font-light">24/7</p>
            <p className="text-xs tracking-widest text-white/40 mt-1">Operations</p>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-between px-16 text-white/20 text-xs tracking-widest">
        <span>© 2026 PORT AUTHORITY</span>
        <span>PRIVATE AVIATION GROUP</span>
      </div>
    </section>
  )
}
```

---

## 8. HOOK SPECIFICATIONS

---

### 8.1 `useImagePreloader.ts`

**Purpose:** Fetch all 300 PNG frames, cache as `HTMLImageElement` in memory, report load progress.

**Return type:**
```typescript
interface PreloaderResult {
  images: HTMLImageElement[]   // sparse array, filled as images load
  isLoaded: boolean            // true when all 300 are loaded
  loadProgress: number         // 0–1
}
```

**Full implementation logic:**

```typescript
'use client'
import { useState, useEffect, useRef } from 'react'

const TOTAL_FRAMES = 300
const MOBILE_SKIP = 2  // on mobile, load every 2nd frame (150 images)

function getFramePath(index: number): string {
  // index is 0-based; filename is 1-based 3-digit padded
  return `/sequence-master/ezgif-frame-${String(index + 1).padStart(3, '0')}.png`
}

function isMobile(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 768
}

export function useImagePreloader(): PreloaderResult {
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [loadProgress, setLoadProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const imageCache = useRef<HTMLImageElement[]>([])

  useEffect(() => {
    const mobile = isMobile()
    const skip = mobile ? MOBILE_SKIP : 1
    const indices = Array.from(
      { length: Math.ceil(TOTAL_FRAMES / skip) },
      (_, i) => i * skip
    )
    const total = indices.length
    let loaded = 0

    // Prioritise first 30 frames so Hero shows immediately
    const priority = indices.slice(0, 30)
    const rest = indices.slice(30)

    function loadImage(index: number): Promise<void> {
      return new Promise((resolve) => {
        const img = new Image()
        img.src = getFramePath(index)
        img.onload = () => {
          imageCache.current[index] = img
          loaded++
          setLoadProgress(loaded / total)
          if (loaded === total) setIsLoaded(true)
          setImages([...imageCache.current])
          resolve()
        }
        img.onerror = () => {
          loaded++
          resolve()  // silent fail — canvas will show prev frame
        }
      })
    }

    // Load priority frames first (sequential for guaranteed order)
    async function run() {
      for (const i of priority) await loadImage(i)
      // Load rest in parallel batches of 10
      for (let b = 0; b < rest.length; b += 10) {
        await Promise.all(rest.slice(b, b + 10).map(loadImage))
      }
    }

    run()
  }, [])

  return { images, isLoaded, loadProgress }
}
```

**Mobile fallback strategy:**  
When `skip = 2`, only even-indexed frames are loaded. The canvas frame resolver should clamp to the nearest loaded frame:

```typescript
function getNearestLoadedFrame(
  target: number,
  images: HTMLImageElement[],
  skip: number
): number {
  const snapped = Math.round(target / skip) * skip
  return Math.min(snapped, TOTAL_FRAMES - 1)
}
```

---

### 8.2 `useScrollProgress.ts`

**Purpose:** Watch `window.scrollY` via Lenis and compute normalized progress [0, 1] for the sticky container.

```typescript
'use client'
import { useState, useEffect, RefObject } from 'react'

export function useScrollProgress(
  containerRef: RefObject<HTMLElement>
): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function update() {
      const rect = container.getBoundingClientRect()
      const scrollableHeight = container.offsetHeight - window.innerHeight
      const scrolled = -rect.top  // how far we've scrolled into the container

      const raw = scrolled / scrollableHeight
      setProgress(Math.min(1, Math.max(0, raw)))
    }

    // Lenis fires 'scroll' on window; plain scroll fallback
    window.addEventListener('scroll', update, { passive: true })
    update()  // initial call

    return () => window.removeEventListener('scroll', update)
  }, [containerRef])

  return progress
}
```

**Note:** If Lenis context is available, subscribe via `lenis.on('scroll', update)` instead.

---

## 9. LIBRARY & CONFIG FILES

---

### 9.1 `lib/frame-map.ts`

```typescript
export const TOTAL_FRAMES = 300

// 0-indexed frame ranges
export const SECTION_RANGES = {
  hero:        { start: 0,   end: 69  },
  about:       { start: 70,  end: 154 },
  advantages:  { start: 155, end: 209 },
  global:      { start: 210, end: 299 },
} as const

export type SectionKey = keyof typeof SECTION_RANGES

export const FADE_BUFFER = 10

export function progressToFrame(progress: number): number {
  return Math.min(
    TOTAL_FRAMES - 1,
    Math.max(0, Math.round(progress * (TOTAL_FRAMES - 1)))
  )
}

export function getFramePath(index: number): string {
  return `/sequence-master/ezgif-frame-${String(index + 1).padStart(3, '0')}.png`
}

export function getSectionOpacity(
  section: SectionKey,
  currentFrame: number
): number {
  const { start, end } = SECTION_RANGES[section]
  const fadeStart = start - FADE_BUFFER
  const fadeEnd = end + FADE_BUFFER

  if (currentFrame < fadeStart || currentFrame > fadeEnd) return 0
  if (currentFrame < start) return (currentFrame - fadeStart) / FADE_BUFFER
  if (currentFrame <= end) return 1
  return 1 - (currentFrame - end) / FADE_BUFFER
}

export function getActiveSection(frame: number): SectionKey | null {
  for (const [key, range] of Object.entries(SECTION_RANGES)) {
    if (frame >= range.start && frame <= range.end) {
      return key as SectionKey
    }
  }
  return null
}
```

---

### 9.2 `lib/animation-config.ts`

```typescript
import type { Variants } from 'framer-motion'

// Shared easing curve — all luxury motion uses this
export const LUXURY_EASE = [0.16, 1, 0.3, 1] as const

// Generic fade-up variant for text reveals
export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(4px)',
  },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.1,
      ease: LUXURY_EASE,
      delay,
    },
  }),
}

// Stagger container
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.1,
    },
  },
}

// Letter-spacing reveal
export const letterSpacingVariants: Variants = {
  hidden: { letterSpacing: '0.5em', opacity: 0 },
  visible: {
    letterSpacing: '0.3em',
    opacity: 1,
    transition: { duration: 1.4, ease: LUXURY_EASE },
  },
}

// Line reveal (uses clip-path)
export const lineRevealVariants: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 1.2, ease: LUXURY_EASE },
  },
}
```

---

### 9.3 `providers/LenisProvider.tsx`

```typescript
'use client'
import { createContext, useContext, useEffect, useRef, ReactNode } from 'react'
import Lenis from '@studio-freight/lenis'

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
  return useContext(LenisContext)
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
      infinite: false,
    })

    lenisRef.current = lenis

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  )
}
```

---

## 10. PERFORMANCE STRATEGY

### 10.1 Memory Budget

| Item | Count | Est. Size | Total |
|---|---|---|---|
| PNG frames (desktop) | 300 | ~180 KB each | ~54 MB heap |
| PNG frames (mobile, skip 2) | 150 | ~80 KB each | ~12 MB heap |
| Video (globe-loop, streamed) | — | streamed | ~0 |

**Mitigation:** Images are stored as decoded `HTMLImageElement` objects. Once decoded, the browser GPU caches the texture. Heap usage is front-loaded during preload then stable.

### 10.2 Canvas Rendering Optimisation

```
✅ Single RAF loop — no setInterval, no multiple requestAnimationFrame
✅ Dirty-check: only ctx.drawImage() when frame index changes
✅ imageSmoothingQuality: 'high' on desktop, 'medium' on mobile
✅ DPR-aware sizing (canvas.width = CSS width × devicePixelRatio)
✅ object-cover math baked into drawImage offset/scale calculation
✅ Canvas is 2D context — no WebGL overhead for this use case
```

### 10.3 Priority Loading Strategy

```
Phase 1 (frames 0–29):   Sequential load, blocks render unlock
Phase 2 (frames 30–299): Parallel batches of 10 — background fill
```

Hero is visible immediately because the first 30 frames load first. The loading overlay fades once Phase 1 is complete (10% of frames = fast).

### 10.4 Lenis + RAF Sync

```
Lenis RAF tick → updates scroll position
Canvas RAF tick → reads current frame, draws if changed
```

Both loops run at 60fps (monitor refresh rate). They are independent but effectively synchronised via `requestAnimationFrame`. No explicit coordination needed.

### 10.5 Offscreen Canvas (Optional Optimisation)

For high-end devices, consider using `OffscreenCanvas` with a Web Worker to decode frames off the main thread:

```typescript
// Only activate if: navigator.hardwareConcurrency > 4
// Worker handles decoding; posts ImageBitmap back to main thread
// Main thread only does ctx.transferFromImageBitmap(bitmap)
```

This is listed as an optional enhancement — implement only if frame drops are measured.

---

## 11. MOBILE OPTIMIZATION PLAN

### 11.1 Breakpoint Strategy

| Breakpoint | Scroll Height | Frame Skip | Canvas Quality | DPR Cap |
|---|---|---|---|---|
| Desktop (≥1024px) | 500vh | 1 (all 300) | High | 2 |
| Tablet (768–1023px) | 420vh | 1 (all 300) | Medium | 1.5 |
| Mobile (<768px) | 350vh | 2 (150 frames) | Medium | 1 |

### 11.2 Reduced Scroll Height

On mobile, the shorter scroll container means each frame maps to more scroll distance, which actually makes the animation feel smoother despite fewer frames.

### 11.3 Canvas Size on Mobile

```typescript
const dpr = Math.min(window.devicePixelRatio, isMobile() ? 1 : 2)
canvas.width = window.innerWidth * dpr
canvas.height = window.innerHeight * dpr
```

Capping DPR at 1 on mobile halves pixel count (e.g. 390×844 instead of 780×1688), dramatically reducing GPU load.

### 11.4 Text Layout Adjustments

- Hero: single-column, text bottom-aligned
- About: left-aligned prose block, smaller type scale
- Advantages: vertical stack (1-column), compact spacing
- Global: centred stats row, reduced font sizes

All via Tailwind responsive prefixes (`md:`, `lg:`).

### 11.5 `prefers-reduced-motion`

```typescript
// Check in useImagePreloader
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (prefersReduced) {
  // Show static frame (frame 0), skip entire sequence
  // Render all content sections visible simultaneously as a normal page
}
```

---

## 12. LUXURY MICRO-INTERACTIONS

### 12.1 Text Reveal Pattern

All headline text uses a line-by-line mask reveal:

```tsx
// Each word/line wrapped in a clip container
<div style={{ overflow: 'hidden' }}>
  <motion.span
    initial={{ y: '110%' }}
    animate={{ y: opacity > 0.5 ? '0%' : '110%' }}
    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    style={{ display: 'block' }}
  >
    {word}
  </motion.span>
</div>
```

### 12.2 Letter-Spacing Animation

Label text (e.g. "01 — ABOUT") animates from wide tracking to final:

```tsx
<motion.p
  style={{
    opacity,
    letterSpacing: `${0.5 - opacity * 0.2}em`,  // 0.5em → 0.3em
  }}
  className="text-xs uppercase text-[#C9B99A]"
>
  01 — ABOUT
</motion.p>
```

### 12.3 Section Counter Line

A thin platinum horizontal rule grows from 0 → 100% width as a section enters:

```tsx
<motion.div
  style={{
    scaleX: opacity,
    transformOrigin: 'left center',
    height: '1px',
    background: '#C9B99A',
    width: '40px',
  }}
/>
```

### 12.4 Blur Unfocus Transition

Outgoing sections blur as they fade:

```typescript
const exitBlur = currentFrame > SECTION_RANGES[section].end
  ? `blur(${(currentFrame - SECTION_RANGES[section].end) * 0.5}px)`
  : 'blur(0px)'
```

### 12.5 Loading Overlay

While frames 0–29 load, a minimal loading screen shows:

```tsx
<motion.div
  animate={{ opacity: isLoaded ? 0 : 1 }}
  transition={{ duration: 0.8, delay: 0.3 }}
  className="absolute inset-0 z-50 bg-[#050505] flex items-center justify-center"
  style={{ pointerEvents: isLoaded ? 'none' : 'all' }}
>
  <div className="flex flex-col items-center gap-4">
    <p className="text-xs tracking-[0.4em] uppercase text-white/30">
      PORT AUTHORITY
    </p>
    <div className="w-48 h-px bg-white/10 relative overflow-hidden">
      <motion.div
        style={{ scaleX: loadProgress, transformOrigin: 'left' }}
        className="absolute inset-0 bg-[#C9B99A]"
      />
    </div>
    <p className="text-xs tracking-widest text-white/20">
      {Math.round(loadProgress * 100)}%
    </p>
  </div>
</motion.div>
```

---

## 13. CONTENT COPY

### Hero
```
LABEL:    PORT AUTHORITY
H1:       The Sky Is Not a Limit.
          It Is Where You Belong.
BODY:     Elite private aviation. Uncompromising access.
          Designed for those who demand more.
CTA:      Request Access →
```

### About
```
LABEL:    01 — ABOUT
H2:       A Standard Above Standard.
BODY:     Port Authority was built for the sovereign traveller — the executive
          who views time as currency and refuses to spend it in terminals.
          We operate a privately managed fleet, handled exclusively by former
          military and commercial aviation professionals with decades of precision
          experience. From booking to touchdown, every detail is ours to own.
STATS:    18+ YEARS OPERATING  |  340+ MANAGED AIRCRAFT  |  98% ON-TIME RATE
```

### Advantages — 4 Pillars
```
01 — ZERO-QUEUE DEPARTURE
     Skip every checkpoint. Your aircraft boards the moment you arrive.
     No terminals. No queues. No compromise.

02 — GLOBAL CONCIERGE
     White-glove ground handling at 180+ private FBOs worldwide.
     Your team, on the ground, before you land.

03 — ADAPTIVE FLEET
     Light jets to ultra-long-range heavies. Right-sized to every mission,
     every passenger count, every runway environment.

04 — ABSOLUTE DISCRETION
     Your itinerary, your manifest, your terms. Always.
     Zero third-party data sharing. Operated under full confidentiality protocols.
```

### Global Network
```
LABEL:    04 — GLOBAL NETWORK
H2:       Every Continent.
          Every Runway.
BODY:     From Teterboro to Tōkyō. Geneva to the Gulf.
          Port Authority operates across 6 continents, 92 countries,
          and 500+ verified private terminals — with 24/7 operational control
          staffed by aviation specialists, not call centres.
STATS:    6  CONTINENTS  |  92  COUNTRIES  |  500+  TERMINALS
```

### Globe Footer
```
LABEL:    Worldwide Operations
H2:       Wherever You Need to Be.
          We Are Already There.
STATS:    92 Countries  |  500+ Terminals  |  24/7 Operations
FOOTER:   © 2026 PORT AUTHORITY  |  PRIVATE AVIATION GROUP
```

---

## 14. ACCESSIBILITY CONSIDERATIONS

### 14.1 `prefers-reduced-motion`

When `prefers-reduced-motion: reduce` is detected:
- Disable canvas sequence animation entirely
- Show a static hero image (frame 0 rendered once)
- Render all section content as a standard single-page document
- Disable Lenis smooth scroll (use native scroll)

```typescript
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
if (mediaQuery.matches) { /* static mode */ }
```

### 14.2 Keyboard Navigation

Even though the page is scroll-driven, keyboard users must be able to navigate:
- Add `tabIndex={0}` to the scroll container
- On `ArrowDown`/`ArrowUp` keypress, programmatically advance `window.scrollY` by `vh * 1` using `lenis.scrollTo()`
- Ensure all CTA buttons are focusable with visible focus rings

### 14.3 Screen Reader Support

```html
<!-- Landmark roles for each section -->
<section aria-label="Hero — Port Authority Private Aviation" role="region">
<section aria-label="About Port Authority" role="region">
<section aria-label="Advantages" role="region">
<section aria-label="Global Network" role="region">
```

The canvas itself should have:
```tsx
<canvas
  ref={canvasRef}
  role="img"
  aria-label="Cinematic view of a luxury private jet in flight"
/>
```

### 14.4 Color Contrast

- Body text: `#FFFFFF` on `#050505` — contrast ratio: **21:1** ✅ (WCAG AAA)
- Accent text: `#C9B99A` on `#050505` — contrast ratio: **9.8:1** ✅ (WCAG AA+)
- Body text at 60% opacity (`rgba(255,255,255,0.6)`): contrast ratio ~**7:1** ✅

### 14.5 Video (Globe Footer)

- `muted` and `autoplay` are both set; browsers require both for autoplay policy compliance
- `playsInline` prevents iOS fullscreen takeover
- Add `aria-hidden="true"` to the video element (decorative)
- Always provide a static fallback poster image

---

## 15. SEO STRATEGY

### 15.1 App Router Metadata

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Port Authority | Elite Private Aviation',
  description:
    'Port Authority delivers elite private aviation across 92 countries and 500+ verified private terminals. Zero queues. Absolute discretion. On your terms.',
  keywords: [
    'private aviation', 'private jet charter', 'elite aviation',
    'luxury travel', 'business jet', 'private terminal'
  ],
  openGraph: {
    title: 'Port Authority | The Sky Is Where You Belong',
    description:
      'Elite private aviation. Uncompromising access. Designed for those who demand more.',
    url: 'https://portauthority.aero',
    siteName: 'Port Authority',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Port Authority | Elite Private Aviation',
    description: 'Elite private aviation. On your terms.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: 'https://portauthority.aero',
  },
}
```

### 15.2 Semantic HTML

Even though the page is canvas-driven, all text content lives in DOM elements, not inside the canvas. Search engines index the `SectionContent` overlay text.

### 15.3 JSON-LD Structured Data

```tsx
// app/page.tsx — add to <head> via next/script
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Port Authority',
  description: 'Elite private aviation group with global operations.',
  url: 'https://portauthority.aero',
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['English'],
  },
}
```

### 15.4 Performance & Core Web Vitals

- LCP: The loading overlay prevents CLS; canvas `draw()` happens off-paint
- FID/INP: No click handlers on canvas; all events are passive scroll listeners
- CLS: Canvas is `position: absolute`, never affects layout shifts
- Use `next/font` for Inter/Geist to eliminate FOUT

---

## 16. DEPENDENCIES & INSTALLATION

### 16.1 Required Packages

```bash
npm install @studio-freight/lenis framer-motion
```

### 16.2 Already included in Next.js 14

- TypeScript
- Tailwind CSS
- React 18
- `next/font`

### 16.3 `package.json` additions

```json
{
  "dependencies": {
    "@studio-freight/lenis": "^1.0.42",
    "framer-motion": "^11.0.0",
    "next": "14.x",
    "react": "^18",
    "react-dom": "^18"
  }
}
```

### 16.4 `tailwind.config.ts` additions

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'pa-black':    '#050505',
        'pa-platinum': '#C9B99A',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui'],
      },
      letterSpacing: {
        'ultra': '0.35em',
        'wide-xl': '0.25em',
      },
    },
  },
  plugins: [],
}
export default config
```

### 16.5 `globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-bg: #050505;
  --color-text: #ffffff;
  --color-accent: #C9B99A;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html {
  background: var(--color-bg);
  color: var(--color-text);
  scroll-behavior: auto; /* Lenis controls this */
}

body {
  background: var(--color-bg);
  overflow-x: hidden;
}

/* Hide scrollbar visually but keep it functional */
::-webkit-scrollbar { display: none; }
* { -ms-overflow-style: none; scrollbar-width: none; }

/* Prevent flash of white */
html, body { background-color: #050505; }
```

---

## 17. STEP-BY-STEP BUILD ORDER

The coding agent must build in this exact sequence to avoid missing dependencies.

---

### PHASE 1 — PROJECT FOUNDATION

**Step 1.1** — Install dependencies
```bash
npm install @studio-freight/lenis framer-motion
```

**Step 1.2** — Create `globals.css`  
Write the base CSS from Section 16.5.

**Step 1.3** — Update `tailwind.config.ts`  
Apply extensions from Section 16.4.

**Step 1.4** — Create `app/layout.tsx`  
```typescript
// Set up: LenisProvider wrapper, next/font Geist import, metadata export, html/body with bg-[#050505]
```

---

### PHASE 2 — LIBRARY FILES (No dependencies on components)

**Step 2.1** — Create `lib/frame-map.ts`  
Full content from Section 9.1. This is the source of truth for all frame logic. Build and test this in isolation with console logs before using in components.

**Step 2.2** — Create `lib/animation-config.ts`  
Full content from Section 9.2.

---

### PHASE 3 — PROVIDERS

**Step 3.1** — Create `providers/LenisProvider.tsx`  
Full content from Section 9.3.  
Wrap `app/layout.tsx` body with `<LenisProvider>`.

---

### PHASE 4 — HOOKS

**Step 4.1** — Create `hooks/useImagePreloader.ts`  
Full content from Section 8.1.  
Test: load 5 frames in a dummy component, log to console, verify paths resolve.

**Step 4.2** — Create `hooks/useScrollProgress.ts`  
Full content from Section 8.2.  
Test: Wrap a tall div, scroll, verify 0→1 output in console.

---

### PHASE 5 — CANVAS ENGINE

**Step 5.1** — Create `components/CanvasSequence.tsx`  
Implement the canvas draw loop from Section 7.2.  
Test: Pass a single image, verify it renders cover-fit.  
Test: Change `currentFrame` prop, verify canvas updates.

---

### PHASE 6 — SECTION CONTENT COMPONENTS

Build in this order (Hero first — it's the most visible):

**Step 6.1** — Create `components/section-content/HeroContent.tsx`  
**Step 6.2** — Create `components/section-content/AboutContent.tsx`  
**Step 6.3** — Create `components/section-content/AdvantagesContent.tsx`  
**Step 6.4** — Create `components/section-content/GlobalContent.tsx`  
**Step 6.5** — Create `components/section-content/SectionContent.tsx`  

Each content component must:
1. Accept `currentFrame: number`
2. Call `getSectionOpacity(sectionKey, currentFrame)` from `lib/frame-map.ts`
3. Apply opacity to wrapper via `motion.div style={{ opacity }}`
4. Apply the content from Section 13

---

### PHASE 7 — MASTER SCENE ORCHESTRATOR

**Step 7.1** — Create `components/MasterScrollScene.tsx`  
Wire all hooks and components together using specs from Section 7.1.  
Test: Verify scroll drives frame changes. Verify content overlays appear/disappear at correct scroll positions.

---

### PHASE 8 — GLOBE FOOTER

**Step 8.1** — Create `components/GlobeFooter.tsx`  
Full content from Section 7.8.  
Test: Verify video autoplays, is muted, loops. Test on Safari iOS for `playsInline`.

---

### PHASE 9 — PAGE ASSEMBLY

**Step 9.1** — Update `app/page.tsx`

```typescript
import MasterScrollScene from '@/components/MasterScrollScene'
import GlobeFooter from '@/components/GlobeFooter'

export default function Page() {
  return (
    <main>
      <MasterScrollScene />
      <GlobeFooter />
    </main>
  )
}
```

---

### PHASE 10 — SEO & METADATA

**Step 10.1** — Add full metadata export to `app/layout.tsx` (Section 15.1)  
**Step 10.2** — Add JSON-LD script block to `app/page.tsx` (Section 15.3)  
**Step 10.3** — Add landmark `aria-label` attributes to all section wrappers

---

### PHASE 11 — POLISH & VALIDATION

**Step 11.1** — Test loading overlay: verify it shows during phase 1 preload, fades cleanly  
**Step 11.2** — Test mobile: 375px width, verify reduced frame count, correct scroll height  
**Step 11.3** — Test `prefers-reduced-motion`: enable in OS, verify static mode activates  
**Step 11.4** — Lighthouse audit: target 90+ Performance, 100 Accessibility, 100 Best Practices  
**Step 11.5** — Cross-browser: Chrome, Safari, Firefox, iOS Safari  

---

## 18. FULL SOURCE CODE

The following is the complete, production-ready source for every file. The coding agent must use these exactly.

---

### `app/layout.tsx`

```tsx
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { LenisProvider } from '@/providers/LenisProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Port Authority | Elite Private Aviation',
  description:
    'Port Authority delivers elite private aviation across 92 countries and 500+ verified private terminals. Zero queues. Absolute discretion. On your terms.',
  openGraph: {
    title: 'Port Authority | The Sky Is Where You Belong',
    description: 'Elite private aviation. On your terms.',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-[#050505] text-white antialiased">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
```

---

### `app/page.tsx`

```tsx
import MasterScrollScene from '@/components/MasterScrollScene'
import GlobeFooter from '@/components/GlobeFooter'

export default function Page() {
  return (
    <main>
      <MasterScrollScene />
      <GlobeFooter />
    </main>
  )
}
```

---

### `lib/frame-map.ts`

*(Full source — see Section 9.1)*

---

### `lib/animation-config.ts`

*(Full source — see Section 9.2)*

---

### `providers/LenisProvider.tsx`

*(Full source — see Section 9.3)*

---

### `hooks/useImagePreloader.ts`

*(Full source — see Section 8.1)*

---

### `hooks/useScrollProgress.ts`

*(Full source — see Section 8.2)*

---

### `components/CanvasSequence.tsx`

```tsx
'use client'
import { useRef, useEffect } from 'react'

interface CanvasSequenceProps {
  images: HTMLImageElement[]
  currentFrame: number
}

export default function CanvasSequence({ images, currentFrame }: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prevFrameRef = useRef<number>(-1)

  // Setup canvas size on mount and resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function setSize() {
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1 : 2)
      canvas!.width = window.innerWidth * dpr
      canvas!.height = window.innerHeight * dpr
      canvas!.style.width = window.innerWidth + 'px'
      canvas!.style.height = window.innerHeight + 'px'
      prevFrameRef.current = -1  // force redraw after resize
    }

    setSize()
    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(setSize, 200)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // RAF render loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number

    function render() {
      if (currentFrame !== prevFrameRef.current && images[currentFrame]) {
        const img = images[currentFrame]
        const cw = canvas!.width
        const ch = canvas!.height
        const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
        const x = (cw - img.naturalWidth * scale) / 2
        const y = (ch - img.naturalHeight * scale) / 2

        ctx!.clearRect(0, 0, cw, ch)
        ctx!.imageSmoothingEnabled = true
        ctx!.imageSmoothingQuality = window.innerWidth < 768 ? 'medium' : 'high'
        ctx!.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale)
        prevFrameRef.current = currentFrame
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
```

---

### `components/MasterScrollScene.tsx`

```tsx
'use client'
import { useRef } from 'react'
import { useImagePreloader } from '@/hooks/useImagePreloader'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { progressToFrame } from '@/lib/frame-map'
import CanvasSequence from './CanvasSequence'
import SectionContent from './section-content/SectionContent'
import { motion } from 'framer-motion'

export default function MasterScrollScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { images, isLoaded, loadProgress } = useImagePreloader()
  const scrollProgress = useScrollProgress(containerRef)
  const currentFrame = progressToFrame(scrollProgress)

  return (
    // Outer: controls scroll duration
    <div
      ref={containerRef}
      className="relative md:h-[500vh] h-[350vh]"
    >
      {/* Inner: sticky viewport panel */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">

        {/* Loading overlay */}
        <motion.div
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ pointerEvents: isLoaded ? 'none' : 'all' }}
          className="absolute inset-0 z-50 bg-[#050505] flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-5">
            <p className="text-[10px] tracking-[0.45em] uppercase text-white/25">
              PORT AUTHORITY
            </p>
            <div className="w-52 h-px bg-white/10 relative overflow-hidden">
              <motion.div
                style={{ scaleX: loadProgress, transformOrigin: 'left' }}
                className="absolute inset-0 bg-[#C9B99A]"
              />
            </div>
            <p className="text-[10px] tracking-widest text-white/20">
              {Math.round(loadProgress * 100)}%
            </p>
          </div>
        </motion.div>

        {/* Canvas: z-index 0 */}
        <CanvasSequence images={images} currentFrame={currentFrame} />

        {/* Content overlays: z-index 10 */}
        <SectionContent currentFrame={currentFrame} />

      </div>
    </div>
  )
}
```

---

### `components/section-content/SectionContent.tsx`

```tsx
import HeroContent from './HeroContent'
import AboutContent from './AboutContent'
import AdvantagesContent from './AdvantagesContent'
import GlobalContent from './GlobalContent'

interface SectionContentProps {
  currentFrame: number
}

export default function SectionContent({ currentFrame }: SectionContentProps) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none">
      <HeroContent currentFrame={currentFrame} />
      <AboutContent currentFrame={currentFrame} />
      <AdvantagesContent currentFrame={currentFrame} />
      <GlobalContent currentFrame={currentFrame} />
    </div>
  )
}
```

---

### `components/section-content/HeroContent.tsx`

```tsx
'use client'
import { getSectionOpacity } from '@/lib/frame-map'

interface Props { currentFrame: number }

export default function HeroContent({ currentFrame }: Props) {
  const opacity = getSectionOpacity('hero', currentFrame)
  if (opacity === 0) return null

  const blur = opacity < 1 ? `blur(${(1 - opacity) * 6}px)` : 'blur(0px)'
  const y = (1 - opacity) * 28

  return (
    <div
      style={{ opacity, filter: blur, transform: `translateY(${y}px)`, transition: 'none' }}
      className="absolute inset-0 flex flex-col justify-end pb-20 pl-12 pr-8 md:pl-24 md:pb-28"
    >
      <p className="text-[10px] tracking-[0.45em] uppercase text-[#C9B99A] mb-5">
        Port Authority
      </p>
      <h1 className="text-4xl md:text-7xl font-light leading-[1.04] text-white max-w-2xl">
        The Sky Is Not a Limit.<br />
        It Is Where You Belong.
      </h1>
      <p className="text-sm tracking-widest text-white/55 mt-6 max-w-sm leading-relaxed">
        Elite private aviation. Uncompromising access.<br />
        Designed for those who demand more.
      </p>
      <button
        className="pointer-events-auto mt-10 text-[10px] tracking-[0.28em] uppercase text-white border-b border-white/25 pb-0.5 w-fit hover:border-white/60 transition-colors duration-500"
        aria-label="Request access to Port Authority private aviation"
      >
        Request Access →
      </button>
    </div>
  )
}
```

---

### `components/section-content/AboutContent.tsx`

```tsx
'use client'
import { getSectionOpacity } from '@/lib/frame-map'

interface Props { currentFrame: number }

export default function AboutContent({ currentFrame }: Props) {
  const opacity = getSectionOpacity('about', currentFrame)
  if (opacity === 0) return null

  const blur = opacity < 1 ? `blur(${(1 - opacity) * 6}px)` : 'blur(0px)'
  const y = (1 - opacity) * 20

  return (
    <div
      style={{ opacity, filter: blur, transform: `translateY(${y}px)` }}
      className="absolute inset-0 flex flex-col justify-center pl-12 md:pl-24 max-w-xl"
    >
      <div className="flex items-center gap-3 mb-7">
        <div style={{ width: `${opacity * 40}px`, height: '1px', background: '#C9B99A', transition: 'none' }} />
        <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9B99A]">
          01 — About
        </p>
      </div>
      <h2 className="text-3xl md:text-5xl font-light leading-[1.1] text-white mb-7">
        A Standard Above<br />Standard.
      </h2>
      <p className="text-sm text-white/55 leading-[1.85] tracking-wide">
        Port Authority was built for the sovereign traveller — the executive who
        views time as currency and refuses to spend it in terminals. We operate
        a privately managed fleet, handled exclusively by former military and
        commercial aviation professionals with decades of precision experience.
      </p>
      <div className="flex gap-10 mt-10">
        {[
          { val: '18+', label: 'Years Operating' },
          { val: '340+', label: 'Aircraft' },
          { val: '98%', label: 'On-Time Rate' },
        ].map(({ val, label }) => (
          <div key={label}>
            <p className="text-2xl font-light text-white">{val}</p>
            <p className="text-[10px] tracking-[0.2em] text-white/35 uppercase mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

### `components/section-content/AdvantagesContent.tsx`

```tsx
'use client'
import { getSectionOpacity } from '@/lib/frame-map'

interface Props { currentFrame: number }

const PILLARS = [
  {
    num: '01',
    title: 'Zero-Queue Departure',
    body: 'Skip every checkpoint. Your aircraft boards the moment you arrive. No terminals. No queues. No compromise.',
  },
  {
    num: '02',
    title: 'Global Concierge',
    body: 'White-glove ground handling at 180+ private FBOs worldwide. Your team, on the ground, before you land.',
  },
  {
    num: '03',
    title: 'Adaptive Fleet',
    body: 'Light jets to ultra-long-range heavies. Right-sized to every mission, every passenger count, every runway.',
  },
  {
    num: '04',
    title: 'Absolute Discretion',
    body: 'Your itinerary, your manifest, your terms. Always. Zero third-party data sharing. Full confidentiality protocols.',
  },
]

export default function AdvantagesContent({ currentFrame }: Props) {
  const opacity = getSectionOpacity('advantages', currentFrame)
  if (opacity === 0) return null

  const blur = opacity < 1 ? `blur(${(1 - opacity) * 6}px)` : 'blur(0px)'

  return (
    <div
      style={{ opacity, filter: blur }}
      className="absolute inset-0 flex flex-col justify-center items-end pr-12 md:pr-24"
    >
      <div className="flex items-center gap-3 mb-8 self-end">
        <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9B99A]">
          02 — Advantages
        </p>
        <div style={{ width: `${opacity * 40}px`, height: '1px', background: '#C9B99A' }} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-lg text-right">
        {PILLARS.map((p, i) => (
          <div
            key={p.num}
            style={{ opacity: Math.max(0, opacity - i * 0.05), transform: `translateY(${(1 - opacity) * (12 + i * 4)}px)` }}
          >
            <p className="text-[10px] tracking-[0.35em] text-[#C9B99A] mb-2">{p.num}</p>
            <p className="text-sm font-light text-white mb-2 tracking-wide">{p.title}</p>
            <p className="text-xs text-white/45 leading-[1.8] tracking-wide">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

### `components/section-content/GlobalContent.tsx`

```tsx
'use client'
import { getSectionOpacity } from '@/lib/frame-map'

interface Props { currentFrame: number }

export default function GlobalContent({ currentFrame }: Props) {
  const opacity = getSectionOpacity('global', currentFrame)
  if (opacity === 0) return null

  const blur = opacity < 1 ? `blur(${(1 - opacity) * 6}px)` : 'blur(0px)'
  const y = (1 - opacity) * 20

  return (
    <div
      style={{ opacity, filter: blur, transform: `translateY(${y}px)` }}
      className="absolute inset-0 flex flex-col justify-end items-center pb-20 md:pb-28 text-center"
    >
      <div className="flex items-center gap-3 mb-7">
        <div style={{ width: `${opacity * 30}px`, height: '1px', background: '#C9B99A' }} />
        <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9B99A]">
          04 — Global Network
        </p>
        <div style={{ width: `${opacity * 30}px`, height: '1px', background: '#C9B99A' }} />
      </div>
      <h2 className="text-4xl md:text-6xl font-light leading-[1.1] text-white mb-6">
        Every Continent.<br />Every Runway.
      </h2>
      <p className="text-sm text-white/50 leading-[1.85] tracking-wide max-w-md mb-10">
        From Teterboro to Tōkyō. Geneva to the Gulf. Port Authority operates
        across 6 continents, 92 countries, and 500+ verified private terminals —
        with 24/7 operational control staffed by aviation specialists.
      </p>
      <div className="flex gap-12 md:gap-20">
        {[
          { val: '6', label: 'Continents' },
          { val: '92', label: 'Countries' },
          { val: '500+', label: 'Terminals' },
        ].map(({ val, label }) => (
          <div key={label} className="text-center">
            <p className="text-3xl font-light text-white">{val}</p>
            <p className="text-[10px] tracking-[0.25em] text-white/30 uppercase mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

### `components/GlobeFooter.tsx`

*(Full source — see Section 7.8)*

---

## QUICK REFERENCE CARD (For Coding Agent)

```
TOTAL FRAMES:     300
FIRST FILE:       ezgif-frame-001.png
LAST FILE:        ezgif-frame-300.png
NAMING FORMAT:    ezgif-frame-${String(index + 1).padStart(3, '0')}.png
INDEX BASE:       0-indexed internally (0–299)

HERO FRAMES:      0–69    (files 001–070)
ABOUT FRAMES:     70–154  (files 071–155)
ADVANTAGE FRAMES: 155–209 (files 156–210)
GLOBAL FRAMES:    210–299 (files 211–300)

SCROLL HEIGHT:    500vh (desktop) / 350vh (mobile)
SCROLL ENGINE:    Lenis @ duration 1.4
CANVAS DPR:       devicePixelRatio capped at 2 (desktop) or 1 (mobile)
BACKGROUND:       #050505
ACCENT:           #C9B99A
PRELOAD BATCH:    First 30 frames sequential, then batches of 10
```

---

*End of implementation_plan.md*
