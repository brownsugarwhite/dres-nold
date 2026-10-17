/*
  Vergleichsaufnahmen und Messungen der gebauten Seite.

    npm run build
    node tests/aufnahmen.mjs tests/aufnahmen/vorher     # Ausgangsstand
    … ändern, bauen …
    node tests/aufnahmen.mjs tests/aufnahmen/nachher
    node tests/vergleichen.mjs tests/aufnahmen/vorher tests/aufnahmen/nachher

  Schreibt je Größe Bildschirmfotos (Startseite an jeder Sprungmarke,
  Sprechstunden-Karte in Ruhe, Menüs, Unterseiten) und `messungen.json`
  mit der Lage der Zipfelspitze, der Knopfmitte und der Menüreihenfolge.
  Die Aufnahmen selbst sind git-ignoriert.
*/
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { serverStarten, browserStarten, seiteOeffnen, GROESSEN, RUHE_CSS, ruhigWerden } from './hilfen.mjs';

const ziel = process.argv[2] ?? 'tests/aufnahmen/aktuell';
const nur = process.argv[3]; // optional: eine Größe

const MARKEN = ['praxis', 'galerie', 'leistungen', 'neuigkeiten', 'team', 'stellen', 'contact'];

const { adresse, schliessen } = await serverStarten();
const browser = await browserStarten();
const messungen = {};

/** Spitze des Zipfels und Mitte des Sprechstunden-Knopfs, in Fensterkoordinaten */
async function zipfelMessen(seite) {
  return seite.evaluate(() => {
    const svg = document.querySelector('[data-ozzipfel]');
    const kontur = document.querySelector('[data-ozkontur]');
    const knopf = [...document.querySelectorAll('.fussknopf[data-punkt="zeiten"]')].find(
      (k) => k.getBoundingClientRect().width > 0,
    );
    if (!svg || !kontur || !knopf) return null;
    const zahlen = (kontur.getAttribute('d') || '').match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
    if (zahlen.length < 10) return null;
    const s = svg.getBoundingClientRect();
    const k = knopf.getBoundingClientRect();
    const leiste = knopf.closest('.fussleiste, .fussleiste-huelle, nav')?.getBoundingClientRect();
    return {
      spitze: { x: +(s.left + zahlen[4]).toFixed(1), y: +(s.top + zahlen[5]).toFixed(1) },
      basisLinks: +(s.left + zahlen[2]).toFixed(1),
      basisRechts: +(s.left + zahlen[6]).toFixed(1),
      knopfMitte: +(k.left + k.width / 2).toFixed(1),
      leisteOben: leiste ? +leiste.top.toFixed(1) : null,
    };
  });
}

/** Reihenfolge der Punkte in jeder sichtbaren Leiste */
async function menueLesen(seite) {
  return seite.evaluate(() => {
    const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();
    const sichtbar = (el) => el.getBoundingClientRect().width > 0;
    return {
      kopf: [...document.querySelectorAll('.kopfleiste .menuepunkt')]
        .filter(sichtbar).map((e) => text(e.querySelector('.menuepunkt__text') ?? e)),
      fuss: [...document.querySelectorAll('.fussknopf')].filter(sichtbar).map((e) => e.dataset.punkt || text(e)),
      handy: [...document.querySelectorAll('.mobilmenue__punkt')].map(text),
    };
  });
}

for (const [name, groesse] of Object.entries(GROESSEN)) {
  if (nur && nur !== name) continue;
  const ordner = join(ziel, name);
  await mkdir(ordner, { recursive: true });
  const seite = await seiteOeffnen(browser, groesse);
  const foto = async (datei) => {
    await seite.addStyleTag({ content: RUHE_CSS });
    await ruhigWerden(seite);
    await seite.screenshot({ path: join(ordner, `${datei}.png`), animations: 'disabled' });
  };
  messungen[name] = {};

  // Erster Aufbau: Logo zeichnet sich ein
  await seite.goto(`${adresse}/`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(3500);
  await foto('00-start');

  // Sprechstunden-Karte in Ruhe (Zipfel ausgefahren)
  // Der Knopf scrollt sanft genau dorthin, wo die Karte mit Zipfel ruht
  await seite.locator('.fussknopf[data-punkt="zeiten"]:visible').first().click();
  await seite.waitForTimeout(2600);
  messungen[name].zipfel = await zipfelMessen(seite);
  messungen[name].menue = await menueLesen(seite);
  await foto('01-sprechstunden');

  for (const [i, marke] of MARKEN.entries()) {
    await seite.goto(`${adresse}/#${marke}`, { waitUntil: 'networkidle' });
    await seite.waitForTimeout(900);
    await foto(`${String(i + 2).padStart(2, '0')}-${marke}`);
  }

  // Menüs
  await seite.goto(`${adresse}/#team`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(600);
  messungen[name].menueOben = await menueLesen(seite);
  if (groesse.width < 992) {
    const knopf = seite.locator('[data-menueknopf], .menueknopf').first();
    if (await knopf.count()) {
      await knopf.click();
      await seite.waitForTimeout(900);
      await foto('20-menue');
      const leistungen = seite.locator('[data-mobilleistungen]').first();
      if (await leistungen.count()) {
        await leistungen.click();
        await seite.waitForTimeout(900);
        await foto('21-menue-ebene');
      }
    }
  } else {
    const punkt = seite.locator('.kopfleiste [aria-controls="leistungsmenue"]').first();
    if (await punkt.count()) {
      await punkt.hover();
      await seite.waitForTimeout(900);
      await foto('20-aufklappmenue');
    }
  }

  // Unterseiten
  await seite.goto(`${adresse}/leistungen/prophylaxe/`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(600);
  await foto('30-leistung');
  await seite.goto(`${adresse}/neuigkeiten/praxis-bleibt-erreichbar/`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(600);
  await foto('31-beitrag');

  await seite.context().close();
}

await writeFile(join(ziel, 'messungen.json'), JSON.stringify(messungen, null, 2) + '\n');
console.log(JSON.stringify(messungen, null, 2));
await browser.close();
schliessen();
