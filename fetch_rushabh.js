const https = require('https');
https.get('https://www.rushabhjewel.com/', res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const idx = body.indexOf('Curated Collection');
    if (idx !== -1) {
      console.log(body.substring(idx - 200, idx + 10000));
    } else {
      console.log('Not found');
    }
  });
}).on('error', e => console.error(e));
