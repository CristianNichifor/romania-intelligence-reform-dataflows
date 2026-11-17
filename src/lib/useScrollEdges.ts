import { useEffect, useState, type RefObject } from 'react'

export interface ScrollEdges {
  /** Content is hidden before the visible part (scrolled away to the left). */
  start: boolean
  /** Content is hidden after the visible part (more to the right). */
  end: boolean
}

export function scrollEdges(scrollLeft: number, scrollWidth: number, clientWidth: number): ScrollEdges {
  // One pixel of slack: fractional layout widths never quite reach the end.
  return { start: scrollLeft > 1, end: scrollLeft + clientWidth < scrollWidth - 1 }
}

/** Which sides of a sideways scroller still hide content, kept current on scroll and resize. */
export function useScrollEdges(ref: RefObject<HTMLElement | null>): ScrollEdges {
  const [edges, setEdges] = useState<ScrollEdges>({ start: false, end: false })
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const update = () => {
      const next = scrollEdges(element.scrollLeft, element.scrollWidth, element.clientWidth)
      setEdges((current) => (current.start === next.start && current.end === next.end ? current : next))
    }
    update()
    element.addEventListener('scroll', update, { passive: true })
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(element)
    if (element.firstElementChild) observer?.observe(element.firstElementChild)
    return () => {
      element.removeEventListener('scroll', update)
      observer?.disconnect()
    }
  }, [ref])
  return edges
}
