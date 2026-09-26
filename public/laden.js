/*
  Erster Aufbau der Startseite (Florian, 26. September 2026):
  Nichts blitzt auf. Die Seite beginnt weiß, das Logo zeichnet sich ein
  (Lottie in Startbereich.astro), und erst wenn es halb steht, blenden
  Kontaktzeile, Symbolleiste, Scrollhinweis und Hinweis-Karte ein —
  scharf werdend aus einer Unschärfe (styles/global.css, „Erster
  Seitenaufbau").

  Dieses Skript setzt dafür VOR dem ersten Bild `data-laden="wartet"`
  an <html>. Es muss deshalb blockierend im <head> stehen — und als
  eigene Datei, weil die Content-Security-Policy (public/_headers) keine
  eingebetteten Skripte erlaubt.

  Zustände von `data-laden`:
    (keins)   alles sichtbar — Unterseiten, Seitenwechsel per Router,
              reduzierte Bewegung, Aufruf mit Sprungmarke, ohne JavaScript
    wartet    die Elemente sind unsichtbar und weichgezeichnet
    da        sie blenden ein (setzt Startbereich.astro, wenn das Logo
              halb gezeichnet ist — oder das Sicherheitsnetz hier unten)
*/
(function () {
  /* Läuft nur beim ersten Aufbau des Dokuments. Bei einem Seitenwechsel
     per Router führt Astro dieses Skript nicht erneut aus; falls doch,
     ist das Dokument längst geladen. */
  if (document.readyState !== 'loading') return;
  /* Nur die Startseite, und nur ohne Sprungmarke — wer bei „#team"
     landet, sieht das Logo gar nicht. */
  if (location.pathname !== '/' || (location.hash && location.hash !== '#start')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var wurzel = document.documentElement;
  wurzel.setAttribute('data-laden', 'wartet');

  /* Ein Neuladen mit gemerkter Scrollposition: Der Browser scrollt gleich
     nach unten — dann sofort alles zeigen, ohne Übergang; das Logo
     übernimmt fertig gezeichnet (Startbereich.astro). */
  window.addEventListener('scroll', function () {
    if (wurzel.getAttribute('data-laden') === 'wartet') wurzel.removeAttribute('data-laden');
  }, { once: true, passive: true });

  /* Sicherheitsnetz: Kommt die Logo-Animation nicht in Gang (langsames
     Netz, Fehler im Modulbündel), erscheint nach 2,5 s trotzdem alles —
     dann mit dem statischen Logo. */
  window.setTimeout(function () {
    if (wurzel.getAttribute('data-laden') === 'wartet') wurzel.setAttribute('data-laden', 'da');
  }, 2500);
})();
