// URL Shortener - Real URL shortening via is.gd (no key required)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { url } = req.body || {};
    if (!url) return res.status(400).json({ error: 'URL required' });

    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Use is.gd - free, no key needed
    const response = await fetch(
      `https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`
    );
    const data = await response.json();

    if (data.shorturl) {
      return res.status(200).json({
        success: true,
        original: url,
        short: data.shorturl
      });
    }

    // Fallback to v.gd
    const fallback = await fetch(
      `https://v.gd/create.php?format=json&url=${encodeURIComponent(url)}`
    );
    const fallbackData = await fallback.json();

    if (fallbackData.shorturl) {
      return res.status(200).json({
        success: true,
        original: url,
        short: fallbackData.shorturl
      });
    }

    return res.status(500).json({ error: 'Shortener service unavailable' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
