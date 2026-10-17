/**
 * Seitenwechsel — die Teile, die CSS allein nicht kann.
 *
 * 1. Die Karte setzt sich sofort in Bewegung. Früher hob sie sich erst
 *    220 ms lang ab (Schatten und leichte Vergrößerung), bevor der
 *    Wechsel begann — das wirkte wie ein Hüpfer mit anschließendem
 *    Sprung. Jetzt gibt es keinen Vorlauf und keinen Schatten: Es bleibt
 *    bei einer einzigen, sauberen Bewegung (styles/uebergaenge.css).
 *
 * 2. Schließen: Schließen-Kreuz, „Alle Leistungen" und Escape führen zur
 *    Übersicht — so, dass die gerade offene Leistung dort mittig im
 *    Fenster steht. Das gilt auch, wenn man in der offenen Ansicht mit
 *    „Vorherige / Nächste" weitergeblättert hat: Die Seite morpht dann
 *    in die Karte der zuletzt gesehenen Leistung zurück.
 *
 * 3. Blättern: „Vorherige / Nächste" schiebt die Seiten seitlich
 *    durch (styles/uebergaenge.css, `html[data-uebergang]`).
 *
 * Nebenbei: `data-morph` kennzeichnet die eine Karte, die gerade morpht
 * — in beiden Richtungen. Nur sie gehört zur Übergangsgruppe „karte"
 * und liegt damit über den übrigen Karten. Trügen alle Kacheln die
 * Gruppe, läge die richtige beim Zurückmorphen wieder dazwischen.
 *
 * 4. Das Schließen-Kreuz bleibt beim Scrollen oben stehen; sobald es
 *    „klebt", zeichnet sich ein Kreis darum.
 */
import { navigate } from 'astro:transitions/client';
import { durchlauf, A3_ZUWACHS } from './scrollwege';
import { bildlaufAnhalten } from './bildlauf';

const MERKER = 'uebergang-ziel';

type Vorbereitung = Event & {
  sourceElement?: Element | null;
  loader: () => Promise<void>;
  direction: string;
  from: URL;
  to: URL;
};

type VorTausch = Event & { newDocument: Document; viewTransition?: ViewTransition };

/**
 * Die Kennzeichen wieder abräumen.
 *
 * WICHTIG ist der Zeitpunkt. Ein Seitenwechsel läuft so ab:
 *
 *   1. altes Bild aufnehmen
 *   2. Seite austauschen  → hier meldet Astro `astro:after-swap`,
 *                           gleich darauf `astro:page-load`
 *   3. neues Bild aufnehmen
 *   4. bewegen
 *
 * `astro:page-load` kommt also noch VOR Schritt 3. Wer dort aufräumt,
 * nimmt der Zielkachel ihren Übergangsnamen, bevor das neue Bild
 * aufgenommen ist — dann gibt es kein Gegenstück mehr und der Rückweg
 * bricht mitten in der Bewegung ab. Deshalb wird erst aufgeräumt, wenn
 * der Wechsel fertig ist (`finished`).
 */
function kennzeichenAbraeumen() {
  delete document.documentElement.dataset.uebergang;
  delete document.documentElement.dataset.rueckmorph;
  document.documentElement.style.removeProperty('--morph-zoom');
  for (const k of document.querySelectorAll('[data-morph]')) k.removeAttribute('data-morph');
  for (const e of document.querySelectorAll<HTMLElement>('[data-eingefroren]')) {
    e.style.removeProperty('transform');
    e.style.removeProperty('transition');
    delete e.dataset.eingefroren;
  }
}

/**
 * Hält die Karte genau so fest, wie sie gerade aussieht.
 *
 * `data-morph` schaltet die Überblendungen der Karte ab. Lief beim Klick
 * aber noch eine — das Bild wächst beim Zeigen 0,55 s lang auf 1,07, die
 * Karte hebt sich —, sprang sie dadurch auf ihren Endwert, kurz bevor
 * das Abbild entstand: Das Bild zuckte vor dem Morph (Florian,
 * 17. Oktober 2026). Jetzt wird der Zwischenstand als fester Wert
 * gesetzt, bevor die Überblendung endet.
 */
function karteEinfrieren(karte: Element) {
  const teile = [karte, ...karte.querySelectorAll('.beitrag__lauf, .beitrag__bild')] as HTMLElement[];
  const stand = teile.map((t) => getComputedStyle(t).transform);
  teile.forEach((t, i) => {
    t.style.transform = stand[i] === 'none' ? 'none' : stand[i];
    t.style.transition = 'none';
    t.dataset.eingefroren = 'ja';
  });
}

/**
 * Wie stark das Bild eines Beitrags GERADE vergrößert ist.
 *
 * Auf der Übersicht trägt es zwei Vergrößerungen: eine beim Zeigen
 * (`.beitrag__bild`) und eine über den Scrollweg (`.beitrag__lauf`).
 * Auf der Beitragsseite steht es unvergrößert.
 *
 * Während des Übergangs liegen beide Aufnahmen übereinander. Damit sie
 * sich beim Überblenden decken, wandert die eine auf die andere zu —
 * um genau diesen Unterschied. Er heißt `--morph-zoom` und ist immer
 * die größere der beiden Vergrößerungen geteilt durch die kleinere,
 * also ≥ 1; welche Aufnahme sich bewegt, entscheidet die Richtung
 * (styles/uebergaenge.css; Florian, 18. September 2026).
 */
function bildZoom(karte: Element | null | undefined): number {
  const lauf = karte?.querySelector<HTMLElement>('.beitrag__lauf');
  const bild = karte?.querySelector<HTMLElement>('.beitrag__bild');
  if (!lauf || !bild) return 1;
  const faktor = (el: HTMLElement) => {
    const wert = getComputedStyle(el).transform;
    if (!wert || wert === 'none') return 1;
    try { return new DOMMatrixReadOnly(wert).a || 1; } catch { return 1; }
  };
  return faktor(lauf) * faktor(bild);
}

/**
 * Dieselbe Rechnung für den Rückweg — dort ist das Bild noch gar nicht
 * vergrößert, wenn wir messen.
 *
 * Der Grund ist die Reihenfolge: `astro:after-swap` läuft VOR
 * `astro:page-load`, und erst dort setzt Neuigkeiten.astro den Wert.
 * Die neue Momentaufnahme entsteht aber danach — sie zeigt das Bild
 * also vergrößert. Deshalb wird hier vorweggenommen, was das Skript
 * gleich setzen wird: derselbe Ablauf a-3 mit derselben Formel
 * (scripts/scrollwege.ts). Die Karte steht zu diesem Zeitpunkt schon
 * an ihrem Platz — `after-swap` hat sie mittig gestellt.
 */
function bildZoomDanach(karte: Element | null | undefined): number {
  const lauf = karte?.querySelector<HTMLElement>('.beitrag__lauf');
  if (!lauf) return 1;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 1;
  /* Steht der Wert schon, gilt er — dann war Neuigkeiten.astro vorher
     dran und hat für diese Seite gerechnet. */
  const gesetzt = parseFloat(lauf.style.getPropertyValue('--bild-groesse'));
  if (gesetzt > 0) return gesetzt;
  return 1 + A3_ZUWACHS * durchlauf(lauf);
}

/** `--morph-zoom` setzen — oder wegräumen, wenn nichts anzugleichen ist. */
function zoomMerken(wurzel: HTMLElement, zoom: number) {
  if (Math.abs(zoom - 1) < 0.002) wurzel.style.removeProperty('--morph-zoom');
  else wurzel.style.setProperty('--morph-zoom', zoom.toFixed(4));
}

/** Läuft gerade ein echter Übergang? Dann räumt dessen `finished` auf. */
let uebergangLaeuft = false;

document.addEventListener('astro:before-preparation', (ereignis) => {
  const e = ereignis as Vorbereitung;
  const quelle = e.sourceElement ?? null;

  /* Reste eines früheren Wechsels — sonst trüge eine zweite Kachel noch
     ihren Namen und bekäme eine überflüssige Ebene. */
  kennzeichenAbraeumen();

  /* Blättern: Richtung merken, bis der Wechsel vorbei ist */
  const blaettern = quelle?.closest?.('[data-blaettern]');
  if (blaettern) {
    document.documentElement.dataset.uebergang = blaettern.getAttribute('data-blaettern') || 'vor';
  }

  /* Die angeklickte Karte kennzeichnen: Nur sie gehört zur
     Übergangsgruppe „karte" und liegt damit über ihren Nachbarn
     (styles/uebergaenge.css). */
  const karte = quelle?.closest?.('[data-karte]');
  bildlaufAnhalten();
  if (karte?.matches('.beitrag__link')) karteEinfrieren(karte);
  karte?.setAttribute('data-morph', '');

  /* Das Bild der Karte vor dem Wechsel fertig dekodieren lassen: Safari
     zeigte es sonst für ein Bild weiß, wenn es die Ebene für die
     Aufnahme neu anlegte (Florian, 27. September 2026). Der Wechsel
     wartet darauf — bei einem längst gezeigten Bild ist das sofort. */
  const bild = karte?.querySelector<HTMLImageElement>('img');
  if (bild && typeof bild.decode === 'function') {
    const laden = e.loader;
    e.loader = async () => {
      await Promise.all([laden(), bild.decode().catch(() => undefined)]);
      /* Und das Bild der ZIELSEITE (das Original, während die Karte die
         kleine Variante zeigt): einmal laden und dekodieren, bevor die
         neue Seite eingetauscht und aufgenommen wird — sonst stünde im
         Abbild der Beitragsseite ein noch leeres Bild. */
      const neu = (e as unknown as { newDocument?: Document }).newDocument?.querySelector<HTMLImageElement>('.beitrag__bild');
      if (neu?.src) {
        const vorab = new Image();
        vorab.decoding = 'sync';
        vorab.src = neu.src;
        await vorab.decode().catch(() => undefined);
      }
    };
  }

  /* Hinweg: Die Aufnahme der Beitragsseite zeigt das Bild unvergrößert
     — sie beginnt deshalb bei der Vergrößerung der Karte. */
  zoomMerken(document.documentElement, Math.max(1, bildZoom(karte)));

  /* Rückweg zur Startseite — über das Schließen-Kreuz (dann steht der
     Merker schon) oder über den Zurück-Knopf des Browsers. Dabei blendet
     der übrige Inhalt eine Spur später ein als die Karte wandert, damit
     die Karte den Blick führt (Florian, 18. September 2026;
     styles/uebergaenge.css). */
  let zurueckZurUebersicht = false;
  try { zurueckZurUebersicht = !!sessionStorage.getItem(MERKER); } catch { /* egal */ }
  zielMittig = zurueckZurUebersicht;
  if (zurueckZurUebersicht || e.direction === 'back') {
    document.documentElement.dataset.rueckmorph = 'ja';
  }
  /* Mit dem Zurück-Knopf des Browsers gibt es keinen Merker — die Karte
     der Seite, von der man kommt, ist trotzdem das Ziel des Morphs.
     Ohne sie blieb das Titelbild als Ebene ohne Gegenstück über der
     Startseite stehen (Florian, 17. Oktober 2026). Mittig gestellt wird
     sie dann nicht: Der Browser stellt die Scrolltiefe von vorhin
     wieder her. */
  if (!zurueckZurUebersicht && e.direction === 'back') {
    try { sessionStorage.setItem(MERKER, e.from.pathname); } catch { /* egal */ }
  }
});

/** Soll die Zielkarte des Rückwegs mittig gestellt werden? (Schließen-Kreuz) */
let zielMittig = false;

/* Nach dem Tausch: die Karte der zuletzt offenen Leistung mittig
   stellen — noch bevor der Browser das neue Bild aufnimmt, damit der
   Morph dort endet, wo die Karte dann steht. */
/** Die Karte mittig ins Fenster stellen — ohne Bewegung. */
function karteMittigStellen(karte: HTMLElement) {
  const r = karte.getBoundingClientRect();
  const oben = window.scrollY + r.top - (window.innerHeight - r.height) / 2;
  window.scrollTo({ top: Math.max(0, oben), behavior: 'instant' as ScrollBehavior });
}

document.addEventListener('astro:after-swap', () => {
  let ziel = '';
  try { ziel = sessionStorage.getItem(MERKER) || ''; sessionStorage.removeItem(MERKER); } catch { /* egal */ }
  if (!ziel) return;
  const karte = document.querySelector<HTMLElement>(`[data-karte][href="${ziel}"]`);
  if (!karte) return;
  /* Auch beim Zurückmorphen muss die Zielkarte über ihren Nachbarn
     liegen. Dieses Kennzeichen wird noch vor der neuen Momentaufnahme
     gesetzt — `astro:after-swap` läuft innerhalb des Übergangs. */
  karte.setAttribute('data-morph', '');

  /* Das Bild der Zielkarte sofort und fertig laden: Es ist `lazy`, und
     nach dem Tausch ist es ein neues Element — Safari zeigte es nach
     dem Ende des Wechsels für ein Bild weiß, weil es noch nicht
     dekodiert war (Florian, 27. September 2026). */
  const bild = karte.querySelector<HTMLImageElement>('img');
  if (bild) {
    bild.loading = 'eager';
    if (typeof bild.decode === 'function') bild.decode().catch(() => undefined);
  }

  if (!zielMittig) {
    zoomMerken(document.documentElement, Math.max(1, bildZoomDanach(karte)));
    return;
  }

  /* Mittig stellen — SOFORT, nicht als Mikroaufgabe: Die Leisten
     prüfen ihren Zustand (`data-gescrollt`) in einer eigenen
     Mikroaufgabe nach dem Tausch; liefe das Zentrieren erst danach,
     sähen sie Scrolltiefe 0, stellten auf „nicht gescrollt", und das
     Abbild würde so aufgenommen — nach dem Wechsel führe die echte
     Kopfleiste dann über ihr Abbild ein (Florian, 27. September 2026).
     Eine Mikroaufgabe war hier nur nötig, solange Begrüßung und Band
     auf Handys erst umsortiert wurden; das steht seit heute im Markup. */
  karteMittigStellen(karte);
  /* Ein erster Wert, falls der Wechsel hier schon endet. Der genaue
     folgt in `astro:page-load` — dann steht das Bild an seinem Platz
     und die Seite hat sich gesetzt. */
  zoomMerken(document.documentElement, Math.max(1, bildZoomDanach(karte)));
});

/* Astro tauscht beim Wechsel das ganze Dokument aus — die Richtung des
   Blätterns muss deshalb auch am NEUEN <html> stehen, sonst verlöre die
   hereinfahrende Seite mitten in der Bewegung ihre Regeln. */
document.addEventListener('astro:before-swap', (ereignis) => {
  const e = ereignis as VorTausch;

  const richtung = document.documentElement.dataset.uebergang;
  if (richtung) e.newDocument.documentElement.dataset.uebergang = richtung;

  if (document.documentElement.dataset.rueckmorph) {
    e.newDocument.documentElement.dataset.rueckmorph = 'ja';
  }

  /* Astro übernimmt beim Tausch die Attribute des NEUEN <html> — was
     hier als Stil steht, wäre danach fort. Der gemessene Unterschied
     muss den Tausch aber überleben: Die Bewegung läuft erst danach. */
  const zoom = document.documentElement.style.getPropertyValue('--morph-zoom');
  if (zoom) e.newDocument.documentElement.style.setProperty('--morph-zoom', zoom);

  /* Aufräumen erst, wenn die Bewegung vorbei ist — siehe
     `kennzeichenAbraeumen()`. */
  const wechsel = e.viewTransition;
  if (!wechsel) return;
  uebergangLaeuft = true;
  wechsel.finished.catch(() => { /* abgebrochen: trotzdem aufräumen */ }).finally(() => {
    uebergangLaeuft = false;
    kennzeichenAbraeumen();
  });
});

document.addEventListener('astro:page-load', () => {
  /* Letzter Moment vor der neuen Momentaufnahme: Jetzt steht die Seite,
     und die Vergrößerung des Bildes lässt sich genau bestimmen. Auf
     dem Rückweg ist das der Wert, der den Sprung verhindert. */
  if (uebergangLaeuft && document.documentElement.dataset.rueckmorph) {
    const karte = document.querySelector<HTMLElement>('[data-karte][data-morph]');
    if (karte) {
      zoomMerken(document.documentElement, Math.max(1, bildZoomDanach(karte)));
      /* Hat ein Komponentenskript die Seite seither noch verschoben
         (Schriften, Nachmessen), sitzt die Kachel nicht mehr mittig —
         dann nachstellen, aber nur bei echtem Versatz */
      const r = karte.getBoundingClientRect();
      const mitte = (window.innerHeight - r.height) / 2;
      if (zielMittig && Math.abs(r.top - mitte) > 4) karteMittigStellen(karte);
    }
  }

  /* Ohne echten Übergang (ältere Browser, reduzierte Bewegung) gibt es
     kein `finished` — dann hier aufräumen. */
  if (!uebergangLaeuft) kennzeichenAbraeumen();
  schliessenKlebenLassen();
});

/** Zur Übersicht — die aktuelle Seite soll dort als Karte mittig stehen. */
function schliessen(verweis: HTMLAnchorElement) {
  try { sessionStorage.setItem(MERKER, location.pathname); } catch { /* egal */ }
  /* Ohne Anker: die Position setzt after-swap, ein Anker würde dazwischenfunken */
  const ziel = new URL(verweis.href);
  ziel.hash = '';
  navigate(ziel.pathname + ziel.search);
}

/* In der Capture-Phase, damit dieser Zuhörer VOR Astros eigenem
   Klick-Zuhörer dran ist — sonst navigiert Astro schon selbst und die
   Karte wird nicht mittig gestellt. */
document.addEventListener('click', (e) => {
  const ziel = e.target as Element | null;
  const verweis = ziel?.closest?.<HTMLAnchorElement>('a[data-zurueck]');
  if (!verweis || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  e.stopPropagation();
  schliessen(verweis);
}, true);

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || e.defaultPrevented) return;
  const verweis = document.querySelector<HTMLAnchorElement>('a[data-zurueck]');
  if (!verweis) return;
  /* Offene Menüs oder Dialoge haben Vorrang */
  if (document.querySelector('[aria-expanded="true"]')) return;
  schliessen(verweis);
});

/** Kreis um das Schließen-Kreuz, sobald es beim Scrollen oben klebt. */
function schliessenKlebenLassen() {
  const halter = document.querySelector<HTMLElement>('[data-schliessen-halter]');
  const wache = document.querySelector<HTMLElement>('[data-schliessen-wache]');
  if (!halter || !wache || halter.dataset.bereit) return;
  halter.dataset.bereit = 'ja';
  const oben = parseFloat(getComputedStyle(halter).top) || 0;
  const beobachter = new IntersectionObserver(([eintrag]) => {
    if (eintrag.isIntersecting) delete halter.dataset.klebt;
    else halter.dataset.klebt = 'ja';
  }, { rootMargin: `-${Math.round(oben) + 1}px 0px 0px 0px`, threshold: 0 });
  beobachter.observe(wache);
}

schliessenKlebenLassen();
