import type { ReactNode } from 'react'
import { VIEW_EASE } from './motion'

/**
 * One full-viewport view. Inactive layers stay mounted but inert, so the
 * swap is a pure crossfade with no unmount flash.
 * `exit` sets which way the layer travels when it is not the active one:
 * home lifts away, sections drop back down.
 */
export default function ViewLayer({
  active,
  exit = 'down',
  children,
}: {
  active: boolean
  exit?: 'up' | 'down'
  children: ReactNode
}) {
  const offset = exit === 'up' ? '-3vh' : '4vh'

  return (
    <div
      className={`absolute inset-0 z-10 ${active ? '' : 'pointer-events-none'}`}
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : `translateY(${offset})`,
        // `visibility` is what actually takes a hidden view out of the tab
        // order and out of the accessibility tree; opacity alone leaves every
        // link in it focusable. It flips only once the fade has finished.
        visibility: active ? 'visible' : 'hidden',
        transition: `opacity 600ms ${VIEW_EASE}, transform 600ms ${VIEW_EASE}, visibility 0s linear ${
          active ? '0ms' : '600ms'
        }`,
        transitionDelay: active ? '150ms' : '0ms',
      }}
      aria-hidden={!active}
    >
      {children}
    </div>
  )
}
