import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { instructions } from '@vite-pwa/assets-generator/api/instructions';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const background = '#0D1115';
const source = await readFile(new URL('assets/branding/readit-logo.png', root));

// Crop the book above the wordmark in the supplied 1254 × 1254 artwork.
// Scale the crop coordinates to support higher-resolution copies of this logo.
const { width, height } = await sharp(source).metadata();
const book = await sharp(source)
  .extract({
    left: Math.round(width * 225 / 1254),
    top: Math.round(height * 205 / 1254),
    width: Math.round(width * 805 / 1254),
    height: Math.round(height * 630 / 1254),
  })
  .resize(1024, 1024, { fit: 'contain', background })
  .png()
  .toBuffer();

const assets = await instructions({
  imageResolver: () => book,
  imageName: 'readit-logo.png',
  preset: {
    transparent: {
      sizes: [64, 150, 192, 512],
      favicons: [[48, 'favicon.ico']],
      padding: 0.05,
    },
    maskable: {
      sizes: [192, 512],
      padding: 0.3,
      resizeOptions: { background, fit: 'contain' },
    },
    apple: {
      sizes: [180],
      padding: 0.1,
      resizeOptions: { background, fit: 'contain' },
    },
    png: { compressionLevel: 9 },
    assetName: (type, size) => {
      if (type === 'apple') return 'apple-icon.png';
      if (type === 'maskable') {
        return `web-app-manifest-maskable-${size.width}x${size.height}.png`;
      }
      if (size.width === 64) return 'icon1.png';
      if (size.width === 150) return 'mstile-150x150.png';
      return `web-app-manifest-${size.width}x${size.height}.png`;
    },
  },
  faviconPreset: '2023',
  htmlLinks: { xhtml: false, includeId: false },
  basePath: '/',
  resolveSvgName: (name) => name,
});

await sharp(book)
  .resize(512, 512)
  .png({ compressionLevel: 9 })
  .toFile(fileURLToPath(new URL('public/readit-logo.png', root)));

for (const type of ['transparent', 'maskable', 'apple', 'favicon']) {
  for (const asset of Object.values(assets[type])) {
    const folder = ['icon1.png', 'apple-icon.png', 'favicon.ico'].includes(asset.name)
      ? 'src/app'
      : 'public';
    await writeFile(new URL(`${folder}/${asset.name}`, root), await asset.buffer());
  }
}

process.stdout.write('Updated the Read-It logo, favicon, Apple icon and PWA icons.\n');
