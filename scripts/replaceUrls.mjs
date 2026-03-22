import fs from 'fs';
import path from 'path';

const navPath = path.join(process.cwd(), 'src', 'data', 'navigation.ts');
const prodPath = path.join(process.cwd(), 'src', 'data', 'products.ts');

const replaceRegex1 = /https:\/\/api\.rushabhjewel\.com\/img\/2026\/[0-9]+\/[0-9]+\/[0-9]+\/([a-zA-Z0-9.\-_]+)/g;
const replaceRegex2 = /https:\/\/www\.rushabhjewel\.com\/_next\/image\?url=%2Fsiteassets%2Fimages%2Fbanner%2Fmorejewellery\.png&w=3840&q=75/g;

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(replaceRegex1, '/category-images/$1');
  content = content.replace(replaceRegex2, '/category-images/morejewellery.png');
  fs.writeFileSync(filePath, content);
  console.log('Replaced in ' + filePath);
}

replaceInFile(navPath);
replaceInFile(prodPath);
