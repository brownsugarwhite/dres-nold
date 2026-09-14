/**
 * Was die Redaktion je Bereich bearbeiten kann — die Beschreibung der
 * Formulare. Aus dieser Datei baut src/admin/redaktion.ts die Eingabe-
 * masken; gespeichert wird gegen das Schema in src/content/schema.ts.
 *
 * Feldtypen:
 *   text         eine Zeile
 *   mehrzeilig   mehrere Zeilen, ohne Gestaltung
 *   richtext     Absätze, Fett, Listen, Tabellen, Verweise
 *   datum        JJJJ-MM-TT
 *   schalter     an/aus
 *   zahl
 *   kennung      Teil der Adresse; bei bestehenden Einträgen gesperrt
 *   auswahl      eine von mehreren Möglichkeiten (`optionen` oder `quelle`)
 *   liste        mehrere kurze Texte, je Zeile einer
 *   bild / pdf   Pfad unter public/ mit Hochladen-Knopf (`ordner`)
 *   gruppe       Untergruppe von Feldern (`felder`)
 *   eintraege    Liste gleichartiger Einträge (`felder`); mit `standard`
 *                bekommen sie Kennung, aktiv und Reihenfolge automatisch
 */
import type { Bereich } from '../content/schema';

export type Feld = {
  name: string;
  label: string;
  typ:
    | 'text' | 'mehrzeilig' | 'richtext' | 'datum' | 'schalter' | 'zahl'
    | 'kennung' | 'auswahl' | 'liste' | 'bild' | 'pdf' | 'gruppe' | 'eintraege';
  hilfe?: string;
  /** für auswahl */
  optionen?: { wert: string; label: string }[];
  /** für auswahl: Liste aus den Daten des Bereichs, z. B. "kategorien" */
  quelle?: string;
  /** für bild/pdf: Zielordner beim Hochladen */
  ordner?: 'team' | 'galerie' | 'neuigkeiten' | 'abschnitte' | 'allgemein' | 'dokumente';
  /** für gruppe/eintraege */
  felder?: Feld[];
  /** für eintraege: Kennung/aktiv/Reihenfolge automatisch verwalten */
  standard?: boolean;
  /** für eintraege: welches Feld die Überschrift eines Eintrags liefert */
  titelfeld?: string;
  /** Feld anzeigen, aber nicht ändern lassen */
  gesperrt?: boolean;
};

export type BereichDefinition = {
  titel: string;
  beschreibung: string;
  symbol: string;
  felder: Feld[];
};

const zeitenListe = (name: string, label: string): Feld => ({
  name,
  label,
  typ: 'gruppe',
  felder: [
    { name: 'titel', label: 'Überschrift', typ: 'text' },
    {
      name: 'zeilen',
      label: 'Tage',
      typ: 'eintraege',
      titelfeld: 'tag',
      hilfe: 'Ein Tag ohne Zeiten wird auf der Seite ausgeblendet.',
      felder: [
        { name: 'tag', label: 'Wochentag', typ: 'text' },
        { name: 'vormittag', label: 'Erste Zeitspanne', typ: 'text', hilfe: 'z. B. 8.00 - 12.00 Uhr' },
        { name: 'nachmittag', label: 'Zweite Zeitspanne', typ: 'text', hilfe: 'leer lassen, wenn es nur eine gibt' },
      ],
    },
    { name: 'zusatz', label: 'Fußnote', typ: 'text', hilfe: 'z. B. „…und nach Vereinbarung"' },
  ],
});

export const bereiche: Record<Bereich, BereichDefinition> = {
  hinweis: {
    titel: 'Hinweis (Urlaub, Vertretung, Notfall)',
    beschreibung: 'Die Sprechblase, die sich beim Öffnen der Seite meldet. Sie erscheint automatisch im eingetragenen Zeitraum und verschwindet danach von selbst.',
    symbol: '/icons/navigation/neuigkeiten.svg',
    felder: [
      { name: 'aktiv', label: 'Hinweis eingeschaltet', typ: 'schalter', hilfe: 'Aus = der Hinweis erscheint nie, egal welcher Zeitraum eingetragen ist.' },
      { name: 'titel', label: 'Überschrift', typ: 'text' },
      { name: 'text', label: 'Text', typ: 'richtext' },
      { name: 'von', label: 'Sichtbar ab', typ: 'datum' },
      { name: 'bis', label: 'Sichtbar bis einschließlich', typ: 'datum' },
      { name: 'mehr_erfahren_text', label: 'Beschriftung des Knopfs', typ: 'text', hilfe: 'Der Knopf erscheint nur, wenn ein Ziel eingetragen ist.' },
      { name: 'mehr_erfahren_ziel', label: 'Ziel des Knopfs', typ: 'text', hilfe: 'z. B. /neuigkeiten/urlaub-2026/ oder #contact' },
      { name: 'einmal_pro_besuch', label: 'Nur einmal pro Besuch zeigen', typ: 'schalter', hilfe: 'Wurde der Hinweis weggeklickt, bleibt er für diesen Besuch fort.' },
    ],
  },

  oeffnungszeiten: {
    titel: 'Sprechstunden',
    beschreibung: 'Die drei Listen in der Sprechstunden-Blase.',
    symbol: '/icons/navigation/oeffnungszeiten.svg',
    felder: [
      zeitenListe('zahnaerztlich', 'Zahnärztliche Sprechstunde'),
      zeitenListe('kieferorthopaedisch', 'Kieferorthopädische Sprechstunde'),
      zeitenListe('telefonisch', 'Telefonische Erreichbarkeit'),
    ],
  },

  leistungen: {
    titel: 'Leistungen',
    beschreibung: 'Jede Leistung hat eine eigene Seite unter /leistungen/… Die Kennung ist Teil der Adresse und lässt sich bei bestehenden Leistungen nicht mehr ändern.',
    symbol: '/icons/navigation/leistungen.svg',
    felder: [
      {
        name: 'eintraege',
        label: 'Leistungen',
        typ: 'eintraege',
        standard: true,
        titelfeld: 'titel',
        felder: [
          { name: 'titel', label: 'Titel', typ: 'text' },
          { name: 'kategorie', label: 'Bereich', typ: 'auswahl', quelle: 'kategorien' },
          { name: 'kurz', label: 'Kurztext auf der Kachel', typ: 'mehrzeilig', hilfe: 'Ein bis zwei Sätze.' },
          { name: 'icon', label: 'Symbol', typ: 'bild', ordner: 'allgemein' },
          { name: 'inhalt', label: 'Text der Seite', typ: 'richtext' },
        ],
      },
      {
        name: 'kategorien',
        label: 'Bereiche (Überschriften der Übersicht)',
        typ: 'eintraege',
        standard: true,
        titelfeld: 'titel',
        hilfe: 'Leere Bereiche erscheinen nicht.',
        felder: [
          { name: 'titel', label: 'Titel', typ: 'text' },
          { name: 'kurz', label: 'Untertitel', typ: 'text' },
          { name: 'icon', label: 'Symbol', typ: 'bild', ordner: 'allgemein' },
        ],
      },
    ],
  },

  neuigkeiten: {
    titel: 'Neuigkeiten',
    beschreibung: 'Beiträge, neueste zuerst. Ist kein Beitrag aktiv, verschwindet der Bereich samt Menüpunkt.',
    symbol: '/icons/navigation/neuigkeiten.svg',
    felder: [
      { name: 'titel', label: 'Überschrift des Bereichs', typ: 'text' },
      { name: 'einleitung', label: 'Einleitungssatz', typ: 'text' },
      {
        name: 'eintraege',
        label: 'Beiträge',
        typ: 'eintraege',
        standard: true,
        titelfeld: 'titel',
        felder: [
          { name: 'titel', label: 'Überschrift', typ: 'text' },
          { name: 'datum', label: 'Datum', typ: 'datum' },
          { name: 'kurz', label: 'Anrisstext', typ: 'mehrzeilig' },
          { name: 'bild', label: 'Bild', typ: 'bild', ordner: 'neuigkeiten' },
          { name: 'bild_alt', label: 'Bildbeschreibung', typ: 'text', hilfe: 'Was ist auf dem Bild zu sehen? Wichtig für blinde Besucher.' },
          { name: 'inhalt', label: 'Text', typ: 'richtext' },
          {
            name: 'dateien',
            label: 'PDF-Anhänge',
            typ: 'eintraege',
            titelfeld: 'titel',
            felder: [
              { name: 'titel', label: 'Bezeichnung', typ: 'text' },
              { name: 'datei', label: 'PDF', typ: 'pdf', ordner: 'dokumente' },
              { name: 'beschreibung', label: 'Kurzbeschreibung', typ: 'text' },
            ],
          },
        ],
      },
    ],
  },

  team: {
    titel: 'Team',
    beschreibung: 'Ärztinnen, Ärzte und Mitarbeitende. Ausscheidende bitte ausschalten statt löschen — so bleibt das Foto erhalten.',
    symbol: '/icons/navigation/team.svg',
    felder: [
      {
        name: 'eintraege',
        label: 'Personen',
        typ: 'eintraege',
        standard: true,
        titelfeld: 'name',
        felder: [
          { name: 'name', label: 'Name', typ: 'text' },
          { name: 'gruppe', label: 'Gruppe', typ: 'auswahl', optionen: [{ wert: 'aerzte', label: 'Ärztinnen und Ärzte' }, { wert: 'team', label: 'Team' }] },
          { name: 'funktion', label: 'Funktion', typ: 'text' },
          { name: 'taetigkeiten', label: 'Tätigkeiten', typ: 'liste', hilfe: 'Je Zeile eine. Klappen auf der Seite beim Klick auf den Namen auf.' },
          { name: 'foto', label: 'Foto', typ: 'bild', ordner: 'team', hilfe: 'Hochformat vor weißem Hintergrund, wie die vorhandenen.' },
          { name: 'foto_alt', label: 'Bildbeschreibung', typ: 'text' },
        ],
      },
    ],
  },

  galerie: {
    titel: 'Praxisbilder',
    beschreibung: 'Das durchlaufende Bildband im Praxis-Bereich.',
    symbol: '/icons/navigation/praxis.svg',
    felder: [
      {
        name: 'eintraege',
        label: 'Bilder',
        typ: 'eintraege',
        standard: true,
        titelfeld: 'alt',
        felder: [
          { name: 'bild', label: 'Bild', typ: 'bild', ordner: 'galerie' },
          { name: 'alt', label: 'Bildbeschreibung', typ: 'text', hilfe: 'Pflicht: beschreibt das Bild für blinde Besucher.' },
        ],
      },
    ],
  },

  abschnitte: {
    titel: 'Eigene Abschnitte',
    beschreibung: 'Frei anlegbare Abschnitte im Praxis-Bereich — ohne eigenen Menüeintrag.',
    symbol: '/icons/navigation/praxis.svg',
    felder: [
      {
        name: 'eintraege',
        label: 'Abschnitte',
        typ: 'eintraege',
        standard: true,
        titelfeld: 'titel',
        felder: [
          { name: 'titel', label: 'Überschrift', typ: 'text' },
          { name: 'text', label: 'Text', typ: 'richtext' },
          { name: 'bild', label: 'Bild (optional)', typ: 'bild', ordner: 'abschnitte' },
          { name: 'bild_alt', label: 'Bildbeschreibung', typ: 'text' },
          { name: 'bild_anzeige', label: 'Bild anzeigen', typ: 'auswahl', optionen: [
            { wert: 'links', label: 'Links, halbe Breite — Text umfließt es' },
            { wert: 'rechts', label: 'Rechts, halbe Breite — Text umfließt es' },
            { wert: 'voll', label: 'Volle Breite über dem Text' },
          ] },
          { name: 'link_text', label: 'Verweis: Beschriftung', typ: 'text' },
          { name: 'link_ziel', label: 'Verweis: Adresse', typ: 'text' },
          { name: 'pdf_text', label: 'PDF-Knopf: Beschriftung', typ: 'text' },
          { name: 'pdf_datei', label: 'PDF-Knopf: Datei', typ: 'pdf', ordner: 'dokumente' },
        ],
      },
    ],
  },

  stellen: {
    titel: 'Stellenanzeigen',
    beschreibung: 'Ist keine Stelle aktiv, blendet sich der Bereich aus.',
    symbol: '/icons/navigation/team.svg',
    felder: [
      { name: 'titel', label: 'Überschrift des Bereichs', typ: 'text' },
      { name: 'einleitung', label: 'Einleitung', typ: 'text' },
      {
        name: 'eintraege',
        label: 'Stellen',
        typ: 'eintraege',
        standard: true,
        titelfeld: 'titel',
        felder: [
          { name: 'titel', label: 'Bezeichnung', typ: 'text' },
          { name: 'umfang', label: 'Umfang', typ: 'text', hilfe: 'z. B. Vollzeit oder Teilzeit' },
          { name: 'beschreibung', label: 'Beschreibung', typ: 'richtext' },
          { name: 'ansprechpartner', label: 'Ansprechperson', typ: 'text' },
          { name: 'pdf_datei', label: 'Ausführliche Anzeige als PDF (optional)', typ: 'pdf', ordner: 'dokumente' },
        ],
      },
    ],
  },

  navigation: {
    titel: 'Menü',
    beschreibung: 'Beschriftung und Reihenfolge der Menüpunkte. Die Ziele bitte nur nach Rücksprache ändern.',
    symbol: '/icons/navigation/praxis.svg',
    felder: [
      {
        name: 'eintraege',
        label: 'Menüpunkte',
        typ: 'eintraege',
        standard: true,
        titelfeld: 'titel',
        felder: [
          { name: 'titel', label: 'Beschriftung', typ: 'text' },
          { name: 'ziel', label: 'Ziel', typ: 'text', gesperrt: true },
          { name: 'icon', label: 'Symbol', typ: 'bild', ordner: 'allgemein' },
          { name: 'in_kopfleiste', label: 'In der Leiste oben', typ: 'schalter' },
          { name: 'in_fussleiste', label: 'In der Symbolleiste unten', typ: 'schalter' },
          { name: 'position_fussleiste', label: 'Reihenfolge unten', typ: 'zahl' },
          { name: 'in_fussleiste_klein', label: 'Auf Handys unten zeigen', typ: 'schalter', hilfe: 'Dort ist Platz für drei.' },
        ],
      },
    ],
  },

  seite: {
    titel: 'Angaben für Google und Kontakt',
    beschreibung: 'Titel und Beschreibung, die Suchmaschinen zeigen, sowie Adresse und Telefonnummer der Praxis.',
    symbol: '/icons/navigation/kontakt.svg',
    felder: [
      { name: 'titel', label: 'Seitentitel', typ: 'text', hilfe: 'Unter 60 Zeichen.' },
      { name: 'beschreibung', label: 'Beschreibung für Suchmaschinen', typ: 'mehrzeilig', hilfe: 'Unter 160 Zeichen.' },
      { name: 'vorschaubild', label: 'Vorschaubild beim Teilen', typ: 'bild', ordner: 'allgemein' },
      {
        name: 'praxis',
        label: 'Praxis',
        typ: 'gruppe',
        felder: [
          { name: 'name', label: 'Name', typ: 'text' },
          { name: 'strasse', label: 'Straße', typ: 'text' },
          { name: 'plz', label: 'PLZ', typ: 'text' },
          { name: 'ort', label: 'Ort', typ: 'text' },
          { name: 'telefon', label: 'Telefon', typ: 'text' },
          { name: 'fax', label: 'Fax', typ: 'text' },
          { name: 'email', label: 'E-Mail', typ: 'text' },
        ],
      },
    ],
  },
};

/** Reihenfolge auf der Übersichtsseite */
export const reihenfolge: Bereich[] = [
  'hinweis', 'oeffnungszeiten', 'neuigkeiten', 'leistungen', 'team',
  'galerie', 'abschnitte', 'stellen', 'seite', 'navigation',
];
