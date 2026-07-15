/* ============================================================
   KRYZEN HUB - Static API Client (Browser-Only)
   All 30+ APIs work directly in the browser - NO SERVER NEEDED!
   ============================================================ */

(async function() {
  // Load API handlers
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/gh/KRYZENSYS/kryzen-hub@main/api/index.js';
  document.head.appendChild(script);
  await new Promise(r => script.onload = r);

  const API = {
    async call(action, params = {}) {
      return await window.kryzenAPI.call(action, params);
    }
  };
  window.KryzenAPI = API;
  console.log('✅ KRYZEN HUB Static API ready - 30+ tools!');
})();
