/**
 * Příprava obrázků pro public/ ze zdrojů v _source/.
 * Spouští se přes `npm run assets` a taky automaticky před buildem.
 *
 *  _source/layer-sky.jpg    → public/parallax-assets/layer-sky{,-1200}.jpg  (srcset pro hero)
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

// --- Vrstvy heru ve dvou šířkách ----------------------------------------
// Hero je LCP prvek. Fotka je na výšku a object-fit:cover ji na telefonu
// škáluje podle výšky, takže 390px displej při DPR2 potřebuje ~1200 px šířky —
// proto 1200w a 1600w, srcset si vybere. Menší varianta by se rozmazala.
for (const w of [1200, 1600]) {
  const suffix = w === 1600 ? '' : `-${w}`;
  await sharp(src('layer-sky.jpg'))
    .resize({ width: w, withoutEnlargement: true })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(out(`parallax-assets/layer-sky${suffix}.jpg`));
  await report(`parallax-assets/layer-sky${suffix}.jpg`, out(`parallax-assets/layer-sky${suffix}.jpg`));

}

// --- Fotka do sekce Místo -----------------------------------------------
await sharp(src('vyhled-zapad.jpg'))
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
       'STŘEDA 9. 9. OD 18:00 · STŘECHA RADOST × BISTRO KAREL',
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
