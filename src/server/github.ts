/**
 * Zugriff auf das GitHub-Repo — das „Speichern" der Redaktion.
 *
 * Jede Änderung wird ein Commit auf dem Zweig, der online geht. Damit ist
 * jede Änderung versioniert und rückgängig zu machen; das Repo ist
 * zugleich das Backup (siehe CLAUDE.md).
 *
 * Zwei Wege zu GitHub:
 *   • die Contents-API für einzelne Dateien (Hochladen von Bildern und
 *     Dokumenten) — https://docs.github.com/rest/repos/contents
 *   • die Git-Data-API für das Speichern aus der Redaktion: Mehrere
 *     Inhaltsdateien gehen in EINEM Commit ins Repo, die Seite wird also
 *     nur einmal neu gebaut, und es gibt nie einen halben Stand
 *     (Oktober 2026) — https://docs.github.com/rest/git
 */

export type GithubUmgebung = {
  GITHUB_TOKEN?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
};

const API = 'https://api.github.com';

function kopf(env: GithubUmgebung): HeadersInit {
  return {
    Authorization: `Bearer ${env.GITHUB_TOKEN ?? ''}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'dres-nold-redaktion',
  };
}

function einstellungen(env: GithubUmgebung) {
  if (!env.GITHUB_TOKEN) throw new Error('GITHUB_TOKEN fehlt');
  if (!env.GITHUB_REPO) throw new Error('GITHUB_REPO fehlt');
  return { repo: env.GITHUB_REPO, zweig: env.GITHUB_BRANCH || 'main' };
}

/** Base64 für beliebige Bytes (die GitHub-API erwartet Base64) */
export function alsBase64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(s);
}

function ausBase64(text: string): Uint8Array {
  const roh = atob(text.replace(/\n/g, ''));
  const bytes = new Uint8Array(roh.length);
  for (let i = 0; i < roh.length; i++) bytes[i] = roh.charCodeAt(i);
  return bytes;
}

/** Liest eine Datei aus dem Repo: Inhalt (als Text) und ihre `sha`. */
export async function dateiLesen(
  env: GithubUmgebung,
  pfad: string,
): Promise<{ text: string; sha: string } | null> {
  const { repo, zweig } = einstellungen(env);
  const antwort = await fetch(`${API}/repos/${repo}/contents/${pfad}?ref=${encodeURIComponent(zweig)}`, {
    headers: kopf(env),
  });
  if (antwort.status === 404) return null;
  if (!antwort.ok) throw new Error(`GitHub: Lesen von ${pfad} fehlgeschlagen (${antwort.status})`);
  const daten = (await antwort.json()) as { content: string; sha: string; encoding: string };
  const text = new TextDecoder().decode(ausBase64(daten.content));
  return { text, sha: daten.sha };
}

/**
 * Schreibt eine Datei ins Repo (neu oder geändert) als eigenen Commit.
 * `sha` ist die Kennung des bisherigen Standes — GitHub verweigert das
 * Schreiben, wenn sich die Datei inzwischen geändert hat. So gehen
 * keine Änderungen verloren, wenn zwei Personen gleichzeitig arbeiten.
 */
export async function dateiSchreiben(
  env: GithubUmgebung,
  pfad: string,
  inhalt: Uint8Array,
  nachricht: string,
  sha?: string,
): Promise<{ commit: string }> {
  const { repo, zweig } = einstellungen(env);
  const antwort = await fetch(`${API}/repos/${repo}/contents/${pfad}`, {
    method: 'PUT',
    headers: { ...kopf(env), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: nachricht,
      content: alsBase64(inhalt),
      branch: zweig,
      ...(sha ? { sha } : {}),
      committer: { name: 'Redaktion dres-nold.de', email: 'redaktion@dres-nold.de' },
    }),
  });
  if (antwort.status === 409 || antwort.status === 422) {
    throw new Error('Die Datei wurde inzwischen von jemand anderem geändert. Bitte neu laden und erneut speichern.');
  }
  if (!antwort.ok) {
    throw new Error(`GitHub: Schreiben von ${pfad} fehlgeschlagen (${antwort.status})`);
  }
  const daten = (await antwort.json()) as { commit: { sha: string } };
  return { commit: daten.commit.sha };
}

/* ---------- Git-Data-API: mehrere Dateien in einem Commit ---------- */

async function anfrage<T>(env: GithubUmgebung, pfad: string, init: RequestInit = {}): Promise<{ status: number; daten: T | null }> {
  const antwort = await fetch(`${API}${pfad}`, {
    ...init,
    headers: { ...kopf(env), ...(init.body ? { 'Content-Type': 'application/json' } : {}) },
  });
  const daten = antwort.status === 204 ? null : ((await antwort.json().catch(() => null)) as T | null);
  return { status: antwort.status, daten };
}

/** Der Commit, auf dem der Zweig gerade steht */
export async function standLesen(env: GithubUmgebung): Promise<string> {
  const { repo, zweig } = einstellungen(env);
  const { status, daten } = await anfrage<{ object: { sha: string } }>(env, `/repos/${repo}/git/ref/heads/${encodeURIComponent(zweig)}`);
  if (status !== 200 || !daten) throw new Error(`GitHub: Stand des Zweigs nicht lesbar (${status})`);
  return daten.object.sha;
}

/** Die Dateien eines Ordners (ohne Inhalt) */
export async function ordnerLesen(
  env: GithubUmgebung,
  pfad: string,
  ref?: string,
): Promise<{ name: string; path: string; sha: string; size: number; type: string }[]> {
  const { repo, zweig } = einstellungen(env);
  const { status, daten } = await anfrage<{ name: string; path: string; sha: string; size: number; type: string }[]>(
    env,
    `/repos/${repo}/contents/${pfad}?ref=${encodeURIComponent(ref ?? zweig)}`,
  );
  if (status === 404) return [];
  if (status !== 200 || !Array.isArray(daten)) throw new Error(`GitHub: Ordner ${pfad} nicht lesbar (${status})`);
  return daten;
}

/** Eine Textdatei in einem bestimmten Stand */
export async function textLesen(env: GithubUmgebung, pfad: string, ref: string): Promise<string | null> {
  const { repo } = einstellungen(env);
  const { status, daten } = await anfrage<{ content: string }>(env, `/repos/${repo}/contents/${pfad}?ref=${ref}`);
  if (status === 404) return null;
  if (status !== 200 || !daten) throw new Error(`GitHub: Lesen von ${pfad} fehlgeschlagen (${status})`);
  return new TextDecoder().decode(ausBase64(daten.content));
}

/** Welche Dateien sich zwischen zwei Ständen geändert haben */
export async function geaenderteDateien(env: GithubUmgebung, von: string, bis: string): Promise<string[]> {
  if (von === bis) return [];
  const { repo } = einstellungen(env);
  const { status, daten } = await anfrage<{ files?: { filename: string }[] }>(env, `/repos/${repo}/compare/${von}...${bis}`);
  if (status !== 200 || !daten) throw new Error(`GitHub: Vergleich der Stände fehlgeschlagen (${status})`);
  return (daten.files ?? []).map((f) => f.filename);
}

export class Konflikt extends Error {}

/**
 * Schreibt mehrere Textdateien in EINEM Commit auf den Zweig.
 * `inhalt: null` löscht eine Datei.
 *
 * Der Zweig wird nur vorwärts bewegt (`force: false`). Hat ihn in der
 * Zwischenzeit jemand anderes bewegt — etwa ein Bild-Upload —, wird
 * einmal auf dem neuen Stand wiederholt; die Prüfung, ob dabei eine
 * fremde Änderung an DENSELBEN Dateien überschrieben würde, macht der
 * Aufrufer vorher (functions/api/save.ts).
 */
export async function dateienSchreiben(
  env: GithubUmgebung,
  dateien: { pfad: string; inhalt: string | null }[],
  nachricht: string,
): Promise<{ commit: string }> {
  const { repo, zweig } = einstellungen(env);
  for (let versuch = 0; versuch < 2; versuch++) {
    const kopfStand = await standLesen(env);
    const basis = await anfrage<{ tree: { sha: string } }>(env, `/repos/${repo}/git/commits/${kopfStand}`);
    if (basis.status !== 200 || !basis.daten) throw new Error(`GitHub: Commit nicht lesbar (${basis.status})`);

    const baum = await anfrage<{ sha: string }>(env, `/repos/${repo}/git/trees`, {
      method: 'POST',
      body: JSON.stringify({
        base_tree: basis.daten.tree.sha,
        tree: dateien.map((d) =>
          d.inhalt === null
            ? { path: d.pfad, mode: '100644', type: 'blob', sha: null }
            : { path: d.pfad, mode: '100644', type: 'blob', content: d.inhalt },
        ),
      }),
    });
    if (baum.status !== 201 || !baum.daten) throw new Error(`GitHub: Dateibaum nicht angelegt (${baum.status})`);

    const commit = await anfrage<{ sha: string }>(env, `/repos/${repo}/git/commits`, {
      method: 'POST',
      body: JSON.stringify({
        message: nachricht,
        tree: baum.daten.sha,
        parents: [kopfStand],
        committer: { name: 'Redaktion dres-nold.de', email: 'redaktion@dres-nold.de' },
      }),
    });
    if (commit.status !== 201 || !commit.daten) throw new Error(`GitHub: Commit nicht angelegt (${commit.status})`);

    const ref = await anfrage(env, `/repos/${repo}/git/refs/heads/${encodeURIComponent(zweig)}`, {
      method: 'PATCH',
      body: JSON.stringify({ sha: commit.daten.sha, force: false }),
    });
    if (ref.status === 200) return { commit: commit.daten.sha };
    // 422: Der Zweig ist inzwischen weiter — einmal auf dem neuen Stand
    if (ref.status !== 422) throw new Error(`GitHub: Zweig nicht aktualisiert (${ref.status})`);
  }
  throw new Konflikt('Die Inhalte wurden gerade gleichzeitig geändert. Bitte noch einmal speichern.');
}
