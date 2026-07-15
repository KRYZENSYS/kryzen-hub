// Subdomain Finder - Real DNS check
const subdomains = [
  'www', 'mail', 'ftp', 'smtp', 'pop', 'imap', 'webmail',
  'api', 'app', 'admin', 'panel', 'cpanel',
  'blog', 'dev', 'staging', 'test', 'qa',
  'cdn', 'static', 'assets', 'media', 'images',
  'shop', 'store', 'pay', 'payment',
  'cloud', 'git', 'github', 'gitlab',
  'mobile', 'm', 'docs', 'wiki', 'help', 'support',
  'status', 'monitor', 'vpn', 'proxy',
  'ns', 'ns1', 'ns2', 'dns', 'auth', 'login', 'sso',
  'chat', 'video', 'stream', 'live',
  'forum', 'social', 'meet', 'search', 'analytics',
  'remote', 'ssh', 'sftp', 'db', 'database', 'mysql', 'redis',
  'mx', 'mx1', 'mx2', 'email', 'mail2'
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { domain } = req.query;
    if (!domain) return res.status(400).json({ error: 'Domain required' });

    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const found = [];

    // Check in chunks
    const chunks = [];
    for (let i = 0; i < subdomains.length; i += 15) {
      chunks.push(subdomains.slice(i, i + 15));
    }

    for (const chunk of chunks) {
      const checks = chunk.map(async (sub) => {
        try {
          const r = await fetch(`https://dns.google/resolve?name=${sub}.${cleanDomain}&type=A`);
          const d = await r.json();
          if (d.Answer && d.Answer.length > 0) {
            return {
              subdomain: `${sub}.${cleanDomain}`,
              ip: d.Answer[0].data
            };
          }
        } catch (e) {}
        return null;
      });
      const results = await Promise.all(checks);
      results.forEach(r => r && found.push(r));
    }

    return res.status(200).json({
      success: true,
      domain: cleanDomain,
      totalScanned: subdomains.length,
      foundCount: found.length,
      found
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
