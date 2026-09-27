/**
 * Sanftes Scrollen zu Sprungmarken auf derselben Seite.
 *
 * Ein Klick auf „Team", „Kontakt" oder „Öffnungszeiten" springt nicht,
 * sondern gleitet — mit Platz für die feste Kopfleiste. Zwei Ziele
 * sind besonders:
 *
 *   #oz_anchor  Die Sprechstunden fahren scrollgesteuert herein
 *               (Oeffnungszeiten.astro) — die Karte steht erst nach gut
 *               zwei Fensterhöhen still, mit voll ausgefahrenem Zipfel.
 *               Genau dorthin wird gescrollt: knapp vor den Punkt, an
 *               dem er sich wieder einzieht und die Leisten tauschen.
 *   #praxis     Begrüßung und Bilderband liegen auf dem Desktop ebenfalls
 *   #galerie    in dieser Karte — dort werden sie in eine Scrolltiefe
 *               umgerechnet (siehe `tiefeInKarte`), statt gemessen zu
 *               werden. Auf Handys stehen sie im Fluss hinter der Karte
 *               und werden normal gemessen.
 *   #start      Ganz nach oben.
 *
 * Astros Router übernimmt Klicks auf Verweise selbst; dieser Zuhörer
 * läuft in der Capture-Phase und ist damit vor ihm dran.
 */

import { OZ_RAST, ozStuetzstellen, ozAnteilFuer, ozTiefeAus } from './scrollwege';
import { KURVEN } from './easing';

/** Höhe der Kopfleiste — so viel Luft bleibt über dem Ziel */
const KOPFLEISTE = 80;
const LUFT = 16;

/** Scrolltiefe in Bildpunkten, bei der die Blase mit Zipfel steht —
    eine Spur vor dem Rastpunkt, damit die Leisten noch nicht tauschen */
const ozRuhe = () => ozTiefeAus(OZ_RAST - 0.01);

function zahl(stil: CSSStyleDeclaration, name: string): number {
  return parseFloat(stil.getPropertyValue(name));
}

/**
 * Sprungmarken INNERHALB der Einstiegskarte (Begrüßung, Bilderband).
 *
 * Sie stehen nicht einfach an einer Stelle im Dokument: Die Karte fährt
 * scrollgesteuert herein, ihre Teile sind also je nach Scrolltiefe
 * woanders. Gesucht ist deshalb die Scrolltiefe, bei der das Element
 * gerade unter der Kopfleiste steht.
 *
 * Gezeichnet liegt die Oberkante der Karte bei
 *     Fensterhöhe − Ruhelage − Kartenhöhe + Versatz
 * — daraus folgt der nötige Versatz, und `ozAnteilFuer` kehrt die
 * Bewegungskurve um.
 *
 * `null`, wenn die Karte nicht scrollgesteuert läuft (reduzierte
 * Bewegung) — dann steht sie ruhig im Fluss und wird normal gemessen.
 */
function tiefeInKarte(element: HTMLElement): number | null {
  const karte = document.querySelector<HTMLElement>('[data-ozblase]');
  if (!karte || !karte.contains(element)) return null;

  const stil = getComputedStyle(karte);
  const start = zahl(stil, '--oz-start');
  const laenge = zahl(stil, '--zipfel-laenge') || 154;
  const ruhe = zahl(getComputedStyle(document.documentElement), '--oz-ruhe');
  if (!Number.isFinite(start) || !Number.isFinite(ruhe)) return null;

  /* Abstand des Elements von der Oberkante der Karte */
  let oben = 0;
  for (let e: HTMLElement | null = element; e && e !== karte; e = e.offsetParent as HTMLElement | null) {
    oben += e.offsetTop;
  }

  const versatz = KOPFLEISTE + LUFT - (window.innerHeight - ruhe - karte.offsetHeight) - oben;
  return ozTiefeAus(ozAnteilFuer(versatz, ozStuetzstellen(start, laenge)));
}

function wenigerBewegung(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Sanft an eine Scrolltiefe gleiten — mit eigener Bewegung statt
 * `behavior: 'smooth'`: Das Gleiten des Browsers ist kurz und auf iOS
 * kaum zu sehen; die alte Seite scrollte langsamer und weicher (Florian,
 * 26. September 2026). Die Dauer wächst mit dem Weg (500 ms plus 0,35 ms
 * je Bildpunkt, höchstens 1,8 s), die Kurve ist ein weiches Ein- und
 * Ausschwingen. Wer währenddessen selbst scrollt, tippt oder eine Taste
 * drückt, übernimmt — die Bewegung bricht ab.
 */
let laufend = 0;
export function sanftScrollen(ziel: number): void {
  const start = window.scrollY;
  const weg = ziel - start;
  if (wenigerBewegung() || Math.abs(weg) < 2) { window.scrollTo(0, ziel); return; }

  const dauer = Math.min(1800, 500 + Math.abs(weg) * 0.35);
  const kennung = ++laufend;
  const beginn = performance.now();
  const ereignisse = ['wheel', 'touchstart', 'keydown', 'mousedown'];
  const abbrechen = () => { laufend++; };
  ereignisse.forEach((e) => window.addEventListener(e, abbrechen, { passive: true }));
  const aufraeumen = () => ereignisse.forEach((e) => window.removeEventListener(e, abbrechen));

  const schritt = (jetzt: number) => {
    if (kennung !== laufend) { aufraeumen(); return; }
    const t = Math.min(1, (jetzt - beginn) / dauer);
    window.scrollTo(0, start + weg * KURVEN.inOutCubic(t));
    if (t < 1) requestAnimationFrame(schritt);
    else aufraeumen();
  };
  requestAnimationFrame(schritt);
}

/** Scrolltiefe für eine Sprungmarke — oder null, wenn es sie nicht gibt */
export function zielTiefe(hash: string): number | null {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id || id === 'start') return 0;

  if (id === 'oz_anchor') {
    return document.getElementById('oz_anchor') ? ozRuhe() : null;
  }

  const element = document.getElementById(id);
  if (!element || element.getClientRects().length === 0) return null;
  return tiefeInKarte(element) ?? tiefeVon(element);
}

function tiefeVon(element: Element): number {
  const oben = window.scrollY + element.getBoundingClientRect().top - KOPFLEISTE - LUFT;
  return Math.max(0, Math.round(oben));
}

export function zuSprungmarke(hash: string, sofort = false): boolean {
  const tiefe = zielTiefe(hash);
  if (tiefe === null) return false;
  if (sofort) window.scrollTo(0, tiefe);
  else sanftScrollen(tiefe);
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

/* Wird eine Seite mit Sprungmarke aufgerufen (auch von einer Unterseite
   aus, etwa über einen Knopf `/#contact`), setzt der Browser das Ziel an
   die Oberkante — ohne Platz für die Kopfleiste; bei `#oz_anchor` landet
   er sogar am Dokumentanfang, weil die Blase dort noch nicht steht. Also
   nachsetzen, ohne Bewegung. */
function beimLaden() {
  if (location.hash) zuSprungmarke(location.hash, true);
}

document.addEventListener('astro:page-load', beimLaden);
