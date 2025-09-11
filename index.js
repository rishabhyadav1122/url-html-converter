import fetch from "node-fetch";
import puppeteer from "puppeteer";


export async function urlToHtml(url, type = "static") {
  if (!url || !type) {
    throw new Error("Missing 'url' or 'type' parameter");
  }

  try {
    if (type.toLowerCase() === "static") {
      // Fetch static HTML
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; URLtoHTML/1.0)"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      return await response.text();
    } 
    
    else if (type.toLowerCase() === "dynamic") {
      // Use puppeteer for dynamic rendering
      const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu'
  ]
});
      const page = await browser.newPage();
      async function waitForStableContent(page, timeout = 30000, checkInterval = 1000) {
  let lastHTMLSize = 0;
  let stableCount = 0;
  const maxStableCount = 3;
  const start = Date.now();

  while (Date.now() - start < timeout) {
    let html = await page.content();
    let currentSize = html.length;

    if (lastHTMLSize !== 0 && currentSize === lastHTMLSize) {
      stableCount++;
    } else {
      stableCount = 0;
    }

    if (stableCount >= maxStableCount) {
      break; // page is stable
    }

    lastHTMLSize = currentSize;
    await new Promise(res => setTimeout(res, checkInterval));
  }
}

await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
await waitForStableContent(page, 30000); // waits until page stops changing
const html = await page.content();
console.log("HTML length:", html.length);





      await browser.close();

      return html;
    } 
    
    else {
      throw new Error("Invalid type. Use 'static' or 'dynamic'.");
    }
  } catch (err) {
    throw new Error(`Error fetching URL: ${err.message}`);
  }
}