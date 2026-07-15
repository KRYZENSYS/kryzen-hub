// Hash Generator - Server-side using Web Crypto API
const algorithms = {
  'sha-1': 'SHA-1',
  'sha-256': 'SHA-256',
  'sha-384': 'SHA-384',
  'sha-512': 'SHA-512'
};

async function generateHash(text, algo) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algo, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { text, algorithms: algos = ['sha-256', 'sha-1', 'sha-512'] } = req.body || {};
    if (!text) return res.status(400).json({ error: 'Text required' });

    const hashes = {};
    for (const algo of algos) {
      if (algorithms[algo]) {
        hashes[algorithms[algo]] = await generateHash(text, algo);
      }
    }

    // Simple MD5-like
    const md5Like = (str) => {
      let h1 = 0xdeadbeef ^ 0;
      let h2 = 0x41c6ce57 ^ 0;
      for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
      }
      h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
      return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(32, '0');
    };
    hashes['MD5-like'] = md5Like(text);

    return res.status(200).json({
      success: true,
      text,
      hashes,
      length: text.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
