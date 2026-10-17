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

### Die Pfeile (18. September 2026)

Der Pfeil der Leistungs-Blase — oben wie unten — hatte eine eigene
Form: 1 px stark, runde Enden, Schenkel unter 38°. Neben den übrigen
Pfeilen der Seite, die alle aus `icons/ui/pfeil-runter.svg` kommen
(1,5 px, gerade Enden, Schenkel unter 45°), wirkte seine Spitze stumpf.

Jetzt stimmt er in allem damit überein: Strichstärke 1,5, Enden gerade,
Schenkel unter 45° — die Spitze ist ein spitzer Gehrungsstoß. Nachgemessen
18 × 9 px, also derselbe 90°-Winkel wie beim kleinen Haken (11 × 5,7).

Der Haken am Menüpunkt selbst steht 3 px näher am Wort (5 px Abstand
statt 8), und die drei Kategorien im Handy-Menü sind 20 px eingerückt
statt 6 — so lesen sie sich als Unterpunkte, ohne abgehängt zu wirken.

### Erklärtext der Leistungskategorien breiter (18. September 2026)

Er stand auf der üblichen Absatzbreite (`--breite-absatz`, 34 rem) —
unter einer Gruppenzeile, die über die ganze Inhaltsbreite läuft, und
über Kacheln, die dasselbe tun. Dazwischen wirkte er nach links
gestaucht (Florian).

Jetzt `min(48rem, 100%)`: bei 1440 px sind das 768 statt 544, gemessen
rund 75 Zeichen je Zeile. Das liegt noch gut im lesbaren Bereich
(45–90); deutlich weiter zu gehen ginge auf Kosten der Lesbarkeit. Die
Einleitung des Abschnitts darüber bleibt auf der schmalen Absatzbreite —
sie gehört zur Überschrift, nicht zu den Kacheln.

## Die Durchsicht der Praxis (26. September 2026)

Siebzehn Rückmeldungen von Florian und der Kundin, an einem Tag
umgesetzt. Jeder Punkt hat hier seinen Absatz; wo ein Wert nur so und
nicht anders sein darf, steht warum.

### Überschriften wieder kräftig

Die Praxis wollte die dicken Überschriften zurück. Alle Überschriften
tragen jetzt `--gewicht-titel: 580` — Source Sans 3 ist eine variable
Schrift, jeder Zwischenwert ist ein echter Schnitt. Die alte
Webflow-Seite setzte 600 und 700; 580 ist „minimal weniger dick" als
dort und bleibt unter den Labels (600), damit Kicker und Überschrift
nicht dasselbe Gewicht tragen. Der leichte Schnitt (300) des Handoffs
vom 17. September ist damit zurückgenommen; die Sperrungen, die für 300
gesetzt waren, sind um rund 0,003 em gelockert (bei 580 sind die Stämme
breiter, große Grade liefen sonst zu dicht). Auch Kachel- und
Beitragstitel hängen am Token. Nur die große Telefonnummer im Kontakt
bleibt leicht (300). Sollte 580 neben der Live-Seite noch zu schwer
wirken, ist 560 der nächste Schritt — eine Zeile in tokens.css.

### Pfeilspitzen und der Haken, der sich nicht mehr dreht

`pfeil-runter.svg` hatte 0,71 Einheiten Rand; der Gehrungsstachel eines
90°-Winkels bei 1,5 px ragt aber gut 1 px über den Scheitel. Als
Hintergrundbild mit `contain` wurde die Spitze überall abgeschnitten
(Kopfmenü-Haken, Handy-Menü, Scrollhinweis). Jetzt `viewBox 0 0 62 38`
mit Rand seitlich/oben 3,5 und unten 7 Einheiten; die Kästen sind
entsprechend gewachsen, der sichtbare Haken ist gleich groß. Der
Textlink-Pfeil („Mehr erfahren", „Beitrag lesen") war die um 90°
gedrehte Zeichnung, deren Schenkel der 28er-Kasten flach abschnitt —
jetzt ein eigener Rechtshaken 9 × 14. Die Kontakt-Marke darf über ihren
Kasten hinaus (`overflow="visible"`), sonst fehlten 0,46 px weißer Saum
an der Spitze.

Die Haken an Aufklappern (Stellen, Tätigkeiten im Team) **drehen sich
nicht mehr um 180°**: Sie bestehen aus zwei Schenkeln
(`components/Haken.astro`), die um die Spitze schwenken — erst liegen
sie flach zu einer waagerechten Linie, dann klappen sie nach oben
heraus (Florian). Weil die Spitze fest in der Kastenmitte sitzt, fährt
der Kasten um die halbe Hakenhöhe mit, und die Zeichnung bleibt optisch
an Ort und Stelle. Eckige Enden (`square`) treffen sich an der Spitze
wie ein Gehrungsstoß. Der Zustand kommt vom `aria-expanded` des
Aufklappers, die Bewegung steht in global.css.

### Kein Tipp-Blitz, kein Widerrufsknopf

`-webkit-tap-highlight-color: transparent` auf Verweisen, Knöpfen und
Labels — iOS zeichnete beim Tippen einen grauen Schatten; die Knöpfe
zeigen ihre Reaktion selbst. Der Fokusring für die Tastatur bleibt.

Der Widerrufsknopf im Fußbereich und `scripts/einwilligung.ts` sind
weg: Nichts setzt die Zustimmung mehr, seit die Karte nicht mehr
eingebettet ist. Bewusst **keine** Bereinigung des alten
`localStorage`-Eintrags: Die Seite ist noch nicht live, der Wert ist ein
wirkungsloser Boolean im Browser des Testers — ein Einzeiler, der für
immer bei jedem Aufruf liefe, widerspräche der Regel, dass alles in zwei
Jahren noch nachvollziehbar sein soll. Datenschutzerklärung, README,
CLAUDE.md und das Prüfskript sprechen nicht mehr von der Ausnahme.

### Das Handy-Menü als Blase

Es öffnet wie das Aufklappmenü „Leistungen" auf dem Desktop: Die
Punktlinie der Kopfleiste wölbt sich zu einem milchigen Feld — nur mit
anderer Form (Florians Entwurf): Der Teil der Linie unter dem Logo
bleibt oben, rechts davon schwingt sie in einem großen Bogen nach unten
(Radius 120 × 80 px), die Wand driftet 4° nach rechts, unten eine
40-px-Ecke, und die Blase ist zum rechten Rand hin offen. Zeichnung,
Maske und Bewegung teilen sich beide Formen in `blaseAnlegen()`; die
Form selbst ist je eine `Geometrie`-Funktion. Die Wand steht 12 px
rechts von der Logokante (gemessen), die Zeilen folgen ihr über einen
Versatz aus ihrer Höhe im Menü. Der 700-ms-Rasteraufklapp, der
Rollkasten und die Doppellinie von früher sind weg — die Liste ist
kompakt genug für jedes Handy (Hauptliste 452 px samt Kopfleiste).

Hinter dem offenen Menü liegt ein **weißer Schleier** über der ganzen
Seite (60 % Weiß, 7 px Weichzeichner wie hinter der Hinweis-Karte),
ein Tipp darauf schließt. Er steht außerhalb der Navigation, weil deren
Maske ihn sonst mit beschnitte. Die Seite steht still: `overflow:
hidden` an der Wurzel plus — nur solange offen — ein Zuhörer, der das
Wischen mit einem Finger unterbindet; iOS Safari hält sich sonst nicht
an das `overflow`. Kein `position: fixed` am Body: Das setzte `scrollY`
auf 0 und würfe die Einstiegskarte aus der Bahn. Das Menü schließt bei
Escape, `focusout`, Seitenwechsel (`astro:before-preparation`, also
bevor Astro die Wurzelattribute tauscht) und beim Verbreitern über
991 px.

**„Leistungen" ist kein Akkordeon mehr, sondern ein Ebenenwechsel**
(Florian): Beim Tipp schrumpfen alle anderen Zeilen über ihre
Rasterhöhe auf Null (320 ms), die Leistungen-Zeile rückt dadurch in
derselben Bewegung an den Kopf und wird zum Zurück-Knopf (Haken dreht
nach links, „Zurück" blendet ein), die Kategorien wachsen darunter
gestaffelt von Null (ab 140 ms, je 60 ms später). Zurück:
Kategorien sofort zu (260 ms), Hauptliste ab 120 ms nach. Jede Zeile
ist ein kleines Raster; die Zelle darin trägt Inhalt und Haarlinie,
damit die Linie mit der Zeile verschwindet. Die Blase folgt der Höhe
über einen `ResizeObserver` Bild für Bild.

**Die Telefonnummer** steht als Pille zwischen Logo und Menüknopf
(≈116 px; bei 320 px Fensterbreite bleiben je 21 px Luft) und in der
Symbolleiste — nicht mehr im Menü. Datenschutz und Impressum nur noch
im Fußbereich.

### Blase ohne Bounce, Rolle ohne Abbruch

Das Öffnen der Leistungs-Blase hatte einen Sinus-Zusatz („leichtes
Überschwingen"). Weg — `KURVEN.betont` ist jetzt dieselbe Kurve wie
`--verlauf-betont`, und die Oberpunkte nehmen sie auch (statt der
„Aufreißen"-Kurve, die tokens.css für die Seitenwechsel schon
verworfen hatte).

Die Text-Rolle der Menüpunkte hing an `:hover` und brach ab, sobald der
Zeiger den Punkt verließ — der Text sprang zurück. Jetzt setzt das
Skript `data-rollt` beim Betreten und nimmt es erst am Ende der
Animation (420 ms, `--verlauf-betont`). Bei „Leistungen" tötete
`animation: none` im Zustand `data-offen` die gerade gestartete Rolle;
die Regel greift jetzt nur, wenn keine Rolle läuft — sie endet ohnehin
genau dort.

### Erster Seitenaufbau ohne Blitzer

Vorher stand das statische Logo im HTML, verschwand hart, sobald die
Lottie bereit war, und zeichnete sich dann 2,5 s ein. Jetzt beginnt die
Seite weiß, das Logo zeichnet sich ein, und erst wenn es halb steht
(≈1,25 s), blenden Kontaktzeile, Symbolleiste, Scrollhinweis und die
Hinweis-Karte ein — scharf werdend aus 10 px Unschärfe, in 800 ms,
leicht gestaffelt (Florian).

Gesteuert über `<html data-laden>`: `public/laden.js` setzt `wartet`
vor dem ersten Bild — blockierend im `<head>` und als **eigene Datei,
weil die CSP (`public/_headers`) keine eingebetteten Skripte erlaubt**.
Startbereich.astro setzt `da`, sobald die Zeichnung halb steht; ein
Sicherheitsnetz tut es nach 2,5 s auf jeden Fall (dann mit dem
statischen Logo, und die Lottie übernimmt später fertig gezeichnet,
statt sich noch einmal einzuzeichnen). Ohne das
Attribut ist alles sichtbar: Unterseiten, Seitenwechsel per Router
(Astro tauscht die Attribute von `<html>`), Aufruf mit Sprungmarke,
reduzierte Bewegung, ohne JavaScript. Ein Neuladen mit gemerkter
Scrollposition räumt das Attribut beim ersten `scroll` ab. Die
Lottie-Datei wird vorgeladen (`as="fetch" crossorigin` — lottie-web
holt sie per XHR im CORS-Modus). Eine Animation statt einer Transition,
weil Symbolleiste und Kontaktzeile eigene Transitions für den
Leistenwechsel tragen.

**Der Saum um den Verlauf, zum dritten Mal.** Die erste Fassung ließ
auch den Scrollhinweis und das statische Logo über `opacity` und
`filter: blur()` einblenden — und um die weiße Lottie-Fläche stand
wieder der bekannte Saum aus dem Verlaufsbild (Florian). Gemessen mit
einzeln angestoßenen Animationen: `opacity` auf der Kontaktzeile →
sauber; auf der Symbolleiste → sauber; `opacity` auf dem
**Scrollhinweis** → Saum; `will-change` dort statisch → sauber;
`color` dort → sauber; Weichzeichner auf beiden Leisten → sauber. Der
Scrollhinweis liegt in derselben festen Ebene wie das Logo
(`.startbereich`); läuft dort eine Compositor-Animation, rastert der
Browser den 30-fach vergrößerten Verlauf neu und weich — dasselbe, was
`transform: scale` und `will-change` am Logo schon einmal auslösten.
Deshalb blendet der Scrollhinweis jetzt allein über seine **Farbe** auf
(läuft im Hauptthread), der Haken ist dafür ein Inline-SVG in
`currentColor` statt eines Hintergrundbilds, und das statische Logo
wird nur über `visibility` verborgen. Die Leisten behalten ihren
Weichzeichner. Regel: **Im Startbereich nichts über `opacity`,
`filter` oder `transform` animieren, solange der Verlauf steht.**

**Zwei Nachbesserungen am selben Tag (Florian):** Die Punktlinie oben
hängt als `::after` am Umschlag der Navigation, nicht an der
Kontaktzeile — sie stand deshalb von Anfang an da. Jetzt blenden die
ganzen Umschläge ein (`.navigation`, `.fussleiste-huelle`), wie unten
schon die Symbolleiste. Und das Einzeichnen des Logos gehört allein dem
ersten Aufbau: In jedem anderen Fall — Seitenwechsel per Router zur
Startseite, Neuladen mit gemerkter Scrollposition, nach dem
Sicherheitsnetz — steht das statische Logo schon, und die Animation
übernahm bisher bei leerem Bild: Logo da, Logo weg, Logo zeichnet sich
neu. Das war das „manchmal blitzt etwas auf". Jetzt übernimmt sie in
diesen Fällen fertig gezeichnet (Bild 0), der Tausch ist nicht zu
sehen.

Nebenbei: Die Einstiegskarte stand vor dem Skript mit 700 px Versatz
über dem Logo; die Vorgabe stellt sie jetzt ganz unter die Bühne
(`100 % + Ruhelage + 40 px`, dasselbe wie `startBestimmen()`), und
ohne JavaScript greift ein `<noscript>`-Block mit den Regeln der
reduzierten Bewegung.

### Das Symbol wandert als ein Bild

Im Morph der Leistungen lief das Symbol über die allgemeine Blende
(alt 45 % der Dauer, neu ab 20 % für 55 %) — zusammen 13 % Deckkraft
nach 128 ms, das Symbol flackerte. Jetzt wird nur die Aufnahme der
Leistungsseite gezeigt (hin: die neue, zurück: die alte), ohne Blende,
wie beim Beitragsbild; `object-fit: contain` passt sie in die wachsende
Hülle. Kein `--morph-zoom`: gleiches Seitenverhältnis. Der Titel
(h3 einfarbig gegen h1 mit Verlauf — verschiedene Inhalte) blendet
weiter, aber beide Aufnahmen über die volle Dauer und addiert
(`plus-lighter`): Die Summe der Deckkräfte ist immer 1.

### Der Einstieg auf Handys: erst die Sprechstunden

Bis 991 px gilt wieder die Reihenfolge der mobilen Vorlage: Logo →
Sprechstunden-Blase schnalzt herein → Begrüßung → Bilderband
(Florian). Das Skript nimmt Begrüßung und Band aus der Karte und stellt
sie an den Anfang von `<main>` (`vorspannAnordnen`, auch beim
Größenwechsel); die Karte ist dann nur die Sprechstunden, und **die
ganze Bewegungsrechnung bleibt unverändert** — Scrollweg, Stützstellen,
Raumhöhe, Startwert. Die Alternative (Sprechstunden per `order` in der
Karte zuerst) hätte die zentrierte Begrüßung in Ruhelage genau in die
Zipfelzone gestellt und vier neue gekoppelte Maße gebraucht. Auf dem
Desktop fährt weiter alles gemeinsam herein („Der Einstieg ist eine
Karte" gilt dort unverändert). `scripts/anker.ts` misst Sprungmarken
außerhalb der Karte normal — `#praxis` und `#galerie` sind auf Handys
gewöhnliche Abschnitte.

Die Begrüßung braucht dort oben so viel Luft, dass der Zipfel in
Ruhelage über leerem Weiß steht und die Überschrift noch unter der
Symbolleiste liegt (`Zipfellänge + 16 px`, als Außenabstand); die
Leiste fährt beim Schnalz weg und gibt sie frei. Nach dem Schnalz
bleibt dadurch rund 60 px mehr Weiß zwischen Karte und Begrüßung als
zwischen zwei Abschnitten sonst — auf Handys unvermeidlich.

**`--zipfel-laenge` stand am Raum und kam bei der Karte nie an**
(`.ozbereich` ist ein Geschwister): Der Desktop-Zipfel war 154 statt
der festgelegten 175 px, während der Raum 175 abzog. Jetzt an der
Wurzel, Umbruch bei 62 rem = 992 px wie die Navigation. Die
Zipfel-Stützstellen (30/61/74/78 %) bleiben (der Scrollweg selbst wurde
später am Tag gekürzt, siehe „Die Sprechstunden kommen früher"): Die
Wartezeit hängt am Logo, nicht an der Kartenhöhe; die kürzere Karte
(788 statt ≈1 800 px) fährt 0,44 statt 1,0 px je Scroll-px — näher an
der Vorlage. Das Skript setzt außerdem `--oz-start` nur noch aus der
Sprechstunden-Höhe (1106 px bei 375 px Breite).

**Kompakter:** Die Sprechstunden sind auf Handys rund 130 px kürzer
(788 statt ≈914 px): Innenabstand oben 24 statt 40 px, Zeile 8 statt
14, Einleitung 15 px mit engerer Zeilenhöhe, Spaltenabstand 32 statt
40, Listentitel 12 statt 16, Zeilen 6 statt 8 px. Die 14 px unter
480 px bleiben: Bei 15 px bräche die Zeitspalte um.

**Das Kreuz klebt auf Handys wie auf den Leistungsseiten:** In der
Zeile steht erst das nackte Kreuz ohne Kreis; erreicht es beim
Scrollen die Kopfleiste (96 px), übernimmt ein Zwilling fest im Fenster
— milchiger Grund, der Kreis zeichnet sich ein. `sticky` oder `fixed`
in der Karte selbst geht nicht (sie ist transformiert und
beschnitten), deshalb misst `kreuzKleben()` je Bild die Lage des
Zeilen-Kreuzes; beide stehen bei der Übergabe deckungsgleich. Fährt die
Karte oben hinaus, nimmt der Zwilling das Kreuz mit
(`--kreuz-oben = min(96, Kartenunterkante − 48)`). Die geteilten
Klebe-Regeln aller drei Stellen stehen jetzt in global.css. Die Bühne
beschneidet mit `overflow: clip` statt `hidden`: `hidden` machte sie
zum Scroll-Container, und ein Tastaturfokus auf etwas Abgeschnittenes
hätte ihren `scrollTop` verstellen können. Das Kreuz scrollt auf
Handys zur Begrüßung, auf dem Desktop wie bisher ans Ende des
Bereichs. Die Festlegung „40 px unter der Oberkante" vom 17. September
ist seit dem 18. überholt (Kreuz in der Titelzeile).

### Die Knopfzeile — für Abschnitte und Leistungen

Unter einem Redaktionstext kann ein kurzer Satz über den Knöpfen
stehen (Florian): neues Feld `knoepfe_text`, „Satz über den Knöpfen".
Satz und bis zu zwei Knöpfe (Verweis, PDF) sind ein gemeinsamer
Baustein (`components/Knopfzeile.astro`), den die eigenen Abschnitte
und **neu auch die Leistungsseiten** nutzen — dort mit denselben fünf
Feldern in Schema und Redaktion, alle freiwillig (bestehende Einträge
haben sie nicht). Abstand zum Text 28 px statt 34 (und nach einer Liste
58 — der Nachlauf der letzten Liste ist jetzt überall weg), der Satz
gedeckt in Fließgröße, 14 px über den Knöpfen. Sprungmarken werden zu
`/#…`, damit sie auch von einer Leistungsseite zur Startseite führen;
`anker.ts` setzt jede Sprungmarke beim Laden mit Platz für die
Kopfleiste nach (vorher nur `#oz_anchor`).

### Kieferorthopädie sichtbarer

Der Erklärtext der Kategorie war dreimal so lang wie der der
zahnärztlichen Leistungen — jetzt ein Satz. Dafür gibt es einen eigenen
Abschnitt „Zahnmedizin und Kieferorthopädie unter einem Dach" in
`abschnitte.json` (ohne Bild — es gibt kein kieferorthopädisches Foto;
die Praxis kann eines nachreichen) mit Satz und Knopf zur
Kategorie (`#leistungen-kieferorthopaedie`). Die Praxis ist zahnärztlich
ausgelastet und wünscht sich mehr kieferorthopädische Patienten. Alle
Aussagen stammen aus dem bisherigen Erklärtext und den beiden
Leistungsseiten.

**Offen (nicht geändert):** In `abschnitte.json` steht beim Eintrag der
Praxis ein Platzhalter-Knopf „hallo" → „hallo" (live sichtbar) und die
Bildbeschreibung „Bildschirmfoto einer Newsletter-Anmeldung"; in
`leistungen.json` ist `beispielleistung` unter „Sonstige" aktiv.

### Kontakt: Karte am Scrollweg, Marke sofort, Handys herausgezoomt (26. September 2026)

Alles in `src/components/Kontakt.astro`; das Token `--farbe-karte-grund`
(`#f5f3f4`) ist der Grundton der Zeichnung selbst.

**Der Anflug hängt am Scrollweg, nicht mehr an der Uhr.** Bisher fuhr die
Zeichnung als CSS-Übergang von 110 auf 100 % (2,2 s), ausgelöst von einem
IntersectionObserver, sobald 30 % des Bereichs im Bild waren — und die
Marke wartete danach noch 2,3 s. Wer flott herunterscrollte, sah davon nur
den Rest, wer langsam kam, wartete. Jetzt ist der Weg der Spitze der Marke
das Maß: 0, wenn sie unten ins Fenster tritt, 1, wenn sie bei 45 % der
Fensterhöhe steht (Weg = 0,55 Fensterhöhen; bei 900 px hoch 495 px, auf
dem Handy mit 812 px 447 px). Darüber fährt die Zeichnung von 125 auf
100 % herunter, quadratisch auslaufend (`1 + 0,25 · (1 − p)²`): erst
zügig, dann immer sanfter — dasselbe Gefühl wie das `flyTo` des Entwurfs.
Der gezeichnete Wert läuft dem Scrollwert nach (`nachziehen` aus
`scrollwege.ts`, wie das Gruppenfoto). Das Skript schreibt `--karte-zoom`
auf den Bereich; das CSS setzt `scale: var(--karte-zoom, 1)` mit dem
Bezugspunkt auf der Marke — die Praxis steht, alles andere kommt auf sie
zu. Ohne Skript steht die Zeichnung still auf 100 % (vorher hing sie ohne
Skript auf 110 %).

**Die Marke fällt bei 55 % des Wegs** (`data-da`, einmal und endgültig),
also wenn die Spitze etwa 70 % der Fensterhöhe von oben erreicht — die
Zeichnung ist dann auf 105 % und rollt nur noch aus. Wer zurückscrollt,
sieht die Karte wieder heranfahren; die Marke bleibt. Bei
`prefers-reduced-motion` läuft keine Schleife: `--karte-zoom` bleibt 1,
`data-da` wird sofort gesetzt.

**Die Marke fällt kürzer, näher und setzt hörbar auf.** 0,6 s statt 0,9 s,
ohne Wartezeit (vorher 2,3 s), aus 56 px Höhe statt 70, mit 4 px
Durchsetzen und 2 px Zurückfedern (Stützstellen 65 / 85 %); der
Schlagschatten ist flacher (8/12 px, 30 % statt 10/14 px, 35 %). Neu ist
ein **Bodenschatten** (`.kontakt__aufsetzer`, 26 × 9 px, radial 30 % → 0),
der bis 45 % der Fallzeit unsichtbar bleibt, beim Aufsetzen auf 115 %
aufblitzt und auf 100 % / 90 % Deckung zurücknimmt. Er steht im Baum VOR
dem Tropfen, damit er unter dessen Spitze gemalt wird. Die Ringe setzen
0,55 s nach `data-da` ein (statt 3,2 s), laufen 2,4 s (statt 2,6) und der
zweite um genau eine halbe Runde versetzt (1,75 s = 0,55 + 1,2). Alle
drei Abläufe nehmen `--verlauf-betont` — es war ohnehin dieselbe Kurve,
nur ausgeschrieben.

**Handys sehen den Ort, nicht den Häuserblock.** Das Maß der Zeichnung
rechnete bisher auf allen Größen so, dass sie bis in alle vier Ecken des
Bereichs reicht. Gestapelt (bis 900 px) ist der Bereich aber viel höher
als breit, und die Senkrechte gab den Ausschlag: Bei 375 px Breite und
einem 1 200 bis 1 400 px hohen Bereich ergibt die Formel rechnerisch 1,2
bis 1,5 — eine 2 300 bis 2 900 px breite Zeichnung, von der 375 px zu
sehen waren. Jetzt steht sie gestapelt in festem Maß `MASS_SCHMAL = 0,73`
(1402 × 789 px) und muss nur noch waagerecht bis in beide Ecken reichen
(bei 375 px verlangt das 0,28, bei 900 px im Modus `seite` 0,74 — der
feste Wert greift also praktisch überall). „Gestapelt" wird gemessen, nicht geraten: Es ist
dasselbe `nebeneinander`, mit dem auch die Marke ihre Stelle wählt, und
damit exakt der CSS-Umbruch — auch mit sichtbarem Rollbalken.

Was die Zeichnung senkrecht nicht mehr deckt, läuft weich aus: Der
Bereich hat als Hintergrund `--farbe-karte-grund` (nebeneinander nie zu
sehen, weil die Zeichnung deckt), und bis 900 px liegt auf der Zeichnung
eine **Maske** — eine Ellipse in Maß und Lage der Zeichnung, bis zur
halben Achse voll, dann bis zur Kante auf nichts (`radial-gradient(ellipse
farthest-side at center, #000 50%, transparent 100%)`, mit
`-webkit-`-Präfix für Safari bis 15). Nötig, weil der eigene Randverlauf
der SVG (`radialGradient#rand`, 55 → 100 %) an der Kante nur auf 85 %
Grund ausläuft — 15 % der Zeichnung blieben sichtbar, und damit ihre
rechteckige Kante. Ohne Skript bleibt beides `cover`; die Ellipse liegt
dann auf dem Bereich selbst, und die Ecken laufen in den Grund aus.

**Die Formularkarte geht auf volle Breite, wenn die Marke über ihr
steht** (`data-marke="unten"`): Sie steht dann unter der Marke, nicht
neben ihr, und das feste Maß von 480 px ließ rechts nur einen leeren
Streifen. Rechnerisch: `unten` gilt bis 627 px Fensterbreite
(Platz rechts = 0,95 · Breite − 480 ≤ 116), und ab 534 px war die Karte
schmaler als die Spalte — zwischen 534 und 627 px wächst sie also, bei
600 px von 480 auf 540 px. Ab 628 px steht die Marke rechts neben der
Karte (`seite`), die bleibt bei 480. Auf 375 px ändert sich nichts, die
Karte war schon so breit wie die Spalte.

Damit das nicht kippt, geht jede Messung vom selben Stand aus: `messen()`
löscht `data-marke`, bevor es zweimal misst — der erste Durchgang sieht
immer die 480-px-Karte, der zweite das Ergebnis. Vorher hinge das
Ergebnis davon ab, wo man herkommt: Eine Karte, die einmal auf volle
Breite gegangen war, ließe rechts nie wieder Platz für die Marke (bei
640 px bliebe es bei `unten`, käme man von schmaler). Nach jeder Messung läuft
außerdem der Anflug einmal nach, weil die Marke gewandert sein kann.

**Kleinigkeiten:** Die Einleitung im Kontakt steht auf `--breite-absatz`
(34 rem = 544 px) statt 30 rem (480) wie alle anderen Einleitungen; die
Notiz unter den Knöpfen ist 15 px wie die Faxzeile darüber (vorher 14).

### Die Stellenliste: ruhiger auf und zu (26. September 2026)

**Nichts wandert mehr, während der Anriss verschwindet.** Der Knopf
richtete seinen Inhalt mittig aus (`align-items: center`); zog sich
beim Aufklappen der Anriss unter der Bezeichnung zusammen, rückten
Kreis und Umfang mit ihm nach oben. Jetzt steht alles oben
(`flex-start`), und Kreis, Umfang und — einspaltig — die Nummer sitzen
rechnerisch auf der **ersten Zeile** der Bezeichnung:
`margin-top = (Zeilenhöhe − eigene Höhe) / 2`, mit der Zeilenhöhe
`1,28 × Schriftgröße` als eigener Variable am Knopf (`--titel-zeile`).
Eigene Höhen: Kreis 32 px, Umfang 29 px (13 px Zeile + 2 × 7 px
Innenabstand + 2 × 1 px Rahmen), Nummer 12 px. Bei 1440 px ist die
Zeile 32,8 px hoch — der Kreis rückt 0,4 px, der Umfang 1,9 px nach
unten; bei 375 px (Zeile 23,8 px) steht der Kreis 4 px **über** der
Zeile, also ein Stück im Innenabstand des Knopfs. Das ist gewollt: Er
bleibt mittig auf der Zeile. Die Nummer auf breiten Fenstern bleibt
absolut im Seitenrand, wie gehabt.

**Auf Handys wächst die aufgeklappte Bezeichnung** (bis 800 px): von
`clamp(1.15rem, 1rem + 0.7vw, 1.6rem)` auf
`clamp(1.35rem, 1.15rem + 0.85vw, 1.85rem)`, bei 375 px also
18,6 → 21,6 px, bei 800 px 21,6 → 25,2 px, in 0,45 s mit derselben
Kurve wie der Anriss. Einspaltig gibt es sonst nichts, was die offene
Zeile von den zugeklappten abhebt — auf breiten Fenstern tut das die
zweite Spalte, dort bleibt die Größe. Kreis und Nummer ziehen auf ihrer
Zeile mit (Übergang auf `margin-top`, ebenfalls 0,45 s). Die Übergänge
sind wie alle anderen erst nach dem Zuklappen beim Laden freigegeben
(`[data-bereit]`), sonst schrumpften beim Laden alle Bezeichnungen.

**Straffer:** Die Höhe läuft in 0,5 s statt 0,62; der Text kommt nach
0,1 s statt 0,14; die Spalte mit der Ansprechperson kommt **ohne**
Verzögerung (vorher 0,04 s) und in 0,4 s statt 0,5 — die Klappe hat ja
schon gewartet. Beim Öffnen ist der Text damit nach 600 ms ganz da, die
Ansprechperson nach rund 900 ms (vorher 640 bzw. 1160 ms).

**Zuklappen in zwei Schritten.** Bisher fielen Höhe und Inhalt zugleich,
und mit dem Zuklappen verlor die Ansprechperson sofort ihre klebende
Lage: ein sichtbarer Sprung zurück in die Zeile, unten wie oben. Jetzt
(`data-schliesst`):

1. 0–200 ms: Text und Ansprechperson blenden aus und sinken 16 px
   (auf Handys sinkt die Ansprechperson 28 px — dorthin, wo sie am
   unteren Rand auch herkam); die Klappe steht dabei in voller Höhe,
   die Spalte klebt noch.
2. ab 200 ms: `data-offen` fällt (Überlauf wieder beschnitten), die
   Höhe fährt in 0,5 s zu.

Zusammen 700 ms statt 620 — davon sieht man aber nichts mehr springen.
Die Dauern stehen als `KLAPPEN = 500` und `AUSBLENDEN = 200` im Skript
und **müssen mit dem CSS übereinstimmen**. Die alten Regeln unter
`[data-zu]` bleiben als Rückfall: für eine Klappe, die zugeht, bevor sie
je ganz offen stand (schnelles Hin und Her), und ohne Bewegung.

Das Warten auf das Ende der Höhenbewegung hat einen Zeitgeber als
Ersatz (`KLAPPEN + 80` ms) und hört auch auf `transitioncancel`. Eine
Feinheit: Wird eine Klappe wieder geöffnet, während sie noch zufährt,
**bricht der Browser die alte Bewegung ab und meldet das** — obwohl
sofort die neue läuft. Deshalb wird bei einem Abbruch erst mit
`getAnimations()` nachgesehen, ob noch eine Höhenbewegung läuft; nur
wenn nicht, gilt die Klappe als angekommen. Ohne diese Prüfung bliebe
eine so wiedergeöffnete Stelle ohne Ansprechperson.

**Die geöffnete Bezeichnung kommt unter die Kopfleiste.** Wer weit
unten eine Stelle öffnet, während oben eine andere zugeht, sah die
Bezeichnung nach oben aus dem Fenster rutschen. Jetzt misst das Skript
ihre Zeile und rechnet vor, was das Zuklappen der anderen Stelle
darüber verändert: minus deren Klappenhöhe, plus deren Anriss, der
wieder zum Vorschein kommt (`scrollHeight` + 6 px Abstand). Landet die
Zeile über 96 px (80 px Kopfleiste + 16 px Luft, dieselben Werte wie in
`scripts/anker.ts`), scrollt die Seite sanft so weit, dass sie genau
dort steht. Steht sie ohnehin tiefer, passiert nichts.

**Zwei Kleinigkeiten am Rande:** Der Text in der Klappe hat jetzt die
Größe der freien Abschnitte (`--text-flies`, 16,3–18,9 px statt fest
16,5 px; Aufzählungen ebenso statt 15,5 px). Und die
`prefers-reduced-motion`-Regeln der Liste griffen bisher nicht: Die
Übergänge sind über `.stellen__liste[data-bereit] …` freigegeben, die
Abschaltung stand nur an der Klasse — geringere Spezifität, keine
Wirkung. Jetzt hat sie denselben Vorspann.

### Das Team auf Handys mittig (26. September 2026)

Bis 767 px steht im Team-Bereich alles **mittig**: Kicker und Titel im
Banner, Name, Funktion, der Tätigkeiten-Knopf und die Liste darunter
(Florian). Zwei Karten nebeneinander wirkten linksbündig ausgefranst —
jede Karte ist breiter als ihr Text. Auf breiten Fenstern bleibt es beim
Handoff, alles links; die Regeln stehen vollständig im Umbruch.

Dafür haben beide Raster jetzt **feste zwei Spalten**. Das Praxisteam
stand auf `auto-fill` ab 180 px, und das ergab zwischen rund 655 und
767 px drei Spalten (3 × 180 + 2 × 24 = 588 px Inhalt; der Seitenrand
misst dort 5 %, also 0,9 × Fensterbreite ≥ 588) — dann konnte CSS nicht
wissen, welche Karte allein in ihrer Reihe steht.
Mit zwei Spalten weiß es das: Die letzte Karte an ungerader Stelle
(`:last-child:nth-child(odd)` — der dritte Arzt, die dreizehnte im
Praxisteam) liegt über beide Spalten, mittig, in Spaltenbreite
(`50 % − halbe Lücke`). Bewusst **nicht** `justify-items: center` fürs
ganze Raster: Damit schrumpften alle Karten auf ihren Inhalt, und unter
480 px bezieht das Porträt seine Größe aus der Kartenbreite. Das Skript
für die Reihenenden erkennt die allein stehende Karte weiter über ihre
Höhe (`offsetTop`) und markiert sie `allein` — der Schattensaum läuft
bei ihr nach beiden Seiten symmetrisch aus. Die frühere Sonderregel
unter 480 px (dort schon zwei feste Spalten) ist damit überflüssig und
weg.

Der Tätigkeiten-Knopf hatte einen eigenen, dünneren Fokusring
(2 px, Versatz 3 px). Der ist weg — es gilt der allgemeine 3-px-Ring
der Seite wie überall.

### Die Karte reicht auf Handys bis unten (26. September 2026)

Mit dem 16:9-Bild des Handoffs blieb unter dem Formular nur der leere
Grund — „grau-pflaume" (Florian). Die Rohdaten des Handoffs
(`docs/referenz/assets/karte-daten.json`, jetzt im Repo) reichen nach
oben und unten aber fast doppelt so weit wie das Bild. Daraus zeichnet
`scripts/karte-zeichnen.mjs` ein **hochkantes** Bild,
`public/bilder/deko/karte-bietigheim-hoch.svg`: 1080 × 1646, dieselbe
Abbildung wie der Handoff (Praxis = Datenpunkt 0/0, ein Datenmaß =
1920/1400 Bildpunkte, gleiche Farben und Strichstärken), die Praxis im
oberen Drittel (540 / 548,6). Unter der Praxis liegen damit gut 1 100
Bildpunkte Karte statt 540.

Gestapelt (bis 900 px) tauscht das CSS das Bild, und das Skript wählt
das Maß so, dass die Zeichnung unter der Marke bis zur Unterkante des
Bereichs reicht — plus 200 px Überstand, damit der Randverlauf der
Maske hinter die Unterkante fällt: `mass = max(0,73, waagerechte
Deckung, (Höhe + 200 − y) / (1646 − 548,6))`. Bei 375 × 812 und einem
1 512 px hohen Bereich sind das rund 0,98 → 1 060 px breit; sichtbar
bleibt gut ein Drittel der Zeichnung, der Ort ist weiter als Stadtplan
zu erkennen. Was oben
über den Rand ragt, deckt der weiße Schleier. `--karte-lage` legt seit-
dem nicht mehr die Bildmitte, sondern den Praxispunkt der jeweiligen
Zeichnung unter die Spitze der Marke. Das Querformat bleibt die Datei
des Handoffs; das Skript zeichnet nur das Hochformat.

### Handy-Menü: gerade Wand, Nummer als Text; Team-Banner größer (26. September 2026, abends)

- **Die Wand der Handy-Blase läuft senkrecht**, die Zeilen stehen genau
  untereinander, die Kategorien 22 px eingerückt. Die Neigung und der
  große Schwung aus Florians erstem Entwurf sind zurückgenommen: Das
  Öffnen wirkte damit weniger „blasig" als das Aufklappmenü auf dem
  Desktop. Jetzt ist die Handy-Blase die linke Hälfte der Desktop-Blase
  — mit derselben Bewegung: Der Fuß steht fest (40 px links der Wand),
  die Bögen beginnen 150 px breit und flach und ziehen sich mit der Höhe
  auf die 40-px-Rundung zusammen, während die Wand nach links an ihren
  Platz rückt (`HUEGEL`, `weich`). In keiner Phase gibt es eine Ecke.
- **Die Telefonnummer in der Handy-Kopfleiste ist Text, keine Pille**:
  rechts neben dem Menüknopf, durch einen Punkt getrennt — wie die
  Punkte zwischen den Menüpunkten auf dem Desktop (Florian).
- **Das X des Menüknopfs wurde mit jedem Klick schmaler** (Florian).
  Ursache in lottie-web: `playSegments` setzt `totalFrames` auf die
  Länge des gespielten Abschnitts (`adjustSegment`). Der Code las den
  Wert bei jedem Klick neu — `[0, totalFrames − 1]`, dann
  `[totalFrames − 1, 0]` — und spielte so jedes Mal ein Bild weniger,
  bis die Balken gar nicht mehr drehten. Die Bildzahl wird jetzt einmal
  beim Laden gemerkt (`letztesBild`). Regel: `totalFrames` nach einem
  `playSegments` nie wieder als Gesamtlänge lesen. Und der Wechsel
  Burger ↔ X läuft 1,6-fach (375 statt 600 ms) — er soll vor der Blase
  fertig sein, die 520 ms wächst (Florian).
- **„Wir freuen uns auf Sie" deutlich größer**: `--text-banner` von
  `clamp(2rem, 1.1rem + 3.4vw, 4.2rem)` auf `clamp(2.8rem, 1.2rem +
  5vw, 6rem)` — bei 375 px 44,8 statt 32 px, bei 1440 px 91 statt 67 px.
  Der Kicker „Unser Team" rückt näher heran (8 statt 16 px).

### Blocksatz, linksbündig (26. September 2026)

Die Kundin ist ein großer Fan von linksbündigem Blocksatz (Florian).
Er gilt jetzt für die Lesetexte: Redaktionstexte (Leistungsseiten,
Beiträge, eigene Abschnitte, Stellen, Hinweis-Karte), die Einleitungen
der Abschnitte, die Erklärtexte der Leistungskategorien, die Einleitung
im Kontakt und die Rechtsseiten (`global.css`, „Blocksatz"). Immer mit
Silbentrennung (`hyphens: auto`, deutsch über `lang="de"`) — ohne sie
reißt Blocksatz die Zeilen auf; `hyphenate-limit-chars: 6 3 3`, damit
auch auf Handys mit rund 45 Zeichen je Zeile genug Trennstellen da sind.
Die letzte Zeile bleibt linksbündig. **Nicht** im Blocksatz:
Überschriften, Kicker, Knöpfe, Menüs, Listen, Tabellen,
Formularhinweise und alles Zentrierte (Begrüßung) — zu kurze oder zu
wenige Zeilen. Geprüft bei 375 und 1440 px auf der Prophylaxe-Seite.

**Nachgebessert am selben Tag:** Der Blocksatz endete vor dem rechten
Rand der Spalte, weil die allgemeine Lesebreite (`p { max-width:
68ch }`) den Absatz begrenzte — ein Block mit geradem Rand, der vor der
Spalte aufhört, sieht abgeschnitten aus (Florian). Im Blocksatz füllt
der Absatz jetzt seine Spalte (`max-width: none`); die Spalten selbst
begrenzen die Zeilenlänge: Leistungsseiten und Rechtsseiten 46 rem,
Erklärtexte 48 rem, Stellen ihre Textspalte, Beiträge 58 rem (die
weiteste — rund 95 Zeichen je Zeile; sollte das ermüden, ist dort eine
eigene Grenze zu setzen). Die schmalen **Einleitungen** (34 rem unter
breiter Überschrift) und die Kontakt-Einleitung stehen dafür wieder
linksbündig: als Block sähen sie abgeschnitten aus. Die
**Vorschautexte auf Leistungskacheln und Beitragskarten** stehen
ebenfalls im Blocksatz (Florian) — sie füllen ihre Karte.

### Die Sprechstunden kommen früher; der Team-Titel bleibt einzeilig (26. September 2026)

**Der Scrollweg der Einstiegskarte ist kürzer:** Desktop 480 → 420 vh,
Handys 620 → 360 vh (`ozWeg` in scrollwege.ts, `--oz-weg` in
Oeffnungszeiten.astro). Die Karte soll früher kommen, auf Handys viel
früher (Florian). Damit sie das noch stehende Logo nicht überfährt,
löst sich das Logo schneller auf: über 1,1 (Desktop) bzw. 0,9
Fensterhöhen (Handy) statt 1,5 (`LOGO_WEG` in Startbereich.astro).
Nachgerechnet mit den Kurven des Ablaufs (easeIn ab 30 %, Karte 1 761
bzw. 788 px hoch, Logo-Unterkante bei 580 bzw. 530 px):

| | Fahrt beginnt | Oberkante erreicht das Logo | Logo fort | Schnalz |
|---|---|---|---|---|
| Desktop 1440 × 900, vorher | 0,74 vh | 1,41 vh | 1,39 vh | 3,52 vh |
| Desktop, jetzt | 0,56 vh | 1,16 vh | 1,10 vh | 3,06 vh |
| Handy 375 × 812, vorher | 1,16 vh | 2,33 vh | 1,50 vh | 4,62 vh |
| Handy, jetzt | 0,38 vh | 1,13 vh | 0,90 vh | 2,59 vh |

Die Karte erreicht das Logo also erst, wenn es weg ist — auf dem
Desktop knapp (0,06 vh), auf dem Handy mit Luft. Wer eine der Zahlen
ändert, rechnet die Tabelle nach (die Rechnung: Kartenoberkante =
Fensterhöhe − Ruhelage − Kartenhöhe + Versatz(p), mit p = (Scrollweg +
Fensterhöhe) / ((ozWeg + 1) · Fensterhöhe)).

**„Wir freuen uns auf Sie" passt auf Handys immer in eine Zeile**
(Florian): Der Titel bekommt bis 767 px `white-space: nowrap` und wird
vom Skript (`titelEinpassen`) nur so weit verkleinert, dass er nicht
umbricht — gemessen, weil der Text in der Redaktion änderbar ist. Bei
375 px: 37,4 statt 44,8 px, eine Zeile. Läuft beim Aufbau, bei
Größenänderung und nach dem Laden der Schrift.

### Kleinigkeiten aus demselben Durchgang

- Knopfgruppen überall 12 px Abstand (Begrüßung und Abschnitte hatten
  14).
- Beitragstitel −0.012 em wie der Kacheltitel.
- Der Zipfel-Typ `Stuetzstelle` ist in Oeffnungszeiten.astro importiert
  (vorher nur stillschweigend vorhanden).
- Die Karte setzt sich bei **30 %** von Ablauf a-19 in Bewegung (der
  Eintrag vom 18. September nennt noch 35 % — der Wert wurde am selben
  Abend gesenkt, siehe „Die Begrüßung kommt früher").

### Sprechstunden wie früher, sanfteres Scrollen, ruhige Klappen (26. September 2026, spät)

Florians Durchsicht am Handy; sieben Punkte.

**Die Sprechstunden-Zeilen sind wieder die der alten Seite**
(`OeffnungszeitenListen.astro`). Die Haarlinien und der graue
Wochentag aus dem Handoff sind zurückgenommen — „der Schriftverlauf war
schöner". Jetzt: alles in der Hausfarbe, der Wochentag rechtsbündig im
leichten Schnitt (300) in einer Spalte, die so schmal ist wie ihr
längster Tag plus 15 px, daneben Vor- und Nachmittag im normalen
Schnitt als zwei Angaben nebeneinander (14 px Lücke; auf ganz schmalen
Fenstern rückt der Nachmittag darunter), Zeilen 2 px Luft, keine Linien.
„…und nach Vereinbarung" steht als letzte Zeile in der Zeitspalte, 8 px
tiefer. 16 px, auf Handys 15 — bei 375 px stehen Donnerstag und beide
Zeiten damit in einer Zeile (rund 280 von 305 px). Die Spaltentitel
bleiben, wie sie sind: gesperrte Versalien in der Hausfarbe (Florian:
„die Überschriften in Versalien sind gut"). Und „Wann Sie uns
antreffen" bricht auf Handys nicht mehr um: bis 48 rem
`white-space: nowrap` bei `min(1.5rem, 5.8vw)` — bei 375 px 21,8 px,
209 px breit neben dem 48-px-Kreuz.

**Das klebende Kreuz löst sich sichtbar wieder.** Bisher verschwand der
Zwilling in dem Moment, in dem er sich löste — der Kreis zeichnete sich
noch aus, aber ohne ihn. Jetzt laufen Grund und Kreis gemeinsam 500 ms
rückwärts (`background-color` am `.schliessen` 300 → 500 ms mit
`--verlauf-betont`, dieselbe Dauer wie `stroke-dashoffset`), und erst
danach wird der Zwilling unsichtbar (`visibility 0s linear 500ms`);
das Kreuz in der Zeile kommt mit derselben Verzögerung zurück. Beim
Kleben wechseln beide sofort (`transition-delay: 0s` unter
`data-kreuz="klebt"`).

**Eigenes sanftes Scrollen** (`sanftScrollen` in `scripts/anker.ts`).
`behavior: 'smooth'` ist kurz und auf iOS kaum zu sehen; die alte
Seite glitt langsamer und weicher. Die Dauer wächst mit dem Weg —
500 ms plus 0,35 ms je Bildpunkt, höchstens 1,8 s (ein Sprung über
2 000 px dauert also 1,2 s) — mit `inOutCubic` aus easing.ts. Wer
währenddessen wischt, scrollt, tippt oder eine Taste drückt, übernimmt:
Die Bewegung bricht ab. Bei reduzierter Bewegung ein Sprung. Benutzt
von allen Sprungmarken (`zuSprungmarke`), vom Kreuz der Einstiegskarte
und vom „Nach oben" im Fußbereich. Das kurze Nachrücken des Titels in
der Stellenliste bleibt beim Browser-Gleiten — es sind wenige Pixel.

**Der Logo-Blitzer beim Laden** (`Startbereich.astro`): lottie-web
zeichnet beim Laden zuerst Bild 0 — das fertige Logo mit dem grauen
Zahn — und meldet `DOMLoaded` erst einen Takt später (per
`setTimeout`); erst dann setzt das Skript das Startbild „leer".
Dazwischen kann der Browser malen. Jetzt bleibt die Zeichnung
unsichtbar, bis `data-lottie-bereit` steht — das Attribut und das
Startbild werden im selben Takt gesetzt (`lottie.ts`, dann das
`.then` in Startbereich.astro), also ohne Bild dazwischen.

**Klappen gehen direkt auf die neue Höhe** (Florian: „nicht erst
zurückanimieren und dann auf die neue Höhe").

- *Handy-Menü:* Die Blase folgt der Summe der Zeilenhöhen. Die
  Kategorien-Zeilen wuchsen bisher gestaffelt ab 140 ms, die anderen
  schrumpften ab 0 — die Summe sank erst und wuchs dann. Jetzt läuft
  die Rasterhöhe (`grid-template-rows`) in JEDER Zeile und JEDEM
  Zustand gleich: 320 ms, `--verlauf-betont`, ohne Verzögerung. Die
  Summe zweier gleich getakteter Bewegungen geht in einer Bewegung von
  der alten zur neuen Höhe — ohne Skript. Gestaffelt ist nur noch der
  Inhalt der Zellen (Deckkraft und `scaleY`, ab 80 ms je 50 ms später;
  vorher 140/60). Beim Zurück ebenso: Zeilen im Gleichtakt, der Inhalt
  der Kategorien blendet sofort aus.
- *Team:* Zwei Karten in derselben Reihe — die Reihe ist so hoch wie
  die höhere. Fiel die eine Klappe zu, während die andere aufging,
  sank die Reihe erst und wuchs dann wieder. Jetzt fährt die alte
  Klappe beim Wechsel nicht auf Null, sondern in derselben Zeit und
  Kurve auf die Höhe der neuen (`element.animate` auf `height`, 400 ms,
  Kurve aus dem Token `--verlauf-betont` gelesen); ihr Text blendet in
  200 ms aus (`data-schliesst`). Die Reihe läuft damit in einer
  Bewegung von der einen zur anderen Höhe. Am Ende, wenn die neue
  Klappe die Reihe trägt, fällt die alte ohne Übergang auf Null — nicht
  zu sehen. Ob beide in einer Reihe stehen, sagt `offsetTop` (wie bei
  den Reihenenden). In verschiedenen Reihen ist nichts zu tun: gleiche
  Dauer, gleiche Kurve, die Summe der Höhen geht von selbst in einer
  Bewegung. Ein Tipp mitten in die Bewegung löst sie sauber ab
  (`WeakMap` der laufenden Animationen).

**Kontakt auf Handys: mehr Karte um die Marke.** Die Lücke zwischen
den Knöpfen und dem Formular, in der die Marke steht, ist 220 statt
128 px hoch (`row-gap` unter `data-marke="unten"`); die Marke sitzt
weiter in ihrer Mitte — sie klebte am Formular.

**Ein Hörer statt der Nummer in der Handy-Kopfleiste.** Rechts steht
jetzt der Hörer aus dem Symbol der Telefon-Kategorie
(`icons/navigation/telefon.svg`, ohne den Kreis darum; 30 px in einer
44-px-Tippfläche, als Inline-SVG in `currentColor`). Ein Tipp holt
daneben die Nummer als `tel:`-Verweis hervor: Sie liegt mit Breite 0
hinter dem Hörer und bekommt ihre gemessene Breite (`--nummer-breite`,
bei 375 px 69 px) in 400 ms — und weil die Gruppe am rechten Rand
hängt, rückt der Hörer dabei nach links. Ein zweiter Tipp nimmt sie
weg, ein Tipp auf den Menüknopf auch. Florian schrieb „darunter";
umgesetzt ist „daneben" — die Nummer erscheint dort, wo der Hörer
war. Wenn sie wirklich UNTER dem Hörer stehen soll: eine Rückfrage
wert, die Kopfleiste ist 80 px hoch, Platz wäre da.

### Die Kachel morpht von dort, wo sie steht (26. September 2026, spät)

Die Leistungskacheln sprangen beim Anklicken einen Pixel und morphten
nicht aus ihrer Zeige-Lage (Florian). Ursache in
`LeistungKachel.astro`: Die Regel für die morphende Kachel
(`[data-morph]`, gesetzt vor der Momentaufnahme) setzte `transform:
none` und weißen Grund — die gezeigte Kachel rutschte also erst die
3 px Anhebung herunter, wuchs von ihrer Scroll-Skalierung (0,9 … 1,
Ablauf a-8) auf 1 und wurde weiß, und erst dann begann der Morph. Bei
den Beitragskarten war genau das am 18. September schon
zurückgenommen worden („Beim Klick bleibt alles stehen, wie es
steht"); die Kachel hatte die Regel behalten.

Jetzt bleibt auch die Kachel, wie sie steht: keine Rücksetzung von
Anhebung, Skalierung, Symbolgröße oder Grund. Der Browser nimmt den
`transform` des Elements in die Ausgangslage der Hülle auf, der Morph
beginnt bei der angehobenen, gerade so skalierten Kachel mit ihrem
vergrößerten Symbol. Ein grauer Grund (Kachel am Rand des Scrollwegs)
blendet im Kreuzen der Abbilder nach Weiß, statt vorher zu springen.
Auf dem Rückweg steht die Zielkachel mittig — dort ist die Skalierung
ohnehin 1.

## Florians Durchgang am Handy (27. September 2026)

Elf Punkte, alle umgesetzt.

**Der Rückweg landet wieder in der Mitte** (`scripts/uebergaenge.ts`,
`Oeffnungszeiten.astro`). Auf Handys endete der Morph von einer
Leistung zurück außerhalb des Fensters. Der Grund war die Reihenfolge:
`uebergaenge.ts` stellte die Zielkachel in `astro:after-swap` mittig —
danach sortierte `Oeffnungszeiten.astro` (in `astro:page-load`)
Begrüßung und Band aus der Karte hinter sie in den Inhalt, und die
Kachel rückte um deren Höhe nach unten. Jetzt läuft das Umsortieren
schon in `after-swap`, und das Zentrieren ist eine Mikroaufgabe: Sie
läuft nach ALLEN `after-swap`-Zuhörern, aber noch vor der neuen
Momentaufnahme (Astro nimmt sie erst nach dem Tausch-Rückruf auf).
In `page-load` wird bei mehr als 4 px Versatz einmal nachgestellt.

**Das Band nahm nach einem Seitenwechsel nicht mehr die volle Breite
ein.** `--fensterbreite` steht als Stil an `<html>` — und Astro tauscht
beim Wechsel die Attribute von `<html>` gegen die des neuen Dokuments.
Der Wert war fort, das Band fiel auf die Kartenbreite zurück. Jetzt
setzt `fensterbreiteMerken()` ihn bei jedem Aufbau neu; nur der
`resize`-Zuhörer wird einmal angemeldet. (`--oz-ruhe` steht ebenfalls
an `<html>`, wird aber ohnehin bei jedem Aufbau neu gemessen.)

**Einblenden wie bei Apple** (`global.css`): Was mit `data-rein` ins
Bild kommt, fährt jetzt aus 32 px Tiefe und 96 % Größe in 1,1 s heran
(vorher 18 px, 0,8 s, ohne Größe).

**Der Anflug der Karte kommt von weit draußen — und zeigt nie eine
Kante** (`Kontakt.astro`): Die Zeichnung beginnt in ihrer DECKENDEN
Größe und zoomt um die Marke auf das Anderthalbfache heran
(`ZOOM_ENDE = 1,5`; vorher fuhr sie von 125 % auf 100 % herunter, also
von zu nah). Ein erster Versuch am selben Tag ließ sie auf 62 %
beginnen und auf 100 % wachsen — dann war sie anfangs kleiner als der
Bereich, und man sah ihre Kanten (Florian: „das sieht nicht gut aus").
Deshalb jetzt umgekehrt: Das Maß deckt den Bereich schon bei Zoom 1,
der Bezugspunkt liegt darin, und beim Vergrößern bleibt alles gedeckt.
Die Folge: Das Ende steht näher als vorher. Nebeneinander ist es das
1,5-fache der bisherigen Nähe. Gestapelt (Handys) ist das Startmaß auf
0,5 gesenkt (`MASS_SCHMAL`, vorher 0,73), sodass das Ende bei etwa 0,75
steht — der bisherigen Nähe („den Ort sehen, nicht den Häuserblock");
und die senkrechte Reichweite unter der Marke wird durch 1,5 geteilt,
weil das Formular erst ins Bild kommt, wenn der Anflug zu Ende ist
und die Zeichnung entsprechend weiter nach unten reicht. Die Ellipsen-
Maske gibt es weiter nur gestapelt; ihr voller Teil reicht jetzt bis
75 % der Achsen statt 50 — beim schmaleren Startmaß läge die linke
Kante des Bereichs sonst im Verlauf (bei 375 px: 270 px von der Mitte,
der Verlauf begänne bei 185, jetzt bei 278), und am unteren Rand, wo
das Formular steht, bleibt die Zeichnung am Ende fast satt statt halb.
Nachgerechnet bei 375 × 812: Startmaß 0,685 (die waagerechte Deckung
gibt den Ausschlag), Zeichnung 740 × 1127 px, oben bleiben 302 px des
Bereichs ohne Zeichnung — unter dem weißen Schleier, der dort auf 97 %
steht, und mit dem Verlauf der Maske als weicher Oberkante.

Der Weg ist länger (Spitze der Marke von der Unterkante bis 15 %
unter der Oberkante statt bis 45 %), die Kurve ein sanftes An- und
Auslaufen (smoothstep), der Nachlauf träger (`nachziehen` mit Rest
0,86 statt 0,7 — dafür hat die Funktion jetzt einen Parameter). Die
Marke fällt bei 60 %.

**Alle Bilder wachsen über den Scrollweg** (`scripts/bildlauf.ts`, neu):
Die Schleife aus Neuigkeiten.astro ist jetzt ein gemeinsames Skript
für alles mit `data-bildlauf` — Beitragsbilder und die Bilder der
eigenen Abschnitte (`.block__lauf`, mit `overflow: hidden` am Rahmen
wie gehabt). Der Zuwachs `A3_ZUWACHS` ist 0,15 statt 0,1 („alle
Animationen etwas verstärken"). Das Gruppenfoto im Team hat seine
eigene Schleife behalten.

**Der Scroll-Hinweis unter dem Logo** (`Startbereich.astro`,
`global.css`) steht 100 px höher — über `top: -100px`, nicht über einen
Abstand, der die Mitte und damit das Logo verschöbe — und kommt beim
ersten Aufbau von unten (48 px über `top`, 700 ms ab 100 ms) statt nur
über die Farbe einzublenden (600 ms ab 100 ms; vorher 800 ab 240).
`top` ist eine Layout-Eigenschaft, kein `transform`: Compositor-
Bewegungen um das Logo herum zeichneten den Saum (siehe „Erster
Seitenaufbau"). Am Gerät gegenprüfen.

**Das Handy-Menü macht die Seite wirklich unscharf** (`global.css`,
`Navigation.astro`): Statt eines Schleiers mit Weichzeichner davor
bekommen Inhalt, Startbereich, Bühne der Einstiegskarte und Fußbereich
selbst `filter: blur` und `scale(0.96)` (420 ms), sobald das Menü
offen ist (`html[data-menue-unscharf]`). Der Bezugspunkt ist die
Fenstermitte, je Element als `--zurueck-mitte` gesetzt — sonst
schrumpfte der lange Inhalt um seine eigene, weit entfernte Mitte.
Die Bühne statt `.ozbereich`, weil ein `transform` dort dem festen
Kreuz-Zwilling den Halt nähme. Der weiße Schleier bleibt, sein
`backdrop-filter` ist weg. Am Gerät prüfen: den Aufwand des
Weichzeichners auf dem langen Inhalt und den Saum um das Logo, wenn das
Menü ganz oben geöffnet wird.

**Die Menüzeilen schrumpfen in Höhe UND Breite**: `scale(0)` aus der
linken oberen Ecke statt `scaleY(0)` von oben.

**Randverläufe** (`layouts/Basis.astro`, `global.css`): Oben und unten
liegt je ein 110 px hoher Verlauf von Weiß nach durchsichtig an der
Fensterkante, fest, ohne Zeigerwirkung, unter den Leisten (z-index
98 gegenüber 100) und über allem anderen. Die Leisten sind dafür auf
74 % Weiß (vorher 80). Beim Druck sind die Verläufe aus.

**Die Symbole der unteren Leiste** wachsen beim Zeigen um ihre Mitte
(`scale(1.1)`, vorher 4 px angehoben plus 1,06), und die Beschriftung
rückt 3 px nach unten — Farbe und Deckkraft behält sie (vorher
blendete sie auf 65 %; Florian, 27. September 2026).

**Die Leistungskachel morpht aus ihrer Zeige-Lage** — siehe den Eintrag
davor (noch vom 26. September).

### Scroll-Hinweis im eigenen Rahmen, Logo folgt dem Scrollen sofort, Hörer als erste Menüzeile (27. September 2026, mittags)

**Der Scroll-Hinweis war verschwunden.** Die 100 px nach oben (siehe
oben) schoben ihn unter die weiße Fläche der Lottie-Grafik — die
liegt über ihm, und ihre Zeichnung füllt ihren Kasten nicht aus
(Seitenverhältnis 868 : 590 in einem 5 : 4-Kasten, dazu Luft unter den
Buchstaben). Ganz gehen die 100 px deshalb nicht. Jetzt rückt der
Hinweis so weit hinauf, dass er rund 28 px unter den Buchstaben steht:
`top: calc(28px − 17 % der Kastenhöhe)` — bei 900 px Fensterhöhe 33 px,
bei 1120 px 48 px, auf Handys (375 px) 10 px.

**Er blendet jetzt wie die Leisten auf und wird scharf** (Florian) —
und dafür steht er in einem EIGENEN festen Rahmen NEBEN dem
Startbereich (`.starthinweis`), nicht mehr darin: Deckkraft- und
Weichzeichner-Animationen im Startbereich zeichneten den Saum um den
Verlauf des Logos (Eintrag „Erster Seitenaufbau ohne Blitzer"). Der
Rahmen baut denselben Satz nach: dieselbe Mitte, ein Platzhalter in
Höhe und Wachstum des Logos (`--logo-groesse` bekommt er vom Skript
mit), darunter der Hinweis; umgekehrt steht in der Logo-Spalte ein
Platzhalter in der Höhe des Hinweises (gemessen, `--hinweis-hoehe`),
sonst rutschte das Logo um die halbe Hinweishöhe nach unten. Die Maße
des Logos (`--logo-breite`, `--logo-hoehe`, …) stehen dafür an den
beiden Mitten statt am Logo. Beide Rahmen verstecken sich gemeinsam,
wenn das Logo aufgelöst ist. Am Gerät gegenprüfen, ob der Saum
wirklich ausbleibt.

**Das Logo folgt dem Scrollen sofort.** Wer scrollte, bevor das Logo
fertig gezeichnet war, sah es erst zu Ende zeichnen und dann auf den
Scrollstand springen. Jetzt bricht die Einzeichnung beim ersten
Scrollen ab, und die Kopplung an den Scrollweg übernimmt von dem Bild,
das gerade steht, und vom Scrollstand dieses Moments: Von dort bis
zum Ende des Wegs löst sich das Logo auf (`anScrollKoppeln` in
`scripts/lottie.ts` mit dem neuen Parameter `ab`). Der Rest der Seite
wird dabei sofort freigegeben.

**Der Hörer in der Handy-Kopfleiste hat drei Plätze** (Florians
Skizze): zu rechts neben dem Punkt vor dem Menüknopf; allein geöffnet
mit der Nummer daneben genau in der Mitte zwischen Logo und Menüknopf
(gleicher Abstand zu beiden, der Punkt tritt zurück); bei offenem
Menü öffnet er sich mit und rückt als dessen erste Zeile an die
Symbolspalte — sein Symbol bündig mit den Symbolen der Zeilen darunter,
ein Tipp darauf ruft dann an. Er ist das Telefon-Symbol der Navigation
mit Kreis (40 px, wie die Menüsymbole), die Nummer in der Schrift der
Menüpunkte (17 px). Technisch steht er absolut in der Zeile, das Skript
misst je Zustand die `left`-Lage (`telefonStellen`), das CSS fährt
dorthin (420 ms). Die Menüzeilen haben jetzt über JEDER Zeile eine
Haarlinie — auch über der ersten, unter dem Hörer — und keine unter der
letzten; die Kategorien zeigen ihre Linien nur auf ihrer Ebene, die
Hauptzeilen nur auf der Hauptebene. So gibt es auch die Linie unter
„Leistungen", die vorher fehlte.

### Der Saum, zum dritten (27. September 2026, nachmittags)

Mit dem Weichzeichner auf der ganzen Seite beim offenen Handy-Menü war
der Saum um das Logo wieder da (Florians Screenshot: die weiße Fläche
der Lottie-Grafik mit einem weichen Aubergine-Rand). Die Regel steht
seit dem Vormittag in Startbereich.astro: Am Logo darf nichts
weichgezeichnet, skaliert oder in der Deckkraft bewegt werden. Deshalb
ist der Startbereich jetzt von `html[data-menue-unscharf]`
ausgenommen — kein `filter`, kein `transform`, kein Übergang mehr an
ihm. Damit das Logo hinter dem offenen Menü trotzdem unscharf steht,
hat der Schleier seinen Rückseiten-Weichzeichner zurück (so war es bis
zum Vormittag, ohne Saum). Der Inhalt darunter wird damit doppelt
weichgezeichnet (eigener Filter plus Schleier) — das ist nicht zu
sehen und kostet nur hinter dem offenen Menü.

Dazu zwei Kleinigkeiten am Menü: Der Menüknopf schließt nach dem
logischen Zustand (`menueGewollt`), nicht nach `data-menue-offen` —
das Attribut kommt erst ein Bild später, und ein zweiter Tipp innerhalb
dieses Bilds öffnete noch einmal, statt zu schließen; in dem Fall blieb
auch die Unschärfe stehen.

**Zurückscrollen zeichnet das Logo fertig.** Übernimmt die Kopplung an
den Scrollweg mitten in der Einzeichnung (Eintrag darüber), läuft das
Bild jetzt in beide Richtungen: nach unten vom übernommenen Bild bis
zur Auflösung, nach oben vom übernommenen Bild bis zum fertigen Logo
am Seitenanfang (`anScrollKoppeln`, Zweig `p < ab.p`). Vorher blieb es
oben beim halbfertigen Bild stehen.

### Der Saum — Ursache gefunden, ein für alle Mal (27. September 2026, nachmittags)

Der Saum um das Logo war nach dem letzten Umbau immer noch da
(Florian). Diesmal nicht geraten, sondern gemessen — mit Playwright in
Chromium und WebKit (440 × 956, 2×), Bildschirmfotos der Logo-Region
im Ruhezustand und mitten in der Auflösung, Verdächtige einzeln
abgeschaltet:

| Variante | Saum |
|---|---|
| Grundzustand, Chromium, gescrollt | da |
| Grundzustand, Chromium, NICHT gescrollt | da |
| Grundzustand, WebKit | weg |
| Hinweis-Rahmen ausgeblendet | da |
| Randverläufe ausgeblendet | da |
| Wachstum des Logos eingefroren | da |
| alle Animationen und Übergänge aus | da |
| Leisten ohne Rückseiten-Weichzeichner | da |
| Verlauf ausgeblendet | weg |
| Verlauf auf 40 % verkleinert | schrumpft mit |
| `contain: paint` am Verlauf | da |
| `clip-path: inset(0)` am Verlauf | **weg** |

**Die Ursache:** Der Verlauf ist ein 20 × 10 px großes GIF, das rund
25-fach vergrößert wird. Chromium zeichnet ein so stark vergrößertes
Bild mit einem Resampling-Filter, dessen Kern über den Kasten
hinausreicht — etwa eine halbe GIF-Pixelbreite, 12 bis 16 px auf dem
Bildschirm. Der Verlauf ragt damit über seinen Kasten hinaus; die
weiße Lottie-Fläche ist nur wenige Pixel größer als der Kasten, also
steht rundherum ein weicher Aubergine-Rand. WebKit schneidet am
Kasten ab. Ob Chromium diesen Filterweg nimmt, hängt davon ab, wie die
Ebene gerade gerastert wird — deshalb kam der Saum seit September mit
wechselnden Auslösern (transform, will-change, Deckkraft- und
Weichzeichner-Animationen im Startbereich) und ging mit wechselnden
Umwegen (Wachsen über Maße, Farb- statt Deckkraft-Animation).
Ebenen-Liste aus Chromium: Der Startbereich ist eine eigene Ebene
(Grund „Overlap"), die Lottie-SVG eine zweite darüber; der Verlauf
selbst hat keine.

**Die Abhilfe:** `clip-path: inset(0)` am Verlauf (`.logo__verlauf`,
Startbereich.astro). Was über den Kasten hinaus gezeichnet würde, wird
abgeschnitten — egal welchen Weg der Browser nimmt. Die alte Regel
„Im Startbereich nichts über opacity, filter oder transform animieren"
ist damit keine Notwendigkeit mehr, nur noch Vorsicht; das Wachsen über
Breite und Höhe bleibt, es schadet nicht.

**Zurückscrollen und Übergabe** (Florian: „als wäre die Animation ganz
abgespielt worden"): Scrollt der Besucher, bevor das Logo fertig
gezeichnet ist, gleitet es in 250 ms von dem Bild, das gerade steht,
auf das Bild, das der Scrollweg verlangt, und hängt dann ganz normal am
Scrollweg — oben das fertige Logo, beim Scrollen die normale Auflösung.
Die Zwischenlösung vom Mittag (Kopplung ab dem halbfertigen Bild) ist
zurückgenommen, `anScrollKoppeln` hat den Parameter `ab` wieder
verloren.

**Typografie auf Handys** (Florian): Überschriften ohne
`text-wrap: balance` — es verteilte die Wörter auf gleich lange Zeilen,
und die erste nutzte die Breite nicht („Digitale Abformung / statt
Abformlöffel"). Jede Zeile wird jetzt so voll wie möglich; nur die
mittige Begrüßung bleibt ausgeglichen. Bis 767 px dürfen h2 und h3
sehr lange Wörter trennen (ab 14 Buchstaben, sechs auf jeder Seite) —
„Kieferorthopädie" allein sprengte sonst die Zeile. Der Blocksatz bleibt
auch auf Handys — ausdrücklich gewünscht (Florian, gleich darauf; ein
Zwischenstand hatte ihn dort linksbündig gesetzt). Der Zeilenabstand
ist auf Handys 1,55 statt 1,68.

**Die Löcher im Blocksatz kamen von fehlender Silbentrennung — und die
setzt jetzt der Build.** Gemessen mit Playwright: Chromium trennt
„Rönt-gen", WebKit lässt „Röntgen" und „dreidimensionalen" ganz
stehen, obwohl es in einem Minimaltest beide trennt; Florians Browser
trennte „dreidimensionalen" ebenfalls nicht. Die Trennung des Browsers
(`hyphens: auto`) hängt am Wörterbuch des Geräts (Chrome lädt es erst
nach, WebKit kennt manche Wörter nicht) — und jedes ungetrennte lange
Wort reißt die Zeile davor auf. Deshalb bekommen alle Lesetexte beim
Erzeugen der Seite weiche Trennstriche (U+00AD) nach den deutschen
Trennmustern der Bibliothek `hyphen` (`src/lib/silben.ts`,
`trennenHtml()` für Redaktions-HTML, `trennen()` für Kurztexte,
`trennenTitel()` für Überschriften — dort nur Wörter ab 14 Buchstaben).
Ein weicher Trennstrich ist unsichtbar, bis der Browser dort umbricht.
Angewendet auf: Erklärtexte der Leistungskategorien, Leistungs- und
Beitragsseiten, Kachel- und Beitragskurztexte, eigene Abschnitte,
Stellen, Hinweis; Titel der Abschnitte, Kacheln und Leistungsseiten.
Die Rechtsseiten (fester Text) bleiben bei der Browser-Trennung.
`hyphens: auto` bleibt als Ergänzung; bis 767 px mit großzügigeren
Grenzen (5 Buchstaben, 2 je Seite).

### Die Begrüßung nach Florians Entwurf; die Karte ist nur noch die Sprechstunden (27. September 2026, nachmittags)

**Reihenfolge auf allen Größen:** Logo → Sprechstunden-Karte → Begrüßung
→ Bilderband. Die Karte enthält nur noch die Sprechstunden (Florian:
„die Öffnungszeiten wieder über das Willkommen"); Begrüßung und Band
stehen im Markup am Anfang von `main` (`index.astro`), nichts wird mehr
per Skript umsortiert (`vorspannAnordnen` ist weg, ebenso die
`data-nach-karte`-Zustände). Das Kreuz der Karte gleitet auf allen
Größen zur Begrüßung. Die Bewegungsrechnung der Karte bleibt; die
Karte ist jetzt auch auf breiten Fenstern etwa 800 statt 1 760 px hoch
und erreicht das Logo entsprechend später — die Tabelle vom 26. gilt
als sichere Obergrenze.

**Die Begrüßung** (`Willkommen.astro`) nach Florians Entwurf: auf
breiten Fenstern zwei Spalten, linksbündig in der Inhaltsbreite. Links
die Überschrift in zwei Zeilen — „Willkommen in unserer" in
`--text-titel`, der Größe der übrigen Überschriften, darunter „Praxis
Dres. Nold" in `--text-willkommen`. Rechts, hinter einer Haarlinie, der
kurze Text und darunter die beiden Knöpfe. Die rechte Spalte ist genau
so breit wie die beiden Knöpfe nebeneinander (`width: max-content`; der
Text zählt mit `width: 0; min-width: 100 %` nicht mit und bricht in
dieser Breite um) und genau so hoch wie die Überschrift (`align-items:
stretch`, Text oben, Knöpfe unten per `space-between`). Auf Handys
(bis 767 px) alles untereinander: Beide Zeilen der Überschrift füllen
genau die Bildschirmbreite — das Skript misst jede Zeile bei 100 px und
verkleinert sie passend, die längere wird dabei von selbst die
kleinere —, darunter der Text, darunter die Knöpfe nebeneinander mit
den kurzen Beschriftungen „Termin" und „Leistungen" (die langen
bleiben für Vorleser im Markup, die kurzen sind `aria-hidden`).

**Der Begrüßungstext ist gekürzt** auf „Zahnmedizin und
Kieferorthopädie unter einem Dach." — Florian wollte den kürzeren Text
aus dem Entwurf; der zweite Satz („Wir nehmen uns Zeit für Sie, …") ist
aus `startseite.json` heraus. Das ist eine Inhaltsänderung; die Praxis
kann ihn in der Redaktion jederzeit wieder ergänzen.

### Stellenliste auf Handys: Anriss, Bezeichnung, Ansprechperson (27. September 2026, nachmittags)

- **Der Anriss** unter der zugeklappten Bezeichnung ist auf höchstens
  drei Zeilen begrenzt und sauber abgeschnitten (`-webkit-line-clamp`
  setzt die Punkte); vorher kappte `max-height: 4em` mitten in der
  dritten Zeile. Er steht im Blocksatz mit Trennstellen aus dem Build
  (`trennen()`), wie die Lesetexte.
- **Die Bezeichnung bricht zu genau so um wie offen.** Auf Handys
  wächst sie beim Aufklappen; bisher entstanden dabei neue Umbrüche.
  Jetzt ist die offene Größe die Bezugsgröße (`--titel-gross`), die
  geschlossene ihr 1,165-tel — und zu darf die Bezeichnung nur
  1/1,165 der Breite einnehmen (`max-width` am neuen `.stelle__titeltext`).
  Breite und Schriftgrad wachsen im selben Verhältnis mit derselben
  Kurve und Dauer; das Verhältnis Breite : Schrift bleibt in jedem
  Moment gleich, und mit ihm die Umbrüche. Keine Trennstellen in der
  Bezeichnung — „Fachan-gestellte" sähe in einer Stellenbezeichnung
  nach nichts aus; sie bricht zwischen den Wörtern.
- **Die klebende Ansprechperson bewegt sich nicht mehr** (vorher fuhr
  sie 28 px von unten herauf und beim Zuklappen zurück): Sie steht,
  sobald die Klappe offen ist, und geht mit ihr. Und sie lag unter dem
  unteren Randverlauf und verblasste — der Inhalt hat seine eigene
  Ebene (`.seiteninhalt`, z-index 5) unter den Verläufen (98), darüber
  legen lässt sie sich nicht, ohne die Ebenen der ganzen Seite
  umzubauen. Deshalb tritt der untere Verlauf auf Handys zurück,
  solange eine Stelle offen ist: Stellen.astro beobachtet die Klappen
  und setzt `data-stelle-offen` an <html>, global.css blendet den
  Verlauf damit aus (300 ms).

### iPhone: Text bläht sich auf, Akkordeon springt (27. September 2026, abends)

Auf Florians iPhone wurden die Texte einer geöffneten Stellenanzeige
sehr groß, und die Liste sprang nach dem Öffnen. Im WebKit von
Playwright (iPhone-Profil) ließ sich beides nicht nachstellen — die
Schriftgrößen blieben, wie das CSS sie setzt. Zwei Dinge, die nur ein
echtes iOS zeigt:

- **`-webkit-text-size-adjust: 100 %`** steht jetzt an `<html>`. iOS
  Safari vergrößert Text sonst von sich aus („text autosizing"), unter
  anderem in Blöcken mit begrenzter Höhe und nach dem Drehen; die
  Zeile fehlte hier bisher.
- **Das Nachrücken des Titels** unter die Kopfleiste beim Öffnen läuft
  über das sanfte Scrollen der Seite (`sanftScrollen`, scripts/anker.ts)
  statt über `scrollTo({ behavior: 'smooth' })` — das Gleiten des
  Browsers begann auf iOS, während die Klappe noch aufging, und wirkte
  als Sprung.

Falls es danach noch springt: Bildschirmfoto mit iOS-Version, dann
lässt es sich eingrenzen.

**Nachtrag, Ansprechperson:** Sie kam „aus dem Nichts" — weil die
Klappe während des Öffnens mit `overflow: hidden` abschnitt, und ein
solcher Kasten ist der Bezug für `position: sticky`: Die Leiste klebte
an der Zelle statt am Fenster, stand beim Aufklappen unsichtbar am Ende
des Inhalts und sprang erst mit dem fertigen Öffnen ans Fenster. Jetzt
schneidet die Zelle mit `overflow: clip` ab (kein Rollbereich), das
Fenster bleibt der Bezug: Die Leiste wird beim Wachsen der Klappe
freigelegt und klebt sofort unten — ohne eigene Blende, sie ist auf
Handys immer voll sichtbar (`opacity: 1` in allen Zuständen).

### Stellenliste, dritter Durchgang: Ebenen, Tempo, Breite (27. September 2026, abends)

- **Die Ansprechperson liegt jetzt wirklich über dem unteren
  Randverlauf** — ohne Ein- und Ausblenden (Florian: „wenn du es
  hinbekommst"). Dafür sind zwei Stapelkontexte weg: `.seiteninhalt`
  hatte `z-index: 5`, `.stellen` `z-index: 40`; beide deckelten alles
  darin unter den Verläufen (98). Die Leiste steht mit
  `--ebene-navigation − 2` (98), die Verläufe rücken auf −3 (97), der
  Schleier des Handy-Menüs bleibt bei −1 (99), die Leisten bei 100.
  Die Reihenfolge des Inhalts zum Startbereich (10) ändert sich nicht:
  positioniert ohne z-index liegt der Inhalt weiter unter ihm, wie mit
  5. Die Abschnitte mit `z-index: 40` (Team, Neuigkeiten, Kontakt)
  stehen nun im Wurzelstapel — sie liegen nie mit dem Startbereich im
  Bild. Der Mechanismus vom Nachmittag (`data-stelle-offen`, Verlauf
  ausblenden) ist wieder ausgebaut.
- **Die Klappe bleibt auch offen beschnitten** (`overflow: clip`, mit
  8 px Luft für Fokusringe). Auf Florians iPhone rollte die Seite bei
  offener Stelle waagerecht; im WebKit von Playwright ragte nichts
  über den Rand — der Verdacht ist das `overflow: visible`, auf das die
  Zelle offen bisher umschaltete. Seit `clip` das Kleben nicht mehr
  stört, ist es nicht mehr nötig.
- **Gemächlicher:** Die Klappe läuft 0,7 s statt 0,5 (`KLAPPEN` im
  Skript ebenso), Bezeichnung, Anriss und Innenabstände 0,6 s statt
  0,45, Text und Ansprechperson blenden 0,7 s.

### Handy-Kopfleiste und Menü, Feinschliff (27. September 2026, abends)

- **Das offene Menü ist ausgerichtet wie in Florians Bildschirmfoto:**
  Der Hörer steht mit der Nummer mittig zwischen Logo und Kreuz —
  gleicher Abstand zu beiden, derselbe Platz wie allein geöffnet —, und
  die Symbolspalte des Menüs beginnt genau unter seinem Symbol. Das
  Skript misst den Platz (`telefonStellen`) und gibt ihn dem Menü als
  `--menue-spalte` (linker Innenabstand); die Wand der Blase bleibt an
  der Logokante plus 12 px. Vorher war es umgekehrt: Der Hörer rückte
  an die Spalte des Menüs.
- **Die Kopfleiste ist auf Handys 72 px hoch, das Logo 68 px** (vorher
  80 / 80). Die Skripte rechnen weiter mit 80 px Kopfleiste plus Luft
  (`anker.ts`, `kreuzKleben`, Stellenliste) — 8 px mehr Abstand, das
  fällt nicht auf und hält die Werte an einer Stelle.
- **Der obere Randverlauf ist so hoch wie die Kopfleiste** (80 px,
  Handys 72) statt 110 px — er endet hinter der Leiste. Der untere
  bleibt bei 110.
- **Die Zeilen des Handy-Menüs skalieren vom linken Rand, senkrecht
  mittig** (`transform-origin: 0 50%`; vorher die linke obere Ecke).

### Randverläufe im Seitenwechsel; Stellen-Breite abgesichert (27. September 2026, abends)

- **Die Randverläufe stehen während des Morphs still**, über der
  wachsenden Karte: Sie haben eigene Übergangsnamen (`rand-oben`,
  `rand-unten`) und wie die Leisten `animation: none` auf Gruppe,
  altem und neuem Abbild, Ebene 95 (Karte 90, Kopfleiste 100). Vorher
  blendeten sie als Teil der Seitenaufnahme aus und erst nach dem
  Morph wieder ein (Florian).
- **Stellenliste, Breite:** Auf Florians iPhone laufen die Texte einer
  offenen Stelle in einer Zeile nach rechts hinaus und die Seite rollt
  waagerecht. Im WebKit von Playwright (iPhone-Profil) lässt sich das
  nicht nachstellen — die Zelle ist 351 px breit, der Text bricht in
  sechs Zeilen, nichts ragt über 390 px hinaus, auch nicht auf der
  ganzen Seite. Deshalb vorsorglich: `contain: inline-size` und
  `min-width: 0` an der Zelle (ihre Breite hängt nie am Inhalt),
  `overflow-x: clip` am Abschnitt und an `<body>` (nichts kann die
  Seite waagerecht rollen lassen). Bleibt es auf dem iPhone, braucht es
  ein Bildschirmfoto des offenen Zustands mit der iOS-Version.

### Stellenliste: Bezeichnung wächst ohne Ruckeln, die Zeile gleitet geführt nach oben; Team-Kicker links (27. September 2026, abends)

- **Die Bezeichnung wächst über `transform: scale`, nicht mehr über
  den Schriftgrad.** Ein wachsender Schriftgrad ist eine
  Layout-Animation: Bei jedem Bild setzt der Browser die ganze Liste
  neu, samt Blocksatz und Trennung des offenen Texts — auf dem Handy
  ruckelte das (Florian). Jetzt steht die Bezeichnung im Layout immer
  in der offenen Größe und ist zu nur optisch auf 1/1,165 verkleinert
  (aus der linken oberen Ecke, 0,6 s). Die Umbrüche sind zu und offen
  damit von selbst dieselben; die `max-width`-Rechnung vom Nachmittag
  ist wieder weg. Zu bleibt unter der verkleinerten Schrift etwas Luft
  (die Höhe des größeren Kastens). Kreis und Nummer richten sich
  weiter über `--titel-zeile` auf die erste Zeile aus.
- **Die geöffnete Stelle gleitet geführt unter die Kopfleiste** —
  immer, nicht nur, wenn sie sonst darüber läge (Florian: „perfekt
  getimt an den oberen Rand"). Nicht mehr vorausberechnet und dann
  gescrollt (das lief gegen die einklappende Stelle darüber an: hoch
  und wieder herunter), sondern Bild für Bild: Die Zeile bekommt in
  jedem Bild die Fensterposition, die sie auf ihrem Weg von jetzt zur
  Kopfleiste (96 px) gerade haben soll, die Seite wird entsprechend
  gestellt (`titelFuehren`). Dauer und Kurve sind die der Klappen
  (0,7 s; 0,9 s, wenn darüber eine schließt) — die Zeile kommt oben
  an, wenn die Bewegung vorbei ist. Wer selbst scrollt, übernimmt.
- **Team:** Kicker „Unser Team" und Titel stehen auf Handys links wie
  in allen Abschnitten; die Karten bleiben mittig.

### Verläufe im Wechsel nur einmal; kein Hover auf Touch (27. September 2026, abends)

- **Die Randverläufe standen im Seitenwechsel doppelt** — altes und
  neues Abbild übereinander, beide stehend, also ein doppelt starker
  Verlauf, der am Ende auf einen zurückfiel: das Flackern unten
  (Florian). Jetzt bleibt das alte Abbild aus (`display: none`), nur
  das neue steht; ohne Gegenstück steht das alte allein.
- **Zeige-Zustände von Kacheln und Beitragskarten gelten nur noch mit
  Zeiger** (`@media (hover: hover)`). Auf dem Handy löst der Tipp Hover
  und Klick zugleich aus: Die Karte begann ihre Anhebung, das Bild sein
  Wachsen, und der Wechsel schaltete im selben Moment die Überblendung
  ab — ein Sprung vor dem Morph; nach dem Rückweg hing der Hover noch
  am Ziel und löste sich später — ein Sprung danach. Auf dem Desktop
  war der Hover beim Klick längst durch, dort lief es glatt. Der
  Tastaturfokus behält seine Zustände.
- Beim Umbau der Stellenliste (Eintrag darüber) war kurzzeitig die
  Funktion `setzen` mit entfernt worden — die Liste stand ohne Skript.
  Wieder da; das Skript ist gegen den Stand im Repo abgeglichen.

### Das weiße Bild um den Beitrags-Morph (27. September 2026, abends)

Florian: Auf dem iPhone wird das Bild der Beitragskarte für genau ein
Bild weiß — direkt bevor der Morph beginnt und nachdem er ganz fertig
ist. Das ist kein Geometriefehler (die Maße stimmen in Chromium und
WebKit in jedem Bild), sondern Safaris Dekodieren: Beim Umschalten
zwischen echtem Element und Abbild legt es die Ebene des Bildes neu
an und dekodiert das `<img>` asynchron — für ein Bild ist die Fläche
weiß. Nach dem Rückweg kommt dazu, dass die Karte ein neues Element
mit `loading="lazy"` ist. Deshalb:

- `decoding="sync"` an beiden Bildern (Karte und Beitragsseite; die
  Beitragsseite außerdem `fetchpriority="high"`).
- Vor dem Wechsel dekodiert `uebergaenge.ts` das Bild der Karte
  (`img.decode()`) und lässt den Wechsel darauf warten (`loader` in
  `astro:before-preparation`; bei einem längst gezeigten Bild sofort).
- Beim Rückweg wird das Bild der Zielkarte `eager` und dekodiert, noch
  vor der neuen Aufnahme (`astro:after-swap`).

Ein Versuch, stattdessen beide Abbilder zu überblenden, hat in
Chromium messbar verschlechtert und ist nicht drin.

**Nachtrag — das weiße Bild VOR dem Morph:** Das Dekodieren hat das
Aufblitzen nach dem Rückweg beseitigt, das vor dem Hinweg blieb
(Florian). Dessen Auslöser ist der Übergangsname: Die Beitragskarten
gaben ihre Namen in Ruhe ab (`view-transition-name: none`, wie die
Leistungskacheln), erst der Tipp setzte ihn — und Safari legt für ein
benanntes Element sofort eine eigene Ebene an und rastert das Bild
neu: ein weißes Bild, bevor der Wechsel beginnt. Die Beitragskarten
behalten ihre Namen jetzt dauerhaft; bei zwei, drei Beiträgen kostet
das nichts, die übrigen Karten blenden im Wechsel schlicht mit der
Seite aus. Die Leistungskacheln (zwölf, ohne Foto) bleiben beim alten
Verfahren.

**Nachtrag 2:** Mit den dauerhaften Namen fehlte im Rückweg das Bild
des NACHBAR-Beitrags und kam erst danach — die Regel, die im Rückweg
das neue Abbild der Gruppe „bild" ausblendet, traf jetzt jeden
Ausschnitt mit dieser Klasse. Die Klasse bekommt nur noch der
Ausschnitt der morphenden Karte (`[data-morph]`). Und gegen das
Blitzen vor dem Start liegt der Ausschnitt dauerhaft auf einer eigenen
Ebene (`will-change: transform`): Safari muss sie beim Erfassen dann
nicht mehr anlegen. Nicht am Gerät geprüft — Florian testet.

**Nachtrag 3 — die Kopfleiste fuhr im Rückweg über ihr Abbild ein**
(Leistungen wie Neuigkeiten): Das Zentrieren der Zielkachel lief seit
dem Nachmittag als Mikroaufgabe nach dem Tausch; die Leisten prüfen
ihren Zustand (`data-gescrollt`) ebenfalls in einer Mikroaufgabe, und
je nach Reihenfolge sahen sie Scrolltiefe 0, stellten auf „nicht
gescrollt", das Abbild wurde so aufgenommen, und nach dem Wechsel fuhr
die echte Kopfleiste ein. Die Mikroaufgabe war nur nötig, solange
Begrüßung und Band auf Handys erst umsortiert wurden — das steht
inzwischen im Markup. Das Zentrieren läuft wieder sofort im
`after-swap`.

**Nachtrag 4 — wie die Leistungen, plus kleines Bild:** Florian: Bei
den Leistungen ist alles glatt — was ist der Unterschied? Drei Dinge,
zwei davon waren meine Versuche von heute: dauerhafte Namen (zurück auf
„nur die morphende Karte", wie die Kacheln; der Nachbar erscheint
damit wieder mit der Seite) und die eigene Ebene (`will-change`, weg).
Der dritte ist der eigentliche: Die Kachel morpht ein kleines SVG, die
Karte ein 120 bis 170 KB großes JPEG — und Safari dekodiert so große
Bilder asynchron, auch beim Erfassen für den Wechsel. Deshalb erzeugt
`scripts/bilder-varianten.mjs` vor jedem Build (`prebuild`) für jedes
Beitragsbild eine 600-px-Variante (rund 30 bis 50 KB, in .gitignore),
die Karte zeigt sie (`bildKlein()` in Neuigkeiten.astro, mit Rückfall
auf das Original), die Beitragsseite weiter das Original. Und weil
Karte und Seite damit verschiedene Dateien zeigen, dekodiert
`uebergaenge.ts` das Original der Zielseite vorab (im `loader`), bevor
die neue Seite eingetauscht und aufgenommen wird.

**Nachtrag 5 — das Bild, das im ersten Bild noch fehlt:** Das weiße
Bild vor dem Hinweg blieb auf dem iPhone, in Safari wie in Chrome (dort
ebenfalls WebKit); in Chrome auf dem Desktop war alles richtig
(Florian). Das Nachbarbild blendet übrigens korrekt mit der Seite aus
und ein — das war falsch gesehen und ist nicht geändert.

Die Ursache liegt im ersten Bild des Übergangs: Auf der Bildfläche ist
dort nur die NEUE Aufnahme zu sehen, also das live gezeichnete Bild der
Beitragsseite; die Aufnahme der Karte stand auf `display: none`, und
die Karte selbst spart das Bild aus (es hat ja einen eigenen Namen).
Das Bild der Beitragsseite war bis jetzt ein nacktes `<img>` mit
Übergangsnamen — WebKit legt dafür eine reine Bildebene an, und auf
iOS kommt deren Inhalt erst ein Bild später an. Bei den Leistungen
wandert an dieser Stelle ein SVG-Symbol, das sofort gezeichnet wird;
deshalb war es dort nie zu sehen. Zwei Änderungen:

- **Den Namen trägt auf der Beitragsseite der Ausschnitt um das Bild**
  (`.beitrag__ausschnitt`, wie auf der Karte), nicht mehr das `<img>`.
  Das Bild wird darin wie jeder andere Inhalt gezeichnet. Maße und Lage
  sind unverändert (nachgemessen: 342 × 271 px, Text darunter an
  derselben Stelle).
- **Auf dem Hinweg bleibt die Aufnahme der Karte als stille Unterlage
  stehen** (`animation: none; opacity: 1` statt `display: none`). Zu
  sehen ist sie nie — die Aufnahme der Beitragsseite ist ein deckendes
  Foto und liegt ganz über ihr. Sie fängt nur den Fall ab, dass diese
  im ersten Bild noch leer ist: Dann steht dort das Kartenbild, also
  genau das, was eben noch zu sehen war, statt Weiß. Die Aufnahme der
  Karte ist fertig, bevor der Wechsel beginnt. „Ein Bild wandert, kein
  Überblenden" (18. September) gilt weiter.

Nachgeprüft: In Chromium ist jedes Bild des Übergangs, hin wie zurück,
pixelgleich mit dem Stand davor (bis auf den Unterstrich von „Beitrag
lesen", der beim Tippen wächst und je Lauf anders erwischt wird). In
WebKit (Playwright) stimmen die berechneten Stile der Ebenen, und die
Aufzeichnung zeigt ein wanderndes Bild ohne Doppelbild. Das Aufblitzen
selbst lässt sich dort nicht nachstellen — es tritt nur auf dem iPhone
auf; Florian prüft am Gerät.

### Sprechstunden-Kreuz, Spalten ohne Umbruch, Stellenliste weicher (27. September 2026, abends)

**Das Kreuz der Sprechstunden (Handys) fährt nie mehr per Skript mit.**
Der klebende Zwilling stand fest im Fenster und wurde, sobald die Karte
oben hinausfuhr, Bild für Bild nachgeschoben (`--kreuz-oben`). Auf dem
iPhone lief das dem Scrollen hinterher; beim Zurückscrollen blieb er
außerdem 500 ms oben stehen, während das Kreuz der Zeile erst danach
wieder auftauchte — schon ein Stück tiefer (Florian: „springt an die
falsche Stelle und bleibt fixed on top"). Jetzt:

- Der Zwilling klebt mit echtem `sticky` in einer Bahn
  (`.ozkreuzbahn`) über dem Bereich. Ihre Höhe (`--kreuz-bahn`, aus
  `bahnMessen()`) reicht bis zur Unterkante der letzten Zeitenzeile an
  der Stelle, wo die Karte nach der Fahrt steht: Dort gibt `sticky` ihn
  frei, und er fährt mit dem Inhalt hinaus — früher als vorher (dort
  erst mit der Unterkante der Karte, also 40 px später auf Handys) und
  ohne Skript. Nachgemessen: Unterkante Zwilling 140,0 px gegen
  Unterkante Zeiten 140,1 px, beim Durchscrollen keine Abweichung.
- Das Skript entscheidet nur noch, WER zu sehen ist: Erreicht das
  Kreuz der Zeile die Kopfleiste (96 px), übernimmt der Zwilling und
  zeichnet Grund und Kreis ein. Scrollt man zurück, übernimmt sofort
  wieder das Kreuz der Zeile — erst mit Grund und Kreis, die es dann in
  500 ms ausradiert, während es mit den Sprechstunden nach unten fährt.
- Der Grund des geklebten Kreuzes ist mit `backdrop-filter: blur(20px)`
  weichgezeichnet wie die Kopfleiste (styles/global.css, gilt auch auf
  Leistungs- und Beitragsseiten). Der Weiß-Anteil bleibt 85 %.
- Kein grauer Grund mehr beim Zeigen (Desktop und Handys); das Kreuz
  dreht sich nur.
- Auf Handys steht das Kreuz im Fluss in der Zeile des **Kickers**, die
  Unterkante des X auf dessen Grundlinie (nachgemessen: 0,4 px
  Abweichung — die Strichstärke). Kicker, Überschrift und Kreuz stehen
  dafür in einem Raster (`.ozblase__kopf`); die Zeile der Überschrift
  bleibt mindestens 48 px hoch, damit Überschrift und Einleitung genau
  dort bleiben, wo sie waren (nachgemessen: unverändert). Auf dem
  Desktop steht das Kreuz weiter neben der Überschrift.

**Die Sprechzeiten brechen nie mehr um.** Vor- und Nachmittag standen
als zwei Stücke mit `flex-wrap` nebeneinander; wurde eine Spalte zu
schmal, rutschte der Nachmittag darunter (Florian: „dürfen NIE so
umbrechen"). Jetzt stehen sie immer in einer Zeile, und
`spaltenWaehlen()` misst die unumbrochene Breite jeder Liste:
drei Spalten, solange alle samt Mindestabstand (28 px, bis 88 px auf
breiten Schirmen) passen — jede Spalte mindestens so breit wie ihr
Inhalt, sonst gleiche Drittel, sodass beim Schmälerwerden zuerst nur
der Raum dazwischen schrumpft —; dann zwei (die Sprechstunden
untereinander links, die telefonische Erreichbarkeit rechts); dann eine.
Gemessen: drei ab etwa 1 300 px Fensterbreite, zwei von 768 bis 1 200,
darunter eine. Reicht selbst einspaltig die Breite nicht (unter
375 px), werden die Zeilen verkleinert statt umbrochen — bei 360 px auf
98 %, bei 320 px auf 84 % (Untergrenze 80 %). Die Abstände in den Zeilen
stehen dafür in `em`. Die Kartenhöhe ändert sich mit den Spalten; die
Bewegung wird danach neu vermessen (auch, wenn die Schrift nachlädt).

**Stellenliste langsamer und weicher.** Die Klappe fährt 0,9 s statt
0,7 s mit einer neuen, an beiden Enden weichen Kurve (`--verlauf-weich`,
`cubic-bezier(0.4, 0, 0.2, 1)`, in tokens.css und als `KURVEN.weich`
für das Mitführen der Zeile). Beim Zuklappen verschwand der Text in
0,2 s, bevor sich etwas bewegte, und der Anriss war sofort wieder da.
Jetzt blendet der Text 0,7 s aus, bis weit ins Zufahren hinein; die
Klappe fährt nach 0,25 s zu (die Zeit, in der die Ansprechperson
ausblendet); der Platz für den Anriss wächst im Takt der Klappe, der
Anriss selbst blendet erst in deren zweiter Hälfte ein (0,65–1,15 s).
Bezeichnung, Kreis und Nummer folgen der Klappe mit demselben Verzug.
Die Werte stehen als `--klappen-dauer` / `--klappen-verzug` an der Liste
und als `KLAPPEN` / `AUSBLENDEN` im Skript.

### Wie die alte Seite: Logo und Zipfel stehen still, die Karte kommt 150 px früher (27. September 2026, abends)

Florian verglich am iPhone mit dres-nold.de. Gemessen haben wir die alte
Seite in Playwright (375 × 812, Handy-Profil).

**Logo und Blase rutschten mit der Browserleiste.** Startbereich und
Bühne der Sprechstunden waren `100dvh` hoch. `dvh` wächst, wenn die
Bedienleiste von Safari und Chrome beim Scrollen einklappt — das mittig
gesetzte Logo rutschte dabei ein paar Pixel nach unten, Blase und
Zipfel ebenso. Die alte Seite nimmt für beides `100vh`
(`.logo-container`, `.oz-container`), auf Handys die Höhe bei
eingeklappter Leiste — sie steht still. Jetzt bei uns auch
(`Startbereich.astro`, `.ozbereich__buehne`).

**Die Spitze des Zipfels steht fest auf der Linie.** Auf der alten Seite
steigt die Blase auf dem letzten Stück 150 px, während der Zipfel im
selben Abschnitt 155 px wächst; gemessen steht die Spitze dabei
zwischen 698 und 701,5 px, die Linie der Symbolleiste bei 702 — sie
landet genau darauf. Bei uns liefen Blase und Zipfel mit eigenen
Stützstellen und Kurven: Die Spitze tauchte beim Ausfahren bis 708 px
(6 px unter die Linie) und stieg dann auf 690,5 px (11,5 px darüber).
Jetzt wächst der Zipfel genau um das, was die Blase noch bis zur
Ruhelage steigen muss (`zeichnen()`: Ausfahrgrad = 1 − Versatz ÷
Zipfellänge). Gemessen: 702,0 px vom ersten Ausfahren bis zum Schnalz,
auf dem Desktop 790,0 px bei einer Linie von 790. Die 10 px Luft vom
18. September sind weg — sie brauchte es nur, weil die Spitze beim
Ausfahren unter die Linie tauchte. Die eigenen Stützstellen des
Zipfels und `OZ_ZIPFEL_VOLL` sind entfallen.

**Die Sprechstunden kommen 150 px früher** (Florian: „es ist zu lange
weiß, wenn sich das Logo ausgezeichnet hat"). Nicht der Weg ist kürzer,
sondern der ganze Ablauf a-19 läuft um `OZ_VORLAUF` (150 px) früher —
Hereinfahren, Rast, Schnalz, Leistenwechsel, Freigabe der Bühne und die
Sprungmarken; Tempo und Wege bleiben. Eingerechnet in
`ozFortschritt()`, `schnalzWeg()`, `ozTiefeAus()` (scripts/scrollwege.ts)
und `--oz-vorlauf` / `--oz-ende` (Oeffnungszeiten.astro). Gemessen wird
die Karte über der Leiste 140 bis 150 px früher sichtbar — auf Handys
schon, während sich das Logo noch auflöst —, und sie erreicht die
Unterkante des Logos 30 px (375 × 667) bis 330 px (1440 × 900)
Scrollweg, nachdem es ganz fort ist.

---

## Seitenaufbau, Dentosophie, neue Redaktion (Oktober 2026)

Wünsche der Praxis (Dokument und Nachricht) und Florians Vorgaben für
eine visuellere Redaktion. **Dieser Abschnitt überholt ausdrücklich
diese früheren Festlegungen:**

| Früher | Jetzt |
|---|---|
| Sprechstunden-Knopf **rechts außen**, mobil als letzter (Öffnungszeiten, 13./14. September) | Sprechstunden ist **der erste** Punkt in allen Leisten, mobil: Sprechstunden · Leistungen · Telefon |
| Der Zipfel zeigt „weit rechts" (Einstieg, 17. September) | Er zeigt gespiegelt auf den Knopf links; `Oeffnungszeiten.astro` spiegelt Grundlinie und Basis, sobald die Spitze in der linken Hälfte liegt |
| Symbole in der Leistungen-Blase, Ausrichtung `knopfX − 54` (18. September) | Unterpunkte haben **keine Symbole**; der Text der Unterpunkte steht unter dem Wort (`textLinks − 36`), die Breite wird gemessen (220–400 px) |
| Freie Abschnitte **ohne eigenen Menüeintrag** | Jeder Block kann einen Menüpunkt haben, jeder Abschnitt mit Überschrift einen Unterpunkt |
| Team, Neuigkeiten, Kontakt mit `z-index: 40` außerhalb von `main` (27. September) | **Alle Blöcke stehen in `main`**, ohne eigenen z-index — sonst verdeckte ein solcher Block als erster die Karte samt Zipfel. Nur `.fuss` behält seinen Wert |
| Knopfzeile mit höchstens zwei Knöpfen (Verweis, PDF) | `knoepfe[]` mit bis zu drei Knöpfen, jeder mit einem Ziel (Seite, Abschnitt, Datei, Website, E-Mail, Telefon) |
| Kleine Bildvarianten nur für Beitragskarten | Für alle Karten- und Titelbilder aus `bereiche.json`, dazu eine 900-px-Variante für die breite Ankündigungskarte |
| Kategorie-Symbole bei den Leistungen | Entfallen — im Menü und in den Gruppenzeilen der Leistungen (`public/icons/kategorien/` ist weg) |

### Die Startseite ist eine Folge von Blöcken

`src/content/seitenaufbau.json` legt die Reihenfolge fest; die Redaktion
zeigt sie als Seitenplan zum Verschieben. **Startbereich, Sprechstunden
und Fußbereich stehen fest** und sind nicht Teil der Liste. Bewusst ohne
`position`: Die Reihenfolge der Liste ist die Reihenfolge der Seite.

- Blockarten: `willkommen`, `galerie`, `leistungen`, `team`, `stellen`,
  `kontakt`, `bereich` (ein eigener Bereich aus `bereiche.json`) und
  `verweis` (ein reiner Menüpunkt mit festem Platz, ohne Inhalt auf der
  Seite).
- Jeder Block trägt seinen Abstand **nur unten**. Der erste Block nach
  der Karte bekommt den Freiraum für den Zipfel (`index.astro`,
  `.startblock:first-of-type`) — dieser Freiraum ist jetzt tragend,
  gleich welcher Block vorn steht.
- Steht die Begrüßung nicht vorn, gibt es ein unsichtbares `h1`, und
  sie wird `h2`.
- Die Überschriften-Regel ist klassenbasiert (`.bereich__titel`), nicht
  mehr `main h2` — sonst hätte sie den Kontakt-Titel überschrieben.

### Das Menü folgt der Seite

Das Menü wird aus dem Seitenaufbau gebaut (`src/lib/aufbau.ts`,
`menueBauen`) — Kopfleiste, Symbolleiste, Handy-Menü in derselben Folge.
Sprechstunden immer zuerst, weil die Karte das Erste ist.

- **Höchstens sieben Hauptpunkte**, Sprechstunden mitgezählt. Mehr
  passt bei 992 px nicht in die Kopfleiste; die Prüfung lehnt das
  Speichern sonst ab. Der Abstand zwischen den Punkten schrumpft von
  1200 bis 992 px gleitend auf 12 px
  (`clamp(12px, calc((100vw - 992px) * 0.08 + 12px), 20px)`); ab 1200 px
  ist die Optik unverändert.
- **Ziel eines Hauptpunkts** ergibt sich aus dem Block (Sprungmarke bzw.
  Adresse der Seite). Frei wählbar nur bei Unterpunkten und `verweis`.
- **Unterpunkte**: zuerst die automatischen (Leistungskategorien;
  Abschnitte mit „Als Unterpunkt im Menü zeigen"), dann die selbst
  angelegten. Liegt das Ziel auf der aktuellen Seite, gleitet sie hin;
  sonst ein weicher Seitenwechsel, danach steht die Seite an der Marke.
- Jeder Punkt mit Unterpunkten klappt als Blase auf; **nie zwei offen**
  (ein Koordinator je Leiste — alle Blasen teilen sich `--blase-form`).
  Erster Klick öffnet, zweiter springt.
- **Handy-Menü:** Der Ebenenwechsel von „Leistungen" gilt jetzt für
  jeden Punkt. Als erste Unterzeile steht „‹Titel› – Übersicht", sonst
  wäre das Ziel des Hauptpunkts selbst nicht erreichbar. Escape führt
  eine Ebene zurück.
- Ein ausgeblendeter Block nimmt seinen Menüpunkt mit.

### Eigene Bereiche: Seite, Beiträge, Abschnitt

`src/content/bereiche.json` ersetzt `neuigkeiten.json` und
`abschnitte.json` — alles in **einer** Datei, damit die Redaktion mit
wenigen GitHub-Abrufen auskommt.

| Typ | Adresse | Auf der Startseite |
|---|---|---|
| `seite` | `/<id>/` | Ankündigungskarte (breit, Bild 7/12 links), morpht in die Seite; abschaltbar (`auf_startseite`) |
| `blog` | `/<id>/<beitrag>/` | Kartenreihe wie die Neuigkeiten |
| `abschnitt` | — | Der Inhalt selbst |

Seiten, Beiträge und Startseiten-Abschnitte bestehen aus **Abschnitten**
dreier Arten: `text` (Bild links, rechts oder ohne), `kacheln` (kurze
Texte nebeneinander, mit oder ohne Symbol) und `kapitel` (große
Überschrift mit Haarlinie, gliedert lange Seiten und hebt die
Überschriftenebene der folgenden Abschnitte).

- **Sprungmarken:** auf einer Seite die Kennung des Abschnitts
  (`/dentosophie/#mundatmung`), auf der Startseite `#<bereich>-<abschnitt>`.
- **Gesperrte Kennungen** für Bereiche: alles, was schon eine Adresse
  oder Sprungmarke ist (`VERGEBEN` in `schema.ts`, dazu `leistungen-*`).
- Die Adressen `/neuigkeiten/<id>/` bleiben, weil Neuigkeiten jetzt der
  Blog mit der Kennung `neuigkeiten` ist.
- Das Schließkreuz einer Seite ohne Karte geht zurück, wenn man von
  dieser Website kam, sonst auf `/`.

### Dentosophie

Eigene Seite `/dentosophie/`, Menüpunkt neben den Leistungen mit den
Unterpunkten „Atmen, Kauen, Schlucken" · „Indikationen" · „Mundatmung
und ihre Folgen" (ein Kapitel der Seite, `#mundatmung`). Texte allein
aus dem Dokument der Kundin; die Seite der Kollegin
(zahnarzt-sundern.de) war von hier aus nicht erreichbar — ihre Punkte
zu Ablauf und Indikationen kommen später. Titelbild vorläufig ein
Praxisfoto.

**Symbole vorläufig:** `public/icons/symbole/*.svg` (Linien 1,5) und
`public/icons/navigation/dentosophie.svg` im Kreis-Stil des Menüs sind
von mir gezeichnet; Florian ersetzt sie später.

### Inhalte nebenbei

- „Schnarchen & Schlafapnoe" steht unter den zahnärztlichen Leistungen;
  „Mundatmung und ihre Folgen" darin ist ein Verweis auf die Seite.
- Kategorie „Test" ausgeblendet, Knopf „hallo" und der Abschnitt
  „Digitale Abformung statt Abformlöffel" entfernt. „Beispielleistung"
  und „Beispielbeitrag" bleiben.
- Der Kieferorthopädie-Abschnitt ist sachlich neu formuliert, eng an der
  alten Seite; Tippfehler „Alinger" korrigiert.

### Die Redaktion

Ein Arbeitsplatz unter `/admin/`: links der Seitenplan (Ziehen am Griff
oder ▲ ▼, jede Bewegung wird angesagt), rechts das Formular des Blocks,
unten **ein** Knopf „Veröffentlichen" für alle Änderungen — ein Commit.
Erkannt wird jede Änderung durch Vergleich mit dem geladenen Stand, nicht
mehr nur durch Tippen.

- **Ein Ziel-Dialog** für Knöpfe, Menüpunkte und Textverweise: diese
  Website (mit Suche), Datei, andere Website, E-Mail, Telefon. Im Feld
  steht lesbar „Dentosophie › Mundatmung", nicht die Adresse.
- **Dateien** in mehr Formaten (PDF, Word, Excel, PowerPoint,
  OpenOffice, Text, CSV, Bilder); geprüft werden Endung **und**
  Dateianfang, gleiche Namen bekommen eine Nummer, Hochladen allein baut
  nicht neu (`[skip ci]`).
- „Online ✓" kommt aus `/stand.json`, das der Build schreibt.
- Speichern meldet einen Konflikt nur, wenn seither **dieselbe** Datei
  geändert wurde.
- Bewusst später: Entwürfe im Browser sichern, Live-Vorschau.

## Feinschliff nach dem ersten Blick auf die neue Fassung (17. Oktober 2026, abends)

Florian auf dres-nold.pages.dev, zwölf Punkte. **Überholt damit** aus dem
Oktober-Abschnitt oben: „Sprechstunden ist der erste Punkt in allen
Leisten" gilt nur noch für **Kopfleiste und Handy-Menü**. In der
**Symbolleiste unten** stehen die Sprechstunden wieder **ganz rechts**,
und der Zipfel zeigt ungespiegelt dorthin. Die feste Handy-Leiste mit drei
Symbolen ist entfallen.

- **Scroll-Hinweis:** 24 px tiefer unter dem Logo (`--hinweis-abstand`),
  Gewicht 350 (`--gewicht-fein`). Der Pfeil schwebt ruhig auf und ab:
  2,4 s, 6 px, Deckkraft bis 0,55. Er steht still, sobald gescrollt wurde
  und bei reduzierter Bewegung. Animiert wird nur der Pfeil im eigenen
  Rahmen des Hinweises, der Saum am Logo bleibt weg.
- **Sprechstunden auf dem Desktop 200 px früher:** `ozVorlauf()` gibt
  350 px auf dem Desktop und 150 px bis 991 px zurück (`--oz-vorlauf`
  ebenso). Gemessen kam die Karte vorher über die Leiste, wenn sich das
  Logo zu 95–99 % aufgelöst hatte. Jetzt sind es 68 % bei 1280 × 720,
  78 % bei 1440 × 900 und 82 % bei 1920 × 1080, Handys unverändert.
- **Symbolleiste: so viele Symbole, wie Platz haben** (`leisteEinpassen`
  in Navigation.astro). Es gibt eine Liste für alle Breiten: die
  Seitenreihenfolge ohne Sprechstunden, auf Handys die Telefonnummer,
  dann die Sprechstunden.
  - **Einpassen:** Ein ResizeObserver misst die natürlichen Breiten.
    Zwischen zwei Symbolen steht ein Punkt mit mindestens 22 px Luft zu
    jeder Seite.
  - **Wegfallen:** Passt das nicht, fällt von hinten weg, was nicht
    `data-immer` trägt. Immer bleiben Leistungen, Telefon und
    Sprechstunden.
  - **Gemessene Folgen:**
    - 375 px: Leistungen · Telefon · Sprechstunden
    - 600 px: dazu Praxis
    - 768 px: bis Neuigkeiten
    - 991 px: bis Team
    - ab 992 px: alle sieben
  - Die Beschriftungen brechen nie um.
  - **Unterpunkte unten:** Bis 991 px springt ein Punkt mit Unterpunkten
    in der unteren Leiste direkt, wie früher die Handy-Leiste. Ab 992 px
    klappt er als Blase auf.
  - **Zipfel:** Danach misst er neu (`leiste:eingepasst`).
- **Begrüßung:** Ein Raster statt einer starren Flex-Zeile, beide Spalten
  beginnen oben.
  - **Rechte Spalte:** Ist sie niedriger als die Überschrift, reicht sie
    bis zu deren Unterkante. Die Knöpfe stehen dann unten, wie bisher.
  - **Wenn es eng wird:** Die große Zeile wird kleiner, bis die rechte
    Spalte daneben Platz hat (64 px bei 992 px, 78 px ab etwa 1220 px).
    Vorher lief die rechte Spalte rechts aus dem Bild.
  - **Unter 992 px** stehen die Spalten untereinander, mit einer
    waagerechten Haarlinie. Die Spalte ist so breit wie der kurze Satz,
    der so in einer Zeile steht statt im Blocksatz zu klaffen.
- **Kein Scrollbalken** auf der öffentlichen Seite (`uebergaenge.css`,
  `scrollbar-width: none`). Beim Morph in kürzere oder längere Seiten kam
  und ging er und verschob alles. Die Redaktion lädt diese Datei nicht und
  behält ihre Balken.
- **Handy-Menü:**
  - **Spalte:** Die Symbolspalte steht höchstens 40 px (`--abstand-l`)
    von der Wand der Blase. Bis etwa 400 px ändert sich nichts. Auf
    breiten Handys stand sie vorher in der Mitte, bei 800 px 224 px von
    der Wand entfernt.
  - **Unterpunkte:** 12 statt 8 px Luft.
  - **Hörer:** Bei geschlossenem Menü rückt er nur so weit nach links,
    dass die Nummer vor dem Punkt Platz hat. Bei offenem Menü steht er
    bündig mit den Symbolen.
- **Morph der Karten:**
  - **Kein Zucken mehr vor dem Morph:** Ein laufender Hover-Übergang
    wird eingefroren, statt auf seinen Endwert zu springen
    (`karteEinfrieren`). Die Scroll-Vergrößerung (a-3) steht während des
    Wechsels still (`bildlaufAnhalten`), sonst war das Abbild ein Stück
    anders groß als gemessen.
  - **Breite Ankündigungskarte einer eigenen Seite:** Nur das Bild
    wandert. Karte und Seite tragen keinen Kartennamen, der Text blendet
    und schrumpft mit dem Rest.
  - **Rückweg mit dem Zurück-Knopf des Browsers:** Die Karte, von der
    man kam, ist jetzt auch das Ziel (`e.from`). Sie wird aber nicht
    mittig gestellt, der Browser stellt die Scrolltiefe wieder her.
  - **Bild ohne Gegenstück** (Seite ohne Karte): Es blendet mit seiner
    Seite (`:only-child`), statt die ganze Dauer über dem anderen Inhalt
    stehen zu bleiben.
- **Punktlinie über der offenen Blase:** Beim Wechsel zwischen zwei
  Aufklappmenüs räumte die schließende Blase den gemeinsamen Zustand der
  Leiste (`data-ohne-linie`, Maske) ab, nachdem die neue ihn gesetzt
  hatte. Jetzt gehört er der zuletzt geöffneten Blase, und nur sie räumt
  ihn ab. Geht eine Blase auf, verschwindet jede andere derselben Leiste
  sofort, auch eine, die gerade zuklappt.
