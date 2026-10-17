/*
  Die Redaktion lokal ausprobieren — ohne GitHub und ohne Anmeldung.

    npm run build
    node scripts/redaktion-lokal.mjs            # http://localhost:4400/admin/
    node scripts/redaktion-lokal.mjs --kopie    # schreibt in eine Kopie, nicht in src/content

  Liefert die gebaute Seite aus dist/ und spielt die Schnittstellen der
  Redaktion nach (functions/api/…): Lesen und Speichern gehen auf die
  Dateien unter src/content/, Hochladen nach public/. Geprüft wird beim
  Speichern mit denselben Regeln wie auf dem Server (src/content/schema.ts).

  Zum Testen besonderer Fälle:
    KONFLIKT=1        Speichern antwortet „inzwischen geändert" (409)
    ABGEMELDET=1      alles antwortet wie eine abgelaufene Anmeldung

  Nur zum Entwickeln — auf Cloudflare laufen die echten Functions.
*/
import http from 'node:http';
import { readFile, writeFile, readdir, stat, mkdir, cp, mkdtemp } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { tmpdir } from 'node:os';
import { build } from 'esbuild';

const WURZEL = new URL('..', import.meta.url).pathname;
const DIST = join(WURZEL, 'dist');
const PORT = Number(process.env.PORT ?? 4400);

let INHALT = join(WURZEL, 'src/content');
let OEFFENTLICH = join(WURZEL, 'public');
if (process.argv.includes('--kopie')) {
  const ordner = await mkdtemp(join(tmpdir(), 'redaktion-'));
  await cp(INHALT, join(ordner, 'content'), { recursive: true });
  await mkdir(join(ordner, 'public'), { recursive: true });
  INHALT = join(ordner, 'content');
  OEFFENTLICH = join(ordner, 'public');
  console.log(`Schreibt in die Kopie ${ordner}`);
}

/* Regeln des Servers einmal bündeln */
const buendel = join(await mkdtemp(join(tmpdir(), 'redaktion-regeln-')), 'regeln.mjs');
await build({
  stdin: {
    contents: `export { dateien, pruefen, zusatzregeln, zusammenhangPruefen } from './src/content/schema.ts';
               export { anfangPasst, ENDUNGEN, erlaubteEndungen, nameBereinigen, ORDNER, svgPruefen } from './functions/api/hochladen.ts';`,
    resolveDir: WURZEL,
    loader: 'ts',
  },
  bundle: true, platform: 'node', format: 'esm', outfile: buendel, logLevel: 'silent',
});
const regeln = await import(buendel);

const TYPEN = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.xml': 'application/xml',
};

let stand = 0;
const json = (antwort, daten, status = 200) => {
  antwort.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  antwort.end(JSON.stringify(daten));
};
const koerper = (anfrage) => new Promise((fertig) => {
  const teile = [];
  anfrage.on('data', (t) => teile.push(t));
  anfrage.on('end', () => fertig(Buffer.concat(teile)));
});

async function api(pfad, anfrage, antwort) {
  if (process.env.ABGEMELDET) { antwort.writeHead(302, { location: 'https://dres-nold.cloudflareaccess.com/' }); antwort.end(); return; }

  if (pfad === '/api/alles') {
    const dateien = {};
    for (const name of regeln.dateien) dateien[name] = JSON.parse(await readFile(join(INHALT, `${name}.json`), 'utf8'));
    return json(antwort, { stand: `lokal-${stand}`, dateien });
  }

  if (pfad === '/api/save') {
    const eingabe = JSON.parse((await koerper(anfrage)).toString());
    if (process.env.KONFLIKT) return json(antwort, { ok: false, konflikt: true, fehler: ['Inzwischen hat jemand anderes dasselbe geändert (Probe). Bitte neu laden.'] }, 409);
    const fehler = [];
    const geprueft = {};
    for (const a of eingabe.aenderungen ?? []) {
      const r = regeln.pruefen(a.datei, a.daten);
      if (!r.ok) { fehler.push(...r.fehler.map((f) => `${a.datei} → ${f}`)); continue; }
      fehler.push(...regeln.zusatzregeln(a.datei, r.daten));
      geprueft[a.datei] = r.daten;
    }
    if (!fehler.length && (geprueft.seitenaufbau || geprueft.bereiche)) {
      const lesen = async (n) => geprueft[n] ?? regeln.pruefen(n, JSON.parse(await readFile(join(INHALT, `${n}.json`), 'utf8'))).daten;
      fehler.push(...regeln.zusammenhangPruefen(await lesen('seitenaufbau'), await lesen('bereiche')));
    }
    if (fehler.length) return json(antwort, { ok: false, fehler }, 422);
    for (const [name, daten] of Object.entries(geprueft)) await writeFile(join(INHALT, `${name}.json`), JSON.stringify(daten, null, 2) + '\n');
    stand++;
    console.log(`gespeichert: ${Object.keys(geprueft).join(', ')}`);
    return json(antwort, { ok: true, commit: `lokal-${stand}` });
  }

  if (pfad === '/api/hochladen') {
    const roh = await koerper(anfrage);
    const form = await new Request('http://x', { method: 'POST', headers: anfrage.headers, body: roh }).formData();
    const datei = form.get('datei');
    const ordner = String(form.get('ordner') || 'allgemein');
    if (!regeln.ORDNER[ordner]) return json(antwort, { ok: false, fehler: 'Unbekannter Ordner' }, 400);
    const endung = (/\.([a-z0-9]+)$/i.exec(datei.name)?.[1] ?? '').toLowerCase();
    const art = regeln.ENDUNGEN[endung];
    if (!art || !regeln.erlaubteEndungen(ordner).includes(endung)) return json(antwort, { ok: false, fehler: 'Diese Dateiart geht hier nicht.' }, 415);
    const bytes = new Uint8Array(await datei.arrayBuffer());
    if (!regeln.anfangPasst(art, bytes)) return json(antwort, { ok: false, fehler: `Die Datei ist keine echte ${endung.toUpperCase()}-Datei.` }, 415);
    const ziel = join(OEFFENTLICH, regeln.ORDNER[ordner]);
    await mkdir(ziel, { recursive: true });
    const vorhanden = new Set(await readdir(ziel).catch(() => []));
    const stamm = regeln.nameBereinigen(datei.name);
    let name = `${stamm}.${endung === 'jpeg' ? 'jpg' : endung}`;
    for (let n = 2; vorhanden.has(name); n++) name = `${stamm}-${n}.${endung === 'jpeg' ? 'jpg' : endung}`;
    await writeFile(join(ziel, name), bytes);
    return json(antwort, { ok: true, pfad: `/${regeln.ORDNER[ordner]}/${name}`, name });
  }

  if (pfad === '/api/dateien') {
    const ordner = new URL(anfrage.url, 'http://x').searchParams.get('ordner') || 'dokumente';
    if (!regeln.ORDNER[ordner]) return json(antwort, { fehler: 'Unbekannter Ordner' }, 400);
    const namen = new Set([
      ...(await readdir(join(WURZEL, 'public', regeln.ORDNER[ordner])).catch(() => [])),
      ...(await readdir(join(OEFFENTLICH, regeln.ORDNER[ordner])).catch(() => [])),
    ]);
    const dateien = [];
    for (const name of namen) {
      if (/-(600|900)\.(jpe?g|png)$/i.test(name) || name.startsWith('.')) continue;
      const s = await stat(join(OEFFENTLICH, regeln.ORDNER[ordner], name)).catch(() => stat(join(WURZEL, 'public', regeln.ORDNER[ordner], name)));
      if (s.isFile()) dateien.push({ pfad: `/${regeln.ORDNER[ordner]}/${name}`, name, groesse: s.size });
    }
    return json(antwort, { dateien });
  }

  return json(antwort, { fehler: 'Unbekannt' }, 404);
}

http.createServer(async (anfrage, antwort) => {
  const pfad = decodeURIComponent(new URL(anfrage.url, 'http://x').pathname);
  try {
    if (pfad.startsWith('/api/')) return await api(pfad, anfrage, antwort);
    for (const ordner of [OEFFENTLICH, DIST]) {
      let datei = normalize(join(ordner, pfad));
      if (!datei.startsWith(ordner)) continue;
      try {
        if ((await stat(datei)).isDirectory()) datei = join(datei, 'index.html');
        const inhalt = await readFile(datei);
        antwort.writeHead(200, { 'content-type': TYPEN[extname(datei)] ?? 'application/octet-stream' });
        return antwort.end(inhalt);
      } catch { /* im nächsten Ordner suchen */ }
    }
    antwort.writeHead(404).end('nicht gefunden');
  } catch (e) {
    console.error(e);
    json(antwort, { ok: false, fehler: [String(e?.message ?? e)] }, 500);
  }
}).listen(PORT, () => console.log(`Redaktion lokal: http://localhost:${PORT}/admin/`));
