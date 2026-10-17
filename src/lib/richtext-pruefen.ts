/**
 * Prüft Redaktions-HTML gegen die erlaubten Elemente und Attribute.
 *
 * Der Texteditor der Redaktion (src/admin/richtext.ts) räumt beim
 * Einfügen und Speichern schon auf. Diese Prüfung ist die zweite Hürde
 * auf dem Server (functions/api/save.ts) und beim Bauen: Sie WEIST
 * zurück statt still zu reinigen — wer fremdes HTML schickt, bekommt
 * eine Meldung, und nichts Unerwartetes landet je mit `set:html` auf
 * der Seite.
 *
 * Ein vollständiger HTML-Parser ist hier nicht nötig (und auf
 * Cloudflare gibt es kein DOM): Redaktionstext besteht nur aus einfachen
 * Tags mit wenigen Attributen in doppelten Anführungszeichen. Alles, was
 * davon abweicht, ist ohnehin verdächtig und wird abgewiesen.
 */

/** Erlaubte Elemente und je Element die erlaubten Attribute */
export const ERLAUBT: Record<string, string[]> = {
  p: [], br: [], strong: [], em: [], u: [],
  ul: [], ol: [], li: [], h3: [], h4: [],
  a: ['href'], table: [], thead: [], tbody: [], tr: [], th: [], td: [],
  img: ['src', 'alt'],
};

/** Ziel eines Verweises: eigene Seite, Sprungmarke, Web, E-Mail, Telefon */
export const VERWEIS = /^(\/[^\s"<>]*|#[^\s"<>]*|https?:\/\/[^\s"<>]+|mailto:[^\s"<>]+|tel:[+\d\s/()-]+)$/i;

/** Bilder im Text: nur Dateien von dieser Seite */
const BILD = /^\/[a-z0-9._\-/]+$/i;

/**
 * Liefert eine Liste lesbarer Probleme; leer heißt: alles erlaubt.
 */
export function richtextPruefen(html: string): string[] {
  const probleme: string[] = [];
  // Kommentare, Doctype, CDATA: kommen aus dem Editor nie
  if (/<!/.test(html)) probleme.push('Kommentare oder Sonderblöcke sind im Text nicht erlaubt');

  for (const treffer of html.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g)) {
    const tag = treffer[1].toLowerCase();
    const rest = treffer[2];
    if (!(tag in ERLAUBT)) {
      probleme.push(`Element <${tag}> ist im Text nicht erlaubt`);
      continue;
    }
    if (treffer[0].startsWith('</')) continue;

    // Attribute: name="wert", sonst nichts (ein / am Ende ist harmlos)
    const ohneAttribute = rest.replace(/\s+([a-zA-Z-]+)="([^"]*)"/g, (_, name: string, wert: string) => {
      const n = name.toLowerCase();
      if (!ERLAUBT[tag].includes(n)) probleme.push(`Attribut „${n}“ an <${tag}> ist nicht erlaubt`);
      const w = wert.replace(/&amp;/g, '&');
      if (n === 'href' && !VERWEIS.test(w)) probleme.push(`Verweisziel „${w}“ ist ungültig`);
      if (n === 'src' && !BILD.test(w)) probleme.push(`Bildadresse „${w}“ muss auf dieser Seite liegen`);
      return '';
    });
    if (ohneAttribute.replace(/\s*\/?\s*$/, '') !== '') probleme.push(`Unerwartetes in <${tag}${rest}>`);
  }
  return [...new Set(probleme)];
}
