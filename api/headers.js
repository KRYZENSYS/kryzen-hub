// HTTP Headers Checker - Real HTTP HEAD request
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL required' });

    let targetUrl = url;
    if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

    const response = await fetch(targetUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'KRYZEN-HUB/1.0' }
    });

    const headers = {};
    response.headers.forEach((v, k) => { headers[k] = v; });

    // Security analysis
    const security = {
      hsts: !!headers['strict-transport-security'],
      csp: !!headers['content-security-policy'],
      xframe: !!headers['x-frame-options'],
      xss: !!headers['x-xss-protection'],
      contentType: !!headers['x-content-type-options'],
      referrer: !!headers['referrer-policy'],
      poweredBy: headers['x-powered-by'] || 'Hidden ✓'
    };

    const securityScore = Object.values(security).filter(v => v === true).length * 14;
    const grade = securityScore >= 90 ? 'A+' : securityScore >= 80 ? 'A' : securityScore >= 70 ? 'B' : securityScore >= 60 ? 'C' : 'D';

    return res.status(200).json({
      success: true,
      url: targetUrl,
      finalUrl: response.url,
      status: response.status,
      statusText: response.statusText,
      headers,
      security,
      securityScore,
      grade
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
