/*
  Umzug der Inhalte auf den Seitenaufbau (Oktober 2026).

    node scripts/umzug-seitenaufbau.mjs                 # Umzug + Inhaltsänderungen
    node scripts/umzug-seitenaufbau.mjs --ohne-inhalte  # nur der Umzug

  Vorher gab es drei Dateien, die jetzt in zwei neuen aufgehen:

    navigation.json  ─┐
    neuigkeiten.json ─┼─►  seitenaufbau.json   Reihenfolge der Startseite + Menü
    abschnitte.json  ─┘    bereiche.json       Blogs, Startseiten-Bereiche, Seiten

  Außerdem werden in leistungen.json die Knopfzeilen zur Knopfliste und
  die Kategorie-Symbole fallen weg.

  Das Skript ist wiederholbar: Ein zweiter Lauf ändert nichts. Es ist am
  17. Oktober 2026 gelaufen; die Inhalte unter src/content sind umgezogen.
  Es bleibt nur zum Nachvollziehen und kann weg.

  Die Inhaltsänderungen (Abschnitt „Inhalte" unten) sind die Wünsche der
  Praxis vom Oktober 2026; mit --ohne-inhalte lässt sich prüfen, dass der
  Umzug allein die Seite nicht verändert.
*/
import { readFile, writeFile, rm, access } from 'node:fs/promises';

const INHALT = new URL('../src/content/', import.meta.url);
const ohneInhalte = process.argv.includes('--ohne-inhalte');

const lesen = async (name) => JSON.parse(await readFile(new URL(`${name}.json`, INHALT), 'utf8'));
const schreiben = (name, daten) => writeFile(new URL(`${name}.json`, INHALT), JSON.stringify(daten, null, 2) + '\n');
const gibt = (name) => access(new URL(`${name}.json`, INHALT)).then(() => true, () => false);
const melden = (text) => console.log(`  ${text}`);

/** „Die Mittelgesichtsregion" → „die-mittelgesichtsregion" */
export function kennungAus(text) {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '');
}

/** Gültige Ziele — wie `ziel` in src/content/schema.ts */
const ZIEL = /^(\/[^\s"<>]*|#[^\s"<>]*|https?:\/\/[^\s"<>]+|mailto:[^\s"<>]+|tel:[+\d\s/()-]+)$/i;

/** Ein altes Verweisziel in die neue Form bringen; ungültige fallen weg */
function zielAus(alt, wo) {
  let z = (alt ?? '').trim();
  if (!z) return '';
  if (z.startsWith('#')) z = `/${z}`;
  if (/^www\./i.test(z)) z = `https://${z}`;
  if (!ZIEL.test(z)) {
    melden(`${wo}: Ziel „${alt}“ ist keine Adresse — entfällt`);
    return '';
  }
  return z;
}

/** Knopfzeile alt (link_* / pdf_*) → Knopfliste neu */
function knoepfeAus(e, wo) {
  const knoepfe = [];
  const link = zielAus(e.link_ziel, wo);
  if (link) knoepfe.push({ text: e.link_text?.trim() || 'Mehr erfahren', ziel: link });
  if (e.pdf_datei) knoepfe.push({ text: e.pdf_text?.trim() || 'PDF herunterladen', ziel: e.pdf_datei });
  return knoepfe;
}

const textAbschnitt = (felder) => ({
  art: 'text', id: 'text', titel: '', im_menue: false, text: '',
  bild: '', bild_alt: '', bild_seite: 'links', bild_hoehe: 'format',
  knoepfe_text: '', knoepfe: [], ...felder,
});

/* ================= Umzug ================= */

console.log('Umzug auf den Seitenaufbau');

const bereiche = (await gibt('bereiche')) ? await lesen('bereiche') : {
  _hinweis_fuer_die_redaktion:
    'Die eigenen Bereiche: Seiten (eigene Adresse), Blogs (Beiträge wie die Neuigkeiten) und Abschnitte auf der Startseite. Wo sie auf der Startseite stehen und ob sie im Menü erscheinen, steht in seitenaufbau.json. Die Kennungen (id) nach dem ersten Veröffentlichen nicht mehr ändern — sie sind Adressen.',
  eintraege: [],
};
const hat = (id) => bereiche.eintraege.some((b) => b.id === id);

/* --- Neuigkeiten → Blog --- */
if (await gibt('neuigkeiten')) {
  const n = await lesen('neuigkeiten');
  if (!hat('neuigkeiten')) {
    bereiche.eintraege.push({
      typ: 'blog',
      id: 'neuigkeiten',
      aktiv: true,
      titel: n.titel,
      kicker: 'Aktuelles',
      einleitung: n.einleitung ?? '',
      beitraege: n.eintraege.map((b) => ({
        id: b.id,
        aktiv: b.aktiv,
        datum: b.datum,
        titel: b.titel,
        kurz: b.kurz ?? '',
        bild: b.bild ?? '',
        bild_alt: b.bild_alt ?? '',
        abschnitte: b.inhalt?.trim() ? [textAbschnitt({ text: b.inhalt })] : [],
        dateien: (b.dateien ?? []).filter((d) => d.datei).map((d) => ({
          datei: d.datei, titel: d.titel ?? '', beschreibung: d.beschreibung ?? '',
        })),
      })),
    });
    melden(`Neuigkeiten → Blog mit ${n.eintraege.length} Beiträgen`);
  }
}

/* --- Freie Abschnitte → Startseiten-Bereiche --- */
const freieAbschnitte = [];
if (await gibt('abschnitte')) {
  const a = await lesen('abschnitte');
  for (const e of [...a.eintraege].sort((x, y) => x.position - y.position)) {
    freieAbschnitte.push(e.id);
    if (hat(e.id)) continue;
    const vergeben = new Set();
    const teile = (e.bereiche ?? []).map((b, i) => {
      let id = kennungAus(b.titel || '') || `teil-${i + 1}`;
      while (vergeben.has(id)) id += '-2';
      vergeben.add(id);
      return textAbschnitt({
        id, titel: b.titel ?? '', text: b.text ?? '', bild: b.bild ?? '', bild_alt: b.bild_alt ?? '',
        bild_seite: b.bild_seite ?? 'links', bild_hoehe: b.bild_hoehe ?? 'format',
      });
    });
    // Die Knopfzeile stand unter dem letzten Bereich — dort bleibt sie
    const knoepfe = knoepfeAus(e, `Abschnitt „${e.titel}“`);
    if (knoepfe.length || e.knoepfe_text) {
      if (!teile.length) teile.push(textAbschnitt({}));
      Object.assign(teile.at(-1), { knoepfe_text: e.knoepfe_text ?? '', knoepfe });
    }
    bereiche.eintraege.push({
      typ: 'abschnitt', id: e.id, aktiv: e.aktiv, titel: e.titel, kicker: 'Aus der Praxis', abschnitte: teile,
    });
    melden(`Abschnitt „${e.titel}“ → Bereich`);
  }
}

/* --- Navigation → Seitenaufbau --- */
if (!(await gibt('seitenaufbau'))) {
  const navi = (await gibt('navigation')) ? await lesen('navigation') : { eintraege: [] };
  const neuigkeitenAktiv = bereiche.eintraege.find((b) => b.id === 'neuigkeiten');
  /** Welcher Block gehört zu welchem alten Ziel */
  const zuBlock = {
    '#praxis': 'willkommen', '#galerie': 'galerie', '#leistungen': 'leistungen', '#team': 'team',
    '#stellen': 'stellen', '#contact': 'kontakt', '#neuigkeiten': 'neuigkeiten',
  };
  const menues = {};
  let sprechstunden = { titel: 'Sprechstunden', symbol: '/icons/navigation/oeffnungszeiten.svg', unterpunkte: [] };
  for (const e of navi.eintraege) {
    if (!e.aktiv || e.ziel.startsWith('tel:')) continue;
    const menue = { titel: e.titel, symbol: e.icon, unterpunkte: [] };
    if (e.ziel === '#oz_anchor') sprechstunden = menue;
    else if (zuBlock[e.ziel]) menues[zuBlock[e.ziel]] = menue;
    else melden(`Menüpunkt „${e.titel}“ (${e.ziel}) hat keinen Block — entfällt`);
  }
  const block = (id, art = id) => ({ id, art, aktiv: true, menue: menues[id] ?? null, ziel: '' });
  const bloecke = [
    block('willkommen'),
    block('galerie'),
    ...freieAbschnitte.map((id) => block(id, 'bereich')),
    block('leistungen'),
    ...(neuigkeitenAktiv ? [block('neuigkeiten', 'bereich')] : []),
    block('team'),
    block('stellen'),
    block('kontakt'),
  ];
  await schreiben('seitenaufbau', {
    _hinweis_fuer_die_redaktion:
      'Reihenfolge der Startseite und das Menü. Startbereich, Sprechstunden-Karte und Fuß stehen fest; die Blöcke dazwischen erscheinen in dieser Reihenfolge, und das Menü folgt ihr. Ein Block mit „menue“ steht im Menü — mit Bezeichnung, Symbol und Unterpunkten.',
    sprechstunden: { menue: sprechstunden },
    bloecke,
  });
  melden(`Seitenaufbau mit ${bloecke.length} Blöcken angelegt`);
}

/* --- Leistungen: Knopfliste, Kategorien ohne Symbol --- */
const leistungen = await lesen('leistungen');
for (const k of leistungen.kategorien) delete k.icon;
for (const e of leistungen.eintraege) {
  if ('link_ziel' in e || 'pdf_datei' in e || 'link_text' in e || 'pdf_text' in e) {
    e.knoepfe = knoepfeAus(e, `Leistung „${e.titel}“`);
    for (const alt of ['link_text', 'link_ziel', 'pdf_text', 'pdf_datei']) delete e[alt];
  }
  e.knoepfe_text ??= '';
  e.knoepfe ??= [];
}

/* --- Hinweis: Ziel als echte Adresse --- */
const hinweis = await lesen('hinweis');
hinweis.mehr_erfahren_ziel = zielAus(hinweis.mehr_erfahren_ziel, 'Hinweis');

/* ================= Inhalte (Wünsche der Praxis, Oktober 2026) ================= */

if (!ohneInhalte) {
  console.log('Inhaltsänderungen');

  // „Digitale Abformung statt Abformlöffel" entfällt — samt Platzhalter-Knopf „hallo"
  const digital = 'digitale-abformung-statt-abformloeffel';
  if (hat(digital)) {
    bereiche.eintraege = bereiche.eintraege.filter((b) => b.id !== digital);
    melden('Abschnitt „Digitale Abformung statt Abformlöffel“ entfernt');
  }

  // Kieferorthopädie: sachlicher, nah am Text der alten Seite
  const kfo = bereiche.eintraege.find((b) => b.id === 'kieferorthopaedie-unter-einem-dach');
  if (kfo && kfo.titel !== 'Kieferorthopädie in unserer Praxis') {
    kfo.titel = 'Kieferorthopädie in unserer Praxis';
    const teil = kfo.abschnitte[0] ?? textAbschnitt({});
    teil.text =
      '<p>An unsere Zahnarztpraxis ist eine kieferorthopädische Fachzahnarztpraxis angeschlossen. Neben der zahnärztlichen Versorgung führen wir daher auch kieferorthopädische Behandlungen durch – fachärztlich und mit langjähriger Erfahrung, bei Kindern und Jugendlichen ebenso wie bei Erwachsenen.</p>' +
      '<p>Die Kieferorthopädie befasst sich mit der Erkennung, Vorbeugung und Behandlung von Zahn- und Kieferfehlstellungen. Wir nutzen dabei das breite Spektrum der modernen Kieferorthopädie: von der klassischen Funktionskieferorthopädie über nahezu unsichtbare Kunststoffschienen (Aligner) bis hin zu festsitzenden Apparaturen.</p>';
    teil.knoepfe_text = 'Mehr zu den kieferorthopädischen Leistungen für Kinder, Jugendliche und Erwachsene:';
    teil.knoepfe = [
      { text: 'Zu den kieferorthopädischen Leistungen', ziel: '/#leistungen-kieferorthopaedie' },
      { text: 'Dentosophie', ziel: '/dentosophie/' },
    ];
    kfo.abschnitte = [teil];
    melden('Kieferorthopädie-Abschnitt neu formuliert');
  }

  // Schnarchen & Schlafapnoe zu den zahnärztlichen Leistungen; Kategorie „Test" aus
  const schnarchen = leistungen.eintraege.find((e) => e.id === 'schnarchen-schlafapnoe');
  if (schnarchen) {
    schnarchen.kategorie = 'zahnaerztlich';
    schnarchen.inhalt = schnarchen.inhalt.replace(
      /\(siehe „Mundatmung und ihre Folgen“\)/,
      '(siehe <a href="/dentosophie/#mundatmung">„Mundatmung und ihre Folgen“</a>)',
    );
  }
  const test = leistungen.kategorien.find((k) => k.id === 'test');
  if (test) test.aktiv = false;

  // Kieferorthopädie-Leistungen: Tippfehler und leere Absätze der alten Seite
  for (const e of leistungen.eintraege.filter((e) => e.id.startsWith('kieferorthopaedie-'))) {
    e.inhalt = e.inhalt
      .replace(/Alinger/g, 'Aligner')
      .replace(/Kombinations-therapie/g, 'Kombinationstherapie')
      .replace(/<p>‍<\/p>/g, '')
      .replace(/<br>‍?<\/li>/g, '</li>')
      .replace(/<br><\/p>/g, '</p>');
  }

  // Dentosophie: eigene Seite, angekündigt nach den Leistungen, im Menü daneben
  if (!hat('dentosophie')) {
    const dentosophie = JSON.parse(await readFile(new URL('umzug/dentosophie.json', import.meta.url), 'utf8'));
    bereiche.eintraege.push(dentosophie);
    melden('Seite „Dentosophie“ angelegt');
  }
}

/* ================= Schreiben ================= */

await schreiben('bereiche', bereiche);
await schreiben('leistungen', leistungen);
await schreiben('hinweis', hinweis);

// Seitenaufbau an die Bereiche angleichen
const aufbau = await lesen('seitenaufbau');
const ids = new Set(bereiche.eintraege.map((b) => b.id));
aufbau.bloecke = aufbau.bloecke.filter((b) => b.art !== 'bereich' || ids.has(b.id));
if (ids.has('dentosophie') && !aufbau.bloecke.some((b) => b.id === 'dentosophie')) {
  const nach = aufbau.bloecke.findIndex((b) => b.id === 'leistungen');
  aufbau.bloecke.splice(nach + 1, 0, {
    id: 'dentosophie', art: 'bereich', aktiv: true, ziel: '',
    menue: { titel: 'Dentosophie', symbol: '/icons/navigation/dentosophie.svg', unterpunkte: [] },
  });
  melden('Dentosophie in den Seitenplan nach den Leistungen gesetzt');
}
await schreiben('seitenaufbau', aufbau);

for (const alt of ['navigation', 'neuigkeiten', 'abschnitte']) {
  if (await gibt(alt)) {
    await rm(new URL(`${alt}.json`, INHALT));
    melden(`${alt}.json entfernt`);
  }
}
console.log('Fertig.');
