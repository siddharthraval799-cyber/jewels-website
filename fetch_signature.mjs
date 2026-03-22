import https from 'https';

https.get('https://www.rushabhjewel.com/', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    // Look for Signature Styles section
    const sectionMatch = data.match(/Signature Styles.*?<\/section>/is);
    if (!sectionMatch) {
      console.log('Section not found');
      return;
    }
    const sectionHTML = sectionMatch[0];
    const regex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;
    const items = [];
    while((match = regex.exec(sectionHTML)) !== null) {
      const src = match[1];
      if (src && src.includes('http')) {
        items.push(src);
      } else if (src && src.startsWith('/')) {
        items.push('https://www.rushabhjewel.com' + src);
      }
    }
    console.log("Found URLs:\n" + items.join('\n'));
  });
}).on('error', (e) => {
  console.error(e);
});
