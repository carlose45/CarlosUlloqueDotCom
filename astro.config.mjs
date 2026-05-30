import { readFileSync } from 'node:fs';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Single source of truth for restricted content (see src/config/access.ts).
// Restricted entries are noindex and excluded from the sitemap while restricted.
const restricted = JSON.parse(
  readFileSync(
    new URL('./src/config/restricted-content.json', import.meta.url),
    'utf-8',
  ),
);
const restrictedPaths = [
  ...restricted.notes.map((slug) => `/notes/${slug}`),
  ...restricted.labs.map((slug) => `/labs/${slug}`),
  ...restricted.projects.map((slug) => `/projects/${slug}`),
];

export default defineConfig({
  site: 'https://ulloque.com',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/cv') &&
        !restrictedPaths.some((path) => page.includes(path)),
    }),
  ],
});
