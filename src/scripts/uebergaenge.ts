/**
 * Seitenwechsel — die Teile, die CSS allein nicht kann.
 *
 * 1. Abheben: Die geklickte Karte hebt sich ab, BEVOR die Zielseite
 *    eingetauscht wird. Das alte Abbild zeigt dann die abgehobene Karte,
 *    aus der heraus die Seite wächst. Damit das auch bei blitzschnellem
 *    Laden sichtbar ist, wartet der Wechsel kurz auf die Bewegung.
 *
 * 2. Zurück: Der Schließen-Knopf, der Verweis „Alle Leistungen" und die
 *    Escape-Taste gehen im Verlauf zurück, wenn der vorige Eintrag von
 *    dieser Seite stammt — dann läuft der Übergang rückwärts und die
 *    alte Scrollposition steht wieder. Kam der Besucher von außen
 *    (Google, geteilter Link), führt der Verweis normal zur Übersicht.
 *
 * Astro merkt sich in `history.state.index`, der wievielte Eintrag
 * innerhalb dieser Seite gerade offen ist; 0 heißt „von außen gekommen".
 */
import { navigate } from 'astro:transitions/client';

const ABHEBE_DAUER = 220; // ms — siehe `[data-gehoben]` in LeistungKachel/Neuigkeiten

const pause = (ms: number) => new Promise<void>((f) => setTimeout(f, ms));

document.addEventListener('astro:before-preparation', (ereignis) => {
  const e = ereignis as Event & {
    sourceElement?: Element | null;
    loader: () => Promise<void>;
    direction: string;
  };
  const karte = e.sourceElement?.closest?.('[data-karte]');
  if (!karte) return;

  karte.setAttribute('data-gehoben', '');

  const laden = e.loader;
  const start = performance.now();
  e.loader = async () => {
    await laden();
    const rest = ABHEBE_DAUER - (performance.now() - start);
    if (rest > 0) await pause(rest);
  };
});

/** Zurück im Verlauf — oder zur angegebenen Adresse, wenn es keinen gibt. */
function zurueck(ersatz: string) {
  const zustand = history.state as { index?: number } | null;
  if (zustand && typeof zustand.index === 'number' && zustand.index > 0) {
    history.back();
  } else {
    navigate(ersatz);
  }
}

document.addEventListener('click', (e) => {
  const ziel = e.target as Element | null;
  const verweis = ziel?.closest?.<HTMLAnchorElement>('a[data-zurueck]');
  if (!verweis || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  zurueck(verweis.href);
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || e.defaultPrevented) return;
  const verweis = document.querySelector<HTMLAnchorElement>('a[data-zurueck]');
  if (!verweis) return;
  /* Offene Menüs oder Dialoge haben Vorrang */
  if (document.querySelector('[aria-expanded="true"]')) return;
  zurueck(verweis.href);
});
