// Weather - Real-time weather using Open-Meteo (free, no key)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { city = 'Tashkent' } = req.query;

    // 1. Geocode city to coordinates
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return res.status(404).json({ error: 'City not found' });
    }

    const { latitude, longitude, name, country, admin1 } = geoData.results[0];

    // 2. Get weather
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=7`
    );
    const weather = await weatherRes.json();

    const codeMap = {
      0: { desc: '☀️ Clear sky', icon: '☀️' },
      1: { desc: '🌤️ Mainly clear', icon: '🌤️' },
      2: { desc: '⛅ Partly cloudy', icon: '⛅' },
      3: { desc: '☁️ Overcast', icon: '☁️' },
      45: { desc: '🌫️ Foggy', icon: '🌫️' },
      48: { desc: '🌫️ Depositing rime fog', icon: '🌫️' },
      51: { desc: '🌦️ Light drizzle', icon: '🌦️' },
      53: { desc: '🌦️ Moderate drizzle', icon: '🌦️' },
      55: { desc: '🌦️ Dense drizzle', icon: '🌦️' },
      61: { desc: '🌧️ Slight rain', icon: '🌧️' },
      63: { desc: '🌧️ Moderate rain', icon: '🌧️' },
      65: { desc: '🌧️ Heavy rain', icon: '🌧️' },
      71: { desc: '🌨️ Slight snow', icon: '🌨️' },
      73: { desc: '🌨️ Moderate snow', icon: '🌨️' },
      75: { desc: '❄️ Heavy snow', icon: '❄️' },
      77: { desc: '🌨️ Snow grains', icon: '🌨️' },
      80: { desc: '🌦️ Slight rain showers', icon: '🌦️' },
      81: { desc: '🌧️ Moderate rain showers', icon: '🌧️' },
      82: { desc: '⛈️ Violent rain showers', icon: '⛈️' },
      95: { desc: '⛈️ Thunderstorm', icon: '⛈️' },
      96: { desc: '⛈️ Thunderstorm with hail', icon: '⛈️' },
      99: { desc: '⛈️ Thunderstorm with heavy hail', icon: '⛈️' }
    };

    const currentCode = weather.current.weather_code;
    const currentDesc = codeMap[currentCode] || { desc: 'Unknown', icon: '❓' };

    return res.status(200).json({
      success: true,
      location: { name, country, region: admin1, lat: latitude, lon: longitude },
      current: {
        ...weather.current,
        description: currentDesc.desc,
        icon: currentDesc.icon
      },
      daily: weather.daily,
      timezone: weather.timezone
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
