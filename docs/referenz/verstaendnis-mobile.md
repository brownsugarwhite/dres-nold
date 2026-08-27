# Wie die Seite wirklich funktioniert — beobachtet, nicht abgeleitet

Aufgenommen am 27.08.2026 in echter Geräte-Emulation (375 × 812) und am
Desktop. Ersetzt alle früheren Annahmen aus CSS-Werten.

## Öffnungszeiten (der Kern)

**Form:** Weiße Blase mit **gepunkteter Umrandung**, daran ein **langer,
spitz zulaufender Zipfel nach unten**, der auf den Öffnungszeiten-Knopf
der unteren Leiste zeigt. Kein kleines Dreieck — ein schlanker Dorn, der
fast so lang ist wie ein Drittel der Blasenhöhe.

Blasenkontur und Zipfel stammen beide aus `oeffnungszeiten-mobil.json`.
Die Texte liegen als eigene Ebene darüber.

**Bewegung** — gemessen über den 300vh-Scrollbereich:

| Scrollweg | Blase steht bei | Tempo |
|---|---|---|
| 0 – 20 % | 700 → 682 px | fast Stillstand |
| 20 – 35 % | 682 → 483 px | 13 px je Prozent |
| 35 – 50 % | 483 → 150 px | **22 px je Prozent — schnellste Phase** |
| 50 – 60 % | 150 → 22 px | 13 px je Prozent |
| 60 – 70 % | 22 → 0 px | 2 px je Prozent — rollt sanft aus |
| ab 70 % | steht | |

Das ist **eine durchgehende weiche S-Kurve**, keine geraden Abschnitte
mit Knick. Langsam an, schnell durch die Mitte, sanft aus.

**Inhalt:** Drei Listen **untereinander**. Wochentage rechtsbündig,
Zeiten linksbündig daneben. Alles in Aubergine.
`...und nach Vereinbarung` steht **nur** bei der Kieferorthopädie.

Schließkreuz oben rechts, **außerhalb** der Blase.

## Mobile ist strukturell anders als Desktop

| | Mobile | Desktop |
|---|---|---|
| Untere Leiste | **3** Knöpfe: Kontakt · Telefonnummer · Öffnungszeiten | **5**: Öffnungszeiten · Kontakt · Praxis · Leistungen · Team |
| Kontaktzeile oben | ohne Telefonnummer | mit Telefonnummer |
| Kopfleiste beim Scrollen | Logo + Hamburger-Knopf | Logo · Praxis · Leistungen · Team · Kontakt |

## Abschnittsfolge (bisher unvollständig erfasst)

1. Startbereich: Logo mit Verlauf, Scroll-Hinweis
2. **Öffnungszeiten-Blase** (schnalzt herein)
3. **Überschrift „Willkommen in unserer Praxis Dres. Nold"**
4. **Galerie** — drei Praxisfotos nebeneinander, mit Blätterpunkten
5. Leistungen: „Hier erhalten Sie eine Übersicht unserer Leistungen“
   mit „Klicken Sie auf eines der Symbole, um mehr zu erfahren.“
6. Team · Kontakt

Punkte 3 und 4 fehlten im bisherigen Nachbau vollständig.

## Hinweis-Blase (Urlaub)

Mobil: Zipfel zeigt nach **links**, Schließkreuz **außerhalb** oben
rechts. Nicht wie bisher gebaut.
