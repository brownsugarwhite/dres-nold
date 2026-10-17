/**
 * Kleine Skizzen für die Redaktion: Wie sieht ein Block, eine
 * Bereichsart, eine Abschnittsart auf der Seite aus? Ein Bild sagt das
 * schneller als ein Erklärsatz.
 *
 * Linien in `currentColor`, Flächen in der hellen Hausfarbe — die
 * Gestaltung (redaktion.css, `.skizze`) setzt beides.
 */

const svg = (inhalt: string, b = 120, h = 72) =>
  `<svg class="skizze" viewBox="0 0 ${b} ${h}" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">${inhalt}</svg>`;

/** Textzeilen ab (x, y), `n` Stück, Breite b */
const zeilen = (x: number, y: number, n: number, b: number) =>
  Array.from({ length: n }, (_, i) => `<line x1="${x}" y1="${y + i * 7}" x2="${x + (i === n - 1 ? b * 0.6 : b)}" y2="${y + i * 7}"/>`).join('');

const flaeche = (x: number, y: number, b: number, h: number) =>
  `<rect x="${x}" y="${y}" width="${b}" height="${h}" rx="2" class="skizze__flaeche"/>`;

const titel = (x: number, y: number, b: number) => `<line x1="${x}" y1="${y}" x2="${x + b}" y2="${y}" stroke-width="4"/>`;

export const SKIZZEN: Record<string, string> = {
  /* ---- Arten eigener Bereiche ---- */
  blog: svg(`${titel(10, 12, 40)}${flaeche(10, 22, 30, 20)}${flaeche(45, 22, 30, 20)}${flaeche(80, 22, 30, 20)}${zeilen(10, 50, 2, 30)}${zeilen(45, 50, 2, 30)}${zeilen(80, 50, 2, 30)}`),
  abschnitt: svg(`${titel(10, 12, 50)}${flaeche(10, 22, 46, 38)}${zeilen(64, 26, 5, 46)}`),
  seite: svg(`${flaeche(10, 10, 56, 52)}<line x1="74" y1="20" x2="96" y2="20" stroke-width="1"/>${titel(74, 32, 32)}${zeilen(74, 44, 2, 36)}<path d="M74 60 l14 0 m-4 -3 l4 3 l-4 3"/>`),

  /* ---- Abschnittsarten ---- */
  text: svg(`${flaeche(10, 12, 44, 46)}${titel(62, 16, 34)}${zeilen(62, 28, 5, 48)}`),
  kacheln: svg(`${titel(10, 12, 40)}<circle cx="20" cy="30" r="6"/><circle cx="58" cy="30" r="6"/><circle cx="96" cy="30" r="6"/>${zeilen(10, 44, 3, 26)}${zeilen(48, 44, 3, 26)}${zeilen(86, 44, 3, 26)}`),
  kapitel: svg(`<line x1="10" y1="16" x2="110" y2="16" stroke-width="1"/>${titel(10, 30, 70)}${zeilen(10, 44, 3, 70)}`),

  /* ---- Blöcke der Startseite (Seitenplan) ---- */
  start: svg(`<path d="M48 22 c-6 0-9 5-8 11 c1 6 2 12 4 17 c1 3 4 3 4 0 c1-4 2-7 6-7 c4 0 5 3 6 7 c0 3 3 3 4 0 c2-5 3-11 4-17 c1-6-2-11-8-11 c-3 0-4 2-6 2 c-2 0-3-2-6-2z"/>`),
  sprechstunden: svg(`<path d="M10 12 h100 v34 h-74 l-8 14 l-2-14 h-16 z" class="skizze__flaeche"/>${zeilen(18, 22, 3, 30)}${zeilen(60, 22, 3, 30)}`),
  willkommen: svg(`${titel(10, 26, 42)}${titel(10, 38, 50)}<line x1="68" y1="18" x2="68" y2="54" stroke-width="1"/>${zeilen(76, 22, 2, 32)}<rect x="76" y="40" width="16" height="8" rx="4"/><rect x="95" y="40" width="16" height="8" rx="4"/>`),
  galerie: svg(`${flaeche(4, 20, 34, 32)}${flaeche(43, 20, 34, 32)}${flaeche(82, 20, 34, 32)}`),
  leistungen: svg(`${titel(10, 12, 40)}<rect x="10" y="22" width="30" height="20" rx="2"/><rect x="45" y="22" width="30" height="20" rx="2"/><rect x="80" y="22" width="30" height="20" rx="2"/><rect x="10" y="46" width="30" height="20" rx="2"/><rect x="45" y="46" width="30" height="20" rx="2"/>`),
  team: svg(`${flaeche(4, 8, 112, 24)}<circle cx="30" cy="48" r="7"/><circle cx="60" cy="48" r="7"/><circle cx="90" cy="48" r="7"/>${zeilen(22, 62, 1, 16)}${zeilen(52, 62, 1, 16)}${zeilen(82, 62, 1, 16)}`),
  stellen: svg(`${titel(10, 12, 50)}<line x1="10" y1="26" x2="110" y2="26" stroke-width="1"/>${zeilen(10, 33, 1, 60)}<line x1="10" y1="42" x2="110" y2="42" stroke-width="1"/>${zeilen(10, 49, 1, 50)}<line x1="10" y1="58" x2="110" y2="58" stroke-width="1"/>`),
  kontakt: svg(`${flaeche(4, 8, 112, 58)}${titel(12, 20, 36)}${zeilen(12, 32, 3, 36)}<rect x="66" y="16" width="44" height="42" rx="3" fill="#fff"/>${zeilen(72, 26, 4, 30)}`),
  fuss: svg(`<line x1="4" y1="30" x2="116" y2="30" stroke-width="1" stroke-dasharray="1 3"/>${zeilen(30, 44, 1, 26)}${zeilen(64, 44, 1, 26)}`),
  verweis: svg(`<rect x="22" y="26" width="76" height="20" rx="10"/><path d="M80 36 h8 m-3 -3 l3 3 l-3 3"/>${zeilen(32, 36, 1, 34)}`),
  hinweis: svg(`${flaeche(4, 6, 112, 60)}<rect x="28" y="16" width="64" height="40" rx="4" fill="#fff"/>${titel(36, 28, 30)}${zeilen(36, 38, 2, 46)}`),
};
