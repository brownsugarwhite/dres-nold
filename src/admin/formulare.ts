/**
 * Was die Redaktion zu jedem Teil der Seite zeigt — welche Felder, in
 * welcher Datei, an welcher Stelle.
 *
 * Eine Ansicht besteht aus Teilen; jeder Teil ist ein Formular über
 * einem Stück einer Inhaltsdatei (src/content/*.json). Die Begrüßung etwa
 * hat ihre Texte in startseite.json und ihren Platz im Menü in
 * seitenaufbau.json — in der Redaktion steht beides an einer Stelle.
 *
 * Neue Felder: erst in src/content/schema.ts, dann hier eintragen. Ein
 * Feld, das hier fehlt, sieht die Redaktion nicht (es bleibt beim
 * Speichern aber erhalten). Die Feldarten stehen in felder.ts.
 */
import type { Datei } from '../content/schema';
import type { Feld, Eintrag } from './felder';
import { BLOCKNAMEN } from './ziele';
import { SKIZZEN } from './skizzen';

export type Pfad = (string | number)[];

export interface Teil {
  titel?: string;
  hilfe?: string;
  datei: Datei;
  /** Wo im Inhalt der Datei — wird bei jedem Lesen neu bestimmt, weil sich
      Positionen durch Verschieben ändern */
  pfad: () => Pfad | null;
  felder: Feld[];
}

export interface Ansicht {
  titel: string;
  /** Kleine Zeile über dem Titel, z. B. „Eigene Seite" */
  art: string;
  skizze: string;
  /** Wo es online zu sehen ist */
  adresse?: string;
  teile: Teil[];
  /** Darf gelöscht werden (eigene Bereiche, reine Menüpunkte) */
  loeschbar?: boolean;
}

/** Der Ausschnitt der Inhalte, den die Formulare zum Rechnen brauchen */
export interface Inhalte {
  seitenaufbau: { bloecke: { id: string; art: string }[] };
  bereiche: { eintraege: { id: string; typ: string; titel: string; abschnitte?: { titel: string; im_menue: boolean }[] }[] };
  leistungen: { kategorien: { id: string; titel: string; aktiv: boolean }[] };
}

/* ---------- Bausteine ---------- */

const SYMBOL_HILFE = 'Am besten eine SVG-Zeichnung in der Hausfarbe, wie die vorhandenen.';

const zeitenListe = (name: string, label: string): Feld => ({
  typ: 'gruppe', name, label,
  felder: [
    { typ: 'text', name: 'titel', label: 'Überschrift' },
    {
      typ: 'eintraege', name: 'zeilen', label: 'Tage', einzahl: 'Tag', titelfeld: 'tag',
      hilfe: 'Ein Tag ohne Zeiten wird auf der Seite ausgeblendet.',
      felder: [
        { typ: 'text', name: 'tag', label: 'Wochentag' },
        { typ: 'text', name: 'vormittag', label: 'Erste Zeitspanne', platzhalter: '8.00 - 12.00 Uhr' },
        { typ: 'text', name: 'nachmittag', label: 'Zweite Zeitspanne', platzhalter: 'leer lassen, wenn es nur eine gibt' },
      ],
      neu: () => ({ tag: '', vormittag: '', nachmittag: '' }),
    },
    { typ: 'text', name: 'zusatz', label: 'Fußnote', platzhalter: '…und nach Vereinbarung' },
  ],
});

const ueberschrift = (mitText = true): Feld[] => [
  { typ: 'text', name: 'titel', label: 'Überschrift' },
  ...(mitText ? [{ typ: 'mehrzeilig', name: 'text', label: 'Einleitung (freiwillig)' } as Feld] : []),
];

const anhaenge: Feld = {
  typ: 'eintraege', name: 'dateien', label: 'Zum Herunterladen', einzahl: 'Datei', geschlecht: 'w', titelfeld: 'titel',
  hilfe: 'Erscheinen am Ende als Liste mit Dateiart und Größe — meist PDFs.',
  felder: [
    { typ: 'datei', name: 'datei', label: 'Datei' },
    { typ: 'text', name: 'titel', label: 'Bezeichnung', platzhalter: 'z. B. „Anamnesebogen"' },
    { typ: 'text', name: 'beschreibung', label: 'Kurzbeschreibung (freiwillig)' },
  ],
  neu: () => ({ datei: '', titel: '', beschreibung: '' }),
};

/** Index eines Eintrags nach Kennung — oder null */
const stelle = (liste: { id: string }[] | undefined, id: string) => {
  const i = liste?.findIndex((e) => e.id === id) ?? -1;
  return i < 0 ? null : i;
};

/* ---------- Der Block im Seitenplan: sichtbar? im Menü? ---------- */

function blockTeil(id: string, inhalte: () => Inhalte, automatisch: () => string[] = () => [], ohneSichtbar = false): Teil {
  return {
    titel: 'Auf der Startseite und im Menü',
    datei: 'seitenaufbau',
    pfad: () => {
      const i = stelle(inhalte().seitenaufbau.bloecke, id);
      return i === null ? null : ['bloecke', i];
    },
    felder: [
      ...(ohneSichtbar ? [] : [{ typ: 'schalter', name: 'aktiv', label: 'Auf der Startseite zeigen', hilfe: 'Aus = der Block ist ausgeblendet, samt Menüpunkt. Nichts geht verloren.' } as Feld]),
      { typ: 'menue', name: 'menue', label: 'Im Menü zeigen', automatisch },
    ],
  };
}

/* ---------- Die festen Teile ---------- */

export const HINWEIS: Ansicht = {
  titel: 'Hinweis beim Öffnen der Seite',
  art: 'Urlaub, Vertretung, Notfall',
  skizze: SKIZZEN.hinweis,
  teile: [{
    datei: 'hinweis', pfad: () => [],
    felder: [
      { typ: 'schalter', name: 'aktiv', label: 'Hinweis eingeschaltet', hilfe: 'Er erscheint nur im Zeitraum unten — und verschwindet danach von selbst.' },
      { typ: 'text', name: 'titel', label: 'Überschrift' },
      { typ: 'richtext', name: 'text', label: 'Text', ordner: 'allgemein', ohneTabelle: true },
      { typ: 'datum', name: 'von', label: 'Sichtbar ab' },
      { typ: 'datum', name: 'bis', label: 'Sichtbar bis einschließlich' },
      { typ: 'text', name: 'mehr_erfahren_text', label: 'Knopf: Beschriftung (freiwillig)', platzhalter: 'Mehr erfahren' },
      { typ: 'ziel', name: 'mehr_erfahren_ziel', label: 'Knopf: führt zu', hilfe: 'Ohne Ziel gibt es keinen Knopf.' },
      { typ: 'schalter', name: 'einmal_pro_besuch', label: 'Nur einmal pro Besuch zeigen', hilfe: 'Wurde der Hinweis weggeklickt, bleibt er für diesen Besuch fort.' },
    ],
  }],
};

export const SPRECHSTUNDEN: Ansicht = {
  titel: 'Sprechstunden',
  art: 'Fester Block — fährt über das Logo herein',
  skizze: SKIZZEN.sprechstunden,
  adresse: '/#oz_anchor',
  teile: [
    { titel: 'Überschrift', datei: 'startseite', pfad: () => ['sprechstunden'], felder: ueberschrift() },
    {
      titel: 'Zeiten', datei: 'oeffnungszeiten', pfad: () => [],
      felder: [
        zeitenListe('zahnaerztlich', 'Zahnärztliche Sprechstunde'),
        zeitenListe('kieferorthopaedisch', 'Kieferorthopädische Sprechstunde'),
        zeitenListe('telefonisch', 'Telefonische Erreichbarkeit'),
      ],
    },
    {
      titel: 'Im Menü', hilfe: 'Steht immer vorn — die Karte ist das Erste auf der Seite.',
      datei: 'seitenaufbau', pfad: () => ['sprechstunden', 'menue'],
      felder: [
        { typ: 'text', name: 'titel', label: 'Bezeichnung im Menü', hoechstens: 18 },
        { typ: 'symbol', name: 'symbol', label: 'Symbol' },
      ],
    },
  ],
};

export const ALLGEMEIN: Ansicht = {
  titel: 'Praxisangaben und Suchmaschinen',
  art: 'Gilt für die ganze Seite',
  skizze: SKIZZEN.fuss,
  teile: [
    {
      titel: 'Die Praxis', hilfe: 'Erscheint in der Kopfzeile, im Kontakt und im Fuß.', datei: 'seite', pfad: () => ['praxis'],
      felder: [
        { typ: 'text', name: 'name', label: 'Name' },
        { typ: 'text', name: 'strasse', label: 'Straße' },
        { typ: 'text', name: 'plz', label: 'PLZ' },
        { typ: 'text', name: 'ort', label: 'Ort' },
        { typ: 'text', name: 'telefon', label: 'Telefon' },
        { typ: 'text', name: 'fax', label: 'Fax' },
        { typ: 'text', name: 'email', label: 'E-Mail' },
      ],
    },
    {
      titel: 'Für Suchmaschinen', hilfe: 'So erscheint die Seite bei Google.', datei: 'seite', pfad: () => [],
      felder: [
        { typ: 'text', name: 'titel', label: 'Seitentitel', hoechstens: 70 },
        { typ: 'mehrzeilig', name: 'beschreibung', label: 'Beschreibung', hilfe: 'Unter 160 Zeichen.' },
        { typ: 'bild', name: 'vorschaubild', label: 'Vorschaubild beim Teilen', ordner: 'allgemein' },
      ],
    },
  ],
};

/* ---------- Eingebaute Blöcke ---------- */

function eingebaut(art: string, inhalte: () => Inhalte): Ansicht {
  const name = BLOCKNAMEN[art] ?? art;
  const block = blockTeil(art, inhalte, art === 'leistungen'
    ? () => inhalte().leistungen.kategorien.filter((k) => k.aktiv).map((k) => k.titel)
    : undefined);
  const ansicht = (teile: Teil[], adresse: string): Ansicht => ({ titel: name, art: 'Block der Startseite', skizze: SKIZZEN[art] ?? '', adresse, teile: [...teile, block] });

  switch (art) {
    case 'willkommen':
      return ansicht([{
        titel: 'Begrüßung', datei: 'startseite', pfad: () => ['willkommen'],
        felder: [
          { typ: 'mehrzeilig', name: 'titel', label: 'Überschrift', hilfe: 'Zwei Zeilen: oben die kleine, unten die große („Willkommen in unserer" / „Praxis Dres. Nold").' },
          { typ: 'mehrzeilig', name: 'text', label: 'Kurzer Text daneben' },
        ],
      }], '/#praxis');
    case 'galerie':
      return ansicht([{
        titel: 'Bilder', datei: 'galerie', pfad: () => [],
        felder: [{
          typ: 'eintraege', name: 'eintraege', label: 'Bilder im Band', einzahl: 'Bild', geschlecht: 's', standard: true, titelfeld: 'alt',
          hilfe: 'Laufen endlos von rechts nach links durch.',
          felder: [{ typ: 'bild', name: 'bild', label: 'Bild', ordner: 'galerie', altName: 'alt' }],
          neu: () => ({ bild: '', alt: '' }),
        }],
      }], '/#galerie');
    case 'leistungen':
      return ansicht([
        { titel: 'Überschrift', datei: 'startseite', pfad: () => ['leistungen'], felder: ueberschrift() },
        {
          titel: 'Leistungen', datei: 'leistungen', pfad: () => [],
          hilfe: 'Jede Leistung hat eine eigene Seite unter dres-nold.de/leistungen/…',
          felder: [
            {
              typ: 'eintraege', name: 'eintraege', label: 'Leistungen', einzahl: 'Leistung', geschlecht: 'w', standard: true, titelfeld: 'titel',
              unterzeile: (e) => {
                const k = inhalte().leistungen.kategorien.find((k) => k.id === e.kategorie);
                return k ? k.titel : '';
              },
              felder: [
                { typ: 'text', name: 'titel', label: 'Titel' },
                { typ: 'auswahl', name: 'kategorie', label: 'Gruppe', optionen: () => inhalte().leistungen.kategorien.map((k) => ({ wert: k.id, label: k.aktiv ? k.titel : `${k.titel} (ausgeblendet)` })) },
                { typ: 'mehrzeilig', name: 'kurz', label: 'Kurztext auf der Kachel', hilfe: 'Ein bis zwei Sätze.' },
                { typ: 'symbol', name: 'icon', label: 'Symbol auf der Kachel', hilfe: SYMBOL_HILFE },
                { typ: 'richtext', name: 'inhalt', label: 'Text der Seite', ordner: 'allgemein' },
                { typ: 'text', name: 'knoepfe_text', label: 'Satz über den Knöpfen (freiwillig)' },
                {
                  typ: 'eintraege', name: 'knoepfe', label: 'Knöpfe unter dem Text', einzahl: 'Knopf', titelfeld: 'text', hoechstens: 3,
                  felder: [{ typ: 'text', name: 'text', label: 'Beschriftung' }, { typ: 'ziel', name: 'ziel', label: 'Führt zu' }],
                  neu: () => ({ text: '', ziel: '' }),
                },
              ],
              neu: () => ({ titel: '', kategorie: inhalte().leistungen.kategorien[0]?.id ?? '', kurz: '', icon: '', inhalt: '', knoepfe_text: '', knoepfe: [] }),
            },
            {
              typ: 'eintraege', name: 'kategorien', label: 'Gruppen', einzahl: 'Gruppe', geschlecht: 'w', standard: true, titelfeld: 'titel',
              hilfe: 'Gliedern die Kacheln und sind die Unterpunkte von „Leistungen" im Menü. Leere Gruppen erscheinen nicht.',
              felder: [
                { typ: 'text', name: 'titel', label: 'Titel' },
                { typ: 'text', name: 'kurz', label: 'Zusatzzeile im Menü', platzhalter: 'z. B. „Vorsorge, Zahnerhalt und Zahnersatz"' },
                { typ: 'richtext', name: 'beschreibung', label: 'Erklärtext über den Kacheln (freiwillig)', ordner: 'allgemein', ohneTabelle: true, klein: true },
              ],
              neu: () => ({ titel: '', kurz: '', beschreibung: '' }),
            },
          ],
        },
      ], '/#leistungen');
    case 'team':
      return ansicht([
        { titel: 'Überschrift', datei: 'startseite', pfad: () => ['team'], felder: ueberschrift(false) },
        {
          titel: 'Personen', datei: 'team', pfad: () => [],
          felder: [{
            typ: 'eintraege', name: 'eintraege', label: 'Personen', einzahl: 'Person', geschlecht: 'w', standard: true, titelfeld: 'name',
            hilfe: 'Wer ausscheidet: ausschalten statt entfernen — so bleibt das Foto erhalten.',
            unterzeile: (e) => String(e.funktion ?? ''),
            felder: [
              { typ: 'text', name: 'name', label: 'Name' },
              { typ: 'segment', name: 'gruppe', label: 'Gruppe', optionen: [{ wert: 'aerzte', label: 'Ärztinnen und Ärzte' }, { wert: 'team', label: 'Praxisteam' }] },
              { typ: 'text', name: 'funktion', label: 'Funktion' },
              { typ: 'liste', name: 'taetigkeiten', label: 'Tätigkeiten', hilfe: 'Je Zeile eine. Klappen auf der Seite beim Klick auf den Namen auf.' },
              { typ: 'bild', name: 'foto', label: 'Foto', ordner: 'team', altName: 'foto_alt', hilfe: 'Hochformat vor weißem Hintergrund, wie die vorhandenen.' },
            ],
            neu: () => ({ name: '', gruppe: 'team', funktion: '', taetigkeiten: [], foto: '', foto_alt: '' }),
          }],
        },
      ], '/#team');
    case 'stellen':
      return ansicht([{
        titel: 'Stellenangebote', datei: 'stellen', pfad: () => [],
        hilfe: 'Ist keine Stelle eingeschaltet, blendet sich der Block aus.',
        felder: [
          { typ: 'text', name: 'titel', label: 'Überschrift' },
          { typ: 'text', name: 'einleitung', label: 'Einleitung' },
          {
            typ: 'eintraege', name: 'eintraege', label: 'Stellen', einzahl: 'Stelle', geschlecht: 'w', standard: true, titelfeld: 'titel',
            unterzeile: (e) => String(e.umfang ?? ''),
            felder: [
              { typ: 'text', name: 'titel', label: 'Bezeichnung' },
              { typ: 'text', name: 'umfang', label: 'Umfang', platzhalter: 'z. B. Vollzeit oder Teilzeit' },
              { typ: 'richtext', name: 'beschreibung', label: 'Beschreibung', ordner: 'allgemein' },
              { typ: 'text', name: 'ansprechpartner', label: 'Ansprechperson' },
              { typ: 'datei', name: 'pdf_datei', label: 'Ausführliche Anzeige zum Herunterladen (freiwillig)' },
            ],
            neu: () => ({ titel: '', umfang: '', beschreibung: '', ansprechpartner: '', pdf_datei: '' }),
          },
        ],
      }], '/#stellen');
    case 'kontakt':
      return ansicht([
        { titel: 'Überschrift', datei: 'startseite', pfad: () => ['kontakt'], felder: ueberschrift() },
        { titel: 'Kontaktformular', datei: 'startseite', pfad: () => ['formular'], felder: ueberschrift() },
        { titel: 'Adresse, Telefon, E-Mail', datei: 'seite', pfad: () => ['praxis'], hilfe: 'Gelten für die ganze Seite.', felder: [
          { typ: 'text', name: 'telefon', label: 'Telefon' },
          { typ: 'text', name: 'fax', label: 'Fax' },
          { typ: 'text', name: 'email', label: 'E-Mail' },
          { typ: 'text', name: 'strasse', label: 'Straße' },
          { typ: 'text', name: 'plz', label: 'PLZ' },
          { typ: 'text', name: 'ort', label: 'Ort' },
        ] },
      ], '/#contact');
  }
  return ansicht([], '/');
}

/* ---------- Eigene Bereiche ---------- */

export const BEREICHSARTEN: Record<string, { titel: string; text: string; skizze: string }> = {
  seite: { titel: 'Eigene Seite', text: 'Eine Seite mit eigener Adresse, z. B. dres-nold.de/dentosophie — auf der Startseite mit einer Karte angekündigt.', skizze: SKIZZEN.seite },
  blog: { titel: 'Beiträge (Blog)', text: 'Mehrere Beiträge mit Datum und Bild, wie die Neuigkeiten. Jeder Beitrag öffnet als eigene Seite.', skizze: SKIZZEN.blog },
  abschnitt: { titel: 'Abschnitt auf der Startseite', text: 'Überschrift, Text und Bilder direkt auf der Startseite.', skizze: SKIZZEN.abschnitt },
};

function eigenerBereich(id: string, typ: string, inhalte: () => Inhalte): Ansicht {
  const pfad = () => {
    const i = stelle(inhalte().bereiche.eintraege, id);
    return i === null ? null : ['eintraege', i] as Pfad;
  };
  const autoUnter = () => (inhalte().bereiche.eintraege.find((b) => b.id === id)?.abschnitte ?? []).filter((a) => a.im_menue && a.titel.trim()).map((a) => a.titel);
  const titel = inhalte().bereiche.eintraege.find((b) => b.id === id)?.titel ?? id;
  const art = BEREICHSARTEN[typ];

  const kopf: Feld[] = [
    { typ: 'text', name: 'kicker', label: 'Kleine Zeile über der Überschrift (freiwillig)', platzhalter: typ === 'blog' ? 'Aktuelles' : 'z. B. „Ganzheitliche Kieferorthopädie"' },
    { typ: 'text', name: 'titel', label: 'Überschrift' },
  ];

  const inhalt: Feld[] =
    typ === 'seite' ? [
      { typ: 'schalter', name: 'aktiv', label: 'Seite ist online', hilfe: 'Aus = die Seite ist nicht erreichbar, auch nicht über Verweise.' },
      ...kopf,
      { typ: 'bild', name: 'titelbild', label: 'Titelbild', ordner: 'bereiche', altName: 'titelbild_alt', hilfe: 'Steht oben auf der Seite und auf der Ankündigungskarte.' },
      { typ: 'abschnitte', name: 'abschnitte', label: 'Abschnitte der Seite', hilfe: 'Untereinander, von oben nach unten.' },
      anhaenge,
    ]
      : typ === 'blog' ? [
        { typ: 'schalter', name: 'aktiv', label: 'Beiträge sind online' },
        ...kopf,
        { typ: 'text', name: 'einleitung', label: 'Einleitungssatz (freiwillig)' },
        {
          typ: 'eintraege', name: 'beitraege', label: 'Beiträge', einzahl: 'Beitrag', standard: true, titelfeld: 'titel',
          hilfe: 'Auf der Seite stehen sie nach Datum, neueste zuerst.',
          unterzeile: (e) => (e.datum ? new Date(String(e.datum)).toLocaleDateString('de-DE') : 'ohne Datum'),
          felder: [
            { typ: 'text', name: 'titel', label: 'Überschrift' },
            { typ: 'datum', name: 'datum', label: 'Datum' },
            { typ: 'mehrzeilig', name: 'kurz', label: 'Anrisstext auf der Karte' },
            { typ: 'bild', name: 'bild', label: 'Titelbild', ordner: 'bereiche', altName: 'bild_alt' },
            { typ: 'abschnitte', name: 'abschnitte', label: 'Inhalt des Beitrags' },
            anhaenge,
          ],
          neu: () => ({ titel: '', datum: new Date().toISOString().slice(0, 10), kurz: '', bild: '', bild_alt: '', abschnitte: [], dateien: [] }),
        },
      ]
        : [
          { typ: 'schalter', name: 'aktiv', label: 'Auf der Startseite zeigen' },
          ...kopf,
          { typ: 'abschnitte', name: 'abschnitte', label: 'Abschnitte' },
        ];

  const teile: Teil[] = [{ titel: 'Inhalt', datei: 'bereiche', pfad, felder: inhalt }];
  if (typ === 'seite') {
    teile.push({
      titel: 'Ankündigung auf der Startseite', datei: 'bereiche', pfad,
      felder: [
        { typ: 'schalter', name: 'auf_startseite', label: 'Mit einer Karte auf der Startseite ankündigen', hilfe: 'Die Karte zeigt Titelbild, Überschrift und den Kurztext. Ein Klick öffnet die Seite.' },
        { typ: 'mehrzeilig', name: 'kurz', label: 'Kurztext der Karte' },
      ],
    });
  }
  teile.push(blockTeil(id, inhalte, autoUnter, true));

  return { titel, art: art?.titel ?? typ, skizze: art?.skizze ?? '', adresse: typ === 'seite' ? `/${id}/` : `/#${id}`, teile, loeschbar: true };
}

/** Ein reiner Menüpunkt, der irgendwohin führt (Blockart „verweis") */
function verweis(id: string, inhalte: () => Inhalte): Ansicht {
  return {
    titel: 'Menüpunkt', art: 'Nur im Menü', skizze: SKIZZEN.verweis, loeschbar: true,
    teile: [{
      titel: 'Menüpunkt', datei: 'seitenaufbau',
      pfad: () => { const i = stelle(inhalte().seitenaufbau.bloecke, id); return i === null ? null : ['bloecke', i]; },
      felder: [
        { typ: 'schalter', name: 'aktiv', label: 'Im Menü zeigen' },
        { typ: 'ziel', name: 'ziel', label: 'Führt zu' },
        {
          typ: 'gruppe', name: 'menue', label: 'Im Menü',
          felder: [
            { typ: 'text', name: 'titel', label: 'Bezeichnung', hoechstens: 18 },
            { typ: 'symbol', name: 'symbol', label: 'Symbol' },
          ],
        },
      ],
    }],
  };
}

/** Die Ansicht zu einem Block des Seitenplans */
export function ansichtFuerBlock(block: { id: string; art: string }, inhalte: () => Inhalte): Ansicht {
  if (block.art === 'verweis') return verweis(block.id, inhalte);
  if (block.art === 'bereich') {
    const b = inhalte().bereiche.eintraege.find((e) => e.id === block.id);
    return eigenerBereich(block.id, b?.typ ?? 'abschnitt', inhalte);
  }
  return eingebaut(block.art, inhalte);
}

/** Leere Vorlage für einen neuen Bereich */
export function neuerBereich(typ: string, id: string, titel: string): Eintrag {
  const basis = { typ, id, aktiv: true, titel, kicker: '' };
  const erster = { art: 'text', id: 'einleitung', titel: '', im_menue: false, text: '', bild: '', bild_alt: '', bild_seite: 'links', bild_hoehe: 'format', knoepfe_text: '', knoepfe: [] };
  if (typ === 'blog') return { ...basis, einleitung: '', beitraege: [] };
  if (typ === 'seite') return { ...basis, auf_startseite: true, kurz: '', titelbild: '', titelbild_alt: '', abschnitte: [erster], dateien: [] };
  return { ...basis, abschnitte: [erster] };
}
