/**
 * Renames ezgif-frame-100.jpg → ezgif-frame-301.jpg
 *          ezgif-frame-101.jpg → ezgif-frame-302.jpg
 *          ...
 *          ezgif-frame-210.jpg → ezgif-frame-411.jpg
 *
 * Also removes stale .webp files for the old numbers (100–210)
 * and removes stale .webp files that might conflict with the new numbers (301–411).
 * Then converts all renamed JPGs to WebP.
 *
 * Run: node scripts/rename-and-convert-100-210.mjs
 */

import sharp from 'sharp'
import { renameSync, existsSync, unlinkSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)
const DIR        = resolve(__dirname, '../public/sequence-master')
const QUALITY    = 82
const CONCURRENCY = 8

// Maps old frame number → new frame number
// 100 → 301, 101 → 302, ..., 210 → 411
const pairs = Array.from({ length: 111 }, (_, i) => ({
  oldNum: 100 + i,
  newNum: 301 + i,
}))

console.log(`\nStep 1: Removing stale .webp files for old numbers 100–210 and new numbers 301–411…`)

for (const { oldNum, newNum } of pairs) {
  const oldWebp = join(DIR, `ezgif-frame-${String(oldNum).padStart(3, '0')}.webp`)
  const newWebp = join(DIR, `ezgif-frame-${String(newNum).padStart(3, '0')}.webp`)

  if (existsSync(oldWebp)) {
    unlinkSync(oldWebp)
    console.log(`  Deleted ${oldWebp}`)
  }
  if (existsSync(newWebp)) {
    unlinkSync(newWebp)
    console.log(`  Deleted ${newWebp}`)
  }
}

console.log(`\nStep 2: Renaming JPG files 100–210 → 301–411…`)

for (const { oldNum, newNum } of pairs) {
  const oldJpg = join(DIR, `ezgif-frame-${String(oldNum).padStart(3, '0')}.jpg`)
  const newJpg = join(DIR, `ezgif-frame-${String(newNum).padStart(3, '0')}.jpg`)

  if (!existsSync(oldJpg)) {
    console.warn(`  WARNING: ${oldJpg} not found, skipping.`)
    continue
  }
  renameSync(oldJpg, newJpg)
  console.log(`  ${String(oldNum).padStart(3, '0')}.jpg → ${String(newNum).padStart(3, '0')}.jpg`)
}

console.log(`\nStep 3: Converting renamed JPGs (301–411) to WebP…`)

let done = 0

async function convert({ newNum }) {
  const num    = String(newNum).padStart(3, '0')
  const input  = join(DIR, `ezgif-frame-${num}.jpg`)
  const output = join(DIR, `ezgif-frame-${num}.webp`)

  if (!existsSync(input)) {
    console.warn(`  WARNING: ${input} not found, skipping conversion.`)
    return
  }

  await sharp(input)
    .webp({ quality: QUALITY, effort: 4 })
    .toFile(output)

  done++
  process.stdout.write(`\r  ${done}/${pairs.length} converted…`)
}

for (let i = 0; i < pairs.length; i += CONCURRENCY) {
  await Promise.all(pairs.slice(i, i + CONCURRENCY).map(convert))
}

console.log(`\n\nDone!`)
console.log(`  - Frames 100–210 JPGs renamed to 301–411`)
console.log(`  - All 301–411 frames converted to WebP`)
console.log(`  - Stale WebP files for 100–210 removed`)
