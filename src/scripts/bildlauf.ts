/**
 * Ablauf a-3: Bilder wachsen über den Scrollweg.
 *
 * Alles mit `data-bildlauf` bekommt `--bild-groesse`: 1, wenn die
 * Oberkante unten ins Fenster tritt, 1 + A3_ZUWACHS, wenn die Unterkante
 * oben hinausläuft — dieselbe Bewegung wie beim Gruppenfoto im Team.
 * Das CSS der Komponente setzt `transform: scale(var(--bild-groesse))`
 * auf den Läufer und schneidet am Rahmen darum ab.
 *
 * Der gezeichnete Wert läuft dem Scrollwert nach (Webflow „smoothing"),
 * sonst wirkt die Vergrößerung hart am Scrollrad festgeschraubt.
 *
 * Bis zum 27. September 2026 stand das nur in Neuigkeiten.astro; seit
 * dem Wunsch, dass alle Bilder — auch die der eigenen Abschnitte — so
 * laufen, ist es hier ein gemeinsames Skript (Florian).
 */
import { nachziehen, durchlauf, A3_ZUWACHS } from './scrollwege';

const bilder: HTMLElement[] = [];
const werte = new Map<HTMLElement, number>();
let laeuft = false;
let zuletzt = 0;
let angemeldet = false;

const zeichnen = () => {
  for (const el of bilder) {
    const p = werte.get(el) ?? 0;
    el.style.setProperty('--bild-groesse', (1 + A3_ZUWACHS * p).toFixed(4));
  }
};

const schritt = (jetzt: number) => {
  const dt = zuletzt ? Math.min(100, jetzt - zuletzt) : 16.7;
  zuletzt = jetzt;

  let fertig = true;
  for (const el of bilder) {
    const z = durchlauf(el);
    let w = nachziehen(werte.get(el) ?? z, z, dt);
    if (Math.abs(z - w) < 0.0005) w = z;
    else fertig = false;
    werte.set(el, w);
  }
  zeichnen();

  if (fertig) laeuft = false;
  else requestAnimationFrame(schritt);
};

const anstossen = () => {
  if (laeuft) return;
  laeuft = true;
  zuletzt = 0;
  requestAnimationFrame(schritt);
};

/** Neue Läufer aufnehmen — beim Laden und nach jedem Seitenwechsel. */
export function bildlaufAufbauen(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* Nach einem Seitenwechsel sind die alten Elemente fort */
  for (let i = bilder.length - 1; i >= 0; i--) {
    if (!bilder[i].isConnected) { werte.delete(bilder[i]); bilder.splice(i, 1); }
  }

  const neue = [...document.querySelectorAll<HTMLElement>('[data-bildlauf]:not([data-bereit])')];
  for (const el of neue) {
    el.dataset.bereit = 'ja';
    bilder.push(el);
    /* Ohne Nachlauf auf den Stand springen, den die Seite gerade hat */
    werte.set(el, durchlauf(el));
  }
  zeichnen();

  if (!angemeldet) {
    angemeldet = true;
    window.addEventListener('scroll', anstossen, { passive: true });
    window.addEventListener('resize', anstossen, { passive: true });
  }
}

bildlaufAufbauen();
document.addEventListener('astro:page-load', bildlaufAufbauen);
