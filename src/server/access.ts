/**
 * Prüft die Anmeldung über Cloudflare Access.
 *
 * Access sitzt vor /admin und /api/save & Co. und lässt nur angemeldete
 * Personen durch. Als zweite Sicherung prüfen die Functions das von
 * Access mitgeschickte Token (Cf-Access-Jwt-Assertion) selbst: Signatur
 * gegen die öffentlichen Schlüssel des Teams, Zielkennung (AUD) und
 * Ablaufzeit. Ohne gültiges Token gibt es keinen Zugriff — auch dann
 * nicht, wenn jemand die Access-Regel umgehen würde.
 *
 * Dokumentation: https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/validating-json/
 */

export type AccessUmgebung = {
  ACCESS_TEAM?: string;
  ACCESS_AUD?: string;
  /** Nur lokal: schaltet die Prüfung ab (siehe .dev.vars.example) */
  ENTWICKLUNG?: string;
};

type Jwk = JsonWebKey & { kid: string };

let schluesselCache: { zeit: number; schluessel: Jwk[] } | null = null;

function b64urlZuBytes(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=');
  const roh = atob(b64);
  const bytes = new Uint8Array(roh.length);
  for (let i = 0; i < roh.length; i++) bytes[i] = roh.charCodeAt(i);
  return bytes;
}

async function schluesselLaden(team: string): Promise<Jwk[]> {
  const jetzt = Date.now();
  if (schluesselCache && jetzt - schluesselCache.zeit < 60 * 60 * 1000) return schluesselCache.schluessel;
  const antwort = await fetch(`https://${team}.cloudflareaccess.com/cdn-cgi/access/certs`);
  if (!antwort.ok) throw new Error('Access-Schlüssel nicht erreichbar');
  const daten = (await antwort.json()) as { keys: Jwk[] };
  schluesselCache = { zeit: jetzt, schluessel: daten.keys };
  return daten.keys;
}

/**
 * Liefert die E-Mail der angemeldeten Person — oder null, wenn das
 * Token fehlt oder ungültig ist.
 */
export async function angemeldetePerson(request: Request, env: AccessUmgebung): Promise<string | null> {
  if (env.ENTWICKLUNG === '1' && new URL(request.url).hostname === 'localhost') {
    return 'entwicklung@localhost';
  }
  if (!env.ACCESS_TEAM || !env.ACCESS_AUD) return null;

  const token =
    request.headers.get('Cf-Access-Jwt-Assertion') ||
    request.headers.get('cookie')?.match(/CF_Authorization=([^;]+)/)?.[1] ||
    '';
  const teile = token.split('.');
  if (teile.length !== 3) return null;

  try {
    const kopf = JSON.parse(new TextDecoder().decode(b64urlZuBytes(teile[0]))) as { kid: string; alg: string };
    const nutzlast = JSON.parse(new TextDecoder().decode(b64urlZuBytes(teile[1]))) as {
      aud: string | string[];
      exp: number;
      iss: string;
      email?: string;
    };

    if (kopf.alg !== 'RS256') return null;
    const audListe = Array.isArray(nutzlast.aud) ? nutzlast.aud : [nutzlast.aud];
    if (!audListe.includes(env.ACCESS_AUD)) return null;
    if (nutzlast.exp * 1000 < Date.now()) return null;
    if (nutzlast.iss !== `https://${env.ACCESS_TEAM}.cloudflareaccess.com`) return null;

    const jwk = (await schluesselLaden(env.ACCESS_TEAM)).find((k) => k.kid === kopf.kid);
    if (!jwk) return null;

    const schluessel = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    const gueltig = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      schluessel,
      b64urlZuBytes(teile[2]),
      new TextEncoder().encode(`${teile[0]}.${teile[1]}`),
    );
    if (!gueltig) return null;

    return nutzlast.email || 'unbekannt';
  } catch {
    return null;
  }
}
