import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ulloque.com',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/cv'),
    }),
  ],
});
