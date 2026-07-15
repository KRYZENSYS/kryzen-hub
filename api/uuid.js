// UUID Generator - Server-side UUID v4
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { count = 5 } = req.query;
  const cnt = Math.min(Math.max(parseInt(count) || 5, 1), 100);

  const uuids = [];
  for (let i = 0; i < cnt; i++) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    const uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
    uuids.push(uuid);
  }

  return res.status(200).json({
    success: true,
    count: cnt,
    uuids
  });
}
