import express from 'express';
import { urlToHtml } from './index.js'; // import your main function

const app = express();
const port = 3000;



app.get('/scrape', async (req, res) => {
  const { url, type } = req.query;

 

  if (!url || !type) {
    return res.status(400).json({ error: "Missing 'url' or 'type' query parameter" });
  }

  try {
    const html = await urlToHtml(url, type);
    const len=html.length;
   res.send(html);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listen on all interfaces so anyone with droplet IP can access
app.listen(port, '0.0.0.0', () => {
  console.log(`URL-to-HTML API running on http://0.0.0.0:${port}`);
});
