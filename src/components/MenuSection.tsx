import { Reveal } from './Reveal';

export function MenuSection() {
  return (
    <section className="s-menu">
      <Reveal className="inner">
        <p className="meta" style={{ marginBottom: '1rem' }}>
          Signature menu — Bistro Karel
        </p>
        <h2>
          Od prvního chodu
          <br />
          po dezert
        </h2>
        <p className="lead">
          Bistro Karel nám celý rok vozí na Střechu to nejlepší ze své divoké zahrady v Troji. Tak
          jsme se rozhodli to oslavit: menu stvořené jen pro tenhle večer, sdílené mísy u dlouhé
          tabule, žádný spěch. Párování s pivem jede celým menu — parťákem večera je Budvar,
          najdete ho v glazuře, v karamelu i ve sklenici.
        </p>
        <div className="menu-card">
          <div className="course">
            <p className="label">Na stůl, na share</p>
            <p className="dish">Kvásková focaccia &amp; jedlá miso svíčka</p>
            <p className="dish">Hovězí tatarák s lanýžovým olejem na topince</p>
          </div>
          <div className="course">
            <p className="label">Hlavní chod</p>
            <p className="dish">
              Pomalu pečená vepřová krkovice, glazura z piva a medu, salsa z kadeřávku
              <small>vege: pečená řepa se stejnou glazurou a vlašskými ořechy</small>
            </p>
            <p className="dish">Grilované brambory s miso posypkou</p>
          </div>
          <div className="course">
            <p className="label">Dezerty</p>
            <p className="dish">Zmrzlina — med, pivo, pampeliškový kořen</p>
            <p className="dish">Grilované broskve, crumble, espuma, karamel</p>
          </div>
        </div>
        <p className="menu-foot">Vaříme sezónně — menu se může v detailech proměnit.</p>
        {/* EDIT: fotky jsou z běžného menu Bistra Karel (bistrokarel.cz/menus),
            ne z tohohle večera — slouží jako ilustrace stylu. Až budou fotky
            přímo ze Sunset Dinner Party, vyměnit. Původ viz _source/photos/PUVOD.md */}
        <div className="menu-photos">
          <figure>
            <img
              src="/fotky/karel-share.jpg"
              alt="Sdílené mísy s pečivem, namáčením a chipsy na dlouhém stole"
              loading="lazy"
              decoding="async"
              width={900}
              height={1600}
            />
            <figcaption>Na stůl, na share</figcaption>
          </figure>
          <figure>
            <img
              src="/fotky/karel-gril.jpg"
              alt="Maso na roštu nad otevřeným ohněm"
              loading="lazy"
              decoding="async"
              width={900}
              height={1600}
            />
            <figcaption>Hlavní chod</figcaption>
          </figure>
          <figure>
            <img
              src="/fotky/karel-dezert.jpg"
              alt="Dezert s krémem a drobenkou na talíři"
              loading="lazy"
              decoding="async"
              width={900}
              height={1600}
            />
            <figcaption>Dezerty</figcaption>
          </figure>
        </div>
        <p className="menu-photos-note">
          Ilustrační foto z běžného menu Bistra Karel — podoba chodů na Sunset Dinner Party se
          může lišit.
        </p>
      </Reveal>
    </section>
  );
}
