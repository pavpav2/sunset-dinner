// src/components/ui/parallax-hero.tsx
// Adaptace Osmo parallax komponenty pro Sunset Dinner Party
// Vrstvy: nebe (fotka) → titulek + CTA → město s alpha fade (popředí)
'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

export function ParallaxHero() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    let tl: gsap.core.Timeline | undefined;
    if (triggerElement) {
      tl = gsap.timeline({
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
        tl!.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          { yPercent: layerObj.yPercent, ease: 'none' },
          idx === 0 ? undefined : '<'
        );
      });
    }

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (triggerElement) gsap.killTweensOf(triggerElement);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
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
                {/* EDIT: GoOut URL */}
                <a className="hero-btn" href="https://goout.net" target="_blank" rel="noopener noreferrer">
                  Vstupenky na GoOut
                </a>
                <p className="hero-date">Středa 9. 9. od 18:00</p>
              </div>
              <p className="hero-meta">Kurátorované menu · Nápoje · DJs</p>
            </div>
            {/* Vrstva 3 — město, popředí s alpha fade */}
            <img
              src="/parallax-assets/layer-city.png"
              loading="eager"
              data-parallax-layer="3"
              alt=""
              className="parallax__layer-img parallax__layer-img--front"
            />
          </div>
          <div className="parallax__fade" />
        </div>
      </section>
    </div>
  );
}

/* ============ Doprovodné styly (globals.css nebo CSS modul) ============
   Tokeny kampaně — závazné:
   --cream:#F8EEDD; --brown:#472418; --terracotta:#BE5433; --terracotta-hover:#9C3F20;
   Fonty: Anton (titulky, datum), Archivo (vše ostatní) — Google Fonts, subset latin-ext.

.parallax__header{position:relative;height:100svh;overflow:hidden}
.parallax__visuals,.parallax__layers{position:absolute;inset:0}
.parallax__layer-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center bottom}
.parallax__layer-img--front{top:auto;bottom:0;height:auto}
.parallax__layer-title{
  position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;
  padding:0 clamp(1.25rem,4vw,3rem);color:#F8EEDD;
  text-shadow:0 1px 24px rgba(40,15,5,.35);
}
.hero-brand{font:600 .78rem/1 Archivo;letter-spacing:.3em;text-transform:uppercase;margin-bottom:1rem}
.parallax__title{
  font-family:Anton;font-weight:400;text-transform:uppercase;
  font-size:clamp(64px,12vw,200px);line-height:.9;letter-spacing:.01em;margin:0;
}
.hero-sun{
  display:inline-block;width:.34em;height:.34em;border-radius:50%;margin-left:.06em;
  vertical-align:baseline;
  background:radial-gradient(circle at 42% 38%,#F7D492 0%,#ECA06C 55%,#C7663F 100%);
}
.hero-cta{display:flex;align-items:center;gap:1.8rem;flex-wrap:wrap;margin-top:2.2rem}
.hero-btn{
  background:#BE5433;color:#F8EEDD;font:700 1rem Archivo;text-decoration:none;
  border-radius:999px;padding:24px 52px;transition:background .15s;
}
.hero-btn:hover{background:#9C3F20}
.hero-date{font-family:Anton;text-transform:uppercase;font-size:clamp(1.4rem,2.6vw,2.1rem)}
.hero-meta{font:600 .78rem/1 Archivo;letter-spacing:.3em;text-transform:uppercase;margin-top:1.1rem;opacity:.85}
.parallax__fade{
  position:absolute;left:0;right:0;bottom:0;height:22vh;pointer-events:none;
  background:linear-gradient(180deg,transparent, #1E0E06);
}
@media (max-width:768px){
  .hero-cta{width:100%}
  .hero-btn{width:100%;text-align:center;min-height:56px;padding:16px 24px;display:flex;align-items:center;justify-content:center}
}
======================================================================== */
