/*
  Gemeinsame Hilfen der Prüfskripte unter tests/.

  Diese Skripte laufen NUR beim Entwickeln (nicht im Workflow): Sie
  starten einen kleinen Server auf `dist/` und steuern Chromium über
  Playwright. Playwright findet den Browser über PLAYWRIGHT_BROWSERS_PATH;
  heruntergeladen wird nichts.
*/
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { chromium } from 'playwright';

export const WURZEL = new URL('..', import.meta.url).pathname;
const DIST = join(WURZEL, 'dist');

const TYPEN = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.xml': 'application/xml',
};

/** Liefert `dist/` aus — mit Verzeichnis-Adressen wie Cloudflare Pages. */
export async function serverStarten(ordner = DIST) {
  const server = http.createServer(async (anfrage, antwort) => {
    const pfad = decodeURIComponent(new URL(anfrage.url, 'http://x').pathname);
    let datei = normalize(join(ordner, pfad));
    if (!datei.startsWith(ordner)) { antwort.writeHead(403).end(); return; }
    try {
      if ((await stat(datei)).isDirectory()) datei = join(datei, 'index.html');
      const inhalt = await readFile(datei);
      antwort.writeHead(200, { 'content-type': TYPEN[extname(datei)] ?? 'application/octet-stream' });
      antwort.end(inhalt);
    } catch {
      antwort.writeHead(404).end('nicht gefunden');
    }
  });
  await new Promise((fertig) => server.listen(0, '127.0.0.1', fertig));
  const { port } = server.address();
  return { adresse: `http://127.0.0.1:${port}`, schliessen: () => server.close() };
}

export const GROESSEN = {
  handy: { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  tablet: { width: 768, height: 1024, isMobile: false, hasTouch: false, deviceScaleFactor: 1 },
  desktop: { width: 1440, height: 900, isMobile: false, hasTouch: false, deviceScaleFactor: 1 },
};

export async function browserStarten() {
  return chromium.launch();
}

/** Neue Seite in der gewünschten Größe. */
export async function seiteOeffnen(browser, groesse, optionen = {}) {
  const { width, height, ...rest } = typeof groesse === 'string' ? GROESSEN[groesse] : groesse;
  const kontext = await browser.newContext({ viewport: { width, height }, ...rest, ...optionen });
  const seite = await kontext.newPage();
  return seite;
}

/**
 * Hält alles an, was zwischen zwei Aufnahmen von selbst weiterläuft:
 * den bewegten Verlauf in den Überschriften, das endlose Bilderband und
 * das Einblenden beim Hereinscrollen. So unterscheiden sich zwei
 * Aufnahmen nur durch das, was sich wirklich geändert hat.
 */
export const RUHE_CSS = `
  *, *::before, *::after { caret-color: transparent !important; }
  :is(main, [data-verlauf]) :is(h1, h2), .verlauf, .bereich__titel {
    background: none !important; -webkit-text-fill-color: currentColor !important;
  }
  [data-rein] { opacity: 1 !important; transform: none !important; translate: none !important; filter: none !important; }
  .galerie *, .ozband * { animation-play-state: paused !important; }
`;

/** Wartet, bis Schriften stehen und zwei Bilder gezeichnet sind. */
export async function ruhigWerden(seite) {
  await seite.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
}
