# dres-nold.de

Website der Zahnarzt- und Kieferorthopädie-Praxis **Dres. Nold**, Bietigheim.

Ablösung der bisherigen Webflow-Seite durch einen eigenen Nachbau — optisch identisch, technisch neu, kostenfrei zu betreiben und von der Praxis selbst zu pflegen.

## Schnellstart

```bash
npm install
npm run dev
```

Die Seite läuft dann unter `http://localhost:4321`.

## Inhalte pflegen

Die Praxis pflegt alle Inhalte über die Redaktionsoberfläche unter **dres-nold.de/login** — dafür sind keine technischen Kenntnisse nötig. Die dort gemachten Änderungen landen als Dateien unter `src/content/` und sind damit automatisch versioniert.

Die Anleitung liegt unter [docs/anleitung/redaktion.md](docs/anleitung/redaktion.md), alles zum Betrieb (Konten, Zugänge, Störungen) unter [docs/betrieb.md](docs/betrieb.md).

## Für Entwicklung und KI-Unterstützung

**[CLAUDE.md](CLAUDE.md)** enthält den vollständigen technischen Kontext: Aufbau, Gestaltungswerte, Inhaltsmodell, Konventionen und die verbindlichen Grundregeln. Diese Datei ist der Einstiegspunkt für jede Weiterarbeit.

## Aufbau in Kürze

| | |
|---|---|
| Seitengenerator | Astro (statisches HTML) |
| Hosting | Cloudflare Pages |
| Redaktions-Login | Cloudflare Access (E-Mail-Einmalcode) |
| Veröffentlichen | GitHub Actions, bei jeder Änderung und täglich um 03:00 UTC |
| Kontaktformular | Resend (E-Mail-Versand) |
| Laufende Kosten | Hosting 0 €, nur die Domain |

Die Seite lädt **keine externen Ressourcen** — einzige Ausnahme ist die Google-Maps-Karte im Kontakt, die erst nach Einwilligung geladen wird. Bitte bei jeder Erweiterung beibehalten.
