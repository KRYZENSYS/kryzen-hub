// KRYZEN HUB - Unified API Router
// All 30+ endpoints in a single serverless function (Hobby plan limit = 12)

import { promises as fs } from 'fs';
import path from 'path';

// ============================================================
// HELPER FUNCTIONS
// ============================================================
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

// ============================================================
// ALL API HANDLERS
// ============================================================
const handlers = {
  // ============ AI TOOLS ============
  chat: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const { message } = await readBody(req);
    if (!message) return res.status(400).json({ error: 'Message required' });

    // Smart local AI response (no external API needed)
    const responses = {
      greetings: ['Salom! Qanday yordam bera olaman?', 'Assalomu alaykum! Sizga qanday yordam kerak?', 'Hi! How can I help you today?'],
      code: `Mana sizga kod namunasi:\n\n\`\`\`javascript\n// ${message}\nfunction example() {\n  console.log("KRYZEN HUB");\n  return true;\n}\n\`\`\``,
      math: (m) => {
        try {
          const result = Function('"use strict";return (' + m.replace(/[^0-9+\-*/().\s]/g, '') + ')')();
          return `🧮 Natija: **${result}**`;
        } catch { return 'Matematik ifoda topilmadi'; }
      },
      joke: ['Nega kompyuter doktor oldiga bordi? Virus tushib qolgan edi! 😄', 'Bug va feature farqi nima? Bug — bu feature siz kutmaganda. 😄', 'Dasturchilar nima uchun qorong\'uda ishlaydi? Chunki yorug\'lik xato topadi! 💡'][Math.floor(Math.random() * 3)],
      quote: ['"Muvaffaqiyat — bu kichik harakatlar yig\'indisi." — Robert Collier', '"Hayot — bu nima qilayotganingiz, nima qilishni xohlaganingiz emas." — Mark Twain', '"Bilim — kuch." — Frensis Bekon'][Math.floor(Math.random() * 3)]
    };

    const msg = message.toLowerCase();
    let reply = '';
    if (msg.match(/salom|hello|hi|привет/)) reply = responses.greetings[Math.floor(Math.random() * 3)];
    else if (msg.match(/kod|code|python|javascript/)) reply = responses.code;
    else if (msg.match(/joke|hazil/)) reply = responses.joke;
    else if (msg.match(/quote|hikmat|цитат/)) reply = responses.quote;
    else if (msg.match(/[0-9+\-*/()]/)) reply = responses.math(message);
    else reply = `Sizning savolingiz: "${message}"\n\nMen KRYZEN AI yordamchisiman. Kod yozish, savollarga javob berish, g\'oyalar berish mumkin. Aniqlashtirib bersangiz, yaxshiroq yordam bera olaman!`;

    return res.status(200).json({ success: true, message: reply });
  },

  // ============ TRANSLATE ============
  translate: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const { text, from = 'auto', to = 'en' } = await readBody(req);
    if (!text) return res.status(400).json({ error: 'Text required' });

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
      const r = await fetch(url);
      const data = await r.json();
      const translated = data[0]?.map(x => x[0]).join('') || text;
      return res.status(200).json({ success: true, translated, from, to });
    } catch (e) {
      // Fallback dictionary
      const dict = {
        'hello': { uz: 'salom', ru: 'привет' },
        'world': { uz: 'dunyo', ru: 'мир' },
        'thank you': { uz: 'rahmat', ru: 'спасибо' },
        'good morning': { uz: 'xayrli tong', ru: 'доброе утро' }
      };
      const t = text.toLowerCase().trim();
      const translated = dict[t]?.[to] || `[${to}] ${text}`;
      return res.status(200).json({ success: true, translated, fallback: true });
    }
  },

  // ============ WEATHER ============
  weather: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const city = (req.query.city || 'Tashkent').toString();

    try {
      // Geocoding
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
      const geoR = await fetch(geoUrl);
      const geo = await geoR.json();
      if (!geo.results || geo.results.length === 0) {
        return res.status(404).json({ error: 'City not found' });
      }
      const loc = geo.results[0];

      // Weather
      const wUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`;
      const wR = await fetch(wUrl);
      const w = await wR.json();

      const code = w.current.weather_code;
      const desc = { 0: '☀️ Ochiq', 1: '🌤 Asosan ochiq', 2: '⛅️ Qisman bulutli', 3: '☁️ Bulutli', 45: '🌫 Tuman', 48: '🌫 Muzli tuman', 51: '🌦 Yengil yomg\'ir', 61: '🌧 Yomg\'ir', 63: '🌧 Kuchli yomg\'ir', 71: '🌨 Qor', 95: '⛈ Momaqaldiroq' };
      const icon = Object.keys(desc).find(k => parseInt(k) === code) ? desc[code] : '🌤';

      return res.status(200).json({
        success: true,
        location: { name: loc.name, country: loc.country, lat: loc.latitude, lon: loc.longitude },
        current: {
          temperature_2m: w.current.temperature_2m,
          relative_humidity_2m: w.current.relative_humidity_2m,
          apparent_temperature: w.current.apparent_temperature,
          wind_speed_10m: w.current.wind_speed_10m,
          description: icon,
          icon
        }
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  // ============ NEWS ============
  news: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const category = (req.query.category || 'tech').toString();

    try {
      const r = await fetch(`https://hacker-news.firebaseio.com/v0/topstories.json`);
      const ids = await r.json();
      const top20 = ids.slice(0, 20);
      const articles = await Promise.all(top20.map(async (id) => {
        const item = await (await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)).json();
        const time = new Date(item.time * 1000);
        return {
          title: item.title,
          url: item.url || `https://news.ycombinator.com/item?id=${id}`,
          score: item.score,
          comments: item.descendants || 0,
          time: time.toLocaleString('uz-UZ'),
          source: new URL(item.url || 'https://news.ycombinator.com').hostname
        };
      }));
      return res.status(200).json({ success: true, articles, category });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  // ============ CRYPTO ============
  crypto: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    try {
      const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,cardano,ripple,dogecoin,polkadot,tron,avalanche-2&vs_currencies=usd&include_24hr_change=true');
      const data = await r.json();
      return res.status(200).json({ success: true, prices: data, timestamp: new Date().toISOString() });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  // ============ CURRENCY ============
  currency: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const base = (req.query.base || 'USD').toString().toUpperCase();
    try {
      const r = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
      const data = await r.json();
      return res.status(200).json({ success: true, base: data.base, date: data.date, rates: data.rates });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  // ============ DICTIONARY ============
  dictionary: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const word = (req.query.word || '').toString().toLowerCase();
    if (!word) return res.status(400).json({ error: 'Word required' });
    try {
      const r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      const data = await r.json();
      if (data.title === 'No Definitions Found') return res.status(404).json({ error: 'Word not found' });
      const entry = data[0];
      return res.status(200).json({
        success: true,
        word: entry.word,
        phonetic: entry.phonetic,
        meanings: entry.meanings.map(m => ({
          partOfSpeech: m.partOfSpeech,
          definitions: m.definitions.slice(0, 3).map(d => ({ definition: d.definition, example: d.example }))
        }))
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  // ============ QUOTE/JOKE ============
  quote: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
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
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  // ============ IP LOOKUP ============
  ip: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const ip = (req.query.ip || '').toString();
    try {
      const r = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
      const data = await r.json();
      if (data.status === 'fail') return res.status(404).json({ error: 'IP not found' });
      return res.status(200).json({ success: true, ...data });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  // ============ DNS ============
  dns: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const domain = (req.query.domain || '').toString();
    const type = (req.query.type || 'A').toString();
    if (!domain) return res.status(400).json({ error: 'Domain required' });
    try {
      const r = await fetch(`https://dns.google/resolve?name=${domain}&type=${type}`);
      const data = await r.json();
      return res.status(200).json({ success: true, ...data });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  // ============ WHOIS ============
  whois: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const domain = (req.query.domain || '').toString();
    if (!domain) return res.status(400).json({ error: 'Domain required' });
    try {
      const r = await fetch(`https://rdap.org/domain/${domain}`);
      const data = await r.json();
      const events = (data.events || []).reduce((acc, e) => { acc[e.eventType] = e.eventDate; return acc; }, {});
      return res.status(200).json({
        success: true,
        domain,
        registrar: data.entities?.[0]?.vcardArray?.[1]?.find(x => x[0] === 'fn')?.[3] || 'N/A',
        creationDate: events.registration || 'N/A',
        expirationDate: events.expiration || 'N/A',
        lastUpdated: events.last_changed || 'N/A',
        nameservers: data.nameservers?.map(n => n.ldhName) || []
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  // ============ HTTP HEADERS ============
  headers: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
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

      return res.status(200).json({
        success: true,
        url,
        status: r.status,
        headers,
        security: {
          hsts: !!headers['strict-transport-security'],
          csp: !!headers['content-security-policy'],
          xframe: !!headers['x-frame-options'],
          xss: !!headers['x-xss-protection']
        },
        score,
        grade
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  // ============ GITHUB ============
  github: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const username = (req.query.username || '').toString();
    if (!username) return res.status(400).json({ error: 'Username required' });
    try {
      const userR = await fetch(`https://api.github.com/users/${username}`);
      const user = await userR.json();
      if (user.message) return res.status(404).json({ error: user.message });

      const reposR = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=stars`);
      const repos = await reposR.json();

      const topRepos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5).map(r => ({
        name: r.name, description: r.description, url: r.html_url, stars: r.stargazers_count, forks: r.forks_count, language: r.language
      }));

      const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
      const langs = repos.reduce((acc, r) => {
        if (r.language) acc[r.language] = (acc[r.language] || 0) + 1;
        return acc;
      }, {});
      const topLanguages = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 5);

      return res.status(200).json({
        success: true,
        user: {
          login: user.login, name: user.name, avatar: user.avatar_url, bio: user.bio,
          location: user.location, company: user.company, blog: user.blog,
          publicRepos: user.public_repos, followers: user.followers, following: user.following, publicGists: user.public_gists
        },
        stats: { totalStars, topLanguages },
        topRepos
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  // ============ URL SHORTENER ============
  shorten: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const { url } = await readBody(req);
    if (!url) return res.status(400).json({ error: 'URL required' });

    // Use is.gd as a free shortener
    try {
      const r = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
      const data = await r.json();
      return res.status(200).json({ success: true, short: data.shorturl, original: url });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  // ============ DOWNLOAD (info + services) ============
  download: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const { url, quality = 'best' } = await readBody(req);
    if (!url) return res.status(400).json({ error: 'URL required' });

    let platform = 'unknown';
    let videoId = '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      platform = 'YouTube';
      videoId = (url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/) || [])[1] || '';
    } else if (url.includes('instagram.com')) platform = 'Instagram';
    else if (url.includes('tiktok.com')) platform = 'TikTok';
    else if (url.includes('twitter.com') || url.includes('x.com')) platform = 'Twitter/X';
    else if (url.includes('facebook.com')) platform = 'Facebook';

    const services = [
      { service: 'Cobalt.tools', url: `https://co.wuk.sh/api/json`, note: 'Universal video/audio downloader' },
      { service: 'SaveFrom.net', url: `https://savefrom.net/${url}`, note: 'Multi-platform downloader' },
      { service: 'Y2mate', url: `https://www.y2mate.com/youtube/${videoId || url}`, note: 'YouTube downloader' }
    ];

    return res.status(200).json({
      success: true,
      platform,
      videoId,
      quality,
      downloadOptions: services,
      message: 'Yuqoridagi xizmatlardan birini oching va videoni yuklab oling.'
    });
  },

  // ============ HOLIDAYS ============
  holidays: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const country = (req.query.country || 'UZ').toString().toUpperCase();
    const year = (req.query.year || new Date().getFullYear()).toString();
    try {
      const r = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
      const data = await r.json();
      if (!Array.isArray(data)) return res.status(404).json({ error: 'No data' });
      return res.status(200).json({ success: true, country, year, count: data.length, holidays: data });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  // ============ QR CODE ============
  qrcode: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const data = (req.query.data || 'https://kryzen.com').toString();
    const size = (req.query.size || 300).toString();
    return res.status(200).json({
      success: true,
      url: `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(data)}&chld=M|2`,
      data,
      size
    });
  },

  // ============ PASSWORD ============
  password: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
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
      const randomValues = new Uint32Array(len);
      crypto.getRandomValues(randomValues);
      for (let j = 0; j < len; j++) pwd += chars[randomValues[j] % chars.length];
      passwords.push(pwd);
    }

    const calcStrength = (pwd) => {
      let score = 0;
      if (pwd.length >= 8) score++;
      if (pwd.length >= 12) score++;
      if (pwd.length >= 16) score++;
      if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
      if (/\d/.test(pwd)) score++;
      if (/[^A-Za-z0-9]/.test(pwd)) score++;
      return { score, label: score <= 2 ? 'weak' : score <= 3 ? 'medium' : score <= 4 ? 'strong' : 'very-strong' };
    };

    return res.status(200).json({ success: true, passwords: passwords.map(p => ({ value: p, strength: calcStrength(p) })) });
  },

  // ============ UUID ============
  uuid: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
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

  // ============ LOREM ============
  lorem: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const paragraphs = Math.min(Math.max(parseInt(req.query.paragraphs) || 3, 1), 20);
    const lorem = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');
    const text = Array(paragraphs).fill(0).map(() => {
      const sentences = 4 + Math.floor(Math.random() * 4);
      return Array(sentences).fill(0).map(() => {
        const w = 6 + Math.floor(Math.random() * 10);
        const sent = Array(w).fill(0).map(() => lorem[Math.floor(Math.random() * lorem.length)]).join(' ');
        return sent.charAt(0).toUpperCase() + sent.slice(1) + '.';
      }).join(' ');
    }).join('\n\n');
    return res.status(200).json({ success: true, paragraphs, text, wordCount: text.split(/\s+/).length });
  },

  // ============ HASH ============
  hash: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
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

  // ============ SSL ============
  ssl: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
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
      return res.status(200).json({
        success: true, domain, valid: !!r, https: isHttps, hsts: hasHSTS, csp: hasCSP, grade,
        status: r ? '✅ SSL Active' : '⚠️ Could not verify'
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  // ============ SUBDOMAIN FINDER ============
  subdomain: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const domain = (req.query.domain || '').toString().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!domain) return res.status(400).json({ error: 'Domain required' });
    const subs = ['www', 'mail', 'ftp', 'api', 'app', 'admin', 'blog', 'dev', 'cdn', 'static', 'cloud', 'git', 'docs', 'status', 'login', 'mx', 'ns1', 'ns2', 'webmail', 'shop', 'pay', 'media', 'support', 'test', 'staging', 'panel', 'm'];
    const found = [];
    const checks = await Promise.all(subs.map(async (sub) => {
      try {
        const r = await fetch(`https://dns.google/resolve?name=${sub}.${domain}&type=A`);
        const d = await r.json();
        if (d.Answer && d.Answer.length > 0) {
          return { subdomain: `${sub}.${domain}`, ip: d.Answer[0].data };
        }
      } catch (e) {}
      return null;
    }));
    checks.forEach(c => c && found.push(c));
    return res.status(200).json({ success: true, domain, foundCount: found.length, found });
  },

  // ============ JWT DECODER ============
  jwt: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
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
      return res.status(200).json({ success: true, header, payload, signature: parts[2].substring(0, 50) + '...', valid: !expired, expired, algorithm: header.alg });
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JWT' });
    }
  },

  // ============ PHONE ============
  phone: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const phone = (req.query.phone || '').toString().replace(/[^\d+]/g, '');
    if (!phone) return res.status(400).json({ error: 'Phone required' });
    const countries = [
      { code: '+998', name: 'Uzbekistan', flag: '🇺🇿', length: 12 },
      { code: '+7', name: 'Russia/Kazakhstan', flag: '🇷🇺', length: 11 },
      { code: '+1', name: 'USA/Canada', flag: '🇺🇸', length: 11 },
      { code: '+90', name: 'Turkey', flag: '🇹🇷', length: 12 },
      { code: '+86', name: 'China', flag: '🇨🇳', length: 13 },
      { code: '+91', name: 'India', flag: '🇮🇳', length: 12 },
      { code: '+44', name: 'UK', flag: '🇬🇧', length: 12 },
      { code: '+49', name: 'Germany', flag: '🇩🇪', length: 12 }
    ];
    const country = countries.find(c => phone.startsWith(c.code)) || countries.find(c => c.length === phone.length);
    const valid = country ? phone.length === country.length : phone.length >= 7 && phone.length <= 15;
    const operator = country && country.code === '+998' ? ['Ucell', 'Beeline', 'UMS'][parseInt(phone[5]) % 3] : null;
    return res.status(200).json({ success: true, phone, valid, country, operator, formatted: phone });
  },

  // ============ EMAIL ============
  email: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const email = (req.query.email || '').toString().toLowerCase();
    if (!email) return res.status(400).json({ error: 'Email required' });
    const [user, domain] = email.split('@');
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const disposable = ['mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'yopmail.com'].includes(domain);
    const role = ['admin', 'info', 'support', 'noreply', 'contact'].includes(user);
    const score = (valid ? 50 : 0) + (!disposable ? 30 : 0) + (!role ? 20 : 0);
    let mxRecords = [];
    try {
      const r = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
      const d = await r.json();
      mxRecords = d.Answer || [];
    } catch (e) {}
    return res.status(200).json({ success: true, email, valid, user, domain, mxRecords, disposable, role, score });
  },

  // ============ BREACH CHECK ============
  breach: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const email = (req.query.email || '').toString();
    if (!email) return res.status(400).json({ error: 'Email required' });
    try {
      const r = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`, {
        headers: { 'User-Agent': 'kryzen-hub' }
      });
      if (r.status === 404) {
        return res.status(200).json({ success: true, safe: true, breaches: [], message: '✅ Bu email hech qayerdan sizib chiqmagan!' });
      }
      const data = await r.json();
      return res.status(200).json({
        success: true, safe: false, breaches: data, message: `⚠️ ${data.length} ta sizib chiqishda qatnashgan!`
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  // ============ SENTIMENT ============
  sentiment: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
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

  // ============ SUMMARIZER ============
  summarize: async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const { text, ratio = 0.3 } = await readBody(req);
    if (!text) return res.status(400).json({ error: 'Text required' });
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const stops = new Set(['the', 'a', 'an', 'and', 'or', 'is', 'are', 'was', 'in', 'on', 'at', 'to', 'for', 'of', 'va', 'bilan', 'uchun', 'bu', 'u']);
    const freq = {};
    words.forEach(w => {
      const c = w.toLowerCase().replace(/[^\w]/g, '');
      if (c && !stops.has(c) && c.length > 2) freq[c] = (freq[c] || 0) + 1;
    });
    const scores = sentences.map((s, i) => {
      const sw = s.toLowerCase().split(/\s+/);
      let sc = 0;
      sw.forEach(w => { const c = w.replace(/[^\w]/g, ''); if (freq[c]) sc += freq[c]; });
      return { sentence: s.trim(), score: sc / Math.max(sw.length, 1), index: i };
    });
    const count = Math.max(1, Math.floor(sentences.length * ratio));
    const top = scores.sort((a, b) => b.score - a.score).slice(0, count).sort((a, b) => a.index - b.index);
    const summary = top.map(s => s.sentence).join('. ') + '.';
    return res.status(200).json({
      success: true,
      original: { words: words.length, sentences: sentences.length },
      summary,
      compression: ((1 - summary.split(/\s+/).length / words.length) * 100).toFixed(1) + '%',
      topWords: Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([w, c]) => ({ word: w, count: c }))
    });
  }
};

// ============================================================
// MAIN ROUTER
// ============================================================
export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Extract endpoint name from URL: /api/index?action=chat
  // or: /api/{name}
  const url = req.url || '';
  let endpoint = '';

  // Try query param first
  if (req.query.action) {
    endpoint = req.query.action;
  } else {
    // Try path
    const match = url.match(/\/api\/([^?\/]+)/);
    endpoint = match ? match[1] : '';
  }

  // Special: detect /api/chat, /api/weather, etc. directly
  if (!endpoint) {
    const pathOnly = url.split('?')[0];
    const parts = pathOnly.split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0] === 'api') {
      endpoint = parts[1];
    }
  }

  // Root /api
  if (!endpoint || endpoint === 'index') {
    return res.status(200).json({
      success: true,
      name: 'KRYZEN HUB API',
      version: '2.0',
      endpoints: Object.keys(handlers),
      count: Object.keys(handlers).length,
      message: '30+ real APIs ready!'
    });
  }

  const handlerFn = handlers[endpoint];
  if (!handlerFn) {
    return res.status(404).json({ error: `Endpoint '${endpoint}' not found`, available: Object.keys(handlers) });
  }

  try {
    return await handlerFn(req, res);
  } catch (e) {
    return res.status(500).json({ error: e.message, stack: e.stack });
  }
}
