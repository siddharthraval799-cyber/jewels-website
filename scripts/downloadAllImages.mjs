import fs from 'fs';
import path from 'path';
import https from 'https';

const images = [
  "https://api.rushabhjewel.com/img/2026/1/1/7/1767252568609-daily-wear.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/7/1767252664187-cocktail.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/7/1767252592142-heritage.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/8/1767268593414-ring.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/8/1767257724851-studs.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/8/1767257806131-polki.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/8/1767257707173-real-diamond.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/8/1767263529329-polki.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/8/1767263540092-victorian.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/8/1767263550417-real-diamond.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/8/1767261944933-antique.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/8/1767261955406-heritage.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/8/1767261966549-monzonaite.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/7/1767252836991-antique-bangles.jpg",
  "https://api.rushabhjewel.com/img/2026/1/22/1/1769066362195-bn18-13-1.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/8/1767268605175-bracelet-and-bangle.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/8/1767267151042-baby-nazariya.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/8/1767267160912-baby-kadli.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/8/1767267171887-baby-pendent.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/8/1767268615392-chains.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/8/1767257440258-antique-chain-with-p.set.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/8/1767257479337-italian.jpg",
  "https://api.rushabhjewel.com/img/2026/1/1/8/1767257347559-tanmaniya-or-charms.jpg",
  "https://www.rushabhjewel.com/siteassets/images/banner/morejewellery.png"
];

const downloadDir = path.join(process.cwd(), 'public', 'category-images');

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const getFunc = url.startsWith('https') ? https.get : require('http').get;
    
    getFunc(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        file.close();
        fs.unlink(dest, () => reject(new Error(`Failed to download ${url}: ${response.statusCode}`)));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

async function run() {
  for (const url of images) {
    const filename = url.split('/').pop().split('?')[0]; // Simple extraction
    const dest = path.join(downloadDir, filename);
    console.log(`Downloading ${filename}...`);
    try {
      await download(url, dest);
    } catch (e) {
      console.error(e);
    }
  }
}

run();
