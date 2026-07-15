// Password Generator - Server-side with Web Crypto
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { length = 20, count = 1, uppercase = 'true', lowercase = 'true', numbers = 'true', symbols = 'true' } = req.query;

  const len = Math.min(Math.max(parseInt(length) || 20, 8), 128);
  const cnt = Math.min(Math.max(parseInt(count) || 1, 1), 20);

  let chars = '';
  if (uppercase === 'true') chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase === 'true') chars += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers === 'true') chars += '0123456789';
  if (symbols === 'true') chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (chars.length === 0) chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

  const passwords = [];
  for (let i = 0; i < cnt; i++) {
    let pwd = '';
    const randomValues = new Uint32Array(len);
    crypto.getRandomValues(randomValues);
    for (let j = 0; j < len; j++) {
      pwd += chars[randomValues[j] % chars.length];
    }
    passwords.push(pwd);
  }

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 16) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return {
      score,
      label: score <= 2 ? 'weak' : score <= 3 ? 'medium' : score <= 4 ? 'strong' : 'very-strong'
    };
  };

  return res.status(200).json({
    success: true,
    passwords: passwords.map(p => ({
      value: p,
      strength: calculateStrength(p)
    })),
    length: len,
    timestamp: new Date().toISOString()
  });
}
