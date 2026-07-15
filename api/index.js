// API index - KRYZEN HUB backend
// Vercel serverless function

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    name: 'KRYZEN HUB API',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      '/api/chat - AI Chat (HuggingFace)',
      '/api/ip - IP Lookup',
      '/api/dns - DNS Lookup',
      '/api/whois - WHOIS Lookup',
      '/api/translate - Translator',
      '/api/weather - Weather',
      '/api/news - News',
      '/api/github - GitHub User Info',
      '/api/download - Social Media Downloader',
      '/api/shorten - URL Shortener',
      '/api/password - Password Generator',
      '/api/uuid - UUID Generator',
      '/api/qrcode - QR Code',
      '/api/lorem - Lorem Ipsum',
      '/api/quote - Random Quote',
      '/api/joke - Random Joke',
      '/api/crypto - Crypto Prices',
      '/api/currency - Currency Exchange',
      '/api/holidays - Holidays',
      '/api/dictionary - Word Definition',
      '/api/summarize - Text Summarizer',
      '/api/sentiment - Sentiment Analysis',
      '/api/portscan - Port Scanner',
      '/api/headers - HTTP Headers',
      '/api/ssl - SSL Check',
      '/api/subdomain - Subdomain Finder',
      '/api/email - Email Validator',
      '/api/phone - Phone Validator',
      '/api/hash - Hash Generator',
      '/api/jwt - JWT Decoder',
      '/api/breach - Email Breach Check'
    ]
  });
}
