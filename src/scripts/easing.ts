/**
 * Bewegungskurven, wie Webflow sie verwendet.
 *
 * Wird gebraucht, um scrollgebundene Abläufe der alten Seite exakt
 * nachzubilden: Dort trägt jeder Abschnitt zwischen zwei Schlüsselstellen
 * seine eigene Kurve.
 */

/** Auswertung einer kubischen Bézierkurve — dieselbe Mathematik wie CSS. */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const A = (a: number, b: number) => 1 - 3 * b + 3 * a;
  const B = (a: number, b: number) => 3 * b - 6 * a;
  const C = (a: number) => 3 * a;
  const wert = (t: number, a: number, b: number) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
  const steigung = (t: number, a: number, b: number) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    // Newton-Verfahren: t suchen, dessen x-Wert dem gesuchten entspricht
    let t = x;
    for (let i = 0; i < 8; i++) {
      const s = steigung(t, x1, x2);
      if (s === 0) break;
      t -= (wert(t, x1, x2) - x) / s;
    }
    return wert(t, y1, y2);
  };
}

/** Die Kurven, die in den Abläufen der Vorlage vorkommen. */
export const KURVEN: Record<string, (x: number) => number> = {
  linear: (x) => x,
  ease: bezier(0.25, 0.1, 0.25, 1),
  easeIn: bezier(0.42, 0, 1, 1),
  easeOut: bezier(0, 0, 0.58, 1),
  easeInOut: bezier(0.42, 0, 0.58, 1),
  inCubic: bezier(0.55, 0.055, 0.675, 0.19),
  outCubic: bezier(0.215, 0.61, 0.355, 1),
  inOutCubic: bezier(0.645, 0.045, 0.355, 1),
  /* Dieselbe Kurve wie `--verlauf-betont` in styles/tokens.css — dort
     mitziehen, wenn sie sich ändert. Für Bewegungen, die das Skript
     Bild für Bild rechnet (die Blase der Navigation). */
  betont: bezier(0.22, 0.61, 0.24, 1),
};

export type Stuetzstelle = {
  /** Anteil des Scrollwegs, 0 … 1 */
  bei: number;
  /** Zielwert an dieser Stelle */
  wert: number;
  /** Kurve für den Weg VON dieser Stelle zur nächsten (wie in Webflow) */
  kurve?: keyof typeof KURVEN;
};

/**
 * Wert an einer Scrollposition, abschnittsweise mit eigener Kurve —
 * genau wie Webflow scrollgebundene Abläufe auswertet.
 */
export function ausStuetzstellen(p: number, stellen: Stuetzstelle[]): number {
  if (p <= stellen[0].bei) return stellen[0].wert;
  for (let i = 0; i < stellen.length - 1; i++) {
    const a = stellen[i];
    const b = stellen[i + 1];
    if (p <= b.bei) {
      const anteil = (p - a.bei) / (b.bei - a.bei);
      const kurve = KURVEN[a.kurve ?? 'linear'] ?? KURVEN.linear;
      return a.wert + kurve(anteil) * (b.wert - a.wert);
    }
  }
  return stellen[stellen.length - 1].wert;
}
