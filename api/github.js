// GitHub API - Real GitHub data with rate limit handling
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ error: 'Username required' });

    const headers = {
      'User-Agent': 'KRYZEN-HUB',
      'Accept': 'application/vnd.github.v3+json'
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // Get user
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userRes.ok) {
      return res.status(userRes.status).json({ error: 'User not found' });
    }
    const user = await userRes.json();

    // Get repos
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
    const repos = await reposRes.json();

    // Calculate stats
    const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);
    const languages = {};
    repos.forEach(repo => {
      if (repo.language) languages[repo.language] = (languages[repo.language] || 0) + 1;
    });
    const topLanguages = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Top 5 repos by stars
    const topRepos = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map(r => ({
        name: r.name,
        description: r.description,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        url: r.html_url
      }));

    return res.status(200).json({
      success: true,
      user: {
        login: user.login,
        name: user.name,
        bio: user.bio,
        avatar: user.avatar_url,
        url: user.html_url,
        location: user.location,
        company: user.company,
        blog: user.blog,
        twitter: user.twitter_username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        publicRepos: user.public_repos,
        publicGists: user.public_gists,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      },
      stats: {
        totalStars,
        totalForks,
        topLanguages
      },
      topRepos
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
