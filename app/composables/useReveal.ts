/**
 * Scroll-reveal fallback (DESIGN.md §5). Call ONCE, in app.vue.
 *
 * Browsers with native scroll-driven animation (Chrome/Edge, Safari 26) reveal
 * [data-reveal] elements in motion.css alone. For the others we add `reveal-ready`
 * to <html> (which is what hides the elements) and an IntersectionObserver adds
 * `.is-revealed` as each one scrolls into view. Without this script nothing is ever
 * hidden, and with prefers-reduced-motion nothing is observed at all.
 */
export function useReveal() {
  const nuxtApp = useNuxtApp()

  onMounted(() => {
    const hasNativeReveal = CSS.supports('animation-timeline: view()')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (hasNativeReveal || prefersReducedMotion) return

    document.documentElement.classList.add('reveal-ready')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )

    // Pages change without a reload (home → privacy → home), so look for new elements after each navigation.
    const observeAll = () => {
      document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach((el) => observer.observe(el))
    }
    observeAll()
    nuxtApp.hook('page:finish', () => nextTick(observeAll))
  })
}
