import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(process.cwd(), 'dist');
const indexHtml = path.join(distDir, 'index.html');
const fourOhFourHtml = path.join(distDir, '404.html');

if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, fourOhFourHtml);
  console.log('✅ Created 404.html from index.html for SPA routing');
} else {
  console.error('❌ Could not find dist/index.html');
  process.exit(1);
}
