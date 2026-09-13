/**
 * Prüft beim Bauen der Seite alle Inhaltsdateien gegen das Schema.
 *
 * Wird vom Seitenrahmen (layouts/Basis.astro) aufgerufen — also bei
 * jedem Build. Stimmt eine Datei nicht, bricht der Build mit einer
 * lesbaren Meldung ab. Das ist Absicht: lieber kein neuer Stand als
 * eine kaputte Seite.
 */
import { bereiche, pruefen, zusatzregeln } from './schema';

import hinweis from './hinweis.json';
import oeffnungszeiten from './oeffnungszeiten.json';
import leistungen from './leistungen.json';
import neuigkeiten from './neuigkeiten.json';
import navigation from './navigation.json';
import team from './team.json';
import galerie from './galerie.json';
import abschnitte from './abschnitte.json';
import stellen from './stellen.json';
import seite from './seite.json';

const dateien = {
  hinweis,
  oeffnungszeiten,
  leistungen,
  neuigkeiten,
  navigation,
  team,
  galerie,
  abschnitte,
  stellen,
  seite,
};

let geprueft = false;

export function alleInhaltePruefen(): void {
  if (geprueft) return;
  geprueft = true;

  const probleme: string[] = [];
  for (const bereich of bereiche) {
    const daten = dateien[bereich];
    const ergebnis = pruefen(bereich, daten);
    if (!ergebnis.ok) probleme.push(...ergebnis.fehler.map((f) => `${bereich}.json → ${f}`));
    else probleme.push(...zusatzregeln(bereich, ergebnis.daten).map((f) => `${bereich}.json → ${f}`));
  }

  if (probleme.length) {
    throw new Error(
      `Inhaltsdateien fehlerhaft — bitte in src/content/ korrigieren:\n  ${probleme.join('\n  ')}`,
    );
  }
}
