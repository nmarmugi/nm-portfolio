import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { VIEW_EASE, step } from './motion'

export type Tone = { bg: string; ink: string; accent: string }

/**
 * Shared shell for every non-home view: label, cream rule, content.
 *
 * The scroller is the outer box and the centering lives on an inner
 * `min-h-full` child: `justify-center` on the scroller itself would push
 * overflowing content past the top edge, where it can never be reached.
 *
 * `tone` swaps the palette without touching the layout, so a view can wear
 * different colours and still sit on exactly the same grid.
 */
export default function Section({
  label,
  active,
  tone,
  children,
}: {
  label: string
  active: boolean
  tone?: Tone
  children: ReactNode
}) {
  const scroller = useRef<HTMLDivElement>(null)

  /**
   * Every view keeps its own scroller, so a section left halfway down would
   * come back halfway down. Rewind on entry, while the layer is still at
   * opacity 0 and the jump cannot be seen.
   */
  useEffect(() => {
    if (active) scroller.current?.scrollTo({ top: 0 })
  }, [active])

  const colours = tone
    ? {
        backgroundColor: tone.bg,
        color: tone.ink,
        transition: `background-color 600ms ${VIEW_EASE}, color 600ms ${VIEW_EASE}`,
      }
    : undefined

  return (
    <div
      ref={scroller}
      className="h-full w-full overflow-y-auto overscroll-contain"
      style={colours}
    >
      <div
        className={`flex min-h-full flex-col justify-center px-6 pb-24 pt-28 font-hn sm:px-10 sm:pb-28 sm:pt-32 ${
          tone ? '' : 'text-cream'
        }`}
      >
        <p
          className={`text-xs uppercase tracking-[0.2em] ${
            tone ? '' : 'text-cream/60'
          }`}
          style={{
            ...step(active, 250, '16px'),
            ...(tone ? { color: tone.accent } : null),
          }}
        >
          {label}
        </p>

        {/* Cream rule, mirrors the hero */}
        <div
          className={`mt-5 h-0.5 w-full origin-left ${
            tone ? '' : 'bg-cream'
          }`}
          style={{
            transform: active ? 'scaleX(1)' : 'scaleX(0)',
            transition: `transform 1100ms ${VIEW_EASE}, background-color 600ms ${VIEW_EASE}`,
            transitionDelay: active ? '330ms' : '0ms',
            ...(tone ? { backgroundColor: tone.accent } : null),
          }}
        />

        {children}
      </div>
    </div>
  )
}
