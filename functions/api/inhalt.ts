/**
 * Liefert der Redaktion den aktuellen Stand einer Inhaltsdatei —
 * direkt aus dem Repo, nicht aus dem gebauten Stand. So sieht die
 * Redaktion auch Änderungen, die gerade erst gespeichert wurden und
 * noch nicht online sind.
 *
 *   GET /api/inhalt?bereich=hinweis
 *   → { bereich, daten, sha }
 */
import { istBereich } from '../../src/content/schema';
import { dateiLesen, type GithubUmgebung } from '../../src/server/github';

type Kontext = { request: Request; env: GithubUmgebung };

const json = (daten: unknown, status = 200) =>
  new Response(JSON.stringify(daten), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

export async function onRequestGet({ request, env }: Kontext): Promise<Response> {
  const bereich = new URL(request.url).searchParams.get('bereich') || '';
  if (!istBereich(bereich)) return json({ fehler: 'Unbekannter Bereich' }, 400);

  try {
    const datei = await dateiLesen(env, `src/content/${bereich}.json`);
    if (!datei) return json({ fehler: 'Datei nicht gefunden' }, 404);
    return json({ bereich, daten: JSON.parse(datei.text), sha: datei.sha });
  } catch (e) {
    return json({ fehler: e instanceof Error ? e.message : 'Lesen fehlgeschlagen' }, 502);
  }
}
