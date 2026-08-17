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

Eine bebilderte Anleitung liegt unter `docs/anleitung/`.

## Für Entwicklung und KI-Unterstützung

**[CLAUDE.md](CLAUDE.md)** enthält den vollständigen technischen Kontext: Aufbau, Gestaltungswerte, Inhaltsmodell, Konventionen und die verbindlichen Grundregeln. Diese Datei ist der Einstiegspunkt für jede Weiterarbeit.

## Aufbau in Kürze

| | |
|---|---|
| Seitengenerator | Astro (statisches HTML) |
| Hosting | Cloudflare Pages |
| Redaktions-Login | Cloudflare Access (E-Mail-Einmalcode) |
| Analytics | Cloudflare Web Analytics (cookielos) |
| Laufende Kosten | Hosting 0 €, nur die Domain |

Die Seite lädt **keinerlei externe Ressourcen** — das ist die Grundlage dafür, dass kein Cookie-Banner nötig ist. Bitte bei jeder Erweiterung beibehalten.
