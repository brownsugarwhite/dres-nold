/**
 * Speichert eine Inhaltsdatei aus der Redaktion ins Repo.
 *
 *   POST /api/save   { bereich, daten, sha }
 *   → { ok: true, commit }   oder   { ok: false, fehler: [...] }
 *
 * Ablauf: Schema prüfen (src/content/schema.ts) → Datei als Commit auf
 * den Zweig schreiben → Cloudflare baut die Seite neu (GitHub-Workflow),
 * nach etwa einer Minute ist die Änderung online.
 *
 * `sha` ist der Stand, den die Redaktion geladen hat. Hat jemand anderes
 * die Datei inzwischen geändert, lehnt GitHub ab — nichts geht verloren.
 */
import { istBereich, pruefen, zusatzregeln } from '../../src/content/schema';
import { dateiSchreiben, type GithubUmgebung } from '../../src/server/github';

type Kontext = { request: Request; env: GithubUmgebung; data: { person?: string } };

const json = (daten: unknown, status = 200) =>
  new Response(JSON.stringify(daten), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

/** Der Redaktionshinweis in der Datei bleibt erhalten */
function hinweisBewahren(neu: Record<string, unknown>, alt: unknown) {
  const a = alt as Record<string, unknown> | null;
  if (a && typeof a._hinweis_fuer_die_redaktion === 'string' && !neu._hinweis_fuer_die_redaktion) {
    return { _hinweis_fuer_die_redaktion: a._hinweis_fuer_die_redaktion, ...neu };
  }
  return neu;
}

export async function onRequestPost({ request, env, data }: Kontext): Promise<Response> {
  let eingabe: { bereich?: string; daten?: unknown; sha?: string; bisher?: unknown };
  try {
    eingabe = (await request.json()) as typeof eingabe;
  } catch {
    return json({ ok: false, fehler: ['Ungültige Anfrage'] }, 400);
  }

  const { bereich, daten, sha } = eingabe;
  if (!bereich || !istBereich(bereich)) return json({ ok: false, fehler: ['Unbekannter Bereich'] }, 400);
  if (!sha) return json({ ok: false, fehler: ['Stand der Datei fehlt — bitte neu laden'] }, 400);

  const ergebnis = pruefen(bereich, daten);
  if (!ergebnis.ok) return json({ ok: false, fehler: ergebnis.fehler }, 422);
  const weitere = zusatzregeln(bereich, ergebnis.daten);
  if (weitere.length) return json({ ok: false, fehler: weitere }, 422);

  const inhalt = hinweisBewahren(ergebnis.daten as Record<string, unknown>, eingabe.bisher);
  const text = JSON.stringify(inhalt, null, 2) + '\n';

  try {
    const { commit } = await dateiSchreiben(
      env,
      `src/content/${bereich}.json`,
      new TextEncoder().encode(text),
      `Redaktion: ${bereich} geändert (${data.person ?? 'unbekannt'})`,
      sha,
    );
    return json({ ok: true, commit });
  } catch (e) {
    return json({ ok: false, fehler: [e instanceof Error ? e.message : 'Speichern fehlgeschlagen'] }, 502);
  }
}
