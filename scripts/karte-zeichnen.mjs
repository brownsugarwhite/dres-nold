/**
 * Zeichnet die stilisierte Karte von Bietigheim als SVG — aus den
 * OpenStreetMap-Daten des Gestaltungs-Handoffs vom 18. September 2026
 * (`docs/referenz/assets/karte-daten.json`, © OpenStreetMap-Mitwirkende,
 * ODbL).
 *
 * Warum ein eigenes Skript: Der Handoff liefert ein 16:9-Bild
 * (`public/bilder/deko/karte-bietigheim.svg`, 1920 × 1080, Praxis in der
 * Mitte). Auf Handys ist der Kontaktbereich aber hoch statt breit, und
 * unter dem Formular blieb nur der leere Grund (Florian, 26. September
 * 2026). Die Daten reichen nach oben und unten fast doppelt so weit wie
 * das Bild — daraus entsteht hier ein HOCHKANTES Bild mit der Praxis im
 * oberen Drittel, das nach unten weit über die Marke hinausreicht.
 *
 * Aufruf:  node scripts/karte-zeichnen.mjs
 * Ergebnis: public/bilder/deko/karte-bietigheim-hoch.svg
 *
 * Die Abbildung ist dieselbe wie im Handoff: Datenpunkt (0, 0) ist die
 * Praxis, ein Datenmaß entspricht 1920/1400 Bildpunkten. Farben und
 * Strichstärken sind aus dem Handoff-SVG übernommen, damit beide Bilder
 * gleich aussehen. Das Querformat wird NICHT neu gezeichnet — es bleibt
 * die Datei des Handoffs.
 *
 * Ebenen in den Daten:  aa  Flächen (hell)      ww  Wohnflächen
 *                       gr  Grün                ws  Wasser
 *                       g   Gebäude             K/M/G  Straßen (klein/mittel/groß)
 *                       rl  Bahn
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const hier = dirname(fileURLToPath(import.meta.url));
const daten = JSON.parse(readFileSync(join(hier, '../docs/referenz/assets/karte-daten.json'), 'utf8'));

/* ---- Das Bild ---- */
const K = 1920 / 1400;            // Bildpunkte je Datenmaß (wie im Handoff)
const BREIT = 1080;
const HOCH = 1646;                // Datenbereich y von −400 bis +800
const PRAXIS_X = BREIT / 2;       // Datenpunkt (0, 0) …
const PRAXIS_Y = Math.round(400 * K * 10) / 10;   // … im oberen Drittel: 548,6
const RAND = 40;                  // Formen knapp außerhalb des Bildes noch mitnehmen

const f = (n) => (Math.round(n * 10) / 10).toFixed(1);
const px = (x) => PRAXIS_X + x * K;
const py = (y) => PRAXIS_Y + y * K;

/** Zahlen einer Form: Rechteck „x,y,w,h" oder Punkte „x,y x,y …" */
function zahlen(s) {
  return s.match(/-?\d+(?:\.\d+)?/g).map(Number);
}

/** Liegt die Form (irgendwo) im Bild? */
function imBild(s) {
  const z = zahlen(s);
  const xs = [], ys = [];
  if (s.includes(' ')) { for (let i = 0; i < z.length; i += 2) { xs.push(z[i]); ys.push(z[i + 1]); } }
  else { xs.push(z[0], z[0] + z[2]); ys.push(z[1], z[1] + z[3]); }
  const l = Math.min(...xs.map(px)), r = Math.max(...xs.map(px));
  const o = Math.min(...ys.map(py)), u = Math.max(...ys.map(py));
  return r >= -RAND && l <= BREIT + RAND && u >= -RAND && o <= HOCH + RAND;
}

/** Eine Form als Pfadstück */
function pfad(s, schliessen) {
  const z = zahlen(s);
  if (!s.includes(' ')) {
    // Rechteck: x, y, Breite, Höhe
    return `M${f(px(z[0]))},${f(py(z[1]))}h${f(z[2] * K)}v${f(z[3] * K)}h${f(-z[2] * K)}Z`;
  }
  let d = '';
  for (let i = 0; i < z.length; i += 2) d += `${i ? 'L' : 'M'}${f(px(z[i]))},${f(py(z[i + 1]))}`;
  return schliessen ? `${d}Z` : d;
}

function ebene(name, schliessen) {
  return (daten[name] ?? []).filter(imBild).map((s) => pfad(s, schliessen)).join(' ');
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BREIT} ${HOCH}" width="${BREIT}" height="${HOCH}">
<!-- Kartengrundlage: © OpenStreetMap-Mitwirkende (ODbL). Gezeichnet von scripts/karte-zeichnen.mjs; Praxis bei ${PRAXIS_X} / ${PRAXIS_Y}. -->
<defs><radialGradient id="rand" cx="50%" cy="50%" r="75%"><stop offset="55%" stop-color="#f5f3f4" stop-opacity="0"></stop><stop offset="100%" stop-color="#f5f3f4" stop-opacity=".85"></stop></radialGradient></defs>
<rect width="${BREIT}" height="${HOCH}" fill="#f5f3f4"></rect>
<path fill="#f0edee" d="${ebene('aa', true)}"></path>
<path fill="#eeeaec" d="${ebene('ww', true)}"></path>
<path fill="#e6eae3" d="${ebene('gr', true)}"></path>
<path fill="#dde5ea" stroke="#cfdbe2" stroke-width="4" stroke-linejoin="round" d="${ebene('ws', false)}"></path>
<path fill="#dfd9dc" d="${ebene('g', true)}"></path>
<g fill="none" stroke-linecap="round" stroke-linejoin="round">
<path stroke="#ffffff" stroke-width="9" d="${ebene('K', false)}"></path>
<path stroke="#ffffff" stroke-width="14" d="${ebene('M', false)}"></path>
<path stroke="#ffffff" stroke-width="20" d="${ebene('G', false)}"></path>
<path stroke="#d6cfd3" stroke-width="1.5" d="${ebene('M', false)}"></path>
<path stroke="#cfc7cc" stroke-width="2" d="${ebene('G', false)}"></path>
<path stroke="#cfc8cc" stroke-width="3" stroke-dasharray="16 12" d="${ebene('rl', false)}"></path>
</g>
<rect width="${BREIT}" height="${HOCH}" fill="url(#rand)"></rect>
</svg>
`;

const ziel = join(hier, '../public/bilder/deko/karte-bietigheim-hoch.svg');
writeFileSync(ziel, svg);
console.log(`geschrieben: ${ziel} (${Math.round(svg.length / 1024)} KB, ${BREIT} × ${HOCH}, Praxis bei ${PRAXIS_X} / ${PRAXIS_Y})`);
