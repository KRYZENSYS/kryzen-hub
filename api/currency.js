// Currency Exchange - Free exchange rates
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { base = 'USD' } = req.query;

    // Use exchangerate-api.com free tier or open.er-api.com
    const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
    const data = await response.json();

    if (data.result === 'success') {
      return res.status(200).json({
        success: true,
        base: data.base_code,
        rates: data.rates,
        timeLastUpdate: data.time_last_update_unix,
        nextUpdate: data.time_next_update_unix
      });
    }

    // Fallback
    const fallback = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
    const fbData = await fallback.json();
    return res.status(200).json({
      success: true,
      base: fbData.base,
      rates: fbData.rates,
      date: fbData.date
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
