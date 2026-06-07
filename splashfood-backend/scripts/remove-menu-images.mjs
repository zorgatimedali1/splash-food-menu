#!/usr/bin/env node
/**
 * Remove menu images from app/public/images/ (now hosted on R2)
 * Keeps: about_*, team_*, splash_burger* (still used by static pages)
 */
import { readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const IMAGES_DIR = join(__dirname, '..', '..', 'app', 'public', 'images');

// These 15 menu images are now on R2 — remove local copies
const TO_DELETE = [
  'tabouna photo.jpg', 'tabouna photo.webp',
  'cornet photo.jpeg', 'cornet photo.webp',
  'pizza-calzone.jpg', 'pizza-calzone.webp',
  'splash_sandwich.jpg', 'splash_sandwich.webp',
  'cibatta photo.jpg', 'cibatta photo.webp',
  'makloub photo.jpg', 'makloub photo.webp',
  'splash_pizza.jpg', 'splash_pizza.webp',
  'triangle photo.png', 'triangle photo.webp',
  'baguette farce.jpg', 'baguette farce.webp',
  'tacos phoyo.jpg', 'tacos phoyo.webp',
  'pate.png', 'pate.webp',
  'splash_salade.jpg', 'splash_salade.webp',
  'poulet_croustillant.jpg', 'poulet_croustillant.webp',
  'splash_omelette.jpg', 'splash_omelette.webp',
  'splash_boissons.jpg', 'splash_boissons.webp',
];

let removed = 0;
for (const file of TO_DELETE) {
  try {
    unlinkSync(join(IMAGES_DIR, file));
    console.log(`  ✅ Removed ${file}`);
    removed++;
  } catch {
    console.log(`  ⚠️  ${file} not found, skipping`);
  }
}

console.log(`\nDone! Removed ${removed} files.`);
console.log(`Kept: about_*, team_*, splash_burger* (static pages)\n`);
