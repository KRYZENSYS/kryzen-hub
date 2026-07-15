/* ============================================================
   KRYZEN HUB - Static API Client (Browser-Only)
   All 30+ APIs work directly in the browser - NO SERVER NEEDED!
   ============================================================ */

(async function() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/gh/KRYZENSYS/kryzen-hub@main/api/index.js';
  document.head.appendChild(script);
  await new Promise(r => { script.onload = r; script.onerror = r; });

  const API = {
    async call(action, params = {}) {
      if (window.kryzenAPI) return await window.kryzenAPI.call(action, params);
      return { error: 'API loading...', action };
    }
  };
  window.KryzenAPI = API;
  console.log('✅ KRYZEN HUB Static API ready - 30+ tools!');
})();
