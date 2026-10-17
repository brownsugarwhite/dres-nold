# dres-nold.de

Website der Zahnarzt- und Kieferorthopädie-Praxis **Dres. Nold**, Rosenstraße 1, 76467 Bietigheim.

---

> ## ⚠ Zuerst lesen: `docs/entscheidungen.md`
>
> Dort stehen Florians Festlegungen — **sie haben Vorrang vor allem
> anderen**, auch vor der alten Seite. Vor jedem Arbeitsschritt lesen.
>
> Die wichtigsten, weil hier schon gegen sie gearbeitet wurde:
>
> - **Leistungen sind eigene Seiten** unter `/leistungen/<id>`, die sich
>   beim Öffnen ins Vollbild morphen. **Nicht** die Aufklapp-Liste der
>   alten Seite nachbauen.
> - **Öffnungszeiten** verwenden auf allen Größen die mobile Lösung
>   (Blase mit Zipfel). **Nicht** die zwei Kästen der Desktop-Vorlage
>   und **nicht** die drei Kästen des Gestaltungs-Entwurfs.
> - **Die Blase ist die Sprechstunden-Karte** — auf allen Größen. Sie
>   fährt über das Logo herein; Begrüßung und Bilderband folgen ihr als
>   gewöhnliche Abschnitte am Anfang von `main` (`src/pages/index.astro`,
>   27. September 2026). Die Begrüßung ist ein zweispaltiger Block nach
>   Florians Entwurf: links die zweizeilige Überschrift, rechts Text und
>   Knöpfe, dazwischen eine Haarlinie.
> - **Kein Briefumschlag** im Kontakt.
> - **Das Menü folgt der Reihenfolge der Seite** (`seitenaufbau.json`),
>   Sprechstunden immer vorn, höchstens sieben Hauptpunkte; Unterpunkte
>   ohne Symbole (Oktober 2026).

> - **Gar keine eingebettete Google-Karte mehr.** Der Kontaktbereich
>   liegt auf einem eigenen Kartenbild; „Karte anzeigen" und „Route
>   planen" sind Verweise, die Google Maps in einem neuen Fenster
>   öffnen (18. September 2026). Die Seite lädt damit nichts von
>   fremden Servern — auch keine Einwilligung mehr.
>
> `design_handoff_startseite/` ist der Gestaltungs-Entwurf vom
> 17. September 2026. Er ist umgesetzt — mit den Ausnahmen, die in
> `entscheidungen.md` unter „Gestaltungs-Handoff" stehen.
>
> `docs/referenz/` beschreibt, was die alte Seite tut — als Nachschlage-
> werk, nicht als Vorgabe. Bei Widerspruch gilt `entscheidungen.md`.

---

Dieses Projekt ersetzt die bisherige Webflow-Seite durch einen eigenen, kostenfrei betreibbaren Nachbau.

**Gestaltung und Animationen der Startseite bleiben 1:1 erhalten**, der Unterbau ist vollständig neu. Hinzu kommen gegenüber der Webflow-Fassung: eigene Seiten für jede Leistung, ein Neuigkeiten-Bereich und ein aufklappbares Menü.

---

## Wichtigster Grundsatz

Diese Seite wird am Ende an die Praxis übergeben und dort ohne technisches Personal gepflegt. Alles, was hier entsteht, muss deshalb **verständlich, dokumentiert und robust** sein. Im Zweifel gilt: die einfachere Lösung, die in zwei Jahren noch nachvollziehbar ist, schlägt die clevere.

**Nie ohne Rückfrage ändern:** Inhalte unter `src/content/` (die pflegt die Praxis selbst), Farbwerte und Schriftgrößen (sind aus der Vorlage abgeleitet), die Domain- und DNS-Einstellungen.

---

## Technischer Aufbau

```
Redaktion ──► dres-nold.de/login
                 │
                 ▼
        Cloudflare Access          Anmeldung per E-Mail-Einmalcode.
        (fertiger Dienst)          Kein selbstgebautes Passwort-System.
                 │
                 ▼
        Redaktionsoberfläche  (src/pages/admin/)
                 │
                 │  functions/api/save.ts schreibt per GitHub-API
                 ▼
        GitHub-Repo "dres-nold"    Inhalte als JSON, Bilder/PDFs als Dateien.
           (Inhalt + Code)         Damit ist jede Änderung versioniert und
                 │                 rückgängig zu machen — das ist zugleich
                 ▼                 das Backup.
        Cloudflare Pages           Baut die Seite bei jeder Änderung neu (~40 s)
        (die öffentliche Seite)    und liefert reines HTML aus.
```

| Baustein | Wahl | Warum |
|---|---|---|
| Seitengenerator | **Astro** | Erzeugt statisches HTML ohne Framework-Ballast; ideal für eine Info-Seite |
| Styling | **Eigenes CSS mit Tokens** | Kein Tailwind, kein generierter Code — lesbar und nachvollziehbar |
| Animationen | **CSS + Intersection Observer** | Ersetzt Webflows Interaktions-Engine und jQuery |
| Seitenwechsel | **Astro ClientRouter + View Transitions** | Leistungen und Beiträge morphen ins Vollbild — echte Seiten, die sich wie eine App anfühlen |
| Hosting | **Cloudflare Pages** | Kostenlos, unbegrenzte Bandbreite, serverseitige Funktionen möglich |
| Login | **Cloudflare Access** | Fertiger Dienst, kostenlos bis 50 Nutzer, kein eigenes Passwort-System |
| Analytics | *(noch keins)* | Cloudflare Web Analytics wäre cookielos nachrüstbar, lädt aber ein Skript von Cloudflare — nur auf Wunsch der Praxis |
| Veröffentlichen | **GitHub Actions → `wrangler pages deploy`** | Ein Workflow für Push, Redaktion und den täglichen Neubau (`.github/workflows/veroeffentlichen.yml`) |
| Kontaktformular | **Resend** | Versand-API, kostenlos bis 3 000 Mails/Monat; `functions/api/kontakt.ts` |
| Silbentrennung | **`hyphen` im Build** | Lesetexte bekommen beim Erzeugen weiche Trennstriche nach deutschen Mustern (`src/lib/silben.ts`) — der Blocksatz hängt so nicht am Wörterbuch des Browsers |

### Was bewusst NICHT verwendet wird

- **jQuery, Swiper, Font Awesome, Adobe Typekit** — die vier Fremd-Abhängigkeiten der Webflow-Seite. Alles wird selbst gehostet bzw. neu gebaut.
- **Google Analytics** — erfordert bei einer Arztpraxis ein Einwilligungs-Banner (§ 25 TDDDG) und ist datenschutzrechtlich heikel, weil Seitenaufrufe Rückschlüsse auf Gesundheitsthemen zulassen. Nachrüstbar, aber nur auf ausdrücklichen Wunsch der Praxis.
- **Externe Ressourcen jeder Art.** Die Seite darf nichts von fremden Servern nachladen. `scripts/pruefe-externe-ressourcen.mjs` prüft das nach jedem Build (auch im Workflow). **Ohne Ausnahme** — seit dem 18. September 2026 auch die Karte im Kontakt: Sie ist eine selbst gehostete Zeichnung (`public/bilder/deko/karte-bietigheim.svg`; für Handys die hochkante Fassung `karte-bietigheim-hoch.svg`, gezeichnet von `scripts/karte-zeichnen.mjs`); die Knöpfe „Karte anzeigen“ und „Route planen“ sind schlichte Verweise, die Google Maps erst auf Klick in einem neuen Fenster öffnen.
- **Eine Datenbank.** Inhalte liegen als Dateien im Repo.

---

## Gestaltung (aus der Webflow-Vorlage abgeleitet)

### Farben

Ein einziger Grauton-Verlauf, abgestimmt auf das Aubergine: dieselbe
Farbfamilie, nur entsättigt und aufgehellt. Drei unabhängige Grautöne
nebeneinander wirkten unruhig, und das frühere `#758696` erreichte auf
Weiß nur 3,75:1 (Vorgabe: 4,5:1).

| Token | Wert | Verwendung |
|---|---|---|
| `--farbe-primaer` | `#6c1a51` | Aubergine — Hausfarbe, Überschriften, Akzente, Knöpfe |
| `--farbe-primaer-hell` | `#a3959f` | Abgetönte Variante, Hover-Zustände |
| `--farbe-text` | `#4d434b` | Fließtext — 9,5:1 auf Weiß |
| `--farbe-text-gedeckt` | `#766c74` | Zweitrangiges, Labels — 5,0:1 auf Weiß |
| `--farbe-text-leise` | `#c6bcc2` | Trennpunkte, Zähler — **nie für lesbaren Text** |
| `--farbe-linie` | `#e4e0e2` | Haarlinien, Kachelrahmen |
| `--farbe-linie-leise` | `#f0ecee` | Trennlinien in Listen |
| `--farbe-linie-zeile` | `#e9e4e7` | Zeilenlinien in den Sprechzeiten |
| `--farbe-formlinie` | `#d6ced2` | Grundlinie der Formularfelder |
| `--farbe-flaeche` | `#ffffff` | Hintergrund |
| `--farbe-flaeche-hell` | `#faf8f9` | Kaum getönte Kästen |
| `--farbe-flaeche-gedeckt` | `#f4f2f3` | Gedeckte Flächen |
| `--farbe-flaeche-kachel` | `#f1eef0` | Grund der Leistungskacheln beim Scrollen (Ablauf a-8) |

*Vorsicht:* Im Webflow-CSS existieren Beinahe-Duplikate (`#6b1a51`, `#6a2051`). Das sind Ungenauigkeiten der Vorlage — im Neubau gilt durchgängig `#6c1a51`.

**Der Saum um das Logo** ist ein Chromium-Artefakt beim Vergrößern des
20 × 10 px großen Verlauf-GIFs (Resampling-Filter über den Kasten
hinaus) und seit dem 27. September 2026 mit `clip-path: inset(0)` am
Verlauf abgestellt — nicht durch Verzicht auf Animationen. Wer am
Startbereich arbeitet, prüft mit Playwright in Chromium (siehe
`docs/entscheidungen.md`, „Der Saum — Ursache gefunden").

**Gewichte:** Überschriften kräftig — `--gewicht-titel: 580`, eine Spur
leichter als die 600/700 der alten Webflow-Seite und leichter als die
Labels (Florian, 26. September 2026; der leichte Schnitt 300 des
Handoffs ist zurückgenommen). Labels halbfett und gesperrt (600,
Versalien), Fließtext 400, Namen und Knöpfe 500, die große
Telefonnummer im Kontakt 300. Überschriften stehen **linksbündig** —
mittig stehen nur Startbereich und Hinweis. **Lesetexte im
linksbündigen Blocksatz mit Silbentrennung** (`global.css`, „Blocksatz";
Kundenwunsch, 26. September 2026, ausdrücklich auch auf Handys) —
Listen, Tabellen und Bedienelemente nicht. Die Trennstellen setzt der
Build (`src/lib/silben.ts`), nicht der Browser: Wer Text ausgibt, den
die Redaktion pflegt, zieht ihn durch `trennenHtml()` bzw. `trennen()`.

### Schrift

Die Vorlage nutzt **Myriad Pro** über Adobe Typekit. Typekit entfällt beim Umzug.

**Ersatz: Source Sans 3** — vom selben Schriftgestalter (Robert Slimbach), als freier Myriad-Ersatz entworfen, praktisch deckungsgleiche Proportionen, frei lizenziert (SIL OFL), selbst hostbar. Eine Schrift für die ganze Seite: Fließtext wie Überschriften.

**Myriad Pro selbst geht nicht.** Adobe liefert Web-Schriften ausschließlich von eigenen Servern (`use.typekit.net`) und verbietet das Selbsthosten; ein Creative-Cloud-Abo deckt Web-Einbettung nicht ab. Beides verträgt sich nicht mit der Grundregel, nichts von fremden Servern zu laden. Geprüft und verworfen am 15. September 2026.

Einbindung: selbst gehostet unter `public/fonts/` als variable Schrift (aufrecht und kursiv), `font-display: swap`, auf lateinische Zeichen beschränkt.

Das Token `--schrift-titel` gibt es weiterhin und zeigt auf `--schrift`. Wer den Überschriften später eine zweite Schrift geben will, ändert nur diese eine Zeile. Ein solcher Versuch mit **Poppins** lief vom 14. bis 15. September 2026 und wurde wieder zurückgenommen: geometrisch gebaut, führte es zu weit von der Vorlage weg.

### Design-Tokens

Alle Werte stehen in `src/styles/tokens.css`. **Keine Farbwerte, Schriftgrößen oder Abstände direkt in Komponenten schreiben** — immer über Tokens.

---

## Inhaltsmodell

Alle Inhalte liegen als JSON unter `src/content/`. Jede Datei entspricht einem Bereich, den die Praxis über `/login` pflegt.

| Datei | Inhalt | Besonderheit |
|---|---|---|
| `hinweis.json` | Hinweis-Sprechblase (Urlaub, Vertretung, Notfall) | Zeitgesteuert über `von`/`bis` — erscheint und verschwindet automatisch |
| `oeffnungszeiten.json` | 3 Listen: zahnärztlich, kieferorthopädisch, telefonisch | |
| `seitenaufbau.json` | Reihenfolge der Startseiten-Blöcke und ihre Menüpunkte | **Die Reihenfolge der Liste ist die der Seite und des Menüs** (kein `position`); Start, Sprechstunden und Fuß stehen fest und fehlen darin. Blockarten: `willkommen`, `galerie`, `leistungen`, `team`, `stellen`, `kontakt`, `bereich`, `verweis` |
| `bereiche.json` | Alle eigenen Bereiche: `seite` (eigene Adresse, Ankündigungskarte), `blog` (Beiträge, z. B. die Neuigkeiten), `abschnitt` (Inhalt direkt auf der Startseite) | `id` = Adresse, gesperrte Kennungen in `VERGEBEN` (`schema.ts`); Inhalt aus Abschnitten der Arten `text`, `kacheln`, `kapitel`, je mit bis zu drei Knöpfen |
| `leistungen.json` | Die Leistungen mit Icon, Titel, Kurztext, Rich-Text, Knöpfen — dazu die Kategorien mit Titel und Erklärtext | Kategorien: `zahnaerztlich`, `kieferorthopaedie`, `sonstige`; `id` = Adresse, **unveränderlich** |
| `team.json` | Personen mit Foto, Name, Funktion, Tätigkeiten | `gruppe`: `aerzte` oder `team`; `taetigkeiten` ist eine Liste und klappt auf der Seite auf |
| `galerie.json` | Praxisbilder | Alternativtexte sind **Pflicht** (Barrierefreiheit) |
| `stellen.json` | Stellenanzeigen | Bereich blendet sich aus, wenn leer |
| `startseite.json` | Überschriften und Einleitungstexte der Startseiten-Abschnitte | Ein Abschnitt je Bereich: `willkommen`, `sprechstunden`, `galerie`, `leistungen`, `team`, `kontakt`, `formular` |
| `seite.json` | Seitentitel, Beschreibung, Vorschaubild, Praxisadresse | |

Downloads (PDF, Word, Excel, PowerPoint, OpenOffice, RTF, Text, CSV, Bilder) hängen an Seiten und Beiträgen (`bereiche.json` → `dateien`) und an Stellen, oder sind Ziel eines Knopfs oder Textverweises; eine eigene `dokumente.json` gibt es nicht.

**Ziele** (Knöpfe, Menü-Unterpunkte, Verweise im Text) stehen als `/pfad/#marke`, `https://…`, `mailto:` oder `tel:`. Liegt das Ziel auf der aktuellen Seite, gleitet sie hin, sonst wechselt sie weich. Die gemeinsame Logik für Adressen, Sprungmarken und Menü steht in `src/lib/aufbau.ts`.

**Konventionen für alle Inhaltsdateien:**
- Jeder Eintrag hat `aktiv: true|false` — Ausblenden statt Löschen
- Jeder Eintrag hat `position: <Zahl>` für die Reihenfolge — außer in `seitenaufbau.json` und bei Abschnitten, Kacheln und Knöpfen: dort zählt die Reihenfolge der Liste
- Datumsangaben im Format `JJJJ-MM-TT`
- Bildpfade relativ zu `public/`, z. B. `/bilder/team/paul.jpg`
- Bei Änderungen am Schema: `src/content/schema.ts` mitziehen, sonst schlägt der Build fehl — das ist Absicht. Neue Felder außerdem in `src/admin/formulare.ts` (bzw. `felder.ts` für Abschnitte) eintragen, sonst sieht die Redaktion sie nicht

---

## Projektstruktur

```
src/
  content/      Die Inhalte (JSON) — das ist das "CMS"; schema.ts prüft sie
  components/   Wiederverwendbare Bausteine (eine Datei pro Abschnitt)
  layouts/      Seitenrahmen (Basis, Textseite, Redaktion)
  pages/        Seiten und Routen; pages/admin/ = Redaktionsoberfläche
  admin/        Die Redaktion: Seitenplan (plan.ts), Formulare je Block (formulare.ts, felder.ts), Ziel-Dialog, Texteditor
  server/       Gemeinsamer Code der Functions (GitHub-API, Access-Prüfung)
  lib/          Gemeinsame Logik: Seitenaufbau und Menü (aufbau.ts), Verweise, Textprüfung, Silbentrennung
  styles/       tokens.css (Gestaltungswerte) + globale Stile + Übergänge
  scripts/      Animationen, Übergänge, sanftes Scrollen, Bildlauf — ohne Bibliotheken
public/
  bilder/       Fotos (werden beim Build automatisch optimiert)
  dokumente/    Dateien zum Download
  icons/        Menü-Symbole (navigation/), Kachel-Symbole (symbole/), hochgeladene (eigene/)
  fonts/        Selbst gehostete Schriften
  lottie/       Lottie-Animationen (Logo, Menüknopf)
  _headers      Sicherheits-Header, _redirects: /login → /admin/
functions/      Cloudflare Pages Functions:
  _middleware.ts   Zugangsschutz (Cloudflare-Access-Token prüfen)
  api/alles.ts     liefert der Redaktion alle Inhalte samt Stand aus dem Repo
  api/save.ts      speichert alle Redaktionsänderungen als einen Commit
  api/hochladen.ts Bilder, Symbole und Dateien (Endung und Dateianfang geprüft, [skip ci])
  api/dateien.ts   listet Hochgeladenes zur Wiederverwendung
  api/kontakt.ts   nimmt das Kontaktformular entgegen (Resend)
scripts/        Prüf- und Vorbereitungsskripte für den Build (kleine Bildvarianten als `prebuild`, stand.json als `postbuild`,
                tote Verweise: pruefe-aufbau.mjs), redaktion-lokal.mjs (Redaktion ohne GitHub ausprobieren)
tests/          Playwright (nur Chromium): verhalten.mjs, redaktion.mjs, Vergleichsaufnahmen; einheiten.mjs = `npm test`
.github/workflows/veroeffentlichen.yml   Bauen und Aufspielen, täglich 03:00 UTC
docs/
  betrieb.md    Konten, Secrets, Wiederherstellen, Störungen
  anleitung/    Bedienung der Redaktion
  referenz/     Webflow-Export und Analyse — Vorlage, kein Produktivcode
```

---

## Die Seite im Überblick

**Startseite** (`/`) ist und bleibt ein One-Pager mit Ankern:

`#start` · `#oz_anchor` (Sprechstunden) · dann die Blöcke in der Reihenfolge von `seitenaufbau.json`: `#praxis` (Begrüßung) · `#galerie` · `#leistungen` (Kachelübersicht, Gruppen `#leistungen-<kategorie>`) · `#team` · `#stellen` · `#contact` · eigene Bereiche unter ihrer Kennung (`#neuigkeiten`, `#dentosophie`, Abschnitte als `#<bereich>-<abschnitt>`) · `#information` (Hinweis)

`#oz_anchor` ist die Einstiegskarte, die scrollgesteuert hereinfährt; sie steht nicht an einer festen Stelle im Dokument — `scripts/anker.ts` rechnet Marken in ihr in eine Scrolltiefe um (`tiefeInKarte`), statt sie zu messen. `#praxis` und `#galerie` folgen der Karte als gewöhnliche Abschnitte und werden normal gemessen.

**Unterseiten** — von der Startseite aus als Vollbild geöffnet, aber mit eigener Adresse:

| Adresse | Inhalt |
|---|---|
| `/leistungen/<id>` | 11 Leistungen, je eine Seite |
| `/<seite>/` | Eigene Seiten, z. B. `/dentosophie/` (Kapitel als `#mundatmung`) |
| `/<blog>/<id>` | Beiträge, z. B. `/neuigkeiten/<id>` |
| `/impressum`, `/datenschutz` | Rechtsseiten |
| `/admin/…` | Redaktion (nur angemeldet); `/login` leitet dorthin |

Die Leistungs-Adressen stehen fest und dürfen nicht mehr geändert werden:
`prophylaxe` · `zahnerhaltung` · `wurzelkanalbehandlung` · `parodontitis` · `zahnersatz` · `implantate` · `3d-roentgen` · `bleaching` · `intraoralscanner` · `kieferorthopaedie-kinder` · `kieferorthopaedie-erwachsene`

**Navigation** — folgt der Reihenfolge der Seite, Sprechstunden immer vorn (Oktober 2026): Sprechstunden · Praxis · Leistungen ▾ · Dentosophie ▾ · Neuigkeiten · Team · Kontakt · Telefon 07245 7171 (als Pille; auf Handys ein Hörer-Symbol, das die Nummer auf Tipp daneben ausklappt). Höchstens sieben Hauptpunkte. Die Symbolleiste unten zeigt dieselbe Folge, auf Handys nur Sprechstunden · Leistungen · Telefon; der Zipfel zeigt gespiegelt auf den Sprechstunden-Knopf.

Jeder Punkt mit Unterpunkten klappt als Blase aus der Punktlinie auf (erster Klick öffnet, zweiter springt; nie zwei offen). Unterpunkte entstehen von selbst — die Kategorien aus `leistungen.json`, Abschnitte mit „im Menü" — oder werden in der Redaktion angelegt; sie haben keine Symbole. Auf Handys öffnet das ganze Menü als dieselbe Blase — zum rechten Rand hin offen, mit Schleier über der Seite —, und ein Punkt mit Unterpunkten wechselt darin die Ebene: Die anderen Zeilen schließen sich, „‹Titel› – Übersicht" und die Unterpunkte wachsen darunter (`Navigation.astro`). Die Telefonnummer steht als Pille in der Kopfleiste, nicht im Menü; Datenschutz und Impressum nur im Fußbereich.

**Kontakt:** Rosenstraße 1, 76467 Bietigheim · Tel. 07245 7171 · Fax 07245 939269 · info@dres-nold.de

---

## Seitenwechsel: Vollbild statt neue Seite

Eine Leistung oder ein Beitrag soll sich beim Anklicken **ins Vollbild vergrößern** — wie in einer App, nicht wie ein Seitenwechsel.

Umgesetzt wird das mit der **View Transitions API**, nicht mit nachgeladenen Inhalten. Der entscheidende Unterschied:

| | Nachgeladenes Overlay | View Transitions (gewählt) |
|---|---|---|
| Eigene Adresse | nur nachgebildet | echt |
| Auffindbar bei Google | nein | ja — 11 zusätzliche Seiten |
| Ohne JavaScript | leer | funktioniert |
| Zurück-Taste | muss nachgebaut werden | funktioniert von selbst |
| Teilen und Drucken | unzuverlässig | zuverlässig |

Jede Leistung ist also **eine echte Seite**, die sich beim Öffnen aus ihrer Kachel heraus ins Vollbild morpht. Technisch geschieht das über zusammengehörige `view-transition-name`-Paare auf Kachel und Zielseite.

### Browser-Unterstützung

Astros `ClientRouter` lädt die Zielseite und tauscht den Inhalt **im selben Dokument** aus — dasselbe Prinzip, nach dem auch Barba.js arbeitet. Maßgeblich ist deshalb `Document.startViewTransition`, nicht die CSS-Variante `@view-transition`:

| Browser | Morph ab |
|---|---|
| Chrome / Edge | 111 (März 2023) |
| Safari / iOS | 18 (September 2024) |
| Firefox | 144 (Oktober 2025) |

Damit funktioniert der Übergang praktisch überall. Ein Zusatz-Fallback ist nicht nötig.

*Nicht verwechseln:* Die rein per CSS gesteuerte Variante `@view-transition` (ohne JavaScript, echter Dokumentwechsel) beherrscht Firefox noch nicht. Sie kommt hier nicht zum Einsatz.

**Regeln dafür:**
- In noch älteren Browsern wird schlicht die Seite gewechselt — kein Bruch, nur ohne Übergang
- Bei `prefers-reduced-motion` entfällt die Bewegung ersatzlos
- Die Zielseite muss vollständig und sinnvoll sein, auch wenn sie direkt aufgerufen wird
- Die Übergänge selbst stehen in `src/styles/uebergaenge.css` und sind frei anpassbar


---

## Die Hinweis-Sprechblase

Die wichtigste Funktion für die Praxis: eine weiße Karte in der Mitte des Fensters, dahinter die weichgezeichnete Seite unter einem Aubergine-Schleier. Zipfel und News-Symbol der Webflow-Vorlage sind seit dem 18. September 2026 weg — es gilt die schlichte Karte des Entwurfs.

**Verhalten:**
- Erscheint beim Öffnen der Seite, sofern `aktiv` gesetzt ist **und** das heutige Datum zwischen `von` und `bis` liegt
- Ein Urlaubshinweis verschwindet dadurch von selbst — niemand muss daran denken
- Wurde sie weggeklickt, bleibt sie für diesen Besuch fort (nur im Browser des Besuchers vermerkt, nichts wird übertragen)
- Ändert sich Titel oder Zeitraum, meldet sie sich erneut
- Schließen per Knopf, Klick auf den Hintergrund oder Escape-Taste; das Schließkreuz ist dasselbe wie in der Einstiegskarte (`.schliessen--fest`) und dreht sich beim Zeigen (aus `a-34`/`a-35`)
- Optional ein runder „mehr erfahren"-Knopf, wenn ein Ziel eingetragen ist

**Wichtig:** Die Auswertung geschieht beim Erzeugen der Seite. Damit sie am Stichtag umschaltet, baut der GitHub-Workflow die Seite jede Nacht um 03:00 UTC neu.

---

## Barrierefreiheit — verbindlich

Die Seite wird nach **WCAG 2.1 AA** gebaut. Bei jeder Änderung gilt:

- Alle Bilder mit sinnvollem Alternativtext (dekorative Bilder: `alt=""`)
- Vollständige Tastaturbedienung, Fokus muss immer sichtbar sein
- Kontrastverhältnis mindestens 4,5:1 für Text
- Semantisches HTML: `<nav>`, `<main>`, `<section>`, korrekte Überschriftenhierarchie ohne Sprünge
- Alle Animationen respektieren `prefers-reduced-motion`
- Formularfelder mit echtem `<label>`, Fehlermeldungen in Textform

---

## Entwicklung

```bash
npm install       # einmalig
npm run dev       # lokale Vorschau
npm run build     # Produktions-Build
npm run preview   # Build lokal prüfen
```

### Vor jedem Commit

1. `npm run build` läuft ohne Fehler und `npm test` ist grün
2. `npm run pruefen` meldet keine fremden Ressourcen und keine toten internen Verweise
   — bei Änderungen an Menü, Startseite oder Redaktion zusätzlich `node tests/verhalten.mjs` und `node tests/redaktion.mjs`
3. Optik gegen die Referenz in `docs/referenz/` geprüft
4. Tastaturbedienung des geänderten Bereichs getestet

---

## Für spätere Weiterentwicklung mit KI

Wenn Sie diese Seite mit einem KI-Assistenten erweitern wollen, geben Sie ihm diese Datei als Einstieg. Bewährtes Vorgehen:

1. **Beschreiben Sie das Ziel, nicht die Technik.** „Ich möchte, dass Patienten ein Formular für die Anmeldung herunterladen können" ist besser als „Bau einen Download-Button".
2. **Immer einen neuen Zweig anlegen**, nie direkt auf `main` arbeiten. So bleibt die laufende Seite unberührt, bis die Änderung geprüft ist.
3. **Vorschau prüfen, bevor veröffentlicht wird.** Cloudflare Pages erzeugt für jeden Zweig automatisch eine Testadresse.
4. **Die vier Grundregeln nennen:** keine externen Ressourcen nachladen, Farben und Schriften nur über Tokens, Barrierefreiheit einhalten, Inhalte gehören nach `src/content/`.
5. **Bei Unsicherheit nichts überschreiben.** Jede Änderung ist über den Verlauf im Repo wiederherstellbar — aber es ist einfacher, vorher zu fragen.

---

## Rechtliches

- **Keine Einwilligung mehr nötig — die Seite lädt nichts Fremdes.** Seit dem 18. September 2026 ist die Google-Karte nicht mehr eingebettet: Der Kontaktbereich liegt auf einer selbst gehosteten, stilisierten Karte aus OpenStreetMap-Daten (`public/bilder/deko/karte-bietigheim.svg`; die ODbL verlangt den Vermerk „© OpenStreetMap-Mitwirkende", er steht unten rechts an der Karte), und „Karte anzeigen" / „Route planen" sind Verweise, die Google Maps in einem neuen Fenster öffnen (`src/components/Kontakt.astro`). Damit entfällt der letzte Grund für eine Einwilligung. `src/scripts/einwilligung.ts` und der Widerrufsknopf im Fußbereich sind am 26. September 2026 entfernt worden (siehe `docs/entscheidungen.md`). **Die Datenschutzerklärung muss entsprechend angepasst werden.** Jede neue Fremdressource müsste erst wieder einen solchen Weg bekommen — oder besser: weggelassen werden.
- **Impressum und Datenschutzerklärung sind getrennte Seiten** (in der Webflow-Version zeigten beide Footer-Links auf `/datenschutz`).
- **Das Kontaktformular fragt bewusst keine Gesundheitsdaten ab.** Das darf sich nicht ändern — für Gesundheitsangaben wäre eine erheblich aufwendigere Absicherung nötig.
- **Kein Pflicht-Häkchen unter dem Formular.** Die Angaben werden verarbeitet, um die Anfrage zu beantworten; Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw. f DSGVO, nicht eine Einwilligung. Art. 13 verlangt an dieser Stelle **Information**, keine Zustimmung — deshalb steht dort ein Hinweis mit Verweis auf die Datenschutzerklärung (18. September 2026). Eine Einwilligung wäre sogar die schlechtere Grundlage, weil sie jederzeit widerrufbar ist.
- Cloudflare-AV-Vertrag ist im Konto der Praxis abzuschließen; Resend-Konto mit EU-Region anlegen.
- Impressum und Datenschutzerklärung sind Entwürfe — vor der Freigabe von der Praxis bzw. ihrem Datenschutzbeauftragten prüfen lassen.

---

## Betrieb und Wartung

**Laufende Kosten:** Hosting 0 €, Redaktionsbereich 0 €, Analytics 0 €, Domain ~15–20 €/Jahr.

**Was regelmäßig zu tun ist** (ausführlich in `docs/betrieb.md`):
- Alle paar Monate die Abhängigkeits-Aktualisierungen einspielen, die GitHub automatisch vorschlägt
- Jährlich das GitHub-Zugriffs-Token in den Cloudflare-Einstellungen erneuern

**Bei einem Domain- oder DNS-Eingriff:** Die MX-Einträge für E-Mail müssen unverändert bleiben, sonst ist die Praxis-E-Mail nicht mehr erreichbar. Vor jeder Änderung die bestehenden Einträge sichern.
