// DNS Lookup - Multiple record types
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { domain, type = 'A' } = req.query;
    if (!domain) return res.status(400).json({ error: 'Domain required' });

    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

    const recordTypes = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA', 'PTR'];
    const results = {};

    // Fetch all record types in parallel
    const promises = recordTypes.map(async (t) => {
      try {
        const r = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=${t}`);
        const d = await r.json();
        if (d.Answer && d.Answer.length > 0) {
          results[t] = d.Answer;
        }
      } catch (e) {
        // Skip on error
      }
    });

    await Promise.all(promises);

    // Also get the requested type specifically
    let mainResult = null;
    try {
      const r = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=${type}`);
      mainResult = await r.json();
    } catch (e) {}

    return res.status(200).json({
      success: true,
      domain: cleanDomain,
      type,
      records: results,
      answer: mainResult?.Answer || [],
      status: mainResult?.Status
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
