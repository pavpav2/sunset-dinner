# Původ fotek

Staženo z webů obou partnerů, se souhlasem klienta (Pavel, 27. 8. 2026).

| soubor | zdroj |
|---|---|
| `radost-strecha.jpg` | www.strecharadost.cz |
| `radost-catering.jpg` | www.strecharadost.cz |
| `karel-share.jpg` | www.bistrokarel.cz/menus |
| `karel-gril.jpg` | www.bistrokarel.cz/menus |
| `karel-dezert.jpg` | www.bistrokarel.cz/menus |
| `split-nebe.png` | ruční rozřez fotky po linii horizontu (Pavel) |
| `split-mesto.png` | ruční rozřez fotky po linii horizontu (Pavel) |

Fotky jídla od Karla jsou z jeho běžného menu, ne z tohohle večera — slouží jako
ilustrace stylu. Až budou fotky přímo ze Sunset Dinner Party, nahradit.

## Vrstvy heru

`split-mesto.png` je popředí parallaxu — město vyříznuté po horizontu, s alfou.
`split-nebe.png` se do buildu nedostane: vzadu je celá fotka `layer-sky.jpg`,
protože kdyby tam bylo vyříznuté nebe, musely by se obě alfy potkat pixel na
pixel a v místech, kde se minou, prosvítá pozadí jako šmouha podél hřebene.

Alfa města se v `scripts/optimize-assets.mjs` ještě seřízne o pixel dovnitř —
okraj ruční masky nese polopropustné pixely s barvou oblohy a bez seříznutí
svítí podél celého hřebene světlá linka.

Dřív se silueta dopočítávala z fotky prahováním jasu (`scripts/skyline.mjs`).
Ruční rozřez je přesnější, takže skript byl odstraněn — je v historii gitu.
