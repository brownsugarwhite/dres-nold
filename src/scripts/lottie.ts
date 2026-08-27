/**
 * Lottie-Animationen — bewusst sparsam eingesetzt.
 *
 * Die Bibliothek wiegt rund 170 KB. Sie wird deshalb erst geladen, wenn
 * eine Animation tatsächlich sichtbar wird — und gar nicht, wenn der
 * Besucher im Betriebssystem reduzierte Bewegung eingestellt hat.
 *
 * Bis dahin (und dauerhaft ohne JavaScript) steht ein statisches Bild
 * an derselben Stelle. Die Seite ist also nie leer.
 */

type Spieler = {
  goToAndStop: (wert: number, istBild?: boolean) => void;
  playSegments: (bereich: [number, number], sofort?: boolean) => void;
  destroy: () => void;
  totalFrames: number;
};

const wenigerBewegung = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Lädt eine Lottie-Animation in ein Element.
 * Gibt null zurück, wenn sie nicht laufen soll oder das Laden scheitert.
 */
export async function ladeAnimation(
  behaelter: HTMLElement,
  pfad: string,
  optionen: { schleife?: boolean; automatisch?: boolean } = {},
): Promise<Spieler | null> {
  if (wenigerBewegung()) return null;

  try {
    const modul = await import('lottie-web/build/player/lottie_light');
    const lottie = modul.default ?? modul;

    const spieler = lottie.loadAnimation({
      container: behaelter,
      renderer: 'svg',
      loop: optionen.schleife ?? false,
      autoplay: optionen.automatisch ?? false,
      path: pfad,
    }) as Spieler;

    // Das statische Ersatzbild ausblenden, sobald die Animation steht
    behaelter.dataset.lottieBereit = 'ja';
    return spieler;
  } catch {
    // Kein Drama: das statische Bild bleibt einfach stehen.
    return null;
  }
}

/**
 * Führt eine Animation am Scrollfortschritt entlang —
 * für das Logo im Startbereich.
 */
export function anScrollKoppeln(
  spieler: Spieler,
  fortschritt: () => number,
): () => void {
  let geplant = false;

  const aktualisieren = () => {
    geplant = false;
    const p = Math.min(1, Math.max(0, fortschritt()));
    spieler.goToAndStop(p * (spieler.totalFrames - 1), true);
  };

  const beiScroll = () => {
    if (geplant) return;
    geplant = true;
    requestAnimationFrame(aktualisieren);
  };

  window.addEventListener('scroll', beiScroll, { passive: true });
  window.addEventListener('resize', beiScroll, { passive: true });
  aktualisieren();

  return () => {
    window.removeEventListener('scroll', beiScroll);
    window.removeEventListener('resize', beiScroll);
  };
}
