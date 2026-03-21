const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  console.log("Navigating to http://localhost:8080...");
  try {
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
  } catch(e) {
    console.log("Goto error:", e.message);
  }
  
  console.log("Waiting 6 seconds (to bypass preloader)...");
  await page.waitForTimeout(6000);
  
  const content = await page.content();
  console.log("HTML length:", content.length);
  console.log("Root container content:", await page.$eval('#root', el => el.innerHTML).catch(e => "No #root"));
  
  await browser.close();
})();
