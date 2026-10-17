/**
 * Zugangsschutz für die Redaktion.
 *
 * Alles unter /admin und die Redaktions-Schnittstellen unter /api
 * verlangen eine Anmeldung über Cloudflare Access. Das Kontaktformular
 * (/api/kontakt) ist öffentlich.
 *
 * Cloudflare Access selbst ist die erste Hürde (eingerichtet im
 * Zero-Trust-Dashboard). Diese Prüfung ist die zweite: Sie verifiziert
 * das Access-Token kryptografisch (src/server/access.ts).
 */
import { angemeldetePerson, type AccessUmgebung } from '../src/server/access';

type Kontext = {
  request: Request;
  env: AccessUmgebung;
  next: () => Promise<Response>;
  data: Record<string, unknown>;
};

const GESCHUETZT = [/^\/admin(\/|$)/, /^\/api\/(inhalt|alles|save|hochladen|dateien)(\/|$)/];

export async function onRequest({ request, env, next, data }: Kontext): Promise<Response> {
  const pfad = new URL(request.url).pathname;
  if (!GESCHUETZT.some((m) => m.test(pfad))) return next();

  const person = await angemeldetePerson(request, env);
  if (!person) {
    return new Response('Anmeldung erforderlich. Bitte über /login anmelden.', {
      status: 401,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  data.person = person;
  return next();
}
