/** Uživatel si přeje omezený pohyb → parallax i Lenis se vypnou. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

let started = false;

/**
 * Lenis se inicializuje JEDNOU globálně (volá se z main.tsx), ne v komponentě —
 * scrollových efektů může být na stránce víc a všechny musí jet nad jedním
 * scrollem.
 *
 * GSAP i Lenis se dotahují dynamickým importem: hero je LCP prvek a nemá cenu
 * kvůli scrollovým efektům držet první vykreslení. Do doby, než chunk dojede,
 * je stránka normálně scrollovatelná nativně.
 */
export async function initSmoothScroll(): Promise<void> {
  if (prefersReducedMotion() || started) return;
  started = true;

  const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
    import('@studio-freight/lenis'),
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time: number) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}
