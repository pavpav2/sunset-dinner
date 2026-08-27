import { GOOUT_URL, IG_KAREL, IG_RADOST, trackCta } from '../site';

export function Footer() {
  return (
    <footer>
      <div className="logos">
        {/* EDIT: loga — viz komentář v parallax-hero.tsx.
            Ve footeru je podklad tmavý (#1E0E06), takže tu patří světlé verze log
            a mix-blend-mode:multiply se NEpoužije. */}
        <span className="logo-text">Radost</span>
        <span className="x" aria-hidden="true">
          ×
        </span>
        <span className="logo-text">Bistro Karel</span>
      </div>
      <a
        className="btn"
        href={GOOUT_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCta('footer')}
      >
        Vstupenky na GoOut
      </a>
      <div className="social">
        {/* EDIT: IG Střechy Radost — viz IG_RADOST v src/site.ts */}
        <a href={IG_RADOST} target="_blank" rel="noopener noreferrer">
          IG Střecha Radost
        </a>
        <a href={IG_KAREL} target="_blank" rel="noopener noreferrer">
          IG Bistro Karel
        </a>
      </div>
      <div className="footer-partner">
        <p className="meta">Partner večera</p>
        {/* EDIT: použití loga Budvaru potvrdit s jejich marketingem — jde
            o cizí ochrannou známku. Jednobarevná verze z budejovickybudvar.cz,
            přebarvená na krémovou: na tmavém footeru by černá nebyla vidět. */}
        <img src="/logos/budvar.svg" alt="Budějovický Budvar" width={142} height={82} />
      </div>
      <p className="copy">© 2026 Střecha Radost × Bistro Karel</p>
    </footer>
  );
}
