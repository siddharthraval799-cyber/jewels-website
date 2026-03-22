const https = require('https');
https.get('https://www.rushabhjewel.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const sectionMatch = data.match(/Curated Collection.*?<\/section>/is);
    if (!sectionMatch) {
      console.log('Section not found');
      return;
    }
    const section = sectionMatch[0];
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']+)["'][^>]*>/gi;
    let match;
    while ((match = imgRegex.exec(section)) !== null) {
      console.log(`Title: ${match[2]} | Image: ${match[1]}`);
    }
  });
}).on('error', (e) => {
  console.error(e);
});
