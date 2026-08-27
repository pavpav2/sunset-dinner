# Sunset Dinner Party

Jednostránkový web pro **Sunset Dinner Party — Střecha Radost × Bistro Karel**,
středa 9. 9. od 18:00, nám. Winstona Churchilla 2, Praha 3 — Žižkov.

Produkce: <https://dinner.strecharadost.cz>

## Stack

Vite + React + TypeScript + Tailwind v4, GSAP ScrollTrigger + Lenis pro parallax hero.
Reveal-on-scroll jede na IntersectionObserveru, žádná další knihovna.

```bash
npm install
npm run dev      # vývoj
npm run build    # produkční build do dist/
npm run preview  # náhled buildu
npm run lint
npm run assets   # přegeneruje obrázky v public/ ze zdrojů v _source/
```

## Struktura

```
_source/                     originály od klienta (fotky, referenční v2 HTML, původní komponenta)
scripts/optimize-assets.mjs  příprava obrázků do public/ (WebP, zmenšení, OG obraz)
src/site.ts                  VŠECHNY odkazy k doplnění před launchem + Plausible helper
src/lib/smooth-scroll.ts     Lenis — jedna globální instance, start v main.tsx
src/components/ui/parallax-hero.tsx
src/components/              MenuSection, DrinksSection, PlaceSection, NightSection, Footer,
                             SunsetTransition (přechod hero → Menu), Reveal
```

## Obrázky

`npm run assets` bere zdroje z `_source/` a zapisuje do `public/`. Výstupy jsou
verzované v gitu, aby build v CI nepotřeboval `sharp` — po změně zdrojů je potřeba
skript pustit ručně a commitnout.

| výstup | velikost | pozn. |
|---|---|---|
| `parallax-assets/layer-sky.jpg` | 257 kB | 1600w, rozpočet 300 kB |
| `parallax-assets/layer-sky-1200.jpg` | 151 kB | 1200w pro telefony (srcset) |
| `parallax-assets/layer-city.webp` | 94 kB | 1600w, WebP s alfou místo 1,6MB PNG |
| `parallax-assets/layer-city-1200.webp` | 61 kB | 1200w pro telefony (srcset) |
| `vyhled-zapad.jpg` | 103 kB | zmenšeno na 1100 px |
| `og-image.jpg` | 45 kB | provizorní 1200×630, titulek vysázený z Antonu |

Obě vrstvy heru mají `srcset` 1200w/1600w a `<link rel=preload>` s odpovídajícím
`imagesrcset` — při změně jedné je potřeba upravit i druhou, jinak se stáhnou obě
varianty.

Anton (`scripts/fonts/`) je vendorovaný kvůli sázení OG obrazu — licence SIL OFL 1.1.

## Vizuální průběh

Hero ústí přes `.parallax__fade` do tmavé. Fotka má u spodní hrany setmělé město,
takže fade do krémové by ji zamlžil — stránka se proto pod herem rozsvěcí zpátky do
krému (`SunsetTransition`) a od sekce Menu jede původní západový průběh z v2 beze
změny: krém → zlatá → meruňková → terakota → noc. Panorama z v2 (věž + tabulový pás)
sedí na konci přechodu, tedy ve stejné pozici jako v referenci: silueta na krému
těsně nad Menu.

## Deploy

Push do `main` → GitHub Action (`.github/workflows/deploy.yml`) postaví `dist`
a nasadí na GitHub Pages. Custom doména je v `public/CNAME`.

## Výkon

Měřeno na profilu Lighthouse mobile (pomalá 4G 1,6 Mbps / 150 ms RTT, 4× brzda CPU),
buildem z `dist`:

| metrika | hodnota |
|---|---|
| FCP | 1,34 s |
| LCP | 1,34 s |
| initial JS | 204 kB / 64 kB gzip |

GSAP, ScrollTrigger i Lenis se dotahují dynamickým importem až po prvním
vykreslení — v initial chunku nejsou.

## Přístupnost

`prefers-reduced-motion: reduce` vypne parallax i Lenis a zobrazí reveal sekce
rovnou — ověřeno, stránka je pak statická.
