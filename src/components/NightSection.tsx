import { Reveal } from './Reveal';

export function NightSection() {
  return (
    <section className="s-night on-dark">
      <Reveal>
        <p className="meta" style={{ marginBottom: '1.4rem' }}>
          DJs
        </p>
        <h2>
          A až slunce zapadne?
          <br />
          Zůstaňte.
        </h2>
        <p className="lead" style={{ marginTop: '1.2rem' }}>
          DJ jede dál, bar jede dál. Večeře končí, večer ne.
        </p>
      </Reveal>
      <svg
        className="night-band"
        viewBox="0 0 1600 200"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <path
          d="M0 30 Q200 68 400 30 T800 30 T1200 30 T1600 30"
          fill="none"
          stroke="rgba(248,238,221,.4)"
          strokeWidth="3"
        />
        <g stroke="rgba(248,238,221,.4)" strokeWidth="2">
          <line x1="200" y1="49" x2="200" y2="64" />
          <line x1="600" y1="49" x2="600" y2="64" />
          <line x1="1000" y1="49" x2="1000" y2="64" />
          <line x1="1400" y1="49" x2="1400" y2="64" />
        </g>
        <g fill="#F7D492">
          <circle cx="200" cy="72" r="8" />
          <circle cx="600" cy="72" r="8" />
          <circle cx="1000" cy="72" r="8" />
          <circle cx="1400" cy="72" r="8" />
        </g>
        <g fill="rgba(248,238,221,.4)">
          <rect x="0" y="132" width="1600" height="8" />
          <rect x="90" y="140" width="6" height="48" />
          <rect x="370" y="140" width="6" height="48" />
          <rect x="650" y="140" width="6" height="48" />
          <rect x="930" y="140" width="6" height="48" />
          <rect x="1210" y="140" width="6" height="48" />
          <rect x="1490" y="140" width="6" height="48" />
        </g>
      </svg>
    </section>
  );
}
