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
  p: [], br: [], strong: [], em: [], u: [],
  ul: [], ol: [], li: [], h3: [], h4: [],
  a: ['href'], table: [], thead: [], tbody: [], tr: [], th: [], td: [],
  /* Bilder im Text: nur Dateien von dieser Seite, mit Alternativtext */
  img: ['src', 'alt'],
};

/** Schreibweisen, die auf die hier erlaubten abgebildet werden */
const UMBENANNT: Record<string, string> = {
  /* Browser erzeugen <div> für neue Zeilen */
  div: 'p',
  b: 'strong',
  i: 'em',
  /* Im Fließtext gibt es nur zwei Ebenen von Zwischenüberschriften: Die
     Überschrift des Abschnitts ist schon eine h2, alles darunter wäre
     ein Sprung in der Gliederung (Barrierefreiheit, siehe CLAUDE.md).
     Eingefügte Überschriften rutschen deshalb auf diese zwei Ebenen. */
  h1: 'h3',
  h2: 'h3',
  h5: 'h4',
  h6: 'h4',
};

/** Diese Elemente fliegen samt Inhalt raus — ihr Text ist kein Text. */
const VERWORFEN = new Set(['script', 'style', 'noscript', 'head', 'title']);

/** Was eine Zeile für sich bildet. Eine Überschrift darf davon nichts
    enthalten — siehe `blockhuellenAufloesen`. */
const BLOCK = new Set(['p', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'h3', 'h4']);

const UEBERSCHRIFT = new Set(['h3', 'h4']);

/**
 * Löst Überschriften auf, in denen ganze Absätze oder Listen stecken.
 *
 * So etwas entsteht, wenn in einer leeren Zeile „Zwischentitel" gewählt
 * und danach ein ganzer Text hineingeschrieben oder eingefügt wird: Der
 * Browser legt die Absätze INNERHALB der Überschrift ab. Der Text steht
 * dann komplett in einer Überschrift — er sieht überall fett aus, und
 * „Absatz" half nicht, weil das nur den innersten Block umstellt und die
 * Hülle stehen ließ.
 *
 * Eine Überschrift enthält nur Text. Alles andere ist ein Versehen und
 * wird hier aufgehoben: Die Hülle fällt weg, der Inhalt bleibt.
 */
export function blockhuellenAufloesen(wurzel: Element): boolean {
  let geaendert = false;
  for (const kopf of [...wurzel.querySelectorAll('h3, h4')]) {
    if (![...kopf.children].some((k) => BLOCK.has(k.tagName.toLowerCase()))) continue;
    const ersatz = document.createDocumentFragment();
    while (kopf.firstChild) ersatz.append(kopf.firstChild);
    kopf.replaceWith(ersatz);
    geaendert = true;
  }
  return geaendert;
}

export function htmlBereinigen(html: string): string {
  const quelle = document.createElement('div');
  quelle.innerHTML = html;

  /* Gebaut wird eine neue, saubere Fassung — statt die alte an Ort und
     Stelle umzubauen. Beim Umbauen an Ort und Stelle wurde der Inhalt
     einer entfernten Hülle nicht mehr geprüft (er stand nicht mehr in
     der Liste, über die gerade gelaufen wurde), und Unerlaubtes darin
     blieb stehen. */
  const saeubern = (knoten: Node): DocumentFragment => {
    const ziel = document.createDocumentFragment();

    for (const kind of [...knoten.childNodes]) {
      if (kind.nodeType === Node.TEXT_NODE) { ziel.append(kind); continue; }
      if (kind.nodeType !== Node.ELEMENT_NODE) continue; /* Kommentare weg */

      const element = kind as Element;
      const roh = element.tagName.toLowerCase();
      if (VERWORFEN.has(roh)) continue;

      const tag = UMBENANNT[roh] ?? roh;
      /* Unbekanntes Element: Inhalt behalten, Hülle weg */
      if (!(tag in ERLAUBT)) { ziel.append(saeubern(element)); continue; }

      const neu = document.createElement(tag);
      for (const attr of [...element.attributes]) {
        if (!ERLAUBT[tag].includes(attr.name)) continue;
        if (attr.name === 'href' && /^\s*javascript:/i.test(attr.value)) continue;
        /* Bilder dürfen nur von dieser Seite kommen — kein fremder
           Server, kein `data:`. Sonst würde die Redaktion versehentlich
           eine externe Ressource einbauen (siehe CLAUDE.md). */
        if (attr.name === 'src' && !/^\/[a-z0-9._\-/]+$/i.test(attr.value)) continue;
        neu.setAttribute(attr.name, attr.value);
      }
      if (tag === 'img' && !neu.getAttribute('src')) continue;

      neu.append(saeubern(element));
      ziel.append(neu);
    }

    return ziel;
  };

  const rahmen = document.createElement('div');
  rahmen.append(saeubern(quelle));
  blockhuellenAufloesen(rahmen);

  /* Leere Absätze am Ende weg */
  return rahmen.innerHTML.replace(/(<p>(<br>|\s|&nbsp;)*<\/p>\s*)+$/g, '').trim();
}

/**
 * Bereitet eingefügten Text auf: Aufbau bleibt, Auszeichnung fällt weg.
 *
 * Wer aus Word oder von einer Webseite einfügt, bringt deren Gestaltung
 * mit — meist fett und in fremder Schrift. Absätze, Listen, Verweise und
 * Tabellen sind wertvoll und bleiben; Fett, Kursiv, Unterstrichen und
 * Überschriften fallen weg. Auszeichnungen setzt man danach bewusst mit
 * der Leiste (Florian, 17. September 2026).
 */
export function eingefuegtesAufbereiten(html: string, text: string): string {
  if (!html.trim()) {
    /* Nur reiner Text: Leerzeilen trennen Absätze, einzelne Umbrüche
       bleiben Umbrüche. */
    const schuetzen = (t: string) =>
      t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return text
      .split(/\n\s*\n/)
      .map((absatz) => absatz.trim())
      .filter(Boolean)
      .map((absatz) => `<p>${schuetzen(absatz).replace(/\n/g, '<br>')}</p>`)
      .join('');
  }

  const rahmen = document.createElement('div');
  rahmen.innerHTML = htmlBereinigen(html);

  for (const kind of [...rahmen.querySelectorAll('strong, em, u, h3, h4')]) {
    const tag = kind.tagName.toLowerCase();
    /* Überschriften werden zu Absätzen, Auszeichnungen fallen ganz weg */
    const ersatz: Node = UEBERSCHRIFT.has(tag) ? document.createElement('p') : document.createDocumentFragment();
    while (kind.firstChild) ersatz.appendChild(kind.firstChild);
    kind.replaceWith(ersatz);
  }

  return rahmen.innerHTML;
}

/* ------------------------------------------------------------------ */
/* Anfragen an die Schnittstellen                                      */
/* ------------------------------------------------------------------ */

/**
 * Sagt, warum eine Anfrage abgewiesen wurde — die drei Fälle sehen für
 * den Bediener gleich aus, verlangen aber ganz Verschiedenes.
 *
 *   Umleitung   Cloudflare Access hat die Anfrage abgefangen: nicht (mehr)
 *               angemeldet. Hilft: neu anmelden.
 *   401         Access hat durchgelassen, aber die eigene Prüfung in
 *               functions/_middleware.ts erkennt das Token nicht an.
 *               Neu anmelden hilft dann NICHT — meist stimmt ACCESS_AUD
 *               oder ACCESS_TEAM in den Pages-Einstellungen nicht mehr
 *               mit der Access-Anwendung überein (docs/betrieb.md).
 *   403         Angemeldet, aber nicht berechtigt.
 */
export function abweisungErklaeren(antwort: Response): string {
  const weiter = ' Ihre Eingaben stehen noch hier — es geht nichts verloren.';
  if (antwort.status === 401) {
    return 'Der Server hat die Anmeldung nicht anerkannt (401). Erneutes Anmelden '
      + 'hilft hier nicht: In den Einstellungen der Seite stimmt die Kennung der '
      + 'Anmelde-Anwendung nicht mehr (ACCESS_AUD / ACCESS_TEAM). Bitte an die '
      + 'Betreuung der Seite wenden.' + weiter;
  }
  if (antwort.status === 403) {
    return 'Dieser Zugang darf die Redaktion nicht ändern (403). Bitte an die '
      + 'Betreuung der Seite wenden.' + weiter;
  }
  return 'Die Anmeldung ist abgelaufen. Bitte in einem neuen Tab /login öffnen, '
    + 'anmelden — und dann hier noch einmal auf „Speichern und veröffentlichen" '
    + 'drücken.' + weiter;
}

/**
 * Anfrage an /api/… — mit `redirect: 'manual'`.
 *
 * Läuft die Anmeldung ab, antwortet Cloudflare Access nicht mit einem
 * Fehler, sondern mit einer Umleitung auf seine Anmeldeseite. Die liegt
 * auf einem anderen Server; folgt der Browser ihr, bricht er die
 * Anfrage aus Sicherheitsgründen ab — in der Redaktion kam dann
 * „Keine Verbindung" an, obwohl die Verbindung stand (Florian,
 * 17. September 2026).
 *
 * Mit `redirect: 'manual'` wird die Umleitung nicht verfolgt. Sie kommt
 * als Antwort mit `type === 'opaqueredirect'` zurück und ist damit als
 * das erkennbar, was sie ist: eine abgelaufene Anmeldung.
 */
export function anfrage(pfad: string, optionen: RequestInit = {}): Promise<Response> {
  return fetch(pfad, { redirect: 'manual', ...optionen });
}

/** Steht die Anmeldung noch? */
export function angemeldet(antwort: Response): boolean {
  return antwort.type !== 'opaqueredirect' && antwort.status !== 401 && antwort.status !== 403;
}

/**
 * Antwort als JSON lesen. Kommt kein JSON — etwa eine Fehlerseite des
 * Servers —, sagt die Meldung wenigstens, welcher Status kam.
 */
export async function alsJson<T>(antwort: Response): Promise<T> {
  const text = await antwort.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Unerwartete Antwort vom Server (${antwort.status || 'keine Angabe'}).`);
  }
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
  const symbol = feld.ordner === 'symbole';
  const eingabe = el('input', { class: 'feld__eingabe', id, type: 'text', value: wert == null ? '' : String(wert), placeholder: symbol ? '/icons/…' : feld.typ === 'bild' ? '/bilder/…' : '/dokumente/…' });
  const vorschau = feld.typ === 'bild' ? el('img', { class: 'datei__vorschau', alt: '' }) : null;
  const zeigen = () => { if (vorschau) { vorschau.src = eingabe.value || ''; vorschau.hidden = !eingabe.value; } };
  zeigen();
  eingabe.addEventListener('change', zeigen);

  const bildTypen = symbol ? 'image/svg+xml,.svg,image/jpeg,image/png,image/webp' : 'image/jpeg,image/png,image/webp';
  const datei = el('input', { type: 'file', accept: feld.typ === 'bild' ? bildTypen : 'application/pdf' });
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
      const antwort = await anfrage('/api/hochladen', { method: 'POST', body: form });
      if (!angemeldet(antwort)) { status.textContent = abweisungErklaeren(antwort); return; }
      const ergebnis = await alsJson<{ ok: boolean; pfad?: string; fehler?: string }>(antwort);
      if (ergebnis.ok && ergebnis.pfad) {
        eingabe.value = ergebnis.pfad;
        zeigen();
        status.textContent = 'Hochgeladen. Erscheint nach dem Speichern und Neubau der Seite.';
      } else {
        status.textContent = ergebnis.fehler || 'Hochladen fehlgeschlagen.';
      }
    } catch (e) {
      status.textContent = e instanceof Error && e.message ? e.message : 'Keine Verbindung.';
    }
    datei.value = '';
  });

  const zeile = el('div', { class: 'datei' }, [vorschau, eingabe, knopf, status]);
  return { el: huelle(feld, zeile, id), lesen: () => eingabe.value.trim() };
}

/**
 * Bild in den Fließtext setzen.
 *
 * Nutzt dieselbe Hochladestrecke wie das eigene Bildfeld
 * (functions/api/hochladen.ts). Der Alternativtext ist Pflicht —
 * ohne ihn ist das Bild für blinde Besucher nicht vorhanden
 * (Barrierefreiheit, siehe CLAUDE.md).
 */
function bildEinfuegen(
  inhalt: HTMLElement,
  feld: Feld,
  befehl: (name: string, arg?: string) => () => void,
): void {
  const auswahl = document.createElement('input');
  auswahl.type = 'file';
  auswahl.accept = 'image/jpeg,image/png,image/webp';

  auswahl.addEventListener('change', async () => {
    const datei = auswahl.files?.[0];
    if (!datei) return;

    const beschreibung = window.prompt(
      'Was ist auf dem Bild zu sehen? (Pflicht — wird blinden Besuchern vorgelesen)',
      '',
    );
    if (beschreibung === null) return;
    if (!beschreibung.trim()) {
      window.alert('Ohne Bildbeschreibung kann das Bild nicht eingefügt werden.');
      return;
    }

    const form = new FormData();
    form.append('datei', datei);
    form.append('ordner', feld.ordner ?? 'allgemein');

    try {
      const antwort = await anfrage('/api/hochladen', { method: 'POST', body: form });
      if (!angemeldet(antwort)) { window.alert(abweisungErklaeren(antwort)); return; }
      const ergebnis = await alsJson<{ ok: boolean; pfad?: string; fehler?: string }>(antwort);
      if (!ergebnis.ok || !ergebnis.pfad) {
        window.alert(ergebnis.fehler || 'Hochladen fehlgeschlagen.');
        return;
      }
      const alt = beschreibung.trim().replace(/"/g, '&quot;');
      inhalt.focus();
      befehl('insertHTML', `<img src="${ergebnis.pfad}" alt="${alt}"><p></p>`)();
    } catch (e) {
      window.alert(e instanceof Error && e.message ? e.message : 'Keine Verbindung zum Server.');
    }
  });

  auswahl.click();
}

function richtextFeld(feld: Feld, wert: Wert): Baustein {
  const id = neueId();
  const inhalt = el('div', { class: 'richtext__inhalt', id });
  inhalt.contentEditable = 'true';
  inhalt.innerHTML = htmlBereinigen(wert == null ? '' : String(wert)) || '<p></p>';

  const befehl = (name: string, arg?: string) => () => {
    inhalt.focus();
    document.execCommand(name, false, arg);
    zustandZeigen();
  };

  /* Knöpfe, die anzeigen, wie der ausgewählte Text gesetzt ist */
  const schalter: [HTMLElement, () => boolean][] = [];

  const knopf = (text: string, titel: string, aktion: () => void, zustand?: () => boolean) => {
    const b = el('button', { type: 'button', text, title: titel });
    b.addEventListener('mousedown', (e) => e.preventDefault());
    b.addEventListener('click', aktion);
    if (zustand) schalter.push([b, zustand]);
    return b;
  };

  /** Welcher Block umgibt die Auswahl? Liefert 'p', 'h3', 'li' … */
  const block = () => {
    const knoten = window.getSelection()?.anchorNode;
    let el = knoten instanceof Element ? knoten : knoten?.parentElement ?? null;
    while (el && el !== inhalt) {
      const tag = el.tagName.toLowerCase();
      if (['p', 'h3', 'h4', 'li', 'td', 'th'].includes(tag)) return tag;
      el = el.parentElement;
    }
    return '';
  };

  /** Steckt die Auswahl in einem Verweis? */
  const imVerweis = () => {
    const knoten = window.getSelection()?.anchorNode;
    const start = knoten instanceof Element ? knoten : knoten?.parentElement ?? null;
    return !!start?.closest('a');
  };

  /**
   * Zeigt an den Knöpfen, wie der ausgewählte Text gesetzt ist.
   *
   * Der Browser beantwortet das selbst (`queryCommandState`) — für die
   * Blockform und den Verweis sucht die Auswahl sich ihren Vorfahren
   * (Florian, 18. September 2026).
   */
  function zustandZeigen() {
    const auswahl = window.getSelection();
    const knoten = auswahl?.anchorNode ?? null;
    const drin = !!knoten && inhalt.contains(knoten);
    for (const [b, pruefen] of schalter) {
      let an = false;
      try { an = drin && pruefen(); } catch { /* alter Browser: dann eben nicht */ }
      b.setAttribute('aria-pressed', String(an));
    }
  }

  /* „Absatz" muss auch aus einer Überschrift herausführen, in der ganze
     Absätze stecken. `formatBlock` stellt nur den innersten Block um und
     ließ die Hülle stehen — deshalb danach das Auflösen. */
  const alsAbsatz = () => {
    inhalt.focus();
    document.execCommand('formatBlock', false, 'p');
    blockhuellenAufloesen(inhalt);
  };

  /* Text aus Word oder von einer Webseite kommt mit fremder Gestaltung.
     Eingefügt wird deshalb nur der Aufbau, nicht die Auszeichnung. */
  inhalt.addEventListener('paste', (e) => {
    const ablage = e.clipboardData;
    if (!ablage) return;
    e.preventDefault();
    const sauber = eingefuegtesAufbereiten(ablage.getData('text/html'), ablage.getData('text/plain'));
    if (sauber) document.execCommand('insertHTML', false, sauber);
  });

  const leiste = el('div', { class: 'richtext__leiste' }, [
    knopf('Absatz', 'Normaler Absatz', alsAbsatz, () => block() === 'p'),
    knopf('Zwischentitel', 'Zwischenüberschrift', befehl('formatBlock', 'h3'), () => block() === 'h3'),
    /* In einer Zwischenüberschrift meldet der Browser „fett", weil sie
       fett gesetzt IST — angeklickt hat das niemand. Dort also nicht
       anzeigen. */
    knopf('Fett', 'Fett', befehl('bold'), () => !['h3', 'h4'].includes(block()) && document.queryCommandState('bold')),
    knopf('Kursiv', 'Kursiv', befehl('italic'), () => document.queryCommandState('italic')),
    knopf('• Liste', 'Aufzählung', befehl('insertUnorderedList'), () => document.queryCommandState('insertUnorderedList')),
    knopf('1. Liste', 'Nummerierte Liste', befehl('insertOrderedList'), () => document.queryCommandState('insertOrderedList')),
    knopf('Verweis', 'Verweis einfügen', () => {
      const ziel = window.prompt('Adresse des Verweises (z. B. https://… oder /leistungen/prophylaxe/):');
      if (ziel) befehl('createLink', ziel)();
    }, imVerweis),
    knopf('Tabelle', 'Tabelle einfügen', () => {
      const spalten = Math.min(8, Math.max(1, Number(window.prompt('Wie viele Spalten?', '2')) || 2));
      const zeilen = Math.min(50, Math.max(1, Number(window.prompt('Wie viele Zeilen (ohne Überschrift)?', '3')) || 3));
      let html = '<table><thead><tr>';
      for (let c = 1; c <= spalten; c++) html += `<th>Spalte ${c}</th>`;
      html += '</tr></thead><tbody>';
      for (let i = 0; i < zeilen; i++) html += '<tr>' + '<td>…</td>'.repeat(spalten) + '</tr>';
      html += '</tbody></table><p></p>';
      befehl('insertHTML', html)();
    }),
    /* Freie Abschnitte haben ihr Bild als eigenes Feld neben dem Text —
       dort wäre ein zweiter Weg, Bilder einzusetzen, nur verwirrend. */
    feld.ohneBild ? null : knopf('Bild', 'Bild in den Text einfügen', () => bildEinfuegen(inhalt, feld, befehl)),
    knopf('Format löschen', 'Alle Auszeichnungen entfernen', () => {
      befehl('removeFormat')();
      blockhuellenAufloesen(inhalt);
    }),
  ]);

  /* Die Auswahl ändert sich am Dokument, nicht am Feld — deshalb hier.
     Läuft für jedes Textfeld einmal; der Test `inhalt.contains` sorgt
     dafür, dass nur das Feld mit der Auswahl etwas anzeigt. */
  document.addEventListener('selectionchange', zustandZeigen);
  inhalt.addEventListener('input', zustandZeigen);
  inhalt.addEventListener('focus', zustandZeigen);
  inhalt.addEventListener('blur', zustandZeigen);
  zustandZeigen();

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

/** „Neuer Abschnitt", „Neue Person", „Neues Bild" */
const NEU_ARTIKEL = { m: 'Neuer', w: 'Neue', s: 'Neues' };

function eintraegeFeld(feld: Feld, wert: Wert, daten: Eintrag): Baustein {
  /* Die Knöpfe heißen nach dem, was sie anlegen. Zwei verschachtelte
     Listen — Abschnitte und die Bereiche darin — trugen sonst beide
     „+ Neuer Eintrag" und waren nicht auseinanderzuhalten (Florian,
     17. September 2026). */
  const einzahl = feld.einzahl ?? 'Eintrag';
  const neuText = `+ ${NEU_ARTIKEL[feld.geschlecht ?? 'm']} ${einzahl}`;

  const liste = el('div');
  const karten: { el: HTMLElement; beschriften: () => void; lesen: () => Eintrag; loeschen: () => void }[] = [];

  const kartenBauen = (eintrag: Eintrag, neu: boolean) => {
    const inhalt = el('div', { class: 'eintrag__inhalt' });
    /* Die laufende Nummer steht vor dem Titel — bei den Bereichen
       innerhalb eines Abschnitts sieht man damit auf einen Blick,
       wo man ist, auch wenn jeder eine Zwischenüberschrift trägt
       (Florian, 18. September 2026). */
    const nummerChip = el('span', { class: 'eintrag__nummer' });
    const titelText = el('span', { class: 'eintrag__titel' });
    const marke = el('span', { class: 'eintrag__marke' });
    const kopf = el('button', { class: 'eintrag__kopf', type: 'button' }, [nummerChip, titelText, marke]);
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
      /* Ohne eigenen Titel die Nummer zeigen — „Bereich 2" sagt mehr als
         „(ohne Titel)", gerade wenn die Zwischenüberschrift absichtlich
         leer bleibt. */
      const nummer = [...liste.children].indexOf(karte) + 1;
      titelText.textContent = t || (nummer > 0 ? `${einzahl} ${nummer}` : `${einzahl} (neu)`);
      nummerChip.textContent = nummer > 0 ? String(nummer) : '·';
      const aktiv = feld.standard ? bausteine.find(([n]) => n === 'aktiv')?.[1].lesen() : true;
      marke.textContent = aktiv ? '' : 'ausgeblendet';
      marke.hidden = !!aktiv;
      if (aktiv) delete karte.dataset.inaktiv; else karte.dataset.inaktiv = 'ja';
    };

    const hoch = el('button', { class: 'knopf knopf--leise', type: 'button', text: '▲ nach oben' });
    const runter = el('button', { class: 'knopf knopf--leise', type: 'button', text: '▼ nach unten' });
    const entfernen = el('button', { class: 'knopf knopf--leise', type: 'button', text: `${einzahl} entfernen` });
    /* Nach dem Verschieben stimmen die Nummern der Karten ohne Titel
       nicht mehr — alle neu beschriften. */
    const umsortiert = () => karten.forEach((k) => k.beschriften());
    hoch.addEventListener('click', () => { const v = karte.previousElementSibling; if (v) liste.insertBefore(karte, v); umsortiert(); });
    runter.addEventListener('click', () => { const n = karte.nextElementSibling; if (n) liste.insertBefore(n, karte); umsortiert(); });
    entfernen.addEventListener('click', () => {
      const hinweis = feld.standard
        ? `${einzahl} wirklich entfernen? Meist ist „Auf der Seite zeigen" ausschalten die bessere Wahl — dann bleibt alles erhalten.`
        : `${einzahl} wirklich entfernen?`;
      if (window.confirm(hinweis)) {
        karte.remove();
        karten.splice(karten.findIndex((k) => k.el === karte), 1);
        umsortiert();
      }
    });

    inhalt.append(...bausteine.map(([, b]) => b.el), el('div', { class: 'eintrag__werkzeuge' }, [hoch, runter, entfernen]));
    inhalt.addEventListener('input', aktualisieren);
    inhalt.addEventListener('change', aktualisieren);
    karte.append(kopf, inhalt);
    aktualisieren();

    const k = {
      el: karte,
      beschriften: aktualisieren,
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
  /* Erst jetzt stehen alle Karten in der Liste und kennen ihre Nummer */
  karten.forEach((k) => k.beschriften());

  const neu = el('button', { class: 'knopf', type: 'button', text: neuText });
  neu.addEventListener('click', () => {
    const leer: Eintrag = {};
    for (const f of feld.felder ?? []) {
      leer[f.name] = f.typ === 'schalter' ? false : f.typ === 'zahl' ? 0 : f.typ === 'liste' || f.typ === 'eintraege' ? [] : f.typ === 'gruppe' ? {} : '';
    }
    if (feld.standard) { leer.id = ''; leer.aktiv = true; }
    const karte = kartenBauen(leer, true);
    liste.append(karte);
    karten.forEach((k) => k.beschriften());
    karte.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* Verschachtelte Listen — die Bereiche innerhalb eines Abschnitts —
     hebt die Gestaltung als eigene Gruppe hervor. Sie erkennt sie an
     der Verschachtelung selbst (`.eintrag__inhalt > .eintraege` in
     redaktion.css); hier ist dafür nichts zu tun. */
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
    const antwort = await anfrage(`/api/inhalt?bereich=${bereich}`, { headers: { Accept: 'application/json' } });
    if (!angemeldet(antwort)) { laden.textContent = abweisungErklaeren(antwort); return; }
    const ergebnis = await alsJson<{ daten?: Eintrag; sha?: string; fehler?: string }>(antwort);
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
      const antwort = await anfrage('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ bereich, daten: neu, sha, bisher: daten }),
      });
      /* Nichts ist verloren: Das Formular steht unverändert da. Nach dem
         Anmelden im zweiten Tab genügt ein erneuter Druck auf den Knopf. */
      if (!angemeldet(antwort)) { sagen('fehler', abweisungErklaeren(antwort)); return; }

      const ergebnis = await alsJson<{ ok: boolean; commit?: string; fehler?: string[] }>(antwort);
      if (ergebnis.ok) {
        ungespeichert = false;
        sagen('erfolg', 'Gespeichert. Die Seite wird jetzt neu gebaut — in etwa einer Minute ist die Änderung online.');
        /* Neuen Stand holen, damit ein zweites Speichern nicht abgelehnt wird */
        const frisch = await anfrage(`/api/inhalt?bereich=${bereich}`)
          .then((r) => (angemeldet(r) ? alsJson<{ sha?: string }>(r) : null))
          .catch(() => null);
        if (frisch?.sha) sha = frisch.sha;
        daten = neu;
      } else {
        sagen('fehler', 'Nicht gespeichert. Bitte prüfen:', ergebnis.fehler ?? ['Unbekannter Fehler']);
      }
    } catch (e) {
      sagen('fehler', e instanceof Error && e.message
        ? `${e.message} Ihre Eingaben stehen noch hier — bitte noch einmal versuchen.`
        : 'Keine Verbindung — bitte später noch einmal versuchen.');
    } finally {
      knopf.disabled = false;
    }
  });
}

start();
