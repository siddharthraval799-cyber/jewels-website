import fs from 'fs';
import path from 'path';

const productsPath = path.resolve('public/mock/products.json');
const categoriesPath = path.resolve('public/mock/categories.json');
const reelsPath = path.resolve('public/mock/creator-reels.json');

const files = [productsPath, categoriesPath, reelsPath];

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace /api/uploads/ with /uploads/
    content = content.replace(/\/api\/uploads\//g, '/uploads/');
    
    // Replace broken rushabhjewel.com links with placeholder
    // The browser reported 404s for URLs like https://www.rushabhjewel.com/_next/image?url=...
    // and https://api.rushabhjewel.com/uploads/...
    content = content.replace(/https?:\/\/(www\.)?rushabhjewel\.com\/[^"'\s]*/g, '/placeholder.svg');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
});
