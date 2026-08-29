# Erfassung der Originalseite

Beobachtet am 29.08.2026 in Chrome, Fenster 1497 × 842.
**Grundlage: was im Bild zu sehen ist** — nicht abgeleitet aus CSS-Werten.

---

## Abschnitt 1 — Startbereich

**Hintergrund: weiß.** (Der graue Symbolgrund `.fixedbg` liegt darunter,
wird aber von der weißen Fläche `.start_space` verdeckt und ist hier
nicht sichtbar.)

| Element | Größe | Position |
|---|---|---|
| Logo | 421 × 337 | 506, 168 |
| Scroll-Hinweis | 250 × 70 | 616, 504 |
| Kontaktzeile oben | 1482 × 40 | 0, 0 |
| Kopfleiste | Höhe 0 (eingefahren) | 0, 40 |
| Symbolleiste unten | 1482 × 110 | 0, 732 |

**Das Logo erscheint über eine Ladeanimation** (`a-24`, ausgelöst durch
PAGE_FINISH). Vor deren Ende ist an der Stelle nichts zu sehen. Die
Animation läuft rund 5 Sekunden.

Die Schrift „Dres. Nold" trägt den bewegten Verlauf, der Zahn ist
hellgrau. **Kein weißer Kasten, kein Farbstreifen** um das Logo —
die Schrift steht frei auf Weiß.

Kontaktzeile: Rosenstraße 1 · 76467 Bietigheim · 07245 7171 · info@dres-nold.de
Symbolleiste: Öffnungszeiten · Kontakt · Praxis · Leistungen · Team

---

## Abschnitt 2 — Öffnungszeiten

**Zwei völlig verschiedene Umsetzungen je nach Bildschirmgröße.**
Beide sind im Ruhezustand `display: none`.

### Desktop — per Klick, zwei versetzte Kästen

Der Knopf „Öffnungszeiten" in der unteren Leiste hat `href="#"`, ist also
ein reiner Auslöser, **kein Anker**. Beim Klick fährt `.oz-desktop` von
links herein (700 ms, outCubic — Ablauf `a-32`).

| Kasten | Größe | Position | Inhalt |
|---|---|---|---|
| Große Box | 600 × 500 | 353, 232 | Zahnärztliche + Kieferorthopädische Sprechstunde |
| Telefon-Box | 500 × 372 | 666, 414 | Telefonische Erreichbarkeit |

Die beiden Kästen **überlappen sich versetzt** — die Telefon-Box liegt
rechts unterhalb und ragt über die große Box hinaus. Beide haben einen
**gepunkteten Rand** und eine ausgestellte Ecke. Schließkreuz oben rechts
an der großen Box.

Es gibt **keinen Öffnungszeiten-Abschnitt im Scrollfluss** auf dem
Desktop. Beim Durchscrollen erscheint dort nichts.

### Mobil — scrollgesteuerte Blase mit Zipfel

Nur unterhalb des Umbruchpunkts aktiv. 300vh Scrollraum, Blase fährt
von unten herein, Lottie-Zipfel wächst und zieht sich wieder ein.
Werte siehe `verstaendnis-mobile.md`.

### Was im bisherigen Nachbau falsch ist

- Die scrollgesteuerte Blase läuft bei uns auf **allen** Größen
- Auf dem Desktop müssten es **zwei versetzte Kästen per Klick** sein
- Der Knopf ist bei uns ein Anker statt eines Auslösers
- Die Kopplung des Menüwechsels an den Öffnungszeiten-Bereich gilt nur mobil

---

## Abschnitt 3 — Willkommen

Überschrift „Willkommen in unserer Praxis Dres. Nold", zentriert, zwei
Zeilen, mit bewegtem Verlauf. Steht auf weißem Grund.

## Abschnitt 4 — Galerie

Durchlaufendes Bildband, drei Bilder gleichzeitig sichtbar, volle
Fensterbreite, ohne Abstand zwischen den Bildern. Die untere Leiste liegt
mit Weichzeichner darüber — die Bilder scheinen durch.

---

## Abschnitt 5 — Leistungen

Überschrift „Hier erhalten Sie eine Übersicht unserer Leistungen",
darunter „Klicken Sie auf eines der Symbole, um mehr zu erfahren."

**Kein Kachelraster, sondern eine aufklappbare Liste:**
Je Zeile ein Symbol links, der Titel daneben, ein Pfeil nach unten rechts.
Um den Listenbereich stehen **Eckwinkel** als Rahmenandeutung (kleine
Winkel oben/unten links und rechts). Die Symbole sind unterschiedlich
groß und leicht gegeneinander versetzt — sie wandern beim Scrollen
(Ablauf `a-8`).

Hintergrund weiß bis leicht grau.

## Abschnitt 6 — Team

Großes Gruppenfoto über die volle Fensterbreite. Darüber die Überschrift
**„Wir freuen uns auf Sie" in Weiß**, groß, mittig auf dem Bild.
Darunter folgen die Porträts der einzelnen Personen.

## Abschnitt 7 — Kontakt

**Kein Briefumschlag.** (Der gehörte zu einem früheren, provisorischen
Neuigkeiten-Bereich und entfällt.)

Überschrift „So erreichen Sie uns" mit Verlauf, zentriert.

Darunter zweispaltig, mittig gruppiert:

| links (rechtsbündig) | rechts (linksbündig) |
|---|---|
| **Praxis Dres. Nold** | Telefon 07245 7171 |
| Rosenstraße 1 | Fax 07245 939269 |
| 76467 Bietigheim | **info@dres-nold.de** |

Darunter ein **Kartenausschnitt** (Google Maps) mit der Beschriftung
„Zu Google Maps" oben links, etwa 875 × 325 px, mittig.

**Hier ist der graue Symbolgrund sichtbar** — der Zahnmuster-Hintergrund
liegt hinter dem gesamten Kontaktbereich.

## Abschnitt 8 — Fußbereich

Ein Verweis „Datenschutz & Impressum".

---

# Was im bisherigen Nachbau nicht stimmt

| Bereich | Vorlage | Nachbau |
|---|---|---|
| Logo | erscheint über Ladeanimation `a-24` | steht sofort da |
| Öffnungszeiten Desktop | zwei versetzte Kästen, per Klick | scrollgesteuerte Blase |
| Öffnungszeiten-Knopf | Auslöser (`href="#"`) | Anker auf `#oz_anchor` |
| Leistungen | aufklappbare Liste mit Eckwinkeln | Kachelraster |
| Team | Gruppenfoto mit weißer Überschrift darauf | schlichte Porträtreihe |
| Kontakt | Adresse zweispaltig + Kartenausschnitt | fehlt ganz |
| Grauer Grund | sichtbar im Kontaktbereich | nur unterhalb der Öffnungszeiten |
| Fußbereich | „Datenschutz & Impressum" | fehlt |
