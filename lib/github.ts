/**
 * Server-only: fetch GitHub stats for a user (public data).
 * Cached with Next.js fetch (revalidate 24h). Set GITHUB_TOKEN in env for higher rate limits.
 */
const GITHUB_USERNAME = "RKPinata";
const CACHE_REVALIDATE_SECONDS = 86400; // 24h

const cache = { next: { revalidate: CACHE_REVALIDATE_SECONDS } as const };

function authHeaders(): HeadersInit {
  const h: HeadersInit = {};
  if (process.env.GITHUB_TOKEN) {
    (h as Record<string, string>)["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

export interface GitHubStats {
  commits: number | null;
  stars: number | null;
  followers: number | null;
  pullRequests: number | null;
}

export async function getGitHubStats(): Promise<GitHubStats> {
  const [commits, stars, followers, pullRequests] = await Promise.all([
    getCommitCount(),
    getTotalStars(),
    getFollowers(),
    getPullRequestCount(),
  ]);
  return { commits, stars, followers, pullRequests };
}

/** Public commit count (search: author). */
async function getCommitCount(): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.github.com/search/commits?q=author:${GITHUB_USERNAME}`,
      {
        headers: { Accept: "application/vnd.github.cloak-preview", ...authHeaders() },
        ...cache,
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { total_count?: number };
    return typeof data.total_count === "number" ? data.total_count : null;
  } catch {
    return null;
  }
}

/** Total stargazers across all public repos. */
async function getTotalStars(): Promise<number | null> {
  try {
    let total = 0;
    let page = 1;
    const perPage = 100;
    while (true) {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=${perPage}&page=${page}&type=owner`,
        { headers: authHeaders(), ...cache }
      );
      if (!res.ok) return null;
      const repos = (await res.json()) as Array<{ stargazers_count?: number }>;
      for (const r of repos) total += typeof r.stargazers_count === "number" ? r.stargazers_count : 0;
      if (repos.length < perPage) break;
      page++;
      if (page > 10) break; // safety cap
    }
    return total;
  } catch {
    return null;
  }
}

/** Follower count. */
async function getFollowers(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: authHeaders(),
      ...cache,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { followers?: number };
    return typeof data.followers === "number" ? data.followers : null;
  } catch {
    return null;
  }
}

/** Open/merged PR count (author). */
async function getPullRequestCount(): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.github.com/search/issues?q=author:${GITHUB_USERNAME}+type:pr`,
      { headers: authHeaders(), ...cache }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { total_count?: number };
    return typeof data.total_count === "number" ? data.total_count : null;
  } catch {
    return null;
  }
}
