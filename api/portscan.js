// Port Scanner - Real TCP port check
// Limited due to serverless restrictions, but checks common ports via HTTP/HTTPS

const commonPorts = {
  21: 'FTP', 22: 'SSH', 23: 'Telnet', 25: 'SMTP', 53: 'DNS',
  80: 'HTTP', 110: 'POP3', 143: 'IMAP', 443: 'HTTPS', 445: 'SMB',
  3306: 'MySQL', 3389: 'RDP', 5432: 'PostgreSQL', 5900: 'VNC',
  6379: 'Redis', 8080: 'HTTP-Alt', 8443: 'HTTPS-Alt', 27017: 'MongoDB'
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { host = 'google.com' } = req.query;

    // Check common ports via HTTP/HTTPS HEAD request
    const checks = Object.keys(commonPorts).map(async (port) => {
      const protocol = port == 443 || port == 8443 ? 'https' : 'http';
      const url = `${protocol}://${host}:${port}`;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const r = await fetch(url, {
          method: 'HEAD',
          signal: controller.signal,
          redirect: 'manual'
        });
        clearTimeout(timeout);
        return { port: parseInt(port), service: commonPorts[port], status: 'open', code: r.status };
      } catch (e) {
        return { port: parseInt(port), service: commonPorts[port], status: 'closed' };
      }
    });

    const results = await Promise.all(checks);
    const open = results.filter(r => r.status === 'open');
    const closed = results.filter(r => r.status === 'closed');

    return res.status(200).json({
      success: true,
      host,
      totalScanned: results.length,
      openCount: open.length,
      closedCount: closed.length,
      results: results.sort((a, b) => a.port - b.port),
      open
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
