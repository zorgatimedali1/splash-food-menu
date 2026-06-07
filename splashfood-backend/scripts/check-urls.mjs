#!/usr/bin/env node
import { execSync } from 'node:child_process';

console.log('1. Checking local D1 image_url values...');
const out = execSync('npx wrangler d1 execute splashfood-db --local --command="SELECT DISTINCT image_url FROM products LIMIT 5"', { encoding: 'utf-8', cwd: new URL('../', import.meta.url).pathname.slice(1) });
console.log(out);

console.log('\n2. Checking remote D1 image_url values...');
const out2 = execSync('npx wrangler d1 execute splashfood-db --remote --command="SELECT DISTINCT image_url FROM products LIMIT 5"', { encoding: 'utf-8', cwd: new URL('../', import.meta.url).pathname.slice(1) });
console.log(out2);
