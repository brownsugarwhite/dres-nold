/**
 * Kleine Werkzeuge der Redaktion: Elemente bauen, Kennungen bilden,
 * Anfragen an die Schnittstellen.
 */

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  eigenschaften: Partial<HTMLElementTagNameMap[K]> & { class?: string; text?: string; [attr: `data-${string}` | `aria-${string}`]: string } = {},
  kinder: (Node | string | null | undefined | false)[] = [],
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  const { class: klasse, text, ...rest } = eigenschaften as Record<string, unknown>;
  if (klasse) e.className = String(klasse);
  if (text) e.textContent = String(text);
  for (const [name, wert] of Object.entries(rest)) {
    if (name.startsWith('data-') || name.startsWith('aria-')) e.setAttribute(name, String(wert));
    else (e as unknown as Record<string, unknown>)[name] = wert;
  }
  for (const k of kinder) if (k != null && k !== false) e.append(k);
  return e;
}

let zaehler = 0;
export const neueId = () => `f${++zaehler}`;

/** „Zahnärztliche Prophylaxe" → „zahnaerztliche-prophylaxe" */
export function kennungAus(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '');
}

/** Eine Kennung, die es in `vergeben` noch nicht gibt: name, name-2 … */
export function freieKennung(wunsch: string, vergeben: Iterable<string>, ersatz = 'abschnitt'): string {
  const belegt = new Set(vergeben);
  const stamm = kennungAus(wunsch) || ersatz;
  let k = stamm;
  for (let n = 2; belegt.has(k); n++) k = `${stamm}-${n}`;
  return k;
}

/** Tiefe Kopie eines JSON-Werts */
export const kopie = <T>(wert: T): T => JSON.parse(JSON.stringify(wert)) as T;

/* ------------------------------------------------------------------ */
/* Anfragen an die Schnittstellen                                      */
/* ------------------------------------------------------------------ */

/**
 * Sagt, warum eine Anfrage abgewiesen wurde — die drei Fälle sehen für
 * den Bediener gleich aus, verlangen aber ganz Verschiedenes.
 *
 *   Umleitung   Cloudflare Access hat die Anfrage abgefangen: nicht (mehr)
 *               angemeldet. Hilft: neu anmelden.
 *   401         Access hat durchgelassen, aber die eigene Prüfung in
 *               functions/_middleware.ts erkennt das Token nicht an.
 *               Neu anmelden hilft dann NICHT — meist stimmt ACCESS_AUD
 *               oder ACCESS_TEAM in den Pages-Einstellungen nicht mehr
 *               mit der Access-Anwendung überein (docs/betrieb.md).
 *   403         Angemeldet, aber nicht berechtigt.
 */
export function abweisungErklaeren(antwort: Response): string {
  const weiter = ' Ihre Eingaben stehen noch hier — es geht nichts verloren.';
  if (antwort.status === 401) {
    return 'Der Server hat die Anmeldung nicht anerkannt (401). Erneutes Anmelden '
      + 'hilft hier nicht: In den Einstellungen der Seite stimmt die Kennung der '
      + 'Anmelde-Anwendung nicht mehr (ACCESS_AUD / ACCESS_TEAM). Bitte an die '
      + 'Betreuung der Seite wenden.' + weiter;
  }
  if (antwort.status === 403) {
    return 'Dieser Zugang darf die Redaktion nicht ändern (403). Bitte an die '
      + 'Betreuung der Seite wenden.' + weiter;
  }
  return 'Die Anmeldung ist abgelaufen. Bitte in einem neuen Tab /login öffnen, '
    + 'anmelden — und dann hier noch einmal auf „Veröffentlichen" drücken.' + weiter;
}

/**
 * Anfrage an /api/… — mit `redirect: 'manual'`.
 *
 * Läuft die Anmeldung ab, antwortet Cloudflare Access nicht mit einem
 * Fehler, sondern mit einer Umleitung auf seine Anmeldeseite. Die liegt
 * auf einem anderen Server; folgt der Browser ihr, bricht er die
 * Anfrage aus Sicherheitsgründen ab — in der Redaktion kam dann
 * „Keine Verbindung" an, obwohl die Verbindung stand (Florian,
 * 17. September 2026). Mit `redirect: 'manual'` kommt die Umleitung als
 * `opaqueredirect` zurück und ist erkennbar.
 */
export function anfrage(pfad: string, optionen: RequestInit = {}): Promise<Response> {
  return fetch(pfad, { redirect: 'manual', ...optionen });
}

/** Steht die Anmeldung noch? */
export function angemeldet(antwort: Response): boolean {
  return antwort.type !== 'opaqueredirect' && antwort.status !== 401 && antwort.status !== 403;
}

/**
 * Antwort als JSON lesen. Kommt kein JSON — etwa eine Fehlerseite des
 * Servers —, sagt die Meldung wenigstens, welcher Status kam.
 */
export async function alsJson<T>(antwort: Response): Promise<T> {
  const text = await antwort.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Unerwartete Antwort vom Server (${antwort.status || 'keine Angabe'}).`);
  }
}

/**
 * Lädt eine Datei hoch (functions/api/hochladen.ts) und liefert ihren
 * Pfad. Bis die Seite neu gebaut ist, gibt es die Datei unter diesem
 * Pfad noch nicht — die Vorschau nimmt so lange die Datei aus dem
 * Browser (`vorschauVon`).
 */
const lokaleVorschau = new Map<string, string>();
export const vorschauVon = (pfad: string) => lokaleVorschau.get(pfad) ?? pfad;

export async function hochladen(datei: File, ordner: string): Promise<string> {
  const form = new FormData();
  form.append('datei', datei);
  form.append('ordner', ordner);
  const antwort = await anfrage('/api/hochladen', { method: 'POST', body: form });
  if (!angemeldet(antwort)) throw new Error(abweisungErklaeren(antwort));
  const ergebnis = await alsJson<{ ok: boolean; pfad?: string; fehler?: string }>(antwort);
  if (!ergebnis.ok || !ergebnis.pfad) throw new Error(ergebnis.fehler || 'Hochladen fehlgeschlagen.');
  lokaleVorschau.set(ergebnis.pfad, URL.createObjectURL(datei));
  return ergebnis.pfad;
}

/** Was schon hochgeladen ist (functions/api/dateien.ts) */
export async function dateienLesen(ordner: string): Promise<{ pfad: string; name: string; groesse: number }[]> {
  const antwort = await anfrage(`/api/dateien?ordner=${encodeURIComponent(ordner)}`);
  if (!angemeldet(antwort)) throw new Error(abweisungErklaeren(antwort));
  const ergebnis = await alsJson<{ dateien?: { pfad: string; name: string; groesse: number }[]; fehler?: string }>(antwort);
  if (!ergebnis.dateien) throw new Error(ergebnis.fehler || 'Liste nicht lesbar');
  return ergebnis.dateien;
}

/** „1,2 MB" */
export function groesseText(bytes: number): string {
  return bytes > 1e6 ? `${(bytes / 1e6).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(bytes / 1e3))} KB`;
}

/** Eine kurze Ansage für Vorleseprogramme (z. B. nach dem Verschieben) */
export function ansagen(text: string): void {
  const region = document.querySelector<HTMLElement>('[data-ansage]');
  if (!region) return;
  region.textContent = '';
  requestAnimationFrame(() => { region.textContent = text; });
}
