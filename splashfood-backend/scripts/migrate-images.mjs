#!/usr/bin/env node
/**
 * Upload all frontend images to R2 + update D1
 *
 * Usage:
 *   node scripts/migrate-images.mjs          (local R2 + local D1)
 *   node scripts/migrate-images.mjs --remote (remote R2 + remote D1)
 *   node scripts/migrate-images.mjs --dry    (preview only)
 */
import { execSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const IMAGES_DIR = join(__dirname, '..', '..', 'app', 'public', 'images');
const R2_PUBLIC_URL = 'https://pub-6ac384b9162e4591a6d31dbe706c6433.r2.dev';

const isDry = process.argv.includes('--dry');
const isRemote = process.argv.includes('--remote');
const flag = isRemote ? '--remote' : '--local';

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

// ─── filename → category_id mapping ───
const IMAGE_MAP = {
  'tabouna photo.jpg':       1,
  'cornet photo.jpeg':       2,
  'pizza-calzone.jpg':       3,
  'splash_sandwich.jpg':     4,
  'cibatta photo.jpg':       5,
  'makloub photo.jpg':       6,
  'splash_pizza.jpg':        7,
  'triangle photo.png':      8,
  'baguette farce.jpg':      9,
  'tacos phoyo.jpg':         10,
  'pate.png':                11,
  'splash_salade.jpg':       12,
  'poulet_croustillant.jpg': 13,
  'splash_omelette.jpg':     14,
  'splash_boissons.jpg':     15,
};

function sh(cmd) {
  console.log(`  $ ${cmd}`);
  if (isDry) return '';
  return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

function db(sql) {
  const safe = sql.replace(/"/g, '\\"');
  return sh(`npx wrangler d1 execute splashfood-db ${flag} --command="${safe}"`);
}

async function main() {
  console.log(`\n📦 Image Migration: app/public/images → R2`);
  console.log(`   Mode: ${isRemote ? '🚀 REMOTE (production)' : '🧪 LOCAL (dev)'}${isDry ? ' — DRY RUN' : ''}`);
  console.log(`   R2: ${R2_PUBLIC_URL}/menu/\n`);

  // 1. Filter images that belong to menu
  const files = Object.keys(IMAGE_MAP);
  console.log(`Found ${files.length} images to upload:\n`);

  // 2. Upload each to R2
  let uploaded = 0;
  for (const file of files) {
    const filePath = join(IMAGES_DIR, file);
    const key = `menu/${file.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const url = `${R2_PUBLIC_URL}/${key}`;
    const size = statSync(filePath).size;
    const ct = file.endsWith('.png') ? 'image/png' : file.endsWith('.webp') ? 'image/webp' : 'image/jpeg';

    console.log(`📄 ${file} (${(size / 1024).toFixed(1)} KB)`);
    sh(`npx wrangler r2 object put splashfood-images/${key} --file="${filePath}" --content-type="${ct}"`);
    uploaded++;
  }

  // 3. Update categories in D1
  console.log(`\n📝 Updating D1 categories...`);
  for (const [file, catId] of Object.entries(IMAGE_MAP)) {
    const key = `menu/${file.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const url = `${R2_PUBLIC_URL}/${key}`;
    db(`UPDATE categories SET image_url = '${url}' WHERE id = ${catId}`);
    console.log(`   ✅ Category ${catId} → ${url}`);
  }

  // 4. Update products in D1 (all products in category share same image)
  console.log(`\n📝 Updating D1 products...`);
  for (const [file, catId] of Object.entries(IMAGE_MAP)) {
    const key = `menu/${file.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const url = `${R2_PUBLIC_URL}/${key}`;
    db(`UPDATE products SET image_url = '${url}' WHERE category_id = ${catId}`);
    console.log(`   ✅ Products cat ${catId} → ${url}`);
  }

  console.log(`\n🎉 Done! ${uploaded} images uploaded, D1 updated.`);
  console.log(`   R2 URL: ${R2_PUBLIC_URL}/menu/\n`);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
