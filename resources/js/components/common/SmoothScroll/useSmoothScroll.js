import { useEffect } from 'react'
import Lenis from 'lenis'

export const useSmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // Listen for lenis-stopped class on html to stop/start scrolling
    const observer = new MutationObserver(() => {
      if (document.documentElement.classList.contains('lenis-stopped')) {
        lenis.stop()
      } else {
        lenis.start()
      }
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      observer.disconnect()
    }
  }, [])
}
