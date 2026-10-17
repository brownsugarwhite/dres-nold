/**
 * Der Seitenplan — links in der Redaktion: die Startseite von oben nach
 * unten als Folge kleiner Skizzen (Florian, Oktober 2026).
 *
 *   Hinweis            meldet sich beim Öffnen der Seite
 *   Startbereich       fest
 *   Sprechstunden      fest, im Menü immer vorn
 *   … die Blöcke …     verschiebbar: Ziehen am Griff oder ▲ / ▼
 *   + Neuer Bereich
 *   Fußbereich         fest — öffnet die Praxisangaben
 *
 * Die Reihenfolge hier IST die Reihenfolge der Seite, und das Menü folgt
 * ihr. Ein Klick auf einen Block öffnet ihn rechts zum Bearbeiten.
 */
import { el } from './werkzeug';
import { sortierbar, schieben } from './sortieren';
import { SKIZZEN } from './skizzen';
import { BLOCKNAMEN } from './ziele';
import { BEREICHSARTEN } from './formulare';

export interface PlanBlock {
  id: string;
  art: string;
  aktiv: boolean;
  menue: { titel: string; symbol: string } | null;
}

export interface PlanDaten {
  bloecke: PlanBlock[];
  bereiche: { id: string; typ: string; titel: string; aktiv: boolean; auf_startseite?: boolean }[];
  sprechstunden: { titel: string; symbol: string };
  hinweis: { aktiv: boolean; titel: string; von: string; bis: string };
}

export interface PlanAktionen {
  /** Die neue Reihenfolge der Kennungen */
  umsortiert: (ids: string[]) => void;
  neuerBereich: () => void;
}

/** Ein kleines Schloss: Dieser Block steht fest */
function schloss(): HTMLElement {
  const s = el('span', { class: 'plan__schloss', title: 'Steht fest', 'aria-hidden': 'true' });
  s.innerHTML = '<svg viewBox="0 0 12 14" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1" y="6" width="10" height="7" rx="1.5"/><path d="M3.5 6V4a2.5 2.5 0 0 1 5 0v2"/></svg>';
  return s;
}

const datum = (iso: string) => (iso ? new Date(iso).toLocaleDateString('de-DE', { day: 'numeric', month: 'numeric' }) : '');

/** Hinweis: an, aus, geplant oder abgelaufen? */
function hinweisZustand(h: PlanDaten['hinweis']): string {
  if (!h.aktiv) return 'aus';
  const heute = new Date().toISOString().slice(0, 10);
  if (h.von && heute < h.von) return `ab ${datum(h.von)}`;
  if (h.bis && heute > h.bis) return 'abgelaufen';
  return h.bis ? `an bis ${datum(h.bis)}` : 'an';
}

function zeile(o: {
  ziel: string; titel: string; art: string; skizze: string; aktiv?: boolean; fest?: boolean;
  menue?: { titel: string; symbol: string } | null; marke?: string; id?: string; gestrichelt?: boolean;
}): HTMLElement {
  const verweis = el('a', { class: 'plan__verweis', href: `#/${o.ziel}`, 'data-astro-prefetch': 'false' }, [
    el('span', { class: 'plan__skizze' }),
    el('span', { class: 'plan__text' }, [
      el('span', { class: 'plan__titel', text: o.titel }),
      el('span', { class: 'plan__art', text: o.art }),
    ]),
    el('span', { class: 'plan__marken' }, [
      o.menue ? el('span', { class: 'plan__menue', title: 'Steht im Menü' }, [o.menue.symbol ? el('img', { src: o.menue.symbol, alt: '' }) : null, o.menue.titel]) : null,
      o.marke ? el('span', { class: 'marke', text: o.marke }) : null,
    ]),
  ]);
  verweis.querySelector('.plan__skizze')!.innerHTML = o.skizze;
  const eintrag = el('li', { class: 'plan__block' }, [
    o.fest ? schloss() : el('span', { class: 'plan__griff', title: 'Ziehen zum Verschieben', 'aria-hidden': 'true', text: '⠿' }),
    verweis,
  ]);
  if (o.id) eintrag.dataset.id = o.id;
  if (o.fest) eintrag.dataset.fest = '';
  if (o.aktiv === false) eintrag.dataset.aus = '';
  if (o.gestrichelt) eintrag.dataset.nurMenue = '';
  eintrag.dataset.ziel = o.ziel;
  return eintrag;
}

export function planZeichnen(ziel: HTMLElement, d: PlanDaten, aktionen: PlanAktionen): void {
  const bereiche = new Map(d.bereiche.map((b) => [b.id, b]));
  const liste = el('ol', { class: 'plan__liste' });

  liste.append(zeile({ ziel: 'start', titel: 'Startbereich', art: 'Logo — steht fest', skizze: SKIZZEN.start, fest: true }));
  liste.append(zeile({ ziel: 'sprechstunden', titel: 'Sprechstunden', art: 'Steht fest, im Menü vorn', skizze: SKIZZEN.sprechstunden, fest: true, menue: d.sprechstunden }));

  for (const b of d.bloecke) {
    let titel = BLOCKNAMEN[b.art] ?? b.art;
    let art = 'Block';
    let skizze = SKIZZEN[b.art] ?? '';
    let marke = b.aktiv ? '' : 'ausgeblendet';
    let nurMenue = false;
    if (b.art === 'bereich') {
      const bereich = bereiche.get(b.id);
      titel = bereich?.titel ?? b.id;
      art = BEREICHSARTEN[bereich?.typ ?? '']?.titel ?? 'Bereich';
      skizze = SKIZZEN[bereich?.typ ?? ''] ?? '';
      if (bereich && !bereich.aktiv) marke = 'offline';
      if (bereich?.typ === 'seite' && bereich.auf_startseite === false) {
        nurMenue = true;
        art = b.menue ? 'Eigene Seite — nur im Menü' : 'Eigene Seite — ohne Karte und Menü';
      }
    }
    if (b.art === 'verweis') {
      titel = b.menue?.titel || 'Menüpunkt';
      art = 'Nur im Menü';
      nurMenue = true;
    }
    const eintrag = zeile({ ziel: `block/${b.id}`, titel, art, skizze, aktiv: b.aktiv, menue: b.menue, marke, id: b.id, gestrichelt: nurMenue });
    const hoch = el('button', { class: 'plan__schritt', type: 'button', 'aria-label': `${titel} nach oben`, text: '▲' });
    const runter = el('button', { class: 'plan__schritt', type: 'button', 'aria-label': `${titel} nach unten`, text: '▼' });
    hoch.addEventListener('click', () => schieben(liste, eintrag, -1, sortierung));
    runter.addEventListener('click', () => schieben(liste, eintrag, 1, sortierung));
    eintrag.append(el('span', { class: 'plan__schritte' }, [hoch, runter]));
    liste.append(eintrag);
  }

  const neu = el('li', { class: 'plan__neu' }, [el('button', { class: 'knopf plan__neuknopf', type: 'button', text: '+ Neuer Bereich' })]);
  neu.querySelector('button')!.addEventListener('click', aktionen.neuerBereich);
  liste.append(neu);
  liste.append(zeile({ ziel: 'allgemein', titel: 'Fußbereich', art: 'Praxisangaben, Impressum', skizze: SKIZZEN.fuss, fest: true }));

  const sortierung = {
    eintrag: '.plan__block',
    griff: '.plan__griff',
    fest: (e: HTMLElement) => e.hasAttribute('data-fest'),
    name: (e: HTMLElement) => e.querySelector('.plan__titel')?.textContent ?? 'Block',
    verschoben: () => aktionen.umsortiert([...liste.querySelectorAll<HTMLElement>('.plan__block[data-id]')].map((e) => e.dataset.id!)),
  };
  sortierbar(liste, sortierung);

  const hinweis = el('ol', { class: 'plan__liste plan__liste--hinweis' }, [
    zeile({ ziel: 'hinweis', titel: 'Hinweis', art: 'Meldet sich beim Öffnen der Seite', skizze: SKIZZEN.hinweis, fest: true, marke: hinweisZustand(d.hinweis) }),
  ]);

  ziel.replaceChildren(
    hinweis,
    el('h2', { class: 'plan__ueberschrift', text: 'Die Startseite von oben nach unten' }),
    liste,
    el('p', { class: 'plan__erklaerung', text: 'Ziehen Sie einen Block am Griff ⠿ an eine andere Stelle — oder nehmen Sie ▲ ▼. Das Menü folgt der Reihenfolge.' }),
  );
}

/** Den gerade geöffneten Block hervorheben */
export function planMarkieren(ziel: HTMLElement, route: string): void {
  for (const z of ziel.querySelectorAll<HTMLElement>('[data-ziel]')) {
    const verweis = z.querySelector('a');
    if (!verweis) continue;
    if (z.dataset.ziel === route) verweis.setAttribute('aria-current', 'page');
    else verweis.removeAttribute('aria-current');
  }
}
