/**
 * Woher die Füllfläche eines Knopfes aufgeht.
 *
 * Die Fläche (`.kn__f`) ist ein Kreis, der beim Zeigen von `--x` / `--y`
 * aus aufgeht. Ohne Zutun stünde er immer in der Mitte; hier wird er an
 * die Stelle gesetzt, an der der Zeiger den Knopf betreten hat. Dadurch
 * wirkt der Knopf, als reagiere er auf die Bewegung — dieselbe Idee wie
 * bei den Symbolen, die sich zum Zeiger hin neigen.
 *
 * Ein einziger Zuhörer am Dokument, in der Capture-Phase: Er sieht auch
 * Knöpfe, die es beim Laden noch gar nicht gab (Redaktion, Akkordeons,
 * nachgeladene Seiten) — es muss nichts nachgerüstet werden.
 *
 * Tastaturbedienung braucht das nicht: Dort geht die Fläche aus der
 * Mitte auf, was für `:focus-visible` genau richtig ist.
 */

/** Setzt die Startstelle in Prozent der Knopffläche. */
function stelleSetzen(knopf: HTMLElement, x: number, y: number) {
  const r = knopf.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return;
  knopf.style.setProperty('--x', `${(((x - r.left) / r.width) * 100).toFixed(1)}%`);
  knopf.style.setProperty('--y', `${(((y - r.top) / r.height) * 100).toFixed(1)}%`);
}

function beiZeiger(e: PointerEvent) {
  /* Tastatur und Vorlesehilfen melden Klicks ohne echte Zeigerposition
     (Koordinaten 0/0) — die Mitte ist dort richtig. */
  if (e.clientX === 0 && e.clientY === 0) return;
  const knopf = (e.target as Element | null)?.closest?.<HTMLElement>('.kn');
  if (knopf) stelleSetzen(knopf, e.clientX, e.clientY);
}

document.addEventListener('pointerenter', beiZeiger, true);
document.addEventListener('pointerdown', beiZeiger, true);
