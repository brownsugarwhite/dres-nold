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
- **Handys (14. September 2026):** dieselbe scrollgesteuerte Blase in
  normaler Schriftgröße. Sie ist **kein Rollkasten**; ragt sie oben
  hinaus, kommt der Rest beim Weiterscrollen zum Vorschein. Der
  Scrollweg ist dort länger (450vh statt 350vh), damit das große Logo
  Zeit hat, sich aufzulösen, bevor die Blase darüberfährt.
- **Leistenwechsel (14. September 2026):** Die Leisten tauschen in dem
  Moment, in dem der Zipfel beginnt, sich einzuziehen (71 % von Ablauf
  a-19) — nicht erst, wenn er verschwunden ist. **Im selben Moment wird
  die Blase freigegeben** und scrollt mit dem Inhalt weiter.
- Der Öffnungszeiten-Knopf (Symbolleiste und Menü) scrollt sanft zu
  dem Punkt, an dem die Blase mit Zipfel steht.

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

**Einwilligung (geändert am 14. September 2026):** Das
Einwilligungs-Banner beim Seitenaufruf ist wieder entfallen. Es bleibt
allein bei der Klick-Vorschau: Vor der Zustimmung steht ein selbst
gehostetes Vorschaubild mit dem Knopf „Karte laden"; erst ein Klick
darauf holt die Karte von Google. Bis dahin lädt die Seite nichts von
fremden Servern — deshalb braucht sie kein Banner. Eine einmal erteilte
Zustimmung merkt der Browser und lässt sich im Fußbereich
zurücknehmen.

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
- Schrift: **Source Sans 3** für die ganze Seite, selbst gehostet.
  Myriad Pro selbst ist nicht möglich (Adobe hostet nur selbst und
  verbietet das Selbsthosten); Source Sans stammt vom selben Gestalter
  und ist als Myriad-Ersatz entworfen. Ein Versuch mit Poppins für die
  Überschriften lief einen Tag und wurde zurückgenommen — zu
  geometrisch, zu weit von der Vorlage (15. September 2026)
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

## Handy-Menü (14. September 2026)

„Leistungen" klappt im Handy-Menü **an Ort und Stelle als Akkordeon**
auf und zeigt die Kategorien (wie die Blase auf dem Desktop) — keine
zweite Ebene, kein Schließen des Menüs. Sprungmarken auf der Seite
werden **sanft angescrollt**, mit Platz für die Kopfleiste.

## Menü-Rollover (13. September 2026)

Wie Webflow a-18: rollt beim Zeigen einmal hoch und läuft beim
Verlassen **nicht** zurück.

## Feinschliff (14. September 2026)

Aus Florians Durchsicht der fertigen Seite:

- **Schrift:** Eine Schrift für alles — Source Sans 3. Das Token
  `--schrift-titel` bleibt als Einstiegspunkt bestehen, falls die
  Überschriften später doch eine zweite Schrift bekommen sollen.
- **Sprechstunden:** längerer Zipfel auf dem Desktop, mehr Luft
  zwischen den drei Spalten, kräftigere Spaltenüberschriften, graue
  Wochentage, vollwertige Überschrift mit Beschreibungstext und ein
  Schließen-Kreuz wie in der mobilen Vorlage. Es „schließt" die Blase,
  indem es an den Praxis-Bereich darunter scrollt.
- **Praxisbilder:** Format wie die alte Seite (feste Höhe statt
  quadratischem Zuschnitt). Das Band läuft weiter endlos durch; die
  Punkte darunter zeigen nur an, wo es steht, und springen auf Klick
  dorthin. Kein schrittweiser Slider.
- **Freie Abschnitte:** Breite in der Redaktion wählbar — schmal
  (46 rem, wie eine aufgeklappte Leistung) oder breit (volle
  Inhaltsbreite). Bilder stehen über die volle Breite, ohne Rundung,
  und lassen sich direkt in den Fließtext setzen.
- **Startseitentexte:** Überschriften und Einleitungen aller Abschnitte
  liegen in `src/content/startseite.json` und sind über die Redaktion
  pflegbar. Kategorien der Leistungen haben zusätzlich einen Erklärtext.
- **Trennlinien:** ausprobiert und wieder verworfen — die Seite bleibt
  ohne graue Linien zwischen den Abschnitten.
- **Übergänge:** eine durchgehende Bewegung statt Hüpfer und Sprung.
  Der Fließtext der Zielseite trägt keinen eigenen Übergangsnamen mehr
  und wächst mit der Karte. Beim Blättern schieben sich die Karten
  vollständig seitlich durch. Bei den Neuigkeiten wandert das Bild
  wirklich (kein Überblenden), und der Text der Vorschaukarte blendet
  unten aus, während der Seitenkopf oben einblendet.
- **Kontaktformular:** keine Kästen mehr, sondern feine Grundlinien,
  unter denen sich beim Hineinklicken eine Linie in der Hausfarbe
  zeichnet. Sendeknopf als Pille mit gleitendem Pfeil, Bestätigung als
  gezeichneter Kreis mit Haken.

## Schrift und Textfarben (15. September 2026)

- **Eine Schrift:** Source Sans 3 trägt Fließtext und Überschriften.
  Poppins ist wieder raus (siehe oben).
- **Ein Grauton-Verlauf:** Vorher lagen drei unabhängige Grautöne
  nebeneinander — ein kühles Blaugrau (#758696), ein neutrales
  (#5c5e61) und ein warmes (#554d53). Jetzt eine Familie, abgestimmt
  auf das Aubergine: `--farbe-text: #4d434b` (9,5:1 auf Weiß),
  `--farbe-text-gedeckt: #766c74` (5,0:1). Das alte #758696 lag mit
  3,75:1 unter der Vorgabe von 4,5:1.
- **Karten ohne eigene Fläche:** Leistungskacheln und
  Neuigkeiten-Karten haben keinen eigenen Hintergrund mehr, nur ihren
  Rahmen. Die Bereiche darunter bleiben weiß.
- **Öffnungszeiten** stehen zusätzlich in der Kopfleiste.
