import { ausStuetzstellen, type Stuetzstelle } from './easing';

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

/**
 * Höhe von `.trigger-oz-scroll`, in Fensterhöhen — der Weg, über den
 * die Öffnungszeiten hereinfahren. Auf Handys länger (Florian, 14.
 * September 2026): Das Logo ist dort groß und braucht mehr Weg, um
 * sich aufzulösen, bevor die Blase darüberfährt. Muss zu `--oz-weg`
 * in Oeffnungszeiten.astro passen.
 */
export function ozWeg(): number {
  return window.matchMedia('(max-width: 991px)').matches ? 4.5 : 3.5;
}

/** Bei diesem Anteil von Ablauf a-19 steht die Blase mit voll
    ausgefahrenem Zipfel; unmittelbar danach zieht er sich ein. */
export const OZ_RAST = 0.71;

/**
 * Scrolltiefe (in Fensterhöhen), ab der die Leisten tauschen.
 *
 * In der Vorlage hing das an einem eigenen Streifen (`.trigger-schnalz`);
 * gefühlt geschah es in dem Moment, in dem der Zipfel zu verschwinden
 * beginnt. Genau daran hängt es jetzt: am Ende der Raststellung von
 * Ablauf a-19, umgerechnet in Scrolltiefe (siehe beimScrollenSichtbar).
 */
export function schnalzWeg(): number {
  return OZ_RAST * (ozWeg() + 1) - 1;
}

/**
 * Die Schlüsselstellen von Ablauf a-19 — wie weit die Blase zu einem
 * Anteil des Ablaufs noch unter ihrer Ruhelage steht.
 *
 *   bei 15 %   y = Startwert    Kurve easeIn   ⟶ holt Schwung
 *   bei 50 %   y = Zipfellänge  Kurve outCubic ⟶ bremst ab
 *   bei 71 %   y = 0            — steht, Zipfel voll ausgefahren
 *
 * Die Kurve gehört jeweils zu dem Abschnitt, der an dieser Stelle
 * BEGINNT — so wertet Webflow scrollgebundene Abläufe aus.
 *
 * Der Startwert hängt von der Höhe der Blase ab (sie muss zu Beginn
 * ganz unterhalb stehen) und wird deshalb übergeben; die Komponente
 * veröffentlicht ihn zusätzlich als `--oz-start`, damit auch
 * scripts/anker.ts damit rechnen kann.
 */
export function ozStuetzstellen(start: number, zipfellaenge: number): Stuetzstelle[] {
  return [
    { bei: 0.00, wert: start, kurve: 'linear' },
    { bei: 0.15, wert: start, kurve: 'easeIn' },
    { bei: 0.50, wert: zipfellaenge, kurve: 'outCubic' },
    { bei: 0.71, wert: 0, kurve: 'linear' },
    { bei: 1.00, wert: 0 },
  ];
}

/**
 * Die Umkehrung: Bei welchem Anteil des Ablaufs steht die Blase um
 * `ziel` Bildpunkte unter ihrer Ruhelage?
 *
 * Der Versatz fällt über den Ablauf monoton — deshalb genügt eine
 * binäre Suche. Sie ist hier die einfachere Lösung: Die Kurve
 * abschnittsweise umzukehren hieße, drei Bézierkurven zu invertieren.
 */
export function ozAnteilFuer(ziel: number, stellen: Stuetzstelle[]): number {
  let unten = 0;
  let oben = 1;
  for (let i = 0; i < 30; i++) {
    const mitte = (unten + oben) / 2;
    if (ausStuetzstellen(mitte, stellen) > ziel) unten = mitte;
    else oben = mitte;
  }
  return (unten + oben) / 2;
}

/** Scrolltiefe in Bildpunkten, bei der der Ablauf den Anteil `p` hat. */
export function ozTiefeAus(p: number): number {
  return Math.max(0, Math.round((p * (ozWeg() + 1) - 1) * window.innerHeight));
}

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
