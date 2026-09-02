import { useEffect, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { step, VIEW_EASE } from './motion'
import { useLang } from './i18n'
import LangToggle from './LangToggle'

type Tone = {
  bg: string
  ink: string
  accent: string
  /** Dark enough to read on the balloon, whatever the ground is doing. */
  pop: string
}

const PALETTES: Tone[] = [
  { bg: '#efeee9', ink: '#1f1f1d', accent: '#d8451a', pop: '#b8360f' },
  { bg: '#14504a', ink: '#f4f2ec', accent: '#f2b134', pop: '#0f3d38' },
  { bg: '#f3c74d', ink: '#22201a', accent: '#b3311a', pop: '#9e2a13' },
  { bg: '#1b3a5c', ink: '#f1efe8', accent: '#f28f3b', pop: '#173049' },
  { bg: '#b3311a', ink: '#fdf6ec', accent: '#f3c74d', pop: '#7d2411' },
]

const COPIES = [0, 1, 2, 3]

/** Balloons stay paper-white whatever the ground is doing. */
const BUBBLE = '#fdfcf7'
const BUBBLE_INK = '#1f1f1d'

/** The tab icon, repainted in whatever palette the page is wearing. */
function faviconFor(tone: Tone) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${tone.bg}"/><text x="32" y="33" fill="${tone.ink}" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="-1" text-anchor="middle" dominant-baseline="central" textLength="52" lengthAdjust="spacingAndGlyphs">&lt;NM&gt;</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/** Hand-jittered starburst: alternating long and short spikes, off-machine. */
const BURST_SHAPE =
  'polygon(50.0% 2.4%, 57.3% 20.4%, 73.3% 5.5%, 69.9% 27.5%, 90.6% 22.0%, 79.6% 38.8%, 95.1% 44.5%, 82.1% 53.9%, 92.4% 66.1%, 76.3% 68.2%, 80.2% 84.1%, 64.0% 76.7%, 61.6% 97.0%, 50.0% 84.1%, 39.0% 94.7%, 35.6% 77.3%, 16.8% 87.4%, 21.4% 69.7%, 3.6% 67.6%, 18.4% 53.8%, 0% 43.6%, 22.0% 39.4%, 7.3% 20.5%, 29.3% 26.6%, 28.6% 9.1%, 42.7% 20.6%)'

/** Same hex with an alpha channel, for the gradient stops. */
function withAlpha(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * One object on show at a time. They live in the bottom-left corner in normal
 * flow rather than floating around the portrait: absolute props could not be
 * placed to clear the figure, the marquee and the balloon at every width.
 */
const PROPS = [
  { name: 'pass-music', tilt: '-6deg', seconds: 7.5, w: 299, h: 300 },
  { name: 'pass-food', tilt: '-4deg', seconds: 8.4, w: 372, h: 326 },
  { name: 'pass-comics', tilt: '5deg', seconds: 6.2, w: 411, h: 573 },
]

export default function Secret({
  active,
  onBack,
}: {
  active: boolean
  onBack: () => void
}) {
  const { t } = useLang()
  const [swatch, setSwatch] = useState(() =>
    Math.floor(Math.random() * PALETTES.length),
  )
  const [slot, setSlot] = useState(0)
  const [tipOpen, setTipOpen] = useState(true)
  const tone = PALETTES[swatch]
  const prop = PROPS[slot % PROPS.length]
  const copy = t.secret.props[prop.name as keyof typeof t.secret.props]

  /**
   * A fresh palette on every visit, never the one just seen: the offset trick
   * draws from the other four, so two openings in a row always differ.
   */
  useEffect(() => {
    if (active) {
      setSwatch(
        (prev) =>
          (prev + 1 + Math.floor(Math.random() * (PALETTES.length - 1))) %
          PALETTES.length,
      )
      setTipOpen(true)
    }
  }, [active])

  /**
   * The next object is fetched while this one is on show, so tapping
   * through swaps an image that is already decoded rather than waiting
   * on the network.
   */
  useEffect(() => {
    if (!active) return
    const next = PROPS[(slot + 1) % PROPS.length]
    const warm = new Image()
    warm.src = `/${next.name}.webp`
  }, [active, slot])

  /**
   * Leaving with a balloon open used to flash it over the home view for the
   * length of the crossfade. Put it away first, then travel.
   */
  const leaving = useRef<number>()
  useEffect(() => () => window.clearTimeout(leaving.current), [])

  const leave = () => {
    if (!tipOpen) {
      onBack()
      return
    }
    setTipOpen(false)
    leaving.current = window.setTimeout(onBack, 280)
  }

  /**
   * The tab follows the palette while this page is open, and the file-backed
   * icon comes back on the way out.
   */
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!link) return

    if (active) link.href = faviconFor(tone)
    else link.href = '/favicon.svg'

    return () => {
      link.href = '/favicon.svg'
    }
  }, [active, tone])

  /** Escape dismisses the balloon, like a click anywhere off the object. */
  useEffect(() => {
    if (!tipOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTipOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tipOpen])

  const paint = `background-color 600ms ${VIEW_EASE}, color 600ms ${VIEW_EASE}`

  return (
    <div
      className="relative h-full w-full overflow-hidden font-hn"
      style={{ backgroundColor: tone.bg, color: tone.ink, transition: paint }}
      onClick={() => setTipOpen(false)}
    >
      {/* Sunburst: a wheel far wider than the viewport, so no edge shows */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[220vmax] w-[220vmax] overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="ray-spin absolute left-1/2 top-1/2 h-full w-full"
          style={{
            backgroundImage: `repeating-conic-gradient(from 0deg, ${withAlpha(
              tone.accent,
              0.16,
            )} 0deg 7deg, ${withAlpha(tone.accent, 0)} 7deg 14deg)`,
            transition: `background-image 600ms ${VIEW_EASE}`,
          }}
        />
      </div>

      {/* Ben-Day dots over the top */}
      <div
        className="halftone-drift pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(${withAlpha(
            tone.pop,
            0.22,
          )} 1.6px, transparent 1.7px)`,
          backgroundSize: '16px 16px',
          transition: `background-image 600ms ${VIEW_EASE}`,
        }}
      />

      {/* Comic burst, balancing the copy on the right */}
      <div
        className="pointer-events-none absolute left-[4%] top-[26%] z-10 hidden h-40 w-40 sm:block lg:left-[7%] lg:h-52 lg:w-52"
        style={step(active, 520, '24px')}
        aria-hidden="true"
      >
        <div
          className="burst-pulse flex h-full w-full items-center justify-center"
          style={{
            backgroundColor: tone.accent,
            clipPath: BURST_SHAPE,
            transition: `background-color 600ms ${VIEW_EASE}`,
          }}
        >
          <span
            className="text-2xl font-bold uppercase tracking-tight lg:text-3xl"
            style={{ color: tone.pop, transform: 'rotate(-6deg)' }}
          >
            Pow!
          </span>
        </div>
      </div>

      {/* Marquee, same loop as the hero */}
      <div
        className="absolute inset-x-0 top-[16vh] z-10 overflow-hidden sm:top-[14vh]"
        style={step(active, 300, '28px')}
        aria-hidden="true"
      >
        <div className="marquee flex w-max whitespace-nowrap pb-[0.25em] text-[16vh] leading-none sm:text-[26vh]">
          {COPIES.map((i) => (
            <span
              key={i}
              className="pr-[6vw]"
              dangerouslySetInnerHTML={{ __html: t.secret.marquee }}
            />
          ))}
        </div>
      </div>

      {/* Rule */}
      <div
        className="absolute inset-x-6 bottom-[5.5rem] z-10 hidden h-0.5 origin-left sm:inset-x-10 sm:bottom-28 sm:block"
        style={{
          backgroundColor: tone.accent,
          transform: active ? 'scaleX(1)' : 'scaleX(0)',
          transition: `transform 1100ms ${VIEW_EASE}, background-color 600ms ${VIEW_EASE}`,
          transitionDelay: active ? '600ms' : '0ms',
        }}
      />

      {/* Portrait, in colour, anchored to the base */}
      <div
        className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center"
        style={step(active, 350, '4vh')}
      >
        <picture>
          <source srcSet="/portrait-alt.webp" type="image/webp" />
          <img
            src="/portrait-alt.png"
            alt=""
            aria-hidden="true"
            width={433}
            height={577}
            loading="lazy"
            decoding="async"
            className="h-[60vh] w-auto object-contain object-bottom sm:h-[72vh]"
            style={{
              filter: `drop-shadow(14px 14px 0 ${tone.accent})`,
              transition: `filter 600ms ${VIEW_EASE}`,
            }}
          />
        </picture>
      </div>

      {/* Footer scrim: the ground fading up, so the copy always has contrast
          over the portrait. Painted in the palette, since a black veil would
          only work on the dark grounds. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-48 sm:hidden"
        style={{
          backgroundImage: `linear-gradient(to top, ${tone.bg} 0%, ${withAlpha(
            tone.bg,
            0.85,
          )} 45%, ${withAlpha(tone.bg, 0)} 100%)`,
          transition: `background-image 600ms ${VIEW_EASE}`,
        }}
      />

      {/* Top chrome: the way out, where the brand sits on the serious side */}
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-6 px-6 pt-6 sm:px-10 sm:pt-8">
        <button
          type="button"
          onClick={leave}
          className="group flex items-center gap-2 text-lg font-bold tracking-wide transition-opacity duration-300 hover:opacity-60"
          style={{ ...step(active, 450, '16px'), color: tone.accent }}
        >
          <ArrowLeft
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          {t.secret.back}
        </button>

        <div className="flex flex-col items-end gap-1.5">
          <p
            className="text-xs font-bold uppercase tracking-[0.2em]"
            style={{ ...step(active, 500, '16px'), color: tone.accent }}
          >
            {t.secret.label}
          </p>

          <LangToggle
            color={tone.accent}
            className="font-bold"
            style={step(active, 560, '16px')}
          />
        </div>
      </div>

      {/* Bottom: the object on show, and the hint. Both in flow, so nothing
          can ever land on the portrait or run off an edge. */}
      <div
        className="absolute inset-x-0 bottom-0 z-30 px-6 pb-5 [--obj-h:7rem] [--obj-w:5rem] sm:px-10 sm:pb-8 sm:[--obj-h:9rem] sm:[--obj-w:6rem]"
        style={step(active, 600, '20px')}
      >
        {/* The balloon owns a full line: sharing one with the caption left it
            about 165px wide on a phone. */}
        {/* object-contain leaves the short objects sitting at the base of a
            box sized for the tallest one. The balloon takes up that slack
            with a transform, so it hugs whatever is on show without the box
            (and the layout) ever changing height. */}
        <div
          className="max-w-full sm:max-w-xs"
          style={{
            transform:
              'translateY(max(0px, calc(var(--obj-h) - var(--obj-w) * ' +
              prop.h / prop.w +
              ')))',
          }}
        >
          <div
            key={prop.name}
            className="anim-fade-up relative mb-4 rounded-[22px] px-4 py-3 text-left"
            style={{
              backgroundColor: BUBBLE,
              color: BUBBLE_INK,
              border: `3px solid ${tone.pop}`,
              boxShadow: `4px 5px 0 ${tone.pop}`,
              animationDuration: '450ms',
              opacity: tipOpen ? 1 : 0,
              visibility: tipOpen ? 'visible' : 'hidden',
              transition: `opacity 260ms ${VIEW_EASE}, visibility 0s linear ${
                tipOpen ? '0ms' : '260ms'
              }`,
            }}
          >
            <p
              className="text-[11px] uppercase tracking-[0.2em]"
              style={{ color: tone.pop }}
            >
              {copy.title}
            </p>
            <p className="mt-2 text-xs leading-relaxed sm:text-sm">
              {copy.text}
            </p>

            {/* Tail, pointing down at the object */}
            <span
              aria-hidden="true"
              className="absolute left-7 top-full h-0 w-0"
              style={{
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: `16px solid ${tone.pop}`,
              }}
            />
            <span
              aria-hidden="true"
              className="absolute left-7 top-full h-0 w-0"
              style={{
                marginTop: '-4px',
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: `16px solid ${BUBBLE}`,
              }}
            />
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 sm:gap-6">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (tipOpen) setSlot((n) => n + 1)
              else setTipOpen(true)
            }}
            aria-expanded={tipOpen}
            aria-label={copy.title}
            style={{ width: 'var(--obj-w)', height: 'var(--obj-h)' }}
            className="block cursor-pointer outline-none transition-opacity duration-300 hover:opacity-80 focus-visible:opacity-70"
          >
            <picture>
              <source srcSet={`/${prop.name}.webp`} type="image/webp" />
              <img
                key={prop.name}
                src={`/${prop.name}.png`}
                alt=""
                aria-hidden="true"
                width={prop.w}
                height={prop.h}
                decoding="async"
                className="float-bob h-full w-full object-contain object-bottom drop-shadow-[0_14px_24px_rgba(0,0,0,0.3)]"
                style={
                  {
                    '--tilt': prop.tilt,
                    animationDuration: `${prop.seconds}s`,
                  } as React.CSSProperties
                }
              />
            </picture>
          </button>

          <p
            className="shrink-0 whitespace-nowrap text-right text-[11px] font-bold leading-relaxed sm:text-sm"
            style={{ ...step(active, 750), color: tone.accent }}
          >
            {t.secret.hint}
          </p>
        </div>
      </div>
    </div>
  )
}
