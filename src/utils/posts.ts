import { getCollection } from "astro:content";

export async function getPosts() {
  const posts = await getCollection("posts");
  return posts
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getTags(posts: Awaited<ReturnType<typeof getPosts>>) {
  const counts: Record<string, number> = {};
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));
}

export function filterByTag(
  posts: Awaited<ReturnType<typeof getPosts>>,
  tag: string,
) {
  return posts.filter((p) => p.data.tags.includes(tag));
}

export async function getStats() {
  const posts = await getPosts();
  const count = posts.length;
  if (count === 0) return { count: 0, runningDays: 0 };
  const timestamps = posts.map((p) => p.data.date.getTime());
  const firstDate = new Date(Math.min(...timestamps));
  const today = new Date();
  const utcToday = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const utcFirst = Date.UTC(firstDate.getUTCFullYear(), firstDate.getUTCMonth(), firstDate.getUTCDate());
  const runningDays = Math.max(1, Math.round((utcToday - utcFirst) / 86400000) + 1);
  return { count, runningDays };
}

export async function getArchives() {
  const posts = await getPosts();
  const map = new Map<string, number>();
  for (const post of posts) {
    const key = post.data.date.toLocaleDateString("zh-CN", { year: "numeric", month: "long" });
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()];
}

export async function getRecentPosts(limit = 5) {
  const posts = await getPosts();
  return posts.slice(0, limit);
}
