# Handoff: Startseite dres-nold.de — Typografie, Abstände, Layout

## Überblick

Neugestaltung der **Startseite** (One-Pager) der Zahnarzt- und KFO-Praxis Dres. Nold. Ziel: feinere, elegantere Typografie; ein durchgängiges Grau-System; klare Abschnittsrhythmen; ruhigere Knöpfe; ein sauberer Muster-Abschnitt für redaktionelle Inhalte; mehrere Stellenanzeigen; Galerie-Fortschrittsleiste statt Punkte.

**Was bleibt:** Morph-Seitenwechsel zu Leistungen/Neuigkeiten, Menü-Animationen, Scroll-Choreografie (fixer Startbereich → Inhalt schiebt sich darüber → Kopfleiste fährt ein, Fußleiste fährt aus), Punktlinie, animierter Verlauf in Überschriften, Hinweis-Blase, Karten-Einwilligung.

**Was sich ändert:** Schriftgrößen/-gewichte, Laufweiten, Grautöne, Abstände, Ausrichtung (Überschriften linksbündig, außer Willkommen), Knopf-Gestaltung und -Animation, Kachel-Gestaltung, Stellen-Bereich, Galerie-Anzeige, Gruppen-Überschriften der Leistungen, Team-Aufbau.

## Zu den Design-Dateien

`Startseite.dc.html` ist ein **Design-Referenz-Prototyp in HTML** — kein Produktionscode. Er zeigt Aussehen und Verhalten. **Aufgabe ist, diese Gestaltung in der bestehenden Astro-Codebase umzusetzen** (`src/components/*.astro`, `src/styles/tokens.css`, `src/styles/global.css`), mit den etablierten Konventionen des Projekts:

- Alle Werte über Tokens in `tokens.css` — keine festen Farben/Größen in Komponenten (CLAUDE.md).
- Inhalte kommen weiterhin aus `src/content/*.json`. Der Prototyp enthält Beispieltexte; diese **nicht** in die JSON übernehmen (Stellen, Vorteile-Liste, Beispiel-Abschnitt sind erfunden).
- Keine externen Ressourcen. Alles selbst gehostet.
- `prefers-reduced-motion` respektieren (bereits über `--dauer-*` gelöst).
- Deutsche Bezeichner und Kommentare wie im Bestand.

Der Prototyp ist im Vorschau-Werkzeug entstanden und nutzt dort Inline-Styles und Klassen (`.kn`, `.vl`, `.kachel`, `.tl`) — das ist ein Artefakt des Werkzeugs, keine Vorgabe für die Zielarchitektur.

## Fidelity

**High-fidelity.** Farben, Schriftgrößen, Gewichte, Abstände, Radien und Animationsdauern sind final und sollen so übernommen werden. Abweichung: dort, wo ein bestehendes Token nur minimal abweicht (z. B. `--radius-m: 8px` vs. 10 px im Prototyp), das Token anpassen oder ein neues anlegen — nicht in der Komponente hart kodieren.

---

## Design-Tokens (Änderungen an `tokens.css`)

### Farben
| Token | Wert | Verwendung |
|---|---|---|
| `--farbe-primaer` | `#6c1a51` | unverändert |
| `--farbe-text` | `#4d434b` | Fließtext (unverändert) |
| `--farbe-text-gedeckt` | `#766c74` | Zweitrangiges, Labels, Untertitel (unverändert) |
| **`--farbe-text-leise`** *(neu)* | `#c6bcc2` | Trennpunkte, Zähler-Nummern („01"), sehr leise Akzente |
| **`--farbe-linie`** *(ändern)* | `#e4e0e2` | Haarlinien, Kachel-Rahmen — bisher `#dddddd` (neutral, passt nicht zur Aubergine-Familie) |
| **`--farbe-linie-leise`** *(neu)* | `#f0ecee` | Trennlinien innerhalb von Listen |
| **`--farbe-linie-zeile`** *(neu)* | `#e9e4e7` | Zeilenlinien in Sprechzeiten |
| **`--farbe-flaeche-hell`** *(neu)* | `#faf8f9` | Kastenhintergrund (Sprechzeiten, Erfolgsmeldung) |
| `--farbe-flaeche-gedeckt` | `#f4f2f3` | unverändert |
| **`--farbe-formlinie`** *(neu)* | `#d6ced2` | Unterstreichung Formularfelder |
| `--farbe-fehler` | `#a4243b` | unverändert |
| Knopf-Verlauf | `#83306a → #6c1a51 → #5b1342` | radial, siehe Knopf |
| Knopf-Verlauf invers | `#fff → #fdfbfc → #f4eff2` | radial |

### Schrift
Source Sans 3 bleibt (variable Datei, Gewichte 200–900). **Kein zweiter Font.**

| Rolle | Größe | Gewicht | Zeilenhöhe | Laufweite |
|---|---|---|---|---|
| H1 Willkommen | `clamp(2.6rem, 1.1rem + 5vw, 4.9rem)` | **300** | 1.07 | −0.013em |
| H2 Abschnitt | `clamp(1.9rem, 1.1rem + 2.6vw, 3rem)` | **300** | 1.12 | −0.012em |
| H2 klein (Formular-Titel) | `clamp(1.5rem, 1.1rem + 1.2vw, 2rem)` | 300 | 1.22 | −0.011em |
| Team-Banner-Titel | `clamp(2rem, 1.1rem + 3.4vw, 4.2rem)` | 300 | 1.02 | −0.013em |
| Hinweis-Titel | 34px | 300 | 1.16 | −0.011em |
| **Kicker** (Label über H2) | 12px | 600 | 1 | **+0.18em**, Versalien |
| Kicker klein | 11.5px | 600 | 1 | +0.14–0.16em, Versalien |
| Gruppen-Überschrift Leistungen | 12px | 600 | 1 | +0.18em, Versalien, `--farbe-text` |
| Einleitung (Lead) | `clamp(1.06rem, .95rem + .5vw, 1.32rem)` | 400 | 1.6 | — |
| Fließtext Abschnitt | `clamp(1.02rem, .95rem + .3vw, 1.18rem)` | 400 | 1.68 | — |
| Fließtext Standard | 17px | 400 | 1.68 | — |
| Kachel-Titel | 19px | 600 | 1.3 | −0.012em |
| Kachel-Text | 15px | 400 | 1.6 | — |
| Neuigkeit-Titel | 21px | 600 | 1.3 | −0.014em |
| Stellen-Titel | `clamp(1.15rem, 1rem + .7vw, 1.6rem)` | 500 | 1.28 | −0.012em |
| Name Ärzte | 20px | 500 | 1.3 | −0.01em |
| Name Team | 17px | 500 | 1.3 | — |
| Funktion | 15px / 14px | 400 | 1.5 | `--farbe-text-gedeckt` |
| Knopf | 15px (klein 14px) | 500 | 1 | +0.01em |
| Textlink (`.tl`) | 12px | 600 | 1 | +0.14em, Versalien |
| Navigation Kopf | 15px | 500 | 1 | +0.012em |
| Kontaktzeile oben | 14px | 400 | 1 | — |
| Fußleiste Beschriftung | 14px | 400 | 1 | — |
| Formular-Label | 11.5px | 500 | 1 | +0.14em, Versalien |
| Formular-Eingabe | 17px | 400 | 1.4 | — |

**Grundsatz:** Überschriften leicht (300), Labels halbfett und gesperrt (600, Versalien). Nur diese zwei Gewichte für Hierarchie; Fließtext 400; Namen/Knöpfe 500.

Der bisherige `--text-titel` (60 px, `.heading` der Vorlage) entfällt zugunsten der H2-Größe oben.

### Abstände
| Zweck | Wert |
|---|---|
| Abschnitt oben/unten | `clamp(80px, 9vw, 124px)` |
| Willkommen oben | `clamp(72px, 9vw, 124px)`, unten `clamp(56px, 7vw, 96px)` |
| Kicker → H2 | 20px |
| H2 → Einleitung | 20px |
| Einleitung → Inhalt | 44–52px |
| Gruppen-Abstand Leistungen | `clamp(48px, 6vw, 72px)` |
| Kachel-Raster gap | 22–24px |
| Seitenrand | 24px, Inhaltsbreite `min(100%, 1360px)` |
| Leisten-Inhalt | `min(100% − 48px, 1360px)` |

`--breite-inhalt` von 1200 auf **1360px** anheben. Fließtext-Absätze `max-width: 34rem`.

### Radien & Schatten
- Kacheln/Kästen: **10px**
- Hinweis-Blase: 14px
- Knöpfe: `--radius-rund`
- Kachel-Hover: `0 18px 40px -28px rgba(108,26,81,.55)`
- Hinweis-Blase: `0 40px 80px -40px rgba(0,0,0,.6)`

### Bewegung
- Standard-Ausschwingkurve: `--verlauf-betont: cubic-bezier(.22,.61,.24,1)` (existiert)
- Einblenden beim Scrollen: 0.8s, `translateY(18px) → 0`, opacity 0 → 1, Trigger `rootMargin 0 0 -8%`, threshold 0.08
- Kachel-Hover: 0.45s (border, transform −3px, shadow); Icon scale 1.07 in 0.55s
- Leisten ein/aus: 300ms `cubic-bezier(0,0,.58,1)` (bestehend)
- Galerie-Band: 70s linear endlos, pausiert bei Hover/Fokus

---

## Abschnitte (Reihenfolge und Layout)

Die Reihenfolge ändert sich gegenüber `index.astro`: **Stellen vor Kontakt**, Team-Banner vor Team-Raster, Öffnungszeiten als eigener Abschnitt „Sprechstunden" nach der Galerie (siehe aber Entscheidungen.md: Blase-Lösung hat Vorrang — dann Blase beibehalten und den Sprechzeiten-Abschnitt weglassen oder als zusätzlichen Inhaltsblock einbauen; Rücksprache mit Florian).

1. Hinweis-Blase (Overlay)
2. Kontaktzeile oben (40px) → beim Scrollen ersetzt durch Kopfleiste (84px)
3. Fußleiste unten (112px, 6 Icons mit 3-px-Punkten) → fährt beim Scrollen aus
4. Startbereich (Logo, sticky, 100dvh)
5. **Willkommen** — zentriert, Logo-Echo 66×46px bei 50 % Deckung, H1, Lead, zwei Knöpfe (voll + Linie)
6. **Galerie** — Endlosband + Fortschrittsleiste
7. **Sprechstunden** — Kicker, H2, Einleitung, 3 Kästen `repeat(auto-fit, minmax(280px, 1fr))`
8. **Freier Abschnitt** (Muster: „Digitale Abformung statt Abformlöffel") — Kicker, H2, dann 2-Spalten `minmax(0,1.1fr) minmax(0,1fr)`: Bild 4:3 mit 10px Radius | Text + nummerierte Liste auf Haarlinien + Knöpfe
9. **Leistungen** — Kicker „Behandlung", H2, Einleitung; je Kategorie: Icon 34px + gesperrte Zeile + Haarlinie bis rechts, Beschreibung, Kacheln `repeat(auto-fill, minmax(290px, 1fr))`
10. **Team** — Vollbreiten-Banner (`clamp(340px, 42vw, 560px)`, Parallaxe, Verlauf unten `rgb(30 8 22 / 82%)` → transparent, Kicker + Titel weiß); darunter „Ärztinnen und Ärzte" 3:4-Porträts `minmax(240px, 1fr)`, „Unser Praxisteam" 1:1-Porträts `minmax(178px, 1fr)` mit aufklappbaren Tätigkeiten
11. **Neuigkeiten** — Kicker „Aktuelles", H2, Kacheln `minmax(320px, 1fr)` mit Bild 16:9, Datum als Kicker, Titel, Kurztext, Textlink
12. **Stellen** — Kicker, H2, Einleitung, Akkordeon-Liste auf Haarlinien, Fußzeile „Keine passende Stelle dabei?"
13. **Kontakt** — Kicker, H2, Adresse/Telefon nebeneinander (flex-wrap), dann 2-Spalten `minmax(0,1.15fr) minmax(0,1fr)`: Karte mit Einwilligung | Formular
14. Fußbereich — Punktlinie oben, Logo 78×54, Links mit 3-px-Punkten

**Ausrichtung:** Nur Startbereich, Willkommen und Hinweis zentriert. Alle anderen Abschnitte **linksbündig** (Kicker, H2, Einleitung) — das nimmt die Zentrierung des Logos auf und lässt darunter einen ruhigen Lesefluss entstehen.

---

## Komponenten im Detail

### Kicker (Abschnitts-Label)
`12px / 600 / letter-spacing .18em / uppercase / --farbe-text-gedeckt`. Steht **immer** über der H2, 20px Abstand. Texte: Sprechstunden · Aus der Praxis · Behandlung · Unser Team · Aktuelles · Stellenangebote · Kontakt · Nachricht.

### H2 mit Verlauf
Bestehende `background-clip: text`-Lösung mit `verlauf.gif` behalten. Gewicht 300, `text-wrap: balance`, **linksbündig**, `margin-inline: 0`. Die Regel `main.seiteninhalt h2 { text-align:center; margin-inline:auto }` in `global.css` entfällt. Zeilenhöhe ≥ 1.07 (sonst wird das „g" abgeschnitten — Kommentar im Bestand).

### Knopf (`.kn`)
Ersetzt alle bisherigen Knöpfe.

- Pillenform `--radius-rund`, `1px solid --farbe-primaer`, Padding 15px 30px (klein: 11px 22px), Schrift 15px/500 (klein 14px). Zwei Varianten: **Linie** (weiß, Aubergine-Text) und **voll** (Aubergine, weißer Text).
- `overflow:hidden; position:relative; z-index:0`.
- **Füllfläche**: `<span class="kn__f" aria-hidden="true">`, absolut, Kreis mit `width:230%; aspect-ratio:1`, `border-radius:50%`, `z-index:-1`, positioniert an `left:var(--x); top:var(--y)` (Default 50 %/50 %), `transform:translate(-50%,-50%) scale(0); opacity:0`. Hintergrund `radial-gradient(circle, #83306a 0%, #6c1a51 52%, #5b1342 100%)`; bei voll `#fff 0%, #fdfbfc 55%, #f4eff2 100%`.
- **Hover/Focus-visible**: Füllfläche `scale(1); opacity:1` in **0.7s** (`--verlauf-betont`), opacity 0.5s; Textfarbe wechselt in 0.45s; **Padding wächst um 3px je Seite** (30→33, klein 22→25) in 0.55s. **Sonst nichts** — keine Icons, Pfeile oder Punkte erscheinen.
- **Active**: Transition-Dauer 0.25s/0.2s.
- **Startpunkt des Verlaufs**: Ein `pointerenter`- und `pointerdown`-Listener (capture, auf `document`) setzt `--x`/`--y` in Prozent der Knopf-Fläche aus `clientX/Y − getBoundingClientRect()`. Kleines Skript, gehört nach `src/scripts/`.
- Text liegt direkt im Knopf (Textknoten), deshalb muss der Knopf selbst ein Stapelkontext sein (`z-index:0`) und die Füllfläche `z-index:-1` haben — sonst überdeckt sie den Text.

### Textlink (`.tl`)
Für „Mehr erfahren" in Kacheln und „Beitrag lesen". `12px / 600 / .14em / Versalien / Aubergine`, `inline-flex; gap:9px`. Pfeil rechts: die vorhandene `pfeil-runter.svg`-Polyline um −90° gedreht, 15×9px. Unterstreichung wächst von links über `background-size 0→100% 1px` (0.5s), Pfeil `translateX(5px)`.

### Kachel (Leistungen / Neuigkeiten)
`1px solid --farbe-linie`, Radius 10px, weiß, Padding 28px 26px 24px, `flex-column; gap:11px`. Leistungs-Icon 46px oben, Titel, Kurztext, Textlink unten (`margin-top:auto`). Hover: Rahmen Aubergine, `translateY(-3px)`, Schatten (siehe Tokens), Icon `scale(1.07)`. Neuigkeiten-Kachel: `padding:0; overflow:hidden`, Bild 16:9, Inhalt-Padding 28px 28px 26px.

Der bestehende Morph (`view-transition-name` der Kachel → Seite) bleibt unberührt.

### Galerie-Fortschrittsleiste
Ersetzt Punkte. Unter dem Band, 26px Abstand, Inhaltsbreite:
- `<button>` volle Breite, Höhe 22px, Haarlinie 1px `--farbe-linie` mittig
- darüber Fortschritt 1px Aubergine, `transform:scaleX(anteil)`, `transform-origin:left`
- Reiter 7px Kreis Aubergine, `left: anteil*100%`
- rechts Zähler `01 / 05`, 12px/500/.14em, `--farbe-text-gedeckt`, `tabular-nums`
- **Antrieb:** `requestAnimationFrame` liest `band.getAnimations()[0].currentTime` und schreibt direkt ins DOM (kein Framework-State). Klick auf die Leiste setzt `currentTime = anteil * dauer`.

### Sprechzeiten-Kasten
`--farbe-flaeche-hell`, Rahmen `--farbe-linie`, Radius 10px, Padding 32px 30px 28px. Titel als Kicker in Aubergine (12px/600/.16em). Zeilen: Tag links `--farbe-text`, Zeit rechts `--farbe-text-gedeckt`, 16px, Padding 11px 0, Linie `--farbe-linie-zeile`. Vor- und Nachmittag mit ` · ` getrennt. Zusatz kursiv 15px darunter.

### Nummerierte Liste (freier Abschnitt)
Zeile `flex; align-items:baseline; gap:18px; padding:16px 0; border-top:1px --farbe-linie`. Nummer `01` in 12px/600/.1em `--farbe-text-leise`, Text 16px.

### Stellen-Akkordeon
Liste mit `border-top` und je Eintrag `border-bottom` in `--farbe-linie`. Zeile (Button, volle Breite, Padding `clamp(22px,2.6vw,32px) 0`, `gap: clamp(16px,2.5vw,40px)`): Nummer `01` (`--farbe-text-leise`), Titel (flex:1), Umfang-Chip (`7px 16px`, Rahmen `--farbe-linie`, rund, 13px/500 gedeckt; **unter 700px ausblenden**), Kreis 32px mit Rahmen und Pfeil (dreht 180° in 0.45s).
Inhalt öffnet über `grid-template-rows: 0fr → 1fr` (0.5s), innen 2-Spalten `minmax(0,1.4fr) minmax(0,1fr)`: links Beschreibung (`redaktionstext`) + Punktliste mit 3-px-Punkten auf `--farbe-linie-leise`; rechts Ansprechpartner (Kicker + Name), Knöpfe „Jetzt bewerben" (voll, klein, `mailto:` mit `subject=Bewerbung: <titel>`) und „Ausschreibung (PDF)" (Linie, klein, nur wenn `pdf_datei` gesetzt).
Erste aktive Stelle initial offen. Darunter: „Keine passende Stelle dabei? Wir freuen uns auch über eine [unaufgeforderte Bewerbung]." Bereich weiterhin ausblenden, wenn keine Stelle aktiv.

### Team
- **Banner**: `aerzteteam.webp`, `object-fit:cover`, Parallaxe `translateY(−18px → +30px) scale(1.1 → 1.14)` abhängig von der Position im Viewport (rAF im Scroll-Handler). Verlauf unten 78 % Höhe. Kicker + Titel weiß mit `text-shadow: 0 0 18px rgb(0 0 0 / 55%)`, Abstand unten `clamp(28px,4vw,52px)`.
- **Gruppen-Zeile** (wie Leistungen): gesperrter Text + Haarlinie bis rechts.
- **Porträts**: Container mit `--farbe-flaeche-gedeckt`, `overflow:hidden`; Bild `object-position:top`, Hover `scale(1.04)` in 0.8s; unten `linie-schatten.svg` (14px) und `pfeil-team.svg` (16px) — bestehende Assets.
- **Tätigkeiten**: Button `Tätigkeiten` (11.5px/600/.14em Versalien Aubergine) + Pfeil 13×8px dreht 180°; Liste öffnet über `grid-template-rows` 0fr→1fr in 0.4s. Nur ein Eintrag zugleich offen.

### Kontakt
- Adresse und Telefon/Fax/E-Mail als zwei Blöcke `flex-wrap; gap: clamp(28px,5vw,80px)`, 17px/1.75. Praxisname 600 Aubergine, E-Mail 600.
- **Karte**: Kasten Rahmen + Radius 10px, `min-height: clamp(300px, 34vw, 470px)`. Vorschaubild `saturate(.55)`. Einwilligungs-Karte unten-innen (20px Rand): weiß 94 %, Radius 10px, Text 15px, Knopf „Karte laden" (voll, klein) + Textlink „In Maps öffnen". Nach Einwilligung: Iframe; im Fußbereich erscheint „Zustimmung zur Karte zurücknehmen" (bestehende `einwilligung.ts`).
- **Formular**: Kicker „Nachricht", H2 klein „Schreiben Sie uns", Hinweistext 15px gedeckt. Felder mit Label oben (11.5px/500/.14em Versalien gedeckt, 9px Abstand) und **nur Unterlinie** `1px --farbe-formlinie`, Fokus Aubergine (0.35s). Eingabe 17px, Padding 8px 0 11px. Fehler: Linie `--farbe-fehler`, Text 14px darunter (`role="alert"`). Abstand zwischen Feldern 26px. Absenden = voller Knopf. Erfolg: Kasten `--farbe-flaeche-hell` mit Aubergine-Rahmen, Titel 20px/500, Text 15px, Knopf „Neue Nachricht" (Linie, klein).
- Validierung: Name nicht leer; E-Mail-Muster; Nachricht ≥ 10 Zeichen.

### Leisten
- **Kontaktzeile** (40px): links Straße · PLZ Ort, rechts Telefon · E-Mail (500). Trennpunkte 3px `--farbe-text-leise`. Unter 700px Telefon + Punkt ausblenden.
- **Kopfleiste** (84px, fährt ab `scrollY > 62 % vh` ein): Logo 56px links; rechts Navigation 15px/500 mit 3-px-Punkten `--farbe-text-leise` dazwischen und Unterstreichung, die von links wächst (0.45s); ganz rechts Telefon als kleiner Linien-Knopf. Unter 980px: Burger (3 Linien 26×1.5px, wird zum X), Vollbild-Menü mit Icon 52px + Titel 19px je Zeile, Trennlinien `--farbe-linie-leise`, darunter Datenschutz/Impressum.
- **Fußleiste** (112px): 6 Icons 58px + Beschriftung 14px, dazwischen 3-px-Punkte **Aubergine** auf Icon-Höhe (`margin-bottom:24px`). Icon-Hover `translateY(-3px)`. Unter 980px: 3 Einträge (Kontakt · Telefon · Zeiten) in 104px, Icons 52px.
- Beide Leisten: `rgb(255 255 255 / 86%)` + `backdrop-filter: blur(20px)`, Punktlinie 1px.

### Hinweis-Blase
Overlay `#13000d99` + `blur(3px)`. Karte max 520px, Padding 40px 40px 36px, Radius 14px, Einflug 0.5s (`translateY(26px)` → 0). Kicker „Hinweis", Titel 34px/300 mit Verlauf, Text 17px, ein voller Knopf. Schließen-X oben rechts 34px rund, dreht 90° bei Hover.

---

## Responsives Verhalten

| Breite | Verhalten |
|---|---|
| ≥ 980px | Desktop-Navigation in Kopfleiste, lange Fußleiste |
| < 980px | Burger + Vollbild-Menü; kurze Fußleiste (3 Einträge) |
| < 700px | Alle 2-Spalten-Raster (`data-stapel`) auf 1 Spalte; Umfang-Chip und Telefon in Kontaktzeile ausblenden |
| alle | Raster mit `auto-fit`/`auto-fill` (keine feste Spaltenzahl); Schriftgrößen über `clamp()`; Galerie-Bildhöhe `clamp(230px, 32vw, 430px)` |

Große Bildschirme: Inhalt max. 1360px zentriert, Galerie-Band und Team-Banner vollbreit.

---

## Zustände (State)

- `gescrollt` (bool): `scrollY > innerHeight * 0.62` → steuert Leisten
- `menueOffen` (bool)
- `hinweisOffen` (bool)
- `offenesMitglied` (id | null) — Team-Tätigkeiten
- `offeneStelle` (id | null) — Stellen-Akkordeon, initial erste aktive
- `karte` (bool) — Einwilligung (bestehend, `localStorage`)
- Formular: `werte`, `fehler`, `gesendet`

Logo-Parallaxe im Startbereich: `scale(1 + 0.28p)`, `opacity 1 − p` mit `p = scrollY / (0.7·vh)`.

---

## Assets

Alle bereits im Repo unter `public/`:
- `icons/logo.svg`, `icons/<leistung>.svg` (11), `icons/kategorien/*.svg` (3), `icons/navigation/*.svg` (7 inkl. `telefon.svg`), `icons/ui/pfeil-runter.svg`, `icons/ui/pfeil-team.svg`, `icons/ui/linie-schatten.svg`
- `bilder/deko/verlauf.gif`, `bilder/deko/punktlinie.png`, `bilder/deko/icon-hintergrund.png`, `bilder/deko/karte-vorschau.jpg`
- `bilder/galerie/gallery02–06.jpg`, `bilder/aerzteteam.webp`, `bilder/team/*.jpg`
- `fonts/source-sans-3-normal.woff2`

Keine neuen Assets nötig. **Hinweis:** In der Zielumgebung die Original-SVGs verwenden (mit `<defs><style>`); die Kopien im Handoff-Ordner sind auf Attribute umgeschrieben, nur damit sie im Prototyp korrekt gefärbt sind.

---

## Dateien in diesem Paket

- `Startseite.dc.html` — vollständiger interaktiver Prototyp der Startseite (Referenz für Layout, Maße, Verhalten). Öffnet direkt im Browser zusammen mit `support.js` und `assets/`.
- `Typografie-Vorschlaege.dc.html` — die drei Vorentwürfe (1a wurde gewählt und weiterentwickelt) plus Folgeiterationen; nur Kontext.
- `support.js` — Laufzeit für die Prototyp-Dateien.
- `assets/` — Kopien der verwendeten Bilder, Icons und Schrift.

## Offene Punkte für Florian
1. Sprechzeiten: Blase (entscheidungen.md) vs. drei Kästen im Prototyp — bitte entscheiden.
2. Stellen-Beispieltexte im Prototyp sind erfunden; `stellen.json` enthält aktuell Testdaten und sollte bereinigt werden.
3. Freier Abschnitt „Digitale Abformung" ist ein Gestaltungsmuster für `abschnitte.json` — Vorteile-Liste und Knöpfe brauchen ggf. neue Felder im Schema (oder werden als `redaktionstext` gepflegt).
