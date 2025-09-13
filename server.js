import express from 'express';
import { urlToHtml } from './index.js';

const app = express();
const port = 3000;

app.get('/',async(req,res)=>{
  res.send("hello");
})
app.get('/scrape', async (req, res) => {
  const { url, type } = req.query;

  if (!url || !type) {
    return res.status(400).json({ error: "Missing 'url' or 'type' query parameter" });
  }

  try {
    console.log(`🔎 Scraping request: url=${url}, type=${type}`);
    const html = await urlToHtml(url, type);

    const len = html.length;
    console.log(`✅ Scraped successfully, length=${len}`);

    res.json({ url, type, len, html });
  } catch (err) {
    console.error("❌ Scraping failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Listen on all interfaces so you can hit it from your browser or curl
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 URL-to-HTML API running at http://0.0.0.0:${port}`);
});
