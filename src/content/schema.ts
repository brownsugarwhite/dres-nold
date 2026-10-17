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
import { richtextPruefen, VERWEIS } from '../lib/richtext-pruefen';

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

/** Redaktions-HTML (Absätze, Listen, Tabellen, Verweise) — nur erlaubte
    Elemente, siehe src/lib/richtext-pruefen.ts */
const richtext = z.string().superRefine((html, ctx) => {
  for (const problem of richtextPruefen(html)) ctx.addIssue({ code: 'custom', message: problem });
});

/**
 * Wohin ein Knopf, Menüpunkt oder Textlink führt — oder leer.
 *
 *   /dentosophie/              eine Seite
 *   /dentosophie/#mundatmung   ein Abschnitt darauf
 *   /#leistungen               ein Abschnitt der Startseite
 *   /dokumente/flyer.pdf       eine Datei
 *   https://…, mailto:…, tel:… nach draußen
 *
 * Ob dorthin gescrollt oder die Seite gewechselt wird, entscheidet die
 * Seite beim Klick selbst (scripts/anker.ts): Liegt das Ziel auf der
 * Seite, auf der man gerade ist, gleitet sie hin.
 */
export const ziel = z.string().refine((w) => w === '' || VERWEIS.test(w), {
  message: 'Ziel muss mit / beginnen oder mit https://, mailto: bzw. tel:',
});

const basisEintrag = {
  aktiv: z.boolean(),
  position: z.number(),
};

/** Ein Knopf: Beschriftung und Ziel (auch eine Datei zum Herunterladen) */
const knopf = z.object({
  text: text.min(1, 'Beschriftung fehlt'),
  ziel: ziel.refine((w) => w !== '', 'Ziel fehlt'),
});

/** Höchstens drei Knöpfe — mehr stehen nicht mehr ruhig nebeneinander */
const knoepfe = z.array(knopf).max(3, 'Höchstens drei Knöpfe').default([]);

/* ---------- Die Dateien ---------- */

export const hinweisSchema = z.object({
  _hinweis_fuer_die_redaktion: text.optional(),
  aktiv: z.boolean(),
  titel: text.min(1),
  text: richtext,
  von: datum,
  bis: datum,
  mehr_erfahren_text: text,
  mehr_erfahren_ziel: ziel,
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
      /* Die Knopfzeile unter dem Text (components/Knopfzeile.astro) */
      knoepfe_text: text.default(''),
      knoepfe: knoepfe,
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

/* ---------- Abschnitte: die Bausteine von Seiten, Beiträgen und Bereichen ---------- */

/**
 * Felder, die jeder Abschnitt hat. `id` wird beim Anlegen einmal aus dem
 * Titel gebildet und bleibt dann fest — sie ist die Sprungmarke, auf die
 * Menü-Unterpunkte und Verweise zeigen. `im_menue` macht den Abschnitt
 * zum Unterpunkt des Menüpunkts, zu dem er gehört.
 */
const abschnittBasis = {
  id: kennung,
  titel: text,
  im_menue: z.boolean().default(false),
  knoepfe_text: text.default(''),
  knoepfe,
};

/** Text, wahlweise mit einem Bild daneben (links oder rechts) */
const textAbschnitt = z.object({
  art: z.literal('text'),
  ...abschnittBasis,
  text: richtext,
  bild: pfad.default(''),
  bild_alt: text.default(''),
  bild_seite: z.enum(['links', 'rechts']).default('links'),
  /** `format`: Das Bild behält sein Seitenverhältnis und ist dann
      womöglich kürzer als der Text daneben. `voll`: Es füllt die
      ganze Höhe des Abschnitts und wird dafür beschnitten. */
  bild_hoehe: z.enum(['format', 'voll']).default('format'),
});

/** Eine Kachel: Symbol (freiwillig), Titel, Text, Ziel (freiwillig) */
const kachel = z.object({
  symbol: pfad.default(''),
  titel: text,
  text: richtext.default(''),
  ziel: ziel.default(''),
});

/** Mehrere Kacheln nebeneinander — z. B. „Atmen · Kauen · Schlucken“ */
const kachelAbschnitt = z.object({
  art: z.literal('kacheln'),
  ...abschnittBasis,
  einleitung: richtext.default(''),
  kacheln: z.array(kachel).min(1, 'Mindestens eine Kachel'),
});

/** Kapitelüberschrift mit Haarlinie — gliedert lange Seiten */
const kapitelAbschnitt = z.object({
  art: z.literal('kapitel'),
  ...abschnittBasis,
  titel: text.min(1, 'Ein Kapitel braucht eine Überschrift'),
  text: richtext.default(''),
});

export const abschnittSchema = z.discriminatedUnion('art', [textAbschnitt, kachelAbschnitt, kapitelAbschnitt]);
const abschnitte = z.array(abschnittSchema).default([]);

/** Eine Datei zum Herunterladen unter einer Seite oder einem Beitrag */
const anhang = z.object({
  datei: pfad.min(1, 'Datei fehlt'),
  titel: text,
  beschreibung: text.default(''),
});

/* ---------- Bereiche: Seiten, Blogs, Startseiten-Abschnitte ---------- */

/**
 * Kennungen, die schon vergeben sind: Ordner der Seite, feste Adressen
 * und die Sprungmarken der eingebauten Abschnitte der Startseite.
 */
export const VERGEBEN = [
  'admin', 'api', 'login', 'leistungen', 'impressum', 'datenschutz', 'bilder', 'dokumente',
  'icons', 'fonts', 'lottie', '_astro', 'cdn-cgi', 'stand', 'sitemap-index', 'sitemap-0',
  'start', 'oz_anchor', 'inhalt', 'praxis', 'galerie', 'team', 'stellen', 'contact', 'kontakt',
  'information', 'willkommen', 'sprechstunden', 'abschnitte',
];

const bereichKennung = kennung.refine((id) => !VERGEBEN.includes(id) && !id.startsWith('leistungen-'), {
  message: 'Diese Kennung ist schon vergeben — bitte eine andere wählen',
});

const bereichBasis = {
  id: bereichKennung,
  aktiv: z.boolean().default(true),
  titel: text.min(1, 'Titel fehlt'),
  /** Die kleine gesperrte Zeile über der Überschrift */
  kicker: text.default(''),
};

/** Eine eigene Seite mit Adresse, z. B. /dentosophie/ */
const seiteBereich = z.object({
  typ: z.literal('seite'),
  ...bereichBasis,
  /** Kündigt eine Karte die Seite auf der Startseite an? Ohne Karte
      hält der Block nur den Platz des Menüpunkts. */
  auf_startseite: z.boolean().default(true),
  /** Kurztext der Ankündigungskarte */
  kurz: text.default(''),
  titelbild: pfad.default(''),
  titelbild_alt: text.default(''),
  abschnitte,
  dateien: z.array(anhang).default([]),
});

export const beitragSchema = z.object({
  id: kennung,
  aktiv: z.boolean().default(true),
  datum,
  titel: text.min(1, 'Titel fehlt'),
  kurz: text.default(''),
  bild: pfad.default(''),
  bild_alt: text.default(''),
  abschnitte,
  dateien: z.array(anhang).default([]),
});

/** Beiträge wie die Neuigkeiten — jeder öffnet als eigene Seite */
const blogBereich = z.object({
  typ: z.literal('blog'),
  ...bereichBasis,
  einleitung: text.default(''),
  beitraege: z.array(beitragSchema).default([]),
});

/** Text und Bilder direkt auf der Startseite */
const abschnittBereich = z.object({
  typ: z.literal('abschnitt'),
  ...bereichBasis,
  abschnitte,
});

/** Bildbeschreibung ist Pflicht, sobald ein Bild gewählt ist (Barrierefreiheit) */
function bildbeschreibungen(b: { abschnitte?: unknown[]; titelbild?: string; titelbild_alt?: string;
  beitraege?: { bild: string; bild_alt: string; abschnitte: unknown[] }[] }, ctx: z.RefinementCtx) {
  const fehlt = (pfadTeile: (string | number)[]) =>
    ctx.addIssue({ code: 'custom', path: pfadTeile, message: 'Bildbeschreibung ist Pflicht, sobald ein Bild gewählt ist (Barrierefreiheit)' });
  const inAbschnitten = (liste: unknown[], vorne: (string | number)[]) =>
    liste.forEach((a, i) => {
      const t = a as { art: string; bild?: string; bild_alt?: string };
      if (t.art === 'text' && t.bild && !t.bild_alt?.trim()) fehlt([...vorne, 'abschnitte', i, 'bild_alt']);
    });
  if (b.titelbild && !b.titelbild_alt?.trim()) fehlt(['titelbild_alt']);
  if (b.abschnitte) inAbschnitten(b.abschnitte, []);
  b.beitraege?.forEach((p, i) => {
    if (p.bild && !p.bild_alt.trim()) fehlt(['beitraege', i, 'bild_alt']);
    inAbschnitten(p.abschnitte, ['beitraege', i]);
  });
}

export const bereichSchema = z
  .discriminatedUnion('typ', [seiteBereich, blogBereich, abschnittBereich])
  .superRefine(bildbeschreibungen);

export const bereicheSchema = z.object({
  _hinweis_fuer_die_redaktion: text.optional(),
  eintraege: z.array(bereichSchema),
});

/* ---------- Seitenaufbau: Reihenfolge der Startseite und das Menü ---------- */

/** Ein Unterpunkt im Menü — ohne Symbol, mit freiem Ziel */
const unterpunkt = z.object({
  titel: text.min(1, 'Bezeichnung fehlt'),
  kurz: text.default(''),
  ziel: ziel.refine((w) => w !== '', 'Ziel fehlt'),
});

/** Ein Hauptpunkt im Menü. Nur Hauptpunkte haben ein Symbol. */
const menuePunkt = z.object({
  titel: text.min(1, 'Bezeichnung fehlt'),
  symbol: pfad,
  unterpunkte: z.array(unterpunkt).default([]),
});

/** Höchstens so viele Hauptpunkte — mehr passen bei 992 px nicht in die Kopfleiste */
export const MENUE_HOECHSTENS = 7;

export const BLOCKARTEN = ['willkommen', 'galerie', 'leistungen', 'team', 'stellen', 'kontakt', 'bereich', 'verweis'] as const;

const block = z.object({
  /** Bei `bereich` die Kennung des Bereichs, sonst der Name der Blockart */
  id: kennung,
  art: z.enum(BLOCKARTEN),
  aktiv: z.boolean().default(true),
  /** Steht der Block im Menü? `null` = nein */
  menue: menuePunkt.nullable().default(null),
  /** Nur bei `verweis`: ein reiner Menüpunkt, der irgendwohin führt */
  ziel: ziel.default(''),
});

export const seitenaufbauSchema = z.object({
  _hinweis_fuer_die_redaktion: text.optional(),
  /** Die Sprechstunden-Karte steht fest oben — und ihr Menüpunkt vorn */
  sprechstunden: z.object({ menue: menuePunkt }),
  /** Die Blöcke der Startseite in ihrer Reihenfolge, zwischen Karte und Fuß */
  bloecke: z.array(block),
});

/**
 * Alle Dateien mit ihrem Schema. Der Schlüssel ist der Dateiname ohne
 * Endung — so spricht auch die Redaktion die Dateien an.
 */
export const schemata = {
  hinweis: hinweisSchema,
  oeffnungszeiten: oeffnungszeitenSchema,
  leistungen: leistungenSchema,
  team: teamSchema,
  galerie: galerieSchema,
  stellen: stellenSchema,
  startseite: startseiteSchema,
  seite: seiteSchema,
  seitenaufbau: seitenaufbauSchema,
  bereiche: bereicheSchema,
} as const;

/** Name einer Inhaltsdatei (ohne .json) */
export type Datei = keyof typeof schemata;

export const dateien = Object.keys(schemata) as Datei[];

export function istDatei(wert: string): wert is Datei {
  return Object.hasOwn(schemata, wert);
}

export type Seitenaufbau = z.infer<typeof seitenaufbauSchema>;
export type Block = Seitenaufbau['bloecke'][number];
export type MenuePunkt = z.infer<typeof menuePunkt>;
export type Bereich = z.infer<typeof bereichSchema>;
export type Abschnitt = z.infer<typeof abschnittSchema>;
export type Beitrag = z.infer<typeof beitragSchema>;
export type Knopf = z.infer<typeof knopf>;

/**
 * Prüft Inhalte gegen das Schema und liefert entweder die bereinigten
 * Daten oder eine Liste lesbarer Fehler („eintraege.3.titel: …").
 */
export function pruefen(datei: Datei, daten: unknown):
  | { ok: true; daten: unknown }
  | { ok: false; fehler: string[] } {
  const ergebnis = schemata[datei].safeParse(daten);
  if (ergebnis.success) return { ok: true, daten: ergebnis.data };
  const fehler = ergebnis.error.issues.map((i) => `${i.path.join('.') || '(Wurzel)'}: ${i.message}`);
  return { ok: false, fehler };
}

/** Doppelte Kennungen in einer Liste */
function doppelte(ids: string[]): string[] {
  return [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
}

/**
 * Zusätzliche Regeln innerhalb einer Datei, die Zod allein nicht
 * ausdrückt. Liefert eine Fehlerliste (leer = alles gut).
 */
export function zusatzregeln(datei: Datei, daten: unknown): string[] {
  const fehler: string[] = [];
  const d = daten as { eintraege?: { id: string }[] } | null;
  if (d?.eintraege) {
    const doppelt = doppelte(d.eintraege.map((e) => e.id));
    if (doppelt.length) fehler.push(`Kennung mehrfach vergeben: ${doppelt.join(', ')}`);
  }
  if (datei === 'hinweis') {
    const h = daten as { von: string; bis: string };
    if (h.von && h.bis && h.von > h.bis) fehler.push('„von" liegt nach „bis"');
  }
  if (datei === 'bereiche') {
    for (const b of (daten as { eintraege: Bereich[] }).eintraege) {
      const listen = b.typ === 'blog' ? b.beitraege.map((p) => [p.titel, p.abschnitte] as const) : [[b.titel, b.abschnitte] as const];
      for (const [name, liste] of listen) {
        const doppelt = doppelte(liste.map((a) => a.id));
        if (doppelt.length) fehler.push(`„${name}“: Abschnitts-Kennung mehrfach vergeben: ${doppelt.join(', ')}`);
      }
      if (b.typ === 'blog') {
        const doppelt = doppelte(b.beitraege.map((p) => p.id));
        if (doppelt.length) fehler.push(`„${b.titel}“: Beitrags-Kennung mehrfach vergeben: ${doppelt.join(', ')}`);
      }
    }
  }
  if (datei === 'seitenaufbau') {
    const s = daten as Seitenaufbau;
    const doppelt = doppelte(s.bloecke.map((b) => b.id));
    if (doppelt.length) fehler.push(`Block mehrfach im Seitenplan: ${doppelt.join(', ')}`);
    for (const b of s.bloecke) {
      if (b.art !== 'bereich' && b.art !== 'verweis' && b.id !== b.art) fehler.push(`Block „${b.id}“ muss „${b.art}“ heißen`);
      if (b.art === 'verweis' && (!b.ziel || !b.menue)) fehler.push(`Menüpunkt „${b.id}“ braucht Bezeichnung und Ziel`);
    }
    const punkte = 1 + s.bloecke.filter((b) => b.aktiv && b.menue).length;
    if (punkte > MENUE_HOECHSTENS) {
      fehler.push(`Das Menü hat Platz für ${MENUE_HOECHSTENS} Punkte, eingetragen sind ${punkte}. Machen Sie einen davon zum Unterpunkt.`);
    }
  }
  return fehler;
}

/**
 * Regeln über Dateigrenzen hinweg: Jeder Bereich im Seitenplan muss es
 * geben, jede Kennung darf nur einmal vorkommen.
 */
export function zusammenhangPruefen(seitenaufbau: Seitenaufbau, bereiche: { eintraege: Bereich[] }): string[] {
  const fehler: string[] = [];
  const vorhanden = new Map(bereiche.eintraege.map((b) => [b.id, b]));
  for (const b of seitenaufbau.bloecke) {
    if (b.art === 'bereich' && !vorhanden.has(b.id)) fehler.push(`Im Seitenplan steht „${b.id}“, den Bereich gibt es aber nicht`);
    if (b.art === 'verweis' && vorhanden.has(b.id)) fehler.push(`Menüpunkt „${b.id}“ heißt wie ein Bereich`);
  }
  return fehler;
}
