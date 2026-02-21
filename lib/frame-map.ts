// ─── Frame Map ────────────────────────────────────────────────────────────────
// Source of truth for all frame-range and scroll-to-frame logic.
// Total frames: 300 (files: ezgif-frame-001.png → ezgif-frame-300.png)
// Internal indices:  0 → 299 (0-based)
// ─────────────────────────────────────────────────────────────────────────────

export const TOTAL_FRAMES = 300

// 0-indexed frame ranges. start/end are inclusive.
export const SECTION_RANGES = {
  hero:        { start: 0,   end: 69  },
  about:       { start: 70,  end: 154 },
  advantages:  { start: 155, end: 209 },
  global:      { start: 210, end: 299 },
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
 * e.g. index 0  → /sequence-master/ezgif-frame-001.png
 *      index 299 → /sequence-master/ezgif-frame-300.png
 */
export function getFramePath(index: number): string {
  return `/sequence-master/ezgif-frame-${String(index + 1).padStart(3, '0')}.png`
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
