/**
 * Aufbau der Seite: welche Blöcke die Startseite zeigt, wohin sie und
 * ihre Abschnitte führen und wie daraus das Menü entsteht.
 *
 * Reine Funktionen ohne Zugriff auf Dateien — die Seite (beim Bauen,
 * content/inhalte.ts) und die Redaktion (Menüvorschau, Ziel-Auswahl)
 * rechnen damit dasselbe. Was hier steht, gilt also an beiden Stellen.
 */
import type { Abschnitt, Beitrag, Bereich, Block, MenuePunkt, Seitenaufbau } from '../content/schema';

/** Die Inhalte, aus denen sich der Aufbau ergibt */
export interface Daten {
  seitenaufbau: Seitenaufbau;
  bereiche: { eintraege: Bereich[] };
  leistungen: {
    kategorien: { id: string; titel: string; kurz: string; aktiv: boolean; position: number }[];
    eintraege: { kategorie: string; aktiv: boolean }[];
  };
  galerie: { eintraege: { aktiv: boolean }[] };
  team: { eintraege: { aktiv: boolean }[] };
  stellen: { eintraege: { aktiv: boolean }[] };
}

/* ---------- Adressen ---------- */

/** Sprungmarken der eingebauten Blöcke — sie stehen seit der Webflow-Seite fest */
export const ANKER: Record<string, string> = {
  willkommen: 'praxis',
  galerie: 'galerie',
  leistungen: 'leistungen',
  team: 'team',
  stellen: 'stellen',
  kontakt: 'contact',
};

/** Adresse einer eigenen Seite: /dentosophie/ */
export const seitenAdresse = (b: Bereich) => `/${b.id}/`;

/** Adresse eines Beitrags: /neuigkeiten/neue-behandlungseinheit/ */
export const beitragAdresse = (blog: Bereich, beitrag: { id: string }) => `/${blog.id}/${beitrag.id}/`;

/** Sprungmarke eines Blocks auf der Startseite (ohne #) */
export function blockAnker(block: Block): string {
  return ANKER[block.art] ?? block.id;
}

/**
 * Sprungmarke eines Abschnitts. Auf einer eigenen Seite gehört sie dem
 * Abschnitt allein (`#mundatmung`); auf der Startseite teilen sich viele
 * Bereiche einen Namensraum, dort steht der Bereich davor
 * (`#kieferorthopaedie-unter-einem-dach-teil-1`).
 */
export function abschnittAnker(bereich: Bereich, abschnitt: Abschnitt): string {
  return bereich.typ === 'seite' ? abschnitt.id : `${bereich.id}-${abschnitt.id}`;
}

/** Ziel eines Abschnitts, von überall aus erreichbar */
export function abschnittZiel(bereich: Bereich, abschnitt: Abschnitt): string {
  return bereich.typ === 'seite'
    ? `${seitenAdresse(bereich)}#${abschnitt.id}`
    : `/#${abschnittAnker(bereich, abschnitt)}`;
}

/** Aktive Beiträge eines Blogs, neueste zuerst */
export function aktiveBeitraege(blog: Bereich): Beitrag[] {
  if (blog.typ !== 'blog') return [];
  return blog.beitraege.filter((b) => b.aktiv).sort((a, b) => b.datum.localeCompare(a.datum));
}

/* ---------- Blöcke ---------- */

export interface SichtbarerBlock {
  block: Block;
  /** Der Bereich zu einem Block der Art `bereich` */
  bereich?: Bereich;
  /** Zeigt der Block etwas auf der Startseite? (Eine Seite ohne Karte und
      ein reiner Menüpunkt tun das nicht, stehen aber im Menü.) */
  aufStartseite: boolean;
}

/**
 * Die Blöcke, die gerade etwas zu zeigen haben, in ihrer Reihenfolge.
 * Ein Block ohne Inhalt fällt samt Menüpunkt weg — so wie die
 * Neuigkeiten schon immer verschwanden, wenn kein Beitrag aktiv war.
 */
export function sichtbareBloecke(d: Daten): SichtbarerBlock[] {
  const bereiche = new Map(d.bereiche.eintraege.map((b) => [b.id, b]));
  const aktiv = (liste: { aktiv: boolean }[]) => liste.some((e) => e.aktiv);
  const ergebnis: SichtbarerBlock[] = [];

  for (const block of d.seitenaufbau.bloecke) {
    if (!block.aktiv) continue;
    switch (block.art) {
      case 'bereich': {
        const bereich = bereiche.get(block.id);
        if (!bereich?.aktiv) break;
        if (bereich.typ === 'blog' && aktiveBeitraege(bereich).length === 0) break;
        if (bereich.typ === 'abschnitt' && bereich.abschnitte.length === 0) break;
        const aufStartseite = bereich.typ !== 'seite' || bereich.auf_startseite;
        if (!aufStartseite && !block.menue) break;
        ergebnis.push({ block, bereich, aufStartseite });
        break;
      }
      case 'verweis':
        if (block.menue && block.ziel) ergebnis.push({ block, aufStartseite: false });
        break;
      case 'galerie':
        if (aktiv(d.galerie.eintraege)) ergebnis.push({ block, aufStartseite: true });
        break;
      case 'team':
        if (aktiv(d.team.eintraege)) ergebnis.push({ block, aufStartseite: true });
        break;
      case 'stellen':
        if (aktiv(d.stellen.eintraege)) ergebnis.push({ block, aufStartseite: true });
        break;
      case 'leistungen':
        if (aktiv(d.leistungen.eintraege)) ergebnis.push({ block, aufStartseite: true });
        break;
      default:
        ergebnis.push({ block, aufStartseite: true });
    }
  }
  return ergebnis;
}

/** Wohin der Menüpunkt eines Blocks führt */
export function blockZiel({ block, bereich }: SichtbarerBlock): string {
  if (block.art === 'verweis') return block.ziel;
  if (bereich?.typ === 'seite') return seitenAdresse(bereich);
  return `/#${blockAnker(block)}`;
}

/* ---------- Menü ---------- */

export interface Unterpunkt {
  titel: string;
  kurz: string;
  ziel: string;
}

export interface Menuepunkt {
  /** Kennung des Blocks; der Sprechstunden-Punkt heißt `zeiten` */
  id: string;
  titel: string;
  symbol: string;
  ziel: string;
  unterpunkte: Unterpunkt[];
}

/** Unterpunkte, die sich aus dem Inhalt ergeben: Kategorien, markierte Abschnitte */
function automatischeUnterpunkte(d: Daten, s: SichtbarerBlock): Unterpunkt[] {
  if (s.block.art === 'leistungen') {
    const belegt = new Set(d.leistungen.eintraege.filter((e) => e.aktiv).map((e) => e.kategorie));
    return d.leistungen.kategorien
      .filter((k) => k.aktiv && belegt.has(k.id))
      .sort((a, b) => a.position - b.position)
      .map((k) => ({ titel: k.titel, kurz: k.kurz, ziel: `/#leistungen-${k.id}` }));
  }
  const b = s.bereich;
  if (!b || b.typ === 'blog') return [];
  return b.abschnitte
    .filter((a) => a.im_menue && a.titel.trim())
    .map((a) => ({ titel: a.titel, kurz: '', ziel: abschnittZiel(b, a) }));
}

function punkt(id: string, m: MenuePunkt, ziel: string, auto: Unterpunkt[]): Menuepunkt {
  return {
    id,
    titel: m.titel,
    symbol: m.symbol,
    ziel,
    unterpunkte: [...auto, ...m.unterpunkte.map((u) => ({ titel: u.titel, kurz: u.kurz ?? '', ziel: u.ziel }))],
  };
}

/**
 * Das Menü: vorn die Sprechstunden — die Karte steht fest ganz oben —,
 * dann jeder Block mit Menüangaben in der Reihenfolge der Seite.
 */
export function menueBauen(d: Daten): Menuepunkt[] {
  const sprechstunden = punkt('zeiten', d.seitenaufbau.sprechstunden.menue, '/#oz_anchor', []);
  const uebrige = sichtbareBloecke(d)
    .filter((s) => s.block.menue)
    .map((s) => punkt(s.block.id, s.block.menue!, blockZiel(s), automatischeUnterpunkte(d, s)));
  return [sprechstunden, ...uebrige];
}

/**
 * Übergangsname einer Karte und ihrer Zielseite — aus der Adresse
 * gebildet, damit beide Seiten denselben finden: /neuigkeiten/x/ →
 * `neuigkeiten-x`. Vorher stand dort allein die Kennung des Beitrags;
 * mit mehreren Blogs könnten zwei Beiträge gleich heißen.
 */
export function morphName(adresse: string): string {
  return adresse.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '-') || 'start';
}
