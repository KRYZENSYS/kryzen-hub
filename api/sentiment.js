// Sentiment Analysis - Basic text sentiment
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ error: 'Text required' });

    // Simple sentiment analysis (works for English, basic for other languages)
    const positiveWords = ['good', 'great', 'awesome', 'amazing', 'wonderful', 'fantastic', 'excellent', 'perfect', 'love', 'best', 'happy', 'joy', 'yaxshi', 'zor', "a'lo", 'zo\'r', 'mukammal', 'haqiqatan', 'juda yaxshi', '❤️', '😍', '😊', '🎉', '👍', 'rahmat', 'mashallah'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'sad', 'angry', 'yomon', 'yaxshi emas', 'xafa', "o'ldir", 'sovuq', 'issiq emas', '😢', '😡', '👎', 'rad'];

    const lower = text.toLowerCase();
    let score = 0;
    let positive = 0;
    let negative = 0;

    positiveWords.forEach(w => { if (lower.includes(w)) { positive++; score += 1; } });
    negativeWords.forEach(w => { if (lower.includes(w)) { negative++; score -= 1; } });

    const total = positive + negative;
    const normalizedScore = total > 0 ? (score / total) : 0;

    let label = 'neutral';
    if (normalizedScore > 0.2) label = 'positive';
    else if (normalizedScore < -0.2) label = 'negative';

    return res.status(200).json({
      success: true,
      text: text.substring(0, 200),
      score: normalizedScore,
      positive,
      negative,
      label,
      emoji: label === 'positive' ? '😊' : label === 'negative' ? '😢' : '😐'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
