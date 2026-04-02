const res = await fetch('https://www.rushabhjewel.com/');
const body = await res.text();
const idx = body.indexOf('Curated Collection');
if (idx !== -1) {
  console.log(body.substring(idx - 200, idx + 10000));
} else {
  console.log('Not found');
}
