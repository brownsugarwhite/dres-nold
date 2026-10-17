/*
  Ein Bildschirmfoto einer gebauten Seite — zum schnellen Nachsehen.

    node tests/foto.mjs /dentosophie/ desktop ausgabe.png [--ganz] [--warten=1500]

  Größen: handy, tablet, desktop (tests/hilfen.mjs) oder z. B. 1024x768.
  `--ganz` fotografiert die ganze Seite statt nur des Fensters.
*/
import { serverStarten, browserStarten, seiteOeffnen, GROESSEN, RUHE_CSS, ruhigWerden } from './hilfen.mjs';

const [pfad = '/', groesse = 'desktop', datei = 'foto.png'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const ganz = process.argv.includes('--ganz');
const warten = Number(process.argv.find((a) => a.startsWith('--warten='))?.split('=')[1] ?? 1200);

const masse = GROESSEN[groesse] ?? (() => {
  const [width, height] = groesse.split('x').map(Number);
  return { width, height, deviceScaleFactor: 1 };
})();

const { adresse, schliessen } = await serverStarten();
const browser = await browserStarten();
const seite = await seiteOeffnen(browser, masse);
await seite.goto(adresse + pfad, { waitUntil: 'networkidle' });
await seite.waitForTimeout(warten);
await seite.addStyleTag({ content: RUHE_CSS });
await ruhigWerden(seite);
await seite.screenshot({ path: datei, fullPage: ganz, animations: 'disabled' });
await browser.close();
schliessen();
