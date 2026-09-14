/**
 * Seitenwechsel — die Teile, die CSS allein nicht kann.
 *
 * 1. Abheben: Die geklickte Karte hebt sich ab, BEVOR die Zielseite
 *    eingetauscht wird. Das alte Abbild zeigt dann die abgehobene Karte,
 *    aus der heraus die Seite wächst. Damit das auch bei blitzschnellem
 *    Laden sichtbar ist, wartet der Wechsel kurz auf die Bewegung.
 *
 * 2. Schließen: Schließen-Kreuz, „Alle Leistungen" und Escape führen zur
 *    Übersicht — so, dass die gerade offene Leistung dort mittig im
 *    Fenster steht. Das gilt auch, wenn man in der offenen Ansicht mit
 *    „Vorherige / Nächste" weitergeblättert hat: Die Seite morpht dann
 *    in die Karte der zuletzt gesehenen Leistung zurück.
 *
 * 3. Blättern: „Vorherige / Nächste" schiebt die Seiten seitlich
 *    durch (styles/uebergaenge.css, `html[data-uebergang]`).
 *
 * 4. Das Schließen-Kreuz bleibt beim Scrollen oben stehen; sobald es
 *    „klebt", zeichnet sich ein Kreis darum.
 */
import { navigate } from 'astro:transitions/client';

/* Nur so lang, dass der Schatten unter der Karte sichtbar wird. Früher
   waren es 220 ms mit einem Sprung auf scale(1.04) — das wirkte wie ein
   Hüpfer, dem dann die eigentliche Bewegung folgte. Jetzt ist das
   Abheben der Anfang derselben Bewegung. */
const ABHEBE_DAUER = 90; // ms — siehe `[data-gehoben]` in LeistungKachel/Neuigkeiten
const MERKER = 'uebergang-ziel';

const pause = (ms: number) => new Promise<void>((f) => setTimeout(f, ms));

type Vorbereitung = Event & {
  sourceElement?: Element | null;
  loader: () => Promise<void>;
  direction: string;
  to: URL;
};

document.addEventListener('astro:before-preparation', (ereignis) => {
  const e = ereignis as Vorbereitung;
  const quelle = e.sourceElement ?? null;

  /* Blättern: Richtung merken, bis der Wechsel vorbei ist */
  const blaettern = quelle?.closest?.('[data-blaettern]');
  if (blaettern) {
    document.documentElement.dataset.uebergang = blaettern.getAttribute('data-blaettern') || 'vor';
  }

  /* Abheben */
  const karte = quelle?.closest?.('[data-karte]');
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

/* Nach dem Tausch: die Karte der zuletzt offenen Leistung mittig
   stellen — noch bevor der Browser das neue Bild aufnimmt, damit der
   Morph dort endet, wo die Karte dann steht. */
document.addEventListener('astro:after-swap', () => {
  let ziel = '';
  try { ziel = sessionStorage.getItem(MERKER) || ''; sessionStorage.removeItem(MERKER); } catch { /* egal */ }
  if (!ziel) return;
  const karte = document.querySelector<HTMLElement>(`[data-karte][href="${ziel}"]`);
  if (!karte) return;
  const r = karte.getBoundingClientRect();
  const oben = window.scrollY + r.top - (window.innerHeight - r.height) / 2;
  window.scrollTo({ top: Math.max(0, oben), behavior: 'instant' as ScrollBehavior });
});

/* Astro tauscht beim Wechsel das ganze Dokument aus — die Richtung des
   Blätterns muss deshalb auch am NEUEN <html> stehen, sonst verlöre die
   hereinfahrende Seite mitten in der Bewegung ihre Regeln. */
document.addEventListener('astro:before-swap', (ereignis) => {
  const richtung = document.documentElement.dataset.uebergang;
  if (!richtung) return;
  const neu = (ereignis as Event & { newDocument: Document }).newDocument;
  neu.documentElement.dataset.uebergang = richtung;
});

document.addEventListener('astro:page-load', () => {
  delete document.documentElement.dataset.uebergang;
  schliessenKlebenLassen();
});

/** Zur Übersicht — die aktuelle Seite soll dort als Karte mittig stehen. */
function schliessen(verweis: HTMLAnchorElement) {
  try { sessionStorage.setItem(MERKER, location.pathname); } catch { /* egal */ }
  /* Ohne Anker: die Position setzt after-swap, ein Anker würde dazwischenfunken */
  const ziel = new URL(verweis.href);
  ziel.hash = '';
  navigate(ziel.pathname + ziel.search);
}

/* In der Capture-Phase, damit dieser Zuhörer VOR Astros eigenem
   Klick-Zuhörer dran ist — sonst navigiert Astro schon selbst und die
   Karte wird nicht mittig gestellt. */
document.addEventListener('click', (e) => {
  const ziel = e.target as Element | null;
  const verweis = ziel?.closest?.<HTMLAnchorElement>('a[data-zurueck]');
  if (!verweis || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  e.stopPropagation();
  schliessen(verweis);
}, true);

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || e.defaultPrevented) return;
  const verweis = document.querySelector<HTMLAnchorElement>('a[data-zurueck]');
  if (!verweis) return;
  /* Offene Menüs oder Dialoge haben Vorrang */
  if (document.querySelector('[aria-expanded="true"]')) return;
  schliessen(verweis);
});

/** Kreis um das Schließen-Kreuz, sobald es beim Scrollen oben klebt. */
function schliessenKlebenLassen() {
  const halter = document.querySelector<HTMLElement>('[data-schliessen-halter]');
  const wache = document.querySelector<HTMLElement>('[data-schliessen-wache]');
  if (!halter || !wache || halter.dataset.bereit) return;
  halter.dataset.bereit = 'ja';
  const oben = parseFloat(getComputedStyle(halter).top) || 0;
  const beobachter = new IntersectionObserver(([eintrag]) => {
    if (eintrag.isIntersecting) delete halter.dataset.klebt;
    else halter.dataset.klebt = 'ja';
  }, { rootMargin: `-${Math.round(oben) + 1}px 0px 0px 0px`, threshold: 0 });
  beobachter.observe(wache);
}

schliessenKlebenLassen();
