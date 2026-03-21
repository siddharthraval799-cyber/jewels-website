import { chromium } from 'playwright';

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`BROWSER CONSOLE ERROR: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', exception => {
    console.log(`BROWSER UNCAUGHT EXCEPTION: ${exception}`);
  });

  console.log("Navigating to http://localhost:8080...");
  try {
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle', timeout: 5000 });
    console.log("Page loaded. Waiting 2 seconds for app to mount...");
    await page.waitForTimeout(2000);
    const bodyContent = await page.content();
    console.log("Body length:", bodyContent.length);
  } catch (err) {
    console.error("Navigation failed:", err.message);
  }
  
  await browser.close();
  process.exit(0);
})();
