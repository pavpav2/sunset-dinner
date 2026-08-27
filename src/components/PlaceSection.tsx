import { Reveal } from './Reveal';
import { ADDRESS_LINE_1, ADDRESS_LINE_2, MAP_URL } from '../site';

export function PlaceSection() {
  return (
    <section className="s-place on-dark">
      <Reveal className="inner">
        <div>
          <p className="meta" style={{ marginBottom: '1rem' }}>
            Místo
          </p>
          <h2>Střecha Radost</h2>
          <address className="addr">
            {ADDRESS_LINE_1}
            <br />
            {ADDRESS_LINE_2}
          </address>
          {/* EDIT: odkaz na mapu — viz MAP_URL v src/site.ts */}
          <a href={MAP_URL} target="_blank" rel="noopener noreferrer">
            Otevřít mapu ↗
          </a>
        </div>
        {/* Fotky ze strecharadost.cz — původ viz _source/photos/PUVOD.md */}
        <div className="photos">
          <img
            src="/vyhled-zapad.jpg"
            alt="Výhled ze Střechy Radost na Pražský hrad při západu slunce"
            loading="lazy"
            decoding="async"
            width={1100}
            height={1467}
          />
          <img
            src="/fotky/radost-strecha.jpg"
            alt="Střecha Radost při zlaté hodině — lidé na terase nad Žižkovem"
            loading="lazy"
            decoding="async"
            width={1100}
            height={733}
          />
          <img
            src="/fotky/radost-catering.jpg"
            alt="Obsluha chystá jídlo na Střeše Radost"
            loading="lazy"
            decoding="async"
            width={1100}
            height={733}
          />
        </div>
      </Reveal>
    </section>
  );
}
