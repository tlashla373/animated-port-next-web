/**
 * Converts ezgif-frame-301.jpg → ezgif-frame-345.jpg to WebP.
 * Run: node scripts/convert-301-345.mjs
 */

import sharp from 'sharp'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)
const DIR        = resolve(__dirname, '../public/sequence-master')
const QUALITY    = 82

const frames = Array.from({ length: 45 }, (_, i) => i + 301) // 301 → 345

console.log(`Converting ${frames.length} JPG frames (301–345) to WebP…\n`)

let done = 0
const CONCURRENCY = 8

async function convert(n) {
  const num   = String(n).padStart(3, '0')
  const input  = join(DIR, `ezgif-frame-${num}.jpg`)
  const output = join(DIR, `ezgif-frame-${num}.webp`)

  await sharp(input)
    .webp({ quality: QUALITY, effort: 4 })
    .toFile(output)

  done++
  process.stdout.write(`\r  ${done}/${frames.length} done…`)
}

for (let i = 0; i < frames.length; i += CONCURRENCY) {
  await Promise.all(frames.slice(i, i + CONCURRENCY).map(convert))
}

console.log('\n\nDone! Frames 301–345 are now available as .webp')
