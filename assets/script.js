/* ============================================================
   KRYZEN HUB - Professional JavaScript (Vanilla ES6+)
   ============================================================ */

(() => {
  'use strict';

  /* ============================================================
     1. UTILITIES
     ============================================================ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const create = (tag, props = {}, ...children) => {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => k === 'class' ? el.className = v : k === 'dataset' ? Object.assign(el.dataset, v) : el.setAttribute(k, v));
    children.forEach(c => typeof c === 'string' ? el.appendChild(document.createTextNode(c)) : c && el.appendChild(c));
    return el;
  };
  const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);
  const debounce = (fn, ms = 200) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const throttle = (fn, ms = 16) => { let last = 0; return (...a) => { const now = Date.now(); if (now - last >= ms) { last = now; fn(...a); } }; };
  const showToast = (msg, type = 'success') => {
    const t = $('#toast');
    if (!t) return;
    t.textContent = (type === 'success' ? '✅ ' : '⚠️ ') + msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3000);
  };

  /* ============================================================
     2. LOADER - INSTANT (no delay)
     ============================================================ */
  const initLoader = () => {
    const loader = $('#loader');
    if (!loader) return;
    // Darhol 100% ga yetkazib, 200ms ichida yashirish
    const bar = $('#loaderBar');
    const percent = $('#loaderPercent');
    if (bar) bar.style.width = '100%';
    if (percent) percent.textContent = '100%';
    setTimeout(() => loader.classList.add('hidden'), 250);
    setTimeout(() => loader.remove(), 800);
  };

  /* ============================================================
     3. CUSTOM CURSOR + MOUSE GLOW
     ============================================================ */
  const initCursor = () => {
    const dot = $('#cursorDot');
    const ring = $('#cursorRing');
    const glow = $('#mouseGlow');
    if (!dot || !ring) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    let mx = 0, my = 0, rx = 0, ry = 0;
    on(document, 'mousemove', e => { mx = e.clientX; my = e.clientY; if (glow) glow.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`; });
    const animate = () => { rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`; ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`; requestAnimationFrame(animate); };
    animate();
    on(document, 'mouseover', e => { if (e.target.closest('button, a, .card, .glass-card, .filter-btn, .icon-btn, input, textarea')) document.body.classList.add('cursor-hover'); });
    on(document, 'mouseout', e => { if (!e.relatedTarget || !e.relatedTarget.closest('button, a, .card, .glass-card, .filter-btn, .icon-btn, input, textarea')) document.body.classList.remove('cursor-hover'); });
  };

  /* ============================================================
     4. MATRIX RAIN
     ============================================================ */
  const initMatrix = () => {
    const canvas = $('#matrixCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const fontSize = 16;
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789KRYZEN';
    let cols, drops;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; cols = Math.floor(canvas.width / fontSize); drops = Array(cols).fill(0); };
    resize();
    on(window, 'resize', resize);
    const draw = () => {
      ctx.fillStyle = 'rgba(10,10,15,0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#8B5CF6';
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#8B5CF6' : '#EC4899';
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    setInterval(draw, 60);
  };

  /* ============================================================
     5. PARTICLES
     ============================================================ */
  const initParticles = () => {
    const canvas = $('#particlesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const count = window.innerWidth < 768 ? 30 : 60;
    const particles = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    on(window, 'resize', resize);
    for (let i = 0; i < count; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, r: Math.random() * 2 + 1, color: ['#8B5CF6','#EC4899','#06B6D4'][Math.floor(Math.random() * 3)] });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.fillStyle = p.color; ctx.shadowBlur = 10; ctx.shadowColor = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.shadowBlur = 0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (d < 120) { ctx.strokeStyle = `rgba(139,92,246,${0.2 - d / 600})`; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke(); }
        }
      }
      requestAnimationFrame(draw);
    };
    draw();
  };

  /* ============================================================
     6. NAVBAR (sticky + scroll)
     ============================================================ */
  const initNavbar = () => {
    const nav = $('#navbar');
    on(window, 'scroll', throttle(() => { nav.classList.toggle('scrolled', window.scrollY > 50); }, 100));
    const links = $$('.nav-link');
    const sections = links.map(l => $(l.getAttribute('href')));
    on(window, 'scroll', throttle(() => {
      const y = window.scrollY + 100;
      let active = 0;
      sections.forEach((s, i) => { if (s && s.offsetTop <= y) active = i; });
      links.forEach((l, i) => l.classList.toggle('active', i === active));
    }, 100));
    on($('#hamburger'), 'click', () => {
      const menu = $('#navMenu');
      const open = menu.classList.toggle('active');
      $('#hamburger').setAttribute('aria-expanded', open);
      $('#hamburger').textContent = open ? '✕' : '☰';
    });
    on(document, 'click', e => { if (!e.target.closest('.navbar') && !e.target.closest('.nav-menu')) { $('#navMenu')?.classList.remove('active'); $('#hamburger').textContent = '☰'; } });
    links.forEach(l => on(l, 'click', () => { $('#navMenu')?.classList.remove('active'); $('#hamburger').textContent = '☰'; }));
  };

  /* ============================================================
     7. SCROLL PROGRESS + BACK TO TOP
     ============================================================ */
  const initScrollUI = () => {
    const bar = $('#scrollProgress');
    const top = $('#backToTop');
    on(window, 'scroll', throttle(() => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (window.scrollY / h) * 100 + '%';
      top.classList.toggle('visible', window.scrollY > 400);
    }, 16));
    on(top, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  /* ============================================================
     8. THEME
     ============================================================ */
  const initTheme = () => {
    const btn = $('#themeBtn');
    const saved = localStorage.getItem('kh-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    btn.textContent = saved === 'dark' ? '☀️' : '🌙';
    on(btn, 'click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      btn.textContent = next === 'dark' ? '☀️' : '🌙';
      localStorage.setItem('kh-theme', next);
      showToast(next === 'light' ? 'Light mode yoqildi' : 'Dark mode yoqildi');
    });
  };

  /* ============================================================
     9. SEARCH & COMMAND PALETTE
     ============================================================ */
  const allItems = () => $$('.card, .portfolio-card, .nav-link, .filter-btn').map(el => ({ el, text: el.textContent.trim() }));
  const openModal = (id) => { const m = $(id); m?.classList.add('active'); m?.setAttribute('aria-hidden', 'false'); setTimeout(() => $('#' + id + ' input')?.focus(), 50); };
  const closeModal = (id) => { const m = $(id); m?.classList.remove('active'); m?.setAttribute('aria-hidden', 'true'); };
  const initSearch = () => {
    on($('#searchBtn'), 'click', () => { openModal('searchModal'); renderSearch(''); });
    on($('#searchInput'), 'input', e => renderSearch(e.target.value));
    on($('#searchInput'), 'keydown', e => { if (e.key === 'Escape') closeModal('searchModal'); });
    $$('.modal').forEach(m => on(m, 'click', e => { if (e.target === m) closeModal('#' + m.id); }));
  };
  const renderSearch = (q) => {
    const res = $('#searchResults');
    if (!res) return;
    const ql = q.toLowerCase();
    const items = allItems().filter(i => !ql || i.text.toLowerCase().includes(ql)).slice(0, 20);
    res.innerHTML = '';
    if (!items.length) { res.innerHTML = '<div class="search-item">Hech narsa topilmadi</div>'; return; }
    items.forEach(({ el, text }) => {
      const item = create('div', { class: 'search-item' }, `🔍 ${text.slice(0, 60)}`);
      on(item, 'click', () => { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); closeModal('searchModal'); $('#searchInput').value = ''; });
      res.appendChild(item);
    });
  };
  const initCommand = () => {
    on(document, 'keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openModal('searchModal'); renderSearch(''); }
      if ((e.ctrlKey || e.metaKey) && e.key === '/') { e.preventDefault(); openModal('commandPalette'); }
      if (e.key === 'Escape') { closeModal('searchModal'); closeModal('commandPalette'); }
    });
  };

  /* ============================================================
     10. PROFILE MENU
     ============================================================ */
  const initProfile = () => {
    const btn = $('#profileBtn');
    const menu = $('#profileMenu');
    on(btn, 'click', e => { e.stopPropagation(); menu.classList.toggle('active'); });
    on(document, 'click', e => { if (!e.target.closest('.profile-menu') && !e.target.closest('#profileBtn')) menu.classList.remove('active'); });
  };

  /* ============================================================
     11. SETTINGS
     ============================================================ */
  const initSettings = () => {
    const btn = $('#settingsBtn');
    const panel = $('#settingsPanel');
    on(btn, 'click', () => panel.classList.toggle('active'));
    on(document, 'click', e => { if (!e.target.closest('.settings-panel') && !e.target.closest('.settings-btn')) panel.classList.remove('active'); });
    const accent = localStorage.getItem('kh-accent') || '#8B5CF6';
    document.documentElement.style.setProperty('--primary', accent);
    $$('.color-dot').forEach(d => on(d, 'click', () => {
      const c = d.dataset.color;
      document.documentElement.style.setProperty('--primary', c);
      localStorage.setItem('kh-accent', c);
      $$('.color-dot').forEach(x => x.classList.remove('active'));
      d.classList.add('active');
      showToast('Accent color o\'zgartirildi');
    }));
    let perf = false;
    on($('#perfModeBtn'), 'click', () => {
      perf = !perf; document.body.classList.toggle('perf-mode', perf);
      $('#perfModeBtn').textContent = perf ? 'O\'chirish' : 'Yoqish';
      showToast(perf ? 'Performance mode yoqildi' : 'Performance mode o\'chirildi');
    });
    let a11y = false;
    on($('#a11yModeBtn'), 'click', () => {
      a11y = !a11y; document.body.classList.toggle('a11y-mode', a11y);
      $('#a11yModeBtn').textContent = a11y ? 'O\'chirish' : 'Yoqish';
    });
  };

  /* ============================================================
     12. DATA
     ============================================================ */
  const aiTools = [
    { icon: '💬', name: 'AI Chat', desc: 'Tabiiy tilda muloqot', tag: 'chat' },
    { icon: '👨‍💻', name: 'Kod yozuvchi AI', desc: 'Har qanday tilda kod yozadi', tag: 'code' },
    { icon: '🔍', name: 'Kod tushuntiruvchi', desc: 'Kodni tushuntirib beradi', tag: 'code' },
    { icon: '🐛', name: 'Xatolarni topuvchi', desc: 'Koddagi xatolarni aniqlaydi', tag: 'code' },
    { icon: '✨', name: 'Prompt Generator', desc: 'Ideal promptlar yaratadi', tag: 'prompt' },
    { icon: '🌐', name: 'Tarjimon', desc: '100+ tilga tarjima', tag: 'translate' },
    { icon: '📝', name: 'Matn qisqartiruvchi', desc: 'Matnni qisqartiradi', tag: 'text' },
    { icon: '✅', name: 'Grammar Checker', desc: 'Grammatik xatolarni tuzatadi', tag: 'text' },
    { icon: '🎨', name: 'Rasm Prompt', desc: 'Rasm uchun prompt yaratadi', tag: 'image' },
    { icon: '🎙️', name: 'Voice AI', desc: 'Ovozli yordamchi', tag: 'voice' },
    { icon: '🚀', name: 'Kelajak AI', desc: 'Yangi AI vositalari', tag: 'future' },
  ];
  const devTools = [
    { icon: '{}', name: 'JSON Formatter', desc: 'JSON chiroyli qilish', tag: 'format', cat: 'format' },
    { icon: '✓', name: 'JSON Validator', desc: 'JSON tekshirish', tag: 'format', cat: 'format' },
    { icon: 'B64', name: 'Base64 Encode', desc: 'Base64 kodlash', tag: 'encode', cat: 'converter' },
    { icon: 'B64', name: 'Base64 Decode', desc: 'Base64 dekodlash', tag: 'decode', cat: 'converter' },
    { icon: 'URL', name: 'URL Encode', desc: 'URL kodlash', tag: 'encode', cat: 'format' },
    { icon: 'URL', name: 'URL Decode', desc: 'URL dekodlash', tag: 'decode', cat: 'format' },
    { icon: '.*', name: 'Regex Tester', desc: 'Regex sinash', tag: 'regex', cat: 'format' },
    { icon: '🔑', name: 'UUID Generator', desc: 'UUID yaratish', tag: 'generator', cat: 'generator' },
    { icon: '🔐', name: 'Password Generator', desc: 'Kuchli parollar', tag: 'security', cat: 'security' },
    { icon: 'QR', name: 'QR Code', desc: 'QR kod yaratish', tag: 'generator', cat: 'generator' },
    { icon: '🎨', name: 'Color Picker', desc: 'Rang tanlash', tag: 'design', cat: 'generator' },
    { icon: '🌈', name: 'Gradient Generator', desc: 'Gradient yaratish', tag: 'design', cat: 'generator' },
    { icon: 'CSS', name: 'CSS Generator', desc: 'CSS kod generator', tag: 'css', cat: 'generator' },
    { icon: '</>', name: 'HTML Beautifier', desc: 'HTML chiroyli qilish', tag: 'format', cat: 'format' },
    { icon: 'JS', name: 'JS Minifier', desc: 'JS kichraytirish', tag: 'minify', cat: 'format' },
    { icon: 'MD', name: 'Markdown Preview', desc: 'MD ko\'rish', tag: 'preview', cat: 'format' },
    { icon: '⏰', name: 'Timestamp Converter', desc: 'Vaqt konvertatsiya', tag: 'time', cat: 'converter' },
    { icon: '📄', name: 'Lorem Ipsum', desc: 'Matn generator', tag: 'generator', cat: 'generator' },
    { icon: '🎲', name: 'Random Data', desc: 'Tasodifiy ma\'lumot', tag: 'generator', cat: 'generator' },
  ];
  const cyberTools = [
    { icon: '🌐', name: 'IP Lookup', desc: 'IP manzil ma\'lumotlari', tag: 'network' },
    { icon: '📡', name: 'DNS Lookup', desc: 'DNS yozuvlarini ko\'rish', tag: 'network' },
    { icon: '🔍', name: 'WHOIS Lookup', desc: 'Domen egasi ma\'lumotlari', tag: 'domain' },
    { icon: '📋', name: 'HTTP Headers', desc: 'HTTP sarlavhalar tahlili', tag: 'http' },
    { icon: '🔒', name: 'SSL Checker', desc: 'SSL sertifikat tekshirish', tag: 'ssl' },
    { icon: '🚪', name: 'Port Scanner', desc: 'Ochiq portlarni topish', tag: 'scan' },
    { icon: '#', name: 'Hash Generator', desc: 'MD5, SHA1, SHA256', tag: 'hash' },
    { icon: '✓', name: 'Hash Checker', desc: 'Hashni tekshirish', tag: 'hash' },
    { icon: 'JWT', name: 'JWT Decoder', desc: 'JWT token tahlili', tag: 'auth' },
    { icon: '🖥️', name: 'User-Agent', desc: 'Brauzer ma\'lumotlari', tag: 'browser' },
    { icon: '🔑', name: 'Password Strength', desc: 'Parol kuchliligi', tag: 'security' },
    { icon: '🌐', name: 'Subdomain Finder', desc: 'Subdomainlarni topish', tag: 'domain' },
    { icon: '📊', name: 'HTTP Status', desc: 'Status kod tekshirish', tag: 'http' },
    { icon: '📰', name: 'Cyber News', desc: 'Kiberxavfsizlik yangiliklari', tag: 'news' },
    { icon: '💡', name: 'Security Tips', desc: 'Xavfsizlik maslahatlari', tag: 'tips' },
  ];
  const osintTools = [
    { icon: '👤', name: 'Username Search', desc: 'Username bo\'yicha qidirish', tag: 'username' },
    { icon: '📧', name: 'Email Lookup', desc: 'Email manzil tekshirish', tag: 'email' },
    { icon: '📱', name: 'Phone Lookup', desc: 'Telefon raqam tekshirish', tag: 'phone' },
    { icon: '🌐', name: 'Domain Lookup', desc: 'Domen ma\'lumotlari', tag: 'domain' },
    { icon: '🖼️', name: 'Metadata Viewer', desc: 'Fayl metadata ko\'rish', tag: 'meta' },
    { icon: '📷', name: 'EXIF Viewer', desc: 'Rasm EXIF ma\'lumotlari', tag: 'exif' },
    { icon: '📱', name: 'Social Finder', desc: 'Ijtimoiy tarmoqlarda topish', tag: 'social' },
    { icon: '📰', name: 'Public Info', desc: 'Ochiq ma\'lumotlar', tag: 'public' },
    { icon: '⚠️', name: 'Breach Checker', desc: 'Sizib chiqish tekshirish', tag: 'breach' },
  ];
  const downloaderTools = [
    { icon: '▶️', name: 'YouTube', desc: 'Video va audio yuklash', tag: 'video' },
    { icon: '📷', name: 'Instagram', desc: 'Reels, post, story', tag: 'image' },
    { icon: '🎵', name: 'TikTok', desc: 'Video yuklash', tag: 'video' },
    { icon: '👥', name: 'Facebook', desc: 'Video yuklash', tag: 'video' },
    { icon: '🐦', name: 'X (Twitter)', desc: 'Video yuklash', tag: 'video' },
    { icon: '🔴', name: 'Reddit', desc: 'Video yuklash', tag: 'video' },
    { icon: '📌', name: 'Pinterest', desc: 'Rasm yuklash', tag: 'image' },
    { icon: '💬', name: 'Threads', desc: 'Video yuklash', tag: 'video' },
    { icon: '✈️', name: 'Telegram Media', desc: 'Media yuklash', tag: 'media' },
    { icon: '🎵', name: 'Audio Downloader', desc: 'MP3 yuklash', tag: 'audio' },
    { icon: '📂', name: 'Playlist', desc: 'Playlist yuklash', tag: 'playlist' },
  ];
  const telegramTools = [
    { icon: '🤖', name: 'Bot Generator', desc: 'Bot yaratish', tag: 'create' },
    { icon: '📋', name: 'Bot Templates', desc: 'Tayyor shablonlar', tag: 'template' },
    { icon: '@', name: 'Username Checker', desc: 'Username mavjudligini tekshirish', tag: 'check' },
    { icon: '🌐', name: 'Telegram WebApp', desc: 'Web App yaratish', tag: 'webapp' },
    { icon: '🔗', name: 'Deep Link', desc: 'Deep link yaratish', tag: 'link' },
    { icon: '🪝', name: 'Webhook Tester', desc: 'Webhook sinash', tag: 'webhook' },
    { icon: '📢', name: 'Channel Toolkit', desc: 'Kanal uchun vositalar', tag: 'channel' },
    { icon: '✉️', name: 'Message Formatter', desc: 'Xabar formatlash', tag: 'format' },
  ];
  const filesTools = [
    { icon: '📄', name: 'PDF Merge', desc: 'PDFlarni birlashtirish', tag: 'pdf' },
    { icon: '✂️', name: 'PDF Split', desc: 'PDFni bo\'lish', tag: 'pdf' },
    { icon: '👁️', name: 'OCR', desc: 'Rasmdan matn olish', tag: 'ocr' },
    { icon: '🗜️', name: 'ZIP Creator', desc: 'ZIP arxiv yaratish', tag: 'archive' },
    { icon: '📦', name: 'Image Compressor', desc: 'Rasm siqish', tag: 'image' },
    { icon: '🔄', name: 'Image Converter', desc: 'Format konvertatsiya', tag: 'image' },
    { icon: '⚖️', name: 'Text Compare', desc: 'Matnlarni solishtirish', tag: 'text' },
    { icon: '#️⃣', name: 'File Hash', desc: 'Fayl hash hisoblash', tag: 'hash' },
  ];
  const projects = [
    { title: '00o.uz', icon: '🚀', desc: 'AI Startup Hub. Next.js, FastAPI, AI, 3 tilda.', tags: ['Next.js','FastAPI','AI'], cat: 'web', url: 'https://github.com/KRYZENSYS/00o-uz' },
    { title: 'KRYZENVERSE', icon: '🌌', desc: 'Mega-ekosistema. 14+ modul.', tags: ['Next.js','TS','AI'], cat: 'web', url: 'https://github.com/KRYZENSYS/kryzenverse' },
    { title: 'Anonymous Match', icon: '💘', desc: 'Telegram dating platform. Next.js 15, FastAPI, PostgreSQL.', tags: ['Next.js','Python','WS'], cat: 'web', url: 'https://github.com/KRYZENSYS/anonymous-match' },
    { title: 'Firdavs Play', icon: '🎮', desc: '13 o\'yinli Telegram gaming platform.', tags: ['Python','FastAPI','Game'], cat: 'web', url: 'https://github.com/KRYZENSYS/firdavs-play' },
    { title: 'CyberUz Academy', icon: '🛡️', desc: 'Bepul kiberxavfsizlik o\'rganish platformasi.', tags: ['TypeScript','EdTech'], cat: 'cyber', url: 'https://github.com/KRYZENSYS/cyberuz-academy' },
    { title: 'EduVerse', icon: '🎓', desc: 'Ta\'lim platformasi.', tags: ['TypeScript','Next.js'], cat: 'web', url: 'https://github.com/KRYZENSYS/EduVerse' },
    { title: 'VIP Portfolio', icon: '💎', desc: 'Cyberpunk portfolio. Next.js 15, Framer Motion, Three.js.', tags: ['Next.js','Motion','3D'], cat: 'web', url: 'https://github.com/KRYZENSYS/firdavs-vip-portfolio' },
    { title: 'AI Assistant', icon: '🤖', desc: 'Android AI assistant (Kotlin).', tags: ['Kotlin','Android','AI'], cat: 'ai', url: 'https://github.com/KRYZENSYS/Ai-Assistent-' },
    { title: 'Car Scanner', icon: '🚗', desc: 'Android car scanning app (Kotlin).', tags: ['Kotlin','Android','AI'], cat: 'mobile', url: 'https://github.com/KRYZENSYS/Car-scanning-' },
    { title: 'Blockverse', icon: '🔗', desc: 'Blockchain platform.', tags: ['HTML','Web3'], cat: 'web', url: 'https://github.com/KRYZENSYS/blockverse' },
    { title: 'KRYZEN SMM', icon: '📊', desc: 'Professional SMM platform.', tags: ['Web','Marketing'], cat: 'web', url: 'https://github.com/KRYZENSYS/-KRYZEN-SMM-Panel-' },
    { title: 'Cyber Portfolio', icon: '🕶️', desc: 'Terminal-style hacker portfolio.', tags: ['JavaScript','Cyber'], cat: 'cyber', url: 'https://github.com/KRYZENSYS/cyber-dev-portfolio' },
  ];

  /* ============================================================
     13. RENDER CARDS
     ============================================================ */
  const renderCard = (item) => create('div', { class: 'card' },
    create('div', { class: 'card-icon' }, item.icon),
    create('div', { class: 'card-title' }, item.name),
    create('div', { class: 'card-desc' }, item.desc),
    item.tag ? create('div', { class: 'card-tag' }, '#' + item.tag) : null
  );
  const renderCards = (id, data) => {
    const c = $(id);
    if (!c) return;
    c.innerHTML = '';
    data.forEach((it, i) => { const card = renderCard(it); card.style.animationDelay = (i * 0.04) + 's'; c.appendChild(card); });
  };
  const renderPortfolio = () => {
    const c = $('#portfolioCards');
    if (!c) return;
    c.innerHTML = '';
    projects.forEach((p, i) => {
      const card = create('div', { class: 'glass-card portfolio-card', dataset: { cat: p.cat } },
        create('div', { class: 'portfolio-img' }, p.icon),
        create('div', { class: 'portfolio-body' },
          create('div', { class: 'portfolio-title' }, p.title),
          create('div', { class: 'portfolio-desc' }, p.desc),
          create('div', { class: 'portfolio-tags' }, ...p.tags.map(t => create('span', { class: 'portfolio-tag' }, t))),
          create('div', { class: 'portfolio-links' },
            create('a', { class: 'portfolio-link', href: p.url, target: '_blank', rel: 'noopener' }, 'GitHub'),
            create('a', { class: 'portfolio-link', href: '#', onclick: e => { e.preventDefault(); showToast('Demo tez orada!'); } }, 'Demo')
          )
        )
      );
      card.style.animationDelay = (i * 0.05) + 's';
      c.appendChild(card);
    });
  };

  /* ============================================================
     14. FILTERS
     ============================================================ */
  const initFilters = () => {
    const setup = (filterId, cardsId, attr) => {
      const f = $(filterId);
      if (!f) return;
      on(f, 'click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        f.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const v = btn.dataset.filter;
        $$(cardsId + ' > *').forEach(c => { c.style.display = (v === 'all' || c.dataset[attr] === v) ? '' : 'none'; });
      });
    };
    setup('#devFilter', '#devCards', 'cat');
    setup('#portfolioFilter', '#portfolioCards', 'cat');
  };

  /* ============================================================
     15. STATS COUNTER
     ============================================================ */
  const initCounters = () => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.target;
        const dur = 1500;
        const start = performance.now();
        const tick = (now) => { const p = Math.min((now - start) / dur, 1); el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    $$('.stat-num').forEach(el => obs.observe(el));
  };

  /* ============================================================
     16. GITHUB ANALYZER
     ============================================================ */
  const initGitHub = () => {
    const btn = $('#githubAnalyzeBtn');
    if (!btn) return;
    on(btn, 'click', async () => {
      const user = $('#githubInput').value.trim();
      const res = $('#githubResult');
      if (!user) return;
      res.innerHTML = '<p style="text-align:center;color:var(--text-3);">⏳ Yuklanmoqda...</p>';
      try {
        const r = await fetch(`https://api.github.com/users/${user}`);
        if (!r.ok) throw new Error('Not found');
        const d = await r.json();
        res.innerHTML = '';
        res.appendChild(create('div', { class: 'gh-profile' },
          create('img', { class: 'gh-avatar', src: d.avatar_url, alt: d.login }),
          create('div', {},
            create('h3', {}, d.name || d.login),
            create('p', { style: 'color:var(--text-2);font-size:13px;' }, d.bio || 'No bio'),
            create('a', { href: d.html_url, target: '_blank', rel: 'noopener', style: 'color:var(--primary);font-size:13px;' }, '🔗 Profile')
          )
        ));
        const stats = create('div', { class: 'gh-stats' });
        [{ n: d.public_repos, l: 'Repos' }, { n: d.followers, l: 'Followers' }, { n: d.following, l: 'Following' }, { n: d.public_gists, l: 'Gists' }].forEach(s => {
          stats.appendChild(create('div', { class: 'gh-stat' }, create('div', { class: 'gh-stat-num' }, s.n), create('div', { class: 'gh-stat-label' }, s.l)));
        });
        res.appendChild(stats);
        showToast('GitHub tahlili tayyor!');
      } catch (err) {
        res.innerHTML = '<p style="text-align:center;color:var(--danger);">❌ Foydalanuvchi topilmadi</p>';
        showToast('Xatolik yuz berdi', 'error');
      }
    });
  };

  /* ============================================================
     17. DASHBOARD ANIMATIONS
     ============================================================ */
  const initDashboard = () => {
    setTimeout(() => {
      const cnt = $('#aiCount');
      if (cnt) { let n = 0; const t = setInterval(() => { n++; cnt.textContent = n; if (n >= 1247) clearInterval(t); }, 2); }
      const chart = $('#aiChart');
      if (chart) for (let i = 0; i < 12; i++) { const b = create('div'); b.style.height = (Math.random() * 100) + '%'; chart.appendChild(b); }
      const notif = $('#notifList');
      if (notif) ['🚀 Yangi modul qo\'shildi','💬 5 ta yangi xabar','🔔 Tizim yangilandi','⭐ 10 ta yangi yulduz'].forEach(t => notif.appendChild(create('li', {}, t)));
      const feed = $('#activityFeed');
      if (feed) ['GitHub: commit','AI: chat','Cyber: scan','OSINT: lookup'].forEach(t => feed.appendChild(create('div', {}, '• ' + t)));
      const circle = $('#circleProgress');
      if (circle) setTimeout(() => { circle.style.strokeDashoffset = 251 * (1 - 0.85); }, 500);
    }, 800);
  };

  /* ============================================================
     18. FOOTER TIME
     ============================================================ */
  const initFooterTime = () => {
    const t = $('#footerTime');
    const tick = () => { if (t) t.textContent = '⏱ ' + new Date().toLocaleTimeString('uz-UZ'); };
    tick(); setInterval(tick, 1000);
  };

  /* ============================================================
     19. TYPING EFFECT - INSTANT (no delay)
     ============================================================ */
  const initTyping = () => {
    const el = $('#typingText');
    if (!el) return;
    el.textContent = 'KRYZEN HUB'; // Darhol yozilgan bo'ladi
  };

  /* ============================================================
     20. SMOOTH SCROLL FOR HASH
     ============================================================ */
  const initSmoothScroll = () => {
    on(document, 'click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const t = $(href);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.offsetTop - 70, behavior: 'smooth' });
    });
    on(document, 'click', e => {
      const b = e.target.closest('[data-section]');
      if (!b) return;
      const t = $('#' + b.dataset.section);
      if (t) window.scrollTo({ top: t.offsetTop - 70, behavior: 'smooth' });
    });
  };

  /* ============================================================
     21. CONTACT FORM
     ============================================================ */
  const initContact = () => {
    on($('#contactForm'), 'submit', e => {
      e.preventDefault();
      showToast('Xabaringiz yuborildi! Tez orada javob beramiz.');
      e.target.reset();
    });
    on($('#newsletterForm'), 'submit', e => {
      e.preventDefault();
      showToast('Newsletterga obuna bo\'ldingiz!');
      e.target.reset();
    });
  };

  /* ============================================================
     22. INIT - DARHOL ISHGA TUSHADI
     ============================================================ */
  const init = () => {
    initLoader();
    initCursor();
    initMatrix();
    initParticles();
    initNavbar();
    initScrollUI();
    initTheme();
    initSearch();
    initCommand();
    initProfile();
    initSettings();
    renderCards('#aiCards', aiTools);
    renderCards('#devCards', devTools);
    renderCards('#cyberCards', cyberTools);
    renderCards('#osintCards', osintTools);
    renderCards('#downloaderCards', downloaderTools);
    renderCards('#telegramCards', telegramTools);
    renderCards('#filesCards', filesTools);
    renderPortfolio();
    initFilters();
    initCounters();
    initGitHub();
    initDashboard();
    initFooterTime();
    initTyping();
    initSmoothScroll();
    initContact();
  };

  // DOM tayyor bo'lganda yoki darhol ishga tushirish
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
