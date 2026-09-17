# Betrieb der Seite

Für alle, die die Seite betreuen — die Praxis oder wer ihr hilft.
Technische Vorkenntnisse sind nicht nötig; wo Befehle stehen, sind sie
zum Kopieren gedacht.

## Die Bausteine

| Baustein | Konto | Wofür |
|---|---|---|
| **GitHub** (`github.com/brownsugarwhite/dres-nold`) | Florian, später Praxis | Speichert Code und Inhalte. Jede Änderung ist ein Eintrag im Verlauf und lässt sich wiederherstellen. |
| **Cloudflare Pages** (Projekt `dres-nold`) | Praxis | Baut die Seite und liefert sie aus. Kostenlos. |
| **Cloudflare Access** (Zero Trust) | dasselbe Konto | Die Anmeldung unter `/login` per E-Mail-Code. Kostenlos bis 50 Personen. |
| **Cloudflare DNS** | dasselbe Konto | Verwaltet die Domain `dres-nold.de`. **MX-Einträge nie anfassen** — sonst kommt keine Praxis-E-Mail mehr an. |
| **Resend** | Praxis | Versendet die Nachrichten aus dem Kontaktformular an info@dres-nold.de. Kostenlos bis 3 000 im Monat. |

## Wie eine Änderung online geht

1. Anmelden unter **dres-nold.de/login** (E-Mail-Adresse, Code aus der E-Mail).
2. Bereich wählen, ändern, **Speichern und veröffentlichen**.
3. Das Speichern legt einen Eintrag im GitHub-Verlauf an („Redaktion: … geändert").
4. GitHub baut die Seite neu und spielt sie auf Cloudflare auf (Workflow
   „Veröffentlichen", etwa eine Minute).

Außerdem baut GitHub die Seite **jede Nacht um 03:00 UTC** neu — nur so
schaltet die Hinweis-Blase am Stichtag um.

## Zugangsdaten, die es gibt

Alle liegen als „Secrets" in den jeweiligen Konten, nirgends im Code.

| Wo | Name | Was |
|---|---|---|
| GitHub → Settings → Secrets → Actions | `CLOUDFLARE_API_TOKEN` | erlaubt dem Workflow das Aufspielen |
| GitHub → Settings → Secrets → Actions | `CLOUDFLARE_ACCOUNT_ID` | Konto-Kennung |
| Cloudflare Pages → Settings → Variables and Secrets | `GITHUB_TOKEN` | erlaubt der Redaktion das Speichern ins Repo (**alle 1–2 Jahre erneuern**, siehe unten) |
| Cloudflare Pages → Settings → Variables and Secrets | `RESEND_API_KEY` | Versand des Kontaktformulars |
| Cloudflare Pages → Settings → Variables and Secrets | `ACCESS_AUD` | Kennung der Access-Anwendung (Zero Trust → Access → Applications → „Redaktion dres-nold" → Overview → Application Audience Tag) |
| Cloudflare Pages → Settings → Variables and Secrets | `ACCESS_TEAM`, `GITHUB_REPO`, `GITHUB_BRANCH`, `KONTAKT_EMPFAENGER`, `KONTAKT_ABSENDER` | schlichte Einstellungen, stehen auch in `wrangler.toml` |

### GitHub-Token erneuern

Das Token läuft nach höchstens einem Jahr ab (GitHub erlaubt nicht mehr).
Dann funktioniert das Speichern in der Redaktion nicht mehr — die Seite
selbst läuft weiter.

1. GitHub → Settings → Developer settings → Personal access tokens →
   **Fine-grained tokens** → Generate new token
2. Repository access: **Only select repositories** → `dres-nold`
3. Permissions → Repository permissions → **Contents: Read and write**
4. Token kopieren, in Cloudflare Pages als Secret `GITHUB_TOKEN` einsetzen
   (oder im Terminal: `npx wrangler pages secret put GITHUB_TOKEN --project-name dres-nold`)

## Wer sich anmelden darf

Cloudflare → Zero Trust → Access → Applications → „Redaktion dres-nold" →
Policies → Regel „E-Mail-Adressen": Adressen ergänzen oder entfernen.
Fertig, keine Passwörter, nichts weiter.

## Einen alten Stand wiederherstellen

Jede Änderung ist ein Commit im GitHub-Repo. Auf github.com unter
„Commits" den gewünschten Stand suchen, die betroffene Datei in
`src/content/` öffnen und ihren Inhalt in der Redaktion übernehmen — oder
(wer mit Git umgehen kann) `git revert <commit>` und pushen.

## Wenn etwas nicht geht

| Symptom | Ursache | Abhilfe |
|---|---|---|
| Redaktion meldet „Nicht gespeichert … von jemand anderem geändert" | zwei Personen gleichzeitig | Seite neu laden, Änderung erneut vornehmen |
| Redaktion meldet „Anmeldung erforderlich" | Access-Sitzung abgelaufen | erneut über `/login` anmelden |
| Nach dem Anmelden wirft der erste Klick zurück auf den Anmeldebildschirm | Ein Verweis auf `/cdn-cgi/access/logout` wird vorgeholt und meldet dabei ab | Alle Verweise der Redaktion brauchen `data-astro-prefetch="false"` (siehe `src/layouts/Redaktion.astro`) |
| Speichern schlägt mit „GitHub: … (401)" fehl | `GITHUB_TOKEN` abgelaufen | Token erneuern (oben) |
| Änderung nach 5 Minuten nicht online | Workflow fehlgeschlagen | GitHub → Actions → letzten Lauf öffnen; meist eine kaputte Inhaltsdatei (steht dort im Klartext) |
| Kontaktformular: „Der Versand ist noch nicht eingerichtet" | `RESEND_API_KEY` fehlt | in Cloudflare Pages setzen |
| Hinweis-Blase erscheint nicht am Stichtag | nächtlicher Neubau lief nicht | GitHub → Actions → „Veröffentlichen" → Run workflow |

## Regelmäßig

- **Alle paar Monate:** Aktualisierungen einspielen, die GitHub
  (Dependabot) vorschlägt — Pull Request öffnen, prüfen, mergen.
- **Jährlich:** GitHub-Token erneuern (siehe oben); Resend-Konto und
  Domain-Rechnung im Blick behalten.

## Lokal arbeiten (für Technik-Helfer)

```bash
npm install
npm run dev                  # Vorschau der Seite unter http://localhost:4321
npm run build                # Produktionsbuild nach dist/
npx wrangler pages dev dist  # Seite samt Functions unter http://localhost:8788
```

Für die Functions lokal eine `.dev.vars` anlegen (Vorlage `.dev.vars.example`).
Mit `ENTWICKLUNG=1` ist die Redaktion lokal ohne Anmeldung erreichbar;
`GITHUB_BRANCH=redaktion-test` sorgt dafür, dass Testspeicherungen nicht
auf `main` landen.
