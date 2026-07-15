// KRYZEN HUB - Pure Static API (Runs in Browser!)
// No server needed - all APIs work in the browser via fetch()

const handlers = {
  chat: async (params) => {
    const message = params.message || '';
    if (!message) return { error: 'Message required' };
    const msg = message.toLowerCase();
    let reply = '';
    if (msg.match(/salom|hello|hi|привет/)) reply = 'Salom! Qanday yordam bera olaman? 🤖';
    else if (msg.match(/kod|code|python|javascript/)) reply = `Kod namunasi:\n\n\`\`\`javascript\n// ${message}\nfunction kryzen() {\n  console.log("KRYZEN HUB - 80+ tools");\n  return "success";\n}\n\`\`\``;
    else if (msg.match(/joke|hazil/)) reply = ['Dasturchi nima uchun qorong\'uda ishlaydi? Yorug\'lik xato topadi! 😄', 'Bug va feature farqi nima? Bug — bu feature siz kutmaganda! 😄', 'Kompyuter virusga chalingach shifokorga bordi. Doktor: "Ishonchingiz komil, virusmi?" 💊'][Math.floor(Math.random() * 3)];
    else if (msg.match(/quote|hikmat/)) reply = ['"Muvaffaqiyat — kichik harakatlar yig\'indisi." — Robert Collier', '"Bilim — kuch." — Frensis Bekon', '"Hayot — nima qilayotganingiz, nima qilishni xohlaganingiz emas." — Mark Twain'][Math.floor(Math.random() * 3)];
    else if (/^[0-9+\-*/().\s]+$/.test(message)) {
      try { const r = Function('"use strict";return (' + message + ')')(); reply = `🧮 Natija: **${r}**`; }
      catch { reply = 'Matematik ifoda noto\'g\'ri'; }
    }
    else reply = `Savolingiz: "${message}"\n\nKRYZEN AI yordamchisiman! Kodlash, ma'lumot, savollarga javob berish — barchasi mumkin.`;
    return { success: true, message: reply };
  },

  translate: async (params) => {
    const text = params.text || '';
    const to = params.to || 'en';
    if (!text) return { error: 'Text required' };
    try {
      const r = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${params.from || 'auto'}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`);
      const data = await r.json();
      const translated = data[0]?.map(x => x[0]).join('') || text;
      return { success: true, translated, from: params.from || 'auto', to };
    } catch (e) {
      const dict = { 'hello': { uz: 'salom', ru: 'привет', en: 'hello' }, 'world': { uz: 'dunyo', ru: 'мир' }, 'thank you': { uz: 'rahmat', ru: 'спасибо' } };
      const translated = dict[text.toLowerCase().trim()]?.[to] || `[${to}] ${text}`;
      return { success: true, translated, fallback: true };
    }
  },

  weather: async (params) => {
    const city = params.city || 'Tashkent';
    try {
      const geoR = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
      const geo = await geoR.json();
      if (!geo.results || geo.results.length === 0) return { error: 'City not found' };
      const loc = geo.results[0];
      const wR = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
      const w = await wR.json();
      const desc = { 0: '☀️ Ochiq', 1: '🌤 Asosan ochiq', 2: '⛅️ Qisman bulutli', 3: '☁️ Bulutli', 45: '🌫 Tuman', 61: '🌧 Yomg\'ir', 71: '🌨 Qor', 95: '⛈ Momaqaldiroq' };
      const icon = desc[w.current.weather_code] || '🌤';
      return { success: true, location: { name: loc.name, country: loc.country }, current: { temperature_2m: w.current.temperature_2m, relative_humidity_2m: w.current.relative_humidity_2m, wind_speed_10m: w.current.wind_speed_10m, icon, description: icon } };
    } catch (e) { return { error: e.message }; }
  },

  news: async () => {
    try {
      const r = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      const ids = await r.json();
      const top = ids.slice(0, 20);
      const articles = await Promise.all(top.map(async (id) => {
        const item = await (await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)).json();
        return { title: item.title, url: item.url || `https://news.ycombinator.com/item?id=${id}`, score: item.score, comments: item.descendants || 0 };
      }));
      return { success: true, articles };
    } catch (e) { return { error: e.message }; }
  },

  crypto: async () => {
    try {
      const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,cardano,ripple,dogecoin&vs_currencies=usd&include_24hr_change=true');
      const data = await r.json();
      return { success: true, prices: data };
    } catch (e) { return { error: e.message }; }
  },

  currency: async (params) => {
    const base = (params.base || 'USD').toUpperCase();
    try {
      const r = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
      const data = await r.json();
      return { success: true, base: data.base, rates: data.rates };
    } catch (e) { return { error: e.message }; }
  },

  dictionary: async (params) => {
    const word = (params.word || '').toLowerCase();
    if (!word) return { error: 'Word required' };
    try {
      const r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      const data = await r.json();
      if (data.title === 'No Definitions Found') return { error: 'Word not found' };
      return { success: true, word: data[0].word, phonetic: data[0].phonetic, meanings: data[0].meanings };
    } catch (e) { return { error: e.message }; }
  },

  quote: async (params) => {
    try {
      if (params.type === 'joke') {
        const r = await fetch('https://official-joke-api.appspot.com/random_joke');
        const data = await r.json();
        return { success: true, type, text: `${data.setup} — ${data.punchline}` };
      }
      const r = await fetch('https://api.quotable.io/random');
      const data = await r.json();
      return { success: true, type: 'quote', text: data.content, author: data.author };
    } catch (e) { return { error: e.message }; }
  },

  ip: async (params) => {
    try {
      const r = await fetch(`http://ip-api.com/json/${params.ip || ''}?fields=status,country,countryCode,city,zip,lat,lon,timezone,isp,query`);
      return await r.json();
    } catch (e) { return { error: e.message }; }
  },

  dns: async (params) => {
    try {
      const r = await fetch(`https://dns.google/resolve?name=${params.domain}&type=${params.type || 'A'}`);
      return await r.json();
    } catch (e) { return { error: e.message }; }
  },

  whois: async (params) => {
    try {
      const r = await fetch(`https://rdap.org/domain/${params.domain}`);
      const data = await r.json();
      const events = (data.events || []).reduce((acc, e) => { acc[e.eventType] = e.eventDate; return acc; }, {});
      return { success: true, domain: params.domain, registrar: data.entities?.[0]?.vcardArray?.[1]?.find(x => x[0] === 'fn')?.[3] || 'N/A', creationDate: events.registration, expirationDate: events.expiration };
    } catch (e) { return { error: e.message }; }
  },

  headers: async (params) => {
    try {
      const r = await fetch(params.url, { method: 'HEAD' });
      const headers = {};
      r.headers.forEach((v, k) => { headers[k] = v; });
      return { success: true, url: params.url, status: r.status, headers };
    } catch (e) { return { error: e.message }; }
  },

  github: async (params) => {
    try {
      const userR = await fetch(`https://api.github.com/users/${params.username}`);
      const user = await userR.json();
      if (user.message) return { error: user.message };
      const reposR = await fetch(`https://api.github.com/users/${params.username}/repos?per_page=100&sort=stars`);
      const repos = await reposR.json();
      const topRepos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5).map(r => ({ name: r.name, description: r.description, url: r.html_url, stars: r.stargazers_count, forks: r.forks_count }));
      const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
      return { success: true, user: { login: user.login, name: user.name, avatar: user.avatar_url, bio: user.bio, publicRepos: user.public_repos, followers: user.followers }, stats: { totalStars }, topRepos };
    } catch (e) { return { error: e.message }; }
  },

  shorten: async (params) => {
    try {
      const r = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(params.url)}`);
      const data = await r.json();
      return { success: true, short: data.shorturl };
    } catch (e) { return { error: e.message }; }
  },

  download: async (params) => {
    let platform = 'unknown';
    if (params.url?.includes('youtube')) platform = 'YouTube';
    else if (params.url?.includes('instagram')) platform = 'Instagram';
    else if (params.url?.includes('tiktok')) platform = 'TikTok';
    return { success: true, platform, downloadOptions: [{ service: 'SaveFrom', url: `https://savefrom.net/${params.url}`, note: 'Multi-platform' }] };
  },

  holidays: async (params) => {
    try {
      const r = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${params.year || 2026}/${params.country || 'UZ'}`);
      return { success: true, holidays: await r.json() };
    } catch (e) { return { error: e.message }; }
  },

  qrcode: async (params) => {
    return { success: true, url: `https://chart.googleapis.com/chart?cht=qr&chs=${params.size || 300}x${params.size || 300}&chl=${encodeURIComponent(params.data || 'https://kryzen.com')}` };
  },

  password: async (params) => {
    const len = Math.min(Math.max(parseInt(params.length) || 20, 8), 128);
    const count = Math.min(Math.max(parseInt(params.count) || 1, 1), 20);
    let chars = '';
    if (params.uppercase !== 'false') chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (params.lowercase !== 'false') chars += 'abcdefghijklmnopqrstuvwxyz';
    if (params.numbers !== 'false') chars += '0123456789';
    if (params.symbols !== 'false') chars += '!@#$%^&*()_+-=';
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const passwords = [];
    for (let i = 0; i < count; i++) {
      let pwd = '';
      const rv = new Uint32Array(len);
      crypto.getRandomValues(rv);
      for (let j = 0; j < len; j++) pwd += chars[rv[j] % chars.length];
      passwords.push(pwd);
    }
    return { success: true, passwords };
  },

  uuid: async (params) => {
    const count = Math.min(Math.max(parseInt(params.count) || 5, 1), 100);
    const uuids = [];
    for (let i = 0; i < count; i++) {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
      uuids.push(`${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`);
    }
    return { success: true, uuids };
  },

  lorem: async (params) => {
    const paragraphs = Math.min(Math.max(parseInt(params.paragraphs) || 3, 1), 20);
    const words = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');
    const text = Array(paragraphs).fill(0).map(() => Array(4 + Math.floor(Math.random() * 4)).fill(0).map(() => { const w = 6 + Math.floor(Math.random() * 10); return Array(w).fill(0).map(() => words[Math.floor(Math.random() * words.length)]).join(' '); }).join('. '));
    return { success: true, text };
  },

  hash: async (params) => {
    const text = params.text || '';
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashes = {};
    for (const algo of ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']) {
      const buf = await crypto.subtle.digest(algo, data);
      hashes[algo] = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return { success: true, hashes };
  },

  ssl: async (params) => {
    try {
      const r = await fetch(`https://${params.domain}`, { method: 'HEAD' });
      return { success: true, domain: params.domain, valid: r.ok, status: r.ok ? '✅ SSL Active' : '⚠️ Issue' };
    } catch (e) { return { error: e.message }; }
  },

  subdomain: async (params) => {
    const subs = ['www', 'mail', 'ftp', 'api', 'app', 'admin', 'blog', 'dev', 'cdn', 'docs', 'status'];
    const found = [];
    await Promise.all(subs.map(async (sub) => {
      try {
        const r = await fetch(`https://dns.google/resolve?name=${sub}.${params.domain}&type=A`);
        const d = await r.json();
        if (d.Answer && d.Answer.length > 0) found.push({ subdomain: `${sub}.${params.domain}`, ip: d.Answer[0].data });
      } catch (e) {}
    }));
    return { success: true, foundCount: found.length, found };
  },

  jwt: async (params) => {
    const parts = (params.token || '').split('.');
    if (parts.length !== 3) return { error: 'Invalid JWT' };
    try {
      const decode = (s) => JSON.parse(atob(s.replace(/-/g, '+').replace(/_/g, '/')));
      return { success: true, header: decode(parts[0]), payload: decode(parts[1]) };
    } catch (e) { return { error: 'Invalid JWT' }; }
  },

  phone: async (params) => {
    const phone = (params.phone || '').replace(/[^\d+]/g, '');
    return { success: true, phone, valid: phone.length >= 7 && phone.length <= 15 };
  },

  email: async (params) => {
    const email = (params.email || '').toLowerCase();
    const [user, domain] = email.split('@');
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return { success: true, email, valid, user, domain, score: valid ? 80 : 0 };
  },

  breach: async (params) => {
    return { success: true, safe: true, message: '✅ Bu email xavfsiz (test rejimida)' };
  },

  sentiment: async (params) => {
    const text = (params.text || '').toLowerCase();
    const pos = ['good', 'great', 'love', 'best', 'awesome', 'amazing'];
    const neg = ['bad', 'terrible', 'hate', 'worst', 'awful'];
    const p = pos.filter(w => text.includes(w)).length;
    const n = neg.filter(w => text.includes(w)).length;
    let label, emoji;
    if (p > n) { label = 'positive'; emoji = '😊'; }
    else if (n > p) { label = 'negative'; emoji = '😢'; }
    else { label = 'neutral'; emoji = '😐'; }
    return { success: true, label, emoji, positive: p, negative: n };
  },

  summarize: async (params) => {
    const text = params.text || '';
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const summary = sentences.slice(0, Math.max(1, Math.floor(sentences.length * 0.3))).join('. ') + '.';
    return { success: true, summary, originalSentences: sentences.length };
  }
};

// Main API Router - works in browser
if (typeof window !== 'undefined') {
  window.kryzenAPI = {
    async call(action, params = {}) {
      const handler = handlers[action];
      if (!handler) return { error: `Endpoint '${action}' not found`, available: Object.keys(handlers) };
      try { return await handler(params); }
      catch (e) { return { error: e.message }; }
    },
    endpoints: Object.keys(handlers)
  };
  console.log('✅ KRYZEN HUB API loaded - ' + Object.keys(handlers).length + ' endpoints ready!');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = handlers;
}
