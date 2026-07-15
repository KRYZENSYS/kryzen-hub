// Email Validator - MX record check
import { Resolver } from 'node:dns/promises';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(200).json({
        success: true,
        email,
        valid: false,
        reason: 'Format invalid'
      });
    }

    const [user, domain] = email.split('@');
    let mxRecords = [];
    let hasMX = false;

    try {
      const dnsRes = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
      const dnsData = await dnsRes.json();
      if (dnsData.Answer) {
        mxRecords = dnsData.Answer.map(a => a.data);
        hasMX = mxRecords.length > 0;
      }
    } catch (e) {}

    const valid = hasMX;
    const disposable = ['tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com', 'yopmail.com'].includes(domain);
    const role = ['admin', 'info', 'support', 'noreply', 'no-reply'].includes(user.toLowerCase());

    return res.status(200).json({
      success: true,
      email,
      valid,
      user,
      domain,
      mxRecords,
      disposable,
      role,
      score: valid && !disposable && !role ? 100 : valid && !disposable ? 70 : valid ? 40 : 0
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
