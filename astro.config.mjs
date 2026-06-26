// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://naturalcurlyhair.co.uk',
  redirects: {
    '/how-we-review/': '/faqs/#how-we-review',
    '/how-we-test/':   '/faqs/#how-we-test',
    '/products/':      '/reviews/',
  },
  integrations: [
    tailwind({ configFile: './tailwind.config.cjs' }),
    mdx(),
    sitemap(),
  ],
});
