/** Shared easing for drawer, view swaps and in-view staggers. */
export const VIEW_EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'

/**
 * Staggered rise for one element of a section.
 * Transitions, not keyframes, so the stagger replays on every entry.
 */
export function step(active: boolean, delay: number, distance = '24px') {
  return {
    opacity: active ? 1 : 0,
    transform: active ? 'translateY(0)' : `translateY(${distance})`,
    transition: `opacity 700ms ${VIEW_EASE}, transform 700ms ${VIEW_EASE}`,
    transitionDelay: active ? `${delay}ms` : '0ms',
  }
}
