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

## Gestaltungs-Handoff (17. September 2026)

Florian hat die Startseite mit einem Entwurf überarbeitet
(`design_handoff_startseite/`). Übernommen sind Typografie, Grautöne,
Abstände, Knöpfe, Kacheln und der Aufbau der Abschnitte. **Diese Punkte
aus dem Entwurf ausdrücklich NICHT:**

| Im Entwurf | Hier stattdessen |
|---|---|
| Logo auf grauem Kachelgrund | **Weiß** — der graue Symbolgrund (`.fixedbg` der Vorlage) entfällt auf der ganzen Seite, auch hinter dem Kontaktbereich |
| Sprechzeiten in drei Kästen | Die **scrollgesteuerte Blase mit Zipfel** bleibt (siehe oben). Neu ist nur ihre **Stelle**: unter Begrüßung und Bilderband. Der Schnalz und der Leistenwechsel geschehen dadurch später |
| Kachel-Schatten beim Zeigen | Nur **Rahmen in der Hausfarbe und 3 px Anhebung** wie bisher; die Bewegung *innerhalb* der Kachel (Symbol wächst) ist übernommen |
| Knopf wird beim Zeigen breiter | **Er behält seine Größe.** Nur die runde Fläche geht auf und die Schrift wechselt die Farbe. Nebeneinander stehende Knöpfe schoben sich sonst gegenseitig an |
| — | **Morph-Seitenwechsel und das Aufklappmenü mit Blasenlinie bleiben unangetastet** |
| Kräftiger Verlauf über dem Team-Banner | Ein **sehr leichter** Schleier, nur so viel wie die Lesbarkeit braucht. Die Bewegung des Banners (a-3) bleibt |
| Ärzte im 3:4-Format über die volle Breite | **Kleiner, in der bisherigen Größenordnung** (280 px hoch) und **alles linksbündig** |
| Neuigkeiten ohne Bildbewegung | **Bild wächst beim Zeigen** — die angeklickte Karte gibt die Vergrößerung vor der Momentaufnahme wieder ab, damit der Morph sauber startet. Dazu kommt die Skalierung beim Scrollen (a-3, siehe unten) |
| Formularfelder mit festem Label darüber | Die **bisherigen Felder mit wanderndem Label und gezeichneter Linie** bleiben, alles auf Weiß |
| Karte mit Schatten | **Ohne Schatten**; der Einwilligungshinweis steht in der Karte, nicht am Seitenanfang |
| Logo in der Kopfleiste 56 px | **80 px wie bisher** (Florian, 17. September 2026) |

Weitere Festlegungen aus demselben Durchgang:

- **Alles linksbündig** außer Startbereich, Begrüßung und Hinweis.
- Die **Hinweis-Sprechblase behält ihre Form** (Zipfel, News-Symbol,
  Einflug von links). Übernommen sind Kicker, die leichte Überschrift
  und der Knopf. — **Überholt am 18. September 2026**, siehe „Der
  Hinweis wird eine Karte" weiter unten.
- Der **Scrollweg der Sprechstunden** bleibt bei 350vh (mobil 450vh) —
  siehe weiter unten, „Der Einstieg ist eine Karte".
- **Ablauf a-8 der Leistungskacheln bleibt vollständig** — mit beiden
  Teilen: Die Kacheln wachsen beim Hereinscrollen von 0,9 auf 1 **und**
  ihr Grund hellt dabei von Grau auf Weiß auf; am Ende des Wegs beides
  wieder zurück. Der Ablauf war kurz durch das Einblenden aus 18 px
  Tiefe (`data-rein`) ersetzt und das Aufhellen ganz gestrichen — beides
  war zu wenig (Florian, 17. September 2026). Die übrigen Abschnitte
  blenden weiterhin ein.

  Der Grauton ist `--farbe-flaeche-kachel` (#f1eef0): derselbe
  Helligkeitsschritt wie das #f1f1f1 der Vorlage, nur in die
  Aubergine-Familie gedreht. Die gedeckte Fläche (#f4f2f3) wäre für die
  Bewegung zu schwach gewesen. In Ruhe steht die Kachel auf Weiß — die
  Festlegung „Kacheln ohne eigene Fläche" bleibt damit gewahrt.
- **Die Beitragsbilder der Neuigkeiten skalieren beim Scrollen** wie das
  Gruppenfoto im Team (Ablauf a-3): über den Scrollweg von 1 auf 1,1,
  mit demselben weichen Nachlauf (Florian, 17. September 2026). Die
  Vergrößerung beim Zeigen bleibt daneben bestehen; damit sich beide
  nicht in denselben `transform` drängen, liegt zwischen Ausschnitt und
  Bild eine dritte Ebene (`.beitrag__lauf`), die nur die Scrollbewegung
  trägt.
- **Offen:** Die beiden Knöpfe der Begrüßung stehen fest im Code.

### Nachjustierung am selben Tag

- **Inhaltsbreite 1360 px** wie im Entwurf. Zwischendurch stand sie auf
  1200 px; seit das Bilderband in der Einstiegskarte steckt und damit
  nur noch so breit ist wie der Inhalt, wirkte das eingeengt.
- **Sprechstunden:** Kicker „Sprechstunden", Überschrift „Wann Sie uns
  antreffen", Einleitung über die volle Breite der Blase (nicht auf
  Lesebreite), mehr Luft zur gestrichelten Grundlinie. Im Menü heißt
  der Punkt jetzt ebenfalls **Sprechstunden**.

  **Die Blase bleibt ganz oben im Dokument, mit ihrem bisherigen
  Scrollweg (Ablauf a-19).** Zwei Versuche am 17. September 2026,
  sie unter das Bilderband zu setzen — einmal mit dem alten Ablauf,
  einmal mit einer neu gerechneten Bewegung im Seitenfluss — sind beide
  zurückgenommen. Die Blase lebt davon, dass sie über das fest stehende
  Logo hereinfährt; weiter unten hat sie nichts, worüber sie fahren
  könnte, und alles wirkt gesucht.

- **Reihenfolge unten:** Neuigkeiten stehen VOR dem Team.
- **Listen und Tabellen** im Redaktionstext folgen überall dem Handoff:
  nummerierte Listen als Zeilen auf Haarlinien mit leiser `01`,
  Aufzählungen mit 3-px-Punkt, Tabellen mit gesperrter Kopfzeile und
  Zeilenlinien. Kein Einzug, keine Systempunkte.
- **Team:** Beide Raster füllen die Inhaltsbreite aus und haben
  Abstände; die Fotos füllen ihre Spalte (`object-fit: cover`, oben
  verankert) und sind dadurch größer. Der Schattensaum liegt jetzt
  AUSSERHALB des beschnittenen Rahmens und reicht eine halbe Lücke nach
  links und rechts über die Karte hinaus — so ergibt er eine
  durchgehende Linie pro Reihe. An den Reihenenden läuft er 64 px über
  die Inhaltsbreite hinaus aus.
- **Neuigkeiten** wieder ganz ohne Rahmen: Bild, Text darunter, sonst
  nichts. Zusammengehalten wird die Karte allein von der Bewegung.
- **Fußbereich** ohne Logo und schmal.
- **Pfeilspitzen** (`pfeil-runter.svg` und die Haken in den Textlinks)
  tragen `vector-effect: non-scaling-stroke` bei 1,5 px. Vorher war die
  Strichstärke im Koordinatensystem der Zeichnung definiert und schrumpfte
  in einem 13 px breiten Kasten auf einen Viertelpixel — deutlich feiner
  als die Schrift daneben.

## Freie Abschnitte: Bild neben Text (17. September 2026)

Ein freier Abschnitt hat eine Überschrift und darunter einen oder
mehrere **Bereiche**. Jeder Bereich zeigt ein Bild **neben** seinem
Text; in der Redaktion ist nur zu wählen, ob es links oder rechts
steht. Der Text umfließt kein Bild mehr.

Mehrere Bereiche ergeben einen langen Abschnitt mit mehreren Bildern.
Ab dem zweiten Bereich ist eine Zwischenüberschrift sinnvoll; beim
ersten steht schon die Überschrift des Abschnitts darüber.

Damit entfallen zwei Dinge von früher:

- **`breite` (schmal / breit)** — der Abschnitt nutzt immer die volle
  Inhaltsbreite, weil er zwei Spalten trägt.
- **Bilder im Fließtext** — der Knopf „Bild" ist in diesem Textfeld
  nicht mehr da. Ein zweiter Weg, Bilder einzusetzen, wäre neben dem
  eigenen Bildfeld nur verwirrend; für ein weiteres Bild legt man einen
  weiteren Bereich an.

Die Bildbeschreibung ist Pflicht, sobald ein Bild gewählt ist — das
prüft `schema.ts` und meldet es beim Speichern.

## Der Einstieg ist eine Karte (17. September 2026)

Begrüßung, Bilderband und Sprechstunden stecken **gemeinsam in der
Sprechblase** und fahren als eine Karte über das fest stehende Logo
herein (`src/components/Oeffnungszeiten.astro`).

Der Weg dahin, damit es niemand noch einmal versucht:

1. Erst standen Begrüßung und Band als eigene Abschnitte im Fluss und
   nur die Blase fuhr herein — sie musste dafür ganz oben stehen und
   stand damit **vor** der Begrüßung. Falsche Reihenfolge.
2. Dann wurde die Blase unter das Band gesetzt. Dort hat sie nichts,
   worüber sie fahren könnte; zwischen Band und Blase klaffte eine
   leere Fläche.
3. Dann wurde ihre Bewegung neu gerechnet (Rückstand statt absoluter
   Position). Technisch sauber, aber die Blase lebt nun einmal vom
   Logo darunter.

Die Lösung ist Florians: **alles in einen Behälter.** Weil die Karte
höher ist als das Fenster, sieht man beim Hereinfahren zuerst ihren
Kopf (die Begrüßung) und zuletzt ihren Fuß (die Zeiten) — die
Leserichtung stimmt also von selbst. In der Ruhelage steht ihr Fuß
knapp über der Symbolleiste, der Zipfel zeigt auf den
Sprechstunden-Knopf, dann schnalzt er zurück und die Karte scrollt mit
dem Inhalt weiter.

**Folgen, an die man denken muss:**

- Der Startwert der Bewegung wächst mit der Kartenhöhe
  (`startBestimmen()`), sonst stünde die Karte beim Laden schon im Bild.
- `#praxis` und `#galerie` liegen IN der Karte. Sie lassen sich nicht
  messen, sondern werden über die umgekehrte Bewegungskurve in eine
  Scrolltiefe umgerechnet (`scripts/anker.ts`, `tiefeInKarte`). Die
  Kurve steht deshalb in `scripts/scrollwege.ts`, nicht mehr in der
  Komponente.
- Das Bilderband **bricht aus der Karte aus** und läuft über die volle
  Fensterbreite (`--fensterbreite`, vom Skript aus `clientWidth`;
  `100vw` ginge nicht, weil es die Rollleiste mitzählt). Die
  Inhaltsbreite steht wieder auf 1360 px.
- Die Abstände in der Karte folgen dem Entwurf: eine kleine Fuge
  zwischen Begrüßung und Band, davor und danach der volle
  Abschnittsabstand. Seitlich hat der Sprechstunden-Teil denselben Rand
  wie die Fortschrittsleiste des Bands — Zeiten und Leiste stehen auf
  einer Fluchtlinie.
- Der Zipfel ist auf dem Desktop **175 px** lang (90 → 130 → 175): Die
  Karte steht dort weiter über der Symbolleiste, die Spitze braucht
  mehr Weg.
- Bei reduzierter Bewegung steht alles ruhig untereinander; das
  Schließen-Kreuz entfällt dann.

## Kopfleiste und Team (17. September 2026, abends)

**Kopfleiste** wie im Entwurf: Logo links, Menüpunkte rechts, ganz außen
die Telefonnummer als Knopf — alles an der Inhaltsbreite ausgerichtet.
Vorher saß der ganze Block mittig in 700 px.

**Sprechzeiten:** größerer Abstand zwischen den drei Spalten
(`clamp(40px, 5vw, 88px)`).

**Team — zurück zu den Maßen der alten Seite:**

| | Rahmen | Foto |
|---|---|---|
| Ärztinnen und Ärzte | 300 px hoch, drei Spalten in max. 948 px | in seinem eigenen Format, mittig im Rahmen |
| Praxisteam | 260 px hoch | ebenso |

Entscheidend ist, dass das Foto den Rahmen **nicht** ausfüllt: Nur so
schaut die Person ganz aus dem Schattensaum heraus, statt an der Brust
beschnitten zu werden. Die Höhe steht in Bildpunkten (`--portraet-hoehe`),
nicht in Prozent — beim Hereinscrollen ist der Ausschnitt nur 80 % hoch
(Ablauf a/a-2) und soll dann WENIGER zeigen, nicht ein kleineres Bild.

**Abstand zum nächsten Abschnitt:** Der Einstieg belegt im Fluss
`--oz-ende − 110px − Zipfellänge`. Die Zipfellänge geht ab, weil die
Spitze sich beim Weiterscrollen einzieht — ihr Platz stünde sonst als
leere Fläche zwischen Karte und „Aus der Praxis" (Florian). Während sie
sich einzieht, reicht sie kurz in den Innenabstand des nächsten
Abschnitts hinein; sie sitzt aber weit rechts, wo dort nichts steht.

Der **Schattensaum** ist 24 px hoch statt 14 und leicht zurückgenommen
(90 % Deckung): Der Verlauf der Zeichnung streckt sich über mehr Pixel
und wirkt dadurch weicher.

### Kopfleiste, Schließen-Kreuz, Rhythmus in der Karte (17. September 2026)

- **Praxisname in der Kontaktzeile.** Ganz oben, der Anschrift voran:
  „Praxis Dres. Nold · Rosenstraße 1 · 76467 Bietigheim · …" — nur auf
  dem Desktop, darunter wird die Zeile zu lang. Halbfett, damit er sich
  von den Angaben dahinter absetzt.

  Der Name steht **fest im Code** (`Navigation.astro`): `seite.json`
  führt nur den vollen Namen „Dres. Nold – Zahnarztpraxis und
  Kieferorthopädie", der hier über zwei Zeilen liefe.

  Nicht ins Menü: Dort war er kurz versehentlich gelandet (neben dem
  Logo der Kopfleiste) — gemeint war die Kontaktzeile (Florian).

- **Die Kontaktzeile läuft auf der Inhaltsbreite**, wie die Kopfleiste
  darunter. Vorher stand sie in 60 % Breite, höchstens 700 px, mittig —
  mit dem Praxisnamen davor war das zu eng.

- **Ein Schließen-Kreuz für die ganze Seite.** Aussehen und Maße stehen
  jetzt einmal in `styles/global.css` (`.schliessen`, 48 px, Kreis mit
  1 px Strich); die drei Stellen, die es einsetzen — Leistungsseite,
  Beitragsseite, Einstiegskarte —, bestimmen nur noch seine Lage.
  Vorher war es an jeder Stelle eigens beschrieben, und in der
  Einstiegskarte war es kleiner und ohne Kreis.

  In der Karte trägt es `.schliessen--fest`: Der Kreis **steht von
  Anfang an da**, statt sich einzuzeichnen. Auf den Unterseiten zeichnet
  er sich weiterhin ein, sobald das Kreuz beim Scrollen oben klebt — in
  der Karte gäbe es dafür keinen Moment, sie fährt ja schon herein
  (Florian). Es sitzt außerdem tiefer (40 px statt 12) und bündig mit
  der rechten Textkante.

- **Ein Rhythmus in der Karte.** Begrüßung → Band und Band →
  Sprechstunden haben denselben Abstand (`--abstand-gruppe`, 48–72 px).
  Oben stand vorher `clamp(24px, 4vw, 48px)`, unten der volle
  Abschnittsabstand — auf dem Desktop 48 gegen 124 px. Die
  Sprechstunden rücken damit spürbar näher ans Band (Florian). Der
  große Abstand **unter** den Zeiten bleibt: Sie sollen nicht auf der
  gestrichelten Grundlinie sitzen.

- **Die Galerie hält beim Zeigen nicht mehr an und lässt sich ziehen.**
  Band und Fortschrittsleiste nehmen beide den Zeiger (oder den Finger)
  auf; gezogen wird dabei nicht am Band, sondern an der **Zeit** der
  CSS-Animation. Damit bleibt die eine laufende Animation der einzige
  Antrieb — es gibt keine zweite Rechnung, die mit ihr in Streit geraten
  könnte, und nach dem Loslassen läuft das Band von der neuen Stelle
  ruhig weiter.

  Angehalten wird nur noch, solange jemand zieht (`data-zieht`) und
  solange die Leiste **sichtbar** den Tastaturfokus hat. Das frühere
  Anhalten beim bloßen Zeigen ist weg (Florian): Es vertrug sich nicht
  mit dem Ziehen, und weil das Band über die volle Fensterbreite läuft,
  stockte es bei fast jeder Mausbewegung. `:focus-visible` statt
  `:focus-within` — sonst bliebe das Band nach einem Mausklick auf die
  Leiste stehen, weil der Knopf den Fokus behält. Der Fokus-Halt ist
  zugleich der Halt, den WCAG 2.2.2 für dauernd bewegte Inhalte
  verlangt.

### Der Texteditor der Redaktion (17. September 2026)

Zwei Meldungen von Florian, eine Ursache je:

- **„Eingefügter Text ist immer schon fett."** Eingefügtes lief bisher
  ungefiltert in das `contenteditable` — mit Words `<b>`, `<span
  style="font-weight:700">`, Schriftart und Farbe. Gesäubert wurde erst
  beim Speichern, im Editor stand die fremde Gestaltung also weiterhin.

  Jetzt fängt das Feld das Einfügen ab: Übernommen wird der **Aufbau**
  (Absätze, Listen, Verweise, Tabellen), **keine Auszeichnung**. Fett,
  Kursiv und Unterstrichen fallen weg, eingefügte Überschriften werden
  zu Absätzen. Hervorhebungen setzt man danach bewusst mit der Leiste.
  Enthält die Zwischenablage nur reinen Text, werden Leerzeilen zu
  Absätzen und einzelne Umbrüche zu Umbrüchen.

- **„Und ich bekomme es mit ‚Absatz' nicht weg."** Der ganze Text stand
  in einer Überschrift: `<h3><p>…</p><p>…</p></h3>`. So etwas entsteht,
  wenn man in einer leeren Zeile „Zwischentitel" wählt und dann einen
  ganzen Text hineinschreibt oder einfügt. `formatBlock` stellt nur den
  **innersten** Block um — die Hülle blieb stehen, und die Seite zeigte
  alles als Überschrift, also groß und fett.

  Eine Überschrift enthält jetzt nur noch Text. Enthält sie Absätze oder
  Listen, wird die Hülle aufgehoben — beim Laden, beim Speichern und
  wenn „Absatz" oder „Format löschen" gedrückt wird. Bestehende Texte
  reparieren sich damit beim nächsten Öffnen und Speichern von selbst.

**Nebenbei am Filter geputzt:** Er baute die Vorlage an Ort und Stelle
um; der Inhalt einer entfernten Hülle wurde danach nicht mehr geprüft
(er stand nicht mehr in der Liste, über die gerade gelaufen wurde), und
Unerlaubtes darin blieb stehen — ein `<script>` in einem `<span>` etwa.
Jetzt wird eine saubere Fassung neu aufgebaut, `<script>`, `<style>` und
Kommentare fliegen samt Inhalt raus, und `h1`/`h2`/`h5`/`h6` rutschen auf
die zwei erlaubten Ebenen `h3`/`h4` (keine Sprünge in der Gliederung).

### Die Knöpfe heißen nach dem, was sie anlegen (17. September 2026)

Verschachtelte Listen trugen beide „+ Neuer Eintrag" — bei Abschnitten
mit ihren Bereichen war nicht zu erkennen, welcher Knopf wozu gehört
(Florian). Jede Liste hat jetzt ihr Wort (`einzahl` und `geschlecht` in
`src/admin/bereiche.ts`): „+ Neuer Abschnitt" gegen „+ Neuer Bereich",
„Abschnitt entfernen" gegen „Bereich entfernen", ebenso in der
Sicherheitsabfrage. Einträge ohne eigenen Titel heißen in der Kopfzeile
„Bereich 1", „Bereich 2" statt „(ohne Titel)" — die Nummer wird beim
Verschieben und Entfernen nachgezogen.

### „Keine Verbindung" beim Speichern (17. September 2026)

Die Meldung war irreführend: Die Verbindung stand, **die Anmeldung war
abgelaufen.**

Cloudflare Access schützt nicht nur `/admin`, sondern auch `/api/…`.
Ist die Sitzung abgelaufen, antwortet Access nicht mit einem Fehler,
sondern mit einer **Umleitung auf seine Anmeldeseite** — und die liegt
auf einem anderen Server (`dres-nold.cloudflareaccess.com`). Folgt der
Browser ihr, bricht er die Anfrage aus Sicherheitsgründen ab; `fetch`
wirft dann `TypeError: Failed to fetch`. In der Redaktion landete das im
allgemeinen Auffangnetz — also „Keine Verbindung".

Nachgemessen auf der veröffentlichten Seite:

| Anfrage | Ergebnis |
|---|---|
| `fetch('/api/inhalt')` | wirft `TypeError: Failed to fetch` |
| `fetch('/api/inhalt', { redirect: 'manual' })` | `type: 'opaqueredirect'`, `status: 0` |

Alle Anfragen der Redaktion laufen jetzt über `anfrage()` mit
`redirect: 'manual'`. Die Umleitung wird damit nicht mehr verfolgt,
sondern ist an `type === 'opaqueredirect'` erkennbar — zusammen mit 401
und 403 heißt das: abgemeldet. Die Meldung sagt das jetzt und nennt den
Weg: in einem neuen Tab `/login` öffnen, anmelden, hier noch einmal auf
Speichern drücken. **Die Eingaben bleiben dabei im Formular stehen** —
es geht nichts verloren, auch nicht bei einem langen Text.

Zweitens liest `alsJson()` die Antwort jetzt erst als Text und meldet
bei allem, was kein JSON ist, den Status-Code. Vorher warf `.json()` bei
einer Fehlerseite des Servers, und auch das wurde zu „Keine Verbindung".

Wie lange eine Anmeldung hält, steht nicht im Code, sondern in der
Access-Anwendung im Zero-Trust-Dashboard (Session Duration). Wer lange
am Stück redigiert, kann sie dort verlängern.

### Das Vorholen meldete ab (17. September 2026)

**Der Fehler:** Anmelden ging, aber der erste Klick in der Redaktion
landete wieder auf dem Anmeldebildschirm — jedes Mal, mit jedem neuen
Code.

**Die Ursache:** `astro.config.mjs` holt mit `prefetchAll: true` und
`defaultStrategy: 'viewport'` jede verlinkte Seite vor, sobald ihr
Verweis im Fenster steht. Für die öffentliche Seite ist das gewollt: Der
Morph muss beim Klick nicht mehr aufs Netz warten.

In der Redaktion steht in der Kopfzeile aber der Verweis **„Abmelden" →
`/cdn-cgi/access/logout`**. Der wurde damit bei jedem Seitenaufbau
vorgeholt — und das Vorholen ist ein ganz normaler GET mit Cookie.
Cloudflare Access hat die Sitzung also **beim Laden der Seite beendet.**
Die offene Seite lief weiter (sie war ja schon da), der nächste Klick
lief ins Leere.

Im Netzwerkprotokoll ist es eindeutig: Beim Laden von `/admin/` ging ein
`GET /cdn-cgi/access/logout` hinaus, noch bevor irgendetwas angeklickt
war.

**Warum erst jetzt:** Das Vorholen kam am 14. September in die
Konfiguration, die Redaktionsseiten wurden aber erst am 17. September
neu gebaut und aufgespielt. Bis dahin lag dort noch eine Fassung ohne
das Vorhol-Skript.

**Die Abhilfe:** Alle Verweise der Redaktion tragen
`data-astro-prefetch="false"`. Das Vorholen bleibt für die öffentliche
Seite, wo es nützt.

**Regel für später:** Ein Verweis, dessen bloßer Aufruf etwas verändert
— Abmelden, Löschen, Bestätigen —, darf nie vorgeholt werden. Am besten
gehört so etwas gar nicht hinter einen Verweis; solange es das tut,
steht `data-astro-prefetch="false"` daran (Kommentar in
`src/layouts/Redaktion.astro`).

### Neun zahnärztliche Leistungen, zwei Leisten auf einer Breite (18. September 2026)

- **Die Leistungen stehen wie auf der alten Seite.** Die elf Texte sind
  wortgleich aus dem Webflow-Export übernommen (geprüft, Absatz für
  Absatz) und stehen in derselben Reihenfolge. Dentale-Volumen-
  Tomographie, Bleaching und Intraoralscanner lagen zwischenzeitlich
  unter „Sonstige"; sie gehören in die zahnärztliche Liste — dort sind
  es damit **neun**, wie auf dres-nold.de (Florian).

  Neu gegenüber der alten Seite sind allein die Kurztexte der Kacheln
  (dort gab es zugeklappt nur den Titel) und die Erklärtexte über den
  Kacheln — die alte Seite kannte keine Gruppen.

- **Kontaktzeile und Symbolleiste sind gleich breit** (neues Token
  `--breite-leiste: 980px`) und tragen dieselbe Schriftgröße (14 px wie
  die Beschriftung unter den Symbolen). Beide rahmen den Startbereich
  und sollen als Paar gelesen werden. Die Kontaktzeile lief zuvor auf
  der vollen Inhaltsbreite und war damit deutlich breiter als die
  Leiste darunter.

### Feinschliff und Handy-Durchgang (18. September 2026)

- **Die Trennpunkte oben** tragen die Hausfarbe wie die Punkte zwischen
  den Symbolen unten. Der leise Ton des Handoffs fiel daneben ab
  (Florian).
- **Der Haken unter „Scrollen Sie …"** ist 32 × 16 px statt 40 × 20 —
  neben der feinen Schrift wirkte er zu groß.
- **Das Schließen-Kreuz der Sprechstunden** steht jetzt in einer Zeile
  mit „Wann Sie uns antreffen" statt darüber zu schweben. Der Abstand
  zum Kicker sitzt an der Zeile, nicht an der Überschrift — läge er an
  ihr, zählte er zu ihrem Rand und das Kreuz säße um die halbe Höhe des
  Abstands zu hoch.
- **Unten auf Handys steht „Leistungen" statt „Kontakt".** Danach wird
  am Handy am häufigsten gesucht; der Kontakt ist über die
  Telefonnummer daneben ohnehin einen Griff entfernt (Florian).

**Das waagerechte Scrollen ist weg.** Ursache war der Schattensaum des
Teams: Er ragt an den Reihenenden 64 px über die Inhaltsbreite hinaus,
daneben ist aber nur der Seitenrand frei (24 px). Die übrigen 40 px
schoben die ganze Seite auf. `html { overflow-x: clip }` hat das bisher
verdeckt — auf Browsern ohne `clip` (iOS 15 und älter) aber nicht.

Jetzt endet der Saum am Fensterrand: `overflow-x: clip` am Abschnitt
`.team`. Das Auslaufen bleibt sichtbar, der Überstand kann die Seite
aber nicht mehr verbreitern. Gemessen auf 375 px und auf 1440 px
Fensterbreite, über die ganze Seitenhöhe: Überstand 0.

### Der Hinweis wird eine Karte (18. September 2026)

Zipfel und News-Symbol sind weg, die Blase ist die schlichte Karte des
Entwurfs — mittig im Fenster, dahinter die **weichgezeichnete Seite**
(`backdrop-filter: blur(7px)`) unter einem leichteren Aubergine-Schleier
(42 % statt der 60 % der Vorlage; das Weichzeichnen trennt schon genug).

Das Schließen-Kreuz ist dasselbe wie in der Einstiegskarte —
`.schliessen--fest`, 48 px mit fertig gezeichnetem Kreis.

Damit ist die Festlegung vom 17. September („die Sprechblase behält
ihre Form") überholt: Florian wollte am 18. September die Karte des
Entwurfs. Geblieben ist der Einflug von links (Ablauf a-36).

