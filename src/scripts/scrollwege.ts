/**
 * Die beiden unsichtbaren Auslöser der Vorlage.
 *
 * In Webflow liegen sie in `.trigger` — einem absolut gesetzten Kasten
 * am Dokumentanfang mit zwei 10 px schmalen Streifen nebeneinander:
 *
 *   .trigger-oz-scroll   350vh   steuert die Öffnungszeiten (Ablauf a-19)
 *   .trigger-schnalz     250vh   schaltet die Menüleisten um (a-26 / a-16)
 *
 * Beide beginnen ganz oben im Dokument. Die Höhen sind die der mobilen
 * Fassung — und die gilt bei uns auf allen Größen (docs/entscheidungen.md).
 */

/** Höhe von `.trigger-oz-scroll`, in Fensterhöhen. */
export const OZ_WEG = 3.5;

/** Höhe von `.trigger-schnalz`, in Fensterhöhen. */
export const SCHNALZ_WEG = 2.5;

/**
 * Fortschritt eines Webflow-Auslösers vom Typ „while scrolling in view".
 *
 * Webflow zählt 0 %, wenn die Oberkante des Streifens am unteren
 * Fensterrand steht, und 100 %, wenn seine Unterkante oben hinausläuft.
 * Der Weg ist also Streifenhöhe + Fensterhöhe lang.
 *
 * Weil der Streifen am Dokumentanfang beginnt, ist beim Laden bereits
 * ein Teil zurückgelegt: bei 350vh sind das 1 / 4,5 ≈ 22 %. Genau das
 * macht den Unterschied — die Bewegung startet nicht bei null.
 *
 * @param hoehe Höhe des Streifens in Fensterhöhen
 * @param oben  Abstand der Streifenoberkante vom Fensteroberrand
 */
export function beimScrollenSichtbar(hoehe: number, oben: number): number {
  const fenster = window.innerHeight;
  const weg = hoehe * fenster + fenster;
  if (weg <= 0) return 0;
  return Math.min(1, Math.max(0, (fenster - oben) / weg));
}

/**
 * Nachlauf, der Webflows Einstellung „smoothing: 70" nachempfindet:
 * der gezeichnete Wert folgt dem Scrollwert mit leichter Verzögerung.
 * Das ist es, was der Bewegung ihre Trägheit gibt.
 *
 * `REST` ist der Anteil des Abstands, der nach einer Sechzigstelsekunde
 * noch übrig ist. Kleiner = strenger am Scrollwert, größer = träger.
 * Nachempfunden, nicht aus Webflow abgeleitet — hier ist der eine Wert,
 * an dem sich das Gefühl einstellen lässt.
 */
export const REST = 0.7;

/** Rückt `wert` um einen Zeitschritt in Richtung `ziel`. */
export function nachziehen(wert: number, ziel: number, dt: number): number {
  const schritt = 1 - Math.pow(REST, dt / (1000 / 60));
  return wert + (ziel - wert) * schritt;
}
