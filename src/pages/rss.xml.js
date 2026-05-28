import rss from "@astrojs/rss";
import { getPosts } from "../utils/posts";

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: "Notes",
    description: "个人笔记 — 技术、数学与思考",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description || "",
      pubDate: post.data.date,
      link: `/posts/${post.slug}/`,
    })),
  });
}
