import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  page.on('response', response => {
    if (!response.ok()) {
      console.log('NETWORK ERROR:', response.status(), response.url());
    }
  });

  console.log('Navigating to https://jewels-website-chi.vercel.app ...');
  await page.goto('https://jewels-website-chi.vercel.app', { waitUntil: 'networkidle' });
  
  const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML || 'NO ROOT ELEMENT');
  console.log('ROOT HTML LENGTH:', rootHtml.length);
  
  await browser.close();
})();
