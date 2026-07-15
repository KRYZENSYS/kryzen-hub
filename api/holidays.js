// Holidays API - Public holidays worldwide
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { country = 'UZ', year = new Date().getFullYear() } = req.query;
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
    const data = await response.json();

    if (Array.isArray(data)) {
      return res.status(200).json({
        success: true,
        country,
        year,
        count: data.length,
        holidays: data
      });
    }
    return res.status(404).json({ error: 'No holidays found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
