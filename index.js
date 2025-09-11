import fetch from "node-fetch";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export async function urlToHtml(url, type = "static") {
  if (!url || !type) {
    throw new Error("Missing 'url' or 'type' parameter");
  }

  try {
    if (type.toLowerCase() === "static") {
      // Fetch static HTML
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      return await response.text();
    }

    // -------- Dynamic case --------
    else if (type.toLowerCase() === "dynamic") {
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      });

      const page = await browser.newPage();

      // Helper to wait until HTML stops changing
   // Helper: wait until page HTML stops changing
async function waitForStableContent(page, timeout = 45000, checkInterval = 1000) {
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
      console.log("✅ Page content stabilized");
      break;
    }

    lastHTMLSize = currentSize;
    await new Promise((res) => setTimeout(res, checkInterval));
  }
}

await page.setDefaultNavigationTimeout(0); // disable default timeout
await page.goto(url, { waitUntil: "domcontentloaded" }); // faster than networkidle2
await page.waitForTimeout(5000); // give JS some time to kick in
await waitForStableContent(page, 45000); // wait until cars appear

const html = await page.content();
console.log("HTML length:", html.length);

      // Debug: take screenshot to confirm if cars are visible
      await page.screenshot({ path: "debug.png", fullPage: true });

      await browser.close();  
      return html;
    }

    // -------- Invalid type --------
    else {
      throw new Error("Invalid type. Use 'static' or 'dynamic'.");
    }
  } catch (err) {
    throw new Error(`Error fetching URL: ${err.message}`);
  }
}
