import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ulloque.com',
  integrations: [mdx()],
});
