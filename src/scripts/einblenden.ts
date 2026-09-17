/**
 * Einblenden beim Hereinscrollen.
 *
 * Alles mit `data-rein` fährt aus 18 px Tiefe an seinen Platz, sobald
 * es ins Bild kommt — einmal, nicht bei jedem Vorbeiscrollen.
 *
 * Wichtig für die Robustheit: Das Attribut steht im HTML leer da und
 * bedeutet dann nichts. Erst dieses Skript stellt es auf „warten" und
 * macht die Elemente damit unsichtbar. Ohne JavaScript — oder wenn das
 * Skript nicht lädt — bleibt also alles sichtbar, statt dass die halbe
 * Seite leer ist.
 *
 * Die Werte (0,8 s, 18 px, Schwelle 8 %) stammen aus dem Handoff.
 */

const RAND = '0px 0px -8% 0px';
const SCHWELLE = 0.08;

let beobachter: IntersectionObserver | null = null;

function einblendenAufbauen() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const neue = [...document.querySelectorAll<HTMLElement>('[data-rein=""]')];
  if (!neue.length) return;

  if (!beobachter) {
    beobachter = new IntersectionObserver((eintraege) => {
      for (const eintrag of eintraege) {
        if (!eintrag.isIntersecting) continue;
        (eintrag.target as HTMLElement).dataset.rein = 'da';
        beobachter?.unobserve(eintrag.target);
      }
    }, { rootMargin: RAND, threshold: SCHWELLE });
  }

  for (const el of neue) {
    /* Steht es beim Laden schon im Bild, soll es nicht erst
       hereinfahren — das sähe nach einem Ruckler aus. */
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      el.dataset.rein = 'da';
      continue;
    }
    el.dataset.rein = 'warten';
    beobachter.observe(el);
  }
}

einblendenAufbauen();
document.addEventListener('astro:page-load', einblendenAufbauen);
