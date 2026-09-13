import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Statische Ausgabe: Astro erzeugt reines HTML.
// Die serverseitigen Teile (Redaktion speichern, Kontaktformular) laufen
// getrennt davon als Cloudflare Pages Functions unter /functions.
export default defineConfig({
  site: 'https://www.dres-nold.de',
  output: 'static',
  integrations: [
    sitemap({
      // Die Redaktion gehört nicht in die Sitemap
      filter: (seite) => !seite.includes('/admin'),
    }),
  ],
  build: {
    // Saubere URLs ohne .html — passt zum bisherigen Webflow-Verhalten
    format: 'directory',
  },
  image: {
    // Bilder werden beim Build in moderne Formate umgewandelt
    formats: ['avif', 'webp'],
  },
  vite: {
    build: {
      // Skripte immer als eigene Dateien ausliefern, nie eingebettet.
      // Grund: Die Sicherheitsregeln in public/_headers (Content-Security-
      // Policy) erlauben nur Skripte aus eigenen Dateien — eingebettete
      // würden vom Browser blockiert.
      assetsInlineLimit: 0,
    },
  },
});
