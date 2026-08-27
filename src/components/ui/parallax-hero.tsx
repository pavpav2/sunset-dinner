// src/components/ui/parallax-hero.tsx
// Adaptace Osmo parallax komponenty pro Sunset Dinner Party
// Vrstvy: nebe (fotka) → titulek + CTA → město s alpha fade (popředí)
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../lib/smooth-scroll';
import { ADDRESS_LINE_1, ADDRESS_LINE_2, GOOUT_URL, trackCta } from '../../site';

export function ParallaxHero() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);
    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');
    if (!triggerElement) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: '0% 0%',
          end: '100% 0%',
          scrub: 0,
        },
      });

      const layers = [
        { layer: '1', yPercent: 60 }, // nebe — největší hloubka
        { layer: '2', yPercent: 35 }, // titulek + CTA
        { layer: '3', yPercent: 10 }, // město — popředí
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          { yPercent: layerObj.yPercent, ease: 'none' },
          idx === 0 ? undefined : '<'
        );
      });
    }, parallaxRef);

    // Lenis se startuje jednou globálně v main.tsx, ne tady.
    return () => ctx.revert();
  }, []);

  return (
    <div className="parallax" ref={parallaxRef}>
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div data-parallax-layers className="parallax__layers">
            {/* Vrstva 1 — nebe (celá fotka) */}
            <img
              src="/parallax-assets/layer-sky.jpg"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width={1600}
              height={2133}
              data-parallax-layer="1"
              alt=""
              className="parallax__layer-img"
            />
            {/* Vrstva 2 — titulek + CTA */}
            <div data-parallax-layer="2" className="parallax__layer-title">
              <p className="hero-brand">Střecha Radost × Bistro Karel</p>
              <h1 className="parallax__title">
                Sunset Dinner<br />Party<span className="hero-sun" aria-hidden="true" />
              </h1>
              <div className="hero-cta">
                <a
                  className="hero-btn"
                  href={GOOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCta('hero')}
                >
                  Vstupenky na GoOut
                </a>
                <p className="hero-date">Středa 9. 9. od 18:00</p>
              </div>
              <p className="hero-meta">Kurátorované menu · Nápoje · DJs</p>
            </div>
            {/* Vrstva 3 — město, popředí s alpha fade */}
            <img
              src="/parallax-assets/layer-city.webp"
              loading="eager"
              decoding="async"
              width={1600}
              height={959}
              data-parallax-layer="3"
              alt=""
              className="parallax__layer-img parallax__layer-img--front"
            />
          </div>
          <div className="parallax__fade" />
        </div>

        <div className="hero-topbar">
          <div className="logos">
            {/* EDIT: nahradit textová loga soubory (dodá Pavel):
                <img src="/logos/radost-logo.png" alt="Střecha Radost" style={{height:46}} />
                <span className="x" aria-hidden="true">×</span>
                <img src="/logos/karel-logo.avif" alt="Bistro Karel" style={{height:40, mixBlendMode:'multiply'}} />
                Pozn.: mix-blend-mode:multiply je navržený na světlé podklady — na fotce
                v heru vyjde tmavě, tady spíš použít verzi loga v krémové. */}
            <span className="logo-text">Radost</span>
            <span className="x" aria-hidden="true">×</span>
            <span className="logo-text">Bistro Karel</span>
          </div>
          <address className="meta">
            {ADDRESS_LINE_1}
            <br />
            {ADDRESS_LINE_2}
          </address>
        </div>
      </section>
    </div>
  );
}
