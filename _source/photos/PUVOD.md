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

Obě vrstvy parallaxu vznikají z `split-nebe.png`. Z masky se bere **jen spodní
hrana** — ta určuje dělící linii — a obě alfy se pak odvodí z ní: nebe je krycí
nad linií, město od linie dolů (s 3px překryvem). RGB je v obou vrstvách čistá
fotka, takže okraj masky nemůže do obrazu vnést nic cizího.

Proč ne obě masky přímo: byly řezané zvlášť a v 877 z 1536 sloupců se
nedotýkají — mezera je medián 8 px, místy až 181. Hřeben střech tak nepatřil
ani jedné vrstvě a prosvítalo jím pozadí jako černé fleky. Odvození z jedné
linie to vylučuje z principu.

Vedlejší přínos: maska nebe má kolem věží drobné otvory a tenké struktury
(antény, jeřáby) vyříznuté zvlášť. Jako funkce hranice zmizí obě starosti
naráz — díry se zaplní a tenké struktury spadnou pod město, tedy do vrstvy,
která se při scrollu hýbe pomalu a kam patří. Jinak by se odtrhávaly a plavaly
nad hřebenem.

`split-mesto.png` se v buildu nakonec nepoužije. Posloužil k ověření, že řez
sedí (jeho horní hrana vychází na stejné místo jako spodní hrana nebe), ale
geometrii určuje maska nebe.

Dřív se silueta dopočítávala z fotky prahováním jasu (`scripts/skyline.mjs`).
Ruční rozřez je přesnější, takže skript byl odstraněn — je v historii gitu.
