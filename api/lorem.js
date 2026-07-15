// Lorem Ipsum Generator
const loremWords = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');

function generateWords(count) {
  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
  }
  return result.join(' ');
}

function generateSentence(wordCount) {
  const sentence = generateWords(wordCount);
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

function generateParagraph(sentences) {
  let para = [];
  for (let i = 0; i < sentences; i++) {
    para.push(generateSentence(8 + Math.floor(Math.random() * 12)));
  }
  return para.join(' ');
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { paragraphs = 3, sentences = 5 } = req.query;
  const pCount = parseInt(paragraphs) || 3;
  const sCount = parseInt(sentences) || 5;
  const text = Array(pCount).fill(0).map(() => generateParagraph(sCount)).join('\n\n');

  return res.status(200).json({
    success: true,
    paragraphs: pCount,
    sentences: sCount,
    text,
    wordCount: text.split(/\s+/).length
  });
}
