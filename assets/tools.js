/* ============================================================
   KRYZEN HUB - Tools Implementation (Unified API)
   ============================================================ */

const API_BASE = 'https://kryzen-hub.vercel.app/api';

async function callAPI(endpoint, options = {}) {
  try {
    const url = options.method === 'POST' ? `${API_BASE}?action=${endpoint}` : `${API_BASE}?action=${endpoint}`;
    const res = await fetch(url, options);
    if (res.ok) return await res.json();
    throw new Error('API error');
  } catch (e) {
    // Use static fallback (GitHub Pages demo)
    return { error: e.message, fallback: true };
  }
}

function createModal(title, content) {
  const existing = document.getElementById('toolModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'toolModal';
  modal.className = 'tool-modal active';
  modal.innerHTML = `
    <div class="tool-modal-content">
      <div class="tool-modal-header">
        <h2>${title}</h2>
        <button class="tool-modal-close" onclick="closeTool()">✕</button>
      </div>
      <div class="tool-modal-body">${content}</div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeTool(); });
}

function closeTool() {
  const m = document.getElementById('toolModal');
  if (m) m.remove();
}
window.closeTool = closeTool;

function showLoading(text = 'Yuklanmoqda...') {
  return `<div class="loading-state"><div class="spinner"></div><p>${text}</p></div>`;
}

function showError(msg) {
  return `<div class="alert alert-error">❌ ${msg}</div>`;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    if (window.toast) window.toast('Nusxalandi!');
  });
}

async function apiGet(endpoint, params = {}) {
  const qs = new URLSearchParams({ action: endpoint, ...params }).toString();
  const r = await fetch(`${API_BASE}?${qs}`);
  return await r.json();
}

async function apiPost(endpoint, body = {}) {
  const r = await fetch(`${API_BASE}?action=${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return await r.json();
}

// ============================================================
// OPEN TOOL DISPATCHER
// ============================================================
window.openTool = async function(toolName) {
  const t = toolName.toLowerCase();
  const tools = {
    'ai chat': { title: '💬 AI Chat', html: `<div class="ai-chat-container"><div id="aiChatMessages" class="ai-chat-messages"><div class="ai-message bot">Salom! Men KRYZEN AI yordamchisiman. Sizga qanday yordam bera olaman?</div></div><div class="ai-chat-input"><input type="text" id="aiChatInput" placeholder="Xabar yozing..."><button onclick="window.sendAIMessage()" class="btn btn-primary">Yuborish</button></div></div>` },
    'kod yozuvchi ai': { title: '👨‍💻 Kod Yozuvchi AI', html: `<div class="tool-form"><label>Til:</label><select id="codeLang" class="form-select"><option>JavaScript</option><option>Python</option><option>HTML</option><option>CSS</option><option>Java</option></select><textarea id="codePrompt" class="form-textarea" rows="3" placeholder="Vazifani yozing..."></textarea><button class="btn btn-primary" onclick="window.generateCode()">🚀 Kod Yaratish</button><div id="codeResult" class="tool-result"></div></div>` },
    'tarjimon': { title: '🌐 Tarjimon', html: `<div class="tool-form"><textarea id="trText" class="form-textarea" rows="4">Hello, how are you?</textarea><div class="form-row"><select id="trFrom" class="form-select"><option value="auto">Auto</option><option value="en">English</option><option value="uz">Uzbek</option><option value="ru">Russian</option></select><span>→</span><select id="trTo" class="form-select"><option value="uz">Uzbek</option><option value="en" selected>English</option><option value="ru">Russian</option></select></div><button class="btn btn-primary" onclick="window.translateText()">🌐 Tarjima</button><div id="trResult" class="tool-result"></div></div>` },
    'ob-havo': { title: '🌤 Ob-havo', html: `<div class="tool-form"><label>Shahar:</label><input type="text" id="weatherCity" class="form-input" value="Tashkent"><button class="btn btn-primary" onclick="window.getWeather()">🌤 Ko'rish</button><div id="weatherResult" class="tool-result"></div></div>` },
    'yangiliklar': { title: '📰 Yangiliklar', html: `<div class="tool-form"><select id="newsCategory" class="form-select"><option value="top">Top</option><option value="tech">Texnologiya</option><option value="world">Dunyo</option></select><button class="btn btn-primary" onclick="window.getNews()">📰 Yuklash</button><div id="newsResult" class="tool-result"></div></div>` },
    'kriptovalyuta': { title: '💰 Kriptovalyuta', html: `<div class="tool-form"><button class="btn btn-primary" onclick="window.getCrypto()">💰 Narxlar</button><div id="cryptoResult" class="tool-result"></div></div>` },
    'valyuta': { title: '💱 Valyuta', html: `<div class="tool-form"><input type="text" id="curBase" class="form-input" value="USD"><button class="btn btn-primary" onclick="window.getCurrency()">💱 Kurslar</button><div id="curResult" class="tool-result"></div></div>` },
    'lug\'at': { title: '📖 Lug\'at', html: `<div class="tool-form"><input type="text" id="dictWord" class="form-input" placeholder="hello"><button class="btn btn-primary" onclick="window.getDict()">🔍 Qidirish</button><div id="dictResult" class="tool-result"></div></div>` },
    'hikmat': { title: '💭 Hikmat', html: `<div class="tool-form"><button class="btn btn-primary" onclick="window.getQuote()">🎲 Hikmat</button><div id="quoteResult" class="tool-result"></div></div>` },
    'hazil': { title: '😄 Hazil', html: `<div class="tool-form"><button class="btn btn-primary" onclick="window.getJoke()">😄 Hazil</button><div id="jokeResult" class="tool-result"></div></div>` },
    'json formatter': { title: '{} JSON Formatter', html: `<div class="tool-form"><textarea id="jsonInput" class="form-textarea" rows="6">{"name":"KRYZEN","tools":80,"active":true}</textarea><div class="btn-group"><button class="btn btn-primary" onclick="window.formatJSON()">✨ Format</button><button class="btn" onclick="window.minifyJSON()">📦 Minify</button></div><div id="jsonResult" class="tool-result"></div></div>` },
    'json validator': { title: '✓ JSON Validator', html: `<div class="tool-form"><textarea id="jsonVInput" class="form-textarea" rows="6"></textarea><button class="btn btn-primary" onclick="window.validateJSON2()">✓ Tekshirish</button><div id="jsonVResult" class="tool-result"></div></div>` },
    'base64 encode': { title: 'B64 Base64 Encode', html: `<div class="tool-form"><textarea id="b64eInput" class="form-textarea" rows="3">KRYZEN HUB</textarea><button class="btn btn-primary" onclick="window.b64encode()">🔒 Encode</button><div id="b64eResult" class="tool-result"></div></div>` },
    'base64 decode': { title: 'B64 Base64 Decode', html: `<div class="tool-form"><textarea id="b64dInput" class="form-textarea" rows="3">S1JZRU4gSFVC</textarea><button class="btn btn-primary" onclick="window.b64decode()">🔓 Decode</button><div id="b64dResult" class="tool-result"></div></div>` },
    'url encode': { title: 'URL URL Encode', html: `<div class="tool-form"><textarea id="urleInput" class="form-textarea" rows="2">https://kryzen.com/hello world</textarea><button class="btn btn-primary" onclick="window.urlEncode()">🔒 Encode</button><div id="urleResult" class="tool-result"></div></div>` },
    'url decode': { title: 'URL URL Decode', html: `<div class="tool-form"><textarea id="urldInput" class="form-textarea" rows="2">https%3A%2F%2Fkryzen.com%2Fhello%20world</textarea><button class="btn btn-primary" onclick="window.urlDecode()">🔓 Decode</button><div id="urldResult" class="tool-result"></div></div>` },
    'regex': { title: '.* Regex Tester', html: `<div class="tool-form"><label>Pattern:</label><input type="text" id="regexPattern" class="form-input" value="\\b[A-Z][a-z]+\\b"><label>Flags:</label><input type="text" id="regexFlags" class="form-input" value="g"><label>Test matn:</label><textarea id="regexText" class="form-textarea" rows="3">Hello World from KRYZEN HUB</textarea><button class="btn btn-primary" onclick="window.testRegex()">▶ Test</button><div id="regexResult" class="tool-result"></div></div>` },
    'uuid': { title: '🔑 UUID Generator', html: `<div class="tool-form"><label>Soni:</label><input type="number" id="uuidCount" class="form-input" value="5"><button class="btn btn-primary" onclick="window.genUUIDs()">🔑 Yaratish</button><div id="uuidResult" class="tool-result"></div></div>` },
    'password generator': { title: '🔐 Password Generator', html: `<div class="tool-form"><label>Uzunligi: <span id="pwLenVal">20</span></label><input type="range" id="pwLen" min="8" max="64" value="20"><label>Soni:</label><input type="number" id="pwCount" class="form-input" value="3"><div class="checkbox-group"><label><input type="checkbox" id="pwUp" checked> Katta</label><label><input type="checkbox" id="pwLo" checked> Kichik</label><label><input type="checkbox" id="pwNum" checked> Raqam</label><label><input type="checkbox" id="pwSym" checked> Belgi</label></div><button class="btn btn-primary" onclick="window.genPasswords()">🔐 Yaratish</button><div id="pwResult" class="tool-result"></div></div>` },
    'qr code': { title: 'QR QR Code', html: `<div class="tool-form"><label>Matn/URL:</label><input type="text" id="qrData" class="form-input" value="https://kryzensys.github.io/kryzen-hub/"><label>O'lcham:</label><input type="number" id="qrSize" class="form-input" value="300"><button class="btn btn-primary" onclick="window.genQR()">QR Yaratish</button><div id="qrResult" class="tool-result" style="text-align:center"></div></div>` },
    'color picker': { title: '🎨 Color Picker', html: `<div class="tool-form"><input type="color" id="cpPicker" value="#8B5CF6" class="form-color"><div id="cpResult" class="tool-result"></div></div>` },
    'gradient': { title: '🌈 Gradient', html: `<div class="tool-form"><div class="form-row"><input type="color" id="gC1" value="#8B5CF6" class="form-color"><input type="color" id="gC2" value="#EC4899" class="form-color"></div><select id="gDir" class="form-select"><option value="to right">Chapdan o'ngga</option><option value="45deg">Diagonal 45°</option><option value="135deg">Diagonal 135°</option><option value="circle">Doira</option></select><div id="gResult" class="tool-result"></div></div>` },
    'lorem': { title: '📄 Lorem Ipsum', html: `<div class="tool-form"><label>Paragraflar:</label><input type="number" id="loremP" class="form-input" value="3"><button class="btn btn-primary" onclick="window.genLorem()">📄 Yaratish</button><div id="loremResult" class="tool-result"></div></div>` },
    'hash generator': { title: '# Hash Generator', html: `<div class="tool-form"><textarea id="hashInput" class="form-textarea" rows="3">KRYZEN HUB</textarea><button class="btn btn-primary" onclick="window.genHashes()"># Hash</button><div id="hashResult" class="tool-result"></div></div>` },
    'url shorten': { title: '🔗 URL Shortener', html: `<div class="tool-form"><input type="url" id="shortUrl" class="form-input" placeholder="https://example.com/long-url"><button class="btn btn-primary" onclick="window.shortenURL()">🔗 Qisqartirish</button><div id="shortResult" class="tool-result"></div></div>` },
    'ip lookup': { title: '🌐 IP Lookup', html: `<div class="tool-form"><label>IP (ixtiyoriy):</label><input type="text" id="ipInput" class="form-input" placeholder="8.8.8.8"><button class="btn btn-primary" onclick="window.lookupIP()">🌐 Tekshirish</button><div id="ipResult" class="tool-result"></div></div>` },
    'dns': { title: '📡 DNS Lookup', html: `<div class="tool-form"><label>Domain:</label><input type="text" id="dnsDomain" class="form-input" value="google.com"><label>Type:</label><select id="dnsType" class="form-select"><option>A</option><option>AAAA</option><option>MX</option><option>NS</option><option>TXT</option><option>CNAME</option></select><button class="btn btn-primary" onclick="window.lookupDNS()">📡 Tekshirish</button><div id="dnsResult" class="tool-result"></div></div>` },
    'whois': { title: '🔍 WHOIS', html: `<div class="tool-form"><input type="text" id="whoisDomain" class="form-input" value="google.com"><button class="btn btn-primary" onclick="window.lookupWhois()">🔍 Tekshirish</button><div id="whoisResult" class="tool-result"></div></div>` },
    'http headers': { title: '📋 HTTP Headers', html: `<div class="tool-form"><input type="text" id="hdrUrl" class="form-input" value="https://google.com"><button class="btn btn-primary" onclick="window.checkHeaders()">📋 Tekshirish</button><div id="hdrResult" class="tool-result"></div></div>` },
    'ssl': { title: '🔒 SSL Checker', html: `<div class="tool-form"><input type="text" id="sslDomain" class="form-input" value="google.com"><button class="btn btn-primary" onclick="window.checkSSL()">🔒 Tekshirish</button><div id="sslResult" class="tool-result"></div></div>` },
    'subdomain': { title: '🌐 Subdomain Finder', html: `<div class="tool-form"><input type="text" id="subDomain" class="form-input" value="google.com"><button class="btn btn-primary" onclick="window.findSubdomains()">🔍 Qidirish</button><div id="subResult" class="tool-result"></div></div>` },
    'jwt': { title: 'JWT JWT Decoder', html: `<div class="tool-form"><textarea id="jwtInput" class="form-textarea" rows="4">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</textarea><button class="btn btn-primary" onclick="window.decodeJWT()">🔓 Decode</button><div id="jwtResult" class="tool-result"></div></div>` },
    'email validator': { title: '📧 Email Validator', html: `<div class="tool-form"><input type="email" id="emInput" class="form-input" placeholder="user@example.com"><button class="btn btn-primary" onclick="window.validateEmail()">✓ Tekshirish</button><div id="emResult" class="tool-result"></div></div>` },
    'phone': { title: '📱 Phone Lookup', html: `<div class="tool-form"><input type="text" id="phInput" class="form-input" placeholder="+998901234567"><button class="btn btn-primary" onclick="window.lookupPhone()">📱 Tekshirish</button><div id="phResult" class="tool-result"></div></div>` },
    'breach': { title: '⚠️ Breach Check', html: `<div class="tool-form"><input type="email" id="brInput" class="form-input" placeholder="user@example.com"><button class="btn btn-primary" onclick="window.checkBreach()">⚠️ Tekshirish</button><div id="brResult" class="tool-result"></div></div>` },
    'github analyzer': { title: '🐙 GitHub Analyzer', html: `<div class="tool-form"><input type="text" id="ghUser" class="form-input" value="KRYZENSYS"><button class="btn btn-primary" onclick="window.analyzeGitHub()">🔍 Tahlil</button><div id="ghResult" class="tool-result"></div></div>` },
    'download': { title: '📥 Media Downloader', html: `<div class="tool-form"><input type="url" id="dlUrl" class="form-input" placeholder="https://youtube.com/watch?v=..."><select id="dlQuality" class="form-select"><option value="best">Eng yaxshi</option><option value="1080p">1080p</option><option value="720p">720p</option><option value="audio">Audio</option></select><button class="btn btn-primary" onclick="window.downloadMedia()">📥 Yuklash</button><div id="dlResult" class="tool-result"></div></div>` },
    'holidays': { title: '🎉 Bayramlar', html: `<div class="tool-form"><input type="text" id="holCountry" class="form-input" value="UZ"><input type="number" id="holYear" class="form-input" value="2026"><button class="btn btn-primary" onclick="window.getHolidays()">🎉 Ko'rish</button><div id="holResult" class="tool-result"></div></div>` },
    'sentiment': { title: '😊 Sentiment', html: `<div class="tool-form"><textarea id="sentText" class="form-textarea" rows="3">I love this product! It is amazing.</textarea><button class="btn btn-primary" onclick="window.analyzeSentiment()">🔍 Tahlil</button><div id="sentResult" class="tool-result"></div></div>` },
    'summarizer': { title: '📝 Summarizer', html: `<div class="tool-form"><textarea id="sumText" class="form-textarea" rows="6" placeholder="Uzun matn kiriting..."></textarea><button class="btn btn-primary" onclick="window.summarizeText()">📝 Qisqartirish</button><div id="sumResult" class="tool-result"></div></div>` }
  };

  const tool = tools[t];
  if (tool) {
    createModal(tool.title, tool.html);
    if (t === 'ai chat') {
      setTimeout(() => {
        const input = document.getElementById('aiChatInput');
        if (input) {
          input.addEventListener('keypress', (e) => { if (e.key === 'Enter') window.sendAIMessage(); });
          input.focus();
        }
      }, 100);
    }
    if (t === 'password generator') {
      setTimeout(() => {
        const len = document.getElementById('pwLen');
        const val = document.getElementById('pwLenVal');
        if (len && val) len.oninput = () => val.textContent = len.value;
      }, 100);
    }
    if (t === 'color picker') {
      setTimeout(() => {
        const picker = document.getElementById('cpPicker');
        const result = document.getElementById('cpResult');
        if (picker && result) {
          const update = () => {
            const hex = picker.value;
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            result.innerHTML = `<div style="background:${hex};height:100px;border-radius:12px;margin:12px 0"></div><div class="kv"><strong>HEX:</strong> <code>${hex}</code> <button class="btn-mini" onclick="copyToClipboard('${hex}')">📋</button></div><div class="kv"><strong>RGB:</strong> <code>rgb(${r}, ${g}, ${b})</code></div>`;
          };
          picker.oninput = update;
          update();
        }
      }, 100);
    }
    if (t === 'gradient') {
      setTimeout(() => {
        const update = () => {
          const c1 = document.getElementById('gC1').value;
          const c2 = document.getElementById('gC2').value;
          const dir = document.getElementById('gDir').value;
          const css = dir === 'circle' ? `radial-gradient(circle, ${c1}, ${c2})` : `linear-gradient(${dir}, ${c1}, ${c2})`;
          document.getElementById('gResult').innerHTML = `<div style="background:${css};height:100px;border-radius:12px;margin:12px 0"></div><pre class="code-block">background: ${css};</pre><button class="btn btn-primary" onclick="copyToClipboard('background: ${css};')">📋 Nusxalash</button>`;
        };
        ['gC1', 'gC2', 'gDir'].forEach(id => { const el = document.getElementById(id); if (el) el.oninput = update; });
        update();
      }, 100);
    }
  } else {
    createModal(`🔧 ${toolName}`, `<div class="alert alert-info"><strong>${toolName}</strong> - demo versiyada mavjud. Backend API'ga ulash uchun sayt admin bilan bog'laning.</div><div class="tool-form"><button class="btn btn-primary" onclick="closeTool()">✓ Yopish</button></div>`);
  }
};

// ============================================================
// API FUNCTIONS
// ============================================================
window.sendAIMessage = async function() {
  const input = document.getElementById('aiChatInput');
  const messages = document.getElementById('aiChatMessages');
  if (!input || !messages) return;
  const text = input.value.trim();
  if (!text) return;
  messages.innerHTML += `<div class="ai-message user">${text}</div>`;
  input.value = '';
  messages.scrollTop = messages.scrollHeight;
  messages.innerHTML += `<div class="ai-message bot loading" id="aiLoading"><div class="spinner"></div></div>`;
  try {
    const data = await apiPost('chat', { message: text });
    const loading = document.getElementById('aiLoading');
    if (loading) loading.remove();
    messages.innerHTML += `<div class="ai-message bot">${data.message || data.error || 'Xatolik'}</div>`;
    messages.scrollTop = messages.scrollHeight;
  } catch (e) {
    const loading = document.getElementById('aiLoading');
    if (loading) loading.remove();
    messages.innerHTML += `<div class="ai-message bot">Tarmoq xatosi. Qaytadan urinib ko'ring.</div>`;
  }
};

window.translateText = async () => {
  const text = document.getElementById('trText').value;
  const from = document.getElementById('trFrom').value;
  const to = document.getElementById('trTo').value;
  const result = document.getElementById('trResult');
  result.innerHTML = showLoading('Tarjima...');
  try {
    const data = await apiPost('translate', { text, from, to });
    result.innerHTML = data.success ? `<div class="output-box">${data.translated}</div>` : showError(data.error);
  } catch (e) { result.innerHTML = showError('Xatolik'); }
};

window.getWeather = async () => {
  const city = document.getElementById('weatherCity').value;
  const result = document.getElementById('weatherResult');
  result.innerHTML = showLoading('Yuklanmoqda...');
  try {
    const data = await apiGet('weather', { city });
    if (data.success) {
      result.innerHTML = `<div class="weather-card"><h3>${data.location.name}, ${data.location.country}</h3><div style="font-size:60px;text-align:center">${data.current.icon}</div><div class="weather-temp">${Math.round(data.current.temperature_2m)}°C</div><p>${data.current.description}</p><div class="weather-details"><div>💧 Namlik: ${data.current.relative_humidity_2m}%</div><div>💨 Shamol: ${data.current.wind_speed_10m} km/s</div></div></div>`;
    } else { result.innerHTML = showError(data.error); }
  } catch (e) { result.innerHTML = showError('Xatolik'); }
};

window.getNews = async () => {
  const result = document.getElementById('newsResult');
  result.innerHTML = showLoading('Yangiliklar...');
  try {
    const data = await apiGet('news', { category: 'top' });
    if (data.success) {
      result.innerHTML = data.articles.slice(0, 15).map(a => `<div class="news-item"><a href="${a.url}" target="_blank" class="news-title">${a.title}</a><div class="news-meta">⭐ ${a.score} · 💬 ${a.comments}</div></div>`).join('');
    } else { result.innerHTML = showError('Topilmadi'); }
  } catch (e) { result.innerHTML = showError('Xatolik'); }
};

window.getCrypto = async () => {
  const result = document.getElementById('cryptoResult');
  result.innerHTML = showLoading('Narxlar...');
  try {
    const data = await apiGet('crypto');
    if (data.success) {
      let html = '<h3>💰 Kriptovalyuta (USD)</h3><div class="crypto-grid">';
      for (const [id, info] of Object.entries(data.prices)) {
        const ch = info.usd_24h_change || 0;
        html += `<div class="crypto-item"><div class="crypto-name">${id.toUpperCase()}</div><div class="crypto-price">$${info.usd?.toFixed(2)}</div><div class="crypto-change ${ch >= 0 ? 'positive' : 'negative'}">${ch >= 0 ? '📈' : '📉'} ${ch.toFixed(2)}%</div></div>`;
      }
      result.innerHTML = html + '</div>';
    }
  } catch (e) { result.innerHTML = showError('Xatolik'); }
};

window.getCurrency = async () => {
  const base = document.getElementById('curBase').value || 'USD';
  const result = document.getElementById('curResult');
  result.innerHTML = showLoading('Kurslar...');
  try {
    const data = await apiGet('currency', { base });
    if (data.success) {
      const top = ['USD', 'EUR', 'RUB', 'UZS', 'GBP', 'JPY', 'CNY', 'KRW', 'TRY', 'KZT'];
      let html = `<h3>💱 ${base} dan asosiy</h3><div class="currency-grid">`;
      top.forEach(c => { if (data.rates[c]) html += `<div class="currency-item"><strong>${c}</strong>: ${data.rates[c].toFixed(2)}</div>`; });
      result.innerHTML = html + '</div>';
    }
  } catch (e) { result.innerHTML = showError('Xatolik'); }
};

window.getDict = async () => {
  const word = document.getElementById('dictWord').value;
  const result = document.getElementById('dictResult');
  if (!word) return;
  result.innerHTML = showLoading();
  try {
    const data = await apiGet('dictionary', { word });
    if (data.success) {
      let html = `<h3>${data.word} ${data.phonetic || ''}</h3>`;
      data.meanings.forEach(m => {
        html += `<div class="dict-meaning"><strong>${m.partOfSpeech}</strong><ul>`;
        m.definitions.forEach(d => { html += `<li>${d.definition}${d.example ? `<br><em>"${d.example}"</em>` : ''}</li>`; });
        html += '</ul></div>';
      });
      result.innerHTML = html;
    } else { result.innerHTML = showError('Topilmadi'); }
  } catch (e) { result.innerHTML = showError('Xatolik'); }
};

window.getQuote = async () => {
  const result = document.getElementById('quoteResult');
  try {
    const data = await apiGet('quote', { type: 'quote' });
    result.innerHTML = `<div class="quote-card"><div class="quote-text">"${data.text}"</div><div class="quote-author">— ${data.author}</div></div>`;
  } catch (e) { result.innerHTML = showError('Xatolik'); }
};

window.getJoke = async () => {
  const result = document.getElementById('jokeResult');
  try {
    const data = await apiGet('quote', { type: 'joke' });
    result.innerHTML = `<div class="joke-card">${data.text}</div>`;
  } catch (e) { result.innerHTML = showError('Xatolik'); }
};

window.formatJSON = () => {
  try { const o = JSON.parse(document.getElementById('jsonInput').value); document.getElementById('jsonResult').innerHTML = `<pre class="code-block">${JSON.stringify(o, null, 2)}</pre>`; }
  catch (e) { document.getElementById('jsonResult').innerHTML = showError('Noto\'g\'ri JSON: ' + e.message); }
};
window.minifyJSON = () => {
  try { const o = JSON.parse(document.getElementById('jsonInput').value); document.getElementById('jsonResult').innerHTML = `<pre class="code-block">${JSON.stringify(o)}</pre>`; }
  catch (e) { document.getElementById('jsonResult').innerHTML = showError('Noto\'g\'ri JSON'); }
};
window.validateJSON2 = () => {
  try { JSON.parse(document.getElementById('jsonVInput').value); document.getElementById('jsonVResult').innerHTML = '<div class="alert alert-success">✅ To\'g\'ri JSON!</div>'; }
  catch (e) { document.getElementById('jsonVResult').innerHTML = showError('Xato: ' + e.message); }
};

window.b64encode = () => {
  try { const e = btoa(unescape(encodeURIComponent(document.getElementById('b64eInput').value))); document.getElementById('b64eResult').innerHTML = `<div class="output-box">${e}</div><button class="btn-mini" onclick="copyToClipboard('${e}')">📋</button>`; }
  catch (e) { document.getElementById('b64eResult').innerHTML = showError('Xato'); }
};
window.b64decode = () => {
  try { const d = decodeURIComponent(escape(atob(document.getElementById('b64dInput').value))); document.getElementById('b64dResult').innerHTML = `<div class="output-box">${d}</div>`; }
  catch (e) { document.getElementById('b64dResult').innerHTML = showError('Noto\'g\'ri Base64'); }
};

window.urlEncode = () => { const e = encodeURIComponent(document.getElementById('urleInput').value); document.getElementById('urleResult').innerHTML = `<div class="output-box">${e}</div>`; };
window.urlDecode = () => { try { const d = decodeURIComponent(document.getElementById('urldInput').value); document.getElementById('urldResult').innerHTML = `<div class="output-box">${d}</div>`; } catch (e) { document.getElementById('urldResult').innerHTML = showError('Xato'); } };

window.testRegex = () => {
  try {
    const p = document.getElementById('regexPattern').value;
    const f = document.getElementById('regexFlags').value;
    const t = document.getElementById('regexText').value;
    const regex = new RegExp(p, f);
    const matches = [...t.matchAll(new RegExp(p, f + (f.includes('g') ? '' : 'g')))];
    const highlighted = t.replace(regex, m => `<mark>${m}</mark>`);
    document.getElementById('regexResult').innerHTML = `<div>✅ ${matches.length} ta</div><div>${highlighted}</div>`;
  } catch (e) { document.getElementById('regexResult').innerHTML = showError('Xato: ' + e.message); }
};

window.genUUIDs = async () => {
  const count = document.getElementById('uuidCount').value;
  const result = document.getElementById('uuidResult');
  result.innerHTML = showLoading();
  try {
    const data = await apiGet('uuid', { count });
    if (data.success) result.innerHTML = data.uuids.map(u => `<div class="uuid-item"><code>${u}</code> <button class="btn-mini" onclick="copyToClipboard('${u}')">📋</button></div>`).join('');
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.genPasswords = async () => {
  const length = document.getElementById('pwLen').value;
  const count = document.getElementById('pwCount').value;
  const u = document.getElementById('pwUp').checked;
  const l = document.getElementById('pwLo').checked;
  const n = document.getElementById('pwNum').checked;
  const s = document.getElementById('pwSym').checked;
  const result = document.getElementById('pwResult');
  result.innerHTML = showLoading();
  try {
    const data = await apiGet('password', { length, count, uppercase: u, lowercase: l, numbers: n, symbols: s });
    if (data.success) {
      result.innerHTML = data.passwords.map(p => `<div class="password-item"><code>${p.value}</code><span class="strength strength-${p.strength.label}">${p.strength.label}</span><button class="btn-mini" onclick="copyToClipboard('${p.value}')">📋</button></div>`).join('');
    }
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.genQR = async () => {
  const data = document.getElementById('qrData').value;
  const size = document.getElementById('qrSize').value;
  const result = document.getElementById('qrResult');
  result.innerHTML = showLoading();
  try {
    const json = await apiGet('qrcode', { data, size });
    result.innerHTML = `<img src="${json.url}" style="max-width:100%;border-radius:12px"><p><a href="${json.url}" target="_blank" class="btn btn-primary">⬇ Yuklab olish</a></p>`;
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.genLorem = async () => {
  const result = document.getElementById('loremResult');
  result.innerHTML = showLoading();
  try {
    const data = await apiGet('lorem', { paragraphs: document.getElementById('loremP').value });
    if (data.success) result.innerHTML = `<div class="output-box">${data.text}</div>`;
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.genHashes = async () => {
  const text = document.getElementById('hashInput').value;
  const result = document.getElementById('hashResult');
  result.innerHTML = showLoading();
  try {
    const data = await apiPost('hash', { text });
    if (data.success) {
      let html = '';
      for (const [a, h] of Object.entries(data.hashes)) {
        html += `<div class="hash-item"><strong>${a}:</strong><br><code>${h}</code> <button class="btn-mini" onclick="copyToClipboard('${h}')">📋</button></div>`;
      }
      result.innerHTML = html;
    }
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.shortenURL = async () => {
  const url = document.getElementById('shortUrl').value;
  const result = document.getElementById('shortResult');
  result.innerHTML = showLoading();
  try {
    const data = await apiPost('shorten', { url });
    if (data.success) result.innerHTML = `<div class="output-box">🔗 ${data.short}</div><button class="btn-mini" onclick="copyToClipboard('${data.short}')">📋</button>`;
    else result.innerHTML = showError(data.error);
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.lookupIP = async () => {
  const ip = document.getElementById('ipInput').value;
  const result = document.getElementById('ipResult');
  result.innerHTML = showLoading();
  try {
    const data = await apiGet('ip', ip ? { ip } : {});
    if (data.status === 'success') {
      result.innerHTML = `<div class="info-grid"><div><strong>IP:</strong> ${data.query}</div><div><strong>Davlat:</strong> ${data.country} ${data.countryCode}</div><div><strong>Shahar:</strong> ${data.city}</div><div><strong>ISP:</strong> ${data.isp}</div><div><strong>Timezone:</strong> ${data.timezone}</div></div>`;
    }
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.lookupDNS = async () => {
  const domain = document.getElementById('dnsDomain').value;
  const type = document.getElementById('dnsType').value;
  const result = document.getElementById('dnsResult');
  result.innerHTML = showLoading();
  try {
    const data = await apiGet('dns', { domain, type });
    if (data.Answer) result.innerHTML = `<h3>${domain} - ${type}</h3><div>${data.Answer.map(a => `<div class="dns-record">${a.data}</div>`).join('')}</div>`;
    else result.innerHTML = 'Yozuvlar topilmadi';
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.lookupWhois = async () => {
  const domain = document.getElementById('whoisDomain').value;
  const result = document.getElementById('whoisResult');
  result.innerHTML = showLoading();
  try {
    const data = await apiGet('whois', { domain });
    if (data.success) result.innerHTML = `<div class="info-grid"><div><strong>Domain:</strong> ${data.domain}</div><div><strong>Registrar:</strong> ${data.registrar}</div><div><strong>Yaratilgan:</strong> ${data.creationDate}</div><div><strong>Tugaydi:</strong> ${data.expirationDate}</div></div>`;
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.checkHeaders = async () => {
  const url = document.getElementById('hdrUrl').value;
  const result = document.getElementById('hdrResult');
  result.innerHTML = showLoading();
  try {
    const data = await apiGet('headers', { url });
    if (data.success) {
      result.innerHTML = `<div class="security-grade grade-${data.grade}">Xavfsizlik: ${data.grade}</div><div class="headers-list">${Object.entries(data.headers).map(([k, v]) => `<div><strong>${k}:</strong> ${v}</div>`).join('')}</div>`;
    }
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.checkSSL = async () => {
  const domain = document.getElementById('sslDomain').value;
  const result = document.getElementById('sslResult');
  result.innerHTML = showLoading();
  try {
    const data = await apiGet('ssl', { domain });
    if (data.success) result.innerHTML = `<div class="ssl-status">${data.status}</div><div class="info-grid"><div><strong>HTTPS:</strong> ${data.https ? '✅' : '❌'}</div><div><strong>HSTS:</strong> ${data.hsts ? '✅' : '❌'}</div><div><strong>Grade:</strong> ${data.grade}</div></div>`;
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.findSubdomains = async () => {
  const domain = document.getElementById('subDomain').value;
  const result = document.getElementById('subResult');
  result.innerHTML = showLoading('Skanerlanmoqda...');
  try {
    const data = await apiGet('subdomain', { domain });
    if (data.success) {
      result.innerHTML = `<p>${data.foundCount} ta topildi</p>${data.found.map(s => `<div class="sub-item"><code>${s.subdomain}</code> → ${s.ip}</div>`).join('')}`;
    }
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.decodeJWT = async () => {
  const token = document.getElementById('jwtInput').value;
  const result = document.getElementById('jwtResult');
  result.innerHTML = showLoading();
  try {
    const data = await apiPost('jwt', { token });
    if (data.success) {
      result.innerHTML = `<h4>Header</h4><pre class="code-block">${JSON.stringify(data.header, null, 2)}</pre><h4>Payload</h4><pre class="code-block">${JSON.stringify(data.payload, null, 2)}</pre><div class="jwt-status ${data.valid ? 'valid' : 'expired'}">${data.valid ? '✅ Yaroqli' : '❌ Muddati tugagan'}</div>`;
    }
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.validateEmail = async () => {
  const email = document.getElementById('emInput').value;
  const result = document.getElementById('emResult');
  result.innerHTML = showLoading();
  try {
    const data = await apiGet('email', { email });
    if (data.success) result.innerHTML = `<div class="email-validity ${data.valid ? 'valid' : 'invalid'}">${data.valid ? '✅ Yaroqli' : '❌ Yaroqsiz'}</div><div class="info-grid"><div><strong>User:</strong> ${data.user}</div><div><strong>Domain:</strong> ${data.domain}</div><div><strong>Score:</strong> ${data.score}/100</div></div>`;
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.lookupPhone = async () => {
  const phone = document.getElementById('phInput').value;
  const result = document.getElementById('phResult');
  result.innerHTML = showLoading();
  try {
    const data = await apiGet('phone', { phone });
    if (data.success) result.innerHTML = `<div class="phone-validity ${data.valid ? 'valid' : 'invalid'}">${data.valid ? '✅' : '❌'} ${data.phone}</div>${data.country ? `<div class="info-grid"><div><strong>Davlat:</strong> ${data.country.flag} ${data.country.name}</div>${data.operator ? `<div><strong>Operator:</strong> ${data.operator}</div>` : ''}</div>` : ''}`;
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.checkBreach = async () => {
  const email = document.getElementById('brInput').value;
  const result = document.getElementById('brResult');
  result.innerHTML = showLoading();
  try {
    const data = await apiGet('breach', { email });
    if (data.success) {
      let html = `<div class="breach-status ${data.safe ? 'safe' : 'danger'}">${data.message}</div>`;
      if (data.breaches && data.breaches.length > 0) {
        data.breaches.forEach(b => { html += `<div class="breach-item"><strong>${b.Name}</strong><br><small>${b.BreachDate}</small></div>`; });
      }
      result.innerHTML = html;
    }
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.analyzeGitHub = async () => {
  const username = document.getElementById('ghUser').value;
  const result = document.getElementById('ghResult');
  result.innerHTML = showLoading('GitHub...');
  try {
    const data = await apiGet('github', { username });
    if (data.success) {
      const u = data.user;
      result.innerHTML = `<div class="gh-profile"><img src="${u.avatar}" class="gh-avatar"><div><h3>${u.name || u.login}</h3><p>@${u.login}</p>${u.bio ? `<p>${u.bio}</p>` : ''}</div></div><div class="gh-stats"><div class="gh-stat"><div class="num">${u.publicRepos}</div><div>Repos</div></div><div class="gh-stat"><div class="num">${u.followers}</div><div>Followers</div></div><div class="gh-stat"><div class="num">${data.stats.totalStars}</div><div>Stars</div></div></div>${data.topRepos.length > 0 ? `<h4>⭐ Top repos</h4>${data.topRepos.map(r => `<div class="gh-repo"><a href="${r.url}" target="_blank">${r.name}</a><p>${r.description || ''}</p><small>⭐ ${r.stars} · 🍴 ${r.forks}</small></div>`).join('')}` : ''}`;
    }
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.downloadMedia = async () => {
  const url = document.getElementById('dlUrl').value;
  const quality = document.getElementById('dlQuality').value;
  const result = document.getElementById('dlResult');
  if (!url) return result.innerHTML = showError('URL kiriting');
  result.innerHTML = showLoading();
  try {
    const data = await apiPost('download', { url, quality });
    if (data.success) result.innerHTML = `<div>Platform: <strong>${data.platform}</strong></div>${data.downloadOptions.map(o => `<a href="${o.url}" target="_blank" class="btn btn-primary dl-btn">${o.service} - ${o.note}</a>`).join('')}`;
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.getHolidays = async () => {
  const country = document.getElementById('holCountry').value;
  const year = document.getElementById('holYear').value;
  const result = document.getElementById('holResult');
  result.innerHTML = showLoading();
  try {
    const data = await apiGet('holidays', { country, year });
    if (data.success) result.innerHTML = data.holidays.map(h => `<div class="holiday-item"><div class="holiday-date">${h.date}</div><div class="holiday-name"><strong>${h.name}</strong></div></div>`).join('');
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.analyzeSentiment = async () => {
  const text = document.getElementById('sentText').value;
  const result = document.getElementById('sentResult');
  result.innerHTML = showLoading();
  try {
    const data = await apiPost('sentiment', { text });
    if (data.success) result.innerHTML = `<div class="sentiment-card sentiment-${data.label}"><div style="font-size:60px">${data.emoji}</div><div class="sentiment-label">${data.label.toUpperCase()}</div><div>Score: ${data.score.toFixed(2)}</div></div>`;
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.summarizeText = async () => {
  const text = document.getElementById('sumText').value;
  const result = document.getElementById('sumResult');
  if (!text) return result.innerHTML = showError('Matn kiriting');
  result.innerHTML = showLoading();
  try {
    const data = await apiPost('summarize', { text });
    if (data.success) result.innerHTML = `<div class="output-box">${data.summary}</div><p>📉 ${data.compression} siqildi</p>`;
  } catch (e) { result.innerHTML = showError('Xato'); }
};

window.generateCode = async () => {
  const lang = document.getElementById('codeLang').value;
  const prompt = document.getElementById('codePrompt').value;
  const result = document.getElementById('codeResult');
  if (!prompt) return result.innerHTML = showError('Vazifa kiriting');
  result.innerHTML = showLoading();
  try {
    const data = await apiPost('chat', { message: `${lang} tilida kod yoz: ${prompt}. Faqat kod qaytar.` });
    const code = (data.message || '').replace(/```[a-z]*\n?/g, '').replace(/```/g, '').trim();
    result.innerHTML = `<pre class="code-block">${code}</pre><button class="btn-mini" onclick='copyToClipboard(\`${code.replace(/`/g, '\\`')}\`)'>📋</button>`;
  } catch (e) { result.innerHTML = showError('Xato'); }
};

console.log('✅ KRYZEN HUB Tools loaded - 30+ APIs connected!');
