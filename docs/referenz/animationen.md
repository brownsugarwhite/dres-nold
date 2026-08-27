# Animationen der alten Seite

Ausgelesen aus der laufenden Webflow-Seite. **Vorlage für den Nachbau** —
nichts hiervon wird übernommen, die Werte sind Zielvorgabe.

31 Auslöser · 24 Abläufe

## `a` — New Scroll Animation

**Ausgelöst durch:** `SCROLLING_IN_VIEW` auf `?`

*Scroll-gebunden*

| bei % | Ziel | Effekt |
|---|---|---|
| 0 | `.dres-bilder (Kinder)` | Größe b=– h=80% |
| 0 | `.dres-bilder (Kinder)` | skalieren 1.2 |
| 90 | `.dres-bilder (Kinder)` | Größe b=– h=100% |
| 90 | `.dres-bilder (Kinder)` | skalieren 1 |

## `a-16` — schnalz out

**Ausgelöst durch:** `SCROLL_OUT_OF_VIEW` auf `?`

*Zeitbasiert*

| Schritt | Ziel | Effekt | Dauer | Verzög. | Kurve |
|---|---|---|---|---|---|
| 1 | `.nav-container` | Größe b=– h=0px | 500 ms | 0 ms | linear |
| 2 | `.nav-landing-container` | Größe b=– h=0px | 300 ms | 0 ms | easeOut |
| 2 | `.nav-container` | Größe b=– h=80px | 300 ms | 0 ms | easeOut |
| 2 | `.nav-bottom.blur` | verschieben x=0 y=110px | 300 ms | 0 ms | easeOut |

## `a-18` — menu desktop hover

**Ausgelöst durch:** `MOUSE_OVER` auf `.nav-button-desktop`

*Zeitbasiert*

| Schritt | Ziel | Effekt | Dauer | Verzög. | Kurve |
|---|---|---|---|---|---|
| 1 | `.nav-txt (Kinder)` | verschieben x=0 y=-80px | 300 ms | 0 ms | easeInOut |
| 2 | `.nav-txt (Kinder)` | verschieben x=0 y=0px | 0 ms | 0 ms | linear |

## `a-19` — oz test

**Ausgelöst durch:** `SCROLLING_IN_VIEW` auf `?`

*Scroll-gebunden*

| bei % | Ziel | Effekt |
|---|---|---|
| 15 | `.div-block-28` | verschieben x=0 y=700px |
| 50 | `.div-block-28` | verschieben x=0 y=150px |
| 50 | `.oz-lotti` | Lottie-Position 0 |
| 71 | `.div-block-28` | verschieben x=0 y=0px |
| 71 | `.oz-lotti` | Lottie-Position 99 |
| 80 | `.oz-lotti` | Lottie-Position 0 |

## `a-2` — New Scroll Animation

**Ausgelöst durch:** `SCROLLING_IN_VIEW` auf `?`

*Scroll-gebunden*

| bei % | Ziel | Effekt |
|---|---|---|
| 0 | `.team-image (Kinder)` | Größe b=– h=80% |
| 0 | `.team-image (Kinder)` | skalieren 1.2 |
| 90 | `.team-image (Kinder)` | Größe b=– h=100% |
| 90 | `.team-image (Kinder)` | skalieren 1 |

## `a-22` — mobile header scroll

**Ausgelöst durch:** `SCROLL_INTO_VIEW` auf `?`

*Zeitbasiert*

| Schritt | Ziel | Effekt | Dauer | Verzög. | Kurve |
|---|---|---|---|---|---|
| 1 | `.team-header` | verschieben x=-50% y=0 | 500 ms | 0 ms | linear |
| 2 | `.team-header` | verschieben x=0% y=0 | 5000 ms | 0 ms | easeInOut |

## `a-23` — mobile header scroll 2

**Ausgelöst durch:** `SCROLL_OUT_OF_VIEW` auf `?`

*Zeitbasiert*

| Schritt | Ziel | Effekt | Dauer | Verzög. | Kurve |
|---|---|---|---|---|---|
| 1 | `.team-header` | verschieben x=-50% y=0 | 0 ms | 0 ms | easeInOut |

## `a-24` — loader

**Ausgelöst durch:** `PAGE_FINISH` auf `?`

*Zeitbasiert*

| Schritt | Ziel | Effekt | Dauer | Verzög. | Kurve |
|---|---|---|---|---|---|
| 1 | `.lottie-animation-2` | Lottie-Position 99 | 1150 ms | 0 ms | [0.526, 0.073, 0.515, 0.985] |
| 1 | `das Element selbst` | verschieben x=-120vw y=0 | 0 ms | 0 ms | linear |
| 1 | `das Element selbst` | Anzeige: block | 0 ms | 0 ms | linear |
| 2 | `das Element selbst` | Anzeige: block | 0 ms | 0 ms | linear |
| 2 | `das Element selbst` | Hintergrund rgb(0,0,0) | 0 ms | 0 ms | linear |
| 2 | `das Element selbst` | Deckkraft 0 | 700 ms | 500 ms | linear |
| 3 | `das Element selbst` | Anzeige: none | 0 ms | 0 ms | linear |
| 4 | `.lottie-animation-2` | Lottie-Position 0 | 2500 ms | 0 ms | [0.25, 0.1, 0.25, 1] |
| 5 | `das Element selbst` | Hintergrund rgb(14,0,10) | 500 ms | 0 ms | linear |
| 5 | `das Element selbst` | verschieben x=0vw y=0 | 800 ms | 400 ms | outCubic |

## `a-25` — menu open

**Ausgelöst durch:** `MOUSE_CLICK` auf `?`

*Zeitbasiert*

| Schritt | Ziel | Effekt | Dauer | Verzög. | Kurve |
|---|---|---|---|---|---|
| 1 | `.mobile-expend` | Größe b=– h=0px | 500 ms | 0 ms | linear |
| 2 | `.mobile-expend` | Größe b=– h=338px | 700 ms | 0 ms | easeInOut |
| 2 | `.lottie-animation-3` | Lottie-Position 99 | 600 ms | 0 ms | easeInOut |
| 3 | `.menu-button-close` | Anzeige: flex | 0 ms | 0 ms | linear |
| 3 | `.menu-button-open` | Anzeige: none | 0 ms | 0 ms | linear |

## `a-26` — schnalz in

**Ausgelöst durch:** `SCROLL_INTO_VIEW` auf `?`

*Zeitbasiert*

| Schritt | Ziel | Effekt | Dauer | Verzög. | Kurve |
|---|---|---|---|---|---|
| 1 | `.nav-landing-container` | Größe b=– h=40px | 300 ms | 0 ms | easeOut |
| 1 | `.nav-container` | Größe b=– h=0px | 300 ms | 0 ms | easeOut |
| 1 | `.nav-bottom.blur` | verschieben x=0 y=0px | 300 ms | 0 ms | easeOut |

## `a-27` — menu close

**Ausgelöst durch:** `MOUSE_CLICK` auf `?`, `MOUSE_CLICK` auf `.nav-bottom-button`, `MOUSE_CLICK` auf `?`

*Zeitbasiert*

| Schritt | Ziel | Effekt | Dauer | Verzög. | Kurve |
|---|---|---|---|---|---|
| 1 | `.mobile-expend` | Größe b=– h=0px | 700 ms | 0 ms | easeInOut |
| 1 | `.lottie-animation-3` | Lottie-Position 0 | 600 ms | 0 ms | easeInOut |
| 2 | `.menu-button-open` | Anzeige: flex | 0 ms | 0 ms | linear |
| 2 | `.menu-button-close` | Anzeige: none | 0 ms | 0 ms | linear |

## `a-28` — hide landing

**Ausgelöst durch:** `SCROLL_OUT_OF_VIEW` auf `?`

*Zeitbasiert*

| Schritt | Ziel | Effekt | Dauer | Verzög. | Kurve |
|---|---|---|---|---|---|
| 1 | `.landing` | Anzeige: none | 0 ms | 0 ms | linear |

## `a-29` — show landing

**Ausgelöst durch:** `SCROLL_INTO_VIEW` auf `?`

*Zeitbasiert*

| Schritt | Ziel | Effekt | Dauer | Verzög. | Kurve |
|---|---|---|---|---|---|
| 1 | `.landing` | Anzeige: block | 0 ms | 0 ms | linear |

## `a-3` — New Scroll Animation

**Ausgelöst durch:** `SCROLLING_IN_VIEW` auf `?`

*Scroll-gebunden*

| bei % | Ziel | Effekt |
|---|---|---|
| 0 | `.team-header (Kinder)` | verschieben x=0 y=-20px |
| 0 | `.team-header (Kinder)` | skalieren 1 |
| 100 | `.team-header (Kinder)` | verschieben x=0 y=120px |
| 100 | `.team-header (Kinder)` | skalieren 1.1 |

## `a-30` — close pop up

**Ausgelöst durch:** `MOUSE_CLICK` auf `?`, `MOUSE_CLICK` auf `?`

*Zeitbasiert*

| Schritt | Ziel | Effekt | Dauer | Verzög. | Kurve |
|---|---|---|---|---|---|
| 1 | `.bubble_container` | verschieben x=-100vw y=0 | 800 ms | 0 ms | inCubic |
| 1 | `.info-pop-up` | Hintergrund rgb(255,255,255) | 700 ms | 500 ms | linear |
| 2 | `.info-pop-up` | Anzeige: none | 0 ms | 0 ms | linear |

## `a-32` — OZ desktop in

**Ausgelöst durch:** `MOUSE_CLICK` auf `?`

*Zeitbasiert*

| Schritt | Ziel | Effekt | Dauer | Verzög. | Kurve |
|---|---|---|---|---|---|
| 1 | `.oz-desktop` | verschieben x=-100vw y=0 | 700 ms | 0 ms | easeOut |
| 2 | `.oz-desktop` | Anzeige: flex | 0 ms | 0 ms | linear |
| 3 | `.oz-desktop` | verschieben x=0vw y=0 | 700 ms | 0 ms | outCubic |

## `a-33` — OZ desktop close

**Ausgelöst durch:** `MOUSE_CLICK` auf `?`

*Zeitbasiert*

| Schritt | Ziel | Effekt | Dauer | Verzög. | Kurve |
|---|---|---|---|---|---|
| 1 | `.oz-desktop` | verschieben x=-100vw y=0 | 700 ms | 0 ms | inCubic |

## `a-34` — x rot hover

**Ausgelöst durch:** `MOUSE_OVER` auf `?`, `MOUSE_OVER` auf `?`, `MOUSE_CLICK` auf `?`

*Zeitbasiert*

| Schritt | Ziel | Effekt | Dauer | Verzög. | Kurve |
|---|---|---|---|---|---|
| 1 | `das Element selbst` | drehen 90° | 300 ms | 0 ms | outQuad |
| 2 | `das Element selbst` | drehen 0° | 0 ms | 0 ms | linear |

## `a-35` — x rot hover out

**Ausgelöst durch:** `MOUSE_OUT` auf `?`, `MOUSE_OUT` auf `?`

*Zeitbasiert*

| Schritt | Ziel | Effekt | Dauer | Verzög. | Kurve |
|---|---|---|---|---|---|
| 1 | `das Element selbst` | drehen 90° | 300 ms | 0 ms | outQuad |
| 2 | `das Element selbst` | drehen 0° | 0 ms | 0 ms | linear |

## `a-36` — open pop up

**Ausgelöst durch:** `MOUSE_CLICK` auf `?`

*Zeitbasiert*

| Schritt | Ziel | Effekt | Dauer | Verzög. | Kurve |
|---|---|---|---|---|---|
| 1 | `.info-pop-up` | Anzeige: block | 0 ms | 0 ms | linear |
| 1 | `.info-pop-up` | Hintergrund rgb(0,0,0) | 0 ms | 0 ms | linear |
| 2 | `.info-pop-up` | Hintergrund rgb(14,0,10) | 500 ms | 0 ms | linear |
| 2 | `.bubble_container` | verschieben x=0vw y=0 | 800 ms | 400 ms | outCubic |

## `a-37` — info_in

**Ausgelöst durch:** `MOUSE_CLICK` auf `?`

*Zeitbasiert*

| Schritt | Ziel | Effekt | Dauer | Verzög. | Kurve |
|---|---|---|---|---|---|
| 1 | `.informer` | Größe b=100% h=0px | 500 ms | 0 ms | linear |
| 1 | `.close_info-button` | skalieren 0 | 500 ms | 0 ms | easeOut |
| 2 | `.informer` | Größe b=100% h=– | 1000 ms | 1000 ms | easeInOut |
| 3 | `.close_info-button` | skalieren 1 | 500 ms | 0 ms | easeOut |

## `a-38` — info_out

**Ausgelöst durch:** `MOUSE_CLICK` auf `?`

*Zeitbasiert*

| Schritt | Ziel | Effekt | Dauer | Verzög. | Kurve |
|---|---|---|---|---|---|
| 1 | `.close_info-button` | skalieren 0 | 500 ms | 0 ms | outQuad |
| 2 | `.informer` | Größe b=100% h=0px | 1000 ms | 0 ms | easeInOut |

## `a-7` — logo in out dummy

**Ausgelöst durch:** `PAGE_SCROLL` auf `?`

*Scroll-gebunden*

| bei % | Ziel | Effekt |
|---|---|---|
| 0 | `das Element selbst` | skalieren 1 |
| 0 | `das Element selbst` | skalieren 1 |
| 0 | `das Element selbst` | verschieben x=0 y=0px |
| 0 | `.lottie-animation-2` | Lottie-Position 0 |
| 0 | `das Element selbst` | Deckkraft 1 |
| 10 | `das Element selbst` | skalieren 1.3 |
| 10 | `das Element selbst` | skalieren 0.8 |
| 10 | `das Element selbst` | verschieben x=0 y=0vh |
| 10 | `.lottie-animation-2` | Lottie-Position 99 |
| 10 | `das Element selbst` | verschieben x=0 y=30px |
| 10 | `das Element selbst` | Deckkraft 0 |
| 10.0001 | `das Element selbst` | verschieben x=0 y=-1000vh |

## `a-8` — leistung scroll

**Ausgelöst durch:** `SCROLLING_IN_VIEW` auf `?`, `SCROLLING_IN_VIEW` auf `?`

*Scroll-gebunden*

| bei % | Ziel | Effekt |
|---|---|---|
| 0 | `.accordion-header.js-accordion-header (Kinder)` | skalieren 0.9 |
| 0 | `das Element selbst` | Hintergrund rgb(241,241,241) |
| 30 | `.accordion-header.js-accordion-header (Kinder)` | skalieren 1 |
| 30 | `das Element selbst` | Hintergrund rgb(255,255,255) |
| 75 | `.accordion-header.js-accordion-header (Kinder)` | skalieren 1 |
| 75 | `das Element selbst` | Hintergrund rgb(255,255,255) |
| 100 | `.accordion-header.js-accordion-header (Kinder)` | skalieren 0.9 |
| 100 | `das Element selbst` | Hintergrund rgb(241,241,241) |
