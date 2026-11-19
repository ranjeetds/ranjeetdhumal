// @ts-check
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://ranjeetdhumal.com',
  output: 'static',

  // Clean, extensionless URLs (/knowledge, not /knowledge/). Pages are emitted as
  // `knowledge.html`, which Cloudflare static assets serve at `/knowledge` without a redirect.
  trailingSlash: 'never',
  build: { format: 'file' },

  integrations: [react(), mdx(), sitemap()],

  // Prefetch internal links on hover/focus so cross-document view transitions feel instant.
  prefetch: { prefetchAll: true },

  markdown: {
    shikiConfig: {
      // Dual themes are emitted as CSS variables; `global.css` picks one per colour scheme.
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
      defaultColor: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
