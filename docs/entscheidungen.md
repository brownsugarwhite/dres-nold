# Entscheidungen von Florian

**Diese Datei hat Vorrang vor `referenz/erfassung.md`.**
Dort steht, was die alte Seite tut. Hier steht, was wir davon abweichend
wollen. Bei Widerspruch gilt diese Datei.

Vor jedem Arbeitsschritt lesen.

---

## Öffnungszeiten

**Auf allen Bildschirmgrößen die mobile Lösung** — scrollgesteuerte Blase
mit Lottie-Zipfel, nicht die beiden versetzten Kästen der Desktop-Vorlage.

- Die drei Listen stehen auf dem Desktop **nebeneinander**, mobil untereinander
- Der Öffnungszeiten-Knopf steht auf dem Desktop **rechts außen**,
  mobil als letzter von drei Knöpfen (Kontakt · Telefon · Öffnungszeiten)
- Die **Telefonnummer erscheint nur auf Handys** in der Symbolleiste;
  auf dem Desktop steht sie in der Kontaktzeile oben. Auf dem Desktop
  also sechs Knöpfe: Kontakt · Praxis · Leistungen · Team ·
  Neuigkeiten · Öffnungszeiten
- Zipfel und Menüwechsel exakt getaktet wie in der mobilen Vorlage
- **Zipfel (13. September 2026):** eigene SVG-Zeichnung statt Lottie.
  Die Grundlinie läuft von Fensterrand zu Fensterrand, die Spitze zeigt
  auf die gemessene Mitte des Öffnungszeiten-Knopfs. Länge mobil 154 px
  (Vorlage), auf dem Desktop 90 px
- Der Bereich sitzt direkt nach dem Logobereich
- Der graue Symbolgrund erst unterhalb der Öffnungszeiten

## Leistungen

**Eigene Seiten statt Aufklapp-Liste.** Jede Leistung unter
`/leistungen/<id>`, die sich beim Öffnen ins Vollbild morpht.
Im Menü ein zweispaltiges Aufklappmenü — links Zahnmedizin,
rechts Kieferorthopädie. Die Übersicht bleibt auf der Startseite.

**Layout der Übersicht: Kachelraster bleibt.** Nicht die Aufklapp-Liste
der Vorlage nachbauen. Feinschliff später.

## Neuigkeiten

Neuer Bereich, den es in der Vorlage nicht gibt. Chronologisch, neueste
zuerst. Je Beitrag: Bild, Überschrift, Fließtext mit Aufzählungen **und
Tabellen**, dazu PDF-Anhänge zum Herunterladen, möglichst mit Vorschau.
Blendet sich samt Menüpunkt aus, wenn kein Beitrag aktiv ist.

## Entfallene Abläufe der Vorlage

Diese Animationen werden bewusst **nicht** nachgebaut:

| Ablauf | Grund |
|---|---|
| `a-32` / `a-33` | Öffnungszeiten Desktop — ersetzt durch die mobile Lösung |
| `a-37` / `a-38` | Info-Bereich ein/aus — ersetzt durch den Neuigkeiten-Bereich |

## Kontakt (Stand 13. September 2026)

Adresse zweispaltig wie die alte Seite. Darunter **links eine echte
Google-Maps-Karte, rechts ein Kontaktformular** (Name, E-Mail, Telefon,
Nachricht, Datenschutz-Häkchen — keine Gesundheitsdaten). Versand über
Resend an info@dres-nold.de.

**Einwilligung:** Die Google-Karte lädt erst nach Zustimmung. Florian
hat sich bewusst für Google Maps samt eigenem, schlichtem
Einwilligungs-Banner (ohne Fremdskript) entschieden — gegen die
ursprüngliche Festlegung „kein Cookie-Banner". Vor der Zustimmung steht
ein selbst gehostetes Vorschaubild; Widerruf über
„Datenschutz-Einstellungen" im Fußbereich.

**Der Briefumschlag entfällt** — er gehörte zu einem provisorischen
Neuigkeiten-Bereich, den der neue Bereich ersetzt.

## Freie Abschnitte

Beliebig viele Zusatzabschnitte im Praxis-Bereich, **ohne eigenen
Menüeintrag**. Je Abschnitt: Titel, Text, optional Bild, optional Link
*oder* PDF-Download.

## Stellenanzeigen

Eigener Bereich, von der Praxis pflegbar, blendet sich aus wenn leer.

## Technik

- Analytics **cookielos** (Cloudflare Web Analytics), kein Google Analytics
- Barrierefrei nach WCAG 2.1 AA
- Schrift: Source Sans 3 selbst gehostet
- Sauberer Neubau, kein Webflow-Export als Codebasis
- Keine externen Ressourcen — Voraussetzung dafür, dass kein Cookie-Banner nötig ist

## Symbole

Für neue Navigationspunkte durfte ich vorhandene Symbole verwenden;
Florian liefert später eigene. Das News-Symbol war bereits im
Webflow-CSS vorhanden und wird genutzt.

Die geplante eigene Lottie-Datei für den Zipfel ist nicht mehr nötig —
er wird als SVG gezeichnet (siehe Öffnungszeiten).

## Team (13. September 2026)

Genau wie das Original: Ärzte 300 px hoch in drei Spalten, Mitarbeitende
als 260-px-Karten, weißer Pfeil und Schattensaum an der Unterkante,
Scroll-Ablauf (Ausschnitt 80 → 100 %, Skalierung 1,2 → 1). Die
Tätigkeiten stehen als Liste `taetigkeiten` in team.json und klappen
beim Klick auf den Namen auf (zugeklappt: Name + Funktion + Pfeil).

## Seitenwechsel (13. September 2026)

Die geklickte Karte hebt sich ab, der Rest der Seite verschwimmt, die
Karte wächst zur Seite; Symbol und Titel wandern einzeln, der Text
gleitet nach. Schließen-Kreuz, „Alle Leistungen" und Escape gehen im
Verlauf zurück — derselbe Ablauf rückwärts, alte Scrollposition.

## Menü-Rollover (13. September 2026)

Wie Webflow a-18: rollt beim Zeigen einmal hoch und läuft beim
Verlassen **nicht** zurück.
