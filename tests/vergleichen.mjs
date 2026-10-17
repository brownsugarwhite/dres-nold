/*
  Vergleicht zwei Ordner mit Aufnahmen aus tests/aufnahmen.mjs Bild für
  Bild und meldet, wie viele Pixel sich unterscheiden. Für jedes
  abweichende Bild entsteht daneben eine Differenz (rot = anders).

    node tests/vergleichen.mjs tests/aufnahmen/vorher tests/aufnahmen/nachher
*/
import { readdir, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const [a, b] = process.argv.slice(2);
if (!a || !b) {
  console.error('Aufruf: node tests/vergleichen.mjs <vorher> <nachher>');
  process.exit(2);
}

/** Pixel mit einer Abweichung über dieser Schwelle (0–255 je Kanal) zählen */
const SCHWELLE = 24;

let abweichend = 0;
for (const groesse of await readdir(a)) {
  if (groesse.endsWith('.json')) continue;
  for (const datei of (await readdir(join(a, groesse))).filter((d) => d.endsWith('.png'))) {
    const pa = join(a, groesse, datei);
    const pb = join(b, groesse, datei);
    let bildA, bildB;
    try {
      bildA = await sharp(pa).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
      bildB = await sharp(pb).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    } catch {
      console.log(`fehlt   ${groesse}/${datei}`);
      abweichend++;
      continue;
    }
    if (bildA.info.width !== bildB.info.width || bildA.info.height !== bildB.info.height) {
      console.log(`Größe   ${groesse}/${datei}`);
      abweichend++;
      continue;
    }
    const { width, height } = bildA.info;
    const diff = Buffer.alloc(width * height * 4);
    let anders = 0;
    for (let i = 0; i < bildA.data.length; i += 4) {
      const d = Math.max(
        Math.abs(bildA.data[i] - bildB.data[i]),
        Math.abs(bildA.data[i + 1] - bildB.data[i + 1]),
        Math.abs(bildA.data[i + 2] - bildB.data[i + 2]),
      );
      if (d > SCHWELLE) {
        anders++;
        diff.set([220, 0, 60, 255], i);
      } else {
        const grau = Math.round(bildA.data[i] * 0.3 + 178);
        diff.set([grau, grau, grau, 255], i);
      }
    }
    const anteil = anders / (width * height);
    if (anders > 0) {
      abweichend++;
      const ordner = join(b, '_differenz', groesse);
      await mkdir(ordner, { recursive: true });
      await sharp(diff, { raw: { width, height, channels: 4 } }).png().toFile(join(ordner, datei));
    }
    console.log(`${anders ? 'anders ' : 'gleich '} ${groesse}/${datei}  ${(anteil * 100).toFixed(2)} %`);
  }
}
process.exit(abweichend ? 1 : 0);
