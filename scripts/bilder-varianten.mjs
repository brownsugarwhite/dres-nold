/**
 * Kleine Bildvarianten für die Beitragskarten — läuft vor jedem Build
 * (`prebuild` in package.json).
 *
 * Die Karten auf der Startseite zeigen die Beitragsbilder rund 340 px
 * breit; die Originale sind 1 300 px breit und 120 bis 170 KB groß.
 * Safari dekodiert so große Bilder asynchron — und beim Erfassen für
 * den Seitenwechsel blitzte das Bild der Karte dann für ein Bild weiß
 * auf (Florian, 27. September 2026). Die Leistungskacheln mit ihren
 * kleinen SVG-Symbolen kennen das nicht. Deshalb bekommt jede Karte
 * eine Variante mit 600 px Breite (rund 30 bis 50 KB), die Safari
 * synchron dekodiert; die Beitragsseite zeigt weiter das Original.
 *
 * Die Varianten liegen neben dem Original (`name-600.jpg`), stehen in
 * .gitignore und entstehen bei jedem Build neu — aus genau den Bildern,
 * die in src/content/bereiche.json eingetragen sind: Beitragsbilder der
 * Blogs (600 px) und Titelbilder der eigenen Seiten, deren breite
 * Ankündigungskarte eine 900er-Variante bekommt (Oktober 2026).
 */
import { readFile, stat, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const wurzel = new URL('..', import.meta.url).pathname;
const inhalt = JSON.parse(await readFile(path.join(wurzel, 'src/content/bereiche.json'), 'utf8'));

/** [Bild, Breite] je Karte */
const auftraege = inhalt.eintraege.flatMap((b) =>
  b.typ === 'blog' ? (b.beitraege ?? []).map((p) => [p.bild, 600])
    : b.typ === 'seite' ? [[b.titelbild, 900]]
      : [],
);

export function varianteFuer(bild, breite) {
  const m = /^(.*)\.(jpe?g|png)$/i.exec(bild || '');
  return m ? `${m[1]}-${breite}.${m[2]}` : null;
}

let erzeugt = 0;
for (const [bild, breite] of auftraege) {
  const ziel = varianteFuer(bild, breite);
  if (!ziel) continue;
  const quelle = path.join(wurzel, 'public', bild);
  const ausgabe = path.join(wurzel, 'public', ziel);
  let q, a;
  try { q = await stat(quelle); } catch { console.warn(`bilder-varianten: ${bild} fehlt`); continue; }
  try { a = await stat(ausgabe); } catch { a = null; }
  if (a && a.mtimeMs >= q.mtimeMs) continue;
  await mkdir(path.dirname(ausgabe), { recursive: true });
  const s = sharp(quelle).resize({ width: breite, withoutEnlargement: true });
  if (/\.png$/i.test(ziel)) await s.png({ compressionLevel: 9 }).toFile(ausgabe);
  else await s.jpeg({ quality: 78, mozjpeg: true }).toFile(ausgabe);
  erzeugt++;
}
console.log(`bilder-varianten: ${erzeugt} Variante(n) erzeugt`);
