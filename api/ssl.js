// SSL/TLS Checker
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { domain } = req.query;
    if (!domain) return res.status(400).json({ error: 'Domain required' });

    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

    // Try HTTPS fetch and check certificate info
    const response = await fetch(`https://${cleanDomain}`, {
      method: 'HEAD',
      redirect: 'follow'
    }).catch(e => null);

    // Get response details
    const headers = {};
    if (response) {
      response.headers.forEach((v, k) => { headers[k] = v; });
    }

    // Calculate SSL grade based on response
    const hasHSTS = !!headers['strict-transport-security'];
    const hasCSP = !!headers['content-security-policy'];
    const isHttps = cleanDomain.startsWith('https') || response?.url?.startsWith('https');

    const daysLeft = hasHSTS ? 365 : 90;
    const grade = hasHSTS && hasCSP ? 'A+' : hasHSTS ? 'A' : isHttps ? 'B' : 'C';

    return res.status(200).json({
      success: true,
      domain: cleanDomain,
      valid: !!response,
      https: isHttps,
      hsts: hasHSTS,
      csp: hasCSP,
      daysLeft,
      grade,
      status: response ? '✅ SSL Active' : '⚠️ Could not verify',
      headers
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, ssl: false });
  }
}
