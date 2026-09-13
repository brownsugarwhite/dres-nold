/**
 * Nimmt Bilder und PDFs aus der Redaktion entgegen und legt sie im Repo
 * unter public/ ab.
 *
 *   POST /api/hochladen   (multipart/form-data: datei, ordner)
 *   → { ok: true, pfad: "/bilder/team/name.jpg" }
 *
 * Erlaubt sind JPG, PNG, WebP (bis 8 MB) und PDF (bis 15 MB). Der
 * Dateiname wird bereinigt (Kleinbuchstaben, keine Umlaute, keine
 * Leerzeichen), damit er in Adressen funktioniert. Existiert der Name
 * schon, wird die Datei ersetzt.
 */
import { dateiLesen, dateiSchreiben, type GithubUmgebung } from '../../src/server/github';

type Kontext = { request: Request; env: GithubUmgebung; data: { person?: string } };

const ORDNER: Record<string, string> = {
  team: 'bilder/team',
  galerie: 'bilder/galerie',
  neuigkeiten: 'bilder/neuigkeiten',
  abschnitte: 'bilder/abschnitte',
  allgemein: 'bilder',
  dokumente: 'dokumente',
};

const TYPEN: Record<string, { endung: string; max: number }> = {
  'image/jpeg': { endung: 'jpg', max: 8 * 1024 * 1024 },
  'image/png': { endung: 'png', max: 8 * 1024 * 1024 },
  'image/webp': { endung: 'webp', max: 8 * 1024 * 1024 },
  'application/pdf': { endung: 'pdf', max: 15 * 1024 * 1024 },
};

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

  const typ = TYPEN[datei.type];
  if (!typ) return json({ ok: false, fehler: 'Erlaubt sind JPG, PNG, WebP und PDF' }, 415);
  if (datei.size > typ.max) {
    return json({ ok: false, fehler: `Datei zu groß (höchstens ${Math.round(typ.max / 1024 / 1024)} MB)` }, 413);
  }

  const name = `${nameBereinigen(datei.name)}.${typ.endung}`;
  const pfadImRepo = `public/${ORDNER[ordner]}/${name}`;
  const bytes = new Uint8Array(await datei.arrayBuffer());

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
