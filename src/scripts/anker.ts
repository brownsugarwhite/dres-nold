/**
 * Sanftes Scrollen zu Sprungmarken auf derselben Seite.
 *
 * Ein Klick auf „Team", „Kontakt" oder „Öffnungszeiten" springt nicht,
 * sondern gleitet — mit Platz für die feste Kopfleiste. Zwei Ziele
 * sind besonders:
 *
 *   #oz_anchor  Die Öffnungszeiten. Auf dem Desktop fahren sie
 *               scrollgesteuert herein (Oeffnungszeiten.astro) — die
 *               Blase steht erst nach gut zwei Fensterhöhen still, mit
 *               voll ausgefahrenem Zipfel. Genau dorthin wird gescrollt.
 *               Auf Handys stehen sie fest im Inhalt (`#sprechstunden`).
 *   #start      Ganz nach oben.
 *
 * Astros Router übernimmt Klicks auf Verweise selbst; dieser Zuhörer
 * läuft in der Capture-Phase und ist damit vor ihm dran.
 */

/** Höhe der Kopfleiste — so viel Luft bleibt über dem Ziel */
const KOPFLEISTE = 80;
const LUFT = 16;

/* Der Punkt, an dem die Blase mit ausgefahrenem Zipfel steht: bei 71 %
   von Ablauf a-19, gezählt über 350vh + 100vh (scripts/scrollwege.ts) */
const OZ_RUHE = 0.71 * 4.5 - 1;

function wenigerBewegung(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Scrolltiefe für eine Sprungmarke — oder null, wenn es sie nicht gibt */
export function zielTiefe(hash: string): number | null {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id || id === 'start') return 0;

  if (id === 'oz_anchor') {
    const blase = document.getElementById('oz_anchor');
    const fest = document.getElementById('sprechstunden');
    if (blase && blase.getClientRects().length > 0) return Math.round(OZ_RUHE * window.innerHeight);
    if (fest) return tiefeVon(fest);
    return null;
  }

  const element = document.getElementById(id);
  if (!element || element.getClientRects().length === 0) return null;
  return tiefeVon(element);
}

function tiefeVon(element: Element): number {
  const oben = window.scrollY + element.getBoundingClientRect().top - KOPFLEISTE - LUFT;
  return Math.max(0, Math.round(oben));
}

export function zuSprungmarke(hash: string, sofort = false): boolean {
  const tiefe = zielTiefe(hash);
  if (tiefe === null) return false;
  window.scrollTo({ top: tiefe, behavior: sofort || wenigerBewegung() ? 'instant' as ScrollBehavior : 'smooth' });
  return true;
}

document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  const verweis = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href]');
  if (!verweis || !verweis.hash) return;
  const ziel = new URL(verweis.href, location.href);
  if (ziel.origin !== location.origin || ziel.pathname !== location.pathname) return;

  if (!zuSprungmarke(ziel.hash)) return;
  /* Nur den Sprung unterbinden — die übrigen Zuhörer (etwa das
     Schließen des Handy-Menüs) sollen den Klick noch bekommen. Astros
     Router lässt Klicks mit `defaultPrevented` in Ruhe. */
  e.preventDefault();
  /* Adresse mitführen, ohne einen neuen Verlaufseintrag anzulegen —
     Astros Router verwaltet den Verlauf selbst. */
  try { history.replaceState(history.state, '', ziel.hash); } catch { /* egal */ }
}, true);

/* Wird die Startseite mit `#oz_anchor` aufgerufen (auch von einer
   Unterseite aus), landet der Browser am Dokumentanfang — die Blase
   ist dort noch nicht zu sehen. Also nachsetzen. */
function beimLaden() {
  if (location.hash === '#oz_anchor') zuSprungmarke(location.hash, true);
}

document.addEventListener('astro:page-load', beimLaden);
