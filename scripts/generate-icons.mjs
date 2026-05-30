// Regenerates favicons, app icons, and the social/OG image from the source SVGs.
// Run: node scripts/generate-icons.mjs
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (p) => resolve(root, 'public', p);
const DARK = '#010305';

const favicon = readFileSync(pub('favicon.svg'));
const og = readFileSync(pub('og/source.svg'));

// Transparent favicons
const transparent = [
  ['favicon-16.png', 16],
  ['favicon-32.png', 32],
  ['favicon-48.png', 48],
];

// Solid-background app icons (no transparent corners)
const solid = [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
];

for (const [name, size] of transparent) {
  await sharp(favicon, { density: 640 })
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(pub(name));
  console.log('wrote', name, size);
}

for (const [name, size] of solid) {
  await sharp(favicon, { density: 640 })
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .flatten({ background: DARK })
    .png()
    .toFile(pub(name));
  console.log('wrote', name, size);
}

// Social / Open Graph image
await sharp(og, { density: 144 })
  .resize(1200, 630, { fit: 'cover' })
  .png({ quality: 90 })
  .toFile(pub('og/default.png'));
console.log('wrote og/default.png 1200x630');
