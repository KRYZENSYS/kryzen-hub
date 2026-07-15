// Phone Validator
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ error: 'Phone required' });

    const cleaned = phone.replace(/[^\d+]/g, '');
    const countries = [
      { code: '+998', name: 'Uzbekistan', flag: '🇺🇿', length: 12 },
      { code: '+7', name: 'Russia/Kazakhstan', flag: '🇷🇺', length: 11 },
      { code: '+1', name: 'USA/Canada', flag: '🇺🇸', length: 11 },
      { code: '+90', name: 'Turkey', flag: '🇹🇷', length: 12 },
      { code: '+86', name: 'China', flag: '🇨🇳', length: 13 },
      { code: '+91', name: 'India', flag: '🇮🇳', length: 12 },
      { code: '+44', name: 'United Kingdom', flag: '🇬🇧', length: 12 },
      { code: '+49', name: 'Germany', flag: '🇩🇪', length: 12 },
      { code: '+33', name: 'France', flag: '🇫🇷', length: 11 },
      { code: '+39', name: 'Italy', flag: '🇮🇹', length: 12 },
      { code: '+34', name: 'Spain', flag: '🇪🇸', length: 11 },
      { code: '+81', name: 'Japan', flag: '🇯🇵', length: 12 },
      { code: '+82', name: 'South Korea', flag: '🇰🇷', length: 12 },
      { code: '+55', name: 'Brazil', flag: '🇧🇷', length: 12 },
      { code: '+996', name: 'Kyrgyzstan', flag: '🇰🇬', length: 12 },
      { code: '+992', name: 'Tajikistan', flag: '🇹🇯', length: 12 }
    ];

    let country = countries.find(c => cleaned.startsWith(c.code));
    if (!country) {
      country = countries.find(c => c.length === cleaned.length);
    }

    const valid = country ? cleaned.length === country.length : cleaned.length >= 7 && cleaned.length <= 15;
    const operator = country && country.code === '+998' ? ['Ucell', 'Beeline', 'UMS', 'Perfectum'][parseInt(cleaned[5]) % 4] : null;

    return res.status(200).json({
      success: true,
      phone: cleaned,
      valid,
      country: country || null,
      operator,
      formatted: country ? cleaned.replace(/(\+\d{2,3})(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5') : cleaned
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
