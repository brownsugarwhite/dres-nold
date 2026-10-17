/**
 * Der Texteditor der Redaktion: Absätze, Zwischentitel, Fett, Kursiv,
 * Listen, Tabellen und Verweise.
 *
 * Ein `contenteditable` mit `document.execCommand` — ohne Bibliothek
 * (docs/entscheidungen.md, „Der Texteditor der Redaktion"). Was er
 * erzeugt, räumt `htmlBereinigen` auf; der Server prüft dieselbe Liste
 * erlaubter Elemente noch einmal (lib/richtext-pruefen.ts).
 *
 * Verweise setzt seit Oktober 2026 der Dialog „Wohin soll das führen?"
 * (dialoge.ts) statt einer Eingabezeile für die Adresse: Seiten und
 * Abschnitte dieser Website stehen zur Auswahl, dazu Dateien, andere
 * Websites, E-Mail und Telefon. Ein Verweis lässt sich nachträglich
 * ändern und wieder entfernen.
 */
import { ERLAUBT as ERLAUBT_SERVER, VERWEIS } from '../lib/richtext-pruefen';
import { el, neueId } from './werkzeug';
import { zielWaehlen, dateiWaehlen, formularDialog } from './dialoge';
import { zielBeschreiben, type ZielDaten } from './ziele';

/** Nur die erlaubten Auszeichnungen bleiben im Richtext übrig */
/* Dieselbe Liste prüft der Server beim Speichern (lib/richtext-pruefen.ts) */
const ERLAUBT = ERLAUBT_SERVER;

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
        if (attr.name === 'href' && !VERWEIS.test(attr.value.trim())) continue;
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


export interface TextOptionen {
  /** Kein Knopf „Bild" — wo das Bild ein eigenes Feld neben dem Text hat */
  ohneBild?: boolean;
  /** Kein Knopf „Tabelle" — in kleinen Feldern wie Kacheln */
  ohneTabelle?: boolean;
  /** Ordner für Bilder im Text */
  ordner?: string;
  /** Die Ziele für Verweise */
  zielDaten: () => ZielDaten;
  /** Kleiner, für kurze Texte */
  klein?: boolean;
}

const schuetzen = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Ein Texteditor; `lesen()` liefert das bereinigte HTML */
export function texteditor(wert: string, optionen: TextOptionen): { el: HTMLElement; inhalt: HTMLElement; lesen: () => string } {
  const id = neueId();
  const inhalt = el('div', { class: optionen.klein ? 'richtext__inhalt richtext__inhalt--klein' : 'richtext__inhalt', id });
  inhalt.contentEditable = 'true';
  inhalt.setAttribute('role', 'textbox');
  inhalt.setAttribute('aria-multiline', 'true');
  inhalt.innerHTML = htmlBereinigen(wert ?? '') || '<p></p>';

  const melden = () => inhalt.dispatchEvent(new Event('input', { bubbles: true }));

  const befehl = (name: string, arg?: string) => () => {
    inhalt.focus();
    document.execCommand(name, false, arg);
    zustandZeigen();
    melden();
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
    let e = knoten instanceof Element ? knoten : knoten?.parentElement ?? null;
    while (e && e !== inhalt) {
      const tag = e.tagName.toLowerCase();
      if (['p', 'h3', 'h4', 'li', 'td', 'th'].includes(tag)) return tag;
      e = e.parentElement;
    }
    return '';
  };

  /** Der Verweis, in dem die Auswahl steckt */
  const verweis = (): HTMLAnchorElement | null => {
    const knoten = window.getSelection()?.anchorNode;
    const start = knoten instanceof Element ? knoten : knoten?.parentElement ?? null;
    const a = start?.closest('a');
    return a && inhalt.contains(a) ? a : null;
  };

  const zielZeile = el('p', { class: 'richtext__ziel', hidden: true });

  /**
   * Zeigt an den Knöpfen, wie der ausgewählte Text gesetzt ist — und
   * unter dem Feld, wohin ein Verweis führt.
   */
  function zustandZeigen() {
    const knoten = window.getSelection()?.anchorNode ?? null;
    const drin = !!knoten && inhalt.contains(knoten);
    for (const [b, pruefen] of schalter) {
      let an = false;
      try { an = drin && pruefen(); } catch { /* alter Browser: dann eben nicht */ }
      b.setAttribute('aria-pressed', String(an));
    }
    const a = drin ? verweis() : null;
    zielZeile.hidden = !a;
    entfernen.hidden = !a;
    if (a) {
      const z = zielBeschreiben(a.getAttribute('href') ?? '', optionen.zielDaten());
      zielZeile.textContent = `Verweis führt zu: ${z.art} › ${z.text}`;
      zielZeile.dataset.fehlt = String(z.fehlt);
    }
  }

  /* „Absatz" muss auch aus einer Überschrift herausführen, in der ganze
     Absätze stecken. `formatBlock` stellt nur den innersten Block um und
     ließ die Hülle stehen — deshalb danach das Auflösen. */
  const alsAbsatz = () => {
    inhalt.focus();
    document.execCommand('formatBlock', false, 'p');
    blockhuellenAufloesen(inhalt);
    melden();
  };

  /** Die Auswahl merken, solange ein Dialog offen ist — und zurückholen */
  const auswahlMerken = () => {
    const s = window.getSelection();
    const r = s && s.rangeCount && inhalt.contains(s.anchorNode) ? s.getRangeAt(0).cloneRange() : null;
    return () => {
      inhalt.focus();
      if (!r) return;
      const s2 = window.getSelection();
      s2?.removeAllRanges();
      s2?.addRange(r);
    };
  };

  const verweisSetzen = async () => {
    const zurueck = auswahlMerken();
    const a = verweis();
    const ziel = await zielWaehlen(a?.getAttribute('href') ?? '', optionen.zielDaten());
    zurueck();
    if (ziel === null) return;
    if (a) {
      a.setAttribute('href', ziel);
    } else if (window.getSelection()?.isCollapsed ?? true) {
      /* Nichts markiert: der Verweis bekommt den Namen seines Ziels */
      const name = zielBeschreiben(ziel, optionen.zielDaten()).text;
      document.execCommand('insertHTML', false, `<a href="${schuetzen(ziel)}">${schuetzen(name)}</a>&nbsp;`);
    } else {
      document.execCommand('createLink', false, ziel);
    }
    zustandZeigen();
    melden();
  };

  const verweisEntfernen = () => {
    const a = verweis();
    if (!a) return;
    const ersatz = document.createDocumentFragment();
    while (a.firstChild) ersatz.append(a.firstChild);
    a.replaceWith(ersatz);
    zustandZeigen();
    melden();
  };

  const tabelleEinfuegen = async () => {
    const zurueck = auswahlMerken();
    const spalten = el('input', { class: 'feld__eingabe', type: 'number', min: '1', max: '8', value: '2' });
    const zeilenFeld = el('input', { class: 'feld__eingabe', type: 'number', min: '1', max: '50', value: '3' });
    const formular = el('div', { class: 'feldreihe' }, [
      el('label', { class: 'feld' }, [el('span', { class: 'feld__label', text: 'Spalten' }), spalten]),
      el('label', { class: 'feld' }, [el('span', { class: 'feld__label', text: 'Zeilen (ohne Kopfzeile)' }), zeilenFeld]),
    ]);
    const ok = await formularDialog('Tabelle einfügen', formular, 'Einfügen', () => null);
    zurueck();
    if (!ok) return;
    const s = Math.min(8, Math.max(1, Number(spalten.value) || 2));
    const z = Math.min(50, Math.max(1, Number(zeilenFeld.value) || 3));
    let html = '<table><thead><tr>';
    for (let c = 1; c <= s; c++) html += `<th>Spalte ${c}</th>`;
    html += '</tr></thead><tbody>';
    for (let i = 0; i < z; i++) html += '<tr>' + '<td>…</td>'.repeat(s) + '</tr>';
    html += '</tbody></table><p></p>';
    befehl('insertHTML', html)();
  };

  /** Bild in den Fließtext — der Alternativtext ist Pflicht (Barrierefreiheit) */
  const bildEinfuegen = async () => {
    const zurueck = auswahlMerken();
    const pfad = await dateiWaehlen(optionen.ordner ?? 'allgemein', 'Bild in den Text einfügen');
    if (!pfad) { zurueck(); return; }
    const alt = el('input', { class: 'feld__eingabe', type: 'text', placeholder: 'z. B. „Behandlungszimmer mit Blick in den Garten"' });
    const ok = await formularDialog('Was ist auf dem Bild zu sehen?',
      el('div', {}, [el('p', { class: 'dialog__einleitung', text: 'Wird Menschen vorgelesen, die das Bild nicht sehen können.' }), alt]),
      'Einfügen', () => (alt.value.trim() ? null : 'Bitte kurz beschreiben, was auf dem Bild zu sehen ist.'));
    zurueck();
    if (!ok) return;
    befehl('insertHTML', `<img src="${schuetzen(pfad)}" alt="${schuetzen(alt.value.trim())}"><p></p>`)();
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

  const entfernen = knopf('Verweis entfernen', 'Den Verweis entfernen, der Text bleibt', verweisEntfernen);
  entfernen.hidden = true;

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
    knopf('Verweis …', 'Text markieren, dann hier ein Ziel wählen', verweisSetzen, () => !!verweis()),
    entfernen,
    optionen.ohneTabelle ? null : knopf('Tabelle …', 'Tabelle einfügen', tabelleEinfuegen),
    optionen.ohneBild ? null : knopf('Bild …', 'Bild in den Text einfügen', bildEinfuegen),
    knopf('Format löschen', 'Alle Auszeichnungen entfernen', () => {
      befehl('removeFormat')();
      blockhuellenAufloesen(inhalt);
    }),
  ]);

  /* Die Auswahl ändert sich am Dokument, nicht am Feld — deshalb hier.
     Der Test `inhalt.contains` sorgt dafür, dass nur das Feld mit der
     Auswahl etwas anzeigt. Fällt das Feld aus dem Dokument (anderer
     Bereich geöffnet), meldet sich der Zuhörer ab. */
  const beiAuswahl = () => {
    if (!inhalt.isConnected) { document.removeEventListener('selectionchange', beiAuswahl); return; }
    zustandZeigen();
  };
  document.addEventListener('selectionchange', beiAuswahl);
  inhalt.addEventListener('input', zustandZeigen);
  inhalt.addEventListener('focus', zustandZeigen);
  // Ein Klick auf einen Verweis im Editor öffnet ihn nicht, sondern wählt ihn
  inhalt.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) e.preventDefault(); });

  return {
    el: el('div', { class: 'richtext' }, [leiste, inhalt, zielZeile]),
    inhalt,
    lesen: () => htmlBereinigen(inhalt.innerHTML),
  };
}
