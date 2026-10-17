/**
 * Prüft beim Bauen der Seite alle Inhaltsdateien gegen das Schema.
 *
 * Wird vom Seitenrahmen (layouts/Basis.astro) und von content/inhalte.ts
 * aufgerufen — also bei jedem Build. Stimmt eine Datei nicht, bricht der
 * Build mit einer lesbaren Meldung ab. Das ist Absicht: lieber kein neuer
 * Stand als eine kaputte Seite.
 */
import { dateien as dateinamen, pruefen, zusatzregeln, zusammenhangPruefen } from './schema';
import type { Seitenaufbau, Bereich } from './schema';

import hinweis from './hinweis.json';
import oeffnungszeiten from './oeffnungszeiten.json';
import leistungen from './leistungen.json';
import team from './team.json';
import galerie from './galerie.json';
import stellen from './stellen.json';
import startseite from './startseite.json';
import seite from './seite.json';
import seitenaufbau from './seitenaufbau.json';
import bereiche from './bereiche.json';

export const rohdaten = {
  hinweis,
  oeffnungszeiten,
  leistungen,
  team,
  galerie,
  stellen,
  startseite,
  seite,
  seitenaufbau,
  bereiche,
};

/** Die geprüften Daten, mit den Vorgabewerten des Schemas ergänzt */
export const geprueft: Record<string, unknown> = {};

let fertig = false;

export function alleInhaltePruefen(): void {
  if (fertig) return;
  fertig = true;

  const probleme: string[] = [];
  for (const name of dateinamen) {
    const ergebnis = pruefen(name, rohdaten[name]);
    if (!ergebnis.ok) {
      probleme.push(...ergebnis.fehler.map((f) => `${name}.json → ${f}`));
      continue;
    }
    geprueft[name] = ergebnis.daten;
    probleme.push(...zusatzregeln(name, ergebnis.daten).map((f) => `${name}.json → ${f}`));
  }
  if (!probleme.length) {
    probleme.push(
      ...zusammenhangPruefen(geprueft.seitenaufbau as Seitenaufbau, geprueft.bereiche as { eintraege: Bereich[] }),
    );
  }

  if (probleme.length) {
    throw new Error(
      `Inhaltsdateien fehlerhaft — bitte in src/content/ korrigieren:\n  ${probleme.join('\n  ')}`,
    );
  }
}
