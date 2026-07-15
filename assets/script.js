/* ============================================================
   KRYZEN HUB - Main Script (FIXED - Cards Clickable)
   ============================================================ */
(() => {
  'use strict';

  // ============================================================
  // DATA - 80+ tools across 11 sections
  // ============================================================
  const data = {
    ai: [
      { icon: '💬', title: 'AI Chat', desc: 'Tabiiy tilda muloqot', tag: 'CHAT', color: '#8B5CF6' },
      { icon: '👨‍💻', title: 'Kod yozuvchi AI', desc: '8 tilda kod generatsiya', tag: 'CODE', color: '#EC4899' },
      { icon: '🔍', title: 'Kod tushuntiruvchi', desc: 'Kodni oddiy tilda tushuntiradi', tag: 'EXPLAIN', color: '#06B6D4' },
      { icon: '🐛', title: 'Xatolarni topuvchi', desc: 'Kod xatolarini aniqlaydi', tag: 'DEBUG', color: '#10B981' },
      { icon: '✨', title: 'Prompt Generator', desc: 'AI uchun prompt yaratadi', tag: 'PROMPT', color: '#F59E0B' },
      { icon: '🌐', title: 'Tarjimon', desc: '11 tilga tarjima', tag: 'TRANSLATE', color: '#EF4444' },
      { icon: '📝', title: 'Matn qisqartiruvchi', desc: 'Matnni qisqartiradi', tag: 'SUMMARIZE', color: '#8B5CF6' },
      { icon: '✅', title: 'Grammar Checker', desc: 'Grammatik tekshirish', tag: 'GRAMMAR', color: '#EC4899' },
      { icon: '🎨', title: 'Rasm Prompt', desc: 'Rasm uchun prompt', tag: 'IMAGE-AI', color: '#06B6D4' },
      { icon: '🎙️', title: 'Voice AI', desc: 'Ovozli buyruqlar', tag: 'VOICE', color: '#10B981' },
      { icon: '🚀', title: 'Kelajak AI', desc: 'Tez kunda...', tag: 'SOON', color: '#F59E0B' }
    ],
    dev: [
      { icon: '{}', title: 'JSON Formatter', desc: 'Format · Minify · Validate', tag: 'JSON', color: '#8B5CF6' },
      { icon: '✓', title: 'JSON Validator', desc: 'JSON validatsiya', tag: 'JSON', color: '#EC4899' },
      { icon: 'B64', title: 'Base64 Encode', desc: 'Matnni Base64 ga o\'tkazish', tag: 'ENCODE', color: '#06B6D4' },
      { icon: 'B64', title: 'Base64 Decode', desc: 'Base64 dan matnga', tag: 'DECODE', color: '#10B981' },
      { icon: 'URL', title: 'URL Encode', desc: 'URL xavfsiz kodlash', tag: 'URL', color: '#F59E0B' },
      { icon: 'URL', title: 'URL Decode', desc: 'URL dekodlash', tag: 'URL', color: '#EF4444' },
      { icon: '.*', title: 'Regex Tester', desc: 'RegEx test qilish', tag: 'REGEX', color: '#8B5CF6' },
      { icon: '🔑', title: 'UUID Generator', desc: 'UUID v4 yaratish', tag: 'UUID', color: '#EC4899' },
      { icon: '🔐', title: 'Password Generator', desc: 'Kuchli parol yaratish', tag: 'SECURE', color: '#06B6D4' },
      { icon: 'QR', title: 'QR Code', desc: 'QR kod yaratish', tag: 'QR', color: '#10B981' },
      { icon: '🎨', title: 'Color Picker', desc: 'HEX · RGB tanlash', tag: 'COLOR', color: '#F59E0B' },
      { icon: '🌈', title: 'Gradient Generator', desc: 'CSS gradient yaratish', tag: 'CSS', color: '#EF4444' },
      { icon: 'CSS', title: 'CSS Generator', desc: 'CSS shablonlar', tag: 'CSS', color: '#8B5CF6' },
      { icon: '</>', title: 'HTML Beautifier', desc: 'HTML formatlash', tag: 'HTML', color: '#EC4899' },
      { icon: 'JS', title: 'JS Minifier', desc: 'JavaScript siqish', tag: 'JS', color: '#06B6D4' },
      { icon: 'MD', title: 'Markdown Preview', desc: 'Markdown ko\'rish', tag: 'MD', color: '#10B981' },
      { icon: '⏰', title: 'Timestamp Converter', desc: 'Vaqt konvertatsiya', tag: 'TIME', color: '#F59E0B' },
      { icon: '📄', title: 'Lorem Ipsum', desc: 'Demo matn generator', tag: 'TEXT', color: '#EF4444' },
      { icon: '🎲', title: 'Random Data', desc: 'Tasodifiy ma\'lumot', tag: 'RANDOM', color: '#8B5CF6' }
    ],
    cyber: [
      { icon: '🌐', title: 'IP Lookup', desc: 'IP manzil ma\'lumotlari', tag: 'OSINT', color: '#EC4899' },
      { icon: '📡', title: 'DNS Lookup', desc: 'DNS yozuvlarini tekshirish', tag: 'DNS', color: '#06B6D4' },
      { icon: '🔍', title: 'WHOIS Lookup', desc: 'Domain egasi ma\'lumotlari', tag: 'WHOIS', color: '#10B981' },
      { icon: '📋', title: 'HTTP Headers', desc: 'HTTP headerlar', tag: 'HTTP', color: '#F59E0B' },
      { icon: '🔒', title: 'SSL Checker', desc: 'SSL sertifikat tekshirish', tag: 'SSL', color: '#EF4444' },
      { icon: '🚪', title: 'Port Scanner', desc: 'Portlarni skanerlash (demo)', tag: 'SCAN', color: '#8B5CF6' },
      { icon: '#', title: 'Hash Generator', desc: 'MD5 · SHA-1 · SHA-256', tag: 'HASH', color: '#EC4899' },
      { icon: '✓', title: 'Hash Checker', desc: 'Hash turini aniqlash', tag: 'HASH', color: '#06B6D4' },
      { icon: 'JWT', title: 'JWT Decoder', desc: 'JWT token dekodlash', tag: 'JWT', color: '#10B981' },
      { icon: '🖥️', title: 'User-Agent', desc: 'Brauzer ma\'lumotlari', tag: 'INFO', color: '#F59E0B' },
      { icon: '🔑', title: 'Password Strength', desc: 'Parol kuchliligi', tag: 'SECURE', color: '#EF4444' },
      { icon: '🌐', title: 'Subdomain Finder', desc: 'Subdomainlarni topish', tag: 'SUBDOMAIN', color: '#8B5CF6' },
      { icon: '📊', title: 'HTTP Status', desc: 'HTTP kodlar jadvali', tag: 'HTTP', color: '#EC4899' },
      { icon: '📰', title: 'Cyber News', desc: 'Kiberxavfsizlik yangiliklari', tag: 'NEWS', color: '#06B6D4' },
      { icon: '💡', title: 'Security Tips', desc: 'Xavfsizlik maslahatlari', tag: 'TIPS', color: '#10B981' }
    ],
    osint: [
      { icon: '👤', title: 'Username Search', desc: '8 ta platformada qidirish', tag: 'USERNAME', color: '#F59E0B' },
      { icon: '📧', title: 'Email Lookup', desc: 'Email manzil tahlili', tag: 'EMAIL', color: '#EF4444' },
      { icon: '📱', title: 'Phone Lookup', desc: 'Telefon raqam tahlili', tag: 'PHONE', color: '#8B5CF6' },
      { icon: '🌐', title: 'Domain Lookup', desc: 'Domain ma\'lumotlari', tag: 'DOMAIN', color: '#EC4899' },
      { icon: '🖼️', title: 'Metadata Viewer', desc: 'Fayl metadata ko\'rish', tag: 'METADATA', color: '#06B6D4' },
      { icon: '📷', title: 'EXIF Viewer', desc: 'Rasm EXIF ma\'lumotlari', tag: 'EXIF', color: '#10B981' },
      { icon: '📱', title: 'Social Finder', desc: '10 ta ijtimoiy tarmoq', tag: 'SOCIAL', color: '#F59E0B' },
      { icon: '📰', title: 'Public Info', desc: 'Ochiq ma\'lumotlaringiz', tag: 'INFO', color: '#EF4444' },
      { icon: '⚠️', title: 'Breach Checker', desc: 'Email buzilishini tekshirish', tag: 'BREACH', color: '#8B5CF6' }
    ],
    downloader: [
      { icon: '📺', title: 'YouTube', desc: 'YouTube video yuklab olish', tag: 'YT', color: '#EC4899' },
      { icon: '📸', title: 'Instagram', desc: 'Instagram media yuklab olish', tag: 'IG', color: '#06B6D4' },
      { icon: '🎵', title: 'TikTok', desc: 'TikTok video yuklab olish', tag: 'TT', color: '#10B981' },
      { icon: '📘', title: 'Facebook', desc: 'Facebook video yuklab olish', tag: 'FB', color: '#F59E0B' },
      { icon: '𝕏', title: 'X (Twitter)', desc: 'Twitter video yuklab olish', tag: 'X', color: '#EF4444' },
      { icon: '🤖', title: 'Reddit', desc: 'Reddit media yuklab olish', tag: 'REDDIT', color: '#8B5CF6' },
      { icon: '📌', title: 'Pinterest', desc: 'Pinterest rasm yuklab olish', tag: 'PIN', color: '#EC4899' },
      { icon: '🧵', title: 'Threads', desc: 'Threads media yuklab olish', tag: 'THREADS', color: '#06B6D4' },
      { icon: '✈️', title: 'Telegram Media', desc: 'Telegram fayl yuklab olish', tag: 'TG', color: '#10B981' },
      { icon: '🎵', title: 'Audio Downloader', desc: 'MP3 audio yuklab olish', tag: 'AUDIO', color: '#F59E0B' },
      { icon: '📑', title: 'Playlist', desc: 'Butun playlist yuklab olish', tag: 'PLAYLIST', color: '#EF4444' }
    ],
    telegram: [
      { icon: '🤖', title: 'Bot Generator', desc: 'Telegram bot kodi', tag: 'BOT', color: '#8B5CF6' },
      { icon: '📋', title: 'Bot Templates', desc: 'Bot shablonlari', tag: 'TEMPLATE', color: '#EC4899' },
      { icon: '@', title: 'Username Checker', desc: 'Telegram username tekshirish', tag: 'USERNAME', color: '#06B6D4' },
      { icon: '🌐', title: 'Telegram WebApp', desc: 'Web App yaratish', tag: 'WEBAPP', color: '#10B981' },
      { icon: '🔗', title: 'Deep Link', desc: 'Deep link generator', tag: 'LINK', color: '#F59E0B' },
      { icon: '🪝', title: 'Webhook Tester', desc: 'Webhook test qilish', tag: 'WEBHOOK', color: '#EF4444' },
      { icon: '📢', title: 'Channel Toolkit', desc: 'Kanal boshqaruvi', tag: 'CHANNEL', color: '#8B5CF6' },
      { icon: '✉️', title: 'Message Formatter', desc: 'Xabar formatlash', tag: 'FORMAT', color: '#EC4899' }
    ],
    files: [
      { icon: '📄', title: 'PDF Merge', desc: 'PDF fayllarni birlashtirish', tag: 'PDF', color: '#06B6D4' },
      { icon: '✂️', title: 'PDF Split', desc: 'PDFni bo\'lish', tag: 'PDF', color: '#10B981' },
      { icon: '🔤', title: 'OCR', desc: 'Rasmdan matn olish', tag: 'OCR', color: '#F59E0B' },
      { icon: '📦', title: 'ZIP Creator', desc: 'ZIP arxiv yaratish', tag: 'ZIP', color: '#EF4444' },
      { icon: '🖼️', title: 'Image Compressor', desc: 'Rasm siqish (real)', tag: 'IMG', color: '#8B5CF6' },
      { icon: '🔄', title: 'Image Converter', desc: 'PNG · JPG · WEBP', tag: 'IMG', color: '#EC4899' },
      { icon: '⚖️', title: 'Text Compare', desc: 'Matnlarni taqqoslash', tag: 'TEXT', color: '#06B6D4' },
      { icon: '#️⃣', title: 'File Hash', desc: 'Fayl SHA-256 hisoblash', tag: 'HASH', color: '#10B981' }
    ]
  };

  // ============================================================
  // CARD RENDERER - creates clickable cards
  // ============================================================
  const createCard = (item) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.title = item.title;
    card.style.cursor = 'pointer';
    card.innerHTML = `
      <div class="card-icon" style="background: linear-gradient(135deg, ${item.color}, ${item.color}99);">${item.icon}</div>
      <div class="card-title">${item.title}</div>
      <div class="card-desc">${item.desc}</div>
      <span class="card-tag">${item.tag}</span>
    `;
    // Direct click handler - GUARANTEED TO WORK
    card.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.openTool) {
        window.openTool(item.title);
      } else {
        alert('Tool: ' + item.title + '\n\ntools.js hali yuklanmagan. Bir oz kuting va qayta urinib ko\'ring.');
      }
    });
    return card;
  };

  const renderCards = (containerId, items) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    items.forEach((item, i) => {
      const card = createCard(item);
      card.style.animationDelay = (i * 0.05) + 's';
      container.appendChild(card);
    });
  };

  // Render all cards immediately
  renderCards('aiCards', data.ai);
  renderCards('devCards', data.dev);
  renderCards('cyberCards', data.cyber);
  renderCards('osintCards', data.osint);
  renderCards('downloaderCards', data.downloader);
  renderCards('telegramCards', data.telegram);
  renderCards('filesCards', data.files);

  // ============================================================
  // PORTFOLIO (existing repos)
  // ============================================================
  const portfolioRepos = [
    { name: 'kryzen-hub', desc: 'AI, Cyber Security, Developer Tools platformasi', icon: '🌌', tags: ['HTML', 'CSS', 'JS'], category: 'web', stars: 1, url: 'https://kryzensys.github.io/kryzen-hub/' },
    { name: 'telegram-webapp-anonim', desc: 'Telegram Web App — anonim tanishuv', icon: '💘', tags: ['Next.js', 'FastAPI'], category: 'ai', stars: 0, url: 'https://github.com/KRYZENSYS/telegram-webapp-anonim' },
    { name: 'kryzen-snake-game', desc: 'Classic Snake o\'yini', icon: '🐍', tags: ['JS', 'Canvas'], category: 'web', stars: 0, url: 'https://kryzensys.github.io/kryzen-snake-game/' },
    { name: 'kryzen-cyber-toolkit', desc: 'Kiberxavfsizlik vositalari', icon: '🛡️', tags: ['Python', 'JS'], category: 'cyber', stars: 0, url: 'https://github.com/KRYZENSYS/kryzen-cyber-toolkit' },
    { name: 'kryzen-ai-assistant', desc: 'AI yordamchi chatbot', icon: '🤖', tags: ['Python', 'AI'], category: 'ai', stars: 0, url: 'https://github.com/KRYZENSYS/kryzen-ai-assistant' },
    { name: 'kryzen-mobile-app', desc: 'Cross-platform mobile ilova', icon: '📱', tags: ['React Native'], category: 'mobile', stars: 0, url: 'https://github.com/KRYZENSYS/kryzen-mobile-app' }
  ];

  const renderPortfolio = (filter = 'all') => {
    const container = document.getElementById('portfolioCards');
    if (!container) return;
    container.innerHTML = '';
    const items = filter === 'all' ? portfolioRepos : portfolioRepos.filter(r => r.category === filter);
    items.forEach((repo, i) => {
      const card = document.createElement('div');
      card.className = 'card portfolio-card';
      card.style.animationDelay = (i * 0.05) + 's';
      card.innerHTML = `
        <div class="portfolio-img">${repo.icon}</div>
        <div class="portfolio-body">
          <div class="portfolio-title">${repo.name}</div>
          <div class="portfolio-desc">${repo.desc}</div>
          <div class="portfolio-tags">${repo.tags.map(t => `<span class="portfolio-tag">${t}</span>`).join('')}</div>
          <div class="portfolio-links">
            <a href="${repo.url}" target="_blank" class="portfolio-link" onclick="event.stopPropagation()">👁 Demo</a>
            <a href="https://github.com/KRYZENSYS/${repo.name}" target="_blank" class="portfolio-link" onclick="event.stopPropagation()">💻 Code</a>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  };
  renderPortfolio();

  // ============================================================
  // FILTER HANDLERS
  // ============================================================
  document.querySelectorAll('.filter-bar').forEach(bar => {
    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      if (bar.id === 'portfolioFilter') renderPortfolio(filter);
    });
  });

  // ============================================================
  // THEME TOGGLE
  // ============================================================
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      themeBtn.textContent = next === 'light' ? '☀️' : '🌙';
      try { localStorage.setItem('kryzen-theme', next); } catch (e) {}
    });
    try {
      const saved = localStorage.getItem('kryzen-theme');
      if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
        themeBtn.textContent = saved === 'light' ? '☀️' : '🌙';
      }
    } catch (e) {}
  }

  // ============================================================
  // LANGUAGE TOGGLE (UZ/RU/EN)
  // ============================================================
  const langBtn = document.getElementById('langBtn');
  const langs = ['🇺🇿', '🇷🇺', '🇬🇧'];
  let langIdx = 0;
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      langIdx = (langIdx + 1) % langs.length;
      langBtn.textContent = langs[langIdx];
      if (window.toast) window.toast('Til: ' + langs[langIdx]);
    });
  }

  // ============================================================
  // PROFILE MENU
  // ============================================================
  const profileBtn = document.getElementById('profileBtn');
  const profileMenu = document.getElementById('profileMenu');
  if (profileBtn && profileMenu) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#profileMenu') && !e.target.closest('#profileBtn')) {
        profileMenu.classList.remove('active');
      }
    });
  }

  // ============================================================
  // HAMBURGER MENU
  // ============================================================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
    navMenu.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-link')) {
        navMenu.classList.remove('active');
      }
    });
  }

  // ============================================================
  // SEARCH
  // ============================================================
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  const allTools = [...data.ai, ...data.dev, ...data.cyber, ...data.osint, ...data.downloader, ...data.telegram, ...data.files];

  const performSearch = (query) => {
    if (!searchResults) return;
    searchResults.innerHTML = '';
    if (!query.trim()) {
      searchResults.innerHTML = '<div class="search-item"><span>Hech narsa topilmadi</span></div>';
      return;
    }
    const q = query.toLowerCase();
    const found = allTools.filter(t => t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.tag.toLowerCase().includes(q));
    if (found.length === 0) {
      searchResults.innerHTML = '<div class="search-item"><span>Hech narsa topilmadi</span></div>';
      return;
    }
    found.forEach(item => {
      const div = document.createElement('div');
      div.className = 'search-item';
      div.innerHTML = `<div style="font-size:20px">${item.icon}</div><div><div style="font-weight:600">${item.title}</div><div style="font-size:12px;color:var(--text-3)">${item.desc}</div></div>`;
      div.addEventListener('click', () => {
        if (window.openTool) window.openTool(item.title);
        searchModal.classList.remove('active');
        searchInput.value = '';
      });
      searchResults.appendChild(div);
    });
  };

  if (searchBtn && searchModal) {
    searchBtn.addEventListener('click', () => {
      searchModal.classList.add('active');
      setTimeout(() => searchInput && searchInput.focus(), 100);
    });
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) searchModal.classList.remove('active');
    });
    if (searchInput) {
      searchInput.addEventListener('input', (e) => performSearch(e.target.value));
    }
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchModal.classList.add('active');
      setTimeout(() => searchInput && searchInput.focus(), 100);
    }
    if (e.key === 'Escape') {
      searchModal.classList.remove('active');
      if (window.closeTool) window.closeTool();
    }
  });

  // ============================================================
  // SCROLL PROGRESS + NAVBAR
  // ============================================================
  const scrollProgress = document.getElementById('scrollProgress');
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = (scrollTop / docHeight) * 100;
    if (scrollProgress) scrollProgress.style.width = percent + '%';
    if (navbar) navbar.classList.toggle('scrolled', scrollTop > 50);
    if (backToTop) backToTop.classList.toggle('visible', scrollTop > 300);
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });

  // Smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  document.querySelectorAll('[data-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = document.getElementById(btn.dataset.section);
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ============================================================
  // STATS COUNTER ANIMATION
  // ============================================================
  const animateCount = (el, target) => {
    let current = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + (target === 100 ? '%' : target === 0 ? '$' : '+');
    }, 25);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-num').forEach(stat => {
          const target = parseInt(stat.dataset.target) || 0;
          animateCount(stat, target);
        });
        statsObserver.disconnect();
      }
    });
  });
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  // ============================================================
  // SETTINGS
  // ============================================================
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsPanel = document.getElementById('settingsPanel');
  if (settingsBtn && settingsPanel) {
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsPanel.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#settingsPanel') && !e.target.closest('#settingsBtn')) {
        settingsPanel.classList.remove('active');
      }
    });

    // Color picker
    document.querySelectorAll('.color-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const color = dot.dataset.color;
        document.documentElement.style.setProperty('--primary', color);
        const rgb = hexToRgb(color);
        if (rgb) document.documentElement.style.setProperty('--primary-rgb', rgb.r + ',' + rgb.g + ',' + rgb.b);
        try { localStorage.setItem('kryzen-color', color); } catch (e) {}
      });
    });

    // Performance mode
    const perfBtn = document.getElementById('perfModeBtn');
    if (perfBtn) {
      perfBtn.addEventListener('click', () => {
        document.body.classList.toggle('perf-mode');
        perfBtn.textContent = document.body.classList.contains('perf-mode') ? 'O\'chirish' : 'Yoqish';
        if (window.toast) window.toast('Performance: ' + (document.body.classList.contains('perf-mode') ? 'ON' : 'OFF'));
      });
    }
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
  }

  // ============================================================
  // GITHUB ANALYZER
  // ============================================================
  const githubInput = document.getElementById('githubInput');
  const githubBtn = document.getElementById('githubAnalyzeBtn');
  const githubResult = document.getElementById('githubResult');

  const analyzeGitHub = async (username) => {
    if (!githubResult) return;
    githubResult.innerHTML = '<div class="alert alert-warn">⏳ Yuklanmoqda...</div>';
    try {
      const r = await fetch('https://api.github.com/users/' + username);
      if (!r.ok) throw new Error('User topilmadi');
      const u = await r.json();
      const r2 = await fetch('https://api.github.com/users/' + username + '/repos?per_page=100');
      const repos = await r2.json();
      const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
      const languages = {};
      repos.forEach(repo => { if (repo.language) languages[repo.language] = (languages[repo.language] || 0) + 1; });
      const topLangs = Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 5);

      githubResult.innerHTML = `
        <div class="gh-profile">
          <img class="gh-avatar" src="${u.avatar_url}" alt="${u.login}" />
          <div>
            <h3 style="font-size:22px">${u.name || u.login}</h3>
            <p style="color:var(--text-2);font-size:13px">@${u.login}</p>
            <p style="font-size:14px;margin-top:6px">${u.bio || 'Bio yo\'q'}</p>
            ${u.location ? `<p style="font-size:12px;color:var(--text-3)">📍 ${u.location}</p>` : ''}
          </div>
        </div>
        <div class="gh-stats">
          <div class="gh-stat"><div class="gh-stat-num">${u.public_repos}</div><div class="gh-stat-label">Repositoriya</div></div>
          <div class="gh-stat"><div class="gh-stat-num">${u.followers}</div><div class="gh-stat-label">Followers</div></div>
          <div class="gh-stat"><div class="gh-stat-num">${u.following}</div><div class="gh-stat-label">Following</div></div>
          <div class="gh-stat"><div class="gh-stat-num">${totalStars}</div><div class="gh-stat-label">Yulduzlar</div></div>
          <div class="gh-stat"><div class="gh-stat-num">${u.public_gists}</div><div class="gh-stat-label">Gists</div></div>
          <div class="gh-stat"><div class="gh-stat-num">${new Date(u.created_at).getFullYear()}</div><div class="gh-stat-label">Yil</div></div>
        </div>
        <div style="margin-top:20px;padding:16px;background:var(--surface);border-radius:12px">
          <h4 style="margin-bottom:10px">📊 Top tillar</h4>
          ${topLangs.map(l => `<div style="display:flex;justify-content:space-between;padding:6px 0"><span>${l[0]}</span><strong>${l[1]} ta repo</strong></div>`).join('')}
        </div>
        <a href="${u.html_url}" target="_blank" class="btn btn-primary" style="margin-top:20px;width:100%;justify-content:center">👁 GitHub profilni ochish</a>
      `;
    } catch (e) {
      githubResult.innerHTML = '<div class="alert alert-error">❌ ' + e.message + '</div>';
    }
  };

  if (githubBtn) {
    githubBtn.addEventListener('click', () => {
      const u = githubInput.value.trim();
      if (u) analyzeGitHub(u);
    });
    githubInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') githubBtn.click();
    });
    // Auto analyze on load
    if (githubInput.value) setTimeout(() => analyzeGitHub(githubInput.value), 500);
  }

  // ============================================================
  // DASHBOARD INITIALIZATION
  // ============================================================
  const aiCount = document.getElementById('aiCount');
  if (aiCount) aiCount.textContent = data.ai.length + '+';
  const notifList = document.getElementById('notifList');
  if (notifList) {
    notifList.innerHTML = `
      <li>🔔 Yangi GitHub star</li>
      <li>🤖 AI model yangilandi</li>
      <li>📥 5 ta yuklab olish</li>
      <li>⚡ Performance oshdi</li>
    `;
  }
  const activityFeed = document.getElementById('activityFeed');
  if (activityFeed) {
    activityFeed.innerHTML = `
      <div>✅ Sayt deploy qilindi</div>
      <div>🛠️ 80+ tool qo'shildi</div>
      <div>📊 Dashboard yaratildi</div>
      <div>🎨 Dizayn yangilandi</div>
    `;
  }
  const aiChart = document.getElementById('aiChart');
  if (aiChart) {
    aiChart.innerHTML = '';
    for (let i = 0; i < 12; i++) {
      const bar = document.createElement('div');
      bar.style.height = (Math.random() * 90 + 10) + '%';
      aiChart.appendChild(bar);
    }
  }

  // ============================================================
  // CONTACT FORM
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (window.toast) {
        window.toast('Xabar yuborildi! Tez orada javob beramiz.');
      } else {
        alert('Xabar yuborildi!');
      }
      contactForm.reset();
    });
  }

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (window.toast) window.toast('Obuna bo\'ldingiz!');
      newsletterForm.reset();
    });
  }

  // ============================================================
  // MATRIX RAIN
  // ============================================================
  const matrixCanvas = document.getElementById('matrixCanvas');
  if (matrixCanvas) {
    const ctx = matrixCanvas.getContext('2d');
    let w, h, drops;
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';

    const resize = () => {
      w = matrixCanvas.width = window.innerWidth;
      h = matrixCanvas.height = window.innerHeight;
      const cols = Math.floor(w / 14);
      drops = Array(cols).fill(1);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#8B5CF6';
      ctx.font = '14px monospace';
      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * 14, y);
        if (y * 14 > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };
    setInterval(draw, 50);
  }

  // ============================================================
  // PARTICLES
  // ============================================================
  const particlesCanvas = document.getElementById('particlesCanvas');
  if (particlesCanvas) {
    const ctx = particlesCanvas.getContext('2d');
    let w, h, particles = [];
    const resize = () => {
      w = particlesCanvas.width = window.innerWidth;
      h = particlesCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      // Draw connections
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    };
    drawParticles();
  }

  // ============================================================
  // CUSTOM CURSOR
  // ============================================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  if (cursorDot && cursorRing && window.innerWidth > 1024) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    const update = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top = my + 'px';
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top = ry + 'px';
      requestAnimationFrame(update);
    };
    update();

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('button, a, .card, input, textarea, select, [data-clickable]')) {
        document.body.classList.add('cursor-hover');
      } else {
        document.body.classList.remove('cursor-hover');
      }
    });
  }

  // ============================================================
  // MOUSE GLOW
  // ============================================================
  const mouseGlow = document.getElementById('mouseGlow');
  if (mouseGlow && window.innerWidth > 1024) {
    document.addEventListener('mousemove', (e) => {
      mouseGlow.style.left = e.clientX + 'px';
      mouseGlow.style.top = e.clientY + 'px';
    });
  }

  // ============================================================
  // TYPING EFFECT
  // ============================================================
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const text = 'KRYZEN HUB';
    let i = 0;
    typingEl.textContent = '';
    const type = () => {
      if (i < text.length) {
        typingEl.textContent += text[i];
        i++;
        setTimeout(type, 150);
      }
    };
    setTimeout(type, 500);
  }

  // ============================================================
  // FOOTER TIME
  // ============================================================
  const footerTime = document.getElementById('footerTime');
  if (footerTime) {
    const update = () => {
      footerTime.textContent = new Date().toLocaleString('uz-UZ');
    };
    update();
    setInterval(update, 60000);
  }

  // ============================================================
  // GLOBAL TOAST
  // ============================================================
  window.toast = (msg, type = 'success') => {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = (type === 'success' ? '✅ ' : '❌ ') + msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3000);
  };

  // ============================================================
  // GLOBAL openTool - FALLBACK
  // ============================================================
  if (typeof window.openTool !== 'function') {
    window.openTool = (name) => {
      alert('🔧 ' + name + '\n\nBu tool hali tayyor emas yoki tools.js yuklanmagan.\n\n2-3 daqiqadan so\'ng sahifani yangilang (Ctrl+Shift+R).');
    };
  }
  if (typeof window.closeTool !== 'function') {
    window.closeTool = () => {
      const m = document.getElementById('toolModal');
      if (m) m.classList.remove('active');
    };
  }

  console.log('✅ KRYZEN HUB v3.0 loaded | 80+ tools | All systems go!');

})();
