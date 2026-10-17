/**
 * Abgelöst durch /api/alles (Oktober 2026). Ein Redaktionsfenster, das
 * noch die alte Fassung offen hat, bekommt eine klare Meldung.
 */
export function onRequestGet(): Response {
  return new Response(JSON.stringify({ fehler: 'Die Redaktion wurde erneuert. Bitte die Seite neu laden.' }), {
    status: 410,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
