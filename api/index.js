// KRYZEN HUB - Single Unified API
import { promises as fs } from 'fs';
import path from 'path';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); }
      catch (e) { resolve({}); }
    });
  });
}

const handlers = {
  chat: async (req, res) => {
    const { message } = await readBody(req);
    if (!message) return res.status(400).json({ error: 'Message required' });
    const msg = message.toLowerCase();
    let reply = '';
    if (msg.match(/salom|hello|hi|привет/)) reply = 'Salom! Qanday yordam bera olaman? 🤖';
    else if (msg.match(/kod|code|python|javascript/)) reply = `Kod namunasi:\n\n\`\`\`javascript\n// ${message}\nfunction kryzen() {\n  console.log("KRYZEN HUB - 80+ tools");\n  return "success";\n}\n\`\`\``;
    else if (msg.match(/joke|hazil/)) reply = ['Dasturchi nima uchun qorong\'uda ishlaydi? Yorug\'lik xato topadi! 😄', 'Bug va feature farqi nima? Bug — bu feature siz kutmaganda! 😄', 'Kompyuter virusga chalingach shifokorga bordi. Doktor: "Ishonchingiz komil, virusmi?" 💊'][Math.floor(Math.random() * 3)];
    else if (msg.match(/quote|hikmat/)) reply = ['"Muvaffaqiyat — kichik harakatlar yig\'indisi." — Robert Collier', '"Bilim — kuch." — Frensis Bekon', '"Hayot — nima qilayotganingiz, nima qilishni xohlaganingiz emas." — Mark Twain'][Math.floor(Math.random() * 3)];
    else if (/[0-9+\-*/()]/.test(msg) && !/[a-z]{4,}/.test(msg)) {
      try { const r = Function('"use strict";return (' + message.replace(/[^0-9+\-*/().\s]/g, '') + ')')(); reply = `🧮 Natija: **${r}**`; }
      catch { reply = 'Matematik ifoda noto\'g\'ri'; }
    }
    else reply = `Savolingiz: "${message}"\n\nKRYZEN AI yordamchisiman! Kodlash, ma\'lumot, savollarga javob berish — barchasi mumkin. Aniqlashtirsangiz, yaxshi yordam beraman!`;
    return res.status(200).json({ success: true, message: reply });
  },

  translate: async (req, res) => {
    const { text, from = 'auto', to = 'en' } = await readBody(req);
    if (!text) return res.status(400).json({ error: 'Text required' });
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
      const r = await fetch(url);
      const data = await r.json();
      const translated = data[0]?.map(x => x[0]).join('') || text;
      return res.status(200).json({ success: true, translated, from, to });
    } catch (e) {
      const dict = { 'hello': { uz: 'salom', ru: 'привет', en: 'hello' }, 'world': { uz: 'dunyo', ru: 'мир', en: 'world' }, 'thank you': { uz: 'rahmat', ru: 'спасибо', en: 'thank you' }, 'good morning': { uz: 'xayrli tong', ru: 'доброе утро', en: 'good morning' } };
      const t = text.toLowerCase().trim();
      const translated = dict[t]?.[to] || `[${to}] ${text}`;
      return res.status(200).json({ success: true, translated, fallback: true });
    }
  },

  weather: async (req, res) => {
    const city = (req.query.city || 'Tashkent').toString();
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
      const geoR = await fetch(geoUrl);
      const geo = await geoR.json();
      if (!geo.results || geo.results.length === 0) return res.status(404).json({ error: 'City not found' });
      const loc = geo.results[0];
      const wUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`;
      const wR = await fetch(wUrl);
      const w = await wR.json();
      const code = w.current.weather_code;
      const desc = { 0: '☀️ Ochiq', 1: '🌤 Asosan ochiq', 2: '⛅️ Qisman bulutli', 3: '☁️ Bulutli', 45: '🌫 Tuman', 48: '🌫 Muzli tuman', 51: '🌦 Yengil yomg\'ir', 61: '🌧 Yomg\'ir', 63: '🌧 Kuchli yomg\'ir', 71: '🌨 Qor', 95: '⛈ Momaqaldiroq' };
      const icon = desc[code] || '🌤';
      return res.status(200).json({ success: true, location: { name: loc.name, country: loc.country, lat: loc.latitude, lon: loc.longitude }, current: { temperature_2m: w.current.temperature_2m, relative_humidity_2m: w.current.relative_humidity_2m, apparent_temperature: w.current.apparent_temperature, wind_speed_10m: w.current.wind_speed_10m, icon, description: icon } });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  },

  news: async (req, res) => {
    try {
      const r = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      const ids = await r.json();
      const top = ids.slice(0, 20);
      const articles = await Promise.all(top.map(async (id) => {
        const item = await (await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)).json();
        return { title: item.title, url: item.url || `https://news.ycombinator.com/item?id=${id}`, score: item.score, comments: item.descendants || 0, time: new Date(item.time * 1000).toLocaleString('uz-UZ'), source: new URL(item.url || 'https://news.ycombinator.com').hostname };
      }));
      return res.status(200).json({ success: true, articles, category: 'top' });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  },

  crypto: async (req, res) => {
    try {
      const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,cardano,ripple,dogecoin,polkadot,tron,avalanche-2&vs_currencies=usd&include_24hr_change=true');
      const data = await r.json();
      return res.status(200).json({ success: true, prices: data, timestamp: new Date().toISOString() });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  },

  currency: async (req, res) => {
    const base = (req.query.base || 'USD').toString().toUpperCase();
    try {
      const r = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
      const data = await r.json();
      return res.status(200).json({ success: true, base: data.base, date: data.date, rates: data.rates });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  },

  dictionary: async (req, res) => {
    const word = (req.query.word || '').toString().toLowerCase();
    if (!word) return res.status(400).json({ error: 'Word required' });
    try {
      const r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      const data = await r.json();
      if (data.title === 'No Definitions Found') return res.status(404).json({ error: 'Word not found' });
      const entry = data[0];
      return res.status(200).json({ success: true, word: entry.word, phonetic: entry.phonetic, meanings: entry.meanings.map(m => ({ partOfSpeech: m.partOfSpeech, definitions: m.definitions.slice(0, 3).map(d => ({ definition: d.definition, example: d.example })) })) });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  },

  quote: async (req, res) => {
    const type = (req.query.type || 'quote').toString();
    try {
      if (type === 'joke') {
        const r = await fetch('https://official-joke-api.appspot.com/random_joke');
        const data = await r.json();
        return res.status(200).json({ success: true, type, text: `${data.setup} — ${data.punchline}` });
      } else {
        const r = await fetch('https://api.quotable.io/random');
        const data = await r.json();
        return res.status(200).json({ success: true, type, text: data.content, author: data.author });
      }
    } catch (e) { return res.status(500).json({ error: e.message }); }
  },

  ip: async (req, res) => {
    const ip = (req.query.ip || '').toString();
    try {
      const r = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
      const data = await r.json();
      if (data.status === 'fail') return res.status(404).json({ error: 'IP not found' });
      return res.status(200).json({ success: true, ...data });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  },

  dns: async (req, res) => {
    const domain = (req.query.domain || '').toString();
    const type = (req.query.type || 'A').toString();
    if (!domain) return res.status(400).json({ error: 'Domain required' });
    try {
      const r = await fetch(`https://dns.google/resolve?name=${domain}&type=${type}`);
      const data = await r.json();
      return res.status(200).json({ success: true, ...data });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  },

  whois: async (req, res) => {
    const domain = (req.query.domain || '').toString();
    if (!domain) return res.status(400).json({ error: 'Domain required' });
    try {
      const r = await fetch(`https://rdap.org/domain/${domain}`);
      const data = await r.json();
      const events = (data.events || []).reduce((acc, e) => { acc[e.eventType] = e.eventDate; return acc; }, {});
      return res.status(200).json({ success: true, domain, registrar: data.entities?.[0]?.vcardArray?.[1]?.find(x => x[0] === 'fn')?.[3] || 'N/A', creationDate: events.registration || 'N/A', expirationDate: events.expiration || 'N/A', lastUpdated: events.last_changed || 'N/A', nameservers: data.nameservers?.map(n => n.ldhName) || [] });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  },

  headers: async (req, res) => {
    const url = (req.query.url || '').toString();
    if (!url) return res.status(400).json({ error: 'URL required' });
    try {
      const r = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      const headers = {};
      r.headers.forEach((v, k) => { headers[k] = v; });
      let score = 0;
      if (headers['strict-transport-security']) score++;
      if (headers['content-security-policy']) score++;
      if (headers['x-frame-options']) score++;
      if (headers['x-content-type-options']) score++;
      if (headers['referrer-policy']) score++;
      const grade = score >= 5 ? 'A+' : score >= 4 ? 'A' : score >= 3 ? 'B' : score >= 2 ? 'C' : 'D';
      return res.status(200).json({ success: true, url, status: r.status, headers, security: { hsts: !!headers['strict-transport-security'], csp: !!headers['content-security-policy'], xframe: !!headers['x-frame-options'], xss: !!headers['x-xss-protection'] }, score, grade });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  },

  github: async (req, res) => {
    const username = (req.query.username || '').toString();
    if (!username) return res.status(400).json({ error: 'Username required' });
    try {
      const userR = await fetch(`https://api.github.com/users/${username}`);
      const user = await userR.json();
      if (user.message) return res.status(404).json({ error: user.message });
      const reposR = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=stars`);
      const repos = await reposR.json();
      const topRepos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5).map(r => ({ name: r.name, description: r.description, url: r.html_url, stars: r.stargazers_count, forks: r.forks_count, language: r.language }));
      const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
      return res.status(200).json({ success: true, user: { login: user.login, name: user.name, avatar: user.avatar_url, bio: user.bio, location: user.location, company: user.company, blog: user.blog, publicRepos: user.public_repos, followers: user.followers, following: user.following }, stats: { totalStars }, topRepos });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  },

  shorten: async (req, res) => {
    const { url } = await readBody(req);
    if (!url) return res.status(400).json({ error: 'URL required' });
    try {
      const r = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
      const data = await r.json();
      return res.status(200).json({ success: true, short: data.shorturl, original: url });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  },

  download: async (req, res) => {
    const { url, quality = 'best' } = await readBody(req);
    if (!url) return res.status(400).json({ error: 'URL required' });
    let platform = 'unknown';
    let videoId = '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) { platform = 'YouTube'; videoId = (url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/) || [])[1] || ''; }
    else if (url.includes('instagram.com')) platform = 'Instagram';
    else if (url.includes('tiktok.com')) platform = 'TikTok';
    else if (url.includes('twitter.com') || url.includes('x.com')) platform = 'Twitter/X';
    const services = [
      { service: 'SaveFrom.net', url: `https://savefrom.net/${url}`, note: 'Multi-platform downloader' },
      { service: 'Y2mate', url: `https://www.y2mate.com/youtube/${videoId || url}`, note: 'YouTube downloader' }
    ];
    return res.status(200).json({ success: true, platform, videoId, quality, downloadOptions: services, message: 'Yuqoridagi xizmatlardan birini oching va yuklab oling.' });
  },

  holidays: async (req, res) => {
    const country = (req.query.country || 'UZ').toString().toUpperCase();
    const year = (req.query.year || new Date().getFullYear()).toString();
    try {
      const r = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
      const data = await r.json();
      if (!Array.isArray(data)) return res.status(404).json({ error: 'No data' });
      return res.status(200).json({ success: true, country, year, count: data.length, holidays: data });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  },

  qrcode: async (req, res) => {
    const data = (req.query.data || 'https://kryzen.com').toString();
    const size = (req.query.size || 300).toString();
    return res.status(200).json({ success: true, url: `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(data)}&chld=M|2`, data, size });
  },

  password: async (req, res) => {
    const len = Math.min(Math.max(parseInt(req.query.length) || 20, 8), 128);
    const count = Math.min(Math.max(parseInt(req.query.count) || 1, 1), 20);
    const u = req.query.uppercase !== 'false';
    const l = req.query.lowercase !== 'false';
    const n = req.query.numbers !== 'false';
    const s = req.query.symbols !== 'false';
    let chars = '';
    if (u) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (l) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (n) chars += '0123456789';
    if (s) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const passwords = [];
    for (let i = 0; i < count; i++) {
      let pwd = '';
      const rv = new Uint32Array(len);
      crypto.getRandomValues(rv);
      for (let j = 0; j < len; j++) pwd += chars[rv[j] % chars.length];
      passwords.push(pwd);
    }
    const calc = (p) => { let s = 0; if (p.length >= 8) s++; if (p.length >= 12) s++; if (p.length >= 16) s++; if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++; if (/\d/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++; return { score: s, label: s <= 2 ? 'weak' : s <= 3 ? 'medium' : s <= 4 ? 'strong' : 'very-strong' }; };
    return res.status(200).json({ success: true, passwords: passwords.map(p => ({ value: p, strength: calc(p) })) });
  },

  uuid: async (req, res) => {
    const count = Math.min(Math.max(parseInt(req.query.count) || 5, 1), 100);
    const uuids = [];
    for (let i = 0; i < count; i++) {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
      uuids.push(`${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`);
    }
    return res.status(200).json({ success: true, uuids });
  },

  lorem: async (req, res) => {
    const paragraphs = Math.min(Math.max(parseInt(req.query.paragraphs) || 3, 1), 20);
    const lorem = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');
    const text = Array(paragraphs).fill(0).map(() => Array(4 + Math.floor(Math.random() * 4)).fill(0).map(() => { const w = 6 + Math.floor(Math.random() * 10); const sent = Array(w).fill(0).map(() => lorem[Math.floor(Math.random() * lorem.length)]).join(' '); return sent.charAt(0).toUpperCase() + sent.slice(1) + '.'; }).join(' ')).join('\n\n');
    return res.status(200).json({ success: true, paragraphs, text, wordCount: text.split(/\s+/).length });
  },

  hash: async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
    const { text } = await readBody(req);
    if (!text) return res.status(400).json({ error: 'Text required' });
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashes = {};
    for (const algo of ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']) {
      const buf = await crypto.subtle.digest(algo, data);
      hashes[algo] = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return res.status(200).json({ success: true, text, hashes });
  },

  ssl: async (req, res) => {
    const domain = (req.query.domain || '').toString().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!domain) return res.status(400).json({ error: 'Domain required' });
    try {
      const r = await fetch(`https://${domain}`, { method: 'HEAD', redirect: 'follow' }).catch(() => null);
      const headers = {};
      if (r) r.headers.forEach((v, k) => { headers[k] = v; });
      const hasHSTS = !!headers['strict-transport-security'];
      const hasCSP = !!headers['content-security-policy'];
      const isHttps = r?.url?.startsWith('https');
      const grade = hasHSTS && hasCSP ? 'A+' : hasHSTS ? 'A' : isHttps ? 'B' : 'C';
      return res.status(200).json({ success: true, domain, valid: !!r, https: isHttps, hsts: hasHSTS, csp: hasCSP, grade, status: r ? '✅ SSL Active' : '⚠️ Could not verify' });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  },

  subdomain: async (req, res) => {
    const domain = (req.query.domain || '').toString().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!domain) return res.status(400).json({ error: 'Domain required' });
    const subs = ['www', 'mail', 'ftp', 'api', 'app', 'admin', 'blog', 'dev', 'cdn', 'static', 'cloud', 'git', 'docs', 'status', 'login', 'mx', 'ns1', 'ns2', 'webmail', 'shop', 'pay', 'media', 'support', 'test', 'staging', 'panel', 'm'];
    const found = [];
    const checks = await Promise.all(subs.map(async (sub) => {
      try {
        const r = await fetch(`https://dns.google/resolve?name=${sub}.${domain}&type=A`);
        const d = await r.json();
        if (d.Answer && d.Answer.length > 0) return { subdomain: `${sub}.${domain}`, ip: d.Answer[0].data };
      } catch (e) {}
      return null;
    }));
    checks.forEach(c => c && found.push(c));
    return res.status(200).json({ success: true, domain, foundCount: found.length, found });
  },

  jwt: async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
    const { token } = await readBody(req);
    if (!token) return res.status(400).json({ error: 'Token required' });
    const parts = token.trim().split('.');
    if (parts.length !== 3) return res.status(400).json({ error: 'Invalid JWT format' });
    try {
      const decode = (s) => JSON.parse(Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - s.length % 4) % 4), 'base64').toString());
      const header = decode(parts[0]);
      const payload = decode(parts[1]);
      const expired = payload.exp ? (new Date(payload.exp * 1000) < new Date()) : false;
      return res.status(200).json({ success: true, header, payload, valid: !expired, expired, algorithm: header.alg });
    } catch (e) { return res.status(400).json({ error: 'Invalid JWT' }); }
  },

  phone: async (req, res) => {
    const phone = (req.query.phone || '').toString().replace(/[^\d+]/g, '');
    if (!phone) return res.status(400).json({ error: 'Phone required' });
    const countries = [{ code: '+998', name: 'Uzbekistan', flag: '🇺🇿', length: 12 }, { code: '+7', name: 'Russia/Kazakhstan', flag: '🇷🇺', length: 11 }, { code: '+1', name: 'USA/Canada', flag: '🇺🇸', length: 11 }, { code: '+90', name: 'Turkey', flag: '🇹🇷', length: 12 }, { code: '+86', name: 'China', flag: '🇨🇳', length: 13 }, { code: '+91', name: 'India', flag: '🇮🇳', length: 12 }, { code: '+44', name: 'UK', flag: '🇬🇧', length: 12 }, { code: '+49', name: 'Germany', flag: '🇩🇪', length: 12 }];
    const country = countries.find(c => phone.startsWith(c.code)) || countries.find(c => c.length === phone.length);
    const valid = country ? phone.length === country.length : phone.length >= 7 && phone.length <= 15;
    return res.status(200).json({ success: true, phone, valid, country });
  },

  email: async (req, res) => {
    const email = (req.query.email || '').toString().toLowerCase();
    if (!email) return res.status(400).json({ error: 'Email required' });
    const [user, domain] = email.split('@');
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const disposable = ['mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'yopmail.com'].includes(domain);
    const role = ['admin', 'info', 'support', 'noreply', 'contact'].includes(user);
    const score = (valid ? 50 : 0) + (!disposable ? 30 : 0) + (!role ? 20 : 0);
    let mxRecords = [];
    try { const r = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`); const d = await r.json(); mxRecords = d.Answer || []; } catch (e) {}
    return res.status(200).json({ success: true, email, valid, user, domain, mxRecords, disposable, role, score });
  },

  breach: async (req, res) => {
    const email = (req.query.email || '').toString();
    if (!email) return res.status(400).json({ error: 'Email required' });
    try {
      const r = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`, { headers: { 'User-Agent': 'kryzen-hub' } });
      if (r.status === 404) return res.status(200).json({ success: true, safe: true, breaches: [], message: '✅ Bu email hech qayerdan sizib chiqmagan!' });
      const data = await r.json();
      return res.status(200).json({ success: true, safe: false, breaches: data, message: `⚠️ ${data.length} ta sizib chiqishda qatnashgan!` });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  },

  sentiment: async (req, res) => {
    const { text } = await readBody(req);
    if (!text) return res.status(400).json({ error: 'Text required' });
    const pos = ['good', 'great', 'awesome', 'amazing', 'love', 'best', 'excellent', 'perfect', 'wonderful', 'happy', 'joy', 'beautiful', 'super', 'nice'];
    const neg = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'sad', 'angry', 'ugly', 'poor', 'disappointing', 'fail', 'broken'];
    const t = text.toLowerCase();
    const pCount = pos.filter(w => t.includes(w)).length;
    const nCount = neg.filter(w => t.includes(w)).length;
    const total = pCount + nCount;
    let label, emoji, score;
    if (total === 0) { label = 'neutral'; emoji = '😐'; score = 0; }
    else if (pCount > nCount) { label = 'positive'; emoji = '😊'; score = pCount / total; }
    else if (nCount > pCount) { label = 'negative'; emoji = '😢'; score = -(nCount / total); }
    else { label = 'neutral'; emoji = '😐'; score = 0; }
    return res.status(200).json({ success: true, label, emoji, score, positive: pCount, negative: nCount, text });
  },

  summarize: async (req, res) => {
    const { text, ratio = 0.3 } = await readBody(req);
    if (!text) return res.status(400).json({ error: 'Text required' });
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const stops = new Set(['the', 'a', 'an', 'and', 'or', 'is', 'are', 'was', 'in', 'on', 'at', 'to', 'for', 'of', 'va', 'bilan', 'uchun', 'bu', 'u']);
    const freq = {};
    words.forEach(w => { const c = w.toLowerCase().replace(/[^\w]/g, ''); if (c && !stops.has(c) && c.length > 2) freq[c] = (freq[c] || 0) + 1; });
    const scores = sentences.map((s, i) => { const sw = s.toLowerCase().split(/\s+/); let sc = 0; sw.forEach(w => { const c = w.replace(/[^\w]/g, ''); if (freq[c]) sc += freq[c]; }); return { sentence: s.trim(), score: sc / Math.max(sw.length, 1), index: i }; });
    const count = Math.max(1, Math.floor(sentences.length * ratio));
    const top = scores.sort((a, b) => b.score - a.score).slice(0, count).sort((a, b) => a.index - b.index);
    const summary = top.map(s => s.sentence).join('. ') + '.';
    return res.status(200).json({ success: true, original: { words: words.length, sentences: sentences.length }, summary, compression: ((1 - summary.split(/\s+/).length / words.length) * 100).toFixed(1) + '%', topWords: Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([w, c]) => ({ word: w, count: c })) });
  }
};

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = req.url || '';
  let endpoint = '';

  // Detect endpoint from path or query
  if (req.query.action) {
    endpoint = req.query.action;
  } else {
    const pathOnly = url.split('?')[0];
    const match = pathOnly.match(/\/api\/([^?\/?]+)/);
    if (match && match[1] !== 'index') endpoint = match[1];
  }

  if (!endpoint) {
    return res.status(200).json({
      success: true,
      name: 'KRYZEN HUB API',
      version: '2.0',
      endpoints: Object.keys(handlers),
      count: Object.keys(handlers).length,
      message: '30+ real APIs ready! Use /api/<endpoint>'
    });
  }

  const handlerFn = handlers[endpoint];
  if (!handlerFn) {
    return res.status(404).json({ error: `Endpoint '${endpoint}' not found`, available: Object.keys(handlers) });
  }

  try {
    return await handlerFn(req, res);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
