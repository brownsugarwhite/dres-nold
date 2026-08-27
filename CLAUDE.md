# dres-nold.de

Website der Zahnarzt- und Kieferorthopädie-Praxis **Dres. Nold**, Rosenstraße 1, 76467 Bietigheim.

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
| Analytics | **Cloudflare Web Analytics** | Cookielos → **kein Cookie-Banner nötig** |

### Was bewusst NICHT verwendet wird

- **jQuery, Swiper, Font Awesome, Adobe Typekit** — die vier Fremd-Abhängigkeiten der Webflow-Seite. Alles wird selbst gehostet bzw. neu gebaut.
- **Google Analytics** — erfordert bei einer Arztpraxis ein Einwilligungs-Banner (§ 25 TDDDG) und ist datenschutzrechtlich heikel, weil Seitenaufrufe Rückschlüsse auf Gesundheitsthemen zulassen. Nachrüstbar, aber nur auf ausdrücklichen Wunsch der Praxis.
- **Externe Ressourcen jeder Art.** Die Seite darf nichts von fremden Servern nachladen. Das ist die Grundlage dafür, dass kein Cookie-Banner nötig ist. **Vor jedem Merge prüfen.**
- **Eine Datenbank.** Inhalte liegen als Dateien im Repo.

---

## Gestaltung (aus der Webflow-Vorlage abgeleitet)

### Farben

| Token | Wert | Verwendung |
|---|---|---|
| `--farbe-primaer` | `#6c1a51` | Aubergine — Hausfarbe, Überschriften, Akzente, Buttons |
| `--farbe-primaer-hell` | `#a3959f` | Abgetönte Variante, Hover-Zustände |
| `--farbe-text` | `#5c5e61` | Fließtext |
| `--farbe-text-gedeckt` | `#758696` | Sekundärtext, Bildunterschriften |
| `--farbe-dunkel` | `#554d53` | Dunkle Flächen |
| `--farbe-weiss` | `#ffffff` | Hintergrund |

*Vorsicht:* Im Webflow-CSS existieren Beinahe-Duplikate (`#6b1a51`, `#6a2051`). Das sind Ungenauigkeiten der Vorlage — im Neubau gilt durchgängig `#6c1a51`.

### Schrift

Die Vorlage nutzt **Myriad Pro** über Adobe Typekit. Typekit entfällt beim Umzug.

**Ersatz: Source Sans 3** — vom selben Schriftgestalter (Robert Slimbach), praktisch deckungsgleiche Proportionen, frei lizenziert (SIL OFL), selbst hostbar. Falls eine Myriad-Pro-Lizenz vorliegt, kann diese stattdessen als WOFF2 eingebunden werden.

Einbindung: selbst gehostet unter `public/fonts/`, `font-display: swap`, nur die tatsächlich benötigten Schnitte.

### Design-Tokens

Alle Werte stehen in `src/styles/tokens.css`. **Keine Farbwerte, Schriftgrößen oder Abstände direkt in Komponenten schreiben** — immer über Tokens.

---

## Inhaltsmodell

Alle Inhalte liegen als JSON unter `src/content/`. Jede Datei entspricht einem Bereich, den die Praxis über `/login` pflegt.

| Datei | Inhalt | Besonderheit |
|---|---|---|
| `hinweis.json` | Notfall-/Vertretungshinweis | Zeitgesteuert: `von`/`bis` — erscheint und verschwindet automatisch |
| `oeffnungszeiten.json` | 3 Listen: zahnärztlich, kieferorthopädisch, telefonisch | |
| `leistungen.json` | 11 Leistungen mit Icon, Titel, Kurztext, Rich-Text | Kategorie `zahnmedizin` oder `kieferorthopaedie`; `id` = Adresse, **unveränderlich** |
| `neuigkeiten.json` | Beiträge mit Datum, Bild, Text, PDF-Anhängen | `id` = Adresse; Text erlaubt Absätze, Aufzählungen, Tabellen |
| `navigation.json` | Menüpunkte und Reihenfolge | Leistungen klappen automatisch auf |
| `team.json` | 15 Personen mit Foto, Name, Funktion | `gruppe`: `aerzte` oder `team`; Sortierung über `position` |
| `galerie.json` | Praxisbilder | Alternativtexte sind **Pflicht** (Barrierefreiheit) |
| `abschnitte.json` | Frei anlegbare Abschnitte im Praxis-Bereich | Ohne eigenen Menüeintrag; Bild, Link *oder* PDF-Download |
| `stellen.json` | Stellenanzeigen | Bereich blendet sich aus, wenn leer |
| `dokumente.json` | PDF-Downloads | |
| `seite.json` | Seitentitel, Beschreibung, Vorschaubild | |

**Konventionen für alle Inhaltsdateien:**
- Jeder Eintrag hat `aktiv: true|false` — Ausblenden statt Löschen
- Jeder Eintrag hat `position: <Zahl>` für die Reihenfolge
- Datumsangaben im Format `JJJJ-MM-TT`
- Bildpfade relativ zu `public/`, z. B. `/bilder/team/paul.jpg`
- Bei Änderungen am Schema: `src/content/schema.ts` mitziehen, sonst schlägt der Build fehl — das ist Absicht

---

## Projektstruktur

```
src/
  content/      Die Inhalte (JSON) — das ist das "CMS"
  components/   Wiederverwendbare Bausteine (eine Datei pro Abschnitt)
  layouts/      Seitenrahmen
  pages/        Seiten und Routen; pages/admin/ = Redaktionsoberfläche
  styles/       tokens.css (Gestaltungswerte) + globale Stile
  scripts/      Animationen, Slider — bewusst wenig und ohne Bibliotheken
public/
  bilder/       Fotos (werden beim Build automatisch optimiert)
  dokumente/    PDFs zum Download
  fonts/        Selbst gehostete Schriften
  lottie/       Die 3 Lottie-Animationen
functions/api/  Cloudflare Pages Functions:
                  save.ts    speichert Redaktionsänderungen ins Repo
                  kontakt.ts nimmt das Kontaktformular entgegen
docs/
  referenz/     Webflow-Export und Analyse — Vorlage, kein Produktivcode
```

---

## Die Seite im Überblick

**Startseite** (`/`) ist und bleibt ein One-Pager mit Ankern:

`#start` · `#oz_anchor` (Öffnungszeiten) · `#galerie` · `#information` (Hinweis) · `#praxis` · `#leistungen` (Kachelübersicht) · `#team` · `#neuigkeiten` · `#contact`

**Unterseiten** — von der Startseite aus als Vollbild geöffnet, aber mit eigener Adresse:

| Adresse | Inhalt |
|---|---|
| `/leistungen/<id>` | 11 Leistungen, je eine Seite |
| `/neuigkeiten/<id>` | Beiträge |
| `/impressum`, `/datenschutz` | Rechtsseiten |

Die Leistungs-Adressen stehen fest und dürfen nicht mehr geändert werden:
`prophylaxe` · `zahnerhaltung` · `wurzelkanalbehandlung` · `parodontitis` · `zahnersatz` · `implantate` · `3d-roentgen` · `bleaching` · `intraoralscanner` · `kieferorthopaedie-kinder` · `kieferorthopaedie-erwachsene`

**Navigation:** Praxis · Leistungen ▾ · Team · Neuigkeiten · Kontakt · Öffnungszeiten · Telefon 07245 7171

Der Punkt *Leistungen* klappt zweispaltig auf — links Zahnmedizin (9), rechts Kieferorthopädie (2), jeweils mit Symbol. Die Einträge kommen automatisch aus `leistungen.json`.

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

1. `npm run build` läuft ohne Fehler
2. Keine externen URLs im Ausgabe-HTML (`grep -rE "https?://(?!www\.dres-nold\.de)" dist/` sollte nur Links in Texten finden)
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

- **Kein Cookie-Banner nötig**, solange keine externen Ressourcen geladen werden und Analytics cookielos bleibt. Diese Bedingung bei jeder Erweiterung prüfen.
- **Impressum und Datenschutzerklärung sind getrennte Seiten** (in der Webflow-Version zeigten beide Footer-Links auf `/datenschutz`).
- **Das Kontaktformular fragt bewusst keine Gesundheitsdaten ab.** Das darf sich nicht ändern — für Gesundheitsangaben wäre eine erheblich aufwendigere Absicherung nötig.
- Cloudflare-AV-Vertrag ist im Konto der Praxis abzuschließen.

---

## Betrieb und Wartung

**Laufende Kosten:** Hosting 0 €, Redaktionsbereich 0 €, Analytics 0 €, Domain ~15–20 €/Jahr.

**Was regelmäßig zu tun ist:**
- Alle paar Monate die Abhängigkeits-Aktualisierungen einspielen, die GitHub automatisch vorschlägt
- Alle 1–2 Jahre das GitHub-Zugriffs-Token in den Cloudflare-Einstellungen erneuern

**Bei einem Domain- oder DNS-Eingriff:** Die MX-Einträge für E-Mail müssen unverändert bleiben, sonst ist die Praxis-E-Mail nicht mehr erreichbar. Vor jeder Änderung die bestehenden Einträge sichern.
