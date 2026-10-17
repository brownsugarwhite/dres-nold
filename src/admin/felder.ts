/**
 * Die Felder der Redaktion.
 *
 * Ein Formular entsteht aus einer Liste von Feldbeschreibungen
 * (formulare.ts). Jedes Feld zeichnet sich selbst und liefert über
 * `lesen()` seinen Wert zurück — mehr nicht. Bewusst ohne Framework: Wer
 * ein neues Feld braucht, ergänzt hier eine Art in `feldBauen`.
 *
 * Geänderte Werte melden die Felder als `input`-Ereignis; die Redaktion
 * (redaktion.ts) hört an einer Stelle darauf, liest das Formular aus und
 * merkt sich, was ungespeichert ist. Auch Knöpfe (▲, ▼, Entfernen, ein
 * gewähltes Ziel) melden sich so.
 */
import { el, neueId, kennungAus, freieKennung, vorschauVon } from './werkzeug';
import { texteditor } from './richtext';
import { zielWaehlen, symbolWaehlen, dateiWaehlen, kartenWaehlen, bestaetigen } from './dialoge';
import { zielBeschreiben, type ZielDaten } from './ziele';
import { sortierbar, schieben } from './sortieren';
import { SKIZZEN } from './skizzen';

export type Wert = unknown;
export type Eintrag = Record<string, Wert>;

/** Was die Felder von der Umgebung brauchen */
export interface Umfeld {
  zielDaten: () => ZielDaten;
  symbole: { pfad: string; name: string }[];
}

interface Basis {
  name: string;
  label: string;
  /** Ein kurzer Satz unter dem Feld — nur, wo es ohne nicht geht */
  hilfe?: string;
  platzhalter?: string;
}

export type Feld =
  | (Basis & { typ: 'text' | 'mehrzeilig' | 'datum' | 'zahl' | 'liste'; gesperrt?: boolean; hoechstens?: number })
  | (Basis & { typ: 'schalter' })
  | (Basis & { typ: 'auswahl'; optionen: { wert: string; label: string }[] | ((umgebung: Eintrag) => { wert: string; label: string }[]) })
  | (Basis & { typ: 'segment'; optionen: { wert: string; label: string; skizze?: string }[] })
  | (Basis & { typ: 'richtext'; ohneBild?: boolean; ohneTabelle?: boolean; ordner?: string; klein?: boolean })
  | (Basis & { typ: 'bild'; ordner: string; altName?: string })
  | (Basis & { typ: 'datei' })
  | (Basis & { typ: 'ziel'; ohneDatei?: boolean })
  | (Basis & { typ: 'symbol' })
  | (Basis & { typ: 'kennung'; adresse?: (id: string) => string })
  | (Basis & { typ: 'gruppe'; felder: Feld[] })
  | (Basis & {
      typ: 'eintraege';
      felder: Feld[] | ((e: Eintrag) => Feld[]);
      einzahl: string;
      geschlecht?: 'm' | 'w' | 's';
      titelfeld?: string;
      /** id, aktiv und position verwalten (Listen mit eigener Adresse) */
      standard?: boolean;
      hoechstens?: number;
      /** Wie ein neuer Eintrag aussieht — darf nachfragen (Art wählen) */
      neu?: () => Promise<Eintrag | null> | Eintrag | null;
      /** Kleine Skizze im Kopf der Karte */
      skizze?: (e: Eintrag) => string;
      /** Eine Zeile unter dem Titel im Kopf der Karte */
      unterzeile?: (e: Eintrag) => string;
      /** Ein neuer Eintrag bekommt eine Kennung aus seinem Titel */
      kennungAusTitel?: boolean;
    })
  | (Basis & { typ: 'menue'; automatisch?: () => string[] })
  | (Basis & { typ: 'abschnitte'; ordner?: string })
  | { typ: 'info'; name: string; text: string; label?: string };

export interface Baustein {
  el: HTMLElement;
  lesen: () => Wert;
  /** Felder, die mehr als einen Wert setzen (Bild + Bildbeschreibung) */
  mehr?: () => Eintrag;
}

/** Meldet eine Änderung, die nicht aus einer Eingabe kam */
export const melden = (von: Element) => von.dispatchEvent(new Event('input', { bubbles: true }));

/* ------------------------------------------------------------------ */
/* Einfache Felder                                                     */
/* ------------------------------------------------------------------ */

function huelle(feld: { label?: string; hilfe?: string }, eingabe: HTMLElement, id?: string, klasse = 'feld'): HTMLElement {
  const label = feld.label ? el('label', { class: 'feld__label', text: feld.label }) : null;
  if (label && id) label.htmlFor = id;
  return el('div', { class: klasse }, [label, eingabe, feld.hilfe ? el('p', { class: 'feld__hilfe', text: feld.hilfe }) : null]);
}

function textFeld(feld: Extract<Feld, { typ: 'text' | 'mehrzeilig' | 'datum' | 'zahl' | 'liste' }>, wert: Wert): Baustein {
  const id = neueId();
  if (feld.typ === 'mehrzeilig' || feld.typ === 'liste') {
    const eingabe = el('textarea', {
      class: 'feld__mehrzeilig', id, placeholder: feld.platzhalter ?? '',
      value: feld.typ === 'liste' ? (Array.isArray(wert) ? wert.join('\n') : '') : wert == null ? '' : String(wert),
    });
    return {
      el: huelle(feld.typ === 'liste' ? { ...feld, hilfe: feld.hilfe ?? 'Je Zeile ein Eintrag.' } : feld, eingabe, id),
      lesen: () => (feld.typ === 'liste' ? eingabe.value.split('\n').map((z) => z.trim()).filter(Boolean) : eingabe.value.trim()),
    };
  }
  const typ = feld.typ === 'datum' ? 'date' : feld.typ === 'zahl' ? 'number' : 'text';
  const eingabe = el('input', { class: 'feld__eingabe', id, type: typ, value: wert == null ? '' : String(wert), placeholder: feld.platzhalter ?? '' });
  if (feld.hoechstens) eingabe.maxLength = feld.hoechstens;
  if (feld.gesperrt) eingabe.readOnly = true;
  return {
    el: huelle(feld, eingabe, id),
    lesen: () => (typ === 'number' ? Number(eingabe.value) || 0 : eingabe.value.trim()),
  };
}

function schalterFeld(feld: Basis, wert: Wert): Baustein {
  const id = neueId();
  const eingabe = el('input', { id, type: 'checkbox', checked: wert === true, class: 'schalter' });
  const label = el('label', { class: 'feld__label', text: feld.label });
  label.htmlFor = id;
  return {
    el: el('div', { class: 'feld feld--schalter' }, [eingabe, el('div', {}, [label, feld.hilfe ? el('p', { class: 'feld__hilfe', text: feld.hilfe }) : null])]),
    lesen: () => eingabe.checked,
  };
}

function auswahlFeld(feld: Extract<Feld, { typ: 'auswahl' }>, wert: Wert, umgebung: Eintrag): Baustein {
  const id = neueId();
  const auswahl = el('select', { class: 'feld__auswahl', id });
  const optionen = typeof feld.optionen === 'function' ? feld.optionen(umgebung) : feld.optionen;
  for (const o of optionen) auswahl.append(el('option', { value: o.wert, text: o.label, selected: o.wert === wert }));
  return { el: huelle(feld, auswahl, id), lesen: () => auswahl.value };
}

/** Wenige Möglichkeiten als Knöpfe nebeneinander — mit kleiner Skizze */
function segmentFeld(feld: Extract<Feld, { typ: 'segment' }>, wert: Wert): Baustein {
  const name = neueId();
  const gruppe = el('div', { class: 'segment', role: 'radiogroup', 'aria-label': feld.label });
  const knoepfe = feld.optionen.map((o) => {
    const eingabe = el('input', { type: 'radio', name, value: o.wert, checked: o.wert === wert });
    const label = el('label', { class: 'segment__wahl' }, [eingabe, o.skizze ? el('span', { class: 'segment__skizze' }) : null, el('span', { text: o.label })]);
    if (o.skizze) label.querySelector('.segment__skizze')!.innerHTML = o.skizze;
    gruppe.append(label);
    return eingabe;
  });
  if (!knoepfe.some((k) => k.checked) && knoepfe[0]) knoepfe[0].checked = true;
  return {
    el: el('div', { class: 'feld' }, [el('span', { class: 'feld__label', text: feld.label }), gruppe, feld.hilfe ? el('p', { class: 'feld__hilfe', text: feld.hilfe }) : null]),
    lesen: () => knoepfe.find((k) => k.checked)?.value ?? '',
  };
}

function kennungFeld(feld: Extract<Feld, { typ: 'kennung' }>, wert: Wert, neu: boolean, titel?: () => string): Baustein {
  const id = neueId();
  const eingabe = el('input', { class: 'feld__eingabe', id, type: 'text', value: wert == null ? '' : String(wert) });
  if (!neu) eingabe.readOnly = true;
  const hilfe = el('p', { class: 'feld__hilfe' });
  const zeigen = () => {
    const k = kennungAus(eingabe.value) || (titel ? kennungAus(titel()) : '');
    hilfe.textContent = neu
      ? `${feld.adresse ? `Adresse: ${feld.adresse(k || '…')} — ` : ''}wird beim ersten Speichern festgelegt.`
      : `${feld.adresse ? `Adresse: ${feld.adresse(k)} — ` : ''}bleibt fest, damit Verweise darauf nicht ins Leere laufen.`;
  };
  eingabe.addEventListener('input', zeigen);
  zeigen();
  return {
    el: el('div', { class: 'feld feld--leise' }, [el('label', { class: 'feld__label', text: feld.label, htmlFor: id }), eingabe, hilfe]),
    lesen: () => {
      let k = kennungAus(eingabe.value);
      if (!k && neu && titel) k = kennungAus(titel());
      if (neu) { eingabe.value = k; zeigen(); }
      return k;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Bilder, Dateien, Ziele, Symbole                                     */
/* ------------------------------------------------------------------ */

function bildFeld(feld: Extract<Feld, { typ: 'bild' }>, wert: Wert, umgebung: Eintrag): Baustein {
  let pfad = wert == null ? '' : String(wert);
  const vorschau = el('img', { class: 'bild__vorschau', alt: '' });
  const leer = el('span', { class: 'bild__leer', text: 'Kein Bild' });
  const waehlen = el('button', { class: 'knopf', type: 'button' });
  const entfernen = el('button', { class: 'knopf knopf--leise', type: 'button', text: 'Bild entfernen' });
  const altId = neueId();
  const alt = el('input', { class: 'feld__eingabe', id: altId, type: 'text', value: String(umgebung[feld.altName ?? ''] ?? ''), placeholder: 'z. B. „Behandlungszimmer mit großem Fenster"' });
  const altFeld = feld.altName
    ? el('div', { class: 'feld bild__alt' }, [
        el('label', { class: 'feld__label', text: 'Was ist auf dem Bild zu sehen?', htmlFor: altId }), alt,
        el('p', { class: 'feld__hilfe', text: 'Pflicht — wird Menschen vorgelesen, die das Bild nicht sehen.' }),
      ])
    : null;
  const zeigen = () => {
    vorschau.hidden = !pfad;
    leer.hidden = !!pfad;
    if (pfad) vorschau.src = vorschauVon(pfad);
    waehlen.textContent = pfad ? 'Anderes Bild …' : 'Bild wählen …';
    entfernen.hidden = !pfad;
    if (altFeld) altFeld.hidden = !pfad;
  };
  waehlen.addEventListener('click', async () => {
    const neu = await dateiWaehlen(feld.ordner);
    if (neu) { pfad = neu; zeigen(); melden(waehlen); }
  });
  entfernen.addEventListener('click', () => { pfad = ''; zeigen(); melden(entfernen); });
  zeigen();
  return {
    el: el('div', { class: 'feld' }, [
      el('span', { class: 'feld__label', text: feld.label }),
      el('div', { class: 'bild' }, [el('div', { class: 'bild__rahmen' }, [vorschau, leer]), el('div', { class: 'bild__knoepfe' }, [waehlen, entfernen])]),
      feld.hilfe ? el('p', { class: 'feld__hilfe', text: feld.hilfe }) : null,
      altFeld,
    ]),
    lesen: () => pfad,
    mehr: () => (feld.altName ? { [feld.altName]: pfad ? alt.value.trim() : '' } : {}),
  };
}

function dateiFeld(feld: Basis, wert: Wert): Baustein {
  let pfad = wert == null ? '' : String(wert);
  const name = el('span', { class: 'ziel__text' });
  const waehlen = el('button', { class: 'knopf', type: 'button' });
  const entfernen = el('button', { class: 'knopf knopf--leise', type: 'button', text: 'Entfernen' });
  const zeigen = () => {
    name.textContent = pfad ? decodeURIComponent(pfad.split('/').pop() ?? pfad) : 'Keine Datei';
    waehlen.textContent = pfad ? 'Andere Datei …' : 'Datei wählen …';
    entfernen.hidden = !pfad;
  };
  waehlen.addEventListener('click', async () => {
    const neu = await dateiWaehlen('dokumente');
    if (neu) { pfad = neu; zeigen(); melden(waehlen); }
  });
  entfernen.addEventListener('click', () => { pfad = ''; zeigen(); melden(entfernen); });
  zeigen();
  return { el: huelle(feld, el('div', { class: 'ziel' }, [name, waehlen, entfernen])), lesen: () => pfad };
}

function zielFeld(feld: Extract<Feld, { typ: 'ziel' }>, wert: Wert, umfeld: Umfeld): Baustein {
  let ziel = wert == null ? '' : String(wert);
  const art = el('span', { class: 'ziel__art' });
  const text = el('span', { class: 'ziel__text' });
  const warnung = el('p', { class: 'feld__hilfe', 'data-art': 'fehler', hidden: true, text: 'Dieses Ziel gibt es nicht (mehr). Bitte ein neues wählen.' });
  const waehlen = el('button', { class: 'knopf', type: 'button' });
  const zeigen = () => {
    const z = zielBeschreiben(ziel, umfeld.zielDaten());
    art.textContent = ziel ? z.art : '';
    art.hidden = !ziel;
    text.textContent = z.text;
    warnung.hidden = !z.fehlt;
    waehlen.textContent = ziel ? 'Ändern …' : 'Ziel wählen …';
  };
  waehlen.addEventListener('click', async () => {
    const neu = await zielWaehlen(ziel, umfeld.zielDaten(), feld.ohneDatei);
    if (neu !== null) { ziel = neu; zeigen(); melden(waehlen); }
  });
  zeigen();
  return {
    el: el('div', { class: 'feld' }, [
      el('span', { class: 'feld__label', text: feld.label }),
      el('div', { class: 'ziel' }, [art, text, waehlen]),
      warnung,
      feld.hilfe ? el('p', { class: 'feld__hilfe', text: feld.hilfe }) : null,
    ]),
    lesen: () => ziel,
  };
}

function symbolFeld(feld: Basis, wert: Wert, umfeld: Umfeld): Baustein {
  let pfad = wert == null ? '' : String(wert);
  const bild = el('img', { class: 'symbol__bild', alt: '' });
  const leer = el('span', { class: 'bild__leer', text: 'Kein Symbol' });
  const waehlen = el('button', { class: 'knopf', type: 'button' });
  const entfernen = el('button', { class: 'knopf knopf--leise', type: 'button', text: 'Ohne Symbol' });
  const zeigen = () => {
    bild.hidden = !pfad;
    leer.hidden = !!pfad;
    if (pfad) bild.src = vorschauVon(pfad);
    waehlen.textContent = pfad ? 'Anderes Symbol …' : 'Symbol wählen …';
    entfernen.hidden = !pfad;
  };
  waehlen.addEventListener('click', async () => {
    const neu = await symbolWaehlen(pfad, umfeld.symbole);
    if (neu) { pfad = neu; zeigen(); melden(waehlen); }
  });
  entfernen.addEventListener('click', () => { pfad = ''; zeigen(); melden(entfernen); });
  zeigen();
  return {
    el: el('div', { class: 'feld' }, [
      el('span', { class: 'feld__label', text: feld.label }),
      el('div', { class: 'symbol' }, [el('span', { class: 'symbol__rahmen' }, [bild, leer]), waehlen, entfernen]),
      feld.hilfe ? el('p', { class: 'feld__hilfe', text: feld.hilfe }) : null,
    ]),
    lesen: () => pfad,
  };
}

/* ------------------------------------------------------------------ */
/* Gruppen, Formulare                                                  */
/* ------------------------------------------------------------------ */

/**
 * Ein Formular aus Feldern über einem Objekt. `lesen()` liefert das
 * Objekt mit den neuen Werten — Felder, die das Formular nicht kennt,
 * bleiben unverändert erhalten.
 */
export function formularBauen(felder: Feld[], objekt: Eintrag, umfeld: Umfeld, neu = false): { el: HTMLElement; lesen: () => Eintrag } {
  const bausteine: [string, Baustein][] = [];
  let titelBaustein: Baustein | null = null;
  for (const f of felder) {
    const b = feldBauen(f, objekt[f.name], umfeld, objekt, neu, () => String(titelBaustein?.lesen() ?? ''));
    if (f.name === 'titel') titelBaustein = b;
    bausteine.push([f.name, b]);
  }
  return {
    el: el('div', { class: 'formular__felder' }, bausteine.map(([, b]) => b.el)),
    lesen: () => {
      const ergebnis: Eintrag = { ...objekt };
      for (const [name, b] of bausteine) {
        if (name.startsWith('_')) continue;
        ergebnis[name] = b.lesen();
        Object.assign(ergebnis, b.mehr?.() ?? {});
      }
      return ergebnis;
    },
  };
}

function gruppeFeld(feld: Extract<Feld, { typ: 'gruppe' }>, wert: Wert, umfeld: Umfeld): Baustein {
  const objekt = (wert && typeof wert === 'object' ? wert : {}) as Eintrag;
  const formular = formularBauen(feld.felder, objekt, umfeld);
  return {
    el: el('section', { class: 'gruppe' }, [
      el('h3', { class: 'gruppe__titel', text: feld.label }),
      feld.hilfe ? el('p', { class: 'gruppe__hilfe', text: feld.hilfe }) : null,
      formular.el,
    ]),
    lesen: () => formular.lesen(),
  };
}

/** Der Menüpunkt eines Blocks: an oder aus, Bezeichnung, Symbol, Unterpunkte */
function menueFeld(feld: Extract<Feld, { typ: 'menue' }>, wert: Wert, umfeld: Umfeld): Baustein {
  const vorher = (wert && typeof wert === 'object' ? wert : null) as Eintrag | null;
  const id = neueId();
  const an = el('input', { id, type: 'checkbox', class: 'schalter', checked: !!vorher });
  const objekt: Eintrag = vorher ?? { titel: '', symbol: '', unterpunkte: [] };
  const auto = feld.automatisch?.() ?? [];
  const formular = formularBauen([
    { typ: 'text', name: 'titel', label: 'Bezeichnung im Menü', platzhalter: 'kurz, z. B. „Dentosophie"', hoechstens: 18 },
    { typ: 'symbol', name: 'symbol', label: 'Symbol', hilfe: 'Erscheint in der Leiste unten und im Handy-Menü.' },
    {
      typ: 'eintraege', name: 'unterpunkte', label: auto.length ? 'Weitere Unterpunkte' : 'Unterpunkte', einzahl: 'Unterpunkt', titelfeld: 'titel', hoechstens: 8,
      felder: [
        { typ: 'text', name: 'titel', label: 'Bezeichnung' },
        { typ: 'text', name: 'kurz', label: 'Zusatzzeile (freiwillig)', platzhalter: 'z. B. „Vorsorge, Zahnerhalt und Zahnersatz"' },
        { typ: 'ziel', name: 'ziel', label: 'Führt zu' },
      ],
    },
  ], objekt, umfeld);
  const innen = el('div', { class: 'menue__innen' }, [
    auto.length ? el('div', { class: 'menue__auto' }, [
      el('span', { class: 'feld__label', text: 'Unterpunkte, die von selbst dabei sind' }),
      el('ul', {}, auto.map((t) => el('li', { text: t }))),
    ]) : null,
    formular.el,
  ]);
  const zeigen = () => { innen.hidden = !an.checked; };
  an.addEventListener('change', zeigen);
  zeigen();
  return {
    el: el('section', { class: 'gruppe gruppe--menue' }, [
      el('div', { class: 'feld feld--schalter' }, [an, el('div', {}, [
        el('label', { class: 'feld__label', text: feld.label, htmlFor: id }),
        el('p', { class: 'feld__hilfe', text: 'Der Platz im Menü folgt dem Platz auf der Seite.' }),
      ])]),
      innen,
    ]),
    lesen: () => (an.checked ? formular.lesen() : null),
  };
}

/* ------------------------------------------------------------------ */
/* Listen von Einträgen                                                */
/* ------------------------------------------------------------------ */

/** „Neuer Abschnitt", „Neue Person", „Neues Bild" */
const NEU_ARTIKEL = { m: 'Neuer', w: 'Neue', s: 'Neues' };

function eintraegeFeld(feld: Extract<Feld, { typ: 'eintraege' }>, wert: Wert, umfeld: Umfeld): Baustein {
  /* Die Knöpfe heißen nach dem, was sie anlegen (Florian, 17. September 2026) */
  const neuText = `+ ${NEU_ARTIKEL[feld.geschlecht ?? 'm']} ${feld.einzahl}`;
  const liste = el('div', { class: 'eintraege__liste' });
  const karten = new Map<HTMLElement, { lesen: () => Eintrag; beschriften: () => void }>();
  const neuKnopf = el('button', { class: 'knopf', type: 'button', text: neuText });

  const sortierung = {
    eintrag: '.eintrag',
    griff: '.eintrag__griff',
    name: (k: HTMLElement) => k.querySelector('.eintrag__titel')?.textContent ?? feld.einzahl,
    verschoben: () => { alleBeschriften(); melden(liste); },
  };
  const alleBeschriften = () => {
    for (const k of karten.values()) k.beschriften();
    neuKnopf.hidden = !!feld.hoechstens && karten.size >= feld.hoechstens;
  };

  const kartenBauen = (eintrag: Eintrag, neu: boolean) => {
    const felder = typeof feld.felder === 'function' ? feld.felder(eintrag) : feld.felder;
    const inhalt = el('div', { class: 'eintrag__inhalt', hidden: !neu });
    const nummer = el('span', { class: 'eintrag__nummer' });
    const titel = el('span', { class: 'eintrag__titel' });
    const unter = el('span', { class: 'eintrag__unter' });
    const marke = el('span', { class: 'marke', text: 'ausgeblendet', hidden: true });
    const skizze = el('span', { class: 'eintrag__skizze' });
    if (feld.skizze) skizze.innerHTML = feld.skizze(eintrag); else skizze.hidden = true;
    const kopf = el('button', { class: 'eintrag__kopf', type: 'button', 'aria-expanded': String(neu) }, [
      nummer, skizze, el('span', { class: 'eintrag__beschriftung' }, [titel, unter]), marke,
    ]);
    kopf.addEventListener('click', () => {
      const offen = kopf.getAttribute('aria-expanded') === 'true';
      kopf.setAttribute('aria-expanded', String(!offen));
      inhalt.hidden = offen;
    });
    const griff = el('span', { class: 'eintrag__griff', title: 'Ziehen zum Verschieben', 'aria-hidden': 'true', text: '⠿' });

    const standardFelder: Feld[] = feld.standard
      ? [{ typ: 'schalter', name: 'aktiv', label: 'Auf der Seite zeigen' }]
      : [];
    const kennung: Feld[] = feld.standard ? [{ typ: 'kennung', name: 'id', label: 'Kennung' }] : [];
    const formular = formularBauen([...standardFelder, ...felder, ...kennung], feld.standard ? { aktiv: true, ...eintrag } : eintrag, umfeld, neu || !eintrag.id);

    const karte = el('article', { class: 'eintrag' });
    const beschriften = () => {
      const stand = formular.lesen();
      const n = [...liste.children].indexOf(karte) + 1;
      const t = feld.titelfeld ? String(stand[feld.titelfeld] ?? '').trim() : '';
      titel.textContent = t || `${feld.einzahl} ${n}`;
      const u = feld.unterzeile?.(stand) ?? '';
      unter.textContent = u;
      unter.hidden = !u;
      nummer.textContent = String(n);
      const aus = feld.standard && stand.aktiv === false;
      marke.hidden = !aus;
      karte.toggleAttribute('data-inaktiv', !!aus);
    };

    const hoch = el('button', { class: 'knopf knopf--leise', type: 'button', text: '▲ nach oben' });
    const runter = el('button', { class: 'knopf knopf--leise', type: 'button', text: '▼ nach unten' });
    const weg = el('button', { class: 'knopf knopf--leise knopf--gefahr', type: 'button', text: `${feld.einzahl} entfernen` });
    hoch.addEventListener('click', () => schieben(liste, karte, -1, sortierung));
    runter.addEventListener('click', () => schieben(liste, karte, 1, sortierung));
    weg.addEventListener('click', async () => {
      const text = feld.standard
        ? `Meist ist „Auf der Seite zeigen" ausschalten die bessere Wahl — dann bleibt alles erhalten und lässt sich wieder einschalten.`
        : `${titel.textContent} wird entfernt. Rückgängig machen geht bis zum Veröffentlichen mit „Verwerfen".`;
      if (!(await bestaetigen(`${feld.einzahl} entfernen?`, text, 'Entfernen'))) return;
      karte.remove();
      karten.delete(karte);
      alleBeschriften();
      melden(liste);
    });

    inhalt.append(formular.el, el('div', { class: 'eintrag__werkzeuge' }, [hoch, runter, weg]));
    inhalt.addEventListener('input', beschriften);
    inhalt.addEventListener('change', beschriften);
    karte.append(el('div', { class: 'eintrag__leiste' }, [griff, kopf]), inhalt);
    karten.set(karte, { lesen: formular.lesen, beschriften });
    return karte;
  };

  for (const e of Array.isArray(wert) ? (wert as Eintrag[]) : []) liste.append(kartenBauen(e, false));
  alleBeschriften();
  sortierbar(liste, sortierung);

  neuKnopf.addEventListener('click', async () => {
    const vorlage = feld.neu ? await feld.neu() : {};
    if (!vorlage) return;
    const karte = kartenBauen(feld.standard ? { id: '', aktiv: true, ...vorlage } : vorlage, true);
    liste.append(karte);
    alleBeschriften();
    melden(liste);
    karte.scrollIntoView({ behavior: 'smooth', block: 'center' });
    karte.querySelector<HTMLElement>('.eintrag__inhalt input:not([type=checkbox]), .eintrag__inhalt [contenteditable]')?.focus({ preventScroll: true });
  });

  return {
    el: el('section', { class: 'eintraege' }, [
      el('h3', { class: 'eintraege__titel', text: feld.label }),
      feld.hilfe ? el('p', { class: 'feld__hilfe', text: feld.hilfe }) : null,
      liste,
      neuKnopf,
    ]),
    lesen: () => {
      /* Reihenfolge im Formular = Reihenfolge auf der Seite */
      const werte = [...liste.children].map((k) => karten.get(k as HTMLElement)?.lesen()).filter((e): e is Eintrag => !!e);
      if (feld.standard) {
        const ids = new Set<string>();
        return werte.map((e, i) => {
          let id = String(e.id ?? '');
          if (!id) id = freieKennung(String(e[feld.titelfeld ?? 'titel'] ?? ''), ids, kennungAus(feld.einzahl));
          ids.add(id);
          return { ...e, id, position: i + 1 };
        });
      }
      if (feld.kennungAusTitel) {
        const ids = new Set(werte.map((e) => String(e.id ?? '')).filter(Boolean));
        return werte.map((e) => {
          if (e.id) return e;
          const id = freieKennung(String(e.titel ?? ''), ids, String(e.art ?? 'abschnitt'));
          ids.add(id);
          return { ...e, id };
        });
      }
      return werte;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Abschnitte: Text, Kacheln, Kapitel                                  */
/* ------------------------------------------------------------------ */

const ARTEN = [
  { wert: 'text', titel: 'Text', text: 'Ein Text, wahlweise mit einem Bild links oder rechts daneben.', skizze: SKIZZEN.text },
  { wert: 'kacheln', titel: 'Kacheln', text: 'Mehrere kurze Texte nebeneinander, mit oder ohne Symbol — z. B. „Atmen · Kauen · Schlucken".', skizze: SKIZZEN.kacheln },
  { wert: 'kapitel', titel: 'Kapitel', text: 'Eine große Überschrift mit Linie, die ein neues Kapitel beginnt.', skizze: SKIZZEN.kapitel },
];

const KNOEPFE: Feld = {
  typ: 'eintraege', name: 'knoepfe', label: 'Knöpfe unter dem Abschnitt', einzahl: 'Knopf', titelfeld: 'text', hoechstens: 3,
  felder: [
    { typ: 'text', name: 'text', label: 'Beschriftung', platzhalter: 'z. B. „Termin vereinbaren"' },
    { typ: 'ziel', name: 'ziel', label: 'Führt zu' },
  ],
};

const SATZ: Feld = { typ: 'text', name: 'knoepfe_text', label: 'Satz über den Knöpfen (freiwillig)', platzhalter: 'z. B. „Mehr dazu erfahren Sie hier:"' };

const IM_MENUE: Feld = { typ: 'schalter', name: 'im_menue', label: 'Als Unterpunkt im Menü zeigen', hilfe: 'Braucht eine Überschrift. Ein Klick darauf führt genau hierher.' };

/** Die Felder je Art eines Abschnitts */
export function abschnittFelder(art: string, ordner: string): Feld[] {
  if (art === 'kapitel') {
    return [
      { typ: 'text', name: 'titel', label: 'Überschrift des Kapitels' },
      { typ: 'richtext', name: 'text', label: 'Einleitung (freiwillig)', ohneBild: true, ohneTabelle: true, klein: true },
      IM_MENUE, SATZ, KNOEPFE,
    ];
  }
  if (art === 'kacheln') {
    return [
      { typ: 'text', name: 'titel', label: 'Überschrift (freiwillig)' },
      { typ: 'richtext', name: 'einleitung', label: 'Einleitung (freiwillig)', ohneBild: true, ohneTabelle: true, klein: true },
      {
        typ: 'eintraege', name: 'kacheln', label: 'Kacheln', einzahl: 'Kachel', geschlecht: 'w', titelfeld: 'titel', hoechstens: 12,
        felder: [
          { typ: 'symbol', name: 'symbol', label: 'Symbol (freiwillig)' },
          { typ: 'text', name: 'titel', label: 'Überschrift' },
          { typ: 'richtext', name: 'text', label: 'Text', ohneBild: true, ohneTabelle: true, klein: true },
          { typ: 'ziel', name: 'ziel', label: 'Verweis „Mehr erfahren" (freiwillig)' },
        ],
        neu: () => ({ symbol: '', titel: '', text: '', ziel: '' }),
      },
      IM_MENUE, SATZ, KNOEPFE,
    ];
  }
  return [
    { typ: 'text', name: 'titel', label: 'Überschrift (freiwillig)' },
    { typ: 'richtext', name: 'text', label: 'Text', ohneBild: true, ordner },
    { typ: 'bild', name: 'bild', label: 'Bild neben dem Text (freiwillig)', ordner, altName: 'bild_alt' },
    {
      typ: 'segment', name: 'bild_seite', label: 'Wo steht das Bild?',
      optionen: [{ wert: 'links', label: 'Links', skizze: SKIZZEN.text }, { wert: 'rechts', label: 'Rechts', skizze: SKIZZEN.text.replace('<svg class="skizze"', '<svg class="skizze skizze--gespiegelt"') }],
    },
    {
      typ: 'segment', name: 'bild_hoehe', label: 'Bildhöhe',
      optionen: [{ wert: 'format', label: 'Im eigenen Format' }, { wert: 'voll', label: 'So hoch wie der Text' }],
    },
    IM_MENUE, SATZ, KNOEPFE,
  ];
}

/** Ein neuer, leerer Abschnitt der gewählten Art */
export function neuerAbschnitt(art: string): Eintrag {
  const basis = { art, id: '', titel: '', im_menue: false, knoepfe_text: '', knoepfe: [] };
  if (art === 'kacheln') return { ...basis, einleitung: '', kacheln: [{ symbol: '', titel: '', text: '', ziel: '' }] };
  if (art === 'kapitel') return { ...basis, text: '' };
  return { ...basis, text: '', bild: '', bild_alt: '', bild_seite: 'links', bild_hoehe: 'format' };
}

function abschnitteFeld(feld: Basis & { ordner?: string }, wert: Wert, umfeld: Umfeld): Baustein {
  const ordner = feld.ordner ?? 'bereiche';
  const kurz = (html: unknown) => String(html ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 70);
  return eintraegeFeld({
    typ: 'eintraege', name: feld.name, label: feld.label, hilfe: feld.hilfe, einzahl: 'Abschnitt', titelfeld: 'titel', kennungAusTitel: true,
    felder: (e) => abschnittFelder(String(e.art ?? 'text'), ordner),
    skizze: (e) => SKIZZEN[String(e.art ?? 'text')] ?? '',
    unterzeile: (e) => {
      const art = ARTEN.find((a) => a.wert === e.art)?.titel ?? 'Text';
      const text = e.art === 'kacheln' ? `${(e.kacheln as unknown[] | undefined)?.length ?? 0} Kacheln` : kurz(e.text);
      return [art, e.im_menue ? 'im Menü' : '', text].filter(Boolean).join(' · ');
    },
    neu: async () => {
      const art = await kartenWaehlen('Welche Art Abschnitt?', ARTEN);
      return art ? neuerAbschnitt(art) : null;
    },
  }, wert, umfeld);
}

/* ------------------------------------------------------------------ */
/* Verteiler                                                           */
/* ------------------------------------------------------------------ */

export function feldBauen(feld: Feld, wert: Wert, umfeld: Umfeld, umgebung: Eintrag, neu = false, titel?: () => string): Baustein {
  switch (feld.typ) {
    case 'text':
    case 'mehrzeilig':
    case 'datum':
    case 'zahl':
    case 'liste': return textFeld(feld, wert);
    case 'schalter': return schalterFeld(feld, wert);
    case 'auswahl': return auswahlFeld(feld, wert, umgebung);
    case 'segment': return segmentFeld(feld, wert);
    case 'kennung': return kennungFeld(feld, wert, neu, titel);
    case 'richtext': {
      const editor = texteditor(String(wert ?? ''), { ...feld, zielDaten: umfeld.zielDaten });
      const id = editor.inhalt.id;
      return { el: huelle(feld, editor.el, id), lesen: editor.lesen };
    }
    case 'bild': return bildFeld(feld, wert, umgebung);
    case 'datei': return dateiFeld(feld, wert);
    case 'ziel': return zielFeld(feld, wert, umfeld);
    case 'symbol': return symbolFeld(feld, wert, umfeld);
    case 'gruppe': return gruppeFeld(feld, wert, umfeld);
    case 'eintraege': return eintraegeFeld(feld, wert, umfeld);
    case 'menue': return menueFeld(feld, wert, umfeld);
    case 'abschnitte': return abschnitteFeld(feld, wert, umfeld);
    case 'info': return { el: el('p', { class: 'feld__info', text: feld.text }), lesen: () => wert };
  }
}
