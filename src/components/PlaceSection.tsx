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
        <div className="photos">
          <img
            src="/vyhled-zapad.jpg"
            alt="Výhled ze Střechy Radost na Pražský hrad při západu slunce"
            loading="lazy"
            decoding="async"
            width={1200}
            height={1600}
          />
          {/* EDIT: druhá fotka — atmosféra tabule/akce; nahradit placeholder za
              <img src="/foto-tabule.jpg" alt="…" loading="lazy" /> */}
          <div className="photo-ph">
            <span>foto tabule</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
