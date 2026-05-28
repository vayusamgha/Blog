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
