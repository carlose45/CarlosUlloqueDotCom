// Generates a per-note Open Graph image (1200x630) from each public note's
// frontmatter title, on the Tron-branded card. Output: public/og/notes/<slug>.png
//
// Runs as part of `npm run build` (and `npm run og`). Restricted notes are
// skipped so their titles never leak into a shareable card. The note detail
// page references /og/notes/<slug>.png by convention (see notes/[slug].astro).
import sharp from 'sharp';
import { readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, basename } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const notesDir = resolve(root, 'src/content/notes');
const outDir = resolve(root, 'public/og/notes');

const restricted = new Set(
  JSON.parse(readFileSync(resolve(root, 'src/config/restricted-content.json')))
    .notes,
);

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function frontmatter(text, key) {
  const m = text.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : '';
}

// Greedy word-wrap into at most `maxLines` lines of ~maxChars characters.
function wrap(title, maxChars, maxLines) {
  const lines = [];
  let line = '';
  for (const word of title.split(/\s+/)) {
    if (line && (line + ' ' + word).length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? line + ' ' + word : word;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

function svg(title, eyebrow) {
  // Smaller type for long titles so they still fit three lines.
  const big = title.length <= 38;
  const fontSize = big ? 66 : 54;
  const lineH = big ? 78 : 66;
  const lines = wrap(title, big ? 22 : 28, 3);
  // Fixed first-line baseline below the eyebrow; lines grow downward so the
  // title never collides with the eyebrow regardless of line count.
  const titleY = 352;
  const tspans = lines
    .map(
      (l, i) => `<tspan x="80" dy="${i === 0 ? 0 : lineH}">${esc(l)}</tspan>`,
    )
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" fill="none">
  <defs>
    <radialGradient id="bloom" cx="50%" cy="80%" r="62%">
      <stop offset="0%" stop-color="#38e1ff" stop-opacity="0.26" />
      <stop offset="44%" stop-color="#1f6feb" stop-opacity="0.09" />
      <stop offset="100%" stop-color="#010305" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7ff0ff" />
      <stop offset="55%" stop-color="#38e1ff" />
      <stop offset="100%" stop-color="#1f6feb" />
    </linearGradient>
    <radialGradient id="disc" cx="50%" cy="42%" r="62%">
      <stop offset="0%" stop-color="#06141f" />
      <stop offset="64%" stop-color="#030c14" />
      <stop offset="100%" stop-color="#010305" />
    </radialGradient>
    <linearGradient id="vfade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#010305" stop-opacity="0" />
      <stop offset="100%" stop-color="#010305" stop-opacity="0.6" />
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#010305" />
  <rect width="1200" height="630" fill="url(#bloom)" />

  <g stroke="#38e1ff" stroke-opacity="0.14">
    <line x1="600" y1="500" x2="-260" y2="630" />
    <line x1="600" y1="500" x2="120" y2="630" />
    <line x1="600" y1="500" x2="420" y2="630" />
    <line x1="600" y1="500" x2="600" y2="630" />
    <line x1="600" y1="500" x2="780" y2="630" />
    <line x1="600" y1="500" x2="1080" y2="630" />
    <line x1="600" y1="500" x2="1460" y2="630" />
  </g>
  <rect x="120" y="499" width="960" height="2" fill="#38e1ff" fill-opacity="0.45" />

  <!-- brand: emblem + wordmark -->
  <g transform="translate(80, 64) scale(0.7)">
    <circle cx="40" cy="40" r="34" fill="url(#disc)" />
    <circle cx="40" cy="40" r="34" stroke="#38e1ff" stroke-opacity="0.3" stroke-width="5" />
    <circle cx="40" cy="40" r="34" stroke="url(#rim)" stroke-width="2.4"
      stroke-linecap="round" stroke-dasharray="150 63.6" stroke-dashoffset="31.8" />
    <path d="M31 25 L31 42 Q31 50 40 50 Q49 50 49 42 L49 25"
      stroke="url(#rim)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
  </g>
  <text x="146" y="98" font-family="DejaVu Sans Mono, monospace" font-size="22"
    letter-spacing="4" fill="#dceefb">CARLOS ULLOQUE</text>

  <!-- eyebrow -->
  <text x="80" y="268" font-family="DejaVu Sans Mono, monospace" font-size="24"
    letter-spacing="5" fill="#38e1ff">${esc(eyebrow.toUpperCase())}</text>

  <!-- title -->
  <text x="80" y="${titleY}" font-family="DejaVu Sans, sans-serif" font-weight="bold"
    font-size="${fontSize}" fill="#eef6ff">${tspans}</text>

  <!-- domain -->
  <text x="80" y="578" font-family="DejaVu Sans Mono, monospace" font-size="24"
    letter-spacing="3" fill="#38e1ff" fill-opacity="0.85">ulloque.com</text>

  <rect width="1200" height="630" fill="url(#vfade)" />
</svg>`;
}

mkdirSync(outDir, { recursive: true });

const files = readdirSync(notesDir).filter((f) => /\.mdx?$/.test(f));
let made = 0;
for (const file of files) {
  const slug = basename(file, file.endsWith('.mdx') ? '.mdx' : '.md');
  if (restricted.has(slug)) {
    console.log('skip (restricted):', slug);
    continue;
  }
  const text = readFileSync(resolve(notesDir, file), 'utf-8');
  const title = frontmatter(text, 'title');
  const category = frontmatter(text, 'category') || 'note';
  const buffer = Buffer.from(svg(title, category.replace(/-/g, ' ')));
  await sharp(buffer, { density: 144 })
    .resize(1200, 630, { fit: 'cover' })
    .png()
    .toFile(resolve(outDir, `${slug}.png`));
  made += 1;
  console.log('wrote og/notes/' + slug + '.png  —  ' + title);
}
console.log(`done: ${made} OG image(s)`);
