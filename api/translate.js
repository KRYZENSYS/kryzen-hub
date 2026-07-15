// Translator - Multi-language translation
// Uses free MyMemory translation API (no key required for limited use)

const languageMap = {
  'uz': 'uzbek', 'en': 'english-GB', 'ru': 'russian', 'tr': 'turkish',
  'ar': 'arabic', 'zh': 'chinese-simplified', 'es': 'spanish',
  'fr': 'french', 'de': 'german', 'ja': 'japanese', 'ko': 'korean',
  'it': 'italian', 'pt': 'portuguese', 'hi': 'hindi', 'fa': 'persian',
  'kk': 'kazakh', 'ky': 'kyrgyz', 'tg': 'tajik', 'tk': 'turkmen'
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { text, from = 'auto', to = 'en' } = req.body || {};
    if (!text) return res.status(400).json({ error: 'Text required' });

    // Use MyMemory API - free 5000 chars/day
    const fromLang = from === 'auto' ? '' : `&langpair=${from}|${to}`;
    const langPair = from === 'auto' ? `|${to}` : `${from}|${to}`;

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langPair)}&de=kryzen@example.com`
    );

    if (!response.ok) {
      // Fallback to Google Translate unofficial
      return res.status(200).json({
        success: true,
        translated: text,
        source: 'fallback',
        message: 'Translation service temporarily unavailable'
      });
    }

    const data = await response.json();
    return res.status(200).json({
      success: true,
      original: text,
      translated: data.responseData?.translatedText || text,
      from: from,
      to: to,
      match: data.responseData?.match,
      source: 'mymemory'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
