/**
 * Die Inhalte für die Seite — geprüft, mit den Vorgabewerten des Schemas
 * ergänzt und mit Typen.
 *
 * Komponenten holen Seitenaufbau, Bereiche und Menü von hier statt die
 * JSON-Dateien selbst zu laden. Nur so gelten die Vorgabewerte aus
 * schema.ts (ein Abschnitt ohne `knoepfe` hat dann eine leere Liste,
 * keinen fehlenden Wert).
 */
import { alleInhaltePruefen, geprueft } from './laden';
import type { Bereich, Seitenaufbau } from './schema';
import { menueBauen, sichtbareBloecke, type Daten } from '../lib/aufbau';

alleInhaltePruefen();

export const daten = geprueft as unknown as Daten & Record<string, unknown>;

export const seitenaufbau = daten.seitenaufbau as Seitenaufbau;

export const bereiche: Bereich[] = daten.bereiche.eintraege;

/** Ein Bereich nach Kennung */
export const bereichNach = (id: string) => bereiche.find((b) => b.id === id);

/** Aktive Bereiche einer Art */
export const seiten = bereiche.filter((b): b is Extract<Bereich, { typ: 'seite' }> => b.typ === 'seite' && b.aktiv);
export const blogs = bereiche.filter((b): b is Extract<Bereich, { typ: 'blog' }> => b.typ === 'blog' && b.aktiv);

/** Die Blöcke der Startseite, die etwas zu zeigen haben */
export const bloecke = sichtbareBloecke(daten);

/** Das Menü in der Reihenfolge der Seite */
export const menue = menueBauen(daten);
