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
      await page.goto(url, { waitUntil: "networkidle2" });

      const html = await page.content();
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