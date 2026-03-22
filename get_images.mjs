import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://www.rushabhjewel.com/', { waitUntil: 'load' });
  await page.waitForTimeout(2000); // Wait for the initial load

  const cats = ['Rings', 'Earrings', 'Bangles', 'Pendant Set', 'Necklace', 'Kids Collections', 'Mens Jewellery'];
  const allData = {};

  for (const cat of cats) {
    try {
      // Find the menu link
      const links = await page.$$('a');
      let foundLink = null;
      for (const link of links) {
        const text = await link.innerText();
        if (text.trim() === cat) {
          foundLink = link;
          break;
        }
      }

      if (!foundLink) {
        console.error('Could not find link for', cat);
        continue;
      }

      await foundLink.hover();
      await page.waitForTimeout(1500); // Wait for animation and image load

      const images = await page.evaluate(() => {
        // Collect all images in the document that are large enough (not small icons)
        // Since mega menu opens, we want images that are recently visible and large.
        const imgs = Array.from(document.querySelectorAll('img')).filter(img => {
          const r = img.getBoundingClientRect();
          // Filter out tiny icons and logos horizontally positioned across top nav
          return r.width > 50 && r.height > 50 && r.top > 60 && img.offsetParent !== null;
        });

        return imgs.map(img => {
          let label = img.alt || '';
          if (!label) {
            // Try to find the closest text below or around the image
            const parent = img.closest('a') || img.parentElement;
            if (parent) label = parent.innerText.trim();
          }
          return { src: img.src, label };
        }).filter(item => item.src && item.src.includes('http'));
      });
      
      allData[cat] = images;
      
      // Hover away
      await page.mouse.move(0, 0);
      await page.waitForTimeout(1000);
      
    } catch(e) {
      console.error('Error on', cat, e);
    }
  }

  console.log(JSON.stringify(allData, null, 2));
  await browser.close();
})();
