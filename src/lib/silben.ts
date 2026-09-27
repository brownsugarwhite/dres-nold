/**
 * Silbentrennung beim Bau der Seite.
 *
 * Die Praxis wünscht Blocksatz — auch auf Handys. Blocksatz lebt von
 * der Silbentrennung, und die des Browsers (`hyphens: auto`) ist nicht
 * verlässlich: Sie hängt vom Wörterbuch des Geräts ab (Chrome lädt es
 * erst nach, WebKit kennt manche Wörter nicht), und wo sie ein langes
 * Wort nicht bricht, reißt die Zeile davor zu Löchern auf (Florian,
 * 27. September 2026: „genauer und angenehmer macht — vom", weil
 * „dreidimensionalen" ganz in die nächste Zeile rutschte).
 *
 * Deshalb bekommen alle Lesetexte HIER, beim Erzeugen der Seite, weiche
 * Trennstriche (U+00AD) nach den deutschen Trennmustern der Bibliothek
 * `hyphen` (Liang-Algorithmus, dieselben Muster wie TeX). Ein weicher
 * Trennstrich ist unsichtbar, bis der Browser an dieser Stelle umbricht
 * — dann steht der Bindestrich. Jeder Browser bricht damit an denselben,
 * richtigen Stellen. `hyphens: auto` bleibt als Ergänzung im CSS.
 *
 * Läuft nur im Build (Astro rendert statisch); im Browser kommt davon
 * nichts an außer den Trennstrichen im HTML.
 */
/* CommonJS-Modul ohne benannte Exporte — deshalb der Standard-Import */
import de from 'hyphen/de';

const { hyphenateHTMLSync, hyphenateSync } = de;

/** Der weiche Trennstrich, als Escape geschrieben — das Zeichen selbst
    ist unsichtbar und ginge im Quelltext verloren. */
const WEICH = '\u00AD';

/** Mindestens so viele Buchstaben vor dem ersten und nach dem letzten
    Trennstrich eines Worts — „kur-ze" oder „Er-wachsenen" am Zeilenende
    sieht nach nichts aus. Die Muster erlauben zwei; hier gelten drei
    (wie `hyphenate-limit-chars` im CSS). */
const RAND = 3;

function raenderPruefen(text: string): string {
  return text.replace(/[\p{L}\u00AD]+/gu, (wort) => {
    if (!wort.includes(WEICH)) return wort;
    const teile = wort.split(WEICH);
    while (teile.length > 1 && teile[0].length < RAND) teile.splice(0, 2, teile[0] + teile[1]);
    while (teile.length > 1 && teile[teile.length - 1].length < RAND) {
      teile.splice(teile.length - 2, 2, teile[teile.length - 2] + teile[teile.length - 1]);
    }
    return teile.join(WEICH);
  });
}

/** Reiner Text (Kurztexte, Titel). */
export function trennen(text: string | null | undefined, mindestLaenge = 6): string {
  if (!text) return '';
  return raenderPruefen(hyphenateSync(text, { hyphenChar: WEICH, minWordLength: mindestLaenge }));
}

/** HTML aus der Redaktion — Tags und Attribute bleiben unangetastet
    (weiche Trennstriche stehen nur in Textknoten, die Randprüfung
    fasst deshalb nur Wörter mit Trennstrich an). */
export function trennenHtml(html: string | null | undefined, mindestLaenge = 6): string {
  if (!html) return '';
  return raenderPruefen(hyphenateHTMLSync(html, { hyphenChar: WEICH, minWordLength: mindestLaenge }));
}

/** Überschriften: nur sehr lange Wörter, damit ein „Kieferorthopädie"
    nicht allein die Zeile sprengt — kurze bleiben ganz. */
export function trennenTitel(text: string | null | undefined): string {
  return trennen(text, 14);
}
