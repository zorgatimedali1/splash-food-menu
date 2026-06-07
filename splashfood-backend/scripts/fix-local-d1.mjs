#!/usr/bin/env node
import { execSync } from 'node:child_process';

const R2 = 'https://pub-6ac384b9162e4591a6d31dbe706c6433.r2.dev';

const IMAGES = {
  1: 'tabouna_photo.jpg',
  2: 'cornet_photo.jpeg',
  3: 'pizza-calzone.jpg',
  4: 'splash_sandwich.jpg',
  5: 'cibatta_photo.jpg',
  6: 'makloub_photo.jpg',
  7: 'splash_pizza.jpg',
  8: 'triangle_photo.png',
  9: 'baguette_farce.jpg',
  10: 'tacos_phoyo.jpg',
  11: 'pate.png',
  12: 'splash_salade.jpg',
  13: 'poulet_croustillant.jpg',
  14: 'splash_omelette.jpg',
  15: 'splash_boissons.jpg',
};

for (const [catId, file] of Object.entries(IMAGES)) {
  const url = `${R2}/menu/${file}`;
  const sql = `UPDATE categories SET image_url = '${url}' WHERE id = ${catId}; UPDATE products SET image_url = '${url}' WHERE category_id = ${catId}`;
  execSync(`npx wrangler d1 execute splashfood-db --local --command="${sql}"`, { encoding: 'utf-8' });
  console.log(`✅ cat ${catId} → ${url}`);
}
console.log('\nDone! Restart wrangler dev to pick up changes.');
