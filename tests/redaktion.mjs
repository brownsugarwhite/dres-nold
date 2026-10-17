/*
  Prüft die Redaktion im Browser gegen das lokale Test-Backend
  (scripts/redaktion-lokal.mjs). Das Backend arbeitet auf einer Kopie
  der Inhalte — src/content bleibt unberührt.

    npm run build && node tests/redaktion.mjs
*/
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { WURZEL } from './hilfen.mjs';

const PORT = 4401;
const ADRESSE = `http://localhost:${PORT}`;
const backend = spawn('node', ['scripts/redaktion-lokal.mjs', '--kopie'], { cwd: WURZEL, env: { ...process.env, PORT: String(PORT) } });
await new Promise((fertig) => backend.stdout.on('data', (d) => { if (String(d).includes('Redaktion lokal')) fertig(); }));
const FOTOS = process.env.FOTOS ?? '';
let fehler = 0;
const pruefen = (ok, text, mehr = '') => {
  console.log(`${ok ? '✓' : '✗'} ${text}${mehr ? `  (${mehr})` : ''}`);
  if (!ok) fehler++;
};

const browser = await chromium.launch();
const seite = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
const meldungen = [];
seite.on('pageerror', (e) => meldungen.push(e.message));
seite.on('console', (m) => { if (m.type() === 'error') meldungen.push(m.text()); });
const foto = async (name) => { if (FOTOS) await seite.screenshot({ path: `${FOTOS}/${name}.png` }); };

await seite.goto(`${ADRESSE}/admin/`, { waitUntil: 'networkidle' });
await seite.waitForSelector('.plan__block');
const reihe = async () => seite.$$eval('.plan__block[data-id]', (e) => e.map((x) => x.dataset.id));
const vorher = await reihe();
pruefen(vorher[0] === 'willkommen' && vorher.includes('dentosophie'), 'Seitenplan zeigt die Blöcke', vorher.join(' · '));

// ▲ verschiebt Team nach oben; Menüvorschau folgt
await seite.locator('.plan__block[data-id="team"] .plan__schritt').first().click();
const nachher = await reihe();
pruefen(nachher.indexOf('team') === vorher.indexOf('team') - 1, '▲ verschiebt einen Block', nachher.join(' · '));
const menue = await seite.$$eval('.menuevorschau__punkt', (e) => e.map((x) => x.textContent.trim().replace(/▾.*/, '').trim()));
pruefen(menue.indexOf('Team') < menue.indexOf('Neuigkeiten'), 'Menüvorschau folgt der Reihenfolge', menue.join(' · '));
pruefen(await seite.$eval('[data-knopf]', (k) => !k.disabled), 'Veröffentlichen wird möglich');

// Ziehen: Team wieder hinter die Neuigkeiten
const griff = seite.locator('.plan__block[data-id="team"] .plan__griff');
const ziel = seite.locator('.plan__block[data-id="neuigkeiten"]');
const g = await griff.boundingBox();
const z = await ziel.boundingBox();
await seite.mouse.move(g.x + g.width / 2, g.y + g.height / 2);
await seite.mouse.down();
await seite.mouse.move(g.x + g.width / 2, z.y + z.height - 4, { steps: 8 });
await seite.mouse.up();
const gezogen = await reihe();
pruefen(gezogen.indexOf('team') > gezogen.indexOf('neuigkeiten'), 'Ziehen am Griff verschiebt', gezogen.join(' · '));

// Dentosophie öffnen, einen Abschnitt aufklappen, Textlink setzen
await seite.locator('.plan__block[data-id="dentosophie"] a').click();
await seite.waitForSelector('.teil');
await foto('redaktion-dentosophie');
const karte = seite.locator('.eintrag', { hasText: 'Die Mittelgesichtsregion' }).first();
await karte.locator('.eintrag__kopf').click();
const editor = karte.locator('.richtext__inhalt').first();
await editor.click();
await seite.keyboard.press('End');
await seite.keyboard.type(' Siehe auch');
await seite.keyboard.down('Shift');
for (let i = 0; i < 4; i++) await seite.keyboard.press('ArrowLeft');
await seite.keyboard.up('Shift');
await karte.locator('.richtext__leiste button', { hasText: 'Verweis …' }).click();
await seite.waitForSelector('dialog[open]');
await foto('redaktion-zieldialog');
await seite.locator('dialog .zielliste__punkt', { hasText: 'Kieferorthopädie für Kinder' }).click();
await seite.waitForTimeout(400);
const html = await editor.innerHTML();
pruefen(html.includes('href="/leistungen/kieferorthopaedie-kinder/"'), 'Textlink über den Ziel-Dialog gesetzt');
const zeile = await karte.locator('.richtext__ziel').textContent();
pruefen(/Leistungen › Kieferorthopädie für Kinder/.test(zeile ?? ''), 'Unter dem Feld steht, wohin der Verweis führt', zeile);

// Neuer Bereich
await seite.locator('.plan__neuknopf').click();
await seite.waitForSelector('dialog[open] .auswahlkarte');
await foto('redaktion-neuer-bereich');
await seite.locator('dialog .auswahlkarte', { hasText: 'Abschnitt auf der Startseite' }).click();
await seite.waitForSelector('dialog[open] #neu-titel');
await seite.fill('#neu-titel', 'Unser Labor');
await seite.locator('dialog .knopf--haupt', { hasText: 'Anlegen' }).click();
await seite.waitForURL(/#\/block\/unser-labor$/);
await seite.waitForSelector('.teil');
pruefen((await reihe()).includes('unser-labor'), 'Neuer Bereich steht im Seitenplan');

// Abschnitt hinzufügen: Kacheln
await seite.locator('.eintraege', { hasText: 'Abschnitte' }).locator('> .knopf', { hasText: 'Neuer Abschnitt' }).first().click();
await seite.waitForSelector('dialog[open] .auswahlkarte');
await seite.locator('dialog .auswahlkarte', { hasText: 'Kacheln' }).click();
await seite.waitForTimeout(400);
const kacheln = await seite.locator('.eintrag', { hasText: 'Kacheln' }).count();
pruefen(kacheln > 0, 'Abschnitt der Art „Kacheln" angelegt');

// Ohne Überschrift geht es nicht: lesbare Meldung statt Fehlercode
const ueberschrift = seite.getByRole('textbox', { name: 'Überschrift', exact: true }).first();
await ueberschrift.fill('');
await seite.waitForTimeout(500);
await seite.locator('[data-knopf]').click();
await seite.waitForTimeout(600);
const meldung = await seite.locator('[data-meldung]').textContent();
pruefen(/Bitte zuerst ergänzen/.test(meldung ?? '') && /Unser Labor|Nr\./.test(meldung ?? ''), 'Fehlende Überschrift wird verständlich gemeldet', meldung?.slice(0, 200));
await foto('redaktion-meldung');

await ueberschrift.fill('Unser Labor');
await seite.waitForTimeout(500);
await seite.locator('[data-knopf]').click();
await seite.waitForTimeout(1500);
const meldung2 = await seite.locator('[data-meldung]').textContent();
pruefen(/Gespeichert|Online/.test(meldung2 ?? ''), 'Veröffentlichen gelingt', meldung2?.slice(0, 200));
pruefen(await seite.$eval('[data-knopf]', (k) => k.disabled), 'Danach gibt es nichts mehr zu veröffentlichen');

// Neu laden: alles ist gespeichert
await seite.reload({ waitUntil: 'networkidle' });
await seite.waitForSelector('.plan__block');
pruefen((await reihe()).includes('unser-labor'), 'Nach dem Neuladen ist der neue Bereich da');

pruefen(meldungen.length === 0, 'Keine Fehler in der Konsole', meldungen.join(' | '));
await browser.close();
backend.kill();
console.log(fehler ? `\n${fehler} Prüfung(en) fehlgeschlagen` : '\nAlles in Ordnung.');
process.exit(fehler ? 1 : 0);
