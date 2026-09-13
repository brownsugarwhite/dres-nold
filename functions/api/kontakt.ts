/**
 * Kontaktformular — nimmt die Nachricht entgegen und schickt sie per
 * E-Mail an die Praxis. Läuft als Cloudflare Pages Function unter
 * /api/kontakt.
 *
 * Versand über Resend (https://resend.com). Einstellungen liegen als
 * Secrets im Cloudflare-Projekt (siehe docs/betrieb.md):
 *
 *   RESEND_API_KEY      Schlüssel aus dem Resend-Konto
 *   KONTAKT_EMPFAENGER  wohin die Nachrichten gehen, z. B. info@dres-nold.de
 *   KONTAKT_ABSENDER    Absenderadresse auf der bestätigten Domain,
 *                       z. B. "Website Dres. Nold <formular@dres-nold.de>"
 *
 * Es wird nichts gespeichert — die Nachricht geht durch und ist weg.
 * Gesundheitsdaten werden nicht abgefragt (CLAUDE.md, Rechtliches).
 */

type Env = {
  RESEND_API_KEY?: string;
  KONTAKT_EMPFAENGER?: string;
  KONTAKT_ABSENDER?: string;
};

type Kontext = { request: Request; env: Env };

/** Mindestzeit zwischen Seitenaufruf und Absenden — Roboter sind schneller */
const MINDESTDAUER_MS = 3000;

const text = (wert: unknown, max: number) =>
  typeof wert === 'string' ? wert.trim().slice(0, max) : '';

const istEmail = (wert: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(wert);

async function felderLesen(request: Request): Promise<Record<string, unknown>> {
  const typ = request.headers.get('content-type') || '';
  if (typ.includes('application/json')) {
    return (await request.json().catch(() => ({}))) as Record<string, unknown>;
  }
  const form = await request.formData().catch(() => null);
  if (!form) return {};
  return Object.fromEntries([...form.entries()].map(([k, v]) => [k, typeof v === 'string' ? v : '']));
}

function antworten(request: Request, ok: boolean, fehler?: string, status = ok ? 200 : 400): Response {
  const willJson = (request.headers.get('accept') || '').includes('application/json');
  if (willJson) {
    return new Response(JSON.stringify(ok ? { ok: true } : { ok: false, fehler }), {
      status,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }
  /* Ohne JavaScript: zurück zum Kontaktbereich mit Ergebnis in der Adresse */
  const ziel = new URL(request.url);
  ziel.pathname = '/';
  ziel.search = ok ? '?gesendet=1' : '?fehler=1';
  ziel.hash = 'contact';
  return Response.redirect(ziel.toString(), 303);
}

export async function onRequestPost({ request, env }: Kontext): Promise<Response> {
  const f = await felderLesen(request);

  const name = text(f.name, 100);
  const email = text(f.email, 200);
  const telefon = text(f.telefon, 40);
  const nachricht = text(f.nachricht, 5000);
  const datenschutz = f.datenschutz === 'ja' || f.datenschutz === 'on' || f.datenschutz === true;
  const honigtopf = text(f.website, 200);
  const zeit = Number(f.zeit) || 0;

  /* Roboter: Honigtopf gefüllt oder zu schnell abgeschickt.
     Antwort wie bei Erfolg, damit sie nichts lernen — versendet wird nichts. */
  if (honigtopf || (zeit && Date.now() - zeit < MINDESTDAUER_MS)) {
    return antworten(request, true);
  }

  if (name.length < 2 || !istEmail(email) || nachricht.length < 10) {
    return antworten(request, false, 'Bitte füllen Sie Name, E-Mail und Nachricht vollständig aus.');
  }
  if (!datenschutz) {
    return antworten(request, false, 'Bitte bestätigen Sie den Hinweis zum Datenschutz.');
  }

  if (!env.RESEND_API_KEY || !env.KONTAKT_EMPFAENGER) {
    return antworten(request, false, 'Der Versand ist noch nicht eingerichtet. Bitte rufen Sie uns an oder schreiben Sie eine E-Mail.', 503);
  }

  const inhalt = [
    `Neue Anfrage über das Kontaktformular auf dres-nold.de`,
    ``,
    `Name:     ${name}`,
    `E-Mail:   ${email}`,
    `Telefon:  ${telefon || '–'}`,
    ``,
    `Nachricht:`,
    nachricht,
    ``,
    `—`,
    `Antworten Sie einfach auf diese E-Mail, die Antwort geht an ${email}.`,
  ].join('\n');

  const versand = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.KONTAKT_ABSENDER || 'Website Dres. Nold <formular@dres-nold.de>',
      to: [env.KONTAKT_EMPFAENGER],
      reply_to: email,
      subject: `Anfrage über die Website von ${name}`,
      text: inhalt,
    }),
  }).catch(() => null);

  if (!versand || !versand.ok) {
    return antworten(request, false, 'Die Nachricht konnte nicht gesendet werden. Bitte rufen Sie uns an oder schreiben Sie eine E-Mail.', 502);
  }

  return antworten(request, true);
}

/** Alles andere als POST ist hier nicht vorgesehen */
export async function onRequestGet(): Promise<Response> {
  return new Response('Nur POST', { status: 405, headers: { Allow: 'POST' } });
}
