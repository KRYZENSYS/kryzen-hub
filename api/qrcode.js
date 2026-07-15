// QR Code - Server-side QR generation
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { data = 'https://kryzensys.github.io/kryzen-hub/', size = 300 } = req.query;
    const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(data)}&chld=M|2`;
    return res.status(200).json({
      success: true,
      url: qrUrl,
      data,
      size
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
