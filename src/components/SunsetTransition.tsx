/**
 * Přechod mezi herem a sekcí Menu.
 *
 * Hero ústí přes .parallax__fade do tmavé (#1E0E06) — fotka má u spodní hrany
 * setmělé město, takže fade do krémové by ji zamlžil. Stránka se proto pod
 * herem rozsvěcí zpátky do krému a od Menu jede původní západový průběh z v2
 * beze změny.
 *
 * Pod gradientem stojí panorama z v2 (věž + tabulový pás) na plném krému —
 * přesně ve své původní pozici: silueta těsně nad sekcí Menu. Kdyby zůstalo
 * uvnitř gradientu, hnědá věž na hnědém podkladu zmizí.
 */
export function SunsetTransition() {
  return (
    <>
      <div className="transition-band" aria-hidden="true" />
      <div className="panorama" aria-hidden="true">
        <div className="skyline-wrap">
          {/* EDIT: možno nahradit souborem /parallax-assets/tower.png */}
          <svg className="tower" viewBox="0 0 200 560" xmlns="http://www.w3.org/2000/svg">
            <g fill="#472418">
              {/* anténa */}
              <rect x="97" y="0" width="6" height="70" />
              <rect x="93" y="52" width="14" height="8" rx="3" />
              <rect x="94" y="70" width="12" height="60" />
              <rect x="90" y="78" width="20" height="5" rx="2" />
              <rect x="90" y="92" width="20" height="5" rx="2" />
              <rect x="90" y="106" width="20" height="5" rx="2" />
              <rect x="90" y="120" width="20" height="5" rx="2" />
              {/* horní část tubusu */}
              <rect x="88" y="130" width="24" height="110" />
              {/* kabiny / prstence */}
              <rect x="64" y="240" width="72" height="26" rx="10" />
              <rect x="58" y="286" width="84" height="30" rx="12" />
              <rect x="74" y="266" width="52" height="20" />
              {/* boční tubus */}
              <rect x="66" y="228" width="14" height="180" rx="6" />
              {/* hlavní tubus */}
              <rect x="86" y="240" width="28" height="320" />
              {/* spodní prstenec */}
              <rect x="52" y="400" width="96" height="34" rx="14" />
              {/* nohy */}
              <rect x="70" y="434" width="12" height="126" />
              <rect x="118" y="434" width="12" height="126" />
            </g>
          </svg>
        </div>
        {/* EDIT: nahradit souborem /parallax-assets/table.svg */}
        <svg
          className="table-band"
          viewBox="0 0 1600 200"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M0 30 Q200 68 400 30 T800 30 T1200 30 T1600 30"
            fill="none"
            stroke="#472418"
            strokeWidth="3"
          />
          <g stroke="#472418" strokeWidth="2">
            <line x1="200" y1="49" x2="200" y2="64" />
            <line x1="600" y1="49" x2="600" y2="64" />
            <line x1="1000" y1="49" x2="1000" y2="64" />
            <line x1="1400" y1="49" x2="1400" y2="64" />
          </g>
          <g fill="#F7D492" stroke="#472418" strokeWidth="2">
            <circle cx="200" cy="72" r="8" />
            <circle cx="600" cy="72" r="8" />
            <circle cx="1000" cy="72" r="8" />
            <circle cx="1400" cy="72" r="8" />
          </g>
          <g fill="#472418">
            <ellipse cx="230" cy="128" rx="16" ry="4" />
            <ellipse cx="520" cy="128" rx="16" ry="4" />
            <ellipse cx="810" cy="128" rx="16" ry="4" />
            <ellipse cx="1100" cy="128" rx="16" ry="4" />
            <ellipse cx="1390" cy="128" rx="16" ry="4" />
            <rect x="0" y="132" width="1600" height="8" />
            <rect x="90" y="140" width="6" height="48" />
            <rect x="370" y="140" width="6" height="48" />
            <rect x="650" y="140" width="6" height="48" />
            <rect x="930" y="140" width="6" height="48" />
            <rect x="1210" y="140" width="6" height="48" />
            <rect x="1490" y="140" width="6" height="48" />
          </g>
        </svg>
      </div>
    </>
  );
}
