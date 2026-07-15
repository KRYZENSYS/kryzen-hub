// WHOIS Lookup - Domain registration info
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { domain } = req.query;
    if (!domain) return res.status(400).json({ error: 'Domain required' });

    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

    // Use RDAP (Registration Data Access Protocol) - official and free
    let tld = cleanDomain.split('.').pop();
    const rdapServers = {
      'com': 'https://rdap.verisign.com/com/v1/domain/',
      'net': 'https://rdap.verisign.com/net/v1/domain/',
      'org': 'https://rdap.publicinterestregistry.org/rdap/org/domain/',
      'io': 'https://rdap.nic.io/domain/',
      'dev': 'https://rdap.nic.google/domain/',
      'app': 'https://rdap.nic.google/domain/',
      'uz': 'https://rdap.cctld.uz/domain/'
    };

    const server = rdapServers[tld] || rdapServers['com'];
    let rdapData = null;

    try {
      const r = await fetch(server + cleanDomain, {
        headers: { 'Accept': 'application/rdap+json' }
      });
      if (r.ok) rdapData = await r.json();
    } catch (e) {}

    // Extract relevant info
    const result = {
      success: true,
      domain: cleanDomain,
      tld,
      rdap: rdapData
    };

    if (rdapData) {
      result.registrar = rdapData.entities?.find(e => e.roles?.includes('registrar'))?.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3] || 'N/A';
      result.creationDate = rdapData.events?.find(e => e.eventAction === 'registration')?.eventDate;
      result.expirationDate = rdapData.events?.find(e => e.eventAction === 'expiration')?.eventDate;
      result.lastUpdated = rdapData.events?.find(e => e.eventAction === 'last changed')?.eventDate;
      result.status = rdapData.status || [];
      result.nameservers = rdapData.nameservers?.map(ns => ns.ldhName) || [];
      result.dnssec = rdapData.secureDNS?.delegationSigned;
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
