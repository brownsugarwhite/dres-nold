/**
 * Was für ein Ziel ein Verweis hat — danach richtet sich, wie er sich
 * verhält: Dateien laden herunter, fremde Seiten öffnen in einem neuen
 * Fenster, alles andere bleibt auf dieser Seite (und wird je nach Lage
 * angescrollt oder mit Übergang geöffnet, scripts/anker.ts).
 */
import { trennenHtml } from './silben';

export type VerweisArt = 'intern' | 'datei' | 'extern' | 'kontakt';

export function verweisArt(ziel: string): VerweisArt {
  if (/^(mailto|tel):/i.test(ziel)) return 'kontakt';
  if (/^https?:/i.test(ziel)) return 'extern';
  // Eine Adresse mit Dateiendung ist eine Datei (/dokumente/flyer.pdf)
  if (/\.[a-z0-9]{2,5}$/i.test(ziel.split('#')[0])) return 'datei';
  return 'intern';
}

/**
 * Verweise in Redaktionstext (HTML) nach draußen bekommen ein neues
 * Fenster und den Hinweis für Vorleseprogramme; Dateien laden herunter.
 * Läuft beim Bauen über jeden Redaktionstext.
 */
export function verweiseAufbereiten(html: string): string {
  return html.replace(/<a href="([^"]*)">([\s\S]*?)<\/a>/g, (ganz, ziel: string, inhalt: string) => {
    const art = verweisArt(ziel.replace(/&amp;/g, '&'));
    if (art === 'extern') {
      return `<a href="${ziel}" target="_blank" rel="noopener">${inhalt}<span class="nur-vorleser"> (öffnet in neuem Fenster)</span></a>`;
    }
    if (art === 'datei') return `<a href="${ziel}" download>${inhalt}</a>`;
    return ganz;
  });
}

/** Redaktionstext fertig für die Seite: Silbentrennung und Verweise */
export const redaktionsHtml = (html: string) => verweiseAufbereiten(trennenHtml(html));
