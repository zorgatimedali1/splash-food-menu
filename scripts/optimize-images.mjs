import sharp from 'sharp';
import { readdirSync, renameSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, parse, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_IMAGES = join(__dirname, '..', 'public', 'images');

const OVERRIDES = {
  'pizza-calzone.jpg': { width: 900, quality: 60 },
  'baguette farce.jpg': { width: 900, quality: 60 },
  'triangle photo.png': { width: 900, quality: 60 },
  'pate.png': { width: 900, quality: 60 },
};

const files = readdirSync(PUBLIC_IMAGES).filter(f =>
  /\.(jpe?g|png)$/i.test(f)
);

async function main() {
  for (const file of files) {
    const input = join(PUBLIC_IMAGES, file);
    const { name } = parse(file);
    const override = OVERRIDES[file];
    const width = override?.width;
    const quality = override?.quality ?? 70;

    const pipeline = sharp(input);
    if (width) pipeline.resize(width);

    const tmp = join(PUBLIC_IMAGES, `_tmp_${file}`);

    // Compress original
    const ext = parse(file).ext.match(/\.png$/i) ? 'png' : 'jpeg';
    const opts = ext === 'png' ? { quality, palette: true } : { quality, mozjpeg: true };
    await pipeline.clone().toFormat(ext, opts).toFile(tmp);
    renameSync(tmp, input);
    console.log(`✓ ${file} compressed`);

    // WebP
    const webpPath = join(PUBLIC_IMAGES, `${name}.webp`);
    await pipeline.clone().toFormat('webp', { quality }).toFile(webpPath);
    console.log(`  → ${name}.webp`);
  }
  console.log('\nDone!');
}

main().catch(console.error);
