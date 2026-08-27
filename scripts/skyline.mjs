/**
 * Vytáhne z fotky linii horizontu (hřeben s Hradem proti obloze) a udělá
 * z ní SVG siluetu do hera. Spouští se přes `npm run skyline`.
 *
 * Postup:
 *  1) Adaptivní práh — obloha je u slunce výrazně jasnější než na okrajích,
 *     jeden globální práh by na tmavší straně ukrojil kus oblohy.
 *  2) Souvislá oblast: město je jedna spojitá tmavá plocha, vyplavíme ji zdola.
 *     Skenování po sloupcích ořezávalo tenké jehly (věže, hromosvody); tudy se
 *     najdou celé. Mraky se vyloučí samy — města se nedotýkají.
 *  3) Sub-pixelová hrana lineární interpolací jasu přes práh: zdroj má jen
 *     1600 px na šířku a celopixelový hřeben by na velkém displeji dělal schody.
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, '_source', 'layer-sky.jpg');
const OUT = path.join(root, 'public', 'parallax-assets', 'skyline.svg');

const TOP = 1020;     // odkud dolů hledáme (nad tím je čistá obloha)
const BAND = 460;     // výška prohledávaného pásu
const RATIO = 0.62;   // práh = RATIO × jas oblohy v daném sloupci

const { data, info } = await sharp(SRC)
  .extract({ left: 0, top: TOP, width: 1600, height: BAND })
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });

const W = info.width, H = info.height;
const at = (x, y) => data[y * W + x];

// 1) jas oblohy nad pásem → práh pro každý sloupec zvlášť
const { data: skyData, info: skyInfo } = await sharp(SRC)
  .extract({ left: 0, top: TOP - 220, width: 1600, height: 200 })
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });
const thresh = new Array(W);
for (let x = 0; x < W; x++) {
  let sum = 0;
  for (let y = 0; y < skyInfo.height; y++) sum += skyData[y * skyInfo.width + x];
  thresh[x] = (sum / skyInfo.height) * RATIO;
}

// 2) město je jedna souvislá tmavá plocha — vyplavíme ji zdola.
//    Skenování po sloupcích ořezávalo tenké jehly (věže, hromosvody), protože
//    ty jsou nad hlavní hmotou úzké; souvislost je najde celé. Mraky se přitom
//    vyloučí samy: nedotýkají se města, takže do oblasti nespadnou.
const dark = new Uint8Array(W * H);
for (let x = 0; x < W; x++) {
  const t = thresh[x];
  for (let y = 0; y < H; y++) if (at(x, y) <= t) dark[y * W + x] = 1;
}

const inComp = new Uint8Array(W * H);
const stack = [];
for (let x = 0; x < W; x++) {
  const i = (H - 1) * W + x;
  if (dark[i] && !inComp[i]) { inComp[i] = 1; stack.push(i); }
}
while (stack.length) {
  const i = stack.pop();
  const x = i % W, y = (i / W) | 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
      const j = ny * W + nx;
      if (dark[j] && !inComp[j]) { inComp[j] = 1; stack.push(j); }
    }
  }
}

const ridge = new Array(W).fill(H - 1);
for (let x = 0; x < W; x++) {
  for (let y = 0; y < H; y++) if (inComp[y * W + x]) { ridge[x] = y; break; }
}

// 4) sub-pixelová hrana — zdroj má jen 1600 px na šířku, takže celopixelový
//    hřeben dělá na velkém displeji schody. Lineární interpolace jasu přes
//    práh dá zlomkovou pozici hrany: přesnější i hladší zároveň.
const sub = ridge.map((y, x) => {
  if (y <= 0) return y;
  const t = thresh[x], above = at(x, y - 1), below = at(x, y);
  if (above <= t || below > t) return y;
  return y - 1 + (above - t) / (above - below);
});

// 5) minimální vyhlazení: medián ±1 proti zubům, lokální minimum ±1 na
//    zacelení míst, kde by pod siluetou prosvítala obloha
const med = sub.map((_, x) => {
  const w = sub.slice(Math.max(0, x - 1), x + 2).sort((a, b) => a - b);
  return w[w.length >> 1];
});
const smooth = med;  // lokální minimum už netřeba — souvislá oblast díry nedělá

// SVG: polyline se zahozením bodů, které leží na spojnici sousedů (do 0.15 px).
// Drží to detail věží a přitom nevozí 1600 bodů.
const TOL = 0.15;
const pts = [[0, smooth[0]]];
for (let x = 1; x < W - 1; x++) {
  const [px, py] = pts[pts.length - 1];
  const t = (x - px) / (W - 1 - px);
  const lin = py + (smooth[W - 1] - py) * t;
  const next = smooth[x];
  const prev = smooth[x - 1], after = smooth[x + 1];
  const onLine = Math.abs(next - (prev + after) / 2) < TOL && Math.abs(next - lin) < 1e9;
  if (!onLine) pts.push([x, next]);
}
pts.push([W - 1, smooth[W - 1]]);

const PAD_BOTTOM = 120;
const VH = H + PAD_BOTTOM;
const r = (n) => Math.round(n * 100) / 100;
const seg = [`M0,${VH}`, `L0,${r(smooth[0])}`];
for (const [x, y] of pts) seg.push(`L${x},${r(y)}`);
seg.push(`L${W},${r(smooth[W - 1])}`, `L${W},${VH}`, 'Z');

await writeFile(
  OUT,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${VH}" preserveAspectRatio="xMidYMin meet"><path d="${seg.join('')}" fill="#1E0E06"/></svg>\n`
);
const lo = Math.min(...smooth), hi = Math.max(...smooth);
console.log(
  `  hřeben y ${lo}–${hi} z ${H} · práh ${Math.round(Math.min(...thresh))}–${Math.round(Math.max(...thresh))}` +
  ` · ${pts.length} bodů · ${(await import('node:fs')).statSync(OUT).size} B`
);
