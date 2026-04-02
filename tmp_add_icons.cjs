const fs = require('fs');
let t = fs.readFileSync('src/data/navigation.ts', 'utf8');

const icons = {
  'Earrings':         'https://www.rushabhjewel.com/siteassets/category-icons/earring.png',
  'Bangles':          'https://www.rushabhjewel.com/siteassets/category-icons/bangle.png',
  'Pendant Set':      'https://www.rushabhjewel.com/siteassets/category-icons/pendant-set.png',
  'Mangalsutra':      'https://www.rushabhjewel.com/siteassets/category-icons/mangalsutra.png',
  'Necklace':         'https://www.rushabhjewel.com/siteassets/category-icons/necklace.png',
  'Chains':           'https://www.rushabhjewel.com/siteassets/category-icons/chain.png',
  'Kids Collections': 'https://www.rushabhjewel.com/siteassets/category-icons/kids.png',
  'Mens Jewellery':   'https://www.rushabhjewel.com/siteassets/category-icons/mens.png',
  'Collections':      'https://www.rushabhjewel.com/siteassets/category-icons/collections.png',
  'More Jewellery':   'https://www.rushabhjewel.com/siteassets/category-icons/more.png',
};

for (const [label, icon] of Object.entries(icons)) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('(label: "' + escapedLabel + '",\\r?\\n\\s*href: "[^"]+",)', 'g');
  t = t.replace(re, (m) => m + '\n    icon: "' + icon + '",');
}

fs.writeFileSync('src/data/navigation.ts', t, 'utf8');
console.log('All icons added successfully');
