/*
  Einzeltests für die Bausteine ohne Browser: Textprüfung, Erkennung
  hochgeladener Dateien, Menümodell, Wiederholbarkeit des Umzugs.

    node tests/einheiten.mjs

  Die TypeScript-Dateien werden dafür mit esbuild (kommt mit Astro/Vite)
  zu einem Bündel zusammengefasst und dann geladen.
*/
import { build } from 'esbuild';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { WURZEL } from './hilfen.mjs';

const ordner = await mkdtemp(join(tmpdir(), 'einheiten-'));
const buendel = join(ordner, 'b.mjs');
await build({
  stdin: {
    contents: `
      export * from './src/lib/richtext-pruefen.ts';
      export * from './src/lib/aufbau.ts';
      export * from './src/lib/verweise.ts';
      export { pruefen, zusatzregeln, zusammenhangPruefen } from './src/content/schema.ts';
      export { anfangPasst, ENDUNGEN, erlaubteEndungen, nameBereinigen } from './functions/api/hochladen.ts';
    `,
    resolveDir: WURZEL,
    loader: 'ts',
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: buendel,
  logLevel: 'silent',
});
const m = await import(buendel);
const json = async (name) => JSON.parse(await readFile(join(WURZEL, 'src/content', `${name}.json`), 'utf8'));

test('Redaktionstext: Erlaubtes geht durch', () => {
  assert.deepEqual(m.richtextPruefen('<p>Text <a href="/dentosophie/#mundatmung">Link</a></p><ul><li>a</li></ul>'), []);
  assert.deepEqual(m.richtextPruefen('<p><a href="https://example.org/?a=1&amp;b=2">x</a><br></p>'), []);
});

test('Redaktionstext: Verbotenes wird abgewiesen', () => {
  assert.ok(m.richtextPruefen('<script>alert(1)</script>').length);
  assert.ok(m.richtextPruefen('<p onclick="x()">a</p>').length);
  assert.ok(m.richtextPruefen('<a href="javascript:alert(1)">a</a>').length);
  assert.ok(m.richtextPruefen('<img src="https://fremd.de/a.png" alt="">').length);
  assert.ok(m.richtextPruefen('<p style="color:red">a</p>').length);
  assert.ok(m.richtextPruefen("<a href='x'>a</a>").length);
});

test('Alle vorhandenen Inhalte bestehen die Prüfung', async () => {
  for (const name of ['hinweis', 'oeffnungszeiten', 'leistungen', 'team', 'galerie', 'stellen', 'startseite', 'seite', 'seitenaufbau', 'bereiche']) {
    const e = m.pruefen(name, await json(name));
    assert.ok(e.ok, `${name}: ${e.fehler?.join('; ')}`);
    assert.deepEqual(m.zusatzregeln(name, e.daten), [], name);
  }
});

test('Hochladen: Dateianfang muss zur Endung passen', () => {
  const pdf = new TextEncoder().encode('%PDF-1.7 …');
  const zip = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0, 0]);
  const html = new TextEncoder().encode('<html><script>alert(1)</script>');
  assert.ok(m.anfangPasst(m.ENDUNGEN.pdf, pdf));
  assert.ok(!m.anfangPasst(m.ENDUNGEN.pdf, html));
  assert.ok(m.anfangPasst(m.ENDUNGEN.docx, zip));
  assert.ok(!m.anfangPasst(m.ENDUNGEN.txt, html), 'HTML als .txt');
  assert.ok(m.anfangPasst(m.ENDUNGEN.csv, new TextEncoder().encode('a;b;c\n1;2;3')));
  assert.ok(!m.erlaubteEndungen('dokumente').includes('svg'));
  assert.ok(!m.erlaubteEndungen('dokumente').includes('html'));
  assert.ok(!m.erlaubteEndungen('team').includes('pdf'));
  assert.equal(m.nameBereinigen('Frau Müller Foto.JPG'), 'frau-mueller-foto');
});

test('Menü: Sprechstunden vorn, dann die Blöcke in Seitenfolge', async () => {
  const daten = Object.fromEntries(
    await Promise.all(['seitenaufbau', 'bereiche', 'leistungen', 'galerie', 'team', 'stellen'].map(async (n) => [n, m.pruefen(n, await json(n)).daten])),
  );
  const menue = m.menueBauen(daten);
  assert.equal(menue[0].id, 'zeiten');
  const reihe = daten.seitenaufbau.bloecke.filter((b) => b.menue).map((b) => b.id);
  assert.deepEqual(menue.slice(1).map((p) => p.id), reihe.filter((id) => menue.some((p) => p.id === id)));
  const dento = menue.find((p) => p.id === 'dentosophie');
  assert.equal(dento.ziel, '/dentosophie/');
  assert.ok(dento.unterpunkte.some((u) => u.ziel === '/dentosophie/#mundatmung'));
  const leist = menue.find((p) => p.id === 'leistungen');
  assert.ok(leist.unterpunkte.every((u) => u.ziel.startsWith('/#leistungen-')));
  assert.ok(!leist.unterpunkte.some((u) => u.titel === 'Test'), 'ausgeblendete Kategorie');
});

test('Menü: ausgeblendeter Block nimmt seinen Menüpunkt mit', async () => {
  const daten = Object.fromEntries(
    await Promise.all(['seitenaufbau', 'bereiche', 'leistungen', 'galerie', 'team', 'stellen'].map(async (n) => [n, m.pruefen(n, await json(n)).daten])),
  );
  daten.seitenaufbau.bloecke.find((b) => b.id === 'team').aktiv = false;
  assert.ok(!m.menueBauen(daten).some((p) => p.id === 'team'));
});

test('Seitenplan: zu viele Menüpunkte werden gemeldet', async () => {
  const aufbau = m.pruefen('seitenaufbau', await json('seitenaufbau')).daten;
  for (const b of aufbau.bloecke) b.menue ??= { titel: b.id, symbol: '', unterpunkte: [] };
  assert.ok(m.zusatzregeln('seitenaufbau', aufbau).some((f) => f.includes('Platz')));
});

test('Verweise: Art des Ziels', () => {
  assert.equal(m.verweisArt('/dokumente/flyer.pdf'), 'datei');
  assert.equal(m.verweisArt('/dentosophie/#atmen'), 'intern');
  assert.equal(m.verweisArt('https://example.org'), 'extern');
  assert.equal(m.verweisArt('tel:072457171'), 'kontakt');
  assert.match(m.verweiseAufbereiten('<a href="https://x.de">x</a>'), /target="_blank"/);
});

test('Umzug ist wiederholbar: ein zweiter Lauf ändert nichts', () => {
  const vorher = execFileSync('git', ['status', '--porcelain', 'src/content'], { cwd: WURZEL }).toString();
  execFileSync('node', ['scripts/umzug-seitenaufbau.mjs'], { cwd: WURZEL });
  const nachher = execFileSync('git', ['status', '--porcelain', 'src/content'], { cwd: WURZEL }).toString();
  assert.equal(nachher, vorher);
});

test.after(() => rm(ordner, { recursive: true, force: true }));
