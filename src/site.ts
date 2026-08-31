/* =====================================================================
   Centrální místo pro odkazy a analytiku.
   Všechno, co je před launchem potřeba doplnit, je označené EDIT.
   ===================================================================== */

// Přímý odkaz na událost. Používá se v heru i ve footeru.
export const GOOUT_URL = 'https://goout.net/cs/sunset-dinner-party/szaxemy/';

// EDIT: Google Maps odkaz na nám. Winstona Churchilla 2, Praha 3 — Žižkov
export const MAP_URL = 'https://maps.app.goo.gl/';

// EDIT: Instagram Střechy Radost
export const IG_RADOST = 'https://www.instagram.com/';

export const IG_KAREL = 'https://www.instagram.com/bistro_karel/';

export const ADDRESS_LINE_1 = 'nám. Winstona Churchilla 2,';
export const ADDRESS_LINE_2 = 'Praha 3 — Žižkov';

/**
 * Odešle event do Plausible, pokud je skript načtený.
 * TODO: Plausible účet zatím není — v index.html je zakomentovaný skript
 *       pro doménu dinner.strecharadost.cz. Po jeho odkomentování začnou
 *       tyhle eventy odcházet samy, tady už není co měnit.
 */
export function trackCta(location: 'hero' | 'footer'): void {
  const plausible = (window as unknown as {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }).plausible;
  plausible?.('CTA GoOut', { props: { location } });
}
