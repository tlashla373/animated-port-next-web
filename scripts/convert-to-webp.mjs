/**
 * Converts all PNG frames in /public/sequence-master to WebP.
 * Run once: node scripts/convert-to-webp.mjs
 *
 * Requirements: npm install --save-dev sharp
 */

import sharp from 'sharp'
import { readdirSync } from 'fs'
import { join, extname, basename, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)
const INPUT_DIR  = resolve(__dirname, '../public/sequence-master')
const OUTPUT_DIR = INPUT_DIR

const QUALITY = 82 // 80–85 gives excellent visual quality at ~60-70% size saving

const files = readdirSync(INPUT_DIR).filter(f => extname(f) === '.png')

console.log(`Converting ${files.length} PNG frames to WebP (quality ${QUALITY})…\n`)

let done = 0
const CONCURRENCY = 8

async function convertFile(file) {
  const inputPath  = join(INPUT_DIR, file)
  const outputPath = join(OUTPUT_DIR, basename(file, '.png') + '.webp')

  await sharp(inputPath)
    .webp({ quality: QUALITY, effort: 4 })
    .toFile(outputPath)

  done++
  if (done % 30 === 0 || done === files.length) {
    process.stdout.write(`\r  ${done}/${files.length} done…`)
  }
}

// Process in chunks of CONCURRENCY
for (let i = 0; i < files.length; i += CONCURRENCY) {
  await Promise.all(files.slice(i, i + CONCURRENCY).map(convertFile))
}

console.log('\n\nDone! Now set USE_WEBP = true in lib/frame-map.ts and redeploy.')
