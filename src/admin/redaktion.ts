/**
 * Die Redaktion im Browser (Oktober 2026).
 *
 *   links    der Seitenplan (plan.ts) — die Startseite als Folge von
 *            Blöcken, verschiebbar; ein Klick öffnet einen Block
 *   rechts   das Formular des geöffneten Blocks (formulare.ts, felder.ts)
 *   unten    „Veröffentlichen" — alle Änderungen in einem Schritt
 *
 * Alle Inhalte kommen einmal beim Öffnen (/api/alles) und liegen dann
 * hier im Speicher. Wer zwischen den Blöcken wechselt, verliert nichts;
 * erst „Veröffentlichen" schickt alles Geänderte gemeinsam ab
 * (/api/save) — ein Commit, ein Neubau der Seite.
 *
 * Adressen der Ansichten stehen hinter dem # (#/block/dentosophie), damit
 * die Zurück-Taste des Browsers zwischen ihnen springt und ein Neuladen
 * dieselbe Ansicht wieder öffnet.
 */
import { dateien as DATEIEN, pruefen, zusatzregeln, zusammenhangPruefen, VERGEBEN, type Datei, type Seitenaufbau, type Bereich } from '../content/schema';
import { menueBauen, type Daten } from '../lib/aufbau';
import { el, anfrage, angemeldet, alsJson, abweisungErklaeren, kennungAus, ansagen } from './werkzeug';
import { formularBauen, feldBauen, type Umfeld, type Eintrag } from './felder';
import { ALLGEMEIN, HINWEIS, SPRECHSTUNDEN, BEREICHSARTEN, ansichtFuerBlock, neuerBereich, type Ansicht, type Inhalte, type Pfad, type Teil } from './formulare';
import { planZeichnen, planMarkieren } from './plan';
import { kartenWaehlen, formularDialog, bestaetigen } from './dialoge';
import { BLOCKNAMEN, type ZielDaten } from './ziele';
import { SKIZZEN } from './skizzen';

/* ------------------------------------------------------------------ */
/* Speicher                                                            */
/* ------------------------------------------------------------------ */

const zustand = {
  /** Der Commit, aus dem gelesen wurde — schickt „Veröffentlichen" mit */
  stand: '',
  dateien: {} as Record<Datei, any>,
  /** So, wie sie geladen bzw. zuletzt veröffentlicht wurden (als JSON) */
  original: {} as Record<Datei, string>,
  /** Dateien, in denen seit dem letzten Veröffentlichen etwas getan wurde */
  beruehrt: new Set<Datei>(),
};

const inhalte = () => zustand.dateien as unknown as Inhalte & Daten;

function holen(datei: Datei, pfad: Pfad): any {
  let wert: any = zustand.dateien[datei];
  for (const schritt of pfad) wert = wert?.[schritt];
  return wert;
}

function setzen(datei: Datei, pfad: Pfad, neu: unknown): void {
  if (!pfad.length) { zustand.dateien[datei] = neu; return; }
  let ziel: any = zustand.dateien[datei];
  for (const schritt of pfad.slice(0, -1)) ziel = ziel[schritt];
  ziel[pfad.at(-1)!] = neu;
}

/** Was wirklich anders ist als zuletzt veröffentlicht */
const geaenderteDateien = () => [...zustand.beruehrt].filter((d) => JSON.stringify(zustand.dateien[d]) !== zustand.original[d]);

const symbole: { pfad: string; name: string }[] = JSON.parse(document.querySelector('[data-symbole]')?.textContent || '[]');

const umfeld: Umfeld = {
  zielDaten: () => zustand.dateien as unknown as ZielDaten,
  symbole,
};

/* ------------------------------------------------------------------ */
/* Elemente                                                            */
/* ------------------------------------------------------------------ */

const planFlaeche = document.querySelector<HTMLElement>('[data-plan]')!;
const menueFlaeche = document.querySelector<HTMLElement>('[data-menuevorschau]')!;
const editor = document.querySelector<HTMLElement>('[data-editor]')!;
const leiste = document.querySelector<HTMLElement>('[data-veroeffentlichen]')!;
const knopf = leiste.querySelector<HTMLButtonElement>('[data-knopf]')!;
const verwerfen = leiste.querySelector<HTMLButtonElement>('[data-verwerfen]')!;
const meldung = leiste.querySelector<HTMLElement>('[data-meldung]')!;

function sagen(art: 'fehler' | 'erfolg' | 'arbeit' | '', text: string, liste: string[] = []) {
  meldung.dataset.art = art;
  meldung.textContent = text;
  if (liste.length) meldung.append(el('ul', {}, liste.slice(0, 8).map((f) => el('li', { text: f }))));
}

function leisteZeigen() {
  const offen = geaenderteDateien().length > 0;
  leiste.dataset.offen = String(offen);
  knopf.disabled = !offen;
  verwerfen.hidden = !offen;
  if (offen && meldung.dataset.art !== 'fehler' && meldung.dataset.art !== 'arbeit') sagen('', 'Ungespeicherte Änderungen — noch nicht online.');
  if (!offen && !meldung.dataset.art) sagen('', 'Alles veröffentlicht.');
}

/* ------------------------------------------------------------------ */
/* Seitenplan und Menüvorschau                                         */
/* ------------------------------------------------------------------ */

function planAktualisieren() {
  const d = zustand.dateien;
  planZeichnen(planFlaeche, {
    bloecke: d.seitenaufbau.bloecke,
    bereiche: d.bereiche.eintraege,
    sprechstunden: d.seitenaufbau.sprechstunden.menue,
    hinweis: d.hinweis,
  }, {
    umsortiert: (ids) => {
      uebernehmen();
      const alt = new Map((d.seitenaufbau.bloecke as { id: string }[]).map((b) => [b.id, b]));
      d.seitenaufbau.bloecke = ids.map((id) => alt.get(id));
      zustand.beruehrt.add('seitenaufbau');
      menueVorschau();
      leisteZeigen();
    },
    neuerBereich: neuerBereichAnlegen,
  });
  planMarkieren(planFlaeche, routeLesen());
  menueVorschau();
}

/** So sieht das Menü gerade aus — aus denselben Regeln wie die Seite */
function menueVorschau() {
  const daten: Record<string, unknown> = {};
  for (const name of ['seitenaufbau', 'bereiche', 'leistungen', 'galerie', 'team', 'stellen'] as const) {
    const r = pruefen(name, zustand.dateien[name]);
    if (!r.ok) { menueFlaeche.replaceChildren(el('p', { class: 'feld__hilfe', text: 'Die Vorschau erscheint, sobald alle Pflichtfelder ausgefüllt sind.' })); return; }
    daten[name] = r.daten;
  }
  const punkte = menueBauen(daten as unknown as Daten);
  menueFlaeche.replaceChildren(
    el('span', { class: 'menuevorschau__titel', text: 'So sieht das Menü aus' }),
    el('ol', { class: 'menuevorschau__liste' }, punkte.map((p) => el('li', { class: 'menuevorschau__punkt', title: p.unterpunkte.map((u) => u.titel).join(' · ') }, [
      p.symbol ? el('img', { src: p.symbol, alt: '' }) : el('span', { class: 'menuevorschau__ohne' }),
      el('span', { text: p.titel }),
      p.unterpunkte.length ? el('span', { class: 'menuevorschau__zahl', text: `▾ ${p.unterpunkte.length}`, 'aria-label': `${p.unterpunkte.length} Unterpunkte` }) : null,
    ]))),
  );
}

/* ------------------------------------------------------------------ */
/* Ansichten                                                           */
/* ------------------------------------------------------------------ */

const routeLesen = () => location.hash.replace(/^#\/?/, '') || '';

function ansichtFuer(route: string): Ansicht | null {
  if (route === 'hinweis') return HINWEIS;
  if (route === 'sprechstunden') return SPRECHSTUNDEN;
  if (route === 'allgemein') return ALLGEMEIN;
  const m = /^block\/([a-z0-9-]+)$/.exec(route);
  if (m) {
    const block = (zustand.dateien.seitenaufbau.bloecke as { id: string; art: string }[]).find((b) => b.id === m[1]);
    return block ? ansichtFuerBlock(block, inhalte) : null;
  }
  return null;
}

/** Die offenen Formulare — „übernehmen" schreibt sie in den Speicher */
let offen: { teil: Teil; lesen: () => Eintrag }[] = [];
let eingegeben = false;

function uebernehmen() {
  if (!eingegeben) return;
  eingegeben = false;
  for (const { teil, lesen } of offen) {
    const pfad = teil.pfad();
    if (!pfad) continue;
    const vorher = JSON.stringify(holen(teil.datei, pfad));
    const neu = lesen();
    if (JSON.stringify(neu) === vorher) continue;
    setzen(teil.datei, pfad, neu);
    zustand.beruehrt.add(teil.datei);
  }
}

let warten = 0;
editor.addEventListener('input', () => {
  eingegeben = true;
  window.clearTimeout(warten);
  warten = window.setTimeout(() => { uebernehmen(); leisteZeigen(); planAktualisieren(); kopfAktualisieren(); }, 350);
});
editor.addEventListener('change', () => editor.dispatchEvent(new Event('input')));

let kopfAktualisieren = () => {};

function startseite() {
  const zuletzt = el('p', { class: 'feld__hilfe' });
  fetch('/stand.json', { cache: 'no-store' }).then((r) => r.json()).then((s: { zeit?: string }) => {
    if (s.zeit) zuletzt.textContent = `Zuletzt online gegangen: ${new Date(s.zeit).toLocaleString('de-DE', { dateStyle: 'long', timeStyle: 'short' })}`;
  }).catch(() => {});
  editor.replaceChildren(
    el('div', { class: 'ansicht__kopf' }, [el('div', {}, [el('span', { class: 'kicker', text: 'Redaktion' }), el('h1', { text: 'Was möchten Sie ändern?' })])]),
    el('ol', { class: 'schritte' }, [
      el('li', { text: 'Links einen Block der Seite anklicken — rechts erscheint, was sich darin ändern lässt.' }),
      el('li', { text: 'Etwas Neues? „+ Neuer Bereich" legt eine Seite, Beiträge oder einen Abschnitt an.' }),
      el('li', { text: 'Fertig? Unten auf „Veröffentlichen". Nach etwa einer Minute ist alles online.' }),
    ]),
    el('p', { class: 'feld__hilfe', text: 'Jeder veröffentlichte Stand wird gesichert und lässt sich wiederherstellen.' }),
    zuletzt,
  );
}

function oeffnen() {
  uebernehmen();
  const route = routeLesen();
  planMarkieren(planFlaeche, route);
  offen = [];
  if (!route) { startseite(); kopfAktualisieren = () => {}; return; }
  if (route === 'start') {
    editor.replaceChildren(
      el('div', { class: 'ansicht__kopf' }, [el('span', { class: 'ansicht__skizze' }), el('div', {}, [el('span', { class: 'kicker', text: 'Steht fest' }), el('h1', { text: 'Startbereich' })])]),
      el('p', { text: 'Das Logo zeichnet sich beim Öffnen der Seite ein; darüber fährt beim Scrollen die Sprechstunden-Karte herein. Hier gibt es nichts einzustellen — Adresse und Telefon in der Kopfzeile stehen unter „Fußbereich".' }),
    );
    editor.querySelector('.ansicht__skizze')!.innerHTML = SKIZZEN.start;
    return;
  }
  const ansicht = ansichtFuer(route);
  if (!ansicht) {
    editor.replaceChildren(el('p', { text: 'Diesen Teil gibt es nicht (mehr).' }), el('a', { href: '#/', text: 'Zur Übersicht' }));
    return;
  }

  const titel = el('h1', { text: ansicht.titel });
  const kopf = el('div', { class: 'ansicht__kopf' }, [
    el('span', { class: 'ansicht__skizze' }),
    el('div', {}, [el('span', { class: 'kicker', text: ansicht.art }), titel]),
    ansicht.adresse ? el('a', { class: 'knopf knopf--leise ansicht__ansehen', href: ansicht.adresse, target: '_blank', rel: 'noopener', 'data-astro-prefetch': 'false', text: 'Online ansehen ↗' }) : null,
  ]);
  kopf.querySelector('.ansicht__skizze')!.innerHTML = ansicht.skizze;
  kopfAktualisieren = () => { const neu = ansichtFuer(route); if (neu) titel.textContent = neu.titel; };

  const teile: HTMLElement[] = [];
  for (const teil of ansicht.teile) {
    const pfad = teil.pfad();
    if (!pfad) continue;
    const formular = formularBauen(teil.felder, (holen(teil.datei, pfad) ?? {}) as Eintrag, umfeld);
    offen.push({ teil, lesen: formular.lesen });
    teile.push(el('section', { class: 'teil' }, [
      teil.titel ? el('h2', { class: 'teil__titel', text: teil.titel }) : null,
      teil.hilfe ? el('p', { class: 'teil__hilfe', text: teil.hilfe }) : null,
      formular.el,
    ]));
  }

  const fuss = ansicht.loeschbar ? el('div', { class: 'ansicht__fuss' }, [
    el('button', { class: 'knopf knopf--leise knopf--gefahr', type: 'button', text: `„${ansicht.titel}" löschen …` }),
  ]) : null;
  fuss?.querySelector('button')!.addEventListener('click', () => loeschen(route.slice('block/'.length), ansicht.titel));

  editor.replaceChildren(kopf, ...teile, fuss ?? '');
  editor.scrollTop = 0;
  window.scrollTo({ top: 0 });
  editor.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
}

window.addEventListener('hashchange', oeffnen);

/* ------------------------------------------------------------------ */
/* Neu anlegen, löschen                                                */
/* ------------------------------------------------------------------ */

async function neuerBereichAnlegen() {
  uebernehmen();
  const typ = await kartenWaehlen('Was möchten Sie anlegen?', Object.entries(BEREICHSARTEN).map(([wert, a]) => ({ wert, ...a })));
  if (!typ) return;
  const art = BEREICHSARTEN[typ];
  const d = zustand.dateien;
  const bloecke = d.seitenaufbau.bloecke as { id: string; art: string }[];
  const name = (b: { id: string; art: string }) => b.art === 'bereich'
    ? (d.bereiche.eintraege as { id: string; titel: string }[]).find((e) => e.id === b.id)?.titel ?? b.id
    : b.art === 'verweis' ? 'Menüpunkt' : BLOCKNAMEN[b.art] ?? b.art;

  const titel = el('input', { class: 'feld__eingabe', type: 'text', id: 'neu-titel', placeholder: typ === 'blog' ? 'z. B. „Ratgeber"' : 'z. B. „Dentosophie"' });
  const adresse = el('p', { class: 'feld__hilfe' });
  const vergeben = new Set([...VERGEBEN, ...(d.bereiche.eintraege as { id: string }[]).map((b) => b.id)]);
  const kennung = () => {
    let k = kennungAus(titel.value) || 'bereich';
    for (let n = 2; vergeben.has(k); n++) k = `${kennungAus(titel.value) || 'bereich'}-${n}`;
    return k;
  };
  const zeigen = () => {
    adresse.textContent = typ === 'seite' ? `Adresse: dres-nold.de/${kennung()}/` : typ === 'blog' ? `Beiträge unter dres-nold.de/${kennung()}/…` : '';
  };
  titel.addEventListener('input', zeigen);
  zeigen();

  const stelleWahl = el('select', { class: 'feld__auswahl', id: 'neu-stelle' });
  stelleWahl.append(el('option', { value: '0', text: 'Ganz oben — direkt nach den Sprechstunden' }));
  bloecke.forEach((b, i) => stelleWahl.append(el('option', { value: String(i + 1), text: `nach „${name(b)}"` })));
  const vorKontakt = bloecke.findIndex((b) => b.art === 'kontakt');
  stelleWahl.value = String(vorKontakt < 0 ? bloecke.length : vorKontakt);

  const imMenue = el('input', { type: 'checkbox', class: 'schalter', id: 'neu-menue', checked: typ === 'seite' });
  const symbol = feldBauen({ typ: 'symbol', name: 'symbol', label: 'Symbol im Menü' }, '', umfeld, {});
  const symbolHuelle = el('div', {}, [symbol.el]);
  const menueZeigen = () => { symbolHuelle.hidden = !imMenue.checked; };
  imMenue.addEventListener('change', menueZeigen);
  menueZeigen();

  const formular = el('div', {}, [
    el('div', { class: 'feld' }, [el('label', { class: 'feld__label', text: typ === 'blog' ? 'Name der Beitragsreihe' : 'Überschrift', htmlFor: 'neu-titel' }), titel, adresse]),
    el('div', { class: 'feld' }, [el('label', { class: 'feld__label', text: typ === 'seite' ? 'Wo steht die Ankündigungskarte auf der Startseite?' : 'Wo auf der Startseite?', htmlFor: 'neu-stelle' }), stelleWahl,
      el('p', { class: 'feld__hilfe', text: 'Lässt sich später im Seitenplan verschieben.' })]),
    el('div', { class: 'feld feld--schalter' }, [imMenue, el('label', { class: 'feld__label', text: 'Als eigenen Punkt ins Menü', htmlFor: 'neu-menue' })]),
    symbolHuelle,
  ]);
  const ok = await formularDialog(`Neu: ${art.titel}`, formular, 'Anlegen', () => {
    if (!titel.value.trim()) return 'Bitte eine Überschrift eingeben.';
    const punkte = 1 + (d.seitenaufbau.bloecke as { aktiv: boolean; menue: unknown }[]).filter((b) => b.aktiv && b.menue).length;
    if (imMenue.checked && punkte >= 7) return 'Das Menü ist voll (7 Punkte). Nehmen Sie den Haken weg und verlinken Sie den Bereich als Unterpunkt eines anderen Menüpunkts.';
    return null;
  });
  if (!ok) return;

  const id = kennung();
  d.bereiche.eintraege.push(neuerBereich(typ, id, titel.value.trim()));
  const block = {
    id, art: 'bereich', aktiv: true, ziel: '',
    menue: imMenue.checked ? { titel: titel.value.trim().slice(0, 18), symbol: String(symbol.lesen() || ''), unterpunkte: [] } : null,
  };
  d.seitenaufbau.bloecke.splice(Number(stelleWahl.value), 0, block);
  zustand.beruehrt.add('bereiche');
  zustand.beruehrt.add('seitenaufbau');
  planAktualisieren();
  leisteZeigen();
  location.hash = `#/block/${id}`;
  ansagen(`${art.titel} „${titel.value.trim()}" angelegt.`);
}

async function loeschen(id: string, titel: string) {
  uebernehmen();
  const d = zustand.dateien;
  const ziel = (d.bereiche.eintraege as Bereich[]).find((b) => b.id === id);
  const adresse = ziel?.typ === 'seite' ? `/${id}/` : `/#${id}`;
  /* Wer zeigt noch hierher? Dann warnen, damit kein Verweis ins Leere läuft */
  const alles = JSON.stringify(Object.fromEntries(Object.entries(d).filter(([k]) => k !== 'bereiche'))) +
    JSON.stringify((d.bereiche.eintraege as Bereich[]).filter((b) => b.id !== id));
  const verwendet = ziel && alles.includes(`"${adresse}`) ? ' Achtung: Andere Stellen verweisen noch auf diesen Bereich — diese Verweise führen danach ins Leere.' : '';
  const ok = await bestaetigen(`„${titel}" löschen?`,
    `Der Bereich verschwindet von der Seite und aus dem Menü, sobald Sie veröffentlichen.${verwendet} Wollen Sie ihn nur vorübergehend verbergen, schalten Sie ihn lieber aus.`,
    'Endgültig löschen');
  if (!ok) return;
  d.bereiche.eintraege = (d.bereiche.eintraege as Bereich[]).filter((b) => b.id !== id);
  d.seitenaufbau.bloecke = (d.seitenaufbau.bloecke as { id: string }[]).filter((b) => b.id !== id);
  zustand.beruehrt.add('bereiche');
  zustand.beruehrt.add('seitenaufbau');
  offen = [];
  location.hash = '#/';
  planAktualisieren();
  leisteZeigen();
}

/* ------------------------------------------------------------------ */
/* Veröffentlichen                                                     */
/* ------------------------------------------------------------------ */

const DATEINAMEN: Record<string, string> = {
  hinweis: 'Hinweis', oeffnungszeiten: 'Sprechstunden', leistungen: 'Leistungen', team: 'Team', galerie: 'Bilderband',
  stellen: 'Stellenangebote', startseite: 'Texte der Startseite', seite: 'Praxisangaben', seitenaufbau: 'Seitenplan und Menü', bereiche: 'Eigene Bereiche',
};

const FELDNAMEN: Record<string, string> = {
  titel: 'Überschrift', bild_alt: 'Bildbeschreibung', titelbild_alt: 'Bildbeschreibung', foto_alt: 'Bildbeschreibung', alt: 'Bildbeschreibung',
  ziel: 'Ziel', text: 'Text', datum: 'Datum', kacheln: 'Kacheln', knoepfe: 'Knöpfe', id: 'Kennung', email: 'E-Mail',
};

/** „bereiche → eintraege.3.abschnitte.2.bild_alt: …" in Worten */
function fehlerLesbar(datei: Datei, roh: string): string {
  const [pfadText, ...rest] = roh.split(': ');
  const nachricht = rest.join(': ') || roh;
  const teile = pfadText.split('.');
  const orte: string[] = [DATEINAMEN[datei] ?? datei];
  let wert: any = zustand.dateien[datei];
  for (let i = 0; i < teile.length; i++) {
    const t = teile[i];
    const zahl = /^\d+$/.test(t) ? Number(t) : null;
    const naechster = zahl === null ? wert?.[t] : wert?.[zahl];
    if (zahl !== null) {
      const name = naechster?.titel || naechster?.name || naechster?.text || naechster?.tag;
      orte.push(name ? `„${String(name).replace(/<[^>]+>/g, '').slice(0, 40)}"` : `Nr. ${zahl + 1}`);
    } else if (i === teile.length - 1 && FELDNAMEN[t]) {
      orte.push(FELDNAMEN[t]);
    }
    wert = naechster;
  }
  return `${orte.join(' › ')}: ${nachricht}`;
}

function vorabPruefen(liste: Datei[]): string[] {
  const fehler: string[] = [];
  const geprueft: Record<string, unknown> = {};
  for (const d of liste) {
    const r = pruefen(d, zustand.dateien[d]);
    if (!r.ok) { fehler.push(...r.fehler.map((f) => fehlerLesbar(d, f))); continue; }
    geprueft[d] = r.daten;
    fehler.push(...zusatzregeln(d, r.daten).map((f) => `${DATEINAMEN[d]}: ${f}`));
  }
  if (!fehler.length && (liste.includes('seitenaufbau') || liste.includes('bereiche'))) {
    const a = pruefen('seitenaufbau', zustand.dateien.seitenaufbau);
    const b = pruefen('bereiche', zustand.dateien.bereiche);
    if (a.ok && b.ok) fehler.push(...zusammenhangPruefen(a.daten as Seitenaufbau, b.daten as { eintraege: Bereich[] }));
  }
  return fehler;
}

/** Nach dem Speichern: Wann ist es online? (scripts/stand-schreiben.mjs) */
function standBeobachten(seit: number) {
  const bis = seit + 5 * 60_000;
  const fragen = async () => {
    try {
      const s = (await (await fetch('/stand.json', { cache: 'no-store' })).json()) as { zeit?: string };
      if (s.zeit && new Date(s.zeit).getTime() > seit) {
        sagen('erfolg', 'Online ✓ — die Änderungen sind auf der Seite.');
        meldung.append(' ', el('a', { href: '/', target: '_blank', rel: 'noopener', 'data-astro-prefetch': 'false', text: 'Seite ansehen ↗' }));
        return;
      }
    } catch { /* noch einmal versuchen */ }
    if (Date.now() < bis) window.setTimeout(fragen, 6000);
    else sagen('', 'Gespeichert. Der Neubau dauert länger als üblich — in ein paar Minuten noch einmal nachsehen.');
  };
  window.setTimeout(fragen, 20_000);
}

knopf.addEventListener('click', async () => {
  window.clearTimeout(warten);
  eingegeben = true;
  uebernehmen();
  const liste = geaenderteDateien();
  if (!liste.length) { leisteZeigen(); return; }

  const fehler = vorabPruefen(liste);
  if (fehler.length) { sagen('fehler', 'Noch nicht veröffentlicht. Bitte zuerst ergänzen:', fehler); return; }

  knopf.disabled = true;
  sagen('arbeit', 'Wird veröffentlicht …');
  try {
    const antwort = await anfrage('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ basis: zustand.stand, aenderungen: liste.map((datei) => ({ datei, daten: zustand.dateien[datei] })) }),
    });
    /* Nichts ist verloren: Alles steht unverändert da. Nach dem Anmelden
       im zweiten Tab genügt ein erneuter Druck auf den Knopf. */
    if (!angemeldet(antwort)) { sagen('fehler', abweisungErklaeren(antwort)); return; }
    const ergebnis = await alsJson<{ ok: boolean; commit?: string; fehler?: string[] }>(antwort);
    if (!ergebnis.ok) { sagen('fehler', 'Nicht veröffentlicht:', ergebnis.fehler ?? ['Unbekannter Fehler']); return; }
    for (const d of liste) { zustand.original[d] = JSON.stringify(zustand.dateien[d]); zustand.beruehrt.delete(d); }
    if (ergebnis.commit) zustand.stand = ergebnis.commit;
    sagen('arbeit', 'Gespeichert. Die Seite wird jetzt neu gebaut — in etwa einer Minute ist alles online.');
    standBeobachten(Date.now());
  } catch (e) {
    sagen('fehler', e instanceof Error && e.message ? `${e.message} Ihre Eingaben stehen noch hier — bitte noch einmal versuchen.` : 'Keine Verbindung — bitte später noch einmal versuchen.');
  } finally {
    leisteZeigen();
  }
});

verwerfen.addEventListener('click', async () => {
  if (!(await bestaetigen('Änderungen verwerfen?', 'Alles, was seit dem letzten Veröffentlichen geändert wurde, wird zurückgesetzt.', 'Verwerfen'))) return;
  for (const d of DATEIEN) zustand.dateien[d] = JSON.parse(zustand.original[d]);
  zustand.beruehrt.clear();
  eingegeben = false;
  sagen('', 'Verworfen.');
  planAktualisieren();
  oeffnen();
  leisteZeigen();
});

window.addEventListener('beforeunload', (e) => {
  uebernehmen();
  if (geaenderteDateien().length) e.preventDefault();
});

/* ------------------------------------------------------------------ */
/* Start                                                               */
/* ------------------------------------------------------------------ */

async function start() {
  const laden = document.querySelector<HTMLElement>('[data-laden]')!;
  try {
    const antwort = await anfrage('/api/alles', { headers: { Accept: 'application/json' } });
    if (!angemeldet(antwort)) { laden.textContent = abweisungErklaeren(antwort); return; }
    const ergebnis = await alsJson<{ stand?: string; dateien?: Record<Datei, unknown>; fehler?: string }>(antwort);
    if (!ergebnis.dateien || !ergebnis.stand) throw new Error(ergebnis.fehler || 'Laden fehlgeschlagen');
    zustand.stand = ergebnis.stand;
    for (const d of DATEIEN) {
      zustand.dateien[d] = ergebnis.dateien[d];
      zustand.original[d] = JSON.stringify(ergebnis.dateien[d]);
    }
  } catch (e) {
    laden.textContent = `Der aktuelle Stand konnte nicht geladen werden: ${e instanceof Error ? e.message : ''}`;
    return;
  }
  laden.hidden = true;
  document.querySelector<HTMLElement>('[data-arbeitsplatz]')!.hidden = false;
  planAktualisieren();
  oeffnen();
  leisteZeigen();
}

start();

