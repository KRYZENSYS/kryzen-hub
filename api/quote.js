// Random Quote & Joke API
const quotes = [
  { text: "Kod - bu she'riyat. Har bir satrda ma'no bor, har bir funksiyada hikoya.", author: "KRYZEN" },
  { text: "Eng yaxshi dasturchi - bu dangasa dasturchi. U har bir narsani avtomatlashtiradi.", author: "Larry Wall" },
  { text: "Dasturlash - bu kelajak kasbi. Bugun o'rganish, ertaga hukmronlik qilish.", author: "KRYZEN" },
  { text: "Xato - bu o'rganish, mukammallik - bu yo'l.", author: "Confucius" },
  { text: "Texnologiya insoniyat uchun, aksincha emas.", author: "KRYZEN" },
  { text: "Bilim - kuch. Bilim almashish - super kuch.", author: "KRYZEN" },
  { text: "Bir satr kod ming so'zga teng.", author: "Linus Torvalds" },
  { text: "Innovatsiya - bu 1% ilhom va 99% ter.", author: "Thomas Edison" },
  { text: "Muvaffaqiyat - bu tayyor bo'lgandagi imkoniyat.", author: "Oprah Winfrey" },
  { text: "Sizning eng yaxshi ishingiz - bu sizga yoqadigan ish.", author: "Steve Jobs" }
];

const jokes = [
  "Dasturchi nima uchun qorong'i xonada ishlaydi? Chunki yorug'lik sin xatosini ko'rsatadi! 🐛",
  "Onam menga dasturlashni o'rgatgan: 'Bolta ol, mixla ur' - bu JavaScript edi! 🔨",
  "AI: 'Men o'ylayman, demak mavjudman' - Descartes: 'Ishonchim komil emas' 🤖",
  "Frontend vs Backend: Frontend chiroyli, backend ishlaydi (yoki aksincha!) 😄",
  "Kod ishlaydi - hech kim tegmaydi! Koding ishlaydi - endi huzur qil! ☕",
  "Nima uchun JavaScript promiselardan foydalanadi? Chunki u va'da berib bajarmaydi! 😅",
  "Git commit: 'fix bug' - haqiqat: 'hammasini buzdim' 🤡",
  "Production ishlaydi, localhost buzilgan - bu kiberxavfsizlik demo'zi! 🎭",
  "Wi-Fi yo'q - bu ham tabiiy ofat. Qayta ishlash - bu YAGONA YECHIM! 🌊",
  "Nima uchun Python sevgilisi yo'q? Chunki u hammaga yoqadi! 🐍❤️"
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { type = 'quote' } = req.query;
  const source = type === 'joke' ? jokes : quotes;
  const item = source[Math.floor(Math.random() * source.length)];

  return res.status(200).json({
    success: true,
    type,
    ...item
  });
}
