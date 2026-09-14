/**
 * Seitenwechsel — die Teile, die CSS allein nicht kann.
 *
 * 1. Die Karte setzt sich sofort in Bewegung. Früher hob sie sich erst
 *    220 ms lang ab (Schatten und leichte Vergrößerung), bevor der
 *    Wechsel begann — das wirkte wie ein Hüpfer mit anschließendem
 *    Sprung. Jetzt gibt es keinen Vorlauf und keinen Schatten: Es bleibt
 *    bei einer einzigen, sauberen Bewegung (styles/uebergaenge.css).
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
 * Nebenbei: `data-morph` kennzeichnet die eine Karte, die gerade morpht
 * — in beiden Richtungen. Nur sie gehört zur Übergangsgruppe „karte"
 * und liegt damit über den übrigen Karten. Trügen alle Kacheln die
 * Gruppe, läge die richtige beim Zurückmorphen wieder dazwischen.
 *
 * 4. Das Schließen-Kreuz bleibt beim Scrollen oben stehen; sobald es
 *    „klebt", zeichnet sich ein Kreis darum.
 */
import { navigate } from 'astro:transitions/client';

const MERKER = 'uebergang-ziel';

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

  /* Die angeklickte Karte kennzeichnen: Nur sie gehört zur
     Übergangsgruppe „karte" und liegt damit über ihren Nachbarn
     (styles/uebergaenge.css). */
  quelle?.closest?.('[data-karte]')?.setAttribute('data-morph', '');
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
  /* Auch beim Zurückmorphen muss die Zielkarte über ihren Nachbarn
     liegen. Dieses Kennzeichen wird noch vor der neuen Momentaufnahme
     gesetzt — `astro:after-swap` läuft innerhalb des Übergangs. */
  karte.setAttribute('data-morph', '');
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
  /* Aufräumen: Die Kennzeichen gelten nur für den einen Übergang. */
  for (const k of document.querySelectorAll('[data-morph]')) k.removeAttribute('data-morph');
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
