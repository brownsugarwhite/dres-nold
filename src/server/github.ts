/**
 * Zugriff auf das GitHub-Repo — das „Speichern" der Redaktion.
 *
 * Jede Änderung wird ein Commit auf dem Zweig, der online geht. Damit ist
 * jede Änderung versioniert und rückgängig zu machen; das Repo ist
 * zugleich das Backup (siehe CLAUDE.md).
 *
 * Verwendet die Contents-API von GitHub:
 * https://docs.github.com/rest/repos/contents
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
