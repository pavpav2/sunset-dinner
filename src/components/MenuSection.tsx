import { Reveal } from './Reveal';

export function MenuSection() {
  return (
    <section className="s-menu">
      <Reveal className="inner">
        <p className="meta" style={{ marginBottom: '1rem' }}>
          Signature menu — Bistro Karel
        </p>
        <h2>
          Párování s pivem,
          <br />
          od prvního chodu po dezert
        </h2>
        <p className="lead">
          Bistro Karel nám celý rok vozí na Střechu to nejlepší ze své divoké zahrady v Troji. Tak
          jsme se rozhodli to oslavit: menu stvořené jen pro tenhle večer, sdílené mísy u dlouhé
          tabule, žádný spěch. Parťákem večera je Budvar — najdete ho v glazuře, v karamelu i ve
          sklenici.
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
      </Reveal>
    </section>
  );
}
