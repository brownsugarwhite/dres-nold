/**
 * Einwilligung für die Google-Maps-Karte.
 *
 * Die Seite lädt von sich aus nichts von fremden Servern. Einzige
 * Ausnahme ist die Karte im Kontaktbereich: Sie kommt von Google und
 * darf erst geladen werden, wenn der Besucher zugestimmt hat.
 *
 * Die Entscheidung wird nur im Browser des Besuchers gemerkt
 * (localStorage) — nichts wird an uns übertragen. Sie lässt sich über
 * „Datenschutz-Einstellungen" im Fußbereich jederzeit ändern.
 */

export type Einwilligung = {
  /** Google-Maps-Karte darf geladen werden */
  karte: boolean;
  /** Zeitpunkt der Entscheidung, JJJJ-MM-TT */
  datum: string;
};

const SCHLUESSEL = 'einwilligung';
export const EREIGNIS = 'einwilligung-geaendert';

export function lesen(): Einwilligung | null {
  try {
    const roh = localStorage.getItem(SCHLUESSEL);
    if (!roh) return null;
    const wert = JSON.parse(roh) as Partial<Einwilligung>;
    if (typeof wert.karte !== 'boolean') return null;
    return { karte: wert.karte, datum: wert.datum ?? '' };
  } catch {
    return null;
  }
}

export function setzen(karte: boolean): void {
  const wert: Einwilligung = { karte, datum: new Date().toISOString().slice(0, 10) };
  try {
    localStorage.setItem(SCHLUESSEL, JSON.stringify(wert));
  } catch {
    /* Privater Modus o. ä.: dann gilt die Entscheidung nur bis zum Neuladen */
  }
  document.dispatchEvent(new CustomEvent(EREIGNIS, { detail: wert }));
}

export function zuruecksetzen(): void {
  try {
    localStorage.removeItem(SCHLUESSEL);
  } catch {
    /* siehe oben */
  }
  document.dispatchEvent(new CustomEvent(EREIGNIS, { detail: null }));
}
