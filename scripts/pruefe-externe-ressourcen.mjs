/**
 * Prüft das gebaute HTML: Es darf nichts von fremden Servern nachladen.
 * Das ist die Grundlage dafür, dass kein Cookie-Banner nötig ist —
 * ohne Ausnahme (Google Maps öffnet im Kontakt erst auf Klick in einem
 * neuen Fenster, als schlichter Verweis).
 *
 * Aufruf: node scripts/pruefe-externe-ressourcen.mjs   (nach npm run build)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ERLAUBTE_HOSTS = ['www.dres-nold.de', 'dres-nold.de'];

function htmlDateien(ordner) {
  const ergebnis = [];
  for (const name of readdirSync(ordner)) {
    const pfad = join(ordner, name);
    if (statSync(pfad).isDirectory()) ergebnis.push(...htmlDateien(pfad));
    else if (name.endsWith('.html')) ergebnis.push(pfad);
  }
  return ergebnis;
}

const probleme = [];
for (const datei of htmlDateien('dist')) {
  const html = readFileSync(datei, 'utf8');
  /* Nur Attribute, die etwas LADEN: src, href in link-Tags, srcset */
  const muster = /<(script|link|img|iframe|source|video|audio|object|embed)\b[^>]*?\s(?:src|href|srcset)=["']https?:\/\/([^/"']+)/gi;
  let treffer;
  while ((treffer = muster.exec(html))) {
    if (!ERLAUBTE_HOSTS.includes(treffer[2])) probleme.push(`${datei}: <${treffer[1]}> lädt von ${treffer[2]}`);
  }
}

if (probleme.length) {
  console.error('Fremde Ressourcen gefunden — das bricht die Cookie-Banner-Freiheit:\n  ' + probleme.join('\n  '));
  process.exit(1);
}
console.log('Keine fremden Ressourcen im HTML.');
