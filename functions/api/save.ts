/**
 * Speichert Änderungen aus der Redaktion ins Repo — alle geänderten
 * Inhaltsdateien in EINEM Commit.
 *
 *   POST /api/save   { basis, aenderungen: [{ datei, daten }] }
 *   → { ok: true, commit }   oder   { ok: false, fehler: [...] }
 *
 * `basis` ist der Stand (Commit), den die Redaktion geladen hat. Hat
 * seitdem jemand anderes eine der Dateien geändert, die jetzt gespeichert
 * werden sollen, wird abgelehnt (409) — nichts geht verloren. Änderungen
 * an anderen Dateien, etwa ein Bild-Upload, stören nicht.
 *
 * Ablauf: jede Datei gegen ihr Schema prüfen (src/content/schema.ts),
 * dazu die Regeln über Dateigrenzen hinweg → ein Commit → der
 * GitHub-Workflow baut die Seite neu, nach etwa einer Minute ist die
 * Änderung online.
 *
 * Bis Oktober 2026 ging jede Datei einzeln ({ bereich, daten, sha }).
 * Wer die Redaktion noch in einem alten Fenster offen hat, bekommt eine
 * klare Meldung (410) statt eines halben Speicherns.
 */
import { istDatei, pruefen, zusatzregeln, zusammenhangPruefen, type Bereich, type Seitenaufbau } from '../../src/content/schema';
import { Konflikt, dateienSchreiben, geaenderteDateien, standLesen, textLesen, type GithubUmgebung } from '../../src/server/github';

type Kontext = { request: Request; env: GithubUmgebung; data: { person?: string } };

const json = (daten: unknown, status = 200) =>
  new Response(JSON.stringify(daten), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

const pfadVon = (datei: string) => `src/content/${datei}.json`;

export async function onRequestPost({ request, env, data }: Kontext): Promise<Response> {
  let eingabe: { basis?: string; aenderungen?: { datei?: string; daten?: unknown }[]; bereich?: string };
  try {
    eingabe = (await request.json()) as typeof eingabe;
  } catch {
    return json({ ok: false, fehler: ['Ungültige Anfrage'] }, 400);
  }

  if (eingabe.bereich) {
    return json({ ok: false, fehler: ['Die Redaktion wurde erneuert. Bitte die Seite neu laden (Ihre Eingaben bitte vorher kopieren).'] }, 410);
  }
  const { basis, aenderungen } = eingabe;
  if (!basis) return json({ ok: false, fehler: ['Stand fehlt — bitte neu laden'] }, 400);
  if (!Array.isArray(aenderungen) || aenderungen.length === 0) return json({ ok: false, fehler: ['Nichts zu speichern'] }, 400);

  /* ---- Prüfen ---- */
  const fehler: string[] = [];
  const geprueft = new Map<string, unknown>();
  for (const a of aenderungen) {
    if (!a.datei || !istDatei(a.datei)) {
      fehler.push(`Unbekannte Datei: ${a.datei}`);
      continue;
    }
    const ergebnis = pruefen(a.datei, a.daten);
    if (!ergebnis.ok) {
      fehler.push(...ergebnis.fehler.map((f) => `${a.datei} → ${f}`));
      continue;
    }
    fehler.push(...zusatzregeln(a.datei, ergebnis.daten).map((f) => `${a.datei} → ${f}`));
    geprueft.set(a.datei, ergebnis.daten);
  }
  if (fehler.length) return json({ ok: false, fehler }, 422);

  try {
    /* Seitenplan und Bereiche gehören zusammen: Ändert sich eines, wird
       gegen den gespeicherten Stand des anderen geprüft */
    if (geprueft.has('seitenaufbau') || geprueft.has('bereiche')) {
      const stand = async (name: 'seitenaufbau' | 'bereiche') => {
        if (geprueft.has(name)) return geprueft.get(name);
        const ergebnis = pruefen(name, JSON.parse((await textLesen(env, pfadVon(name), basis)) ?? 'null'));
        return ergebnis.ok ? ergebnis.daten : null;
      };
      const a = await stand('seitenaufbau');
      const b = await stand('bereiche');
      const probleme = a && b ? zusammenhangPruefen(a as Seitenaufbau, b as { eintraege: Bereich[] }) : [];
      if (probleme.length) return json({ ok: false, fehler: probleme }, 422);
    }

    /* ---- Wurden dieselben Dateien inzwischen anderswo geändert? ---- */
    const jetzt = await standLesen(env);
    const fremd = new Set(await geaenderteDateien(env, basis, jetzt));
    const ueberschnitten = [...geprueft.keys()].filter((d) => fremd.has(pfadVon(d)));
    if (ueberschnitten.length) {
      return json({
        ok: false,
        konflikt: true,
        fehler: [`Inzwischen hat jemand anderes dasselbe geändert (${ueberschnitten.join(', ')}). Bitte die Seite neu laden und die Änderung noch einmal machen.`],
      }, 409);
    }

    /* ---- Ein Commit ---- */
    const namen = [...geprueft.keys()];
    const { commit } = await dateienSchreiben(
      env,
      namen.map((name) => ({ pfad: pfadVon(name), inhalt: JSON.stringify(geprueft.get(name), null, 2) + '\n' })),
      `Redaktion: ${namen.join(', ')} geändert (${data.person ?? 'unbekannt'})`,
    );
    return json({ ok: true, commit });
  } catch (e) {
    if (e instanceof Konflikt) return json({ ok: false, konflikt: true, fehler: [e.message] }, 409);
    return json({ ok: false, fehler: [e instanceof Error ? e.message : 'Speichern fehlgeschlagen'] }, 502);
  }
}
