/**
 * Listet, was schon hochgeladen ist — damit die Redaktion ein Bild oder
 * Dokument wiederverwenden kann, statt es ein zweites Mal hochzuladen.
 *
 *   GET /api/dateien?ordner=dokumente   → { dateien: [{ pfad, name, groesse }] }
 */
import { ordnerLesen, type GithubUmgebung } from '../../src/server/github';
import { ORDNER } from './hochladen';

type Kontext = { request: Request; env: GithubUmgebung };

const json = (daten: unknown, status = 200) =>
  new Response(JSON.stringify(daten), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

export async function onRequestGet({ request, env }: Kontext): Promise<Response> {
  const ordner = new URL(request.url).searchParams.get('ordner') || 'dokumente';
  if (!Object.hasOwn(ORDNER, ordner)) return json({ fehler: 'Unbekannter Ordner' }, 400);
  try {
    const liste = await ordnerLesen(env, `public/${ORDNER[ordner]}`);
    const dateien = liste
      .filter((d) => d.type === 'file' && !/-(600|900)\.(jpe?g|png)$/i.test(d.name) && !d.name.startsWith('.'))
      .map((d) => ({ pfad: `/${ORDNER[ordner]}/${d.name}`, name: d.name, groesse: d.size }));
    return json({ dateien });
  } catch (e) {
    return json({ fehler: e instanceof Error ? e.message : 'Lesen fehlgeschlagen' }, 502);
  }
}
