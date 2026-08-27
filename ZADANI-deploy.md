# ZADÁNÍ: Sunset Dinner Party — React web s parallax herem + deploy

## Cíl
Web na **https://sunset.strecharadost.cz**. Hero = Osmo-style parallax z reálné fotky západu nad Prahou (GSAP + Lenis), zbytek stránky přebírá obsah a vizuál ze `sunset-dinner-party-v2.html`.

## Vstupní soubory (vedle tohoto zadání)
- `parallax-hero.tsx` — hotová hero komponenta (adaptace Osmo), styly v komentáři na konci souboru
- `parallax-assets/layer-sky.jpg` — vrstva nebe (celá fotka)
- `parallax-assets/layer-city.png` — vrstva města, alpha fade nahoře (popředí)
- `vyhled-zapad.jpg` — originál fotky (sekce Místo)
- `sunset-dinner-party-v2.html` — REFERENCE pro sekce pod herem: Menu, Nápoje, Místo, Noc, Footer — obsah, gradientový průběh (krém → zlatá → meruňková → terakota → noc), tokeny, texty. Portovat 1:1 do JSX.

## Stack
1. Scaffold: Vite + React + TypeScript + Tailwind (`npm create vite@latest sunset-dinner -- --template react-ts`, pak Tailwind dle oficiálního průvodce). shadcn struktura: komponenty do `src/components/ui/`.
2. `npm i gsap @studio-freight/lenis`
3. Fonty: Google Fonts Anton + Archivo, subset latin-ext, display=swap.
4. `parallax-hero.tsx` → `src/components/ui/parallax-hero.tsx`; styly z komentáře → `src/index.css`. Assety → `public/parallax-assets/`.

## Stránka
- `<ParallaxHero/>` nahoře. Pod ním sekce z v2 HTML jako komponenty (`MenuSection`, `DrinksSection`, `PlaceSection`, `NightSection`, `Footer`) — texty, gradienty a tabulový SVG pás převzít beze změny. Reveal-on-scroll může zůstat na IntersectionObserver, netahat další knihovny.
- Hero přechází přes `.parallax__fade` do tmavé, první sekce pod herem tedy začíná TMAVÁ a stránka se scrollem ZESVĚTLUJE do krémové u Menu, pak jede původní západový průběh. Alternativa (jednodušší): fade heru překlopit do krémové a průběh nechat přesně jako ve v2 — rozhodni podle toho, co vypadá líp, obojí je OK.
- Lenis inicializovat JEDNOU globálně (ne v komponentě, pokud bude scroll efektů víc).

## Závazné (nesahat)
- Tokeny: #F8EEDD / #472418 / #BE5433 / #9C3F20. Fonty Anton + Archivo, nic dalšího.
- Texty: „SUNSET DINNER PARTY", „Střecha Radost × Bistro Karel", „Středa 9. 9. od 18:00", „Kurátorované menu · Nápoje · DJs", adresa „nám. Winstona Churchilla 2, Praha 3 — Žižkov".
- Cena se NIKDE neuvádí. Sekce Místo se jmenuje „Střecha Radost".
- prefers-reduced-motion: parallax i Lenis se vypnou (komponenta to řeší, zachovat).

## Doplnit před launchem (hledej EDIT)
- [ ] GoOut URL (hero + footer) — dodá Pavel; bez ní nasadit, ale nepouštět promo
- [ ] Loga radost-logo.png (46 px) + karel-logo.avif (40 px, mix-blend-mode:multiply) — dodá Pavel
- [ ] Mapa (Google Maps na adresu), IG Střechy Radost, druhá fotka do Místa
- [ ] OG obraz: provizorně 1200×630 z fotky + titulek Anton; finálně GoOut cover 1920×1005
- [ ] Plausible (doména sunset.strecharadost.cz, event klik na obě CTA); bez účtu → TODO komentář

## Deploy
1. Public repo `sunset-dinner` (gh CLI), build `npm run build` → GitHub Pages z `dist` (gh-pages action nebo branch). Soubor `public/CNAME` s obsahem `sunset.strecharadost.cz`.
2. Vypsat Pavlovi DNS záznam pro Wix (Domény → strecharadost.cz → Spravovat DNS):
   `CNAME | host: sunset | hodnota: <user>.github.io | TTL 1h`
3. Po propsání DNS: repo Settings → Pages → Custom domain + Enforce HTTPS.

## Výkon a akceptace
- layer-sky.jpg ≤ 300 kB (je), layer-city.png zvážit WebP s alfou (~zmenší 1.4 MB výrazně) — udělej.
- LCP < 2.5 s na 4G, žádné console errory, mobil 375 px OK, scrub parallax plynulý, reduced-motion = statická stránka.
- https://sunset.strecharadost.cz běží, CTA vede na GoOut.
