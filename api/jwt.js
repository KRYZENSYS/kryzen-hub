// JWT Decoder
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { token } = req.body || {};
    if (!token) return res.status(400).json({ error: 'Token required' });

    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return res.status(400).json({ error: 'Invalid JWT format. JWT must have 3 parts.' });
    }

    const base64UrlDecode = (str) => {
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
      return decodeURIComponent(
        atob(padded)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    };

    let header, payload;
    try {
      header = JSON.parse(base64UrlDecode(parts[0]));
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JWT header' });
    }
    try {
      payload = JSON.parse(base64UrlDecode(parts[1]));
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JWT payload' });
    }

    let expired = false;
    let expiresIn = null;
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      expired = expDate < new Date();
      expiresIn = Math.floor((expDate - new Date()) / 1000);
    }

    return res.status(200).json({
      success: true,
      header,
      payload,
      signature: parts[2].substring(0, 50) + '...',
      valid: !expired,
      expired,
      expiresIn,
      algorithm: header.alg,
      type: header.typ
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
