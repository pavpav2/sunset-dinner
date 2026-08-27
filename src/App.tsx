import { ParallaxHero } from './components/ui/parallax-hero';
import { SunsetTransition } from './components/SunsetTransition';
import { MenuSection } from './components/MenuSection';
import { DrinksSection } from './components/DrinksSection';
import { PlaceSection } from './components/PlaceSection';
import { NightSection } from './components/NightSection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <>
      <ParallaxHero />
      <SunsetTransition />
      <main>
        <MenuSection />
        <DrinksSection />
        <PlaceSection />
        <NightSection />
      </main>
      <Footer />
    </>
  );
}
