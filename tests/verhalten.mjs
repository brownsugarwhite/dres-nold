/*
  Prüft das Verhalten der gebauten Seite im Browser: Menü, Aufklappen,
  Sprünge, Ebenen im Handy-Menü, Zipfel. Meldet jede Prüfung mit ✓ oder ✗
  und endet mit Fehlercode, wenn etwas nicht stimmt.

    npm run build && node tests/verhalten.mjs
*/
import { serverStarten, browserStarten, seiteOeffnen } from './hilfen.mjs';

const { adresse, schliessen } = await serverStarten();
const browser = await browserStarten();
let fehler = 0;
const pruefen = (ok, text, mehr = '') => {
  console.log(`${ok ? '✓' : '✗'} ${text}${mehr ? `  (${mehr})` : ''}`);
  if (!ok) fehler++;
};

/** Lage einer Sprungmarke relativ zur Unterkante der Kopfleiste */
const markenLage = (seite, id) =>
  seite.evaluate((id) => document.getElementById(id)?.getBoundingClientRect().top ?? null, id);

/* ---------- Desktop ---------- */
{
  const seite = await seiteOeffnen(browser, 'desktop');
  await seite.goto(`${adresse}/#team`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(600);

  const reihe = await seite.$$eval('.kopfleiste__rechts .menuepunkt .menuepunkt__text:first-child', (e) => e.map((x) => x.textContent.trim()));
  const fuss = await seite.$$eval('.fussleiste__inhalt--gross .fussknopf', (e) => e.map((x) => x.dataset.punkt));
  pruefen(reihe[0] === 'Sprechstunden', 'Sprechstunden steht vorn im Menü', reihe.join(' · '));
  pruefen(fuss[0] === 'zeiten' && fuss.length === reihe.length, 'Symbolleiste in derselben Folge', fuss.join(' · '));

  // Überfahren: Dentosophie auf, dann Leistungen — nur eine Blase offen
  const dento = seite.locator('.kopfleiste [aria-controls="untermenue-oben-dentosophie"]');
  const leist = seite.locator('.kopfleiste [aria-controls="untermenue-oben-leistungen"]');
  await dento.hover();
  await seite.waitForTimeout(700);
  pruefen((await dento.getAttribute('aria-expanded')) === 'true', 'Dentosophie klappt beim Überfahren auf');
  const unter = await seite.$$eval('#untermenue-oben-dentosophie .oberpunkt__titel', (e) => e.map((x) => x.textContent.trim()));
  pruefen(unter.includes('Mundatmung und ihre Folgen'), 'Unterpunkte der Dentosophie', unter.join(' · '));
  pruefen(!(await seite.$('#untermenue-oben-dentosophie .oberpunkt__symbol')), 'Unterpunkte ohne Symbol');
  await leist.hover();
  await seite.waitForTimeout(700);
  const offen = await seite.$$eval('.kopfleiste [aria-expanded="true"]', (e) => e.length);
  pruefen(offen === 1 && (await leist.getAttribute('aria-expanded')) === 'true', 'Beim Wechsel ist nur eine Blase offen', `${offen} offen`);

  // Ausrichtung: Text der Unterpunkte beginnt unter dem Wort
  const ausrichtung = await seite.evaluate(() => {
    const wort = document.querySelector('[aria-controls="untermenue-oben-leistungen"] .menuepunkt__text').getBoundingClientRect().left;
    const text = document.querySelector('#untermenue-oben-leistungen .oberpunkt__titel').getBoundingClientRect().left;
    return Math.round(text - wort);
  });
  pruefen(Math.abs(ausrichtung) <= 14, 'Unterpunkte stehen unter dem Wort', `${ausrichtung} px`);

  // Unterpunkt auf eine andere Seite: Wechsel und Landung an der Marke
  await dento.hover();
  await seite.waitForTimeout(600);
  await seite.locator('#untermenue-oben-dentosophie .oberpunkt', { hasText: 'Indikationen' }).click();
  await seite.waitForURL(/\/dentosophie\/#indikationen$/);
  await seite.waitForTimeout(1200);
  const lage = await markenLage(seite, 'indikationen');
  pruefen(lage !== null && lage > 60 && lage < 140, 'Unterpunkt öffnet die Seite und landet an der Marke', `${lage} px`);

  // Unterpunkt auf derselben Seite: gleitet, ohne Seitenwechsel
  await seite.evaluate(() => (window.__gleiche = true));
  await seite.locator('.kopfleiste [aria-controls="untermenue-oben-dentosophie"]').hover();
  await seite.waitForTimeout(600);
  await seite.locator('#untermenue-oben-dentosophie .oberpunkt', { hasText: 'Mundatmung' }).click();
  await seite.waitForTimeout(2200);
  const gleich = await seite.evaluate(() => window.__gleiche === true);
  const lage2 = await markenLage(seite, 'mundatmung');
  pruefen(gleich && lage2 > 60 && lage2 < 140, 'Auf derselben Seite gleitet sie zur Marke', `${lage2} px`);

  // Von einer Leistung zum Team auf der Startseite
  await seite.goto(`${adresse}/leistungen/prophylaxe/`, { waitUntil: 'networkidle' });
  await seite.locator('.kopfleiste a.menuepunkt', { hasText: 'Team' }).click();
  await seite.waitForURL(/\/#team$/);
  await seite.waitForTimeout(1200);
  const team = await markenLage(seite, 'team');
  pruefen(team !== null && team > 60 && team < 140, 'Von einer Leistungsseite zum Team', `${team} px`);

  // Zweiter Klick auf einen Punkt mit Unterpunkten springt
  await seite.locator('.kopfleiste [aria-controls="untermenue-oben-leistungen"]').click(); // öffnet (Überfahren) bzw. springt
  await seite.waitForTimeout(1600);
  const leistLage = await markenLage(seite, 'leistungen');
  pruefen(leistLage !== null && leistLage > 60 && leistLage < 140, 'Klick auf „Leistungen“ springt zu den Leistungen', `${leistLage} px`);

  // Menüpunkt Dentosophie führt zur Seite
  await seite.locator('.kopfleiste [aria-controls="untermenue-oben-dentosophie"]').click();
  await seite.waitForURL(/\/dentosophie\/$/, { timeout: 5000 }).catch(() => {});
  pruefen(new URL(seite.url()).pathname === '/dentosophie/', 'Menüpunkt Dentosophie öffnet die Seite', seite.url());

  // Karte auf der Startseite morpht in die Seite
  await seite.goto(`${adresse}/#dentosophie`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(800);
  await seite.locator('.seitenteaser a[data-karte]').click();
  await seite.waitForURL(/\/dentosophie\/$/);
  pruefen(true, 'Ankündigungskarte öffnet die Dentosophie-Seite');
  await seite.waitForTimeout(1200);
  await seite.locator('.beitrag__zurueck').click();
  await seite.waitForURL((u) => u.pathname === '/');
  await seite.waitForTimeout(1500);
  const karte = await seite.evaluate(() => {
    const r = document.querySelector('.seitenteaser a[data-karte]').getBoundingClientRect();
    return r.top < innerHeight && r.bottom > 0;
  });
  pruefen(karte, 'Zurück landet bei der Karte');
  await seite.context().close();
}

/* ---------- Handy ---------- */
{
  const seite = await seiteOeffnen(browser, 'handy');
  await seite.goto(`${adresse}/#team`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(600);
  const unten = await seite.$$eval('.fussleiste__inhalt--klein .fussknopf', (e) => e.map((x) => x.dataset.punkt));
  pruefen(unten.join() === 'zeiten,leistungen,telefon', 'Handy-Leiste: Sprechstunden · Leistungen · Telefon', unten.join(' · '));

  await seite.locator('[data-menueknopf]').click();
  await seite.waitForTimeout(800);
  await seite.locator('[data-ebene-knopf="dentosophie"]').click();
  await seite.waitForTimeout(800);
  const sichtbar = await seite.$$eval('.mobilmenue__zeile', (zeilen) =>
    zeilen.filter((z) => z.getBoundingClientRect().height > 4).map((z) => z.textContent.replace(/\s+/g, ' ').trim()),
  );
  pruefen(sichtbar.length === 5 && sichtbar[1].startsWith('Dentosophie – Übersicht'), 'Ebene Dentosophie: Zurück, Übersicht, drei Unterpunkte', sichtbar.join(' | '));
  const breite = await seite.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  pruefen(breite <= 0, 'Kein waagerechtes Scrollen', `${breite} px`);
  await seite.keyboard.press('Escape');
  await seite.waitForTimeout(600);
  const ebene = await seite.$eval('[data-mobilmenue]', (m) => m.dataset.ebene ?? '');
  pruefen(ebene === '', 'Escape führt zurück auf die Hauptebene');
  await seite.locator('.mobilmenue__punkt', { hasText: 'Team' }).click();
  await seite.waitForTimeout(1500);
  await seite.context().close();
}

/* ---------- Zipfel bei vielen Breiten ---------- */
for (const breite of [360, 414, 768, 991, 992, 1024, 1280, 1920]) {
  const seite = await seiteOeffnen(browser, { width: breite, height: breite < 992 ? 800 : 900, isMobile: breite < 992, hasTouch: breite < 992 });
  await seite.goto(`${adresse}/`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(500);
  await seite.locator('.fussknopf[data-punkt="zeiten"]:visible').first().click();
  await seite.waitForTimeout(2600);
  const m = await seite.evaluate(() => {
    const svg = document.querySelector('[data-ozzipfel]').getBoundingClientRect();
    const z = document.querySelector('[data-ozkontur]').getAttribute('d').match(/-?\d+(\.\d+)?/g).map(Number);
    const k = [...document.querySelectorAll('.fussknopf[data-punkt="zeiten"]')].map((x) => x.getBoundingClientRect()).find((r) => r.width);
    const leiste = document.querySelector('.fussleiste-huelle').getBoundingClientRect();
    return { dx: svg.left + z[4] - (k.left + k.width / 2), dy: svg.top + z[5] - leiste.top, gespiegelt: z[2] > z[4] };
  });
  pruefen(Math.abs(m.dx) <= 1 && Math.abs(m.dy) <= 1.5 && m.gespiegelt, `Zipfel bei ${breite} px auf dem Knopf, gespiegelt`, `dx ${m.dx.toFixed(1)}, dy ${m.dy.toFixed(1)}`);
  await seite.context().close();
}

await browser.close();
schliessen();
console.log(fehler ? `\n${fehler} Prüfung(en) fehlgeschlagen` : '\nAlles in Ordnung.');
process.exit(fehler ? 1 : 0);
