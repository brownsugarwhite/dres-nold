/**
 * Einträge einer Liste per Ziehen umsortieren — mit Maus, Finger oder
 * Stift (Pointer-Events; das Ziehen und Ablegen von HTML kann der Finger
 * auf iPhone und iPad nicht).
 *
 * Gezogen wird am Griff (⠿). Der Eintrag rückt dabei Schritt für Schritt
 * an die Stelle unter dem Zeiger; losgelassen bleibt er dort. Feste
 * Einträge (Startbereich, Sprechstunden, Fuß) bleiben stehen.
 *
 * Ziehen ist nie der einzige Weg: Jeder Eintrag hat daneben ▲ und ▼
 * (WCAG 2.5.7, „Ziehbewegungen") — die Tastatur und Vorleseprogramme
 * kommen nur so an die Reihenfolge.
 */
import { ansagen } from './werkzeug';

export interface SortierOptionen {
  /** Auswahl der Einträge innerhalb der Liste (direkte Kinder) */
  eintrag: string;
  /** Auswahl des Griffs innerhalb eines Eintrags */
  griff: string;
  /** Feste Einträge, die nicht verschoben werden */
  fest?: (e: HTMLElement) => boolean;
  /** Wie der Eintrag heißt — für die Ansage „… steht jetzt an Stelle 3" */
  name: (e: HTMLElement) => string;
  /** Nach jeder Verschiebung */
  verschoben: () => void;
}

const beweglich = (liste: HTMLElement, o: SortierOptionen) =>
  [...liste.children].filter((k): k is HTMLElement => k instanceof HTMLElement && k.matches(o.eintrag) && !o.fest?.(k));

function stelleAnsagen(liste: HTMLElement, eintrag: HTMLElement, o: SortierOptionen) {
  const alle = beweglich(liste, o);
  ansagen(`${o.name(eintrag)} steht jetzt an Stelle ${alle.indexOf(eintrag) + 1} von ${alle.length}.`);
}

/** Einen Schritt nach oben (−1) oder unten (+1) — für ▲ und ▼ */
export function schieben(liste: HTMLElement, eintrag: HTMLElement, richtung: -1 | 1, o: SortierOptionen): void {
  const alle = beweglich(liste, o);
  const i = alle.indexOf(eintrag);
  const ziel = alle[i + richtung];
  if (!ziel) return;
  if (richtung < 0) liste.insertBefore(eintrag, ziel);
  else liste.insertBefore(ziel, eintrag);
  o.verschoben();
  stelleAnsagen(liste, eintrag, o);
}

export function sortierbar(liste: HTMLElement, o: SortierOptionen): void {
  liste.addEventListener('pointerdown', (e) => {
    const griff = (e.target as Element).closest<HTMLElement>(o.griff);
    if (!griff || e.button > 0) return;
    const eintrag = griff.closest<HTMLElement>(o.eintrag);
    if (!eintrag || eintrag.parentElement !== liste || o.fest?.(eintrag)) return;
    e.preventDefault();
    griff.setPointerCapture(e.pointerId);
    eintrag.dataset.zieht = '';
    const vorher = beweglich(liste, o).indexOf(eintrag);

    const bewegen = (ev: PointerEvent) => {
      const y = ev.clientY;
      // Am Fensterrand weiterrollen
      if (y < 70) window.scrollBy(0, -12);
      else if (y > innerHeight - 70) window.scrollBy(0, 12);
      const andere = beweglich(liste, o).filter((k) => k !== eintrag);
      const danach = andere.find((k) => {
        const r = k.getBoundingClientRect();
        return y < r.top + r.height / 2;
      });
      if (danach) {
        if (eintrag.nextElementSibling !== danach) liste.insertBefore(eintrag, danach);
      } else {
        const letzter = andere.at(-1);
        if (letzter && letzter.nextElementSibling !== eintrag) letzter.after(eintrag);
      }
    };
    const ende = () => {
      griff.removeEventListener('pointermove', bewegen);
      griff.removeEventListener('pointerup', ende);
      griff.removeEventListener('pointercancel', ende);
      delete eintrag.dataset.zieht;
      if (beweglich(liste, o).indexOf(eintrag) !== vorher) {
        o.verschoben();
        stelleAnsagen(liste, eintrag, o);
      }
    };
    griff.addEventListener('pointermove', bewegen);
    griff.addEventListener('pointerup', ende);
    griff.addEventListener('pointercancel', ende);
  });
}
