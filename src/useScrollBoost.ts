import { useEffect, useRef } from 'react'

/** Full-tilt extra speed, as a multiple of the marquee's resting pace. */
const MAX_BOOST = 7
/** Fraction of the energy that survives one second. Lower decays faster. */
const DECAY = 0.2
/** Wheel delta, in px, that fills the energy meter from empty. */
const WHEEL_TO_FULL = 900
const TOUCH_TO_FULL = 420
/** Palette steps crossed per second at full energy. */
const HUE_SPEED = 0.4
/** Peak strength of the colour wash over the flat grey. */
const WASH = 0.5

/** Deep, desaturated grounds. They tint the grey, they never light it up. */
const PALETTE = [
  [0xa8, 0x3a, 0x14], // rust
  [0x1d, 0x4e, 0x4a], // deep teal
  [0x8a, 0x62, 0x10], // ochre
  [0x6b, 0x1c, 0x1c], // oxblood
  [0x1e, 0x3a, 0x5f], // steel blue
  [0x4a, 0x54, 0x22], // olive
]

/** Blend between the two palette entries either side of `phase`. */
function washAt(phase: number) {
  const span = PALETTE.length
  const i = Math.floor(phase) % span
  const from = PALETTE[i]
  const to = PALETTE[(i + 1) % span]
  const k = phase - Math.floor(phase)
  const mix = from.map((c, n) => Math.round(c + (to[n] - c) * k))
  return `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`
}

/**
 * Turns scroll gestures on the home view into motion rather than navigation.
 *
 * The marquee keeps its own CSS loop untouched and its own direction; this
 * only adds extra travel on a wrapper above it, wrapped to the half-width so
 * the seam never shows. Energy builds with the gesture and bleeds off alone.
 */
export function useScrollBoost(enabled: boolean) {
  const marquee = useRef<HTMLDivElement>(null)
  const glow = useRef<HTMLDivElement>(null)
  const portraitAlt = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let energy = 0
    let offset = 0
    let phase = 0
    let last = performance.now()
    let frame = 0

    const charge = (amount: number) => {
      energy = Math.min(1, energy + amount)
    }

    const onWheel = (e: WheelEvent) =>
      charge(Math.abs(e.deltaY) / WHEEL_TO_FULL)

    let touchY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY
      charge(Math.abs(touchY - y) / TOUCH_TO_FULL)
      touchY = y
    }

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      energy *= Math.pow(DECAY, dt)

      const track = marquee.current
      if (track) {
        // One half of the duplicated track: the pattern repeats every half,
        // so wrapping there is invisible. Offset only ever grows, which keeps
        // the extra travel pointing the same way as the CSS loop.
        // Fractional width: scrollWidth rounds to whole px, and wrapping a
        // few tenths early nudges the pattern out of register every lap.
        const half = track.getBoundingClientRect().width / 2
        if (half > 0) {
          offset = (offset + (half / 30) * MAX_BOOST * energy * dt) % half
          track.style.transform = `translateX(${-offset}px)`
          // Speed reads as smear, the way a fast pan does on film.
          track.style.filter = `blur(${(energy * 2.4).toFixed(2)}px)`
        }
      }

      // The grey takes on colour while the name runs, and the hue keeps
      // walking, so no two bursts land on the same shade.
      if (glow.current) {
        phase += energy * HUE_SPEED * dt
        glow.current.style.backgroundColor = washAt(phase)
        glow.current.style.opacity = `${energy * WASH}`
      }

      // The colour frame surfaces early, so a short flick already shows it.
      if (portraitAlt.current) {
        portraitAlt.current.style.opacity = `${Math.min(1, energy * 1.8)}`
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      if (marquee.current) {
        marquee.current.style.transform = ''
        marquee.current.style.filter = ''
      }
      if (glow.current) glow.current.style.opacity = '0'
      if (portraitAlt.current) portraitAlt.current.style.opacity = '0'
    }
  }, [enabled])

  return { marquee, glow, portraitAlt }
}
