import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Uživatel si přeje omezený pohyb → parallax i Lenis se vypnou. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

let lenis: Lenis | null = null;

/**
 * Lenis se inicializuje JEDNOU globálně (volá se z main.tsx), ne v komponentě —
 * scrollových efektů může být na stránce víc a všechny musí jet nad jedním
 * scrollem. Opakované volání vrátí existující instanci.
 */
export function initSmoothScroll(): Lenis | null {
  if (prefersReducedMotion()) return null;
  if (lenis) return lenis;

  gsap.registerPlugin(ScrollTrigger);
  lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);

  const raf = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
