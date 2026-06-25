// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://naturalcurlyhair.co.uk',
  integrations: [
    tailwind({ configFile: './tailwind.config.cjs' }),
    mdx(),
    sitemap(),
  ],
});
