// Dictionary - Word definitions
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { word } = req.query;
    if (!word) return res.status(400).json({ error: 'Word required' });

    // Free Dictionary API
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (!response.ok) {
      return res.status(404).json({ error: 'Word not found' });
    }
    const data = await response.json();

    return res.status(200).json({
      success: true,
      word: data[0].word,
      phonetic: data[0].phonetic,
      phonetics: data[0].phonetics,
      meanings: data[0].meanings.map(m => ({
        partOfSpeech: m.partOfSpeech,
        definitions: m.definitions.slice(0, 3),
        synonyms: m.synonyms?.slice(0, 5),
        antonyms: m.antonyms?.slice(0, 5)
      }))
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
