/*
  Sichert die Animationsdefinitionen der alten Webflow-Seite.

  ANWENDUNG
  1. https://www.dres-nold.de/ im Browser öffnen
  2. Entwicklerkonsole öffnen (Mac: Wahltaste + Befehl + I, Reiter "Console")
  3. Diesen gesamten Text hineinkopieren und Enter drücken
  4. Die Datei "webflow-animationen.json" landet im Download-Ordner
  5. Datei nach docs/referenz/ verschieben

  Damit ist der Webflow-Code-Export für die Animationen nicht nötig —
  die Daten kommen direkt aus der laufenden Seite.
*/
(() => {
  const ix2 = window.Webflow && window.Webflow.require('ix2');
  if (!ix2) return console.error('Webflow-Interaktionen nicht gefunden. Läuft die alte Seite?');

  const d = ix2.store.getState().ixData;

  // Jeder Auslöser bekommt das zugehörige Element mitgeliefert,
  // damit später klar ist, was sich wo bewegt.
  const events = Object.values(d.events || {}).map((e) => {
    const id = e.target && e.target.id;
    const el = id && document.querySelector(`[data-w-id="${id}"]`);
    return {
      ausloeser: e.eventTypeId,
      ablaufId: e.action && e.action.config && e.action.config.actionListId,
      element: el
        ? { tag: el.tagName.toLowerCase(), id: el.id || null, klassen: el.className || null }
        : { wId: id || null, selektor: (e.target && e.target.selector) || null },
      konfig: e.config || null,
    };
  });

  const inhalt = JSON.stringify(
    { erzeugt: new Date().toISOString(), events, ablaeufe: d.actionLists || {} },
    null, 2
  );

  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([inhalt], { type: 'application/json' }));
  a.download = 'webflow-animationen.json';
  a.click();

  console.log(`Gesichert: ${events.length} Auslöser, ${Object.keys(d.actionLists || {}).length} Abläufe.`);
})();
