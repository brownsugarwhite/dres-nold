/**
 * Schema der Inhaltsdateien — die eine Stelle, die festlegt, welche
 * Felder es gibt und was darin stehen darf.
 *
 * Verwendet an zwei Stellen:
 *   • beim Bauen der Seite (src/content/laden.ts): stimmt eine Datei
 *     nicht, bricht der Build ab — mit Absicht, damit nie eine kaputte
 *     Seite online geht
 *   • beim Speichern aus der Redaktion (functions/api/save.ts): nur
 *     gültige Inhalte kommen ins Repo
 *
 * Neue Felder: hier eintragen, dann in der Komponente verwenden und in
 * src/admin/bereiche.ts der Redaktion zeigen. Ein Feld, das hier fehlt,
 * wird beim Speichern verworfen (`.strip()` ist Zod-Standard).
 */
import { z } from 'zod';

/* ---------- Bausteine ---------- */

/** JJJJ-MM-TT oder leer */
export const datum = z
  .string()
  .regex(/^(\d{4}-\d{2}-\d{2})?$/, 'Datum im Format JJJJ-MM-TT');

/** Pfad unterhalb von public/ (z. B. /bilder/team/paul.jpg) oder leer */
export const pfad = z
  .string()
  .regex(/^(\/[a-z0-9._\-/]+)?$/i, 'Pfad muss mit / beginnen und darf nur Buchstaben, Ziffern, . _ - enthalten');

/** Kennung, die in Adressen vorkommt: klein, Bindestriche */
export const kennung = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Nur Kleinbuchstaben, Ziffern und Bindestriche');

/** Freier Text, auch leer */
const text = z.string();

/** Redaktions-HTML (Absätze, Listen, Tabellen) */
const richtext = z.string();

const basisEintrag = {
  aktiv: z.boolean(),
  position: z.number(),
};

/* ---------- Die Dateien ---------- */

export const hinweisSchema = z.object({
  _hinweis_fuer_die_redaktion: text.optional(),
  aktiv: z.boolean(),
  titel: text.min(1),
  text: richtext,
  von: datum,
  bis: datum,
  mehr_erfahren_text: text,
  mehr_erfahren_ziel: text,
  einmal_pro_besuch: z.boolean(),
});

const zeitenListe = z.object({
  titel: text.min(1),
  zeilen: z.array(
    z.object({
      tag: text.min(1),
      vormittag: text,
      nachmittag: text,
    }),
  ),
  zusatz: text,
});

export const oeffnungszeitenSchema = z.object({
  _hinweis_fuer_die_redaktion: text.optional(),
  zahnaerztlich: zeitenListe,
  kieferorthopaedisch: zeitenListe,
  telefonisch: zeitenListe,
});

export const leistungenSchema = z.object({
  _hinweis_fuer_die_redaktion: text.optional(),
  kategorien: z.array(
    z.object({
      id: kennung,
      titel: text.min(1),
      position: z.number(),
      aktiv: z.boolean(),
      kurz: text,
      /** Erklärtext zwischen Kategorieüberschrift und den Kacheln */
      beschreibung: richtext.optional(),
      icon: pfad,
    }),
  ),
  eintraege: z.array(
    z.object({
      id: kennung,
      ...basisEintrag,
      kategorie: kennung,
      titel: text.min(1),
      kurz: text,
      icon: pfad,
      inhalt: richtext,
    }),
  ),
});

export const neuigkeitenSchema = z.object({
  _hinweis_fuer_die_redaktion: text.optional(),
  titel: text.min(1),
  einleitung: text,
  eintraege: z.array(
    z.object({
      id: kennung,
      ...basisEintrag,
      datum,
      titel: text.min(1),
      kurz: text,
      bild: pfad,
      bild_alt: text,
      inhalt: richtext,
      dateien: z.array(
        z.object({
          datei: pfad,
          titel: text,
          beschreibung: text,
        }),
      ),
    }),
  ),
});

export const navigationSchema = z.object({
  _hinweis_fuer_die_redaktion: text.optional(),
  eintraege: z.array(
    z.object({
      id: kennung,
      ...basisEintrag,
      titel: text.min(1),
      ziel: text.min(1),
      aufklappen: text.optional(),
      icon: pfad,
      in_kopfleiste: z.boolean(),
      in_fussleiste: z.boolean(),
      position_fussleiste: z.number().optional(),
      nur_klein: z.boolean().optional(),
      in_fussleiste_klein: z.boolean(),
    }),
  ),
});

export const teamSchema = z.object({
  _hinweis_fuer_die_redaktion: text.optional(),
  eintraege: z.array(
    z.object({
      id: kennung,
      ...basisEintrag,
      gruppe: z.enum(['aerzte', 'team']),
      name: text.min(1),
      funktion: text,
      taetigkeiten: z.array(text),
      foto: pfad,
      foto_alt: text,
    }),
  ),
});

export const galerieSchema = z.object({
  _hinweis_fuer_die_redaktion: text.optional(),
  eintraege: z.array(
    z.object({
      id: kennung,
      ...basisEintrag,
      bild: pfad.min(1, 'Bild fehlt'),
      alt: text.min(1, 'Alternativtext ist Pflicht (Barrierefreiheit)'),
    }),
  ),
});

/**
 * Ein Bereich innerhalb eines freien Abschnitts: ein Bild NEBEN dem
 * Text, links oder rechts. Mehrere Bereiche ergeben einen langen
 * Abschnitt mit mehreren Bildern (Florian, 17. September 2026).
 *
 * Bis dahin hatte ein Abschnitt genau ein Bild, das über dem Text
 * stand. Das Feld `breite` (schmal / breit) ist damit entfallen: Der
 * Abschnitt nutzt immer die volle Inhaltsbreite, weil er zwei Spalten
 * trägt.
 */
const abschnittsbereich = z
  .object({
    /** Zwischenüberschrift — meist nur ab dem zweiten Bereich sinnvoll */
    titel: text,
    text: richtext,
    bild: pfad,
    bild_alt: text,
    bild_seite: z.enum(['links', 'rechts']).default('links'),
  })
  .refine((b) => !b.bild || b.bild_alt.trim() !== '', {
    path: ['bild_alt'],
    message: 'Bildbeschreibung ist Pflicht, sobald ein Bild gewählt ist (Barrierefreiheit)',
  });

export const abschnitteSchema = z.object({
  _hinweis_fuer_die_redaktion: text.optional(),
  eintraege: z.array(
    z.object({
      id: kennung,
      ...basisEintrag,
      titel: text.min(1),
      bereiche: z.array(abschnittsbereich).default([]),
      link_text: text,
      link_ziel: text,
      pdf_text: text,
      pdf_datei: pfad,
    }),
  ),
});

export const stellenSchema = z.object({
  _hinweis_fuer_die_redaktion: text.optional(),
  titel: text.min(1),
  einleitung: text,
  eintraege: z.array(
    z.object({
      id: kennung,
      ...basisEintrag,
      titel: text.min(1),
      umfang: text,
      beschreibung: richtext,
      ansprechpartner: text,
      pdf_datei: pfad,
    }),
  ),
});

/**
 * Überschrift und Einleitungstext eines Startseiten-Abschnitts.
 * Beides darf leer bleiben — dann entfällt der jeweilige Teil.
 */
const abschnittstext = z.object({
  titel: text,
  text: text,
});

export const startseiteSchema = z.object({
  _hinweis_fuer_die_redaktion: text.optional(),
  willkommen: abschnittstext,
  sprechstunden: abschnittstext,
  galerie: abschnittstext,
  leistungen: abschnittstext,
  team: abschnittstext,
  kontakt: abschnittstext,
  formular: abschnittstext,
});

export const seiteSchema = z.object({
  _hinweis_fuer_die_redaktion: text.optional(),
  titel: text.min(1).max(70),
  beschreibung: text.max(200),
  vorschaubild: pfad,
  praxis: z.object({
    name: text.min(1),
    strasse: text.min(1),
    plz: text.min(1),
    ort: text.min(1),
    telefon: text.min(1),
    fax: text,
    email: text.email(),
  }),
});

/**
 * Alle Dateien mit ihrem Schema. Der Schlüssel ist der Dateiname ohne
 * Endung — so spricht auch die Redaktion die Bereiche an.
 */
export const schemata = {
  hinweis: hinweisSchema,
  oeffnungszeiten: oeffnungszeitenSchema,
  leistungen: leistungenSchema,
  neuigkeiten: neuigkeitenSchema,
  navigation: navigationSchema,
  team: teamSchema,
  galerie: galerieSchema,
  abschnitte: abschnitteSchema,
  stellen: stellenSchema,
  startseite: startseiteSchema,
  seite: seiteSchema,
} as const;

export type Bereich = keyof typeof schemata;

export const bereiche = Object.keys(schemata) as Bereich[];

export function istBereich(wert: string): wert is Bereich {
  return wert in schemata;
}

/**
 * Prüft Inhalte gegen das Schema und liefert entweder die bereinigten
 * Daten oder eine Liste lesbarer Fehler („eintraege.3.titel: …").
 */
export function pruefen(bereich: Bereich, daten: unknown):
  | { ok: true; daten: unknown }
  | { ok: false; fehler: string[] } {
  const ergebnis = schemata[bereich].safeParse(daten);
  if (ergebnis.success) return { ok: true, daten: ergebnis.data };
  const fehler = ergebnis.error.issues.map((i) => `${i.path.join('.') || '(Wurzel)'}: ${i.message}`);
  return { ok: false, fehler };
}

/**
 * Zusätzliche Regeln, die Zod allein nicht ausdrückt.
 * Liefert eine Fehlerliste (leer = alles gut).
 */
export function zusatzregeln(bereich: Bereich, daten: unknown): string[] {
  const fehler: string[] = [];
  const d = daten as { eintraege?: { id: string }[] } | null;
  if (d?.eintraege) {
    const ids = d.eintraege.map((e) => e.id);
    const doppelt = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (doppelt.length) fehler.push(`Kennung mehrfach vergeben: ${[...new Set(doppelt)].join(', ')}`);
  }
  if (bereich === 'hinweis') {
    const h = daten as { von: string; bis: string };
    if (h.von && h.bis && h.von > h.bis) fehler.push('„von" liegt nach „bis"');
  }
  return fehler;
}
