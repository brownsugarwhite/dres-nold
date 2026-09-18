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
- Der **Scrollweg der Sprechstunden** blieb hier bei 350vh (mobil
  450vh) — **seit dem 18. September 2026 sind es 480vh / 620vh**, siehe
  „Erst das Logo, dann die Karte" am Ende.
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

### Erst das Logo, dann die Karte (18. September 2026)

Die Einstiegskarte schob ihre weiße Fläche über das noch stehende Logo:
Ihre Oberkante überholte die Unterkante des Logos schon nach etwa einer
drittel Fensterhöhe, während sich das Logo (Ablauf a-7) über **1,26
Fensterhöhen** auflöst. Gut eine Fensterhöhe lang lagen beide
übereinander.

Ablauf a-19 hat deshalb am Anfang eine **Wartezeit** bekommen: Die Karte
steht still, bis das Logo fertig ist, und fährt erst dann herein. Damit
Anfahrt, Bremsweg und Schnalzen dabei genau so lange dauern wie vorher,
ist der Scrollweg um die Wartezeit länger:

| | vorher | jetzt |
|---|---|---|
| Scrollweg (`ozWeg`, `--oz-weg`) | 3,5 / mobil 4,5 Fensterhöhen | **4,8 / 6,2** |
| Karte setzt sich in Bewegung | 15 % | **35 %** |
| Zipfel voll ausgefahren | 50 % | **61 %** |
| Schnalzen (`OZ_RAST`, `--oz-ende`) | 71 % | **78 %** |

Nachgemessen, alle achtel Fensterhöhen über den ganzen Einstieg, auf
1440 × 900 und auf 375 × 812: **keine Überdeckung** mehr, solange das
Logo sichtbar ist. Es verschwindet bei 1,39 (Desktop) bzw. 1,50
Fensterhöhen (Handy); die Karte beginnt ihre Fahrt unmittelbar danach.

Die vier Zahlen hängen zusammen — wer eine ändert, muss die anderen
mitziehen: `ozWeg()` und `OZ_RAST` in `scripts/scrollwege.ts`,
`--oz-weg` und `--oz-ende` in `Oeffnungszeiten.astro`.

Nebenbei: Die Begrüßung hatte eine **eigene weiße Fläche** zusätzlich zu
der der Karte. Sie ist weg — das Weiß setzt allein `.ozblase__flaeche`.

**Auf Handys sitzen Logo und Scrollhinweis tiefer** (`padding-top: 12vh`
am Startbereich). Oben steht nur die 40 px hohe Kontaktzeile, unten die
110 px hohe Symbolleiste; mittig im Fenster wirkte der Block dadurch
nach oben gerutscht. Gemessen bei 375 × 812: Mitte des Blocks jetzt bei
365 px, die Mitte zwischen den beiden Leisten liegt bei 371 px.

### Das Band „Anfahrt" (18. September 2026)

Die Karte steht nicht mehr als Kasten neben dem Formular, sondern als
**Band über die volle Breite am Fuß der Startseite** (Entwurf):
entsättigtes Kartenbild, nach oben und unten ins Weiß auslaufend, darauf
ein pulsierender Punkt an der Praxis; links unten Anschrift und Hinweis,
rechts unten „Karte anzeigen" und „Route planen". Darunter der
Fußbereich mit Haarlinie, links der Praxisname, rechts Datenschutz ·
Impressum · Nach oben.

**Wie Punkt und Karte zusammenfinden:** Das Bild liegt als
`background-size: cover`. Bei `cover` richtet `background-position: p%`
den p-%-Punkt des Bildes auf den p-%-Punkt der Fläche aus. Die Praxis
liegt bei **52,8 % / 49,2 %** des Bildes — mit genau diesen Werten als
Position steht sie bei jeder Fenstergröße an derselben Stelle der
Fläche, und dort sitzt auch der Punkt. Kein Rechnen im Skript.

**Der Punkt deckt die Google-Marke im Bild zu.** Sie ist dort 37,5
Bildpunkte hoch (Kopf 29,5 plus Spitze) und sitzt mit ihrer Kopfmitte
bei 844 / 474 von 1600 × 969 — beides ausgemessen. Wie groß sie auf dem
Schirm erscheint, hängt vom Maßstab ab, mit dem `cover` das Bild
einpasst: bei breitem Fenster Fensterbreite / 1600, also 2,34 % der
Fensterbreite; bei hohem, schmalem Band zählt die Höhe. Der Punkt ist
deshalb `max(28px, 2.4vw)` groß — gemessen bei 1440 px: Marke 33 px,
Punkt 35 px; bei 375 px: Marke 24 px, Punkt 28 px. Dazu ein weißer Saum,
der ihn von der Karte trennt.

Auf schmalen Fenstern wäre der Punkt hinter der Anschrift gelandet.
Dort rückt die ganze Kartenebene 150 px nach oben und wird um dasselbe
Maß höher — Bild und Punkt liegen in derselben Ebene und bleiben dabei
aufeinander.

**Der Einwilligungshinweis bleibt vollständig.** Der Entwurf schreibt
„Die Karte wird erst auf Wunsch von Google geladen"; daraus ist „Die
Karte lädt erst auf Klick — dabei erhält Google Ihre IP-Adresse"
geworden. Ohne den zweiten Halbsatz wäre die Einwilligung nicht
informiert (§ 25 TDDDG).

Ist die Karte geladen, bekommt der Textblock eine weiße Fläche mit
Weichzeichner — sonst stünde er auf der bunten Karte.

### Ränder, Menü und Hover-Feinschliff (18. September 2026)

- **Der Seitenrand wächst mit dem Fenster:** `--abstand-seitenrand` ist
  jetzt `clamp(24px, 5vw, 56px)`. Auf Handys bleiben es die bisherigen
  24 px (dort war es richtig), auf mittleren Fenstern wird der Rand
  deutlich breiter — vorher klebte der Inhalt dort an den Kanten
  (Florian). Ab etwa 1470 px Fensterbreite greift ohnehin
  `--breite-inhalt`.

- **Logo und Menüknopf stehen an den Rändern** (`space-between` statt
  `space-around`), und die Kopfleiste ist auf Handys so breit wie die
  Liste im Aufklappmenü darunter. Dadurch steht das Logo **genau über
  den Symbolen** der Liste — gemessen: beide Kanten bei 24 px.

- **Das Aufklappmenü:** Haarlinien zwischen den Einträgen; die
  aufgeklappten Leistungen nur noch 10 px eingerückt, sodass ihre
  kleinen Symbole (40 px) auf der Mitte der großen (60 px) stehen —
  gemessen: beide Mitten bei 54 px. Auch sie haben Haarlinien.

- **Die Einträge fahren gestaffelt ein**, von oben nach unten: leicht
  von oben, dabei aufblendend, jeder 55 ms später als der davor.
  Gemessen nach 300 ms: 0,93 · 0,85 · 0,71 · 0,45 · 0,07 · 0 · 0.

- **Der Menüpunkt „Leistungen" hat auf dem Desktop einen Haken**
  bekommen — bisher war nicht zu sehen, dass dort etwas aufgeht. Er
  steht **absolut** am rechten Rand des Knopfes: Der Text darin rollt
  beim Zeigen um 80 px hoch, im Fluss wäre der Haken mitgerollt.

- **Neue Zeige-Zustände:** Die Symbole der unteren Leiste heben sich um
  4 px und wachsen leicht, ihre Beschriftung nimmt sich zurück; das Logo
  in der Kopfleiste wächst um 5 %. Alles respektiert reduzierte
  Bewegung.

### Nachjustierung am Kartenband und im Kontakt (18. September 2026)

- **Die Karte wirkt jetzt ruhiger statt unscharf.** Das Vorschaubild ist
  1600 Bildpunkte breit und wird auf großen Schirmen hochgerechnet —
  kräftig gezeigt sah man das. Deckkraft 38 % statt 50 %, und der
  Kontrastfilter ist raus (er machte es matschig). Sauber wäre ein
  größeres Kartenbild; das müsste die Praxis liefern.
- **Oben eine harte Kante** wie auf dem Handy — die Maske blendet nur
  noch nach unten aus (Florian).
- **Der Punkt ist kleiner:** `max(20px, 1.85vw)` statt
  `max(28px, 2.4vw)`. Er deckt damit den **Kopf** der Google-Marke
  (29,5 Bildpunkte breit); die feine Spitze darunter bleibt bei 38 %
  Deckkraft ohnehin unsichtbar. Größer wirkte er wie ein Fleck.
- **Der Kontaktbereich ist wieder zweispaltig:** links die Anschrift
  (mit „Telefon", „Fax", „E-Mail" als leiser Marke davor), rechts das
  Formular. Seit die Karte ausgezogen ist, lief das Formular über die
  ganze Inhaltsbreite — die Felder waren 745 px breit. Jetzt sind es
  621 px, auf Handys die volle Spaltenbreite.

### Karte in eigener Größe, Popup aufgeräumt (18. September 2026)

**Die Karte wird nicht mehr hochgerechnet.** `background-size: cover`
zog die 1600 Bildpunkte des Vorschaubildes auf breiten Schirmen auf 2000
und mehr — deutlich zu sehen, vor allem an Googles Beschriftung
(Florian). Jetzt steht `auto`: Das Bild behält seine Größe. Auf schmalen
Fenstern zeigt es einen Ausschnitt, auf breiten läuft es seitlich ins
Weiß aus (zweite Maske, waagerecht). Die Ausrichtung stimmt weiterhin:
`background-position: p%` richtet den p-%-Punkt des Bildes auf den
p-%-Punkt der Fläche aus, unabhängig davon, welches größer ist.

Weil Bildpunkte und Bildschirmpunkte jetzt dasselbe sind, brauchen
Punkt und Schleier keine vw-Rechnung mehr: Der Punkt ist 30 px (der Kopf
der Google-Marke misst 29,5), der Schleier 360 × 135 px.

**Googles Beschriftung liegt unter einem weichen weißen Schleier** —
eine Ellipse mit 24 px Weichzeichner. Ein Farbverlauf (`closest-side`)
ließ an den Seiten Reste stehen: Er spannt eine Ellipse auf, die die
Ecken des Kastens nicht erreicht.

**Ganz sauber wird es erst mit einem anderen Kartenbild** — größer
(etwa 3200 px) und ohne Beschriftung und Marke. Dann können Schleier und
Ausrichtung entfallen und die Karte darf kräftiger gezeigt werden.

**Das Popup:** Der dicke Ring um das Kreuz war der Fokusring des
Browsers — das Skript setzte den Fokus beim Öffnen auf das Kreuz. Er
geht jetzt auf den Dialog selbst (`tabindex="-1"`); mit der
Tabulatortaste ist das Kreuz weiterhin das erste Ziel. Dazu rundherum
gleich viel Innenabstand, ein kleinerer Radius und ruhiger gesetzter
Text (16,5 px, Zeilenhöhe 1,6, gleichmäßige Absätze).

### Das Aufklappmenü passt jetzt auf den Schirm (18. September 2026)

- **Kleinere Symbole und engere Zeilen:** 44 px statt 60 (in der Liste
  der Kategorien 32 statt 40), 7 px Innenabstand statt 10. Damit steht
  die ganze Liste auch auf kurzen Bildschirmen, ohne dass man im Menü
  rollen muss.
- **Das Menü ist so hoch wie sein Inhalt**, nicht so hoch wie der
  Bildschirm: Es klappt über die **Rasterhöhe** auf (`0fr → 1fr`,
  dieselbe Technik wie das Akkordeon darin) statt über eine feste Höhe.
  Gemessen bei 375 × 812: 489 px hoch, 283 px über dem unteren
  Bildschirmrand; mit aufgeklappten Leistungen 654 px. Reicht der Inhalt
  einmal nicht, rollt er innerhalb des Rahmens (Deckel:
  `100dvh − 80px − 64px`).
- **Eine Doppellinie schließt das Menü ab** — unter „Datenschutz ·
  Impressum" (`border-bottom: 3px double`).
- **Die Seite steht still, solange das Menü offen ist**
  (`overflow: hidden` an der Wurzel, beim Schließen zurückgenommen).
  Sonst scrollte beim Wischen über dem Menü der Inhalt dahinter weg —
  und mit ihm fuhr die Einstiegskarte, weil sie am Scrollweg hängt.
- **Die Kontaktzeile hat auf Handys denselben Seitenrand wie alles
  andere** (24 px statt 5 %): Straße und E-Mail standen dicht an der
  Kante. Gemessen bei 375 px: links 24, rechts 24.

### Karte und Kontakt sind ein Band (18. September 2026)

Der Entwurf führt beides zusammen, und das gefällt Florian deutlich
besser: **ein Band über die volle Breite** mit dem Kartenbild als Grund
— links Kicker, Überschrift, die große Telefonnummer, Anschrift und
E-Mail, die Zusatzzeile und die beiden Knöpfe; rechts das Formular auf
einer weißen Karte. Das eigene Band „Anfahrt" ist damit wieder
aufgelöst (`Anfahrt.astro` gelöscht).

**Die Eingabefelder bleiben, wie sie sind.** Der Entwurf zeigt gefüllte
graue Kästen mit Beschriftung darüber; es bleibt bei den Feldern mit
wanderndem Label und gezeichneter Linie (Florian, ausdrücklich).

**Die Google-Karte wird nicht mehr eingebettet.** „Karte anzeigen" und
„Route planen" sind schlichte Verweise, die Maps in einem neuen Fenster
öffnen. Damit lädt die Seite **nichts mehr von fremden Servern** — die
Einwilligung ist gegenstandslos. `einwilligung.ts` und der
Widerrufsknopf im Fußbereich bleiben vorerst stehen, damit alte
gespeicherte Zustimmungen zurückgenommen werden können; gesetzt wird
nichts mehr. Die Datenschutzerklärung ist entsprechend anzupassen.

**Die Karte geht über die ganze Breite** (`background-size: cover`),
der Verlauf liegt nur oben: Sie blendet aus dem Weiß des Abschnitts
darüber ein und endet unten mit einer **harten Kante** am Fußbereich.
Die Haarlinie über dem Fußbereich ist deshalb weg — die Kante trennt
schon (Florian, 18. September 2026).

**Der einzige Schlagschatten der Seite** sitzt an der Formularkarte: Sie
liegt auf dem Kartengrund, und nur so bleiben die feinen Linien der
Felder ablesbar. Überall sonst gilt weiter: keine Schatten.

Der Einleitungssatz „Am schnellsten telefonisch. Für alles, was nicht
eilt, schreiben Sie uns gerne." stammt aus dem Entwurf und steht in
`startseite.json` — die Praxis kann ihn in der Redaktion ändern.

### Kein Häkchen unter dem Kontaktformular (18. September 2026)

Die Pflicht-Checkbox „Sie erklären sich damit einverstanden …" ist weg.
An ihrer Stelle steht ein Hinweis mit Verweis auf die
Datenschutzerklärung.

**Warum:** Die Angaben aus dem Formular werden verarbeitet, um die
Anfrage zu beantworten — Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
(Anbahnung) bzw. lit. f DSGVO, **nicht** eine Einwilligung (lit. a).
Genau so steht es auch schon in Ziffer 5 der Datenschutzerklärung. Art.
13 verlangt an dieser Stelle Information, keine Zustimmung; ein
Pflichthäkchen wäre sogar die schlechtere Grundlage, weil eine
Einwilligung jederzeit widerrufbar ist und die Nachricht dann gelöscht
werden müsste, obwohl sie zur Bearbeitung noch gebraucht wird. Mehrere
Aufsichtsbehörden sagen ausdrücklich, dass eine solche Checkbox nicht
erforderlich ist.

Die Prüfung fällt damit auch in `functions/api/kontakt.ts` weg.

**Es steht nur noch EIN Hinweis unter den Feldern:** erst der Satz der
Praxis aus `startseite.json` („Wir melden uns zurück … keine Angaben zu
Ihrer Gesundheit"), dann der Datenschutzhinweis. Der erste kommt als
`hinweis` in `Kontaktformular.astro` herein und bleibt in der Redaktion
änderbar; der zweite steht fest im Code, weil er eine Rechtspflicht
erfüllt (Florian, 18. September 2026).

**Ziffer 6 der Datenschutzerklärung ist neu geschrieben:** Es ist keine
Karte mehr eingebettet, der Kartenausschnitt ist eine eigene Grafik, und
die beiden Schaltflächen sind Verweise, die Google Maps erst auf Klick
in einem neuen Fenster öffnen. Der Eintrag zur gespeicherten
Kartenzustimmung ist aus Ziffer 4 entfernt.

**Die Rechtsseiten bleiben Entwürfe** und sind vor der Freigabe von der
Praxis bzw. ihrem Datenschutzbeauftragten zu prüfen — das gilt für diese
Änderung besonders.

### Die Leiste zeigt, wie der Text gesetzt ist (18. September 2026)

Wer im Texteditor etwas markiert, sieht jetzt oben in der Leiste, wie es
gesetzt ist: Der zutreffende Knopf steht in der Hausfarbe und trägt
`aria-pressed="true"` — also auch für Vorleseprogramme erkennbar.

Den Zustand beantwortet der Browser selbst (`queryCommandState`) für
Fett, Kursiv und die beiden Listen; für „Absatz" und „Zwischentitel"
sucht die Auswahl ihren umgebenden Block, für „Verweis" ihren
`<a>`-Vorfahren.

Eine Feinheit: In einer Zwischenüberschrift meldet der Browser „fett",
weil sie fett gesetzt **ist** — angeklickt hat das niemand. Dort bleibt
der Knopf deshalb aus.

**Die Stellenliste, drei Änderungen** (Florian, 18. September 2026):

- **Alle Zeilen sind beim Laden zu.** Vorher stand die erste offen.
- **Zugeklappt steht ein Anriss** unter der Bezeichnung: der Anfang der
  Beschreibung, ohne Auszeichnung, auf 110 Zeichen gekürzt. Er
  verschwindet beim Aufklappen, sonst stünde er über seinem eigenen
  Text.
- **Ansprechperson und Bewerbungsknopf kleben** und laufen bei langen
  Anzeigen mit: auf breiten Fenstern **oben** (80 px Kopfleiste plus
  Luft), auf schmalen **unten** am Bildschirmrand — oben wäre dort kein
  Platz, da steht schon die Kopfleiste. Damit unten etwas kleben kann,
  ist `.stelle__spalten` dort ein gewöhnlicher Block: In einem Raster
  ist die Zeile nur so hoch wie ihr Inhalt, und ein Element hat darin
  keinen Weg. Das ging nur mit einem Kniff: Die Klappe beschneidet ihren Inhalt
  (`overflow: hidden`), und ein beschnittener Vorfahre wird selbst zum
  Bezugsrahmen — `sticky` bliebe wirkungslos. Der Überlauf wird deshalb
  erst freigegeben, wenn die Aufklapp-Bewegung steht (`data-offen`,
  gesetzt in `transitionend`).
- **Das Auf- und Zuklappen ist choreografiert:** Die Höhe läuft in
  0,62 s, der Anriss zieht sich zusammen und blendet aus (0,45 s bzw.
  0,26 s) und übergibt damit an den echten Text, der 0,14 s später von
  16 px unten aufblendet; die Spalte mit der Ansprechperson folgt 0,26 s
  später. Beim Zuklappen geht der Inhalt sofort (0,2 s, keine
  Verzögerung), damit nichts nachhängt. Gemessen beim Öffnen — Deckkraft
  von Anriss / Text / Spalte:

  | nach | Anriss | Text | Spalte |
  |---|---|---|---|
  | 140 ms | 0,28 | 0,00 | 0,00 |
  | 280 ms | 0,00 | 0,63 | 0,00 |
  | 420 ms | 0,00 | 0,91 | 0,70 |
  | 700 ms | 0,00 | 1,00 | 1,00 |

- **Die Nummer steht außerhalb der Textspalte**, im Seitenrand daneben:
  So beginnt die Bezeichnung auf derselben Fluchtlinie wie der Text
  darunter. Einspaltig (unter 800 px) rückt sie zurück in die Zeile —
  dort reicht der Seitenrand nicht.

**Zwei Beispiel-Stellenanzeigen** stehen in `stellen.json` — echte,
vollständige Anzeigen (ZFA und Prophylaxe/ZMP), damit die Praxis sieht,
wie der Bereich aussieht. Sie sind aktiv geschaltet und **vor dem
Livegang zu prüfen**: Umfang, Ansprechperson und die zugesagten
Leistungen muss die Praxis bestätigen.

### Die echte Karte (18. September 2026)

Der zweite Handoff (`design_handoff_startseite 2/`) bringt den
Kartenbereich fertig: eine **stilisierte Karte aus
OpenStreetMap-Daten**, eingefärbt, mit weißem Verlauf von oben und einer
pulsierenden Marke an der Praxis.

Umgesetzt ist die **statische Fassung** — die der Handoff selbst als
Möglichkeit (c) anbietet und die er unter „Offene Punkte für Florian"
als Punkt 0 zur Entscheidung stellt:

| | |
|---|---|
| Zeichnung | `karte-bietigheim-1920x1080.svg` aus dem Handoff, ohne die C2PA-Signatur (121 → 114 KB), liegt als `public/bilder/deko/karte-bietigheim.svg` |
| Tönung | `--farbe-primaer` bei 4,5 %, `multiply` |
| Weißverlauf | von oben, Stufen aus dem Handoff (100 % → 0 % am unteren Rand), unter 1040 px eigene Stufen |
| Marke | zwei Ringe, 2,6 s, Versatz 1,3 s, darunter weißer Kern und Punkt |
| Anflug | Die Karte fährt von 110 % auf ihre Größe herunter (2,2 s), die Marke blendet nach 1,1 s auf — ausgelöst, sobald 30 % des Bereichs im Bild sind |

**Was NICHT übernommen ist: die Live-Karte mit Leaflet und
OSM-Kacheln.** Sie würde bei jedem Seitenaufruf Kacheln von
`tile.openstreetmap.org` holen. Das verstößt gegen die Grundregel „keine
externen Ressourcen" (CLAUDE.md) — `scripts/pruefe-externe-ressourcen.mjs`
würde den Build abbrechen, die Seite käme nicht online. Außerdem wäre
die Einwilligung wieder fällig, die wir am selben Tag gerade abgeschafft
haben. Das bleibt Florians Entscheidung; der Handoff sieht das genauso.

Die Namensnennung „© OpenStreetMap-Mitwirkende" steht unten rechts an
der Karte — die ODbL verlangt sie auch für die statische Zeichnung.


### Feinschliff-Runde (18. September 2026, abends)

**Der Schnalz.** Die Stützstellen des Zipfels standen noch auf den
ungerechneten Werten der Vorlage (50/71/80 %), während der Weg der
Karte längst um die Wartezeit für das Logo gestreckt war. Deshalb
passte er nicht mehr. Jetzt:

- Der Zipfel fährt bis 74 % aus und **steht** dann (`OZ_ZIPFEL_VOLL`).
  Das kleine Plateau bis 78 % fängt den Nachlauf (`nachziehen`) ab —
  ohne es wäre der Zipfel je nach Scrolltempo beim Schnalz noch zu kurz.
- Bei 78 % (`OZ_RAST`) schnalzt er zurück: **nicht mehr am Scrollweg**,
  sondern als eigene Bewegung von 300 ms mit easeOut — genau die Dauer
  und Kurve, mit der die Leisten tauschen. Beides zusammen ist der
  Schnalz. Rückwärts läuft es ebenso.
- Die **Spitze steht bis dahin exakt über dem Sprechstunden-Knopf**;
  nur die Basis wandert. Erst beim Zurückschnalzen lehnt sie sich weg.

**Die Begrüßung kommt früher** (Wartezeit 35 → 30 % von Ablauf a-19).
Gemessen bei 1440 × 900: Die Karte setzt sich in Bewegung, wenn das Logo
zu gut der Hälfte aufgelöst ist, und ihre Oberkante erreicht die
Unterkante des Logos in dem Moment, in dem es verschwindet — sie
überschneiden sich nie.

**Rückweg der Morph-Übergänge.** Beim Zurückmorphen zur Startseite
blendet der übrige Inhalt 150 ms später ein als die Karte wandert
(`html[data-rueckmorph]`, gesetzt in `scripts/uebergaenge.ts`). So führt
die Karte den Blick.

**Das Bild der Neuigkeiten sprang** beim Öffnen: Es trägt zwei
Vergrößerungen (Zeigen und Scrollen), die vor der Momentaufnahme
zurückgesetzt wurden. Den Übergangsnamen trägt jetzt der **Ausschnitt**
statt des Bildes — seine Kante ist das, was man sieht, und sie steht
still. Damit beginnt der Morph genau am sichtbaren Bild; das
Zurücksetzen ist ersatzlos entfallen.

**Gruppenfoto (Ablauf a-3).** Der Versatz war ein fester Wert
(−20 → 140 px) bei nur 10 % Vergrößerung — der Rahmen zeigte in der
Mitte der Bewegung einen weißen Streifen (gemessen: 41 px bei 560 px
Rahmenhöhe). Jetzt wächst das Bild von seiner Unterkante aus (1 → 1,16)
und sinkt genau so weit ab, wie oben Bild vorhanden ist. Der Weg ist
damit von selbst zur Rahmenhöhe proportional.

Auf Handys entfallen die Abläufe **a-22/a-23** (das doppelt breite Foto,
das seitlich durchfuhr): Man sah immer nur einen der drei Ärzte. Dort
gilt jetzt dieselbe Bewegung wie auf dem Desktop, und der Ausschnitt ist
über das Seitenverhältnis (1,55 : 1) so gewählt, dass alle drei im Bild
stehen — bei jeder Fensterbreite dieselbe Bildausschnittsbreite.

**Die Marke auf der Karte** ist jetzt die des Handoffs: der Tropfen aus
`praxis-karte.js` (52 × 72), der nach dem Anflug von oben hereinfällt
(0,9 s), darunter zwei Ringe, die sich ausbreiten. Ihre **Spitze** ist
der Bezugspunkt.

**Wo sie steht, wird gemessen** (wie `freiePosition()` im Handoff) — und
die Zeichnung hängt daran, nicht umgekehrt: Ihr Mittelpunkt ist die
Praxis und liegt immer genau unter der Spitze.

| Umbruch | Marke |
|---|---|
| nebeneinander (ab ~1024 px) | in der Lücke zwischen Text und Formular |
| gestapelt, breit (Tablets) | rechts neben dem Formular |
| gestapelt, schmal (Handys) | zwischen den Knöpfen und dem Formular; die Reihenlücke wächst dafür auf 128 px |

Auf Handys zieht sich der Weißverlauf weiter nach oben zusammen, damit
schon oberhalb des Formulars Karte zu sehen ist.

**Die linke Spalte im Kontakt steht oben bündig** zur Formularkarte —
inklusive desselben Innenabstands, damit auch die beiden Kicker
(„Kontakt" und „Nachricht") auf einer Linie liegen.

**Mobiles Menü:** Die Staffelung läuft beim Schließen rückwärts
(`--stufe-hoch`), der Rollbalken des Rahmens ist verborgen (er blitzte
während des Aufklappens auf), und die beiden rechtlichen Verweise stehen
in der Hausfarbe, durch einen Punkt getrennt, mit demselben Abstand nach
oben wie nach unten.

**Sprechstunden auf Handys** sind 160 px kürzer: engere Zeilen, kleinere
Abstände, oben und unten derselbe Innenabstand. Die Zeitspalte darf
zwischen Vor- und Nachmittag umbrechen (der Trennpunkt bleibt am Ende
der ersten Angabe), die Wochentagsspalte nimmt nur ihre eigene Breite
(`width: 1%`), und unter 480 px steht die Tabelle eine Stufe kleiner —
sonst stießen Wochentag und Zeit aneinander.

**Nebenbei behoben:** Die Beitragsliste hatte `minmax(320px, 1fr)` und
schob auf 320-px-Geräten die ganze Seite um 24 px zur Seite. Jetzt
`minmax(min(320px, 100%), 1fr)`.

### Redaktion: Kopfleiste, Bildhöhe, Bereiche (18. September 2026)

**Die Kopfleiste der Redaktion klebt oben** (`position: sticky`). Bei
langen Formularen — die eigenen Abschnitte werden schnell lang — waren
„Übersicht", „Seite ansehen" und „Abmelden" sonst außer Reichweite. Sie
greift seitlich um `--abstand-s` über die Spalte hinaus und bringt einen
deckenden Grund mit, damit der Inhalt sauber darunter durchläuft. Die
Speichern-Leiste unten klebt schon länger nach demselben Muster.

**Neues Feld `bild_hoehe`** in jedem Bereich eines eigenen Abschnitts:

| Wert | Wirkung |
|---|---|
| `format` (Standard) | Das Bild behält sein Seitenverhältnis (4 : 3) — auch wenn es dann kürzer ist als der Text daneben. So war es bisher. |
| `voll` | Das Bild füllt die ganze Höhe des Bereichs und wird dafür beschnitten. |

Technisch: `align-items: stretch` auf der Zeile plus `height: 100 %` am
Bild. Die Zeilenhöhe bestimmt weiterhin die höhere der beiden Spalten —
ist das Bild in seinem Format höher als der Text, bleibt es dabei und
fällt nicht in sich zusammen (nachgemessen: kurzer Text → Zeile 298 px,
also die Bildhöhe). Auf Handys steht das Bild ohnehin über dem Text;
dort gilt immer das Format.

Bestehende Einträge ohne das Feld verhalten sich unverändert: Das Schema
setzt `format` ein, und in der Redaktion steht diese Möglichkeit an
erster Stelle der Auswahl.

**Die Bereiche innerhalb eines Abschnitts sind jetzt abgesetzt**: Die
verschachtelte Liste steht in einem getönten Kasten mit einer Kante in
der Hausfarbe, ihre Beschriftung als gesperrte Versalien, die Karten
darin auf hellerem Grund. Die Gestaltung erkennt die Verschachtelung
selbst (`.eintrag__inhalt > .eintraege`) — im Skript ist dafür nichts
zu tun. Dazu trägt jeder Eintrag eine **laufende Nummer** vor dem
Titel; bei mehreren Bereichen sieht man damit sofort, wo man ist.

### Nachgeschärft (18. September 2026, spätabends)

**Der Zipfel endet jetzt 10 px über der Symbolleiste** (`LUFT` in
Oeffnungszeiten.astro). Vorher traf seine Spitze genau deren Punktlinie
und verschwand dahinter; gemessen stand sie bei 789 px, die Leiste
beginnt bei 790.

**Der Sprung im Morph der Beiträge ist weg — in beide Richtungen.**

Die Ursache lag tiefer als gedacht: Nicht die Lage sprang, sondern der
INHALT. Auf der Übersicht ist das Bild beim Zeigen und über den
Scrollweg vergrößert (zusammen bis 1,13), auf der Beitragsseite steht es
unvergrößert. Gezeigt wurde von Anfang an die Aufnahme der ZIELseite —
beim Öffnen zoomte das Bild deshalb im ersten Bild heraus, beim
Schließen hinein.

**Gelöst als ein Bild, das von einem Rahmen in den anderen wandert** —
wie ein Flip, kein Überblenden (Florian, 18. September 2026). Ein
zwischenzeitlicher Versuch mit zwei übereinanderliegenden Aufnahmen war
zwar an den Enden richtig, aber in der Mitte als Überblendung zu sehen.

Der Kniff: Gezeigt wird immer **dieselbe** Aufnahme, nämlich die der
Beitragsseite. Auf dem Hinweg ist das die neue, auf dem Rückweg die
alte; die Aufnahme der Karte entfällt jeweils (`display: none`). Damit
sie an beiden Enden genau passt, kommen zwei Dinge dazu:

| | |
|---|---|
| `overflow: hidden` auf der Hülle | Auf der Karte steckt das Bild in einem Ausschnitt, der es beschneidet — ohne das träte es beim Übergang über dessen Kante |
| `--morph-zoom` | Im Rahmen der Karte wird die Aufnahme um diesen Wert vergrößert und fährt über den Übergang auf ihr eigenes Maß (rückwärts umgekehrt). Immer ≥ 1 — verkleinert wird nie, sonst träte unter der Aufnahme die Hülle hervor |

Beides mit derselben Dauer und Kurve wie die Hülle, damit Bild und
Rahmen zusammenbleiben.

Nachgemessen an Bildschirmfotos bei auf 6 Sekunden verlangsamtem
Übergang: Das erste Bild ist in beiden Richtungen nicht vom Zustand
davor zu unterscheiden, das letzte nicht vom Zustand danach
(`--morph-zoom` 1,0603 gegen `--bild-groesse` 1,0602 der Karte).

Zwei Feinheiten, an denen es zunächst scheiterte:

- Der Wert muss den Seitentausch überleben. Astro übernimmt die
  Attribute des NEUEN `<html>`; ein Stil am alten wäre danach fort. Er
  wird deshalb in `astro:before-swap` mitgegeben.
- Auf dem Rückweg wird in `astro:page-load` gemessen, nicht in
  `astro:after-swap` — vorher steht die Karte noch nicht an ihrem Platz
  und die Vergrößerung ist noch nicht gesetzt. Die Formel dafür
  (`durchlauf`, `A3_ZUWACHS`) steht jetzt in `scripts/scrollwege.ts`,
  damit Beitragsbilder und Seitenwechsel dieselbe verwenden.

**Die Ansprechperson springt nicht mehr.** Sie klebt beim Scrollen, und
`position: sticky` wirkt erst, wenn der beschnittene Vorfahre den
Überlauf freigibt — also nach der Höhenbewegung. Genau in diesem Moment
sprang sie an ihre klebende Lage. Jetzt blendet sie erst NACH diesem
Moment ein (`[data-offen]` statt `:not([data-zu])`): Der Sprung fällt in
die Zeit, in der sie noch unsichtbar ist. Gemessen bei 1280 × 900: Bis
620 ms Deckkraft 0, dann der Sprung, dann das Einblenden von 620 bis
1100 ms. Auf Handys (klebt unten) ebenso.

Dazu wartet das Skript jetzt gezielt auf das Ende der HÖHENbewegung:
Die Überblendungen des Inhalts melden ihr Ende ebenfalls an die Klappe,
und eine davon gab vorher zu früh frei.

**Die Karte im Kontakt deckt den Bereich wieder ganz.** Die Ebene liegt
jetzt auf seinen vier Kanten (`inset: 0`); verschoben wird die Zeichnung
DARIN (`background-position`), nicht die Ebene. Ihr Maß ist so gewählt,
dass sie auch bei weit außen stehender Marke bis in alle Ecken reicht.
Die vorige Lösung — eine übergroße Ebene — ließ oben und unten einen
Streifen frei, weil das Maß der Zeichnung auf den BEREICH gerechnet war
und nicht auf die Ebene.

**Die Marke steht mittig zwischen dem, was man sieht.** Gemessen wird
der Text selbst (Zeile für Zeile), nicht sein Kasten: Die Absätze laufen
über die ganze Spalte, der Satz darin endet viel früher. Bei 1440 px
sind das 505 px statt 677 — die Marke rückte damit um 86 px nach links,
genau in die Mitte der sichtbaren Lücke.

Ist die Lücke zu eng für sie (unter 52 + 2 × 56 px), steht sie **unter
den beiden Knöpfen** (`data-marke="unterknoepfe"`). Gemessen greift das
zwischen etwa 950 und 1250 px Fensterbreite.

**Kleinigkeiten:** Das Bild im eigenen Abschnitt hat keine abgerundeten
Ecken mehr. Die Beiträge stehen auf breiten Schirmen weiter auseinander
(24 → bis 72 px). Auf Handys ist der Seitenrand knapper (24 → 18 px),
die Sprechstunden nehmen ihn jetzt auch, und die Porträts sind dadurch
und durch einen höheren Rahmen rund 13 % größer.

### Der Fehler hinter dem Fehler: ein Leerzeichen (18. September 2026)

Das Bild kreuzblendete beim Morph — und zwar die ganze Zeit, egal wie
oft die Regeln dafür umgeschrieben wurden. Der Grund war ein
Leerzeichen:

```css
html[data-rueckmorph] ::view-transition-old(.bild)   /* greift NIE */
html[data-rueckmorph]::view-transition-old(.bild)    /* richtig */
```

Die Ebenen eines Übergangs hängen am **Wurzelelement selbst**. Ein
Nachfahren-Kombinator sucht sie unterhalb davon — dort sind sie nicht.
Die Regel ist gültig, wird ohne Warnung übernommen und trifft nichts;
es blieb bei den allgemeinen Regeln (`::view-transition-old(*)`), also
beim Kreuzblenden. Sichtbar wurde das als kurzes helles Aufblitzen in
der Mitte des Übergangs: Dort sind beide Abbilder halb durchsichtig,
und die weiße Seite dahinter scheint durch.

Betroffen waren **alle** so geschriebenen Regeln, auch die fürs
Blättern zwischen zwei Leistungen (`html[data-uebergang] …`). Das
seitliche Durchschieben war deshalb nie zu sehen — es lief die normale
Überblendung. Beides ist jetzt in Ordnung.

**Nachweisbar prüfen** lässt sich so etwas während des Übergangs mit

```js
document.getAnimations()
  .filter((a) => a.effect?.pseudoElement)
  .map((a) => [a.effect.pseudoElement, a.animationName])
```

Steht dort der Name aus der allgemeinen Regel statt des eigenen, greift
die eigene Regel nicht. Bildschirmfotos allein hätten es nicht gezeigt:
Am Anfang und am Ende sah der Übergang richtig aus, nur in der Mitte
nicht.

### Der Pfeil am Menüpunkt „Leistungen" (18. September 2026)

Er steht jetzt **unter** dem Wort statt daneben, auf dessen Mitte — und
damit auf derselben Senkrechten wie der Pfeil der Blase und die Symbole
darin. Beim Öffnen sinkt er ab und blendet aus, während der Pfeil der
Blase ein Stück tiefer aufblendet: Aus dem einen wird der andere. (Vorher
drehte er sich an Ort und Stelle — das Gegenteil davon.)

Die Blase saß dafür bisher nach einem geschätzten Verhältnis
(`knopfX − 15 % der Blasenbreite`). Jetzt wird gerechnet: bis zur Mitte
eines Symbols sind es 36 px Innenabstand plus die halbe Symbolbreite,
also `knopfX − 54`. Nachgemessen bei 1440 px stehen Knopfmitte, Haken,
Blasenpfeil und alle drei Symbole auf demselben Wert.

### „Leistungen" im Menü: öffnen und springen (18. September 2026)

Der Menüpunkt tut zweierlei, in dieser Reihenfolge:

1. Klick, solange zu → die Blase geht auf
2. Klick, während offen → sie schließt, und die Seite springt an den
   Anfang des Leistungsbereichs (`#leistungen`); von einer Unterseite
   aus zur Startseite dorthin

Mit der Maus ist Schritt 1 schon durch das Überfahren erledigt — der
erste Klick springt also gleich. Mit Tastatur oder Finger gibt es kein
Überfahren; dort öffnet der erste Druck und der zweite springt. So
kommt man auf jedem Bedienweg an beides.

Ein Klick auf eine **Kategorie in der Blase** schließt sie sofort,
statt erst beim Wegziehen des Zeigers.
