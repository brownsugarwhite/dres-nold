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
 * die Öffnungszeiten hereinfahren. Muss zu `--oz-weg` in
 * Oeffnungszeiten.astro passen.
 *
 * Seit dem 26. September 2026 deutlich kürzer (Desktop 4,8 → 4,2;
 * Handys 6,2 → 3,6): Die Karte soll früher kommen, auf Handys viel
 * früher (Florian). Damit sie das noch stehende Logo nicht überfährt,
 * löst sich das Logo schneller auf (Startbereich.astro, `LOGO_WEG`:
 * 1,1 bzw. 0,9 Fensterhöhen statt 1,5). Nachgerechnet: Die Oberkante
 * der Karte erreicht die Unterkante des Logos bei 1,16 (Desktop) bzw.
 * 1,13 Fensterhöhen (Handy) — das Logo ist dann seit 0,06 bzw. 0,23
 * Fensterhöhen fort. Der Schnalz liegt bei 3,06 bzw. 2,59 Fensterhöhen
 * (vorher 3,52 / 4,62). Wer eine der Zahlen ändert, rechnet die
 * andere nach (Skript in docs/entscheidungen.md, „Die Sprechstunden
 * kommen früher").
 *
 * Seit dem 27. September 2026 läuft der ganze Ablauf zusätzlich
 * `OZ_VORLAUF` (150 px) früher. Gemessen erreicht die Karte die
 * Unterkante des Logos dann 30 px (375 × 667) bis 330 px (1440 × 900)
 * Scrollweg, nachdem es ganz fort ist — sie schiebt sich also weiter
 * nie darüber.
 */
export function ozWeg(): number {
  return window.matchMedia('(max-width: 991px)').matches ? 3.6 : 4.2;
}

/**
 * Wie viele Bildpunkte früher der ganze Ablauf a-19 läuft, als der
 * Streifen allein ergäbe — Hereinfahren, Rast, Schnalz und Freigabe
 * rücken gemeinsam nach vorn (Florian, 27. September 2026: „150 px
 * früher ins Bild — es ist zu lange weiß, wenn sich das Logo
 * ausgezeichnet hat"). Geschwindigkeit und Wege bleiben, wie sie sind.
 * Muss zu `--oz-vorlauf` in Oeffnungszeiten.astro passen.
 */
export const OZ_VORLAUF = 150;

/** Fortschritt von Ablauf a-19 für einen Bereich, dessen Oberkante
    `oben` Bildpunkte unter dem Fensteroberrand steht — samt Vorlauf. */
export function ozFortschritt(oben: number): number {
  return beimScrollenSichtbar(ozWeg(), oben - OZ_VORLAUF);
}

/** Bei diesem Anteil von Ablauf a-19 steht die Blase mit voll
    ausgefahrenem Zipfel; genau hier schnalzt er zurück und die Leisten
    tauschen. Muss zu `--oz-ende` in Oeffnungszeiten.astro passen. */
export const OZ_RAST = 0.78;

/** Wie lange Schnalz und Leistenwechsel dauern. Ein Wert für beides:
    Der Zipfel zieht sich nicht mehr am Scrollweg ein, sondern schnalzt
    in genau der Zeit zurück, in der die Leisten tauschen — das ist es,
    was den Schnalz ausmacht (Florian, 18. September 2026). Der Wert
    steht auch in Navigation.astro als CSS-Übergang (300 ms easeOut). */
export const SCHNALZ_DAUER = 300;

/**
 * Scrolltiefe (in Fensterhöhen), ab der die Leisten tauschen.
 *
 * In der Vorlage hing das an einem eigenen Streifen (`.trigger-schnalz`);
 * gefühlt geschah es in dem Moment, in dem der Zipfel zu verschwinden
 * beginnt. Genau daran hängt es jetzt: am Ende der Raststellung von
 * Ablauf a-19, umgerechnet in Scrolltiefe (siehe beimScrollenSichtbar).
 */
export function schnalzWeg(): number {
  return OZ_RAST * (ozWeg() + 1) - 1 - OZ_VORLAUF / window.innerHeight;
}

/**
 * Die Schlüsselstellen von Ablauf a-19 — wie weit die Blase zu einem
 * Anteil des Ablaufs noch unter ihrer Ruhelage steht.
 *
 *   bei 30 %   y = Startwert    Kurve easeIn   ⟶ holt Schwung
 *   bei 61 %   y = Zipfellänge  Kurve outCubic ⟶ bremst ab
 *   bei 78 %   y = 0            — steht, Zipfel voll ausgefahren
 *
 * Die ersten 30 % sind eine Wartezeit: In ihr löst sich das Logo des
 * Startbereichs auf (Ablauf a-7, die ersten 10 % des Dokuments,
 * gedeckelt auf anderthalb Fensterhöhen). Erst danach setzt sich die
 * Karte in Bewegung — sonst schöbe sich ihre weiße Fläche über das noch
 * stehende Logo (Florian, 18. September 2026). Der Scrollweg ist um
 * genau diese Wartezeit länger als vorher (3,5 → 4,8 Fensterhöhen;
 * mobil 4,5 → 6,2 — seit dem 26. September 2026 wieder kürzer, siehe
 * `ozWeg`); Anfahrt, Bremsweg und Schnalzen dauern unverändert so
 * lange wie zuvor.
 *
 * Die Wartezeit war zuerst 35 % — da war das Logo schon ganz fort,
 * wenn die Begrüßung kam. Jetzt setzt sich die Karte bei 30 % in
 * Bewegung: Sie kommt herauf, während sich das Logo auflöst, und
 * schiebt sich trotzdem nie darüber (Florian, 18. September 2026).
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
    { bei: 0.30, wert: start, kurve: 'easeIn' },
    { bei: 0.61, wert: zipfellaenge, kurve: 'outCubic' },
    { bei: 0.78, wert: 0, kurve: 'linear' },
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
  return Math.max(0, Math.round((p * (ozWeg() + 1) - 1) * window.innerHeight - OZ_VORLAUF));
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

/**
 * Anteil, zu dem ein Element den Blickbereich durchlaufen hat (0 … 1) —
 * gezählt wie Webflows „while scrolling in view": 0 %, wenn die
 * Oberkante unten ins Fenster tritt, 100 %, wenn die Unterkante oben
 * hinausläuft.
 *
 * Steht hier, weil drei Stellen damit rechnen: die Beitragsbilder und
 * das Gruppenfoto (Ablauf a-3) — und der Seitenwechsel, der wissen
 * muss, wie weit ein Bild gerade vergrößert IST, bevor er es morpht
 * (scripts/uebergaenge.ts).
 */
export function durchlauf(el: Element): number {
  const r = el.getBoundingClientRect();
  const weg = window.innerHeight + r.height;
  if (weg <= 0) return 0;
  return Math.min(1, Math.max(0, (window.innerHeight - r.top) / weg));
}

/** Ablauf a-3: Über den Scrollweg wächst das Bild um diesen Anteil.
    Die Vorlage hat 0,1; seit dem 27. September 2026 etwas kräftiger
    (Florian: „alle Animationen etwas verstärken"). */
export const A3_ZUWACHS = 0.15;

/** Rückt `wert` um einen Zeitschritt in Richtung `ziel`. */
export function nachziehen(wert: number, ziel: number, dt: number, rest = REST): number {
  const schritt = 1 - Math.pow(rest, dt / (1000 / 60));
  return wert + (ziel - wert) * schritt;
}
