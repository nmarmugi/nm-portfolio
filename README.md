# nm-portfolio

Personal portfolio of **Nicola Marmugi**, front end developer based in Viareggio, Italy.

A single-viewport, editorial-styled site: no page scroll, no cards, one composition
per view. Sections swap in place with a crossfade instead of scrolling, and the whole
site is bilingual (English / Italian).

## Highlights

**Viewless navigation.** Home, About, Experience and Contact are four layers stacked
in the same viewport. Selecting one fades the current view up and out while the next
rises in behind it — the page never scrolls, and the chrome never re-animates.

**Scroll as motion, not navigation.** On the home view a scroll gesture feeds an
energy meter that decays on its own: the giant name accelerates, blurs with speed,
the portrait shifts from black and white to colour, and the flat grey takes on a
colour wash that never lands on the same hue twice.

**A hidden page.** Clicking the portrait opens an unlisted fifth view about what
happens off the clock — music, cooking, superhero comics — dressed in one of five
random palettes, with comic-book speech balloons, a halftone ground and a rotating
sunburst. The favicon repaints itself to match.

**Bilingual.** Every string lives in one dictionary. The language is picked from
`localStorage`, then from the browser, and switching it updates `<html lang>` and the
meta description along with the copy.

**Built to be found and to be used.** Open Graph and Twitter cards, JSON-LD `Person`
schema, `robots.txt` and a sitemap. Hidden views leave the tab order and the
accessibility tree, the drawer traps and restores focus, and every animation collapses
under `prefers-reduced-motion`.

## Stack

| | |
|---|---|
| Build | Vite 5 |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS 3 |
| Icons | lucide-react |
| Images | WebP with PNG fallback, generated with sharp |

No animation library: every transition is CSS, driven by React state or by a single
`requestAnimationFrame` loop for the scroll-energy effects.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # type-check, then bundle to dist/
npm run preview  # serve the production build locally
```

## Project structure

```
src/
  App.tsx           layout, view state, header, drawer
  ViewLayer.tsx     one full-viewport view, crossfade and inertness
  Section.tsx       shared shell for About / Experience / Contact
  About.tsx
  Experience.tsx
  Contact.tsx
  Secret.tsx        the hidden view: palettes, balloons, comic ground
  LangToggle.tsx
  i18n.tsx          every string, both languages, plus the language provider
  motion.ts         shared easing and the staggered-reveal helper
  useScrollBoost.ts scroll energy: marquee speed, blur, colour wash
  index.css         Tailwind layers and every keyframe
public/
  portrait.*        black and white cutout
  portrait-alt.*    the same frame in colour
  pass-*.*          the three objects on the hidden page
  og.jpg            social card
```

## Notes

- The site is served from a single HTML file; there is no router. Views are state.
- `index.html` carries the canonical URL, Open Graph tags and the JSON-LD block.
  Update the domain there if the site moves.
- Images are committed in both WebP and PNG. `<picture>` serves WebP and leaves the
  PNG as the fallback.

## Contact

- [nicolamarmugi.com](https://www.nicolamarmugi.com)
- [LinkedIn](https://www.linkedin.com/in/nicola-marmugi-2860b022a)
- [GitHub](https://github.com/nmarmugi)
- nicolamarmugi1@gmail.com
