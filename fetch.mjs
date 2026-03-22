import https from 'https';

https.get('https://www.rushabhjewel.com/', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    const sectionMatch = data.match(/Curated Collection.*?<\/section>/is);
    if (!sectionMatch) {
      console.log('Section "Curated Collection" not found in HTML');
      return;
    }
    const sectionHTML = sectionMatch[0];
    const regex = /<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']+)["'][^>]*>/gi;
    let match;
    const items = [];
    while((match = regex.exec(sectionHTML)) !== null) {
      items.push({ alt: match[2].trim(), src: match[1].trim() });
    }
    console.log(JSON.stringify(items, null, 2));
  });
}).on('error', (e) => {
  console.error(e);
});
