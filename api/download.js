// Social Media Downloader - Universal downloader
// Supports: YouTube, Instagram, TikTok, Twitter, Facebook, etc.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { url, format = 'mp4', quality = 'best' } = req.body || {};
    if (!url) return res.status(400).json({ error: 'URL required' });

    // Detect platform
    let platform = 'unknown';
    if (url.includes('youtube.com') || url.includes('youtu.be')) platform = 'youtube';
    else if (url.includes('instagram.com')) platform = 'instagram';
    else if (url.includes('tiktok.com')) platform = 'tiktok';
    else if (url.includes('twitter.com') || url.includes('x.com')) platform = 'twitter';
    else if (url.includes('facebook.com') || url.includes('fb.watch')) platform = 'facebook';
    else if (url.includes('reddit.com')) platform = 'reddit';
    else if (url.includes('pinterest.com')) platform = 'pinterest';
    else if (url.includes('threads.net')) platform = 'threads';
    else if (url.includes('vimeo.com')) platform = 'vimeo';
    else if (url.includes('soundcloud.com')) platform = 'soundcloud';
    else if (url.includes('t.me') || url.includes('telegram.me')) platform = 'telegram';

    if (platform === 'unknown') {
      return res.status(400).json({ error: 'Unsupported URL. Supported: YouTube, Instagram, TikTok, Twitter, Facebook, Reddit, Pinterest, Threads, Vimeo, SoundCloud, Telegram' });
    }

    // Use yt-dlp-style approach via public APIs
    // We'll use a few different services based on platform

    let result = {
      success: true,
      platform,
      url,
      format,
      quality,
      downloadOptions: [],
      message: 'Download ready'
    };

    // For YouTube - use yt-dlp API alternatives
    if (platform === 'youtube') {
      // Extract video ID
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

      result.videoId = videoId;
      result.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      result.embed = `https://www.youtube.com/embed/${videoId}`;

      // Multiple download services as fallbacks
      result.downloadOptions = [
        {
          quality: '1080p',
          format: 'mp4',
          url: `https://www.y2mate.com/youtube/${videoId}`,
          service: 'Y2Mate'
        },
        {
          quality: '720p',
          format: 'mp4',
          url: `https://ssyoutube.com/watch?v=${videoId}`,
          service: 'SSYoutube'
        },
        {
          quality: 'audio',
          format: 'mp3',
          url: `https://ytmp3.cc/youtube-to-mp3/${videoId}`,
          service: 'YTMP3'
        }
      ];

      result.message = 'YouTube video ma\'lumotlari topildi. Yuklab olish uchun xizmatlardan birini ishlating.';
    }
    else if (platform === 'instagram') {
      // Instagram - use public downloader API
      try {
        const r = await fetch(`https://api.savefrom.biz/api/convert?url=${encodeURIComponent(url)}`);
        const text = await r.text();
        // Parse response if available
      } catch (e) {}

      result.downloadOptions = [
        { quality: 'HD', format: 'mp4', url: `https://snapinsta.app/?url=${encodeURIComponent(url)}`, service: 'SnapInsta' },
        { quality: 'SD', format: 'mp4', url: `https://saveinsta.app/?url=${encodeURIComponent(url)}`, service: 'SaveInsta' }
      ];
      result.message = 'Instagram media tayyor. Yuklab olish uchun xizmatdan foydalaning.';
    }
    else if (platform === 'tiktok') {
      result.downloadOptions = [
        { quality: 'HD', format: 'mp4', url: `https://snaptik.app/?url=${encodeURIComponent(url)}`, service: 'SnapTik' },
        { quality: 'no-watermark', format: 'mp4', url: `https://musicallydown.com/?url=${encodeURIComponent(url)}`, service: 'MusicallyDown' }
      ];
      result.message = 'TikTok videosiz yuklab olish uchun xizmatdan foydalaning.';
    }
    else {
      // Generic
      result.downloadOptions = [
        { quality: 'best', format, url: `https://ssyoutube.com/?url=${encodeURIComponent(url)}`, service: 'Generic' }
      ];
      result.message = `${platform} uchun yuklab olish havolalari tayyor.`;
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
