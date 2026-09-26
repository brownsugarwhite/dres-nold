# Anleitung: Inhalte pflegen

## Anmelden

1. **dres-nold.de/login** aufrufen.
2. E-Mail-Adresse eingeben (eine der freigeschalteten Praxis-Adressen).
3. Den Zahlencode aus der E-Mail eintippen. Fertig — kein Passwort.

Die Anmeldung gilt 24 Stunden. „Abmelden" steht oben rechts.

## Die Übersicht

Ein Kasten je Bereich. Anklicken öffnet das Formular mit dem aktuellen
Stand. Unten steht immer **Speichern und veröffentlichen** — erst damit
geht etwas online, etwa eine Minute später.

| Bereich | Das ändern Sie dort |
|---|---|
| Hinweis | Urlaubs-, Vertretungs- oder Notfallhinweis mit Zeitraum. Erscheint und verschwindet von selbst. |
| Sprechstunden | Die drei Listen in der Sprechstunden-Blase. |
| Neuigkeiten | Beiträge mit Bild, Text, PDF-Anhängen. |
| Leistungen | Text und Kurztext jeder Leistung. |
| Team | Personen, Fotos, Funktion, Tätigkeiten. |
| Praxisbilder | Das durchlaufende Bildband. |
| Eigene Abschnitte | Zusätzliche Texte im Praxis-Bereich. |
| Stellenanzeigen | Offene Stellen; leer = Bereich unsichtbar. |
| Angaben für Google und Kontakt | Seitentitel, Beschreibung, Adresse, Telefon. |
| Menü | Beschriftungen der Menüpunkte. |

## Einträge (Personen, Beiträge, Leistungen …)

- **Aufklappen:** auf den Namen des Eintrags klicken.
- **Reihenfolge:** „▲ nach oben" / „▼ nach unten".
- **Ausblenden statt löschen:** „Auf der Seite zeigen" ausschalten. Der
  Eintrag bleibt erhalten — praktisch, wenn jemand zurückkommt.
- **Neu:** „+ Neuer Eintrag". Die Kennung wird aus dem Titel gebildet
  und ist danach fest (sie steht in der Adresse).

## Bilder und PDFs

„Hochladen …" neben dem Feld. Erlaubt: JPG, PNG, WebP (bis 8 MB) und PDF
(bis 15 MB). Danach **Speichern** nicht vergessen. Bilder werden beim
Bauen der Seite automatisch verkleinert und optimiert.

**Symbole** (bei Leistungen, Bereichen und Menüpunkten) dürfen zusätzlich
SVG sein (bis 512 KB) — das ist sogar die beste Wahl, weil sie in jeder
Größe scharf bleiben. Eine SVG mit Skripten oder Verweisen auf fremde
Server wird abgelehnt; ein normaler Export aus Illustrator oder Figma
enthält so etwas nicht.

Bitte jedes Bild kurz beschreiben („Bildbeschreibung") — das lesen
blinde Besucher vor, und Google versteht die Seite besser.

## Text mit Gestaltung

Bei „Text"-Feldern gibt es eine kleine Leiste: Absatz, Zwischentitel,
Fett, Kursiv, Listen, Verweis, Tabelle. Alles andere (Farben,
Schriftarten) ist mit Absicht nicht vorgesehen — die Seite bleibt so
einheitlich.

**Text aus Word oder von einer Webseite einfügen** geht ganz normal mit
Strg+V (Mac: Cmd+V). Dabei kommt nur der Aufbau mit: Absätze, Listen,
Verweise und Tabellen. Fett, Kursiv, Schriftart und Farbe der Quelle
bleiben draußen — sonst schleppte jeder eingefügte Text die Gestaltung
von woanders mit herein. Was hervorgehoben sein soll, markieren Sie
danach und drücken **Fett**.

Steht eine Zeile versehentlich als Zwischentitel da: hineinklicken und
**Absatz** drücken. **Format löschen** nimmt Hervorhebungen innerhalb
einer Zeile wieder weg.

## Eigene Abschnitte

Ein Abschnitt hat eine Überschrift und darunter einen oder mehrere
**Bereiche** — je ein Bild neben einem Text (ohne Bild steht der Text
allein auf Lesebreite). Mehrere Bereiche stehen untereinander.

## Knöpfe unter einem Text

Bei den eigenen Abschnitten und bei jeder Leistung können am Ende des
Textes bis zu zwei Knöpfe stehen:

- **Verweis** — Beschriftung und Adresse. Eine vollständige Adresse
  (`https://…`) oder eine Sprungmarke der Startseite wie `#contact` oder
  `#leistungen-kieferorthopaedie`; Sprungmarken funktionieren auch von
  einer Leistungsseite aus.
- **PDF-Knopf** — Beschriftung und Datei (Hochladen wie oben).

Der **Satz über den Knöpfen** ist eine einzelne Zeile direkt darüber
(„Mehr dazu erfahren Sie hier:“). Er erscheint nur, wenn mindestens ein
Knopf eingetragen ist. Ohne Knöpfe bleibt alles leer — dann steht dort
nichts.

## Der Urlaubshinweis, Schritt für Schritt

1. Bereich **Hinweis** öffnen.
2. Überschrift und Text eintragen.
3. **Sichtbar ab** und **Sichtbar bis** setzen.
4. **Hinweis eingeschaltet** anhaken, speichern.

Am ersten Tag erscheint die Blase von selbst, am Tag nach dem Enddatum
ist sie weg. Die Daten für das nächste Jahr können jederzeit schon
eingetragen werden.

## Wenn eine Meldung kommt

- **„Nicht gespeichert. Bitte prüfen: …"** — darunter steht, welches
  Feld fehlt oder falsch ist (z. B. eine Bildbeschreibung). Korrigieren,
  erneut speichern.
- **„… von jemand anderem geändert"** — jemand hat zwischenzeitlich
  gespeichert. Seite neu laden und die Änderung noch einmal machen.
- **„Anmeldung erforderlich"** — die Sitzung ist abgelaufen; über
  `/login` erneut anmelden.

Nichts, was hier passiert, kann die Seite kaputt machen: Fehlerhafte
Eingaben werden gar nicht erst gespeichert, und jeder gespeicherte Stand
lässt sich wiederherstellen (siehe `docs/betrieb.md`).
