# Referenzmaterial der alten Webflow-Seite

Vollständige Sicherung der bestehenden Seite — **ohne Webflow-Code-Export**.
Alles hier stammt direkt von der ausgelieferten Live-Seite und ist damit
unabhängig davon, wie lange das Webflow-Abo noch läuft.

| Datei / Ordner | Inhalt |
|---|---|
| `live-home.html` | Ausgeliefertes HTML der Startseite |
| `live-datenschutz.html` | Ausgeliefertes HTML der Datenschutzseite |
| `live-webflow.css` | Vollständiges Stylesheet (Quelle der Design-Tokens) |
| `assets/` | 37 Dateien: 20 Fotos, 11 Icons, 3 Lottie-Animationen, 3 PNG |
| `animationen-sichern.js` | Holt die Animationsdefinitionen aus der laufenden Seite |

## Warum kein Webflow-Export nötig ist

| Was gebraucht wird | Woher |
|---|---|
| Aufbau und Texte | `live-home.html` |
| Farben, Schriftgrößen, Abstände | `live-webflow.css` |
| Inhalte der CMS-Sammlungen | aus dem gerenderten HTML lesbar |
| Bilder, Icons, Lottie | `assets/` |
| Animationen | `animationen-sichern.js` — 31 Auslöser, 24 Abläufe |
| Team-Fotos in Originalqualität | lokal: `iCloud/dresNold25/team/teamFinal` |

## Wichtig

Dies ist **Vorlage, kein Produktivcode**. Nichts hieraus wird übernommen —
der Neubau orientiert sich daran, verwendet aber eigenen, sauberen Code.
Siehe `CLAUDE.md`.
