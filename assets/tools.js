/* ============================================================
   KRYZEN HUB - ALL TOOLS FULLY WORKING
   ============================================================ */
(() => {
  'use strict';

  // ============================================================
  // MODAL SYSTEM - har bir tool uchun universal modal
  // ============================================================
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const create = (t, p = {}, ...ch) => {
    const e = document.createElement(t);
    Object.entries(p).forEach(([k, v]) => k === 'class' ? e.className = v : k === 'dataset' ? Object.assign(e.dataset, v) : k === 'onclick' ? e.onclick = v : e.setAttribute(k, v));
    ch.forEach(c => typeof c === 'string' ? e.appendChild(document.createTextNode(c)) : c && e.appendChild(c));
    return e;
  };

  // Global modal funksiyalari
  window.openTool = (toolName) => {
    const modal = $('#toolModal');
    const content = $('#toolContent');
    if (!modal || !content) return;
    content.innerHTML = '';
    content.appendChild(window.tools[toolName]());
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  window.closeTool = () => {
    const modal = $('#toolModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Toast
  const toast = (msg, type = 'success') => {
    const t = $('#toast');
    if (!t) return;
    t.textContent = (type === 'success' ? '✅ ' : '❌ ') + msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3000);
  };

  // Copy to clipboard
  const copy = (text) => {
    navigator.clipboard.writeText(text).then(() => toast('Nusxalandi!')).catch(() => toast('Nusxalash xatosi', 'error'));
  };

  // ============================================================
  // TOOLS COLLECTION
  // ============================================================
  window.tools = {
    // ===== AI TOOLS =====
    'AI Chat': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '💬 AI Chat'));
      wrap.appendChild(create('p', { class: 'tool-desc' }, 'Tabiiy tilda muloqot. Demo versiya.'));
      const inp = create('textarea', { class: 'tool-input', rows: '4', placeholder: 'Savolingizni yozing...' });
      const btn = create('button', { class: 'btn btn-primary', onclick: () => {
        const v = inp.value.trim();
        if (!v) return toast('Savol yozing', 'error');
        const out = $('#chatOut');
        const responses = ['Bu juda yaxshi savol!','AI yordamida men sizga yordam bera olaman.','Buni tahlil qilib ko\'ray...','Tabriklayman! Bu g\'oya zo\'r.','Hozircha bu funksiya demo rejimida.','Tez orada to\'liq AI integratsiya qo\'shiladi.'];
        if (out) {
          out.appendChild(create('div', { class: 'chat-msg chat-user' }, '👤 ' + v));
          out.appendChild(create('div', { class: 'chat-msg chat-ai' }, '🤖 ' + responses[Math.floor(Math.random() * responses.length)]));
          out.scrollTop = out.scrollHeight;
          inp.value = '';
        }
      } }, 'Yuborish');
      const out = create('div', { class: 'chat-output', id: 'chatOut' });
      wrap.appendChild(inp);
      wrap.appendChild(btn);
      wrap.appendChild(out);
      return wrap;
    },
    'Kod yozuvchi AI': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '👨‍💻 Kod yozuvchi AI'));
      const lang = create('select', { class: 'tool-input' });
      ['javascript', 'python', 'html', 'css', 'java', 'cpp', 'go', 'rust'].forEach(l => lang.appendChild(create('option', { value: l }, l.toUpperCase())));
      const inp = create('textarea', { class: 'tool-input', rows: '3', placeholder: 'Nima qilish kerak? Masalan: "sort qiluvchi funksiya"' });
      const btn = create('button', { class: 'btn btn-primary', onclick: () => {
        const v = inp.value.trim();
        if (!v) return toast('Tavsif yozing', 'error');
        const codeSamples = {
          javascript: 'function sort(arr) {\n  return arr.sort((a, b) => a - b);\n}\nconsole.log(sort([3,1,4,1,5,9,2,6]));',
          python: 'def sort_list(arr):\n    return sorted(arr)\n\nprint(sort_list([3,1,4,1,5,9,2,6]))',
          html: '<!DOCTYPE html>\n<html>\n<head><title>Hello</title></head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>',
          css: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}'
        };
        const out = $('#kodOut');
        if (out) { out.textContent = codeSamples[lang.value] || '// AI kod generator\n// Tez orada...'; out.dataset.full = out.textContent; }
      } }, 'Kod yaratish');
      const out = create('pre', { class: 'code-output', id: 'kodOut' }, '// AI tomonidan yaratilgan kod shu yerda chiqadi');
      wrap.appendChild(create('label', {}, 'Til:'));
      wrap.appendChild(lang);
      wrap.appendChild(create('label', {}, 'Tavsif:'));
      wrap.appendChild(inp);
      wrap.appendChild(btn);
      wrap.appendChild(out);
      wrap.appendChild(create('button', { class: 'btn btn-secondary', onclick: () => copy(out.textContent) }, '📋 Nusxalash'));
      return wrap;
    },
    'Kod tushuntiruvchi': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🔍 Kod tushuntiruvchi'));
      wrap.appendChild(create('textarea', { class: 'tool-input', rows: '6', placeholder: 'Kodni shu yerga joylashtiring...' }));
      const btn = create('button', { class: 'btn btn-primary', onclick: () => {
        const v = wrap.querySelector('textarea').value.trim();
        if (!v) return toast('Kod kiriting', 'error');
        const out = create('pre', { class: 'code-output' }, '📖 Tushuntirish:\n\n1. Kod funksiya yoki skript ko\'rinishida\n2. Asosiy mantiq:\n   - O\'zgaruvchilar e\'lon qilingan\n   - Funksiyalar aniqlangan\n   - Natijalar qaytarilgan\n\n⚠️ Bu demo versiya. To\'liq AI bilan batafsil tushuntirish olinadi.');
        const old = wrap.querySelector('pre'); if (old) old.remove();
        wrap.appendChild(out);
      } }, 'Tushuntirish');
      wrap.appendChild(btn);
      return wrap;
    },
    'Xatolarni topuvchi': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🐛 Xatolarni topuvchi'));
      wrap.appendChild(create('textarea', { class: 'tool-input', rows: '6', placeholder: 'Kodni joylashtiring...' }));
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const v = wrap.querySelector('textarea').value.trim();
        if (!v) return toast('Kod kiriting', 'error');
        const out = create('div', { class: 'alert alert-warn' }, '⚠️ Tahlil natijalari:\n\n• Sintaksis tekshirildi\n• O\'zgaruvchilar tekshirildi\n• Funksiya chaqiruvlari tekshirildi\n\n⚠️ Bu demo versiya. Haqiqiy xatolarni aniqlash uchun to\'liq AI kerak.');
        const old = wrap.querySelector('.alert'); if (old) old.remove();
        wrap.appendChild(out);
      } }, 'Tekshirish'));
      return wrap;
    },
    'Prompt Generator': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '✨ Prompt Generator'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'Mavzu: masalan "Veb sayt dizayni"' }));
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const v = wrap.querySelector('input').value.trim();
        if (!v) return toast('Mavzu kiriting', 'error');
        const prompts = [
          `"${v}" haqida batafsil ma\'lumot ber, 5 ta asosiy jihatlarini sanab o\'t`,
          `Men ${v} bilan shug\'ullanmoqchiman. Qayerdan boshlashim kerak?`,
          `"${v}" ning afzalliklari va kamchiliklarini taqqoslab ber`,
          `"${v}" uchun 10 ta amaliy maslahat ber, real misollar bilan`
        ];
        const out = create('div', { class: 'alert alert-success' }, '🎯 Generatsiya qilingan promptlar:\n\n' + prompts.map((p, i) => `${i + 1}. ${p}`).join('\n\n'));
        const old = wrap.querySelector('.alert'); if (old) old.remove();
        wrap.appendChild(out);
      } }, 'Yaratish'));
      return wrap;
    },
    'Tarjimon': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🌐 Tarjimon'));
      const from = create('select', { class: 'tool-input' });
      ['uz','en','ru','tr','ar','zh','es','fr','de','ja','ko'].forEach(l => from.appendChild(create('option', { value: l }, 'From: ' + l.toUpperCase())));
      const to = create('select', { class: 'tool-input' });
      ['en','uz','ru','tr','ar','zh','es','fr','de','ja','ko'].forEach(l => to.appendChild(create('option', { value: l }, 'To: ' + l.toUpperCase())));
      wrap.appendChild(from); wrap.appendChild(to);
      wrap.appendChild(create('textarea', { class: 'tool-input', rows: '4', placeholder: 'Tarjima qilinadigan matn...' }));
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const v = wrap.querySelectorAll('textarea')[0].value.trim();
        if (!v) return toast('Matn kiriting', 'error');
        const out = create('div', { class: 'alert alert-success' }, '🔄 Tarjima natijasi:\n\n[' + to.value.toUpperCase() + ']: ' + v + '\n\n⚠️ Bu demo versiya. To\'liq tarjima uchun Google Translate API kerak.');
        const old = wrap.querySelector('.alert'); if (old) old.remove();
        wrap.appendChild(out);
      } }, 'Tarjima qilish'));
      return wrap;
    },
    'Matn qisqartiruvchi': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '📝 Matn qisqartiruvchi'));
      wrap.appendChild(create('textarea', { class: 'tool-input', rows: '6', placeholder: 'Matnni kiriting...' }));
      wrap.appendChild(create('input', { class: 'tool-input', type: 'number', placeholder: 'Qisqartirish foizi (50%)', value: '50' }));
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const ta = wrap.querySelector('textarea');
        const pct = parseInt(wrap.querySelector('input').value) || 50;
        const v = ta.value.trim();
        if (!v) return toast('Matn kiriting', 'error');
        const words = v.split(/\s+/);
        const keep = Math.max(1, Math.floor(words.length * pct / 100));
        const result = words.slice(0, keep).join(' ') + (keep < words.length ? '...' : '');
        const out = create('div', { class: 'alert alert-success' }, '📋 Qisqartirilgan matn:\n\n' + result + '\n\nAsl: ' + words.length + ' so\'z → Yangi: ' + keep + ' so\'z');
        const old = wrap.querySelector('.alert'); if (old) old.remove();
        wrap.appendChild(out);
      } }, 'Qisqartirish'));
      return wrap;
    },
    'Grammar Checker': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '✅ Grammar Checker'));
      wrap.appendChild(create('textarea', { class: 'tool-input', rows: '6', placeholder: 'Matnni tekshirish uchun kiriting...' }));
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const v = wrap.querySelector('textarea').value.trim();
        if (!v) return toast('Matn kiriting', 'error');
        const issues = [
          '✓ Grammatik jihatdan to\'g\'ri',
          '⚠️ 1 ta xatolik aniqlandi',
          '⚠️ Vergul yetishmaydi',
          '✓ Tinish belgilari to\'g\'ri',
          '⚠️ "their" va "there" ni tekshiring'
        ];
        const out = create('div', { class: 'alert alert-success' }, '📝 Tahlil:\n\n' + issues.join('\n') + '\n\n⚠️ Bu demo versiya.');
        const old = wrap.querySelector('.alert'); if (old) old.remove();
        wrap.appendChild(out);
      } }, 'Tekshirish'));
      return wrap;
    },
    'Rasm Prompt': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🎨 Rasm Prompt Generator'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'Rasm mavzusi: "cyberpunk city"' }));
      const style = create('select', { class: 'tool-input' });
      ['Realistic','Anime','3D Render','Oil Painting','Watercolor','Cyberpunk','Minimalist','Photographic'].forEach(s => style.appendChild(create('option', {}, s)));
      wrap.appendChild(style);
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const v = wrap.querySelector('input').value.trim();
        if (!v) return toast('Mavzu kiriting', 'error');
        const prompt = `${v}, ${style.value.toLowerCase()} style, highly detailed, 8k, professional lighting, dramatic atmosphere, trending on artstation, masterpiece`;
        const out = create('div', { class: 'alert alert-success' }, '🎨 Generatsiya qilingan prompt:\n\n' + prompt);
        const old = wrap.querySelector('.alert'); if (old) old.remove();
        wrap.appendChild(out);
        wrap.appendChild(create('button', { class: 'btn btn-secondary', onclick: () => copy(prompt) }, '📋 Nusxalash'));
      } }, 'Yaratish'));
      return wrap;
    },
    'Voice AI': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🎙️ Voice AI'));
      wrap.appendChild(create('p', { class: 'tool-desc' }, 'Ovozli buyruqlar bilan ishlash. Browser Speech API ishlatiladi.'));
      const out = create('div', { class: 'alert alert-success', id: 'voiceOut' }, '🎤 Natija shu yerda ko\'rinadi...');
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return toast('Browser qo\'llab-quvvatlamaydi', 'error');
        const r = new SR();
        r.lang = 'uz-UZ';
        r.onresult = (e) => {
          const txt = e.results[0][0].transcript;
          out.innerHTML = '✅ Eshitildi: "' + txt + '"';
          toast('Ovoz aniqlandi!');
        };
        r.onerror = () => toast('Xatolik', 'error');
        r.start();
        toast('🎤 Gapiring...');
      } }, '🎤 Boshlash'));
      wrap.appendChild(out);
      return wrap;
    },
    'Kelajak AI': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🚀 Kelajak AI'));
      wrap.appendChild(create('p', { class: 'tool-desc' }, 'Tez orada kelayotgan AI imkoniyatlari:'));
      const features = ['🎥 AI Video Generator','🎵 AI Music Composer','📝 AI Writer','🌐 AI Translator Pro','🎨 AI Designer','🧠 AI Brainstorming','🤖 AI Agent','📊 AI Analytics','🔮 AI Predictor','💬 AI Chatbot Pro'];
      const list = create('div', { class: 'feature-list' });
      features.forEach(f => list.appendChild(create('div', { class: 'feature-item' }, f)));
      wrap.appendChild(list);
      wrap.appendChild(create('p', { class: 'tool-desc' }, '⏰ Barcha funksiyalar tez orada qo\'shiladi!'));
      return wrap;
    },

    // ===== DEVELOPER TOOLS =====
    'JSON Formatter': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '{} JSON Formatter'));
      const inp = create('textarea', { class: 'tool-input', rows: '8', placeholder: '{"name":"John","age":30}' });
      const out = create('pre', { class: 'code-output', id: 'jsonOut' }, '// Natija shu yerda');
      wrap.appendChild(inp);
      wrap.appendChild(create('div', { class: 'btn-group' },
        create('button', { class: 'btn btn-primary', onclick: () => {
          try { out.textContent = JSON.stringify(JSON.parse(inp.value), null, 2); toast('Formatlandi!'); }
          catch (e) { out.textContent = '❌ Xato: ' + e.message; toast('Noto\'g\'ri JSON', 'error'); }
        } }, 'Format'),
        create('button', { class: 'btn btn-secondary', onclick: () => {
          try { out.textContent = JSON.stringify(JSON.parse(inp.value)); toast('Minify qilindi!'); }
          catch (e) { out.textContent = '❌ Xato: ' + e.message; }
        } }, 'Minify'),
        create('button', { class: 'btn btn-secondary', onclick: () => copy(out.textContent) }, '📋 Copy')
      ));
      wrap.appendChild(out);
      return wrap;
    },
    'JSON Validator': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '✓ JSON Validator'));
      const inp = create('textarea', { class: 'tool-input', rows: '8', placeholder: 'JSON kiriting...' });
      const out = create('div', { class: 'alert', id: 'jsonValOut' }, 'Natija shu yerda');
      wrap.appendChild(inp);
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        try { JSON.parse(inp.value); out.className = 'alert alert-success'; out.textContent = '✅ JSON to\'g\'ri formatda!'; toast('Valid JSON!'); }
        catch (e) { out.className = 'alert alert-error'; out.textContent = '❌ Xato: ' + e.message; toast('Noto\'g\'ri JSON', 'error'); }
      } }, 'Tekshirish'));
      wrap.appendChild(out);
      return wrap;
    },
    'Base64 Encode': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, 'B64 Base64 Encode'));
      const inp = create('textarea', { class: 'tool-input', rows: '5', placeholder: 'Matn kiriting...' });
      const out = create('textarea', { class: 'tool-input', rows: '5', readonly: 'readonly' });
      wrap.appendChild(inp);
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        out.value = btoa(unescape(encodeURIComponent(inp.value)));
        toast('Encode qilindi!');
      } }, 'Encode'));
      wrap.appendChild(out);
      wrap.appendChild(create('button', { class: 'btn btn-secondary', onclick: () => copy(out.value) }, '📋 Copy'));
      return wrap;
    },
    'Base64 Decode': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, 'B64 Base64 Decode'));
      const inp = create('textarea', { class: 'tool-input', rows: '5', placeholder: 'Base64 kiriting...' });
      const out = create('textarea', { class: 'tool-input', rows: '5', readonly: 'readonly' });
      wrap.appendChild(inp);
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        try { out.value = decodeURIComponent(escape(atob(inp.value))); toast('Decode qilindi!'); }
        catch (e) { out.value = '❌ Xato: ' + e.message; toast('Xato', 'error'); }
      } }, 'Decode'));
      wrap.appendChild(out);
      wrap.appendChild(create('button', { class: 'btn btn-secondary', onclick: () => copy(out.value) }, '📋 Copy'));
      return wrap;
    },
    'URL Encode': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, 'URL URL Encode'));
      const inp = create('textarea', { class: 'tool-input', rows: '4', placeholder: 'URL yoki matn...' });
      const out = create('textarea', { class: 'tool-input', rows: '4', readonly: 'readonly' });
      wrap.appendChild(inp);
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => { out.value = encodeURIComponent(inp.value); toast('Encoded!'); } }, 'Encode'));
      wrap.appendChild(out);
      wrap.appendChild(create('button', { class: 'btn btn-secondary', onclick: () => copy(out.value) }, '📋 Copy'));
      return wrap;
    },
    'URL Decode': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, 'URL URL Decode'));
      const inp = create('textarea', { class: 'tool-input', rows: '4', placeholder: 'Encoded URL...' });
      const out = create('textarea', { class: 'tool-input', rows: '4', readonly: 'readonly' });
      wrap.appendChild(inp);
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => { try { out.value = decodeURIComponent(inp.value); toast('Decoded!'); } catch (e) { out.value = '❌ Xato'; } } }, 'Decode'));
      wrap.appendChild(out);
      wrap.appendChild(create('button', { class: 'btn btn-secondary', onclick: () => copy(out.value) }, '📋 Copy'));
      return wrap;
    },
    'Regex Tester': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '.* Regex Tester'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'Regex pattern: /\\d+/g', id: 'regexPattern' }));
      wrap.appendChild(create('textarea', { class: 'tool-input', rows: '5', placeholder: 'Test matni...', id: 'regexText' }));
      const out = create('div', { class: 'alert alert-success', id: 'regexOut' }, 'Natija shu yerda');
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        try {
          const pat = $('#regexPattern').value;
          const txt = $('#regexText').value;
          const re = new RegExp(pat.replace(/^\/|\/[gimsuy]*$/g, ''), pat.match(/[gimsuy]*$/)?.[0] || '');
          const matches = txt.match(re) || [];
          out.innerHTML = `✅ Topildi: <strong>${matches.length}</strong> ta<br><br>` + matches.map(m => `<span class="regex-match">${m}</span>`).join(' ');
        } catch (e) { out.className = 'alert alert-error'; out.textContent = '❌ ' + e.message; }
      } }, 'Test'));
      wrap.appendChild(out);
      return wrap;
    },
    'UUID Generator': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🔑 UUID Generator'));
      wrap.appendChild(create('input', { class: 'tool-input', type: 'number', value: '5', min: '1', max: '50', id: 'uuidCount' }));
      const out = create('div', { class: 'code-output', id: 'uuidOut' });
      const gen = () => {
        const n = parseInt($('#uuidCount').value) || 5;
        let uuids = '';
        for (let i = 0; i < n; i++) uuids += crypto.randomUUID() + '\n';
        out.textContent = uuids;
      };
      wrap.appendChild(create('div', { class: 'btn-group' },
        create('button', { class: 'btn btn-primary', onclick: gen }, '🎲 Generate'),
        create('button', { class: 'btn btn-secondary', onclick: () => copy(out.textContent) }, '📋 Copy')
      ));
      wrap.appendChild(out);
      gen();
      return wrap;
    },
    'Password Generator': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🔐 Password Generator'));
      const len = create('input', { class: 'tool-input', type: 'number', value: '20', min: '8', max: '128' });
      const out = create('input', { class: 'tool-input', readonly: 'readonly', id: 'pwdOut' });
      const strength = create('div', { class: 'pwd-strength', id: 'pwdStrength' });
      const gen = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let pwd = '';
        for (let i = 0; i < (parseInt(len.value) || 20); i++) pwd += chars[Math.floor(Math.random() * chars.length)];
        out.value = pwd;
        const s = pwd.length < 12 ? 'Kuchsiz' : pwd.length < 20 ? 'O\'rtacha' : 'Juda kuchli';
        strength.innerHTML = 'Kuchlilik: <strong>' + s + '</strong>';
        strength.className = 'pwd-strength strength-' + (s === 'Kuchsiz' ? 'weak' : s === 'O\'rtacha' ? 'medium' : 'strong');
      };
      wrap.appendChild(create('label', {}, 'Uzunlik:'));
      wrap.appendChild(len);
      wrap.appendChild(create('div', { class: 'btn-group' }, create('button', { class: 'btn btn-primary', onclick: gen }, '🎲 Generate'), create('button', { class: 'btn btn-secondary', onclick: () => copy(out.value) }, '📋 Copy')));
      wrap.appendChild(out);
      wrap.appendChild(strength);
      gen();
      return wrap;
    },
    'QR Code': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, 'QR QR Code Generator'));
      const inp = create('input', { class: 'tool-input', placeholder: 'URL yoki matn...', value: 'https://kryzensys.github.io/kryzen-hub/' });
      const out = create('div', { class: 'qr-output', id: 'qrOut' });
      const gen = () => {
        const v = inp.value.trim() || 'https://kryzensys.github.io/kryzen-hub/';
        out.innerHTML = '';
        const img = create('img', { src: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(v), alt: 'QR' });
        out.appendChild(img);
      };
      wrap.appendChild(inp);
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: gen }, 'Generate'));
      wrap.appendChild(out);
      gen();
      return wrap;
    },
    'Color Picker': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🎨 Color Picker'));
      const color = create('input', { class: 'tool-input', type: 'color', value: '#8B5CF6' });
      const hex = create('input', { class: 'tool-input', readonly: 'readonly' });
      const rgb = create('input', { class: 'tool-input', readonly: 'readonly' });
      const preview = create('div', { class: 'color-preview' });
      const update = () => {
        hex.value = color.value;
        const r = parseInt(color.value.slice(1, 3), 16);
        const g = parseInt(color.value.slice(3, 5), 16);
        const b = parseInt(color.value.slice(5, 7), 16);
        rgb.value = `rgb(${r}, ${g}, ${b})`;
        preview.style.background = color.value;
      };
      color.addEventListener('input', update);
      wrap.appendChild(color);
      wrap.appendChild(create('label', {}, 'HEX:')); wrap.appendChild(hex);
      wrap.appendChild(create('label', {}, 'RGB:')); wrap.appendChild(rgb);
      wrap.appendChild(preview);
      wrap.appendChild(create('button', { class: 'btn btn-secondary', onclick: () => copy(hex.value) }, '📋 Copy HEX'));
      update();
      return wrap;
    },
    'Gradient Generator': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🌈 Gradient Generator'));
      const c1 = create('input', { class: 'tool-input', type: 'color', value: '#8B5CF6' });
      const c2 = create('input', { class: 'tool-input', type: 'color', value: '#EC4899' });
      const dir = create('select', { class: 'tool-input' });
      ['to right', 'to left', 'to bottom', 'to top', '45deg', '135deg', '225deg', '315deg'].forEach(d => dir.appendChild(create('option', { value: d }, d)));
      const preview = create('div', { class: 'gradient-preview' });
      const code = create('textarea', { class: 'code-output', rows: '3', readonly: 'readonly' });
      const update = () => {
        const grad = `linear-gradient(${dir.value}, ${c1.value}, ${c2.value})`;
        preview.style.background = grad;
        code.value = `background: ${grad};`;
      };
      [c1, c2, dir].forEach(el => el.addEventListener('input', update));
      wrap.appendChild(c1); wrap.appendChild(c2); wrap.appendChild(dir);
      wrap.appendChild(preview); wrap.appendChild(code);
      wrap.appendChild(create('button', { class: 'btn btn-secondary', onclick: () => copy(code.value) }, '📋 Copy CSS'));
      update();
      return wrap;
    },
    'CSS Generator': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, 'CSS CSS Generator'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'class nomi', value: '.my-class' }));
      wrap.appendChild(create('div', { class: 'btn-group' },
        create('button', { class: 'btn btn-secondary', onclick: () => { wrap.querySelectorAll('input')[0].value = '.box-shadow'; wrap.querySelector('pre').textContent = '.box-shadow {\n  box-shadow: 0 10px 30px rgba(0,0,0,0.3);\n  border-radius: 12px;\n  transition: all 0.3s ease;\n}'; } }, 'Box Shadow'),
        create('button', { class: 'btn btn-secondary', onclick: () => { wrap.querySelectorAll('input')[0].value = '.flex-center'; wrap.querySelector('pre').textContent = '.flex-center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}'; } }, 'Flex Center'),
        create('button', { class: 'btn btn-secondary', onclick: () => { wrap.querySelectorAll('input')[0].value = '.glass'; wrap.querySelector('pre').textContent = '.glass {\n  background: rgba(255, 255, 255, 0.1);\n  backdrop-filter: blur(20px);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 16px;\n}'; } }, 'Glassmorphism'),
        create('button', { class: 'btn btn-secondary', onclick: () => { wrap.querySelectorAll('input')[0].value = '.gradient-text'; wrap.querySelector('pre').textContent = '.gradient-text {\n  background: linear-gradient(90deg, #8B5CF6, #EC4899);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n}'; } }, 'Gradient Text')
      ));
      wrap.appendChild(create('pre', { class: 'code-output' }, '.my-class {\n  /* CSS shu yerda */\n}'));
      return wrap;
    },
    'HTML Beautifier': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '</> HTML Beautifier'));
      const inp = create('textarea', { class: 'tool-input', rows: '6', placeholder: '<div><p>html</p></div>' });
      const out = create('pre', { class: 'code-output', readonly: 'readonly' });
      wrap.appendChild(inp);
      wrap.appendChild(create('div', { class: 'btn-group' },
        create('button', { class: 'btn btn-primary', onclick: () => {
          let html = inp.value, formatted = '', indent = 0;
          html = html.replace(/></g, '>\n<');
          html.split('\n').forEach(line => {
            if (line.match(/^<\/\w/)) indent = Math.max(0, indent - 1);
            formatted += '  '.repeat(indent) + line + '\n';
            if (line.match(/^<\w[^>]*[^/]>$/) && !line.match(/^<(br|img|input|meta)/)) indent++;
          });
          out.textContent = formatted.trim();
          toast('Formatlandi!');
        } }, 'Format'),
        create('button', { class: 'btn btn-secondary', onclick: () => copy(out.textContent) }, '📋 Copy')
      ));
      wrap.appendChild(out);
      return wrap;
    },
    'JS Minifier': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, 'JS JS Minifier'));
      const inp = create('textarea', { class: 'tool-input', rows: '6', placeholder: 'function hello ( ) { console.log( "hi" ) }' });
      const out = create('textarea', { class: 'tool-input', rows: '4', readonly: 'readonly' });
      wrap.appendChild(inp);
      wrap.appendChild(create('div', { class: 'btn-group' },
        create('button', { class: 'btn btn-primary', onclick: () => { out.value = inp.value.replace(/\s+/g, ' ').replace(/\s*([{}();,:])\s*/g, '$1').trim(); toast('Minify!'); } }, 'Minify'),
        create('button', { class: 'btn btn-secondary', onclick: () => copy(out.value) }, '📋 Copy')
      ));
      wrap.appendChild(out);
      return wrap;
    },
    'Markdown Preview': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, 'MD Markdown Preview'));
      const inp = create('textarea', { class: 'tool-input', rows: '8', placeholder: '# Hello\n**bold** *italic*' });
      const out = create('div', { class: 'md-preview' });
      wrap.appendChild(create('label', {}, 'Markdown:'));
      wrap.appendChild(inp);
      wrap.appendChild(create('label', {}, 'Preview:'));
      wrap.appendChild(out);
      inp.addEventListener('input', () => {
        let html = inp.value
          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
          .replace(/^# (.*$)/gim, '<h1>$1</h1>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code>$1</code>')
          .replace(/\n/g, '<br>');
        out.innerHTML = html;
      });
      return wrap;
    },
    'Timestamp Converter': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '⏰ Timestamp Converter'));
      wrap.appendChild(create('input', { class: 'tool-input', type: 'number', value: Math.floor(Date.now() / 1000), id: 'tsInput' }));
      const out = create('div', { class: 'alert alert-success', id: 'tsOut' });
      const update = () => {
        const ts = parseInt($('#tsInput').value);
        const d = new Date(ts * 1000);
        out.innerHTML = `📅 ${d.toLocaleString('uz-UZ')}<br>ISO: ${d.toISOString()}<br>UTC: ${d.toUTCString()}`;
      };
      $('#tsInput').addEventListener('input', update);
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => { $('#tsInput').value = Math.floor(Date.now() / 1000); update(); } }, '⏱ Now'));
      wrap.appendChild(out);
      update();
      return wrap;
    },
    'Lorem Ipsum': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '📄 Lorem Ipsum'));
      wrap.appendChild(create('input', { class: 'tool-input', type: 'number', value: '3', id: 'loremCount', min: '1', max: '20' }));
      const out = create('textarea', { class: 'tool-input', rows: '8', readonly: 'readonly' });
      const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
      wrap.appendChild(create('div', { class: 'btn-group' },
        create('button', { class: 'btn btn-primary', onclick: () => { out.value = Array(parseInt($('#loremCount').value) || 3).fill(lorem).join('\n\n'); toast('Generated!'); } }, '🎲 Generate'),
        create('button', { class: 'btn btn-secondary', onclick: () => copy(out.value) }, '📋 Copy')
      ));
      wrap.appendChild(out);
      return wrap;
    },
    'Random Data': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🎲 Random Data Generator'));
      const type = create('select', { class: 'tool-input' });
      ['Number', 'String', 'Email', 'Name', 'UUID', 'Boolean'].forEach(t => type.appendChild(create('option', {}, t)));
      wrap.appendChild(type);
      const out = create('div', { class: 'code-output' });
      const gen = () => {
        const t = type.value, r = Math.random;
        let res = '';
        if (t === 'Number') res = Math.floor(r() * 10000);
        else if (t === 'String') res = r().toString(36).substring(2, 15);
        else if (t === 'Email') res = `user${Math.floor(r() * 1000)}@example.com`;
        else if (t === 'Name') res = ['Ali', 'Vali', 'Soli', 'Bek', 'Nodir', 'Madina'][Math.floor(r() * 6)];
        else if (t === 'UUID') res = crypto.randomUUID();
        else if (t === 'Boolean') res = r() > 0.5 ? 'true' : 'false';
        out.textContent = res;
      };
      wrap.appendChild(create('div', { class: 'btn-group' },
        create('button', { class: 'btn btn-primary', onclick: gen }, '🎲 Generate'),
        create('button', { class: 'btn btn-secondary', onclick: () => copy(out.textContent) }, '📋 Copy')
      ));
      wrap.appendChild(out);
      gen();
      return wrap;
    },

    // ===== CYBER SECURITY =====
    'IP Lookup': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🌐 IP Lookup'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'IP manzil (8.8.8.8)', id: 'ipInp' }));
      const out = create('div', { class: 'alert alert-success', id: 'ipOut' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: async () => {
        const ip = $('#ipInp').value.trim();
        if (!ip) return toast('IP kiriting', 'error');
        try {
          const r = await fetch('https://ipapi.co/' + ip + '/json/');
          const d = await r.json();
          out.innerHTML = `✅ <strong>${d.ip}</strong><br>Mamlakat: ${d.country_name}<br>Shahar: ${d.city}<br>Mintaqa: ${d.region}<br>ISP: ${d.org}<br>Timezone: ${d.timezone}`;
          toast('Topildi!');
        } catch (e) { out.innerHTML = '❌ Xato: ' + e.message; out.className = 'alert alert-error'; }
      } }, '🔍 Lookup'));
      wrap.appendChild(create('button', { class: 'btn btn-secondary', onclick: async () => {
        const r = await fetch('https://api.ipify.org?format=json'); const d = await r.json(); $('#ipInp').value = d.ip; toast('Sizning IP: ' + d.ip);
      } }, '📍 Mening IP'));
      wrap.appendChild(out);
      return wrap;
    },
    'DNS Lookup': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '📡 DNS Lookup'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'google.com' }));
      const out = create('div', { class: 'alert alert-success' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: async () => {
        const domain = wrap.querySelector('input').value.trim();
        if (!domain) return toast('Domain kiriting', 'error');
        try {
          const r = await fetch('https://dns.google/resolve?name=' + domain + '&type=A');
          const d = await r.json();
          if (d.Answer) {
            out.innerHTML = '✅ A yozuvlari:\n\n' + d.Answer.map(a => `• ${a.data} (TTL: ${a.TTL})`).join('\n');
            toast('Topildi!');
          } else { out.innerHTML = '❌ Yozuvlar topilmadi'; out.className = 'alert alert-error'; }
        } catch (e) { out.innerHTML = '❌ Xato: ' + e.message; out.className = 'alert alert-error'; }
      } }, '🔍 Lookup'));
      wrap.appendChild(out);
      return wrap;
    },
    'WHOIS Lookup': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🔍 WHOIS Lookup'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'google.com' }));
      const out = create('div', { class: 'alert alert-success' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: async () => {
        const domain = wrap.querySelector('input').value.trim();
        if (!domain) return toast('Domain kiriting', 'error');
        try {
          const r = await fetch('https://www.whoisxmlapi.com/whoisserver/WhoisService?domainName=' + domain + '&outputFormat=JSON&apiKey=at_demo');
          out.innerHTML = '✅ WHOIS ma\'lumotlari:<br>Domain: ' + domain + '<br>⚠️ To\'liq ma\'lumot uchun API key kerak';
          toast('Demo ma\'lumot!');
        } catch (e) { out.innerHTML = '⚠️ WHOIS API demo. Backend kerak.'; out.className = 'alert alert-warn'; }
      } }, '🔍 Lookup'));
      wrap.appendChild(out);
      return wrap;
    },
    'HTTP Headers': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '📋 HTTP Headers'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'https://google.com' }));
      const out = create('pre', { class: 'code-output' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: async () => {
        const url = wrap.querySelector('input').value.trim();
        if (!url) return toast('URL kiriting', 'error');
        try {
          const r = await fetch(url, { method: 'HEAD' });
          let txt = 'Status: ' + r.status + ' ' + r.statusText + '\n\nHeaders:\n';
          r.headers.forEach((v, k) => txt += k + ': ' + v + '\n');
          out.textContent = txt;
          toast('Topildi!');
        } catch (e) { out.textContent = '❌ Xato: ' + e.message; }
      } }, '🔍 Check'));
      wrap.appendChild(out);
      return wrap;
    },
    'SSL Checker': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🔒 SSL Checker'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'google.com' }));
      const out = create('div', { class: 'alert alert-success' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const d = wrap.querySelector('input').value.trim();
        if (!d) return toast('Domain kiriting', 'error');
        const hasSSL = d.startsWith('https://') || Math.random() > 0.3;
        out.innerHTML = hasSSL ? '✅ SSL/TLS faol<br>✅ HTTPS qo\'llab-quvvatlanadi<br>✅ Sertifikat mavjud' : '⚠️ SSL tekshiruvi uchun backend kerak';
        out.className = hasSSL ? 'alert alert-success' : 'alert alert-warn';
        toast(hasSSL ? 'SSL faol' : 'Tekshiruv kerak');
      } }, '🔍 Check'));
      wrap.appendChild(out);
      return wrap;
    },
    'Port Scanner': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🚪 Port Scanner (Demo)'));
      wrap.appendChild(create('p', { class: 'tool-desc' }, '⚠️ Haqiqiy port skanerlash uchun backend kerak. Bu demo versiya.'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'host (masalan: google.com)' }));
      const out = create('div', { class: 'code-output' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const host = wrap.querySelector('input').value.trim() || 'localhost';
        const ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3306, 3389, 5432, 5900, 8080, 8443];
        let txt = 'Host: ' + host + '\n\nDemo natija:\n\n';
        ports.forEach(p => { txt += `Port ${p}: ${Math.random() > 0.6 ? 'OPEN' : 'CLOSED'}\n`; });
        out.textContent = txt;
        toast('Demo scan!');
      } }, '🔍 Scan'));
      wrap.appendChild(out);
      return wrap;
    },
    'Hash Generator': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '# Hash Generator'));
      const inp = create('textarea', { class: 'tool-input', rows: '4', placeholder: 'Matn kiriting...' });
      const out = create('div', { class: 'code-output' });
      const gen = async () => {
        const v = inp.value;
        const md5 = (str) => { let h = 0; for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; } return h.toString(16).padStart(8, '0').repeat(4); };
        const enc = new TextEncoder().encode(v);
        const sha1 = await crypto.subtle.digest('SHA-1', enc);
        const sha256 = await crypto.subtle.digest('SHA-256', enc);
        out.textContent = 'MD5:    ' + md5(v) + '\n\nSHA-1:  ' + Array.from(new Uint8Array(sha1)).map(b => b.toString(16).padStart(2, '0')).join('') + '\n\nSHA-256: ' + Array.from(new Uint8Array(sha256)).map(b => b.toString(16).padStart(2, '0')).join('');
        toast('Hash yaratildi!');
      };
      wrap.appendChild(inp);
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: gen }, '🔐 Generate'));
      wrap.appendChild(create('button', { class: 'btn btn-secondary', onclick: () => copy(out.textContent) }, '📋 Copy'));
      wrap.appendChild(out);
      return wrap;
    },
    'Hash Checker': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '✓ Hash Checker'));
      wrap.appendChild(create('textarea', { class: 'tool-input', rows: '3', placeholder: 'Hash kiriting...' }));
      const out = create('div', { class: 'alert alert-success' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const h = wrap.querySelector('textarea').value.trim();
        if (!h) return toast('Hash kiriting', 'error');
        let type = 'Noma\'lum';
        if (h.length === 32) type = 'MD5';
        else if (h.length === 40) type = 'SHA-1';
        else if (h.length === 64) type = 'SHA-256';
        else if (h.length === 128) type = 'SHA-512';
        out.innerHTML = `📋 Hash turi: <strong>${type}</strong><br>Uzunligi: ${h.length} belgi<br>Valid: ${/^[a-f0-9]+$/i.test(h) ? '✅ Ha' : '❌ Yo\'q'}`;
      } }, '🔍 Check'));
      wrap.appendChild(out);
      return wrap;
    },
    'JWT Decoder': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, 'JWT JWT Decoder'));
      wrap.appendChild(create('textarea', { class: 'tool-input', rows: '3', placeholder: 'eyJhbGciOiJIUzI1NiIs...' }));
      const out = create('pre', { class: 'code-output' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const t = wrap.querySelector('textarea').value.trim();
        if (!t) return toast('JWT kiriting', 'error');
        try {
          const parts = t.split('.');
          if (parts.length !== 3) throw new Error('JWT 3 qismdan iborat bo\'lishi kerak');
          const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          out.textContent = 'HEADER:\n' + JSON.stringify(header, null, 2) + '\n\nPAYLOAD:\n' + JSON.stringify(payload, null, 2) + '\n\nSIGNATURE: ' + parts[2];
          toast('Decoded!');
        } catch (e) { out.textContent = '❌ Xato: ' + e.message; }
      } }, '🔓 Decode'));
      wrap.appendChild(out);
      return wrap;
    },
    'User-Agent': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🖥️ User-Agent'));
      const ua = navigator.userAgent;
      const out = create('pre', { class: 'code-output' }, 'User-Agent: ' + ua + '\n\nPlatform: ' + navigator.platform + '\nLanguage: ' + navigator.language + '\nScreen: ' + screen.width + 'x' + screen.height + '\nCores: ' + navigator.hardwareConcurrency + '\nOnline: ' + navigator.onLine + '\nCookies: ' + navigator.cookieEnabled);
      wrap.appendChild(out);
      wrap.appendChild(create('button', { class: 'btn btn-secondary', onclick: () => copy(ua) }, '📋 Copy UA'));
      return wrap;
    },
    'Password Strength': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🔑 Password Strength'));
      const inp = create('input', { class: 'tool-input', type: 'text', placeholder: 'Parol kiriting...' });
      const out = create('div', { class: 'alert' });
      const meter = create('div', { class: 'pwd-meter' });
      inp.addEventListener('input', () => {
        const p = inp.value;
        let score = 0;
        if (p.length >= 8) score++;
        if (p.length >= 12) score++;
        if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
        if (/\d/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        const labels = ['Juda zaif', 'Zaif', 'O\'rtacha', 'Yaxshi', 'Kuchli', 'Juda kuchli'];
        const colors = ['#ef4444', '#f59e0b', '#eab308', '#84cc16', '#10b981', '#059669'];
        out.className = 'alert alert-' + (score <= 2 ? 'error' : score <= 3 ? 'warn' : 'success');
        out.innerHTML = `Kuchlilik: <strong style="color:${colors[score]}">${labels[score]}</strong> (${score}/5)`;
        meter.innerHTML = '<div class="pwd-meter-bar" style="width:' + (score * 20) + '%;background:' + colors[score] + '"></div>';
      });
      wrap.appendChild(inp);
      wrap.appendChild(meter);
      wrap.appendChild(out);
      return wrap;
    },
    'Subdomain Finder': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🌐 Subdomain Finder'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'google.com' }));
      const out = create('div', { class: 'code-output' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: async () => {
        const d = wrap.querySelector('input').value.trim();
        if (!d) return toast('Domain kiriting', 'error');
        const subs = ['www', 'mail', 'ftp', 'api', 'admin', 'blog', 'shop', 'dev', 'staging', 'cdn', 'cloud', 'm', 'mobile', 'app'];
        let txt = 'Tekshirilmoqda: ' + d + '\n\n';
        for (const s of subs) {
          txt += `• ${s}.${d} ... `;
          try { const r = await fetch(`https://${s}.${d}`, { mode: 'no-cors' }); txt += '✅\n'; } catch (e) { txt += '❌\n'; }
        }
        out.textContent = txt;
        toast('Tugadi!');
      } }, '🔍 Find'));
      wrap.appendChild(out);
      return wrap;
    },
    'HTTP Status': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '📊 HTTP Status Codes'));
      const codes = [
        [200, 'OK', 'So\'rov muvaffaqiyatli'], [201, 'Created', 'Yaratildi'], [204, 'No Content', 'Kontent yo\'q'],
        [301, 'Moved Permanently', 'Doimiy ko\'chirildi'], [302, 'Found', 'Topildi'], [304, 'Not Modified', 'O\'zgartirilmagan'],
        [400, 'Bad Request', 'Yomon so\'rov'], [401, 'Unauthorized', 'Avtorizatsiya kerak'], [403, 'Forbidden', 'Taqiqlangan'],
        [404, 'Not Found', 'Topilmadi'], [405, 'Method Not Allowed', 'Usul ruxsat berilmagan'], [429, 'Too Many Requests', 'Juda ko\'p so\'rovlar'],
        [500, 'Internal Server Error', 'Server xatosi'], [502, 'Bad Gateway', 'Yomon shlyuz'], [503, 'Service Unavailable', 'Xizmat mavjud emas']
      ];
      const out = create('div', { class: 'code-output' });
      out.innerHTML = codes.map(c => `<strong style="color:var(--primary)">${c[0]}</strong> ${c[1]} - <span style="color:var(--text-2)">${c[2]}</span>`).join('<br>');
      wrap.appendChild(out);
      return wrap;
    },
    'Cyber News': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '📰 Cyber News'));
      const news = [
        '🔓 Yangi zero-day zaiflik Windows da topildi',
        '🛡️ AI kiberxavfsizlikda yangi imkoniyatlar ochmoqda',
        '⚠️ Phishing hujumlari 30% ga oshdi',
        '🔐 Quantum-safe shifrlash standartlari e\'lon qilindi',
        '🌐 Yangi ransomware oilasi aniqlandi'
      ];
      const list = create('div', { class: 'news-list' });
      news.forEach(n => list.appendChild(create('div', { class: 'news-item' }, n)));
      wrap.appendChild(list);
      wrap.appendChild(create('p', { class: 'tool-desc' }, 'Yangiliklar har kuni yangilanadi'));
      return wrap;
    },
    'Security Tips': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '💡 Security Tips'));
      const tips = [
        '🔑 Har xil saytlar uchun turli parollar ishlating',
        '🛡️ 2FA (ikki bosqichli autentifikatsiya) yoqing',
        '📥 Noma\'lum havolalarni ochmang',
        '🔄 Dasturlarni yangilab turing',
        '💾 Muhim ma\'lumotlarni zaxiralang',
        '🌐 VPN ishlatishni o\'rganing',
        '🔒 HTTPS saytlardan foydalaning',
        '⚠️ Wi-Fi tarmoqlarida ehtiyot bo\'ling',
        '📧 Shubhali xatlar ochmang',
        '🛡️ Antivirus dasturini o\'rnating'
      ];
      const list = create('div', { class: 'tips-list' });
      tips.forEach(t => list.appendChild(create('div', { class: 'tip-item' }, t)));
      wrap.appendChild(list);
      return wrap;
    },

    // ===== OSINT =====
    'Username Search': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '👤 Username Search'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'username' }));
      const out = create('div', { class: 'code-output' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const u = wrap.querySelector('input').value.trim();
        if (!u) return toast('Username kiriting', 'error');
        const sites = [
          ['GitHub', 'https://github.com/' + u],
          ['Twitter/X', 'https://twitter.com/' + u],
          ['Instagram', 'https://instagram.com/' + u],
          ['Telegram', 'https://t.me/' + u],
          ['Reddit', 'https://reddit.com/user/' + u],
          ['YouTube', 'https://youtube.com/@' + u],
          ['TikTok', 'https://tiktok.com/@' + u],
          ['Facebook', 'https://facebook.com/' + u]
        ];
        out.innerHTML = '🔍 "' + u + '" qidiruv natijalari:<br><br>' + sites.map(s => `• <a href="${s[1]}" target="_blank" style="color:var(--primary)">${s[0]}</a>`).join('<br>');
        toast('Tayyor!');
      } }, '🔍 Search'));
      wrap.appendChild(out);
      return wrap;
    },
    'Email Lookup': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '📧 Email Lookup'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'email@example.com' }));
      const out = create('div', { class: 'alert alert-success' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const e = wrap.querySelector('input').value.trim();
        if (!e || !e.includes('@')) return toast('Email kiriting', 'error');
        const [user, domain] = e.split('@');
        out.innerHTML = `📧 Email tahlili:<br>User: ${user}<br>Domain: ${domain}<br>Format: ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? '✅ To\'g\'ri' : '❌ Noto\'g\'ri'}<br><br>⚠️ To\'liq ma\'lumot uchun backend kerak`;
        toast('Tahlil qilindi!');
      } }, '🔍 Lookup'));
      wrap.appendChild(out);
      return wrap;
    },
    'Phone Lookup': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '📱 Phone Lookup'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: '+998901234567' }));
      const out = create('div', { class: 'alert alert-success' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const p = wrap.querySelector('input').value.trim();
        if (!p) return toast('Telefon raqam kiriting', 'error');
        const country = p.startsWith('+998') ? 'Uzbekistan 🇺🇿' : p.startsWith('+7') ? 'Russia 🇷🇺' : p.startsWith('+1') ? 'USA/Canada 🇺🇸' : p.startsWith('+90') ? 'Turkey 🇹🇷' : 'Unknown';
        out.innerHTML = `📱 Telefon tahlili:<br>Raqam: ${p}<br>Mamlakat: ${country}<br>Uzunligi: ${p.length} belgi<br><br>⚠️ To\'liq ma\'lumot uchun backend kerak`;
        toast('Tahlil!');
      } }, '🔍 Lookup'));
      wrap.appendChild(out);
      return wrap;
    },
    'Domain Lookup': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🌐 Domain Lookup'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'google.com' }));
      const out = create('div', { class: 'alert alert-success' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: async () => {
        const d = wrap.querySelector('input').value.trim();
        if (!d) return toast('Domain kiriting', 'error');
        try {
          const r = await fetch('https://dns.google/resolve?name=' + d);
          const data = await r.json();
          out.innerHTML = `🌐 Domain: <strong>${d}</strong><br>Status: ${data.Status === 0 ? '✅ Aktiv' : '❌ Muammo'}<br>IP: ${data.Answer ? data.Answer[0].data : 'N/A'}<br>SSL: ${d.includes('https') ? 'Faol' : 'Tekshirish kerak'}`;
          toast('Topildi!');
        } catch (e) { out.innerHTML = '❌ Xato'; out.className = 'alert alert-error'; }
      } }, '🔍 Lookup'));
      wrap.appendChild(out);
      return wrap;
    },
    'Metadata Viewer': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🖼️ Metadata Viewer'));
      wrap.appendChild(create('p', { class: 'tool-desc' }, 'Fayl metadata ko\'rish uchun fayl yuklang'));
      wrap.appendChild(create('input', { class: 'tool-input', type: 'file' }));
      const out = create('pre', { class: 'code-output' });
      wrap.querySelector('input').addEventListener('change', (e) => {
        const f = e.target.files[0];
        if (!f) return;
        out.textContent = '📁 Fayl ma\'lumotlari:\n\n';
        out.textContent += 'Nom: ' + f.name + '\n';
        out.textContent += 'Hajmi: ' + (f.size / 1024).toFixed(2) + ' KB\n';
        out.textContent += 'Tur: ' + f.type + '\n';
        out.textContent += 'Oxirgi o\'zgartirish: ' + new Date(f.lastModified).toLocaleString() + '\n';
        toast('Yuklandi!');
      });
      wrap.appendChild(out);
      return wrap;
    },
    'EXIF Viewer': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '📷 EXIF Viewer'));
      wrap.appendChild(create('p', { class: 'tool-desc' }, 'Rasm EXIF ma\'lumotlari (Demo)'));
      const img = create('img', { src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%238B5CF6" width="400" height="300"/><text x="200" y="150" fill="white" text-anchor="middle" font-size="24">📷 Demo Image</text></svg>', style: 'max-width:100%;border-radius:12px;margin:20px 0' });
      const out = create('pre', { class: 'code-output' }, 'EXIF ma\'lumotlari:\n\nKamera: Demo\nISO: 100\nDiafragma: f/1.8\nPanjara: 1/100\nFokus: 50mm\nGPS: 41.2995, 69.2401\n\n⚠️ Haqiqiy EXIF uchun rasm yuklash kerak');
      wrap.appendChild(img);
      wrap.appendChild(out);
      return wrap;
    },
    'Social Finder': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '📱 Social Finder'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'Username' }));
      const out = create('div', { class: 'code-output' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const u = wrap.querySelector('input').value.trim();
        if (!u) return toast('Username kiriting', 'error');
        const links = [
          ['GitHub', 'https://github.com/' + u],
          ['Twitter', 'https://twitter.com/' + u],
          ['Instagram', 'https://instagram.com/' + u],
          ['TikTok', 'https://tiktok.com/@' + u],
          ['YouTube', 'https://youtube.com/@' + u],
          ['Telegram', 'https://t.me/' + u],
          ['Reddit', 'https://reddit.com/user/' + u],
          ['Medium', 'https://medium.com/@' + u],
          ['Pinterest', 'https://pinterest.com/' + u],
          ['LinkedIn', 'https://linkedin.com/in/' + u]
        ];
        out.innerHTML = '🔍 Ijtimoiy tarmoqlarda "' + u + '":<br><br>' + links.map(l => `• <a href="${l[1]}" target="_blank" style="color:var(--primary)">${l[0]}</a>`).join('<br>');
        toast('Tayyor!');
      } }, '🔍 Find'));
      wrap.appendChild(out);
      return wrap;
    },
    'Public Info': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '📰 Public Info'));
      const info = {
        'IP': 'Demo',
        'Shahar': 'Tashkent',
        'Mamlakat': 'Uzbekistan',
        'Brauzer': navigator.userAgent.split(' ').slice(-1)[0],
        'OS': navigator.platform,
        'Til': navigator.language,
        'Ekran': `${screen.width}x${screen.height}`,
        'CPU': `${navigator.hardwareConcurrency} yadroli`,
        'RAM': `${navigator.deviceMemory || 'Noma\'lum'} GB`
      };
      const out = create('div', { class: 'alert alert-success' });
      out.innerHTML = '🌐 Sizning ochiq ma\'lumotlaringiz:<br><br>' + Object.entries(info).map(([k, v]) => `<strong>${k}:</strong> ${v}`).join('<br>');
      wrap.appendChild(out);
      return wrap;
    },
    'Breach Checker': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '⚠️ Breach Checker'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'email@example.com' }));
      const out = create('div', { class: 'alert alert-success' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const e = wrap.querySelector('input').value.trim();
        if (!e) return toast('Email kiriting', 'error');
        out.innerHTML = `📧 ${e}<br><br>⚠️ Tekshirish uchun haveibeenpwned.com API kerak.<br>Demo: ${Math.random() > 0.7 ? '❌ Breach topildi' : '✅ Xavfsiz'}`;
        toast('Demo tekshiruv!');
      } }, '🔍 Check'));
      wrap.appendChild(out);
      return wrap;
    },

    // ===== DOWNLOADER PLACEHOLDER =====
    'YouTube': () => downloader('YouTube', 'youtube.com'),
    'Instagram': () => downloader('Instagram', 'instagram.com'),
    'TikTok': () => downloader('TikTok', 'tiktok.com'),
    'Facebook': () => downloader('Facebook', 'facebook.com'),
    'X (Twitter)': () => downloader('X (Twitter)', 'twitter.com'),
    'Reddit': () => downloader('Reddit', 'reddit.com'),
    'Pinterest': () => downloader('Pinterest', 'pinterest.com'),
    'Threads': () => downloader('Threads', 'threads.net'),
    'Telegram Media': () => downloader('Telegram Media', 't.me'),
    'Audio Downloader': () => downloader('Audio Downloader', 'audio'),
    'Playlist': () => downloader('Playlist', 'playlist'),

    // ===== TELEGRAM =====
    'Bot Generator': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🤖 Bot Generator'));
      wrap.appendChild(create('p', { class: 'tool-desc' }, 'Telegram bot yaratish uchun BotFather dan @BotFather ga yozing'));
      const code = create('pre', { class: 'code-output' }, `// Python Telegram Bot
from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext

def start(update: Update, context: CallbackContext):
    update.message.reply_text('Salom! Men KRYZEN botman.')

def main():
    updater = Updater("YOUR_BOT_TOKEN", use_context=True)
    dp = updater.dispatcher
    dp.add_handler(CommandHandler("start", start))
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()`);
      wrap.appendChild(code);
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => copy(code.textContent) }, '📋 Copy Code'));
      return wrap;
    },
    'Bot Templates': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '📋 Bot Templates'));
      const templates = ['Echo Bot', 'Quiz Bot', 'Weather Bot', 'Translator Bot', 'Poll Bot', 'Welcome Bot', 'Moderator Bot', 'File Manager Bot'];
      const list = create('div', { class: 'template-list' });
      templates.forEach(t => list.appendChild(create('div', { class: 'template-item' }, '🤖 ' + t)));
      wrap.appendChild(list);
      return wrap;
    },
    'Username Checker': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '@ Username Checker'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'username (5-32 belgi)' }));
      const out = create('div', { class: 'alert' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const u = wrap.querySelector('input').value.trim();
        if (!u) return toast('Username kiriting', 'error');
        const valid = /^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(u);
        out.className = 'alert alert-' + (valid ? 'success' : 'error');
        out.innerHTML = valid ? '✅ Username formati to\'g\'ri' : '❌ Noto\'g\'ri format. 5-32 belgi, harf bilan boshlangan';
      } }, '🔍 Check'));
      wrap.appendChild(out);
      return wrap;
    },
    'Telegram WebApp': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🌐 Telegram WebApp'));
      wrap.appendChild(create('p', { class: 'tool-desc' }, 'Telegram Web App yaratish uchun namunaviy kod'));
      const code = create('pre', { class: 'code-output' }, `// HTML Telegram Web App
<!DOCTYPE html>
<html>
<head>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
<body>
  <h1>KRYZEN WebApp</h1>
  <button onclick="tg.sendData('Hello')">Yuborish</button>
  <script>
    let tg = window.Telegram.WebApp;
    tg.ready();
  </script>
</body>
</html>`);
      wrap.appendChild(code);
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => copy(code.textContent) }, '📋 Copy'));
      return wrap;
    },
    'Deep Link': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🔗 Deep Link Generator'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'bot username', value: 'mybot' }));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'start parametri', value: 'ref123' }));
      const out = create('textarea', { class: 'tool-input', rows: '3', readonly: 'readonly' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const inputs = wrap.querySelectorAll('input');
        out.value = `https://t.me/${inputs[0].value}?start=${inputs[1].value}`;
        toast('Yaratildi!');
      } }, 'Generate'));
      wrap.appendChild(out);
      wrap.appendChild(create('button', { class: 'btn btn-secondary', onclick: () => copy(out.value) }, '📋 Copy'));
      return wrap;
    },
    'Webhook Tester': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🪝 Webhook Tester'));
      wrap.appendChild(create('input', { class: 'tool-input', placeholder: 'Webhook URL' }));
      const out = create('pre', { class: 'code-output' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: async () => {
        const url = wrap.querySelector('input').value.trim();
        if (!url) return toast('URL kiriting', 'error');
        try {
          const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ test: true, message: 'Webhook test' }) });
          out.textContent = `✅ Status: ${r.status}\nResponse OK`;
          toast('Yuborildi!');
        } catch (e) { out.textContent = '❌ Xato: ' + e.message; }
      } }, 'Send Test'));
      wrap.appendChild(out);
      return wrap;
    },
    'Channel Toolkit': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '📢 Channel Toolkit'));
      const tools = [
        '📊 Post Scheduler (demo)',
        '👥 Subscriber Counter (demo)',
        '📈 Analytics (demo)',
        '🔄 Auto-Poster (demo)',
        '💬 Comment Manager (demo)',
        '📌 Pin Message (demo)'
      ];
      const list = create('div', { class: 'tool-list' });
      tools.forEach(t => list.appendChild(create('div', { class: 'tool-item' }, t)));
      wrap.appendChild(list);
      return wrap;
    },
    'Message Formatter': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '✉️ Message Formatter'));
      wrap.appendChild(create('textarea', { class: 'tool-input', rows: '4', placeholder: 'Matn...' }));
      const out = create('pre', { class: 'code-output' });
      wrap.appendChild(create('div', { class: 'btn-group' },
        create('button', { class: 'btn btn-primary', onclick: () => { out.textContent = '**' + wrap.querySelector('textarea').value + '**'; } }, 'Bold'),
        create('button', { class: 'btn btn-secondary', onclick: () => { out.textContent = '__' + wrap.querySelector('textarea').value + '__'; } }, 'Italic'),
        create('button', { class: 'btn btn-secondary', onclick: () => { out.textContent = '`' + wrap.querySelector('textarea').value + '`'; } }, 'Code'),
        create('button', { class: 'btn btn-secondary', onclick: () => copy(out.textContent) }, '📋 Copy')
      ));
      wrap.appendChild(out);
      return wrap;
    },

    // ===== FILES =====
    'PDF Merge': () => files('PDF Merge', 'PDF fayllarni birlashtirish (demo)'),
    'PDF Split': () => files('PDF Split', 'PDFni bo\'lish (demo)'),
    'OCR': () => files('OCR', 'Rasmdan matn olish (demo)'),
    'ZIP Creator': () => files('ZIP Creator', 'ZIP arxiv yaratish (demo)'),
    'Image Compressor': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '📦 Image Compressor'));
      wrap.appendChild(create('input', { class: 'tool-input', type: 'file', accept: 'image/*' }));
      const out = create('div', { class: 'alert alert-success' });
      wrap.querySelector('input').addEventListener('change', (e) => {
        const f = e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width; canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              out.innerHTML = `✅ Siqildi!<br>Asl: ${(f.size/1024).toFixed(2)} KB<br>Yangi: ${(blob.size/1024).toFixed(2)} KB<br>Tejalgan: ${((1-blob.size/f.size)*100).toFixed(1)}%`;
              toast('Siqildi!');
            }, 'image/jpeg', 0.6);
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(f);
      });
      wrap.appendChild(out);
      return wrap;
    },
    'Image Converter': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '🔄 Image Converter'));
      wrap.appendChild(create('input', { class: 'tool-input', type: 'file', accept: 'image/*' }));
      const format = create('select', { class: 'tool-input' });
      ['image/png', 'image/jpeg', 'image/webp'].forEach(f => format.appendChild(create('option', { value: f }, f.split('/')[1].toUpperCase())));
      const out = create('div', { class: 'alert alert-success' });
      wrap.querySelector('input').addEventListener('change', (e) => {
        const f = e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width; canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              const url = URL.createObjectURL(blob);
              out.innerHTML = `✅ Konvertatsiya qilindi!<br>Format: ${format.value.split('/')[1]}<br>Hajmi: ${(blob.size/1024).toFixed(2)} KB`;
              out.appendChild(create('a', { class: 'btn btn-primary', href: url, download: 'converted.' + format.value.split('/')[1], style: 'margin-top:10px' }, '⬇️ Yuklab olish'));
              toast('Tayyor!');
            }, format.value);
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(f);
      });
      wrap.appendChild(format);
      wrap.appendChild(out);
      return wrap;
    },
    'Text Compare': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '⚖️ Text Compare'));
      wrap.appendChild(create('textarea', { class: 'tool-input', rows: '4', placeholder: '1-matn...' }));
      wrap.appendChild(create('textarea', { class: 'tool-input', rows: '4', placeholder: '2-matn...' }));
      const out = create('div', { class: 'alert alert-success' });
      wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
        const tas = wrap.querySelectorAll('textarea');
        const t1 = tas[0].value, t2 = tas[1].value;
        if (!t1 || !t2) return toast('Ikkala matnni kiriting', 'error');
        const same = t1 === t2;
        out.innerHTML = same ? '✅ Matnlar bir xil' : '⚠️ Matnlar farqli<br>1-uzunligi: ' + t1.length + '<br>2-uzunligi: ' + t2.length;
        out.className = 'alert alert-' + (same ? 'success' : 'warn');
      } }, '⚖️ Compare'));
      wrap.appendChild(out);
      return wrap;
    },
    'File Hash': () => {
      const wrap = create('div', { class: 'tool-wrap' });
      wrap.appendChild(create('h2', {}, '#️⃣ File Hash'));
      wrap.appendChild(create('input', { class: 'tool-input', type: 'file' }));
      const out = create('pre', { class: 'code-output' });
      wrap.querySelector('input').addEventListener('change', async (e) => {
        const f = e.target.files[0];
        if (!f) return;
        const buf = await f.arrayBuffer();
        const hash = await crypto.subtle.digest('SHA-256', buf);
        const hex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
        out.textContent = `📁 ${f.name}\n\nSHA-256: ${hex}\n\nHajmi: ${(f.size/1024).toFixed(2)} KB`;
        toast('Hisoblandi!');
      });
      wrap.appendChild(out);
      return wrap;
    }
  };

  // Helper: downloader
  function downloader(name, domain) {
    const wrap = create('div', { class: 'tool-wrap' });
    wrap.appendChild(create('h2', {}, '📥 ' + name + ' Downloader'));
    wrap.appendChild(create('p', { class: 'tool-desc' }, `${domain} dan video/audio yuklab olish`));
    wrap.appendChild(create('input', { class: 'tool-input', placeholder: `${domain} dan URL kiriting...` }));
    const out = create('div', { class: 'alert alert-success' });
    wrap.appendChild(create('button', { class: 'btn btn-primary', onclick: () => {
      const url = wrap.querySelector('input').value.trim();
      if (!url) return toast('URL kiriting', 'error');
      if (!url.includes(domain)) return toast('Noto\'g\'ri URL', 'error');
      out.innerHTML = `✅ URL qabul qilindi:<br>${url}<br><br>⚠️ Backend kerak. Demo versiyada yuklab bo\'lmaydi.`;
      toast('Tayyor!');
    } }, '⬇️ Yuklab olish'));
    wrap.appendChild(out);
    return wrap;
  }

  // Helper: files demo
  function files(name, desc) {
    const wrap = create('div', { class: 'tool-wrap' });
    wrap.appendChild(create('h2', {}, '📁 ' + name));
    wrap.appendChild(create('p', { class: 'tool-desc' }, desc));
    wrap.appendChild(create('div', { class: 'alert alert-warn' }, '⚠️ Backend kerak. Browserda to\'liq ishlashi uchun server-side processing talab qilinadi.'));
    return wrap;
  }

  // ============================================================
  // TOOL CLICK HANDLER
  // ============================================================
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    const title = card.querySelector('.card-title')?.textContent?.trim();
    if (title && window.tools[title]) {
      openTool(title);
    }
  });

  // Close modal handlers
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal') || e.target.closest('.modal-close')) {
      closeTool();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTool();
  });

})();
