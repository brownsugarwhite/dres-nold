/**
 * Die Redaktionsoberfläche im Browser.
 *
 * Baut aus der Feldbeschreibung (src/admin/bereiche.ts, als JSON in der
 * Seite) und dem aktuellen Stand aus dem Repo (/api/inhalt) ein Formular,
 * liest es beim Speichern wieder aus und schickt es an /api/save.
 *
 * Bewusst ohne Framework: ein paar Bausteine, die je ein Feld zeichnen
 * und einen Wert zurückgeben. Wer ein neues Feld braucht, ergänzt hier
 * einen Fall in `feldBauen`.
 */
import type { Feld } from './bereiche';

type Wert = unknown;
type Baustein = { el: HTMLElement; lesen: () => Wert };
type Eintrag = Record<string, Wert>;

/* ------------------------------------------------------------------ */
/* Helfer                                                              */
/* ------------------------------------------------------------------ */

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  eigenschaften: Partial<HTMLElementTagNameMap[K]> & { class?: string; text?: string } = {},
  kinder: (Node | string | null | undefined)[] = [],
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  const { class: klasse, text, ...rest } = eigenschaften;
  if (klasse) e.className = klasse;
  if (text) e.textContent = text;
  Object.assign(e, rest);
  for (const k of kinder) if (k != null) e.append(k);
  return e;
}

let zaehler = 0;
const neueId = () => `f${++zaehler}`;

/** „Zahnärztliche Prophylaxe" → „zahnaerztliche-prophylaxe" */
export function kennungAus(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** Nur die erlaubten Auszeichnungen bleiben im Richtext übrig */
const ERLAUBT: Record<string, string[]> = {
  p: [], br: [], strong: [], em: [], b: [], i: [], u: [],
  ul: [], ol: [], li: [], h3: [], h4: [],
  a: ['href'], table: [], thead: [], tbody: [], tr: [], th: [], td: [],
};

export function htmlBereinigen(html: string): string {
  const rahmen = document.createElement('div');
  rahmen.innerHTML = html;

  const durchlaufen = (knoten: Element) => {
    for (const kind of [...knoten.children]) {
      const tag = kind.tagName.toLowerCase();
      if (tag === 'div') {
        /* Browser erzeugen <div> für neue Zeilen — daraus Absätze machen */
        const p = document.createElement('p');
        p.innerHTML = kind.innerHTML;
        kind.replaceWith(p);
        durchlaufen(p);
        continue;
      }
      if (!(tag in ERLAUBT)) {
        /* Unbekanntes Element: Inhalt behalten, Hülle weg */
        const ersatz = document.createDocumentFragment();
        while (kind.firstChild) ersatz.append(kind.firstChild);
        kind.replaceWith(ersatz);
        continue;
      }
      for (const attr of [...kind.attributes]) {
        if (!ERLAUBT[tag].includes(attr.name)) kind.removeAttribute(attr.name);
        else if (attr.name === 'href' && /^\s*javascript:/i.test(attr.value)) kind.removeAttribute('href');
      }
      if (tag === 'b') { const s = document.createElement('strong'); s.innerHTML = kind.innerHTML; kind.replaceWith(s); durchlaufen(s); continue; }
      if (tag === 'i') { const s = document.createElement('em'); s.innerHTML = kind.innerHTML; kind.replaceWith(s); durchlaufen(s); continue; }
      durchlaufen(kind);
    }
  };
  durchlaufen(rahmen);

  /* Leere Absätze am Ende weg */
  return rahmen.innerHTML.replace(/(<p>(<br>|\s|&nbsp;)*<\/p>\s*)+$/g, '').trim();
}

/* ------------------------------------------------------------------ */
/* Felder                                                              */
/* ------------------------------------------------------------------ */

function huelle(feld: Feld, eingabe: HTMLElement, id?: string): HTMLElement {
  const label = el('label', { class: 'feld__label', text: feld.label });
  if (id) label.htmlFor = id;
  return el('div', { class: 'feld' }, [
    label,
    eingabe,
    feld.hilfe ? el('p', { class: 'feld__hilfe', text: feld.hilfe }) : null,
  ]);
}

function textFeld(feld: Feld, wert: Wert, typ = 'text'): Baustein {
  const id = neueId();
  const eingabe = el('input', { class: 'feld__eingabe', id, type: typ, value: wert == null ? '' : String(wert) });
  if (feld.gesperrt) eingabe.readOnly = true;
  return {
    el: huelle(feld, eingabe, id),
    lesen: () => (typ === 'number' ? Number(eingabe.value) || 0 : eingabe.value.trim()),
  };
}

function mehrzeiligFeld(feld: Feld, wert: Wert): Baustein {
  const id = neueId();
  const eingabe = el('textarea', { class: 'feld__mehrzeilig', id, value: wert == null ? '' : String(wert) });
  return { el: huelle(feld, eingabe, id), lesen: () => eingabe.value.trim() };
}

function listeFeld(feld: Feld, wert: Wert): Baustein {
  const id = neueId();
  const eingabe = el('textarea', { class: 'feld__mehrzeilig', id, value: Array.isArray(wert) ? wert.join('\n') : '' });
  return {
    el: huelle({ ...feld, hilfe: feld.hilfe ? `${feld.hilfe} (je Zeile ein Eintrag)` : 'Je Zeile ein Eintrag.' }, eingabe, id),
    lesen: () => eingabe.value.split('\n').map((z) => z.trim()).filter(Boolean),
  };
}

function schalterFeld(feld: Feld, wert: Wert): Baustein {
  const id = neueId();
  const eingabe = el('input', { id, type: 'checkbox', checked: wert === true });
  const label = el('label', { class: 'feld__label', text: feld.label });
  label.htmlFor = id;
  return {
    el: el('div', { class: 'feld feld--schalter' }, [eingabe, label, feld.hilfe ? el('span', { class: 'feld__hilfe', text: feld.hilfe }) : null]),
    lesen: () => eingabe.checked,
  };
}

function auswahlFeld(feld: Feld, wert: Wert, daten: Eintrag): Baustein {
  const id = neueId();
  const auswahl = el('select', { class: 'feld__auswahl', id });
  let optionen = feld.optionen ?? [];
  if (feld.quelle) {
    const liste = daten[feld.quelle];
    if (Array.isArray(liste)) {
      optionen = liste.map((e) => ({ wert: String((e as Eintrag).id), label: String((e as Eintrag).titel ?? (e as Eintrag).id) }));
    }
  }
  for (const o of optionen) auswahl.append(el('option', { value: o.wert, text: o.label, selected: o.wert === wert }));
  return { el: huelle(feld, auswahl, id), lesen: () => auswahl.value };
}

function kennungFeld(feld: Feld, wert: Wert, neu: boolean, titelEingabe?: () => string): Baustein {
  const id = neueId();
  const eingabe = el('input', { class: 'feld__eingabe', id, type: 'text', value: wert == null ? '' : String(wert) });
  const hilfe = neu
    ? 'Wird Teil der Adresse. Nur Kleinbuchstaben, Ziffern und Bindestriche; nach dem Speichern nicht mehr änderbar.'
    : 'Teil der Adresse — kann nicht mehr geändert werden.';
  if (!neu) eingabe.readOnly = true;
  return {
    el: huelle({ ...feld, hilfe }, eingabe, id),
    lesen: () => {
      let k = kennungAus(eingabe.value);
      if (!k && neu && titelEingabe) k = kennungAus(titelEingabe());
      eingabe.value = k;
      return k;
    },
  };
}

function dateiFeld(feld: Feld, wert: Wert): Baustein {
  const id = neueId();
  const eingabe = el('input', { class: 'feld__eingabe', id, type: 'text', value: wert == null ? '' : String(wert), placeholder: feld.typ === 'bild' ? '/bilder/…' : '/dokumente/…' });
  const vorschau = feld.typ === 'bild' ? el('img', { class: 'datei__vorschau', alt: '' }) : null;
  const zeigen = () => { if (vorschau) { vorschau.src = eingabe.value || ''; vorschau.hidden = !eingabe.value; } };
  zeigen();
  eingabe.addEventListener('change', zeigen);

  const datei = el('input', { type: 'file', accept: feld.typ === 'bild' ? 'image/jpeg,image/png,image/webp' : 'application/pdf' });
  const knopf = el('span', { class: 'knopf knopf--leise datei__hochladen', text: 'Hochladen …' }, [datei]);
  const status = el('span', { class: 'feld__hilfe' });

  datei.addEventListener('change', async () => {
    const f = datei.files?.[0];
    if (!f) return;
    status.textContent = 'Wird hochgeladen …';
    const form = new FormData();
    form.append('datei', f);
    form.append('ordner', feld.ordner ?? 'allgemein');
    try {
      const antwort = await fetch('/api/hochladen', { method: 'POST', body: form });
      const ergebnis = (await antwort.json()) as { ok: boolean; pfad?: string; fehler?: string };
      if (ergebnis.ok && ergebnis.pfad) {
        eingabe.value = ergebnis.pfad;
        zeigen();
        status.textContent = 'Hochgeladen. Erscheint nach dem Speichern und Neubau der Seite.';
      } else {
        status.textContent = ergebnis.fehler || 'Hochladen fehlgeschlagen.';
      }
    } catch {
      status.textContent = 'Keine Verbindung.';
    }
    datei.value = '';
  });

  const zeile = el('div', { class: 'datei' }, [vorschau, eingabe, knopf, status]);
  return { el: huelle(feld, zeile, id), lesen: () => eingabe.value.trim() };
}

function richtextFeld(feld: Feld, wert: Wert): Baustein {
  const id = neueId();
  const inhalt = el('div', { class: 'richtext__inhalt', id });
  inhalt.contentEditable = 'true';
  inhalt.innerHTML = htmlBereinigen(wert == null ? '' : String(wert)) || '<p></p>';

  const befehl = (name: string, arg?: string) => () => {
    inhalt.focus();
    document.execCommand(name, false, arg);
  };
  const knopf = (text: string, titel: string, aktion: () => void) => {
    const b = el('button', { type: 'button', text, title: titel });
    b.addEventListener('mousedown', (e) => e.preventDefault());
    b.addEventListener('click', aktion);
    return b;
  };

  const leiste = el('div', { class: 'richtext__leiste' }, [
    knopf('Absatz', 'Normaler Absatz', befehl('formatBlock', 'p')),
    knopf('Zwischentitel', 'Zwischenüberschrift', befehl('formatBlock', 'h3')),
    knopf('Fett', 'Fett', befehl('bold')),
    knopf('Kursiv', 'Kursiv', befehl('italic')),
    knopf('• Liste', 'Aufzählung', befehl('insertUnorderedList')),
    knopf('1. Liste', 'Nummerierte Liste', befehl('insertOrderedList')),
    knopf('Verweis', 'Verweis einfügen', () => {
      const ziel = window.prompt('Adresse des Verweises (z. B. https://… oder /leistungen/prophylaxe/):');
      if (ziel) befehl('createLink', ziel)();
    }),
    knopf('Tabelle', 'Tabelle mit 2 Spalten einfügen', () => {
      const zeilen = Number(window.prompt('Wie viele Zeilen?', '3')) || 3;
      let html = '<table><thead><tr><th>Spalte 1</th><th>Spalte 2</th></tr></thead><tbody>';
      for (let i = 0; i < zeilen; i++) html += '<tr><td>…</td><td>…</td></tr>';
      html += '</tbody></table><p></p>';
      befehl('insertHTML', html)();
    }),
    knopf('Format löschen', 'Alle Auszeichnungen entfernen', befehl('removeFormat')),
  ]);

  return {
    el: huelle(feld, el('div', { class: 'richtext' }, [leiste, inhalt]), id),
    lesen: () => htmlBereinigen(inhalt.innerHTML),
  };
}

function gruppeFeld(feld: Feld, wert: Wert, daten: Eintrag): Baustein {
  const objekt = (wert && typeof wert === 'object' ? wert : {}) as Eintrag;
  const bausteine = (feld.felder ?? []).map((f) => [f.name, feldBauen(f, objekt[f.name], daten, objekt)] as const);
  return {
    el: el('section', { class: 'gruppe' }, [
      el('span', { class: 'feld__label', text: feld.label }),
      ...bausteine.map(([, b]) => b.el),
    ]),
    lesen: () => {
      const ergebnis: Eintrag = { ...objekt };
      for (const [name, b] of bausteine) ergebnis[name] = b.lesen();
      return ergebnis;
    },
  };
}

function eintraegeFeld(feld: Feld, wert: Wert, daten: Eintrag): Baustein {
  const liste = el('div');
  const karten: { el: HTMLElement; lesen: () => Eintrag; loeschen: () => void }[] = [];

  const kartenBauen = (eintrag: Eintrag, neu: boolean) => {
    const inhalt = el('div', { class: 'eintrag__inhalt' });
    const titelText = el('span', { class: 'eintrag__titel' });
    const marke = el('span', { class: 'eintrag__marke' });
    const kopf = el('button', { class: 'eintrag__kopf', type: 'button' }, [titelText, marke]);
    kopf.setAttribute('aria-expanded', neu ? 'true' : 'false');
    inhalt.hidden = !neu;
    kopf.addEventListener('click', () => {
      const offen = kopf.getAttribute('aria-expanded') === 'true';
      kopf.setAttribute('aria-expanded', String(!offen));
      inhalt.hidden = offen;
    });

    const bausteine: [string, Baustein][] = [];
    let titelBaustein: Baustein | null = null;

    if (feld.standard) {
      const kennung = kennungFeld({ name: 'id', label: 'Kennung', typ: 'kennung' }, eintrag.id, neu, () =>
        String(titelBaustein?.lesen() ?? ''));
      bausteine.push(['id', kennung]);
      bausteine.push(['aktiv', schalterFeld({ name: 'aktiv', label: 'Auf der Seite zeigen', typ: 'schalter' }, eintrag.aktiv ?? true)]);
    }
    for (const f of feld.felder ?? []) {
      const b = feldBauen(f, eintrag[f.name], daten, eintrag);
      if (f.name === feld.titelfeld) titelBaustein = b;
      bausteine.push([f.name, b]);
    }

    const karte = el('article', { class: 'eintrag' });
    const aktualisieren = () => {
      const t = titelBaustein ? String(titelBaustein.lesen() || '') : '';
      titelText.textContent = t || '(ohne Titel)';
      const aktiv = feld.standard ? bausteine.find(([n]) => n === 'aktiv')?.[1].lesen() : true;
      marke.textContent = aktiv ? '' : 'ausgeblendet';
      marke.hidden = !!aktiv;
      if (aktiv) delete karte.dataset.inaktiv; else karte.dataset.inaktiv = 'ja';
    };

    const hoch = el('button', { class: 'knopf knopf--leise', type: 'button', text: '▲ nach oben' });
    const runter = el('button', { class: 'knopf knopf--leise', type: 'button', text: '▼ nach unten' });
    const entfernen = el('button', { class: 'knopf knopf--leise', type: 'button', text: 'Eintrag entfernen' });
    hoch.addEventListener('click', () => { const v = karte.previousElementSibling; if (v) liste.insertBefore(karte, v); });
    runter.addEventListener('click', () => { const n = karte.nextElementSibling; if (n) liste.insertBefore(n, karte); });
    entfernen.addEventListener('click', () => {
      const hinweis = feld.standard
        ? 'Wirklich entfernen? Meist ist „Auf der Seite zeigen" ausschalten die bessere Wahl — dann bleibt alles erhalten.'
        : 'Wirklich entfernen?';
      if (window.confirm(hinweis)) { karte.remove(); karten.splice(karten.findIndex((k) => k.el === karte), 1); }
    });

    inhalt.append(...bausteine.map(([, b]) => b.el), el('div', { class: 'eintrag__werkzeuge' }, [hoch, runter, entfernen]));
    inhalt.addEventListener('input', aktualisieren);
    inhalt.addEventListener('change', aktualisieren);
    karte.append(kopf, inhalt);
    aktualisieren();

    const k = {
      el: karte,
      lesen: () => {
        const ergebnis: Eintrag = { ...eintrag };
        for (const [name, b] of bausteine) ergebnis[name] = b.lesen();
        return ergebnis;
      },
      loeschen: () => karte.remove(),
    };
    karten.push(k);
    return karte;
  };

  for (const e of Array.isArray(wert) ? (wert as Eintrag[]) : []) liste.append(kartenBauen(e, false));

  const neu = el('button', { class: 'knopf', type: 'button', text: '+ Neuer Eintrag' });
  neu.addEventListener('click', () => {
    const leer: Eintrag = {};
    for (const f of feld.felder ?? []) {
      leer[f.name] = f.typ === 'schalter' ? false : f.typ === 'zahl' ? 0 : f.typ === 'liste' || f.typ === 'eintraege' ? [] : f.typ === 'gruppe' ? {} : '';
    }
    if (feld.standard) { leer.id = ''; leer.aktiv = true; }
    const karte = kartenBauen(leer, true);
    liste.append(karte);
    karte.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  return {
    el: el('section', { class: 'eintraege' }, [
      el('span', { class: 'feld__label', text: feld.label }),
      feld.hilfe ? el('p', { class: 'feld__hilfe', text: feld.hilfe }) : null,
      liste,
      neu,
    ]),
    lesen: () => {
      /* Reihenfolge im Formular = Reihenfolge auf der Seite */
      const reihenfolge = [...liste.children];
      return karten
        .sort((a, b) => reihenfolge.indexOf(a.el) - reihenfolge.indexOf(b.el))
        .map((k, i) => (feld.standard ? { ...k.lesen(), position: i + 1 } : k.lesen()));
    },
  };
}

function feldBauen(feld: Feld, wert: Wert, daten: Eintrag, umgebung: Eintrag): Baustein {
  switch (feld.typ) {
    case 'text': return textFeld(feld, wert);
    case 'zahl': return textFeld(feld, wert, 'number');
    case 'datum': return textFeld(feld, wert, 'date');
    case 'mehrzeilig': return mehrzeiligFeld(feld, wert);
    case 'liste': return listeFeld(feld, wert);
    case 'schalter': return schalterFeld(feld, wert);
    case 'auswahl': return auswahlFeld(feld, wert, daten);
    case 'kennung': return kennungFeld(feld, wert, !umgebung.id);
    case 'bild':
    case 'pdf': return dateiFeld(feld, wert);
    case 'richtext': return richtextFeld(feld, wert);
    case 'gruppe': return gruppeFeld(feld, wert, daten);
    case 'eintraege': return eintraegeFeld(feld, wert, daten);
  }
}

/* ------------------------------------------------------------------ */
/* Laden und Speichern                                                 */
/* ------------------------------------------------------------------ */

async function start() {
  const formular = document.querySelector<HTMLFormElement>('[data-redaktion]');
  const definitionRoh = document.querySelector('[data-definition]')?.textContent;
  if (!formular || !definitionRoh) return;

  const bereich = formular.dataset.bereich!;
  const felder = JSON.parse(definitionRoh) as Feld[];
  const laden = formular.querySelector<HTMLElement>('[data-laden]')!;
  const ziel = formular.querySelector<HTMLElement>('[data-felder]')!;
  const leiste = document.querySelector<HTMLElement>('[data-speichern]')!;
  const knopf = leiste.querySelector<HTMLButtonElement>('[data-speichern-knopf]')!;
  const meldung = leiste.querySelector<HTMLElement>('[data-meldung]')!;

  const sagen = (art: 'fehler' | 'erfolg' | '', text: string, liste: string[] = []) => {
    meldung.dataset.art = art;
    meldung.textContent = text;
    if (liste.length) meldung.append(el('ul', {}, liste.map((f) => el('li', { text: f }))));
  };

  let daten: Eintrag;
  let sha: string;
  try {
    const antwort = await fetch(`/api/inhalt?bereich=${bereich}`, { headers: { Accept: 'application/json' } });
    if (antwort.status === 401) { laden.textContent = 'Bitte zuerst anmelden: /login'; return; }
    const ergebnis = (await antwort.json()) as { daten?: Eintrag; sha?: string; fehler?: string };
    if (!ergebnis.daten || !ergebnis.sha) throw new Error(ergebnis.fehler || 'Laden fehlgeschlagen');
    daten = ergebnis.daten;
    sha = ergebnis.sha;
  } catch (e) {
    laden.textContent = `Der aktuelle Stand konnte nicht geladen werden: ${e instanceof Error ? e.message : ''}`;
    return;
  }

  const bausteine = felder.map((f) => [f.name, feldBauen(f, daten[f.name], daten, daten)] as const);
  ziel.append(...bausteine.map(([, b]) => b.el));
  laden.hidden = true;
  leiste.hidden = false;

  let ungespeichert = false;
  formular.addEventListener('input', () => { ungespeichert = true; });
  window.addEventListener('beforeunload', (e) => { if (ungespeichert) e.preventDefault(); });

  knopf.addEventListener('click', async () => {
    const neu: Eintrag = { ...daten };
    for (const [name, b] of bausteine) neu[name] = b.lesen();

    knopf.disabled = true;
    sagen('', 'Wird gespeichert …');
    try {
      const antwort = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ bereich, daten: neu, sha, bisher: daten }),
      });
      const ergebnis = (await antwort.json()) as { ok: boolean; commit?: string; fehler?: string[] };
      if (ergebnis.ok) {
        ungespeichert = false;
        sagen('erfolg', 'Gespeichert. Die Seite wird jetzt neu gebaut — in etwa einer Minute ist die Änderung online.');
        /* Neuen Stand holen, damit ein zweites Speichern nicht abgelehnt wird */
        const frisch = await fetch(`/api/inhalt?bereich=${bereich}`).then((r) => r.json()).catch(() => null) as { sha?: string } | null;
        if (frisch?.sha) sha = frisch.sha;
        daten = neu;
      } else {
        sagen('fehler', 'Nicht gespeichert. Bitte prüfen:', ergebnis.fehler ?? ['Unbekannter Fehler']);
      }
    } catch {
      sagen('fehler', 'Keine Verbindung — bitte später noch einmal versuchen.');
    } finally {
      knopf.disabled = false;
    }
  });
}

start();
