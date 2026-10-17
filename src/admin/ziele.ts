/**
 * Alle Ziele, auf die ein Knopf, Menüpunkt oder Textlink zeigen kann —
 * als Baum für den Dialog „Wohin soll das führen?" (dialoge.ts), und
 * die lesbare Beschreibung eines gespeicherten Ziels („Dentosophie ›
 * Mundatmung und ihre Folgen" statt „/dentosophie/#mundatmung").
 *
 * Die Adressen bildet lib/aufbau.ts — dieselben Funktionen, mit denen
 * die Seite gebaut wird. Was hier angeboten wird, gibt es also auch.
 */
import { ANKER, abschnittZiel, beitragAdresse, seitenAdresse } from '../lib/aufbau';
import type { Bereich, Seitenaufbau } from '../content/schema';

export interface Zielpunkt {
  titel: string;
  ziel: string;
  /** 0 = Seite oder Block, 1 = Abschnitt darin */
  tiefe: number;
  /** Nicht (mehr) sichtbar auf der Seite — der Verweis liefe ins Leere */
  ausgeblendet?: boolean;
}

export interface Zielgruppe {
  titel: string;
  punkte: Zielpunkt[];
}

export interface ZielDaten {
  seitenaufbau: Seitenaufbau;
  bereiche: { eintraege: Bereich[] };
  leistungen: { kategorien: { id: string; titel: string; aktiv: boolean; position: number }[]; eintraege: { id: string; titel: string; aktiv: boolean; kategorie: string; position: number }[] };
}

/** Namen der eingebauten Blöcke, wie die Redaktion sie zeigt */
export const BLOCKNAMEN: Record<string, string> = {
  willkommen: 'Begrüßung',
  galerie: 'Bilderband',
  leistungen: 'Leistungen',
  team: 'Team',
  stellen: 'Stellenangebote',
  kontakt: 'Kontakt',
};

export function zieleSammeln(d: ZielDaten): Zielgruppe[] {
  const bereiche = new Map(d.bereiche.eintraege.map((b) => [b.id, b]));
  const start: Zielpunkt[] = [{ titel: 'Sprechstunden', ziel: '/#oz_anchor', tiefe: 0 }];

  for (const block of d.seitenaufbau.bloecke) {
    if (block.art === 'verweis') continue;
    if (block.art === 'bereich') {
      const b = bereiche.get(block.id);
      if (!b || b.typ === 'seite') continue; // Seiten stehen bei den Seiten
      start.push({ titel: b.titel, ziel: `/#${b.id}`, tiefe: 0, ausgeblendet: !block.aktiv || !b.aktiv });
      if (b.typ === 'abschnitt') {
        for (const a of b.abschnitte.filter((a) => a.titel.trim())) start.push({ titel: a.titel, ziel: abschnittZiel(b, a), tiefe: 1 });
      }
      continue;
    }
    start.push({ titel: BLOCKNAMEN[block.art] ?? block.art, ziel: `/#${ANKER[block.art]}`, tiefe: 0, ausgeblendet: !block.aktiv });
    if (block.art === 'leistungen') {
      for (const k of [...d.leistungen.kategorien].sort((a, b) => a.position - b.position).filter((k) => k.aktiv)) {
        start.push({ titel: k.titel, ziel: `/#leistungen-${k.id}`, tiefe: 1 });
      }
    }
  }

  const seiten: Zielpunkt[] = [];
  for (const b of d.bereiche.eintraege.filter((b) => b.typ === 'seite')) {
    seiten.push({ titel: b.titel, ziel: seitenAdresse(b), tiefe: 0, ausgeblendet: !b.aktiv });
    if (b.typ === 'seite') {
      for (const a of b.abschnitte.filter((a) => a.titel.trim())) seiten.push({ titel: a.titel, ziel: abschnittZiel(b, a), tiefe: 1 });
    }
  }

  const leistungen: Zielpunkt[] = [...d.leistungen.eintraege]
    .sort((a, b) => a.position - b.position)
    .map((l) => ({ titel: l.titel, ziel: `/leistungen/${l.id}/`, tiefe: 0, ausgeblendet: !l.aktiv }));

  const beitraege: Zielpunkt[] = [];
  for (const blog of d.bereiche.eintraege) {
    if (blog.typ !== 'blog') continue;
    for (const p of [...blog.beitraege].sort((a, b) => b.datum.localeCompare(a.datum))) {
      beitraege.push({ titel: `${p.titel}`, ziel: beitragAdresse(blog, p), tiefe: 0, ausgeblendet: !p.aktiv || !blog.aktiv });
    }
  }

  return [
    { titel: 'Startseite', punkte: start },
    { titel: 'Eigene Seiten', punkte: seiten },
    { titel: 'Leistungen', punkte: leistungen },
    { titel: 'Beiträge', punkte: beitraege },
    {
      titel: 'Rechtliches',
      punkte: [
        { titel: 'Impressum', ziel: '/impressum/', tiefe: 0 },
        { titel: 'Datenschutzerklärung', ziel: '/datenschutz/', tiefe: 0 },
      ],
    },
  ].filter((g) => g.punkte.length);
}

/**
 * Ein Ziel in Worten. `fehlt` ist wahr, wenn das Ziel auf dieser Seite
 * liegt, es aber (nicht mehr) gibt — dann warnt die Redaktion.
 */
export function zielBeschreiben(ziel: string, d: ZielDaten): { text: string; art: string; fehlt: boolean } {
  if (!ziel) return { text: 'Noch kein Ziel gewählt', art: 'leer', fehlt: false };
  if (ziel.startsWith('mailto:')) return { text: ziel.slice(7), art: 'E-Mail', fehlt: false };
  if (ziel.startsWith('tel:')) return { text: ziel.slice(4), art: 'Telefon', fehlt: false };
  if (/^https?:/i.test(ziel)) {
    let host = ziel;
    try { host = new URL(ziel).host.replace(/^www\./, ''); } catch { /* bleibt die Adresse */ }
    return { text: host, art: 'Andere Website', fehlt: false };
  }
  if (/\.[a-z0-9]{2,5}$/i.test(ziel.split('#')[0])) {
    return { text: decodeURIComponent(ziel.split('/').pop() ?? ziel), art: 'Datei', fehlt: false };
  }
  for (const gruppe of zieleSammeln(d)) {
    for (let i = 0; i < gruppe.punkte.length; i++) {
      const p = gruppe.punkte[i];
      if (p.ziel !== ziel) continue;
      // Der übergeordnete Punkt davor, für „Dentosophie › Mundatmung"
      let oben = '';
      if (p.tiefe === 1) for (let j = i - 1; j >= 0; j--) if (gruppe.punkte[j].tiefe === 0) { oben = gruppe.punkte[j].titel; break; }
      const text = oben ? `${oben} › ${p.titel}` : p.titel;
      return { text: p.ausgeblendet ? `${text} (ausgeblendet)` : text, art: gruppe.titel, fehlt: false };
    }
  }
  return { text: ziel, art: 'Auf dieser Website', fehlt: true };
}
