// News - Real news from various free sources
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { category = 'technology', country = 'us', query = '' } = req.query;

    // Use Hacker News API (no key, very reliable)
    let articles = [];

    if (category === 'tech' || category === 'technology') {
      // Get top stories from Hacker News
      const topRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      const ids = (await topRes.json()).slice(0, 20);

      const storyPromises = ids.map(async (id) => {
        try {
          const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          const s = await r.json();
          if (s && s.title && s.url) {
            return {
              title: s.title,
              url: s.url,
              source: new URL(s.url).hostname.replace('www.', ''),
              author: s.by,
              score: s.score,
              comments: s.descendants || 0,
              time: new Date(s.time * 1000).toLocaleString('uz-UZ'),
              category: 'tech'
            };
          }
        } catch (e) {}
        return null;
      });

      const stories = await Promise.all(storyPromises);
      articles = stories.filter(s => s !== null);
    } else {
      // For other categories, use Reddit JSON API (no auth needed)
      const subredditMap = {
        'world': 'worldnews',
        'business': 'business',
        'science': 'science',
        'cyber': 'cybersecurity',
        'programming': 'programming',
        'ai': 'MachineLearning',
        'gaming': 'gaming',
        'sports': 'sports',
        'entertainment': 'entertainment'
      };
      const sub = subredditMap[category] || 'technology';

      try {
        const r = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=20`);
        const data = await r.json();
        articles = (data.data?.children || []).map(item => ({
          title: item.data.title,
          url: item.data.url,
          source: 'reddit.com',
          author: item.data.author,
          score: item.data.score,
          comments: item.data.num_comments,
          time: new Date(item.data.created_utc * 1000).toLocaleString('uz-UZ'),
          category,
          thumbnail: item.data.thumbnail
        }));
      } catch (e) {
        // Fallback to HN
        const topRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const ids = (await topRes.json()).slice(0, 15);
        const storyPromises = ids.map(async (id) => {
          const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          const s = await r.json();
          if (s && s.title) {
            return {
              title: s.title,
              url: s.url || `https://news.ycombinator.com/item?id=${id}`,
              source: 'Hacker News',
              author: s.by,
              score: s.score || 0,
              time: new Date((s.time || 0) * 1000).toLocaleString('uz-UZ')
            };
          }
          return null;
        });
        const stories = await Promise.all(storyPromises);
        articles = stories.filter(s => s !== null);
      }
    }

    return res.status(200).json({
      success: true,
      category,
      count: articles.length,
      articles
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
