// Text Summarizer
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { text, ratio = 0.3 } = req.body || {};
    if (!text) return res.status(400).json({ error: 'Text required' });

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);

    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
      'va', 'bilan', 'uchun', 'ham', 'yoki', 'lekin', 'ammo', 'mening', 'sening', 'uning',
      'bizning', 'sizning', 'ularning', 'bu', 'shu', 'u', 'biz', 'siz', 'ular'
    ]);

    const wordFreq = {};
    words.forEach(word => {
      const w = word.toLowerCase().replace(/[^\w]/g, '');
      if (w && !stopWords.has(w) && w.length > 2) {
        wordFreq[w] = (wordFreq[w] || 0) + 1;
      }
    });

    const sentenceScores = sentences.map((sentence, idx) => {
      const sentenceWords = sentence.toLowerCase().split(/\s+/);
      let score = 0;
      sentenceWords.forEach(w => {
        const clean = w.replace(/[^\w]/g, '');
        if (wordFreq[clean]) score += wordFreq[clean];
      });
      return { sentence: sentence.trim(), score: score / Math.max(sentenceWords.length, 1), index: idx };
    });

    const summaryCount = Math.max(1, Math.floor(sentences.length * ratio));
    const topSentences = sentenceScores
      .sort((a, b) => b.score - a.score)
      .slice(0, summaryCount)
      .sort((a, b) => a.index - b.index);

    const summary = topSentences.map(s => s.sentence).join('. ') + '.';

    return res.status(200).json({
      success: true,
      original: { words: words.length, sentences: sentences.length },
      summary,
      summaryWords: summary.split(/\s+/).length,
      compression: ((1 - summary.split(/\s+/).length / words.length) * 100).toFixed(1) + '%',
      topWords: Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([w, c]) => ({ word: w, count: c }))
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
