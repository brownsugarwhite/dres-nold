/**
 * Nimmt Bilder und PDFs aus der Redaktion entgegen und legt sie im Repo
 * unter public/ ab.
 *
 *   POST /api/hochladen   (multipart/form-data: datei, ordner)
 *   → { ok: true, pfad: "/bilder/team/name.jpg" }
 *
 * Erlaubt sind JPG, PNG, WebP (bis 8 MB) und PDF (bis 15 MB), für
 * Symbole zusätzlich SVG (bis 512 KB). Der Dateiname wird bereinigt
 * (Kleinbuchstaben, keine Umlaute, keine Leerzeichen), damit er in
 * Adressen funktioniert. Existiert der Name schon, wird die Datei ersetzt.
 *
 * Hochgeladene Symbole landen in einem eigenen Ordner (icons/eigene),
 * damit ein „logo.svg" nicht das Logo der Seite überschreibt.
 */
import { dateiLesen, dateiSchreiben, type GithubUmgebung } from '../../src/server/github';

type Kontext = { request: Request; env: GithubUmgebung; data: { person?: string } };

const ORDNER: Record<string, string> = {
  team: 'bilder/team',
  galerie: 'bilder/galerie',
  neuigkeiten: 'bilder/neuigkeiten',
  abschnitte: 'bilder/abschnitte',
  allgemein: 'bilder',
  symbole: 'icons/eigene',
  dokumente: 'dokumente',
};

const TYPEN: Record<string, { endung: string; max: number }> = {
  'image/jpeg': { endung: 'jpg', max: 8 * 1024 * 1024 },
  'image/png': { endung: 'png', max: 8 * 1024 * 1024 },
  'image/webp': { endung: 'webp', max: 8 * 1024 * 1024 },
  'application/pdf': { endung: 'pdf', max: 15 * 1024 * 1024 },
  'image/svg+xml': { endung: 'svg', max: 512 * 1024 },
};

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
  if (!ORDNER[ordner]) return json({ ok: false, fehler: 'Unbekannter Ordner' }, 400);

  /* Manche Systeme kennen .svg nicht und schicken keinen oder einen
     allgemeinen Dateityp mit — dann entscheidet die Endung. */
  const unbestimmt = !datei.type || datei.type === 'application/octet-stream';
  const mime = unbestimmt && /\.svg$/i.test(datei.name) ? 'image/svg+xml' : datei.type;
  const istSvg = mime === 'image/svg+xml';
  const typ = TYPEN[mime];
  if (!typ || (istSvg && ordner !== 'symbole')) {
    const erlaubt = ordner === 'symbole' ? 'SVG, JPG, PNG, WebP und PDF' : 'JPG, PNG, WebP und PDF';
    return json({ ok: false, fehler: `Erlaubt sind ${erlaubt}` }, 415);
  }
  if (datei.size > typ.max) {
    const grenze = typ.max < 1024 * 1024 ? `${typ.max / 1024} KB` : `${Math.round(typ.max / 1024 / 1024)} MB`;
    return json({ ok: false, fehler: `Datei zu groß (höchstens ${grenze})` }, 413);
  }

  const name = `${nameBereinigen(datei.name)}.${typ.endung}`;
  const pfadImRepo = `public/${ORDNER[ordner]}/${name}`;
  const bytes = new Uint8Array(await datei.arrayBuffer());

  if (istSvg) {
    const grund = svgPruefen(new TextDecoder().decode(bytes));
    if (grund) return json({ ok: false, fehler: `${grund} und kann nicht verwendet werden.` }, 415);
  }

  try {
    const vorhanden = await dateiLesen(env, pfadImRepo);
    await dateiSchreiben(
      env,
      pfadImRepo,
      bytes,
      `Redaktion: Datei ${name} hochgeladen (${data.person ?? 'unbekannt'})`,
      vorhanden?.sha,
    );
    return json({ ok: true, pfad: `/${ORDNER[ordner]}/${name}` });
  } catch (e) {
    return json({ ok: false, fehler: e instanceof Error ? e.message : 'Hochladen fehlgeschlagen' }, 502);
  }
}
