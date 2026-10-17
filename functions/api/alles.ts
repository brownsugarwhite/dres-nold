/**
 * Liefert der Redaktion alle Inhaltsdateien auf einmal — direkt aus dem
 * Repo, nicht aus dem gebauten Stand. So sieht die Redaktion auch
 * Änderungen, die gerade erst gespeichert wurden und noch nicht online
 * sind.
 *
 *   GET /api/alles   → { stand, dateien: { hinweis: {…}, … } }
 *
 * `stand` ist der Commit, aus dem gelesen wurde. Die Redaktion schickt
 * ihn beim Speichern mit (functions/api/save.ts) — daran erkennt der
 * Server, ob jemand anderes inzwischen dieselben Dateien geändert hat.
 *
 * Bewusst EINE Anfrage mit fester Zahl von GitHub-Abrufen (je Datei
 * einer): Cloudflare erlaubt einer Funktion im kostenlosen Tarif 50
 * Abrufe, und die Zahl der Dateien wächst nicht mit den Inhalten —
 * eigene Seiten und Blogs stehen alle in bereiche.json.
 */
import { dateien } from '../../src/content/schema';
import { standLesen, textLesen, type GithubUmgebung } from '../../src/server/github';

type Kontext = { env: GithubUmgebung };

const json = (daten: unknown, status = 200) =>
  new Response(JSON.stringify(daten), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

export async function onRequestGet({ env }: Kontext): Promise<Response> {
  try {
    const stand = await standLesen(env);
    const inhalte = await Promise.all(
      dateien.map(async (name) => [name, JSON.parse((await textLesen(env, `src/content/${name}.json`, stand)) ?? 'null')] as const),
    );
    return json({ stand, dateien: Object.fromEntries(inhalte) });
  } catch (e) {
    return json({ fehler: e instanceof Error ? e.message : 'Lesen fehlgeschlagen' }, 502);
  }
}
