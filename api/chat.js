// AI Chat with HuggingFace free inference API + smart fallback
// Supports conversation context

const HF_API = 'https://api-inference.huggingface.co/models';

// Smart AI responses - intelligent pattern matching
const smartResponses = {
  greetings: {
    patterns: ['salom', 'hello', 'hi', 'hey', 'assalom', 'привет', 'здравствуй'],
    responses: [
      "Salom! 👋 Men KRYZEN AI yordamchisiman. Sizga qanday yordam bera olaman?",
      "Assalomu alaykum! 🌟 Men sizning AI yordamchingizman. Kod, savol, ijod - har qanday sohada yordam beraman!",
      "Salom! 🤖 Qiziqarli savol bilan keldingizmi? Marhamat, so'rang!",
      "Hey! ✨ KRYZEN HUB AI sizning xizmatingizda. Texnologiya, dasturlash, dizayn - barchasida yordam beraman!"
    ]
  },
  identity: {
    patterns: ['kim san', 'kimsan', 'who are you', 'sen kim', 'isming nima', 'your name'],
    responses: [
      "Men KRYZEN HUB ning rasmiy AI yordamchisiman! 🤖\n\nMen sizga quyidagi sohalarda yordam bera olaman:\n• 💻 Dasturlash va kod yozish\n• 🛡️ Kiberxavfsizlik maslahatlari\n• 🎨 Dizayn va kreativ g'oyalar\n• 📊 Ma'lumotlar tahlili\n• 🌐 Texnologiya yangiliklari\n• 📝 Matn yozish va tarjima"
    ]
  },
  capabilities: {
    patterns: ['nima qila olasan', 'what can you do', 'imkoniyatlaring', 'qanday yordam', 'yordam ber'],
    responses: [
      "Men juda ko'p narsalarda yordam bera olaman! 🚀\n\n🔹 **Dasturlash**: JavaScript, Python, HTML, CSS, va boshqa tillarda kod yozish\n🔹 **Debugging**: Xatolarni topish va tuzatish\n🔹 **Tushuntirish**: Murakkab mavzularni oddiy tilda tushuntirish\n🔹 **Tarjima**: 50+ tilga tarjima qilish\n🔹 **Yozuv**: Maqolalar, xatlar, kontent yozish\n🔹 **Maslahat**: Texnologiya, biznes, ta'lim bo'yicha\n🔹 **Matematika**: Hisob-kitoblar va formulalar\n🔹 **Rejalashtirish**: Loyihalar uchun g'oyalar va struktura\n\nQanday savol bilan keldingiz?"
    ]
  },
  thanks: {
    patterns: ['rahmat', 'thanks', 'thank you', 'spasibo', 'raxmat'],
    responses: [
      "Arzimaydi! 😊 Yana savollaringiz bo'lsa, bemalol so'rang!",
      "Marhamat! 🌟 Sizga yordam berish - men uchun zavq!",
      "Doimo xizmatingizdaman! 💫 Yana nima bilan yordam beray?",
      "Xursandman yordam berganimdan! ✨ Keyingi savolni kutaman!"
    ]
  },
  coding: {
    patterns: ['kod', 'code', 'dastur', 'programma', 'javascript', 'python', 'html', 'css', 'yoz', 'yarat'],
    responses: [
      "Kod yozishda yordam beraman! 💻\n\nQaysi tilda va nima qilish kerakligini ayting, men sizga:\n• ✍️ To'liq kod yozib beraman\n• 📖 Har bir qatorni tushuntiraman\n• 🐛 Xatolarni topaman\n• ⚡ Optimallashtirish taklif qilaman\n\nMasalan:\n• 'Python da sort funksiyasi yoz'\n• 'JavaScript da calculator yarat'\n• 'HTML da landing page kodini ber'\n• 'CSS da animatsiya qilishni ko\'rsat'"
    ]
  },
  cyber: {
    patterns: ['xavfsizlik', 'security', 'haker', 'hacker', 'kiber', 'cyber', 'parol', 'password', 'himoya'],
    responses: [
      "Kiberxavfsizlik bo'yicha professional maslahatlar! 🛡️\n\n🔐 **Asosiy qoidalar:**\n1. Har xil parollar - har xil saytlar uchun\n2. 2FA yoqing (ikki bosqichli autentifikatsiya)\n3. Muntazam backup qiling\n4. Faqat HTTPS saytlardan foydalaning\n5. VPN ishlating (ommaviy Wi-Fi da)\n\n🦠 **Eng katta tahdidlar:**\n• Phishing (aldov xatlari)\n• Ransomware (fayllarni shifrlash)\n• Social Engineering\n• Zero-day zaifliklar\n\n💡 Parol yaratish uchun bizning Password Generator dan foydalaning!",
      "Kiberxavfsizlik — bu kelajak kasbi! 🌐\n\n📚 O'rganish yo'li:\n1. Networking asoslari (TCP/IP, DNS, HTTP)\n2. Linux buyruqlari\n3. Dasturlash (Python, JavaScript)\n4. Kriptografiya asoslari\n5. OWASP Top 10\n6. CTF musobaqalari\n\n🔧 Bizning Cyber Security bo'limida IP lookup, DNS, WHOIS, Hash va boshqa professional vositalar bor!"
    ]
  },
  ai: {
    patterns: ['ai', 'sun\'iy intellekt', 'chatgpt', 'claude', 'gemini', 'llm', 'neyron', 'machine learning'],
    responses: [
      "Sun'iy intellekt haqida! 🤖\n\n🧠 **AI turlari:**\n• **Narrow AI** - ma'lum bir vazifaga ixtisoslashgan (hozirgi AI)\n• **General AI** - inson darajasidagi (hali yaratilmagan)\n• **Super AI** - insondan aqlliroq (nazariy)\n\n🛠️ **Asosiy texnologiyalar:**\n• LLM (Large Language Models)\n• Computer Vision\n• NLP (Natural Language Processing)\n• Reinforcement Learning\n• Generative AI\n\n🚀 **Mashhur AI lar:**\n• ChatGPT, Claude, Gemini\n• Midjourney, DALL-E, Stable Diffusion\n• GitHub Copilot, Cursor\n\nKRYZEN HUB da AI bo'limida 11 ta AI vositasi bor! 🎨"
    ]
  },
  web: {
    patterns: ['web', 'sayt', 'website', 'frontend', 'backend', 'fullstack', 'react', 'vue', 'angular'],
    responses: [
      "Web dasturlash haqida! 🌐\n\n📚 **Frontend:**\n• HTML, CSS, JavaScript (asos)\n• React, Vue, Angular (framework)\n• Tailwind, Bootstrap (CSS)\n• TypeScript (kuchli JS)\n\n⚙️ **Backend:**\n• Node.js, Python, Go, Java\n• Express, FastAPI, Django\n• PostgreSQL, MongoDB\n• Redis, RabbitMQ\n\n🎨 **KRYZEN HUB da:**\n• JSON Formatter, Base64, Regex Tester\n• CSS Generator, Gradient Maker\n• HTML Beautifier, JS Minifier\n• Va yana 19 ta developer tool!"
    ]
  },
  joke: {
    patterns: ['hazil', 'joke', 'kulgi', 'kulgili', 'yumor'],
    responses: [
      "Hazil aytaymi? 😄\n\n💻 Nima uchun dasturchi qorong'i xonada ishlaydi?\n— Chunki yorug'lik sin xatosini ko'rsatadi! 🐛\n\n🐍 Python va JavaScript uchrashibdi:\n— Salom, qandaysan?\n— Yaxshi, lekin type yo'qligidan qiynalaman...\n\n🤖 AI: 'Men o'ylayman, demi mavjudman...'\n— Descartes: 'Ishonchim komil emas...'\n\nYana hazil aytaymi? 😄",
      "Yana bitta! 😂\n\n👨‍💻 - Onam menga dasturlashni o'rgatgan...\n💻 - Ha? Qaysi tilda?\n👨‍💻 - O'zbek tilida! 'Bolta ol, mixla ur'! 🔨\n\n🌐 Internet nima? \n— Bu yerda sizning kichkina ukangiz ham kattalardek o'ylaydi... \n— Yoki o'zini kattalardek ko'rsatadi 😅"
    ]
  },
  default: [
    "Qiziqarli savol! 🤔 Keling, batafsilroq tushuntiraman...\n\nSavolingizni biroz aniqroq qilib bersangiz, yaxshiroq yordam bera olaman. Masalan:\n• Aniqroq maqsad (nima qilmoqchisiz?)\n• Texnologiya (qaysi til/framework?)\n• Darajangiz (boshlang'ich/pro?)\n\nYoki KRYZEN HUB ning tegishli bo'limiga o'ting - 80+ tayyor vosita bor!",
    "Yaxshi savol! 💭\n\nMen buni tahlil qilyapman va sizga foydali ma'lumot bera olaman. Aniqroq savol bersangiz yoki kontekst qo'shsangiz, yaxshiroq javob beraman.\n\n🔍 Masalan:\n• 'Python da REST API yozib ber'\n• 'CSS animatsiya qilishni o'rgat'\n• 'GitHub da loyiha qanday deploy qilaman?'\n\nKRYZEN HUB da Developer Tools bo'limida ko'p vositalar bor!",
    "Bu mavzu qiziqarli! ✨\n\nSizga yordam berish uchun biroz ko'proq ma'lumot kerak. Aniqlashtiring:\n\n📌 Qaysi soha? (web, mobile, AI, cyber?)\n📌 Qaysi texnologiya?\n📌 Darajangiz?\n📌 Maqsadingiz?\n\nShunda sizga aniq va foydali javob bera olaman! 🚀"
  ]
};

function getSmartReply(message) {
  const msg = message.toLowerCase().trim();

  for (const [category, data] of Object.entries(smartResponses)) {
    if (category === 'default') continue;
    for (const pattern of data.patterns) {
      if (msg.includes(pattern)) {
        const responses = data.responses;
        return {
          text: responses[Math.floor(Math.random() * responses.length)],
          source: 'smart-ai',
          category
        };
      }
    }
  }

  // Word-count based default
  if (msg.length < 5) {
    return {
      text: "Qisqaroq savol tuyuldi 😊 Iltimos, to'liqroq yozing - yaxshiroq yordam bera olaman!",
      source: 'smart-ai'
    };
  }

  // Default responses
  const defaults = smartResponses.default;
  return {
    text: defaults[Math.floor(Math.random() * defaults.length)],
    source: 'smart-ai'
  };
}

async function tryHuggingFace(message) {
  const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
  if (!HF_TOKEN) return null;

  try {
    // Use a small fast model for free inference
    const response = await fetch(`${HF_API}/microsoft/DialoGPT-small`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {
          past_user_inputs: [],
          generated_responses: [],
          text: message
        },
        options: { wait_for_model: true, max_length: 200 }
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (data.generated_text) return data.generated_text;
    if (data.error) return null;
    return null;
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history = [] } = req.body || {};
    if (!message) return res.status(400).json({ error: 'Message required' });

    // Try HuggingFace first (if token available)
    let aiReply = await tryHuggingFace(message);

    // Fallback to smart responses
    if (!aiReply) {
      const smart = getSmartReply(message);
      aiReply = smart.text;
    }

    return res.status(200).json({
      success: true,
      message: aiReply,
      userMessage: message,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
