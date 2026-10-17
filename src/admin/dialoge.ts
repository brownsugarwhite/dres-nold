/**
 * Die Dialoge der Redaktion — alle als `<dialog>`: Er hält den Fokus von
 * selbst in sich, schließt mit Escape und gibt den Fokus danach an den
 * Knopf zurück, der ihn geöffnet hat.
 *
 *   zielWaehlen    „Wohin soll das führen?" — für Knöpfe, Menüpunkte, Textlinks
 *   symbolWaehlen  ein Symbol aus der Sammlung oder ein eigenes
 *   dateiWaehlen   ein Bild oder Dokument: hochladen oder ein vorhandenes nehmen
 *   kartenWaehlen  eine Auswahl aus bebilderten Karten (Art eines neuen
 *                  Bereichs oder Abschnitts)
 */
import { el, hochladen, dateienLesen, groesseText, vorschauVon } from './werkzeug';
import { zieleSammeln, type ZielDaten } from './ziele';

/* ------------------------------------------------------------------ */
/* Grundgerüst                                                         */
/* ------------------------------------------------------------------ */

interface Rahmen {
  dialog: HTMLDialogElement;
  koerper: HTMLElement;
  fuss: HTMLElement;
  schliessen: () => void;
}

function rahmen(titel: string, beimSchliessen: () => void, breit = false): Rahmen {
  const koerper = el('div', { class: 'dialog__koerper' });
  const fuss = el('div', { class: 'dialog__fuss' });
  const zu = el('button', { class: 'dialog__zu', type: 'button', 'aria-label': 'Schließen' }, ['×']);
  const dialog = el('dialog', { class: breit ? 'dialog dialog--breit' : 'dialog' }, [
    el('div', { class: 'dialog__kopf' }, [el('h2', { class: 'dialog__titel', text: titel }), zu]),
    koerper,
    fuss,
  ]);
  dialog.setAttribute('aria-label', titel);
  let erledigt = false;
  const schliessen = () => {
    if (erledigt) return;
    erledigt = true;
    dialog.close();
    dialog.remove();
    beimSchliessen();
  };
  zu.addEventListener('click', schliessen);
  dialog.addEventListener('close', schliessen);
  // Klick auf den abgedunkelten Grund schließt
  dialog.addEventListener('click', (e) => { if (e.target === dialog) schliessen(); });
  document.body.append(dialog);
  dialog.showModal();
  return { dialog, koerper, fuss, schliessen };
}

/** Reiter oben im Dialog — wechseln den Inhalt darunter */
function reiter(ziel: HTMLElement, seiten: { titel: string; bauen: () => HTMLElement }[], start = 0) {
  const leiste = el('div', { class: 'reiter', role: 'tablist' });
  const flaeche = el('div', { class: 'reiter__flaeche', role: 'tabpanel' });
  const knoepfe = seiten.map((s, i) => {
    const k = el('button', { class: 'reiter__knopf', type: 'button', role: 'tab', text: s.titel });
    k.addEventListener('click', () => zeigen(i));
    return k;
  });
  const zeigen = (i: number) => {
    knoepfe.forEach((k, j) => k.setAttribute('aria-selected', String(i === j)));
    flaeche.replaceChildren(seiten[i].bauen());
    flaeche.querySelector<HTMLElement>('input, button')?.focus();
  };
  leiste.append(...knoepfe);
  ziel.append(leiste, flaeche);
  zeigen(start);
}

/* ------------------------------------------------------------------ */
/* Ziel wählen                                                         */
/* ------------------------------------------------------------------ */

/**
 * „Wohin soll das führen?" — liefert die Adresse oder null (abgebrochen).
 * Ob dorthin gescrollt oder die Seite gewechselt wird, muss niemand
 * wissen: Das entscheidet die Seite beim Klick selbst.
 */
export function zielWaehlen(aktuell: string, daten: ZielDaten, ohneDatei = false): Promise<string | null> {
  return new Promise((fertig) => {
    let ergebnis: string | null = null;
    const r = rahmen('Wohin soll das führen?', () => fertig(ergebnis), true);
    const nehmen = (ziel: string) => { ergebnis = ziel; r.schliessen(); };

    const intern = () => {
      const suche = el('input', { class: 'feld__eingabe', type: 'search', placeholder: 'Suchen, z. B. „Mundatmung"' });
      const liste = el('div', { class: 'zielliste' });
      const fuellen = () => {
        const s = suche.value.trim().toLowerCase();
        liste.replaceChildren();
        for (const g of zieleSammeln(daten)) {
          const punkte = g.punkte.filter((p) => !s || p.titel.toLowerCase().includes(s));
          if (!punkte.length) continue;
          liste.append(el('h3', { class: 'zielliste__gruppe', text: g.titel }));
          for (const p of punkte) {
            const k = el('button', {
              class: `zielliste__punkt zielliste__punkt--${p.tiefe}`,
              type: 'button',
              'aria-pressed': String(p.ziel === aktuell),
            }, [el('span', { text: p.titel }), p.ausgeblendet ? el('span', { class: 'marke', text: 'ausgeblendet' }) : null]);
            k.addEventListener('click', () => nehmen(p.ziel));
            liste.append(k);
          }
        }
        if (!liste.childElementCount) liste.append(el('p', { class: 'feld__hilfe', text: 'Nichts gefunden.' }));
      };
      suche.addEventListener('input', fuellen);
      fuellen();
      return el('div', {}, [suche, liste]);
    };

    const eingabe = (beschriftung: string, platzhalter: string, vorne: string, umformen: (w: string) => string | null, fehler: string) => () => {
      const id = `ziel-${vorne || 'web'}`;
      const feld = el('input', { class: 'feld__eingabe', id, type: 'text', placeholder: platzhalter });
      if (aktuell.startsWith(vorne || 'http')) feld.value = vorne ? aktuell.slice(vorne.length) : aktuell;
      const meldung = el('p', { class: 'feld__hilfe' });
      const ok = el('button', { class: 'knopf knopf--haupt', type: 'button', text: 'Übernehmen' });
      const uebernehmen = () => {
        const ziel = umformen(feld.value.trim());
        if (!ziel) { meldung.textContent = fehler; meldung.dataset.art = 'fehler'; feld.focus(); return; }
        nehmen(ziel);
      };
      ok.addEventListener('click', uebernehmen);
      feld.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); uebernehmen(); } });
      const label = el('label', { class: 'feld__label', text: beschriftung });
      label.htmlFor = id;
      return el('div', { class: 'feld' }, [label, feld, meldung, ok]);
    };

    const datei = () => dateiAuswahl('dokumente', (pfad) => nehmen(pfad));

    const seiten = [
      { titel: 'Auf dieser Website', bauen: intern },
      ...(ohneDatei ? [] : [{ titel: 'Datei', bauen: datei }]),
      {
        titel: 'Andere Website',
        bauen: eingabe('Adresse der Website', 'www.beispiel.de', '', (w) => {
          const z = /^https?:\/\//i.test(w) ? w : `https://${w}`;
          return /^https?:\/\/[^\s/]+\.[^\s]+/i.test(z) ? z : null;
        }, 'Das sieht nicht wie eine Web-Adresse aus.'),
      },
      {
        titel: 'E-Mail',
        bauen: eingabe('E-Mail-Adresse', 'info@dres-nold.de', 'mailto:', (w) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(w) ? `mailto:${w}` : null), 'Das ist keine E-Mail-Adresse.'),
      },
      {
        titel: 'Telefon',
        bauen: eingabe('Telefonnummer', '07245 7171', 'tel:', (w) => (/^[+\d][\d\s/()-]{3,}$/.test(w) ? `tel:${w.replace(/[\s/()-]/g, '')}` : null), 'Das ist keine Telefonnummer.'),
      },
    ];
    /* Mit dem Reiter beginnen, zu dem das bisherige Ziel gehört */
    const art = /^https?:/i.test(aktuell) ? 'Andere Website'
      : aktuell.startsWith('mailto:') ? 'E-Mail'
        : aktuell.startsWith('tel:') ? 'Telefon'
          : /\.[a-z0-9]{2,5}$/i.test(aktuell.split('#')[0]) ? 'Datei'
            : 'Auf dieser Website';
    reiter(r.koerper, seiten, Math.max(0, seiten.findIndex((s) => s.titel === art)));
  });
}

/* ------------------------------------------------------------------ */
/* Dateien und Bilder                                                  */
/* ------------------------------------------------------------------ */

const ENDUNGEN_DOKUMENTE = '.pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.odt,.ods,.odp,.rtf,.txt,.csv,.jpg,.jpeg,.png,.webp';
const ENDUNGEN_BILDER = '.jpg,.jpeg,.png,.webp';

/** Hochladen-Knopf plus Liste des Vorhandenen — für Dokumente und Bilder */
function dateiAuswahl(ordner: string, nehmen: (pfad: string) => void): HTMLElement {
  const bild = ordner !== 'dokumente' && ordner !== 'symbole';
  const eingabe = el('input', { type: 'file', accept: bild ? ENDUNGEN_BILDER : ordner === 'symbole' ? '.svg,' + ENDUNGEN_BILDER : ENDUNGEN_DOKUMENTE });
  const status = el('p', { class: 'feld__hilfe', 'aria-live': 'polite' });
  const knopf = el('label', { class: 'knopf knopf--haupt datei__hochladen' }, [bild ? 'Bild hochladen …' : 'Datei hochladen …', eingabe]);
  eingabe.addEventListener('change', async () => {
    const f = eingabe.files?.[0];
    if (!f) return;
    status.textContent = 'Wird hochgeladen …';
    delete status.dataset.art;
    try {
      nehmen(await hochladen(f, ordner));
    } catch (e) {
      status.textContent = e instanceof Error ? e.message : 'Hochladen fehlgeschlagen.';
      status.dataset.art = 'fehler';
    }
    eingabe.value = '';
  });

  const hinweis = el('p', { class: 'feld__hilfe', text: bild ? 'JPG, PNG oder WebP, bis 8 MB.' : ordner === 'symbole' ? 'Am besten eine SVG-Zeichnung in einer Farbe, bis 512 KB.' : 'Meist ein PDF. Auch Word, Excel, PowerPoint, OpenOffice, Text und Bilder — bis 15 MB.' });
  const vorhanden = el('div', { class: bild || ordner === 'symbole' ? 'bilderliste' : 'dateiliste' }, [el('p', { class: 'feld__hilfe', text: 'Vorhandene Dateien werden geladen …' })]);
  dateienLesen(ordner)
    .then((liste) => {
      vorhanden.replaceChildren();
      if (!liste.length) { vorhanden.append(el('p', { class: 'feld__hilfe', text: 'Noch nichts hochgeladen.' })); return; }
      for (const d of liste) {
        const k = el('button', { class: bild || ordner === 'symbole' ? 'bilderliste__bild' : 'dateiliste__datei', type: 'button', title: d.name },
          bild || ordner === 'symbole'
            ? [el('img', { src: d.pfad, alt: '', loading: 'lazy' }), el('span', { text: d.name })]
            : [el('span', { class: 'dateiliste__name', text: d.name }), el('span', { class: 'marke', text: `${(d.name.split('.').pop() ?? '').toUpperCase()} · ${groesseText(d.groesse)}` })]);
        k.addEventListener('click', () => nehmen(d.pfad));
        vorhanden.append(k);
      }
    })
    .catch((e) => { vorhanden.replaceChildren(el('p', { class: 'feld__hilfe', text: e instanceof Error ? e.message : 'Liste nicht lesbar' })); });

  return el('div', { class: 'dateiauswahl' }, [knopf, hinweis, status, el('h3', { class: 'zielliste__gruppe', text: 'Schon hochgeladen' }), vorhanden]);
}

/** Ein Bild oder eine Datei wählen — liefert den Pfad oder null */
export function dateiWaehlen(ordner: string, titel = ordner === 'dokumente' ? 'Datei wählen' : 'Bild wählen'): Promise<string | null> {
  return new Promise((fertig) => {
    let ergebnis: string | null = null;
    const r = rahmen(titel, () => fertig(ergebnis), true);
    r.koerper.append(dateiAuswahl(ordner, (pfad) => { ergebnis = pfad; r.schliessen(); }));
  });
}

/* ------------------------------------------------------------------ */
/* Symbole                                                             */
/* ------------------------------------------------------------------ */

/**
 * Ein Symbol wählen. `sammlung` sind die Symbole der Seite (beim Bauen
 * eingelesen, pages/admin/index.astro); dazu kommen eigene, die die
 * Praxis hochgeladen hat.
 */
export function symbolWaehlen(aktuell: string, sammlung: { pfad: string; name: string }[], titel = 'Symbol wählen'): Promise<string | null> {
  return new Promise((fertig) => {
    let ergebnis: string | null = null;
    const r = rahmen(titel, () => fertig(ergebnis), true);
    const nehmen = (pfad: string) => { ergebnis = pfad; r.schliessen(); };
    reiter(r.koerper, [
      {
        titel: 'Sammlung',
        bauen: () => {
          const raster = el('div', { class: 'bilderliste bilderliste--symbole' });
          for (const s of sammlung) {
            const k = el('button', { class: 'bilderliste__bild', type: 'button', title: s.name, 'aria-pressed': String(s.pfad === aktuell) }, [
              el('img', { src: s.pfad, alt: '' }), el('span', { text: s.name }),
            ]);
            k.addEventListener('click', () => nehmen(s.pfad));
            raster.append(k);
          }
          return raster;
        },
      },
      { titel: 'Eigenes Symbol', bauen: () => dateiAuswahl('symbole', nehmen) },
    ]);
  });
}

/* ------------------------------------------------------------------ */
/* Bebilderte Auswahl                                                  */
/* ------------------------------------------------------------------ */

export interface Karte {
  wert: string;
  titel: string;
  text: string;
  /** Eine kleine Skizze als SVG-Text (skizzen.ts) */
  skizze: string;
}

export function kartenWaehlen(titel: string, karten: Karte[], einleitung = ''): Promise<string | null> {
  return new Promise((fertig) => {
    let ergebnis: string | null = null;
    const r = rahmen(titel, () => fertig(ergebnis), true);
    if (einleitung) r.koerper.append(el('p', { class: 'dialog__einleitung', text: einleitung }));
    const raster = el('div', { class: 'auswahlkarten' });
    for (const k of karten) {
      const knopf = el('button', { class: 'auswahlkarte', type: 'button' }, [
        el('span', { class: 'auswahlkarte__skizze' }),
        el('span', { class: 'auswahlkarte__titel', text: k.titel }),
        el('span', { class: 'auswahlkarte__text', text: k.text }),
      ]);
      knopf.querySelector('.auswahlkarte__skizze')!.innerHTML = k.skizze;
      knopf.addEventListener('click', () => { ergebnis = k.wert; r.schliessen(); });
      raster.append(knopf);
    }
    r.koerper.append(raster);
    raster.querySelector<HTMLElement>('button')?.focus();
  });
}

/* ------------------------------------------------------------------ */
/* Freies Formular im Dialog                                           */
/* ------------------------------------------------------------------ */

/**
 * Ein Dialog mit eigenem Inhalt und einem Hauptknopf. `pruefen` liefert
 * eine Fehlermeldung oder null; erst ohne Fehler schließt der Dialog.
 */
export function formularDialog(titel: string, inhalt: HTMLElement, knopfText: string, pruefen: () => string | null): Promise<boolean> {
  return new Promise((fertig) => {
    let ok = false;
    const r = rahmen(titel, () => fertig(ok));
    const meldung = el('p', { class: 'meldung', 'aria-live': 'polite' });
    const haupt = el('button', { class: 'knopf knopf--haupt', type: 'button', text: knopfText });
    const abbrechen = el('button', { class: 'knopf knopf--leise', type: 'button', text: 'Abbrechen' });
    haupt.addEventListener('click', () => {
      const fehler = pruefen();
      if (fehler) { meldung.textContent = fehler; meldung.dataset.art = 'fehler'; return; }
      ok = true;
      r.schliessen();
    });
    abbrechen.addEventListener('click', r.schliessen);
    r.koerper.append(inhalt);
    r.fuss.append(meldung, abbrechen, haupt);
    inhalt.querySelector<HTMLElement>('input, button, select')?.focus();
  });
}

/** Bestätigen statt `window.confirm` — mit eigenen Knopfbeschriftungen */
export function bestaetigen(titel: string, text: string, ja: string): Promise<boolean> {
  return formularDialog(titel, el('p', { class: 'dialog__einleitung', text }), ja, () => null);
}

export { vorschauVon };
