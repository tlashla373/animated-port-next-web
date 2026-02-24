// ─── Frame Map ────────────────────────────────────────────────────────────────
// Source of truth for all frame-range and scroll-to-frame logic.
// Total frames: 411 (files: ezgif-frame-001 → ezgif-frame-411)
// Internal indices:  0 → 410 (0-based)
// ─────────────────────────────────────────────────────────────────────────────

export const TOTAL_FRAMES = 411

// 0-indexed frame ranges. start/end are inclusive.
export const SECTION_RANGES = {
  hero:       { start: 0,   end: 74  },
  about:      { start: 75,  end: 149 },
  fleet:      { start: 150, end: 224 },
  global:     { start: 225, end: 299 },
  advantages: { start: 300, end: 410 }, // frames 301–411
} as const

export type SectionKey = keyof typeof SECTION_RANGES

// How many frames either side of start/end are used as a fade transition zone
export const FADE_BUFFER = 10

/**
 * Convert a scroll progress value [0, 1] to a 0-based frame index [0, 299].
 */
export function progressToFrame(progress: number): number {
  return Math.min(
    TOTAL_FRAMES - 1,
    Math.max(0, Math.round(progress * (TOTAL_FRAMES - 1)))
  )
}

/**
 * Build the public URL for a 0-based frame index.
 * Prefers WebP when available (convert PNGs → WebP for ~70% smaller payload).
 * e.g. index 0  → /sequence-master/ezgif-frame-001.webp
 *      index 299 → /sequence-master/ezgif-frame-300.webp
 *
 * If you haven't converted the images yet, change USE_WEBP to false.
 */
const USE_WEBP = true // ← set to true after running the WebP conversion script

export function getFramePath(index: number): string {
  const ext = USE_WEBP ? 'webp' : 'png'
  return `/sequence-master/ezgif-frame-${String(index + 1).padStart(3, '0')}.${ext}`
}

/**
 * Return a 0–1 opacity for a section at the given frame,
 * including FADE_BUFFER frames of fade-in/fade-out on either side.
 */
export function getSectionOpacity(
  section: SectionKey,
  currentFrame: number
): number {
  const { start, end } = SECTION_RANGES[section]
  const fadeStart = start - FADE_BUFFER
  const fadeEnd   = end   + FADE_BUFFER

  if (currentFrame < fadeStart || currentFrame > fadeEnd) return 0
  if (currentFrame < start) return (currentFrame - fadeStart) / FADE_BUFFER
  if (currentFrame <= end)  return 1
  return 1 - (currentFrame - end) / FADE_BUFFER
}

/**
 * Return which section the given frame falls in, or null if between sections.
 */
export function getActiveSection(frame: number): SectionKey | null {
  for (const [key, range] of Object.entries(SECTION_RANGES)) {
    if (frame >= range.start && frame <= range.end) {
      return key as SectionKey
    }
  }
  return null
}
