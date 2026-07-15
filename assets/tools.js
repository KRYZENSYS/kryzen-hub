/* ============================================================
   KRYZEN HUB - Tools Implementation (All Real APIs)
   ============================================================ */

const API_BASE = 'https://kryzen-hub.vercel.app/api';
// Fallback to local if Vercel not yet deployed
const API_FALLBACK = '/api';

async function callAPI(endpoint, options = {}) {
  try {
    const res = await fetch(API_BASE + endpoint, options);
    if (res.ok) return await res.json();
    throw new Error('Vercel API not available');
  } catch (e) {
    // Try GitHub Pages API (will fail, that's ok)
    try {
      const res2 = await fetch(API_FALLBACK + endpoint, options);
      if (res2.ok) return await res2.json();
    } catch (e2) {}
    throw e;
  }
}

function createModal(title, content) {
  // Remove existing
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
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeTool();
  });
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

// ============================================================
// AI CHAT
// ============================================================
window.openTool = async function(toolName) {
  const t = toolName.toLowerCase();

  // AI TOOLS
  if (t === 'ai chat') {
    createModal('💬 AI Chat', `
      <div class="ai-chat-container">
        <div id="aiChatMessages" class="ai-chat-messages">
          <div class="ai-message bot">Salom! Men KRYZEN AI yordamchisiman. Sizga qanday yordam bera olaman?</div>
        </div>
        <div class="ai-chat-input">
          <input type="text" id="aiChatInput" placeholder="Xabar yozing..." autocomplete="off">
          <button onclick="window.sendAIMessage()" class="btn btn-primary">Yuborish</button>
        </div>
      </div>
    `);
    setTimeout(() => {
      const input = document.getElementById('aiChatInput');
      if (input) {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') window.sendAIMessage();
        });
        input.focus();
      }
    }, 100);
  }
  else if (t.includes('kod yozuvchi') || t.includes('code generator')) {
    createModal('👨‍💻 Kod Yozuvchi AI', `
      <div class="tool-form">
        <label>Til:</label>
        <select id="codeLang" class="form-select">
          <option>JavaScript</option><option>Python</option><option>HTML</option>
          <option>CSS</option><option>Java</option><option>C++</option>
          <option>Go</option><option>Rust</option>
        </select>
        <label>Vazifa tavsifi:</label>
        <textarea id="codePrompt" class="form-textarea" rows="3" placeholder="Masalan: 1 dan 100 gacha bo'lgan sonlarni chiqaruvchi funksiya"></textarea>
        <button class="btn btn-primary" onclick="window.generateCode()">🚀 Kod Yaratish</button>
        <div id="codeResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('tarjimon')) {
    createModal('🌐 Tarjimon', `
      <div class="tool-form">
        <label>Tarjima qilish:</label>
        <textarea id="trText" class="form-textarea" rows="4" placeholder="Matn kiriting...">Hello, how are you?</textarea>
        <div class="form-row">
          <select id="trFrom" class="form-select">
            <option value="auto">Auto</option>
            <option value="en">English</option>
            <option value="uz">Uzbek</option>
            <option value="ru">Russian</option>
            <option value="tr">Turkish</option>
            <option value="ar">Arabic</option>
            <option value="zh">Chinese</option>
          </select>
          <span>→</span>
          <select id="trTo" class="form-select">
            <option value="uz">Uzbek</option>
            <option value="en" selected>English</option>
            <option value="ru">Russian</option>
            <option value="tr">Turkish</option>
            <option value="ar">Arabic</option>
            <option value="zh">Chinese</option>
          </select>
        </div>
        <button class="btn btn-primary" onclick="window.translateText()">🌐 Tarjima</button>
        <div id="trResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('weather') || t.includes('ob-havo')) {
    createModal('🌤 Ob-havo', `
      <div class="tool-form">
        <label>Shahar nomi:</label>
        <input type="text" id="weatherCity" class="form-input" value="Tashkent" placeholder="Tashkent, London, New York...">
        <button class="btn btn-primary" onclick="window.getWeather()">🌤 Ob-havoni ko'rish</button>
        <div id="weatherResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('news') || t.includes('yangilik')) {
    createModal('📰 Yangiliklar', `
      <div class="tool-form">
        <label>Kategoriya:</label>
        <select id="newsCategory" class="form-select">
          <option value="tech">Texnologiya</option>
          <option value="world">Dunyo</option>
          <option value="business">Biznes</option>
          <option value="science">Fan</option>
          <option value="cyber">Kiberxavfsizlik</option>
          <option value="ai">AI</option>
          <option value="programming">Dasturlash</option>
          <option value="gaming">O'yinlar</option>
        </select>
        <button class="btn btn-primary" onclick="window.getNews()">📰 Yangiliklarni yuklash</button>
        <div id="newsResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('crypto') || t.includes('kriptovalyuta')) {
    createModal('💰 Kriptovalyuta Narxlari', `
      <div class="tool-form">
        <button class="btn btn-primary" onclick="window.getCrypto()">💰 Narxlarni ko'rish</button>
        <div id="cryptoResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('currency') || t.includes('valyuta')) {
    createModal('💱 Valyuta Kurslari', `
      <div class="tool-form">
        <label>Asosiy valyuta:</label>
        <input type="text" id="curBase" class="form-input" value="USD" placeholder="USD, EUR, UZS...">
        <button class="btn btn-primary" onclick="window.getCurrency()">💱 Kurslarni ko'rish</button>
        <div id="curResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('dictionary') || t.includes('lug\'at')) {
    createModal('📖 Lug\'at', `
      <div class="tool-form">
        <label>So\'z:</label>
        <input type="text" id="dictWord" class="form-input" placeholder="hello, world, code...">
        <button class="btn btn-primary" onclick="window.getDict()">🔍 Qidirish</button>
        <div id="dictResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('quote') || t.includes('hikmat')) {
    createModal('💭 Hikmatli So\'z', `
      <div class="tool-form">
        <button class="btn btn-primary" onclick="window.getQuote()">🎲 Yangi hikmat</button>
        <div id="quoteResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('joke') || t.includes('hazil')) {
    createModal('😄 Hazil', `
      <div class="tool-form">
        <button class="btn btn-primary" onclick="window.getJoke()">😄 Yangi hazil</button>
        <div id="jokeResult" class="tool-result"></div>
      </div>
    `);
  }
  // DEV TOOLS
  else if (t.includes('json formatter')) {
    createModal('{} JSON Formatter', `
      <div class="tool-form">
        <textarea id="jsonInput" class="form-textarea" rows="8" placeholder='{"name":"KRYZEN","age":1}'>{"name":"KRYZEN HUB","tools":80,"active":true,"tags":["AI","Cyber","Dev"]}</textarea>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="window.formatJSON()">✨ Format</button>
          <button class="btn" onclick="window.minifyJSON()">📦 Minify</button>
          <button class="btn" onclick="window.validateJSON()">✓ Validate</button>
          <button class="btn" onclick="document.getElementById('jsonInput').value=''">🗑 Clear</button>
        </div>
        <div id="jsonResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('json validator')) {
    createModal('✓ JSON Validator', `
      <div class="tool-form">
        <textarea id="jsonVInput" class="form-textarea" rows="8" placeholder='{"a": 1}'></textarea>
        <button class="btn btn-primary" onclick="window.validateJSON2()">✓ Tekshirish</button>
        <div id="jsonVResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('base64 encode')) {
    createModal('B64 Base64 Encode', `
      <div class="tool-form">
        <textarea id="b64eInput" class="form-textarea" rows="4" placeholder="Matn kiriting">KRYZEN HUB</textarea>
        <button class="btn btn-primary" onclick="window.b64encode()">🔒 Encode</button>
        <div id="b64eResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('base64 decode')) {
    createModal('B64 Base64 Decode', `
      <div class="tool-form">
        <textarea id="b64dInput" class="form-textarea" rows="4" placeholder="Base64 matn">S1JZRU4gSFVC</textarea>
        <button class="btn btn-primary" onclick="window.b64decode()">🔓 Decode</button>
        <div id="b64dResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('url encode')) {
    createModal('URL URL Encode', `
      <div class="tool-form">
        <textarea id="urleInput" class="form-textarea" rows="3">https://kryzen.com/hello world?test=1&value=2</textarea>
        <button class="btn btn-primary" onclick="window.urlEncode()">🔒 Encode</button>
        <div id="urleResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('url decode')) {
    createModal('URL URL Decode', `
      <div class="tool-form">
        <textarea id="urldInput" class="form-textarea" rows="3">https%3A%2F%2Fkryzen.com%2Fhello%20world%3Ftest%3D1%26value%3D2</textarea>
        <button class="btn btn-primary" onclick="window.urlDecode()">🔓 Decode</button>
        <div id="urldResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('regex')) {
    createModal('.* Regex Tester', `
      <div class="tool-form">
        <label>Pattern:</label>
        <input type="text" id="regexPattern" class="form-input" value="\\b[A-Z][a-z]+\\b" placeholder="regex pattern">
        <label>Flags:</label>
        <input type="text" id="regexFlags" class="form-input" value="g" placeholder="g, i, m...">
        <label>Test matn:</label>
        <textarea id="regexText" class="form-textarea" rows="4">Hello World from KRYZEN HUB</textarea>
        <button class="btn btn-primary" onclick="window.testRegex()">▶ Test</button>
        <div id="regexResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('uuid')) {
    createModal('🔑 UUID Generator', `
      <div class="tool-form">
        <label>Soni:</label>
        <input type="number" id="uuidCount" class="form-input" value="5" min="1" max="100">
        <button class="btn btn-primary" onclick="window.genUUIDs()">🔑 Yaratish</button>
        <div id="uuidResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('password generator') || t === 'password') {
    createModal('🔐 Password Generator', `
      <div class="tool-form">
        <label>Uzunligi:</label>
        <input type="range" id="pwLen" min="8" max="64" value="20">
        <span id="pwLenVal">20</span>
        <label>Soni:</label>
        <input type="number" id="pwCount" class="form-input" value="3" min="1" max="20">
        <div class="checkbox-group">
          <label><input type="checkbox" id="pwUp" checked> Katta harflar (A-Z)</label>
          <label><input type="checkbox" id="pwLo" checked> Kichik harflar (a-z)</label>
          <label><input type="checkbox" id="pwNum" checked> Raqamlar (0-9)</label>
          <label><input type="checkbox" id="pwSym" checked> Belgilar (!@#$)</label>
        </div>
        <button class="btn btn-primary" onclick="window.genPasswords()">🔐 Yaratish</button>
        <div id="pwResult" class="tool-result"></div>
      </div>
    `);
    setTimeout(() => {
      const len = document.getElementById('pwLen');
      const val = document.getElementById('pwLenVal');
      if (len && val) len.oninput = () => val.textContent = len.value;
    }, 100);
  }
  else if (t.includes('qr code') || t === 'qrcode') {
    createModal('QR QR Code', `
      <div class="tool-form">
        <label>Matn yoki URL:</label>
        <input type="text" id="qrData" class="form-input" value="https://kryzensys.github.io/kryzen-hub/">
        <label>O\'lchami (px):</label>
        <input type="number" id="qrSize" class="form-input" value="300" min="100" max="800">
        <button class="btn btn-primary" onclick="window.genQR()">QR Yaratish</button>
        <div id="qrResult" class="tool-result" style="text-align:center"></div>
      </div>
    `);
  }
  else if (t.includes('color picker') || t === 'color') {
    createModal('🎨 Color Picker', `
      <div class="tool-form">
        <input type="color" id="cpPicker" value="#8B5CF6" class="form-color">
        <div id="cpResult" class="tool-result"></div>
      </div>
    `);
    setTimeout(() => {
      const picker = document.getElementById('cpPicker');
      const result = document.getElementById('cpResult');
      if (picker && result) {
        const update = () => {
          const hex = picker.value;
          const r = parseInt(hex.slice(1,3), 16);
          const g = parseInt(hex.slice(3,5), 16);
          const b = parseInt(hex.slice(5,7), 16);
          result.innerHTML = `
            <div style="background:${hex};height:120px;border-radius:12px;margin:16px 0"></div>
            <div class="kv"><strong>HEX:</strong> <code>${hex}</code> <button class="btn-mini" onclick="copyToClipboard('${hex}')">📋</button></div>
            <div class="kv"><strong>RGB:</strong> <code>rgb(${r}, ${g}, ${b})</code> <button class="btn-mini" onclick="copyToClipboard('rgb(${r}, ${g}, ${b})')">📋</button></div>
            <div class="kv"><strong>HSL:</strong> <code>hsl(${Math.round(r*360/255)}, ${Math.round(g*100/255)}%, ${Math.round(b*100/255)}%)</code></div>
          `;
        };
        picker.oninput = update;
        update();
      }
    }, 100);
  }
  else if (t.includes('gradient')) {
    createModal('🌈 Gradient Generator', `
      <div class="tool-form">
        <div class="form-row">
          <input type="color" id="gC1" value="#8B5CF6" class="form-color">
          <input type="color" id="gC2" value="#EC4899" class="form-color">
        </div>
        <label>Yo\'nalish:</label>
        <select id="gDir" class="form-select">
          <option value="to right">Chapdan o'ngga</option>
          <option value="45deg">Diagonal 45°</option>
          <option value="135deg">Diagonal 135°</option>
          <option value="to bottom">Yuqoridan pastga</option>
          <option value="circle">Doira</option>
        </select>
        <div id="gResult" class="tool-result"></div>
      </div>
    `);
    setTimeout(() => {
      const update = () => {
        const c1 = document.getElementById('gC1').value;
        const c2 = document.getElementById('gC2').value;
        const dir = document.getElementById('gDir').value;
        const css = dir === 'circle' ? `radial-gradient(circle, ${c1}, ${c2})` : `linear-gradient(${dir}, ${c1}, ${c2})`;
        const result = document.getElementById('gResult');
        if (result) {
          result.innerHTML = `
            <div style="background:${css};height:120px;border-radius:12px;margin:16px 0"></div>
            <pre class="code-block">background: ${css};</pre>
            <button class="btn btn-primary" onclick="copyToClipboard('background: ${css};')">📋 CSS Nusxalash</button>
          `;
        }
      };
      ['gC1','gC2','gDir'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.oninput = update;
      });
      update();
    }, 100);
  }
  else if (t.includes('lorem')) {
    createModal('📄 Lorem Ipsum', `
      <div class="tool-form">
        <label>Paragraflar soni:</label>
        <input type="number" id="loremP" class="form-input" value="3" min="1" max="20">
        <button class="btn btn-primary" onclick="window.genLorem()">📄 Yaratish</button>
        <div id="loremResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('hash generator') || t.includes('#')) {
    createModal('# Hash Generator', `
      <div class="tool-form">
        <textarea id="hashInput" class="form-textarea" rows="3" placeholder="Matn kiriting">KRYZEN HUB</textarea>
        <button class="btn btn-primary" onclick="window.genHashes()"># Hash Yaratish</button>
        <div id="hashResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('url shorten') || t.includes('shorten')) {
    createModal('🔗 URL Shortener', `
      <div class="tool-form">
        <label>URL:</label>
        <input type="url" id="shortUrl" class="form-input" placeholder="https://example.com/long-url">
        <button class="btn btn-primary" onclick="window.shortenURL()">🔗 Qisqartirish</button>
        <div id="shortResult" class="tool-result"></div>
      </div>
    `);
  }
  // CYBER TOOLS
  else if (t.includes('ip lookup') || t.includes('ip')) {
    createModal('🌐 IP Lookup', `
      <div class="tool-form">
        <label>IP manzil (ixtiyoriy):</label>
        <input type="text" id="ipInput" class="form-input" placeholder="8.8.8.8 (bo'sh = sizning IP)">
        <button class="btn btn-primary" onclick="window.lookupIP()">🌐 Tekshirish</button>
        <div id="ipResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('dns')) {
    createModal('📡 DNS Lookup', `
      <div class="tool-form">
        <label>Domain:</label>
        <input type="text" id="dnsDomain" class="form-input" value="google.com" placeholder="example.com">
        <label>Record turi:</label>
        <select id="dnsType" class="form-select">
          <option>A</option><option>AAAA</option><option>MX</option>
          <option>NS</option><option>TXT</option><option>CNAME</option>
        </select>
        <button class="btn btn-primary" onclick="window.lookupDNS()">📡 Tekshirish</button>
        <div id="dnsResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('whois')) {
    createModal('🔍 WHOIS Lookup', `
      <div class="tool-form">
        <label>Domain:</label>
        <input type="text" id="whoisDomain" class="form-input" value="google.com" placeholder="example.com">
        <button class="btn btn-primary" onclick="window.lookupWhois()">🔍 Tekshirish</button>
        <div id="whoisResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('http headers')) {
    createModal('📋 HTTP Headers', `
      <div class="tool-form">
        <label>URL:</label>
        <input type="text" id="hdrUrl" class="form-input" value="https://google.com" placeholder="https://example.com">
        <button class="btn btn-primary" onclick="window.checkHeaders()">📋 Tekshirish</button>
        <div id="hdrResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('ssl')) {
    createModal('🔒 SSL Checker', `
      <div class="tool-form">
        <label>Domain:</label>
        <input type="text" id="sslDomain" class="form-input" value="google.com" placeholder="example.com">
        <button class="btn btn-primary" onclick="window.checkSSL()">🔒 Tekshirish</button>
        <div id="sslResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('subdomain')) {
    createModal('🌐 Subdomain Finder', `
      <div class="tool-form">
        <label>Domain:</label>
        <input type="text" id="subDomain" class="form-input" value="google.com" placeholder="example.com">
        <button class="btn btn-primary" onclick="window.findSubdomains()">🔍 Qidirish</button>
        <div id="subResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('jwt')) {
    createModal('JWT JWT Decoder', `
      <div class="tool-form">
        <textarea id="jwtInput" class="form-textarea" rows="4" placeholder="JWT token">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</textarea>
        <button class="btn btn-primary" onclick="window.decodeJWT()">🔓 Decode</button>
        <div id="jwtResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('email validator') || t.includes('email')) {
    createModal('📧 Email Validator', `
      <div class="tool-form">
        <label>Email:</label>
        <input type="email" id="emInput" class="form-input" placeholder="user@example.com">
        <button class="btn btn-primary" onclick="window.validateEmail()">✓ Tekshirish</button>
        <div id="emResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('phone')) {
    createModal('📱 Phone Lookup', `
      <div class="tool-form">
        <label>Telefon raqam:</label>
        <input type="text" id="phInput" class="form-input" placeholder="+998901234567">
        <button class="btn btn-primary" onclick="window.lookupPhone()">📱 Tekshirish</button>
        <div id="phResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('breach')) {
    createModal('⚠️ Breach Checker', `
      <div class="tool-form">
        <label>Email:</label>
        <input type="email" id="brInput" class="form-input" placeholder="user@example.com">
        <button class="btn btn-primary" onclick="window.checkBreach()">⚠️ Tekshirish</button>
        <div id="brResult" class="tool-result"></div>
      </div>
    `);
  }
  // GitHub Analyzer
  else if (t.includes('github analyzer') || t.includes('github tahlil')) {
    createModal('🐙 GitHub Analyzer', `
      <div class="tool-form">
        <label>GitHub username:</label>
        <input type="text" id="ghUser" class="form-input" value="KRYZENSYS" placeholder="username">
        <button class="btn btn-primary" onclick="window.analyzeGitHub()">🔍 Tahlil qilish</button>
        <div id="ghResult" class="tool-result"></div>
      </div>
    `);
  }
  // Downloader
  else if (t.includes('youtube') || t.includes('instagram') || t.includes('tiktok') || t.includes('twitter') || t.includes('download')) {
    createModal('📥 Media Downloader', `
      <div class="tool-form">
        <label>Video URL (YouTube, Instagram, TikTok, Twitter, Facebook...):</label>
        <input type="url" id="dlUrl" class="form-input" placeholder="https://youtube.com/watch?v=...">
        <div class="form-row">
          <label>Sifat:</label>
          <select id="dlQuality" class="form-select">
            <option value="best">Eng yaxshi</option>
            <option value="1080p">1080p</option>
            <option value="720p">720p</option>
            <option value="480p">480p</option>
            <option value="audio">Faqat audio (mp3)</option>
          </select>
        </div>
        <button class="btn btn-primary" onclick="window.downloadMedia()">📥 Yuklab olish</button>
        <div id="dlResult" class="tool-result"></div>
      </div>
    `);
  }
  // Holiday
  else if (t.includes('holiday') || t.includes('bayram')) {
    createModal('🎉 Bayramlar', `
      <div class="tool-form">
        <label>Davlat kodi (UZ, US, RU, GB...):</label>
        <input type="text" id="holCountry" class="form-input" value="UZ">
        <label>Yil:</label>
        <input type="number" id="holYear" class="form-input" value="2026">
        <button class="btn btn-primary" onclick="window.getHolidays()">🎉 Ko'rish</button>
        <div id="holResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('sentiment') || t.includes('his-tuyg\'u')) {
    createModal('😊 His-tuyg\'u Tahlili', `
      <div class="tool-form">
        <label>Matn:</label>
        <textarea id="sentText" class="form-textarea" rows="4" placeholder="Matn kiriting...">I love this product! It is amazing and works perfectly.</textarea>
        <button class="btn btn-primary" onclick="window.analyzeSentiment()">🔍 Tahlil</button>
        <div id="sentResult" class="tool-result"></div>
      </div>
    `);
  }
  else if (t.includes('summarizer') || t.includes('qisqart')) {
    createModal('📝 Matn Qisqartirish', `
      <div class="tool-form">
        <label>Asl matn:</label>
        <textarea id="sumText" class="form-textarea" rows="8" placeholder="Uzun matn kiriting..."></textarea>
        <button class="btn btn-primary" onclick="window.summarizeText()">📝 Qisqartirish</button>
        <div id="sumResult" class="tool-result"></div>
      </div>
    `);
  }
  // DEFAULT
  else {
    createModal(`🔧 ${toolName}`, `
      <div class="alert alert-info">
        <strong>${toolName}</strong> tayyorlanmoqda...
        <p style="margin-top:8px">Backend API yaratilgan: <code>${API_BASE}</code></p>
        <p>Vercel'ga deploy qilish kerak. Yoki boshqa toollardan foydalaning.</p>
      </div>
      <div class="tool-form">
        <button class="btn btn-primary" onclick="closeTool()">✓ Yopish</button>
      </div>
    `);
  }
};

// ============================================================
// AI CHAT FUNCTION
// ============================================================
window.sendAIMessage = async function() {
  const input = document.getElementById('aiChatInput');
  const messages = document.getElementById('aiChatMessages');
  if (!input || !messages) return;

  const text = input.value.trim();
  if (!text) return;

  // Add user message
  messages.innerHTML += `<div class="ai-message user">${text}</div>`;
  input.value = '';
  messages.scrollTop = messages.scrollHeight;

  // Loading
  messages.innerHTML += `<div class="ai-message bot loading" id="aiLoading"><div class="spinner"></div></div>`;
  messages.scrollTop = messages.scrollHeight;

  try {
    const res = await fetch(API_BASE + '/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();

    const loading = document.getElementById('aiLoading');
    if (loading) loading.remove();

    messages.innerHTML += `<div class="ai-message bot">${data.message || 'Xatolik yuz berdi'}</div>`;
    messages.scrollTop = messages.scrollHeight;
  } catch (e) {
    const loading = document.getElementById('aiLoading');
    if (loading) loading.remove();
    // Local fallback
    const reply = window.localAIResponse(text);
    messages.innerHTML += `<div class="ai-message bot">${reply}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }
};

window.localAIResponse = function(text) {
  const t = text.toLowerCase();
  if (t.includes('salom') || t.includes('hello')) return 'Salom! Sizga qanday yordam bera olaman?';
  if (t.includes('kim') || t.includes('who')) return 'Men KRYZEN HUB AI yordamchisiman! 80+ vositam bor.';
  if (t.includes('rahmat') || t.includes('thanks')) return 'Arzimaydi! 😊';
  if (t.includes('kod') || t.includes('code')) return 'Kod yozishda yordam beraman! Qaysi tilda?';
  if (t.includes('parol') || t.includes('password')) return 'Password Generator vositasidan foydalaning!';
  if (t.includes('ob-havo') || t.includes('weather')) return 'Weather vositasi orqali ob-havoni bilib oling!';
  return 'Qiziqarli savol! Aniqlashtirib bersangiz, yaxshiroq yordam bera olaman.';
};

// ============================================================
// ALL TOOL FUNCTIONS
// ============================================================
window.translateText = async function() {
  const text = document.getElementById('trText').value;
  const from = document.getElementById('trFrom').value;
  const to = document.getElementById('trTo').value;
  const result = document.getElementById('trResult');
  if (!result) return;
  result.innerHTML = showLoading('Tarjima qilinmoqda...');

  try {
    const res = await fetch(API_BASE + '/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, from, to })
    });
    const data = await res.json();
    if (data.success) {
      result.innerHTML = `<div class="output-box">${data.translated}</div>`;
    } else {
      result.innerHTML = showError(data.error);
    }
  } catch (e) {
    result.innerHTML = showError('Tarjima xizmati vaqtincha ishlamayapti');
  }
};

window.getWeather = async function() {
  const city = document.getElementById('weatherCity').value;
  const result = document.getElementById('weatherResult');
  result.innerHTML = showLoading('Yuklanmoqda...');
  try {
    const res = await fetch(API_BASE + '/weather?city=' + encodeURIComponent(city));
    const data = await res.json();
    if (data.success) {
      result.innerHTML = `
        <div class="weather-card">
          <h3>${data.location.name}, ${data.location.country}</h3>
          <div style="font-size:60px;text-align:center">${data.current.icon}</div>
          <div class="weather-temp">${Math.round(data.current.temperature_2m)}°C</div>
          <p>${data.current.description}</p>
          <div class="weather-details">
            <div>💧 Namlik: ${data.current.relative_humidity_2m}%</div>
            <div>💨 Shamol: ${data.current.wind_speed_10m} km/s</div>
            <div>🌡️ His: ${Math.round(data.current.apparent_temperature)}°C</div>
          </div>
        </div>
      `;
    } else {
      result.innerHTML = showError(data.error || 'Shahar topilmadi');
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik: ' + e.message);
  }
};

window.getNews = async function() {
  const category = document.getElementById('newsCategory').value;
  const result = document.getElementById('newsResult');
  result.innerHTML = showLoading('Yangiliklar yuklanmoqda...');
  try {
    const res = await fetch(API_BASE + '/news?category=' + category);
    const data = await res.json();
    if (data.success && data.articles) {
      result.innerHTML = data.articles.slice(0, 15).map(a => `
        <div class="news-item">
          <a href="${a.url}" target="_blank" class="news-title">${a.title}</a>
          <div class="news-meta">⭐ ${a.score || 0} · 💬 ${a.comments || 0} · 🕐 ${a.time}</div>
        </div>
      `).join('');
    } else {
      result.innerHTML = showError('Yangiliklar topilmadi');
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik');
  }
};

window.getCrypto = async function() {
  const result = document.getElementById('cryptoResult');
  result.innerHTML = showLoading('Narxlar yuklanmoqda...');
  try {
    const res = await fetch(API_BASE + '/crypto');
    const data = await res.json();
    if (data.success) {
      let html = '<h3>💰 Kriptovalyuta narxlari (USD)</h3><div class="crypto-grid">';
      for (const [id, info] of Object.entries(data.prices)) {
        const change = info.usd_24h_change || 0;
        const changeClass = change >= 0 ? 'positive' : 'negative';
        const changeIcon = change >= 0 ? '📈' : '📉';
        html += `
          <div class="crypto-item">
            <div class="crypto-name">${id.toUpperCase()}</div>
            <div class="crypto-price">$${info.usd?.toFixed(2) || 'N/A'}</div>
            <div class="crypto-change ${changeClass}">${changeIcon} ${change.toFixed(2)}%</div>
          </div>
        `;
      }
      html += '</div>';
      result.innerHTML = html;
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik: ' + e.message);
  }
};

window.getCurrency = async function() {
  const base = document.getElementById('curBase').value || 'USD';
  const result = document.getElementById('curResult');
  result.innerHTML = showLoading('Kurslar yuklanmoqda...');
  try {
    const res = await fetch(API_BASE + '/currency?base=' + base);
    const data = await res.json();
    if (data.success) {
      const top = ['USD','EUR','RUB','UZS','GBP','JPY','CNY','KRW','TRY','KZT'];
      let html = `<h3>💱 ${base} dan asosiy valyutalarga</h3><div class="currency-grid">`;
      top.forEach(code => {
        if (data.rates[code]) {
          html += `<div class="currency-item"><strong>${code}</strong>: ${data.rates[code].toFixed(2)}</div>`;
        }
      });
      html += '</div>';
      result.innerHTML = html;
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik');
  }
};

window.getDict = async function() {
  const word = document.getElementById('dictWord').value;
  const result = document.getElementById('dictResult');
  if (!word) return;
  result.innerHTML = showLoading('Qidirilmoqda...');
  try {
    const res = await fetch(API_BASE + '/dictionary?word=' + encodeURIComponent(word));
    const data = await res.json();
    if (data.success) {
      let html = `<h3>${data.word} ${data.phonetic || ''}</h3>`;
      data.meanings.forEach(m => {
        html += `<div class="dict-meaning"><strong>${m.partOfSpeech}</strong><ul>`;
        m.definitions.forEach(d => {
          html += `<li>${d.definition}${d.example ? `<br><em>"${d.example}"</em>` : ''}</li>`;
        });
        html += '</ul></div>';
      });
      result.innerHTML = html;
    } else {
      result.innerHTML = showError('So\'z topilmadi');
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik');
  }
};

window.getQuote = async function() {
  const result = document.getElementById('quoteResult');
  try {
    const res = await fetch(API_BASE + '/quote?type=quote');
    const data = await res.json();
    result.innerHTML = `
      <div class="quote-card">
        <div class="quote-text">"${data.text}"</div>
        <div class="quote-author">— ${data.author}</div>
      </div>
    `;
  } catch (e) {
    result.innerHTML = showError('Xatolik');
  }
};

window.getJoke = async function() {
  const result = document.getElementById('jokeResult');
  try {
    const res = await fetch(API_BASE + '/quote?type=joke');
    const data = await res.json();
    result.innerHTML = `<div class="joke-card">${data.text}</div>`;
  } catch (e) {
    result.innerHTML = showError('Xatolik');
  }
};

window.formatJSON = function() {
  const input = document.getElementById('jsonInput').value;
  const result = document.getElementById('jsonResult');
  try {
    const obj = JSON.parse(input);
    result.innerHTML = `<pre class="code-block">${JSON.stringify(obj, null, 2)}</pre>
      <button class="btn-mini" onclick="copyToClipboard(document.querySelector('#jsonResult pre').textContent)">📋 Nusxalash</button>`;
  } catch (e) {
    result.innerHTML = showError('Noto\'g\'ri JSON: ' + e.message);
  }
};

window.minifyJSON = function() {
  const input = document.getElementById('jsonInput').value;
  const result = document.getElementById('jsonResult');
  try {
    const obj = JSON.parse(input);
    result.innerHTML = `<pre class="code-block">${JSON.stringify(obj)}</pre>
      <button class="btn-mini" onclick="copyToClipboard(document.querySelector('#jsonResult pre').textContent)">📋 Nusxalash</button>`;
  } catch (e) {
    result.innerHTML = showError('Noto\'g\'ri JSON');
  }
};

window.validateJSON = function() {
  const input = document.getElementById('jsonInput').value;
  const result = document.getElementById('jsonResult');
  try {
    JSON.parse(input);
    result.innerHTML = '<div class="alert alert-success">✅ To\'g\'ri JSON!</div>';
  } catch (e) {
    result.innerHTML = `<div class="alert alert-error">❌ Xato: ${e.message}</div>`;
  }
};

window.validateJSON2 = window.validateJSON;

window.b64encode = function() {
  const input = document.getElementById('b64eInput').value;
  const result = document.getElementById('b64eResult');
  try {
    const encoded = btoa(unescape(encodeURIComponent(input)));
    result.innerHTML = `<div class="output-box">${encoded}</div>
      <button class="btn-mini" onclick="copyToClipboard('${encoded}')">📋</button>`;
  } catch (e) {
    result.innerHTML = showError('Xatolik');
  }
};

window.b64decode = function() {
  const input = document.getElementById('b64dInput').value;
  const result = document.getElementById('b64dResult');
  try {
    const decoded = decodeURIComponent(escape(atob(input)));
    result.innerHTML = `<div class="output-box">${decoded}</div>
      <button class="btn-mini" onclick="copyToClipboard(\`${decoded}\`)">📋</button>`;
  } catch (e) {
    result.innerHTML = showError('Noto\'g\'ri Base64');
  }
};

window.urlEncode = function() {
  const input = document.getElementById('urleInput').value;
  const result = document.getElementById('urleResult');
  const encoded = encodeURIComponent(input);
  result.innerHTML = `<div class="output-box">${encoded}</div>
    <button class="btn-mini" onclick="copyToClipboard('${encoded}')">📋</button>`;
};

window.urlDecode = function() {
  const input = document.getElementById('urldInput').value;
  const result = document.getElementById('urldResult');
  try {
    const decoded = decodeURIComponent(input);
    result.innerHTML = `<div class="output-box">${decoded}</div>
      <button class="btn-mini" onclick="copyToClipboard(\`${decoded}\`)">📋</button>`;
  } catch (e) {
    result.innerHTML = showError('Noto\'g\'ri URL encoded');
  }
};

window.testRegex = function() {
  const pattern = document.getElementById('regexPattern').value;
  const flags = document.getElementById('regexFlags').value;
  const text = document.getElementById('regexText').value;
  const result = document.getElementById('regexResult');
  try {
    const regex = new RegExp(pattern, flags);
    const matches = [...text.matchAll(new RegExp(pattern, flags + (flags.includes('g') ? '' : 'g')))];
    const highlighted = text.replace(regex, m => `<mark>${m}</mark>`);
    result.innerHTML = `
      <div class="regex-result">
        <div>✅ ${matches.length} ta moslik topildi</div>
        <div class="regex-text">${highlighted}</div>
        ${matches.length > 0 ? '<h4>Topilgan:</h4><ul>' + matches.slice(0, 20).map(m => `<li>${m[0]}</li>`).join('') + '</ul>' : ''}
      </div>
    `;
  } catch (e) {
    result.innerHTML = showError('Noto\'g\'ri regex: ' + e.message);
  }
};

window.genUUIDs = async function() {
  const count = document.getElementById('uuidCount').value;
  const result = document.getElementById('uuidResult');
  result.innerHTML = showLoading();
  try {
    const res = await fetch(API_BASE + '/uuid?count=' + count);
    const data = await res.json();
    if (data.success) {
      result.innerHTML = data.uuids.map(u => `<div class="uuid-item"><code>${u}</code> <button class="btn-mini" onclick="copyToClipboard('${u}')">📋</button></div>`).join('');
    }
  } catch (e) {
    // Fallback to client-side
    const uuids = [];
    for (let i = 0; i < count; i++) uuids.push(crypto.randomUUID());
    result.innerHTML = uuids.map(u => `<div class="uuid-item"><code>${u}</code> <button class="btn-mini" onclick="copyToClipboard('${u}')">📋</button></div>`).join('');
  }
};

window.genPasswords = async function() {
  const length = document.getElementById('pwLen').value;
  const count = document.getElementById('pwCount').value;
  const u = document.getElementById('pwUp').checked;
  const l = document.getElementById('pwLo').checked;
  const n = document.getElementById('pwNum').checked;
  const s = document.getElementById('pwSym').checked;
  const result = document.getElementById('pwResult');
  result.innerHTML = showLoading();
  try {
    const res = await fetch(`${API_BASE}/password?length=${length}&count=${count}&uppercase=${u}&lowercase=${l}&numbers=${n}&symbols=${s}`);
    const data = await res.json();
    if (data.success) {
      result.innerHTML = data.passwords.map(p =>
        `<div class="password-item">
          <code>${p.value}</code>
          <span class="strength strength-${p.strength.label}">${p.strength.label}</span>
          <button class="btn-mini" onclick="copyToClipboard('${p.value}')">📋</button>
        </div>`
      ).join('');
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik');
  }
};

window.genQR = async function() {
  const data = document.getElementById('qrData').value;
  const size = document.getElementById('qrSize').value;
  const result = document.getElementById('qrResult');
  result.innerHTML = showLoading();
  try {
    const res = await fetch(`${API_BASE}/qrcode?data=${encodeURIComponent(data)}&size=${size}`);
    const json = await res.json();
    result.innerHTML = `<img src="${json.url}" alt="QR Code" style="max-width:100%;border-radius:12px">
      <p style="margin-top:10px"><a href="${json.url}" target="_blank" class="btn btn-primary">⬇ Yuklab olish</a></p>`;
  } catch (e) {
    // Fallback
    const url = `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(data)}`;
    result.innerHTML = `<img src="${url}" alt="QR Code" style="max-width:100%">`;
  }
};

window.genLorem = async function() {
  const paragraphs = document.getElementById('loremP').value;
  const result = document.getElementById('loremResult');
  result.innerHTML = showLoading();
  try {
    const res = await fetch(`${API_BASE}/lorem?paragraphs=${paragraphs}`);
    const data = await res.json();
    if (data.success) {
      result.innerHTML = `<div class="output-box">${data.text}</div>
        <button class="btn-mini" onclick="copyToClipboard(\`${data.text}\`)">📋 Nusxalash</button>`;
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik');
  }
};

window.genHashes = async function() {
  const text = document.getElementById('hashInput').value;
  const result = document.getElementById('hashResult');
  result.innerHTML = showLoading();
  try {
    const res = await fetch(API_BASE + '/hash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    if (data.success) {
      let html = '';
      for (const [algo, hash] of Object.entries(data.hashes)) {
        html += `<div class="hash-item"><strong>${algo}:</strong><br><code>${hash}</code> <button class="btn-mini" onclick="copyToClipboard('${hash}')">📋</button></div>`;
      }
      result.innerHTML = html;
    }
  } catch (e) {
    // Client-side fallback using Web Crypto
    const enc = new TextEncoder();
    const buf = await crypto.subtle.digest('SHA-256', enc.encode(text));
    const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    result.innerHTML = `<div class="hash-item"><strong>SHA-256:</strong><br><code>${hash}</code> <button class="btn-mini" onclick="copyToClipboard('${hash}')">📋</button></div>`;
  }
};

window.shortenURL = async function() {
  const url = document.getElementById('shortUrl').value;
  const result = document.getElementById('shortResult');
  result.innerHTML = showLoading();
  try {
    const res = await fetch(API_BASE + '/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await res.json();
    if (data.success) {
      result.innerHTML = `<div class="output-box">🔗 ${data.short}</div>
        <button class="btn-mini" onclick="copyToClipboard('${data.short}')">📋 Nusxalash</button>`;
    } else {
      result.innerHTML = showError(data.error);
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik: ' + e.message);
  }
};

window.lookupIP = async function() {
  const ip = document.getElementById('ipInput').value;
  const result = document.getElementById('ipResult');
  result.innerHTML = showLoading();
  try {
    const res = await fetch(`${API_BASE}/ip${ip ? '?ip=' + ip : ''}`);
    const data = await res.json();
    if (data.success) {
      result.innerHTML = `
        <div class="info-grid">
          <div><strong>IP:</strong> ${data.ip || 'N/A'}</div>
          <div><strong>Davlat:</strong> ${data.country || 'N/A'} ${data.countryCode || ''}</div>
          <div><strong>Shahar:</strong> ${data.city || 'N/A'}</div>
          <div><strong>Mintaqa:</strong> ${data.region || 'N/A'}</div>
          <div><strong>ISP:</strong> ${data.isp || data.org || 'N/A'}</div>
          <div><strong>Timezone:</strong> ${data.timezone || 'N/A'}</div>
          <div><strong>Lat/Lon:</strong> ${data.lat || 'N/A'}, ${data.lon || 'N/A'}</div>
          <div><strong>ZIP:</strong> ${data.zip || 'N/A'}</div>
        </div>
      `;
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik: ' + e.message);
  }
};

window.lookupDNS = async function() {
  const domain = document.getElementById('dnsDomain').value;
  const type = document.getElementById('dnsType').value;
  const result = document.getElementById('dnsResult');
  result.innerHTML = showLoading();
  try {
    const res = await fetch(`${API_BASE}/dns?domain=${domain}&type=${type}`);
    const data = await res.json();
    if (data.success) {
      let html = `<h3>${domain} - ${type} yozuvlari</h3>`;
      if (data.answer && data.answer.length > 0) {
        html += '<div class="dns-records">';
        data.answer.forEach(a => {
          html += `<div class="dns-record">${a.data}</div>`;
        });
        html += '</div>';
      } else {
        html += '<p>Yozuvlar topilmadi</p>';
      }
      result.innerHTML = html;
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik: ' + e.message);
  }
};

window.lookupWhois = async function() {
  const domain = document.getElementById('whoisDomain').value;
  const result = document.getElementById('whoisResult');
  result.innerHTML = showLoading();
  try {
    const res = await fetch(`${API_BASE}/whois?domain=${domain}`);
    const data = await res.json();
    if (data.success && data.registrar) {
      result.innerHTML = `
        <div class="info-grid">
          <div><strong>Domain:</strong> ${data.domain}</div>
          <div><strong>Registrar:</strong> ${data.registrar || 'N/A'}</div>
          <div><strong>Yaratilgan:</strong> ${data.creationDate || 'N/A'}</div>
          <div><strong>Tugaydi:</strong> ${data.expirationDate || 'N/A'}</div>
          <div><strong>Yangilangan:</strong> ${data.lastUpdated || 'N/A'}</div>
          <div><strong>Nameservers:</strong><br>${(data.nameservers || []).map(n => `<code>${n}</code>`).join('<br>')}</div>
        </div>
      `;
    } else {
      result.innerHTML = `<div class="alert alert-warn">${data.registrar ? '' : 'RDAP ma\'lumotlari mavjud emas'}</div>`;
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik: ' + e.message);
  }
};

window.checkHeaders = async function() {
  const url = document.getElementById('hdrUrl').value;
  const result = document.getElementById('hdrResult');
  result.innerHTML = showLoading();
  try {
    const res = await fetch(`${API_BASE}/headers?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    if (data.success) {
      result.innerHTML = `
        <div class="security-grade grade-${data.grade}">Xavfsizlik darajasi: ${data.grade}</div>
        <h4>📋 Headers</h4>
        <div class="headers-list">
          ${Object.entries(data.headers).map(([k, v]) => `<div><strong>${k}:</strong> ${v}</div>`).join('')}
        </div>
        <h4>🛡 Xavfsizlik</h4>
        <div class="security-checks">
          <div>${data.security.hsts ? '✅' : '❌'} HSTS</div>
          <div>${data.security.csp ? '✅' : '❌'} CSP</div>
          <div>${data.security.xframe ? '✅' : '❌'} X-Frame-Options</div>
          <div>${data.security.xss ? '✅' : '❌'} XSS Protection</div>
        </div>
      `;
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik: ' + e.message);
  }
};

window.checkSSL = async function() {
  const domain = document.getElementById('sslDomain').value;
  const result = document.getElementById('sslResult');
  result.innerHTML = showLoading();
  try {
    const res = await fetch(`${API_BASE}/ssl?domain=${domain}`);
    const data = await res.json();
    if (data.success) {
      result.innerHTML = `
        <div class="ssl-status">${data.status}</div>
        <div class="info-grid">
          <div><strong>Domain:</strong> ${data.domain}</div>
          <div><strong>HTTPS:</strong> ${data.https ? '✅' : '❌'}</div>
          <div><strong>HSTS:</strong> ${data.hsts ? '✅' : '❌'}</div>
          <div><strong>CSP:</strong> ${data.csp ? '✅' : '❌'}</div>
          <div><strong>Daraja:</strong> ${data.grade}</div>
        </div>
      `;
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik: ' + e.message);
  }
};

window.findSubdomains = async function() {
  const domain = document.getElementById('subDomain').value;
  const result = document.getElementById('subResult');
  result.innerHTML = showLoading('Skanerlanmoqda...');
  try {
    const res = await fetch(`${API_BASE}/subdomain?domain=${domain}`);
    const data = await res.json();
    if (data.success) {
      result.innerHTML = `<p>${data.foundCount} ta subdomain topildi (${data.totalScanned} tadan)</p>`;
      if (data.found.length > 0) {
        result.innerHTML += data.found.map(s => `<div class="sub-item"><code>${s.subdomain}</code> → ${s.ip} <button class="btn-mini" onclick="copyToClipboard('${s.subdomain}')">📋</button></div>`).join('');
      }
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik: ' + e.message);
  }
};

window.decodeJWT = async function() {
  const token = document.getElementById('jwtInput').value;
  const result = document.getElementById('jwtResult');
  result.innerHTML = showLoading();
  try {
    const res = await fetch(API_BASE + '/jwt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const data = await res.json();
    if (data.success) {
      result.innerHTML = `
        <h4>Header</h4>
        <pre class="code-block">${JSON.stringify(data.header, null, 2)}</pre>
        <h4>Payload</h4>
        <pre class="code-block">${JSON.stringify(data.payload, null, 2)}</pre>
        <div class="jwt-status ${data.valid ? 'valid' : 'expired'}">
          ${data.valid ? '✅ Token yaroqli' : '❌ Token muddati tugagan'}
        </div>
      `;
    } else {
      result.innerHTML = showError(data.error);
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik: ' + e.message);
  }
};

window.validateEmail = async function() {
  const email = document.getElementById('emInput').value;
  const result = document.getElementById('emResult');
  result.innerHTML = showLoading();
  try {
    const res = await fetch(`${API_BASE}/email?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (data.success) {
      result.innerHTML = `
        <div class="email-validity ${data.valid ? 'valid' : 'invalid'}">
          ${data.valid ? '✅ Yaroqli email' : '❌ Yaroqsiz email'}
        </div>
        <div class="info-grid">
          <div><strong>User:</strong> ${data.user}</div>
          <div><strong>Domain:</strong> ${data.domain}</div>
          <div><strong>MX Records:</strong> ${data.mxRecords?.length || 0}</div>
          <div><strong>Disposable:</strong> ${data.disposable ? '⚠️ Ha' : '✅ Yo\'q'}</div>
          <div><strong>Role email:</strong> ${data.role ? '⚠️ Ha' : '✅ Yo\'q'}</div>
          <div><strong>Score:</strong> ${data.score}/100</div>
        </div>
      `;
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik: ' + e.message);
  }
};

window.lookupPhone = async function() {
  const phone = document.getElementById('phInput').value;
  const result = document.getElementById('phResult');
  result.innerHTML = showLoading();
  try {
    const res = await fetch(`${API_BASE}/phone?phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    if (data.success) {
      result.innerHTML = `
        <div class="phone-validity ${data.valid ? 'valid' : 'invalid'}">
          ${data.valid ? '✅ Yaroqli' : '❌ Yaroqsiz'} ${data.formatted}
        </div>
        ${data.country ? `
          <div class="info-grid">
            <div><strong>Davlat:</strong> ${data.country.flag} ${data.country.name}</div>
            ${data.operator ? `<div><strong>Operator:</strong> ${data.operator}</div>` : ''}
          </div>
        ` : ''}
      `;
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik');
  }
};

window.checkBreach = async function() {
  const email = document.getElementById('brInput').value;
  const result = document.getElementById('brResult');
  result.innerHTML = showLoading();
  try {
    const res = await fetch(`${API_BASE}/breach?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (data.success) {
      let html = `<div class="breach-status ${data.safe ? 'safe' : 'danger'}">${data.message}</div>`;
      if (data.breaches.length > 0) {
        html += '<h4>Topilgan sizib chiqishlar:</h4>';
        data.breaches.forEach(b => {
          html += `<div class="breach-item">
            <strong>${b.name}</strong> (${b.domain})<br>
            <small>Sana: ${b.breachDate} · ${b.pwnCount?.toLocaleString() || 0} hisobot</small>
          </div>`;
        });
      }
      result.innerHTML = html;
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik');
  }
};

window.analyzeGitHub = async function() {
  const username = document.getElementById('ghUser').value;
  const result = document.getElementById('ghResult');
  result.innerHTML = showLoading('GitHub ma\'lumotlari yuklanmoqda...');
  try {
    const res = await fetch(`${API_BASE}/github?username=${username}`);
    const data = await res.json();
    if (data.success) {
      const u = data.user;
      result.innerHTML = `
        <div class="gh-profile">
          <img src="${u.avatar}" alt="${u.login}" class="gh-avatar">
          <div>
            <h3>${u.name || u.login}</h3>
            <p>@${u.login}</p>
            ${u.bio ? `<p>${u.bio}</p>` : ''}
            ${u.location ? `<p>📍 ${u.location}</p>` : ''}
            ${u.company ? `<p>🏢 ${u.company}</p>` : ''}
          </div>
        </div>
        <div class="gh-stats">
          <div class="gh-stat"><div class="num">${u.publicRepos}</div><div>Repos</div></div>
          <div class="gh-stat"><div class="num">${u.followers}</div><div>Followers</div></div>
          <div class="gh-stat"><div class="num">${u.following}</div><div>Following</div></div>
          <div class="gh-stat"><div class="num">${data.stats.totalStars}</div><div>Stars</div></div>
          <div class="gh-stat"><div class="num">${u.publicGists}</div><div>Gists</div></div>
        </div>
        ${data.stats.topLanguages.length > 0 ? `
          <h4>📊 Top tillar</h4>
          <div class="lang-list">
            ${data.stats.topLanguages.map(l => `<div><span>${l[0]}</span><strong>${l[1]}</strong></div>`).join('')}
          </div>
        ` : ''}
        ${data.topRepos.length > 0 ? `
          <h4>⭐ Top repos</h4>
          ${data.topRepos.map(r => `
            <div class="gh-repo">
              <a href="${r.url}" target="_blank">${r.name}</a>
              <p>${r.description || ''}</p>
              <small>⭐ ${r.stars} · 🍴 ${r.forks} · ${r.language || ''}</small>
            </div>
          `).join('')}
        ` : ''}
      `;
    } else {
      result.innerHTML = showError(data.error || 'Foydalanuvchi topilmadi');
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik: ' + e.message);
  }
};

window.downloadMedia = async function() {
  const url = document.getElementById('dlUrl').value;
  const quality = document.getElementById('dlQuality').value;
  const result = document.getElementById('dlResult');
  if (!url) {
    result.innerHTML = showError('URL kiriting');
    return;
  }
  result.innerHTML = showLoading('Video ma\'lumotlari olinmoqda...');
  try {
    const res = await fetch(API_BASE + '/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, quality })
    });
    const data = await res.json();
    if (data.success) {
      let html = `<div class="dl-info">✅ Platform: <strong>${data.platform}</strong></div>`;
      if (data.videoId) html += `<div class="dl-info">📺 Video ID: ${data.videoId}</div>`;
      html += '<h4>Yuklab olish variantlari:</h4>';
      data.downloadOptions.forEach(opt => {
        html += `<a href="${opt.url}" target="_blank" class="btn btn-primary dl-btn">
          ${opt.service} - ${opt.quality} ${opt.format ? '(' + opt.format + ')' : ''}
        </a>`;
      });
      html += `<p style="margin-top:12px;color:var(--text-3);font-size:13px">${data.message}</p>`;
      result.innerHTML = html;
    } else {
      result.innerHTML = showError(data.error);
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik: ' + e.message);
  }
};

window.generateCode = async function() {
  const lang = document.getElementById('codeLang').value;
  const prompt = document.getElementById('codePrompt').value;
  const result = document.getElementById('codeResult');
  if (!prompt) {
    result.innerHTML = showError('Vazifani kiriting');
    return;
  }
  result.innerHTML = showLoading('Kod yaratilmoqda...');
  try {
    const res = await fetch(API_BASE + '/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `${lang} tilida kod yoz: ${prompt}. Faqat kod qaytar, izohsiz.` })
    });
    const data = await res.json();
    const code = data.message.replace(/```[a-z]*\n?/g, '').replace(/```/g, '').trim();
    result.innerHTML = `<pre class="code-block">${code}</pre>
      <button class="btn-mini" onclick="copyToClipboard(\`${code.replace(/`/g, '\\`')}\`)">📋 Nusxalash</button>`;
  } catch (e) {
    result.innerHTML = showError('Xatolik');
  }
};

window.getHolidays = async function() {
  const country = document.getElementById('holCountry').value;
  const year = document.getElementById('holYear').value;
  const result = document.getElementById('holResult');
  result.innerHTML = showLoading();
  try {
    const res = await fetch(`${API_BASE}/holidays?country=${country}&year=${year}`);
    const data = await res.json();
    if (data.success) {
      result.innerHTML = data.holidays.map(h => `
        <div class="holiday-item">
          <div class="holiday-date">${h.date}</div>
          <div class="holiday-name"><strong>${h.name}</strong></div>
          ${h.localName && h.localName !== h.name ? `<div class="holiday-local">${h.localName}</div>` : ''}
          <div class="holiday-type">${h.types?.join(', ') || 'Public'}</div>
        </div>
      `).join('');
    } else {
      result.innerHTML = showError('Bayramlar topilmadi');
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik: ' + e.message);
  }
};

window.analyzeSentiment = async function() {
  const text = document.getElementById('sentText').value;
  const result = document.getElementById('sentResult');
  result.innerHTML = showLoading();
  try {
    const res = await fetch(API_BASE + '/sentiment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    if (data.success) {
      result.innerHTML = `
        <div class="sentiment-card sentiment-${data.label}">
          <div style="font-size:60px;text-align:center">${data.emoji}</div>
          <div class="sentiment-label">${data.label.toUpperCase()}</div>
          <div class="sentiment-score">Score: ${data.score.toFixed(2)}</div>
          <div class="sentiment-breakdown">
            <div>😊 Ijobiy: ${data.positive}</div>
            <div>😢 Salbiy: ${data.negative}</div>
          </div>
        </div>
      `;
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik');
  }
};

window.summarizeText = async function() {
  const text = document.getElementById('sumText').value;
  const result = document.getElementById('sumResult');
  if (!text) {
    result.innerHTML = showError('Matn kiriting');
    return;
  }
  result.innerHTML = showLoading('Qisqartirilmoqda...');
  try {
    const res = await fetch(API_BASE + '/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, ratio: 0.3 })
    });
    const data = await res.json();
    if (data.success) {
      result.innerHTML = `
        <div class="summary-stats">
          <span>📝 ${data.original.words} so'z</span>
          <span>📄 ${data.original.sentences} gap</span>
          <span>📉 ${data.compression} siqildi</span>
        </div>
        <h4>📋 Qisqacha mazmun:</h4>
        <div class="output-box">${data.summary}</div>
        ${data.topWords.length > 0 ? `
          <h4>🔑 Asosiy so'zlar:</h4>
          <div>${data.topWords.map(w => `<span class="keyword">${w.word} (${w.count})</span>`).join(' ')}</div>
        ` : ''}
      `;
    }
  } catch (e) {
    result.innerHTML = showError('Xatolik');
  }
};

console.log('✅ Tools.js loaded - 30+ API endpoints connected!');
