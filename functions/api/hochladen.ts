/**
 * Nimmt Bilder und Dokumente aus der Redaktion entgegen und legt sie im
 * Repo unter public/ ab.
 *
 *   POST /api/hochladen   (multipart/form-data: datei, ordner)
 *   → { ok: true, pfad: "/bilder/team/name.jpg" }
 *
 * Bilder: JPG, PNG, WebP (bis 8 MB), für Symbole zusätzlich SVG (bis
 * 512 KB). Dokumente (Ordner „dokumente"): PDF, Word, Excel, PowerPoint,
 * OpenOffice, Text und CSV sowie Bilder, bis 15 MB — meist wird es ein
 * PDF sein (Florian, Oktober 2026; vorher nur PDF).
 *
 * Geprüft wird die Endung UND der Anfang der Datei: Ein umbenanntes
 * Programm wird nicht zum PDF, nur weil es so heißt. HTML und SVG landen
 * nie unter /dokumente — sie würden von dieser Seite aus geöffnet und
 * könnten dort Skripte ausführen.
 *
 * Der Dateiname wird bereinigt (Kleinbuchstaben, keine Umlaute, keine
 * Leerzeichen), damit er in Adressen funktioniert. Gibt es den Namen
 * schon, bekommt die neue Datei eine Nummer (-2, -3 …) — überschrieben
 * wird nichts mehr. Bis Oktober 2026 ersetzte ein gleicher Name still
 * die alte Datei, auch wenn sie anderswo verwendet war.
 *
 * Ein Upload ist ein eigener Commit mit „[skip ci]": Die Seite wird
 * dafür nicht neu gebaut, erst beim Speichern — dann sind Datei und
 * Verweis darauf gemeinsam online.
 *
 * Hochgeladene Symbole landen in einem eigenen Ordner (icons/eigene),
 * damit ein „logo.svg" nicht das Logo der Seite überschreibt.
 */
import { dateiSchreiben, ordnerLesen, type GithubUmgebung } from '../../src/server/github';

type Kontext = { request: Request; env: GithubUmgebung; data: { person?: string } };

export const ORDNER: Record<string, string> = {
  team: 'bilder/team',
  galerie: 'bilder/galerie',
  bereiche: 'bilder/bereiche',
  neuigkeiten: 'bilder/neuigkeiten',
  abschnitte: 'bilder/abschnitte',
  allgemein: 'bilder',
  symbole: 'icons/eigene',
  dokumente: 'dokumente',
};

const MB = 1024 * 1024;

/** Woran eine Datei zu erkennen ist: ihre ersten Bytes */
const ANFANG = {
  pdf: [[0x25, 0x50, 0x44, 0x46]],                 // %PDF
  zip: [[0x50, 0x4b, 0x03, 0x04]],                 // docx, xlsx, pptx, odt … sind ZIP-Archive
  ole: [[0xd0, 0xcf, 0x11, 0xe0]],                 // doc, xls, ppt (altes Office)
  jpg: [[0xff, 0xd8, 0xff]],
  png: [[0x89, 0x50, 0x4e, 0x47]],
  rtf: [[0x7b, 0x5c, 0x72, 0x74, 0x66]],           // {\rtf
} as const;

type Art = { anfang?: keyof typeof ANFANG | 'webp' | 'text' | 'svg'; max: number; bild?: boolean };

/** Erlaubte Endungen — die Endung entscheidet, der Anfang muss passen */
export const ENDUNGEN: Record<string, Art> = {
  jpg: { anfang: 'jpg', max: 8 * MB, bild: true },
  jpeg: { anfang: 'jpg', max: 8 * MB, bild: true },
  png: { anfang: 'png', max: 8 * MB, bild: true },
  webp: { anfang: 'webp', max: 8 * MB, bild: true },
  svg: { anfang: 'svg', max: 512 * 1024 },
  pdf: { anfang: 'pdf', max: 15 * MB },
  docx: { anfang: 'zip', max: 15 * MB },
  xlsx: { anfang: 'zip', max: 15 * MB },
  pptx: { anfang: 'zip', max: 15 * MB },
  odt: { anfang: 'zip', max: 15 * MB },
  ods: { anfang: 'zip', max: 15 * MB },
  odp: { anfang: 'zip', max: 15 * MB },
  doc: { anfang: 'ole', max: 15 * MB },
  xls: { anfang: 'ole', max: 15 * MB },
  ppt: { anfang: 'ole', max: 15 * MB },
  rtf: { anfang: 'rtf', max: 15 * MB },
  txt: { anfang: 'text', max: 2 * MB },
  csv: { anfang: 'text', max: 2 * MB },
};

/** Welche Endungen in welchen Ordner dürfen */
export function erlaubteEndungen(ordner: string): string[] {
  if (ordner === 'dokumente') return Object.keys(ENDUNGEN).filter((e) => e !== 'svg');
  if (ordner === 'symbole') return ['svg', 'jpg', 'jpeg', 'png', 'webp'];
  return ['jpg', 'jpeg', 'png', 'webp'];
}

/** Passt der Anfang der Datei zu ihrer Endung? */
export function anfangPasst(art: Art, bytes: Uint8Array): boolean {
  const beginntMit = (muster: readonly number[]) => muster.every((b, i) => bytes[i] === b);
  if (!art.anfang) return true;
  if (art.anfang === 'webp') {
    return beginntMit([0x52, 0x49, 0x46, 0x46]) && String.fromCharCode(...bytes.subarray(8, 12)) === 'WEBP';
  }
  if (art.anfang === 'svg') return true; // svgPruefen() liest den Inhalt
  if (art.anfang === 'text') {
    if (bytes.includes(0)) return false;
    try {
      const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes.subarray(0, 64 * 1024));
      return !/^\s*</.test(text); // kein HTML, das sich als Text ausgibt
    } catch {
      return false;
    }
  }
  return ANFANG[art.anfang].some(beginntMit);
}

/**
 * Eine SVG ist Text und kann Skripte oder Verweise auf fremde Server
 * enthalten. Solche Dateien werden abgelehnt statt bereinigt — ein
 * Symbol braucht nichts davon. Gibt den Grund zurück oder null.
 */
export function svgPruefen(text: string): string | null {
  if (!/<svg[\s>]/i.test(text)) return 'Die Datei ist keine SVG-Grafik';
  if (/<script[\s>]/i.test(text)) return 'Die SVG enthält ein Skript';
  if (/<foreignObject[\s>]/i.test(text)) return 'Die SVG enthält eingebettetes HTML';
  if (/\son[a-z]+\s*=/i.test(text)) return 'Die SVG enthält Skript-Anweisungen (on…)';
  if (/javascript:/i.test(text)) return 'Die SVG enthält Skript-Verweise';
  /* href, xlink:href, src, url(…) und @import dürfen nur auf die Datei
     selbst (#…) oder auf eingebettete Daten zeigen — nie nach draußen.
     xmlns="http://www.w3.org/…" ist nur ein Namensraum und bleibt erlaubt. */
  if (/(?:href|src)\s*=\s*["']\s*(?:https?:)?\/\//i.test(text)) return 'Die SVG lädt etwas von einem fremden Server';
  if (/url\(\s*["']?\s*(?:https?:)?\/\//i.test(text) || /@import/i.test(text)) return 'Die SVG lädt etwas von einem fremden Server';
  return null;
}

const json = (daten: unknown, status = 200) =>
  new Response(JSON.stringify(daten), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

/** „Frau Müller Foto.JPG" → „frau-mueller-foto" */
export function nameBereinigen(name: string): string {
  return name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'datei';
}

export async function onRequestPost({ request, env, data }: Kontext): Promise<Response> {
  const form = await request.formData().catch(() => null);
  const datei = form?.get('datei');
  const ordner = String(form?.get('ordner') || 'allgemein');

  if (!(datei instanceof File)) return json({ ok: false, fehler: 'Keine Datei erhalten' }, 400);
  if (!Object.hasOwn(ORDNER, ordner)) return json({ ok: false, fehler: 'Unbekannter Ordner' }, 400);

  const endung = (/\.([a-z0-9]+)$/i.exec(datei.name)?.[1] ?? '').toLowerCase();
  const erlaubt = erlaubteEndungen(ordner);
  const art = ENDUNGEN[endung];
  if (!art || !erlaubt.includes(endung)) {
    const liste = [...new Set(erlaubt.map((e) => (e === 'jpeg' ? 'jpg' : e)))].map((e) => e.toUpperCase()).join(', ');
    return json({ ok: false, fehler: `Diese Dateiart geht hier nicht. Erlaubt sind: ${liste}` }, 415);
  }
  if (datei.size > art.max) {
    const grenze = art.max < MB ? `${art.max / 1024} KB` : `${Math.round(art.max / MB)} MB`;
    return json({ ok: false, fehler: `Die Datei ist zu groß (höchstens ${grenze}).` }, 413);
  }

  const bytes = new Uint8Array(await datei.arrayBuffer());
  if (!anfangPasst(art, bytes)) {
    return json({ ok: false, fehler: `Die Datei ist keine echte ${endung.toUpperCase()}-Datei. Bitte die Originaldatei wählen.` }, 415);
  }
  if (endung === 'svg') {
    const grund = svgPruefen(new TextDecoder().decode(bytes));
    if (grund) return json({ ok: false, fehler: `${grund} und kann nicht verwendet werden.` }, 415);
  }

  try {
    /* Freien Namen suchen: name.pdf, name-2.pdf, name-3.pdf … */
    const vorhanden = new Set((await ordnerLesen(env, `public/${ORDNER[ordner]}`)).map((d) => d.name));
    const stamm = nameBereinigen(datei.name);
    const ziel = endung === 'jpeg' ? 'jpg' : endung;
    let name = `${stamm}.${ziel}`;
    for (let n = 2; vorhanden.has(name); n++) name = `${stamm}-${n}.${ziel}`;

    await dateiSchreiben(
      env,
      `public/${ORDNER[ordner]}/${name}`,
      bytes,
      `Redaktion: Datei ${name} hochgeladen (${data.person ?? 'unbekannt'}) [skip ci]`,
    );
    return json({ ok: true, pfad: `/${ORDNER[ordner]}/${name}`, name });
  } catch (e) {
    return json({ ok: false, fehler: e instanceof Error ? e.message : 'Hochladen fehlgeschlagen' }, 502);
  }
}
