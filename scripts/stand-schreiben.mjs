/*
  Schreibt nach dem Bauen dist/stand.json: aus welchem Commit die Seite
  gebaut ist und wann (läuft als `postbuild`).

  Die Redaktion fragt nach dem Speichern alle paar Sekunden danach. Ist
  die Seite nach dem Speichern neu gebaut, meldet sie „Online ✓". Die
  Zeit zählt, nicht der Commit: Speichert jemand zweimal kurz
  hintereinander, baut GitHub oft nur den neueren Stand — der enthält
  den älteren mit.
*/
import { writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

let commit = process.env.GITHUB_SHA ?? '';
if (!commit) {
  try { commit = execFileSync('git', ['rev-parse', 'HEAD']).toString().trim(); } catch { commit = ''; }
}
await writeFile(new URL('../dist/stand.json', import.meta.url), JSON.stringify({ commit, zeit: new Date().toISOString() }) + '\n');
console.log(`stand.json: ${commit.slice(0, 7)}`);
