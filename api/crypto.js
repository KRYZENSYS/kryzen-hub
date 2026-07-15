// Crypto Prices - Real-time crypto from CoinGecko (free, no key)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { ids = 'bitcoin,ethereum,tether,binancecoin,solana,cardano,ripple,dogecoin,polkadot,tron', vs = 'usd' } = req.query;

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vs}&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true&include_last_updated_at=true`
    );
    const data = await response.json();

    // Get top trending
    const trendingRes = await fetch('https://api.coingecko.com/api/v3/search/trending');
    const trending = await trendingRes.json();

    return res.status(200).json({
      success: true,
      vs,
      prices: data,
      trending: trending.coins?.slice(0, 10).map(c => ({
        id: c.item.id,
        name: c.item.name,
        symbol: c.item.symbol,
        marketCapRank: c.item.market_cap_rank,
        thumb: c.item.thumb
      })) || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
