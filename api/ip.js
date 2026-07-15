// IP Lookup - Real IP geolocation API
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const ip = req.query.ip || '';

    let url = ip
      ? `https://ipapi.co/${ip}/json/`
      : `https://ipapi.co/json/`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'KRYZEN-HUB/1.0' }
    });

    if (!response.ok) {
      // Fallback to ip-api.com
      const fallback = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await fallback.json();
      return res.status(200).json({
        success: true,
        ip: data.query,
        country: data.country,
        countryCode: data.countryCode,
        region: data.regionName,
        city: data.city,
        zip: data.zip,
        lat: data.lat,
        lon: data.lon,
        timezone: data.timezone,
        isp: data.isp,
        org: data.org,
        as: data.as
      });
    }

    const data = await response.json();
    return res.status(200).json({
      success: true,
      ip: data.ip,
      version: data.version,
      country: data.country_name,
      countryCode: data.country_code,
      region: data.region,
      city: data.city,
      zip: data.postal,
      lat: data.latitude,
      lon: data.longitude,
      timezone: data.timezone,
      isp: data.org,
      asn: data.asn,
      currency: data.currency_name,
      languages: data.languages
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
