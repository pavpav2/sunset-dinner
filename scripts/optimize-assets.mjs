/**
 * Příprava obrázků pro public/ ze zdrojů v _source/.
 * Spouští se přes `npm run assets` a taky automaticky před buildem.
 *
 *  _source/photos/split-*.png → public/parallax-assets/layer-{sky,city}{,-1200,-2400}.webp
 *  _source/layer-sky.jpg    → public/parallax-assets/skyline.svg          (silueta horizontu, viz skyline.mjs)
 *  _source/vyhled-zapad.jpg → public/vyhled-zapad.jpg                (zmenšeno na 1100 px)
 *  _source/photos/*.jpg     → public/fotky/*.jpg                     (fotky partnerů)
 *  _source/layer-sky.jpg    → public/og-image.jpg                    (1200×630 + titulek v Antonu)
 */
import { mkdir, stat } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import opentype from 'opentype.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = (f) => path.join(root, '_source', f);
const out = (f) => path.join(root, 'public', f);
const ANTON = path.join(root, 'scripts', 'fonts', 'Anton-Regular.ttf');

const kb = async (f) => Math.round((await stat(f)).size / 1024);
const report = async (label, file) => console.log(`  ${label.padEnd(34)} ${await kb(file)} kB`);

await mkdir(out('parallax-assets'), { recursive: true });

// --- Vrstvy heru z ručního splitu ---------------------------------------
// Pavel rozřezal fotku po linii horizontu na dvě PNG s alfou. Z jeho masek
// bereme JEN alfu a nasazujeme ji na čistou fotku — RGB je tak v obou
// vrstvách totožné s originálem a okraj masky nemůže do obrazu vnést nic
// cizího (polopropustné pixely s barvou oblohy jinak podél celého hřebene
// svítily jako světlá linka).
//
// Alfa nebe se navíc nafoukne o pár pixelů dolů, aby zasahovala pod město.
// Kdyby se obě masky jen dotýkaly, musely by sedět pixel na pixel a tam, kde
// se minou, prosvítá pozadí jako šmouha podél hřebene. Překryv to vylučuje.
//
// Obě vrstvy sdílí stejný rám i object-position, takže při scrollu 0 splynou
// v původní fotku a teprve pohybem se rozjedou.
const FRAME_W = 1600, FRAME_H = 2133;
const MASK_W = 1536, MASK_H = 2048;
// split-mesto.png se používá jen pro kontrolu — geometrii určuje hrana nebe

const photoRGB = await sharp(src('layer-sky.jpg'))
  .resize({ width: FRAME_W, height: FRAME_H, fit: 'fill', kernel: 'lanczos3' })
  .removeAlpha()
  .toBuffer();

/** Alfu masky posadí do plného rámu masky (1536×2048) a vrátí ji jako raw. */
async function maskAlpha(file, top) {
  const placed = await sharp({
    create: { width: MASK_W, height: MASK_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: await sharp(src(`photos/${file}`)).ensureAlpha().toBuffer(), top, left: 0 }])
    .png()
    .toBuffer();
  return sharp(placed).extractChannel('alpha').raw().toBuffer();
}

// Obě masky byly řezané zvlášť a v 877 z 1536 sloupců se nedotýkají — mezera
// je medián 8 px, ale místy až 181. Hřeben střech tak nepatří ani jedné vrstvě
// a prosvítá jím pozadí. Bereme proto jako jedinou dělící linii spodní hranu
// masky nebe (ta definuje siluetu proti obloze) a město dotahujeme až k ní:
// všechno pod linií je město, pár pixelů překryvu navíc mezeru vylučuje.
const skyMask = await maskAlpha('split-nebe.png', 0);
const OVERLAP = 3;

const boundary = new Int32Array(MASK_W).fill(MASK_H);
for (let x = 0; x < MASK_W; x++) {
  for (let y = MASK_H - 1; y >= 0; y--) {
    if (skyMask[y * MASK_W + x] > 127) { boundary[x] = y; break; }
  }
}

// Obě alfy odvozujeme z té linie, ne z masek přímo. Maska nebe má kolem věží
// drobné otvory a tenké struktury (antény, jeřáby) vyříznuté zvlášť; jako
// funkce hranice zmizí obě starosti naráz — díry se zaplní a tenké struktury
// spadnou pod město, tedy do vrstvy, která se při scrollu hýbe pomalu a kam
// patří. Jinak by se odtrhávaly a plavaly nad hřebenem.
const skyMaskSolid = Buffer.alloc(MASK_W * MASK_H);
const cityMask = Buffer.alloc(MASK_W * MASK_H);
for (let x = 0; x < MASK_W; x++) {
  for (let y = 0; y <= boundary[x] && y < MASK_H; y++) skyMaskSolid[y * MASK_W + x] = 255;
  for (let y = Math.max(0, boundary[x] - OVERLAP); y < MASK_H; y++) cityMask[y * MASK_W + x] = 255;
}

const toFrame = (raw) =>
  sharp(raw, { raw: { width: MASK_W, height: MASK_H, channels: 1 } })
    .resize({ width: FRAME_W, height: FRAME_H, fit: 'fill' })
    .toColourspace('b-w')
    .png()
    .toBuffer();

const skyAlpha = await toFrame(skyMaskSolid);
const cityAlpha = await toFrame(cityMask);

const skyFrame = await sharp(photoRGB).joinChannel(skyAlpha).png().toBuffer();

// Město dole dotáhnout do #1E0E06. Na mobilu je rám vidět celý až po spodní
// hranu, takže bez doběhu by na styku s tmavým pásem pod herem byl schod.
const fadeToDeep = Buffer.from(
  `<svg width="${FRAME_W}" height="${FRAME_H}" xmlns="http://www.w3.org/2000/svg">
     <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
       <stop offset="0.845" stop-color="#1E0E06" stop-opacity="0"/>
       <stop offset="1" stop-color="#1E0E06" stop-opacity="1"/>
     </linearGradient></defs>
     <rect width="${FRAME_W}" height="${FRAME_H}" fill="url(#g)"/>
   </svg>`
);
const cityFrame = await sharp(
  await sharp(photoRGB).composite([{ input: fadeToDeep, top: 0, left: 0 }]).toBuffer()
)
  .joinChannel(cityAlpha)
  .png()
  .toBuffer();

for (const [name, buf] of [['sky', skyFrame], ['city', cityFrame]]) {
  for (const w of [1200, 1600, 2400]) {
    const suffix = w === 1600 ? '' : `-${w}`;
    const up = w > FRAME_W;
    await sharp(buf)
      .resize({ width: w, kernel: 'lanczos3' })
      .sharpen(up ? { sigma: 0.8, m1: 0.5, m2: 0.5 } : { sigma: 0.4, m1: 0, m2: 0 })
      .webp({ quality: up ? 74 : 80, alphaQuality: 100, effort: 6 })
      .toFile(out(`parallax-assets/layer-${name}${suffix}.webp`));
    await report(`parallax-assets/layer-${name}${suffix}.webp`, out(`parallax-assets/layer-${name}${suffix}.webp`));
  }
}

// --- Fotka do sekce Místo -----------------------------------------------
await sharp(src('vyhled-zapad.jpg'))
  .rotate()
  .resize({ width: 1100, withoutEnlargement: true })
  .jpeg({ quality: 80, progressive: true, mozjpeg: true })
  .toFile(out('vyhled-zapad.jpg'));
await report('vyhled-zapad.jpg', out('vyhled-zapad.jpg'));

// --- Fotky ze Střechy Radost a Bistra Karel ------------------------------
// Zdroje a souhlas viz _source/photos/PUVOD.md
await mkdir(out('fotky'), { recursive: true });
const PHOTOS = [
  { file: 'radost-strecha.jpg', width: 1100 },
  { file: 'radost-catering.jpg', width: 1100 },
  { file: 'karel-share.jpg', width: 900 },
  { file: 'karel-gril.jpg', width: 900 },
  { file: 'karel-dezert.jpg', width: 900 },
];
for (const { file, width } of PHOTOS) {
  await sharp(src(`photos/${file}`))
    // .rotate() bez argumentu aplikuje EXIF orientaci. Fotky od Karla mají
    // orientaci 6 (otočit o 90° CW) — bez tohohle je sharp uloží tak, jak leží
    // v souboru, a značku přitom zahodí, takže v prohlížeči zůstanou položené.
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toFile(out(`fotky/${file}`));
  await report(`fotky/${file}`, out(`fotky/${file}`));
}

// --- Provizorní OG obraz 1200×630 ---------------------------------------
// EDIT: finálně nahradit GoOut coverem 1920×1005 (a upravit og:image:width/height
//       v index.html).
//
// Text sázíme přes opentype.js do SVG cest, ne přes sharp `text`: fontconfig
// nemá na čistém macOS ani v CI default config, volbu `fontfile` pak zahodí
// a titulek by vyšel systémovým fallbackem místo Antonu.
const anton = opentype.parse(readFileSync(ANTON));
const svgText = (text, size, x, baseline, fill) =>
  `<path d="${anton.getPath(text, x, baseline, size).toPathData(2)}" fill="${fill}"/>`;

const PAD = 80;
const TITLE = 104;
const DATE = 26;
const dateBaseline = 630 - 56;
const titleBaseline2 = dateBaseline - DATE - 34;
const titleBaseline1 = titleBaseline2 - TITLE * 1.02;

const overlay = Buffer.from(
  `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
     <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
       <stop offset="0.12" stop-color="#1E0E06" stop-opacity="0"/>
       <stop offset="1" stop-color="#1E0E06" stop-opacity="0.82"/>
     </linearGradient></defs>
     <rect width="1200" height="630" fill="url(#g)"/>
     ${svgText('SUNSET DINNER', TITLE, PAD, titleBaseline1, '#F8EEDD')}
     ${svgText('PARTY', TITLE, PAD, titleBaseline2, '#F8EEDD')}
     <circle cx="${PAD + anton.getAdvanceWidth('PARTY', TITLE) + TITLE * 0.22}" cy="${
       titleBaseline2 - TITLE * 0.17
     }" r="${TITLE * 0.17}" fill="#ECA06C"/>
     ${svgText(
       'STŘEDA 9. 9. OD 17:30 · STŘECHA RADOST × BISTRO KAREL',
       DATE,
       PAD,
       dateBaseline,
       '#F7D492'
     )}
   </svg>`
);

await sharp(src('layer-sky.jpg'))
  .extract({ left: 0, top: 760, width: 1600, height: 840 })
  .resize(1200, 630)
  .composite([{ input: overlay, top: 0, left: 0 }])
  .jpeg({ quality: 82, progressive: true, mozjpeg: true })
  .toFile(out('og-image.jpg'));
await report('og-image.jpg', out('og-image.jpg'));
