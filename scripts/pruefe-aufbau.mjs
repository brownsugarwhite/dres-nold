/*
  Prüft die gebaute Seite (dist/) auf tote Verweise innerhalb der Seite:
  Jede Adresse wie `/dentosophie/#mundatmung` muss als Seite existieren,
  und die Sprungmarke muss es auf dieser Seite geben.

    node scripts/pruefe-aufbau.mjs            # meldet, bricht nicht ab
    node scripts/pruefe-aufbau.mjs --streng   # Fehlercode bei Funden

  Warum nur melden: Ein toter Verweis entsteht fast immer in der
  Redaktion — etwa wenn ein Abschnitt umbenannt wird, auf den ein Knopf
  zeigt. Bräche deswegen der Build ab, ginge die ganze Änderung der
  Praxis nicht online, ohne dass sie erfährt, warum. Die Redaktion warnt
  schon beim Speichern; hier steht es zusätzlich im Protokoll.
*/
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const streng = process.argv.includes('--streng');

async function* htmlDateien(ordner) {
  for (const eintrag of await readdir(ordner, { withFileTypes: true })) {
    const pfad = join(ordner, eintrag.name);
    if (eintrag.isDirectory()) yield* htmlDateien(pfad);
    else if (eintrag.name.endsWith('.html')) yield pfad;
  }
}

/** Adresse einer Datei: dist/leistungen/prophylaxe/index.html → /leistungen/prophylaxe/ */
const adresseVon = (datei) => '/' + relative(DIST, datei).replace(/index\.html$/, '');

const seiten = new Map(); // Adresse → Menge der ids
const verweise = []; // [von, href]
for await (const datei of htmlDateien(DIST)) {
  const html = await readFile(datei, 'utf8');
  const adresse = adresseVon(datei);
  if (adresse.startsWith('/admin')) continue;
  seiten.set(adresse, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  for (const m of html.matchAll(/\shref="([^"]+)"/g)) verweise.push([adresse, m[1]]);
}

const funde = [];
for (const [von, href] of verweise) {
  if (!href.startsWith('/') && !href.startsWith('#')) {
    // „www.beispiel.de" ohne https:// wird zum Pfad auf dieser Seite
    if (!/^[a-z][a-z0-9+.-]*:/i.test(href)) funde.push(`${von} → ${href}: Adresse ohne https:// oder /`);
    continue;
  }
  if (href.startsWith('//')) continue;
  const url = new URL(href, `https://x${von}`);
  let pfad = url.pathname;
  // Dateien (Bilder, PDFs, Skripte) prüft der Build selbst nicht — hier nur Seiten
  if (/\.[a-z0-9]+$/i.test(pfad)) continue;
  if (!pfad.endsWith('/')) pfad += '/';
  const ids = seiten.get(pfad);
  if (!ids) {
    funde.push(`${von} → ${href}: Seite gibt es nicht`);
    continue;
  }
  const marke = decodeURIComponent(url.hash.slice(1));
  // #start ist der Seitenanfang und braucht kein Element
  if (marke && marke !== 'start' && !ids.has(marke)) funde.push(`${von} → ${href}: Sprungmarke fehlt`);
}

const eindeutig = [...new Set(funde)];
if (eindeutig.length) {
  console.log(`Tote Verweise (${eindeutig.length}):`);
  for (const f of eindeutig) console.log('  ' + f);
  if (streng) process.exit(1);
} else {
  console.log(`Alle internen Verweise führen ins Ziel (${seiten.size} Seiten).`);
}
