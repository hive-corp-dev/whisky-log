import type { CollectionEntry } from "astro:content";

export const getSortedBlogPosts = (posts: CollectionEntry<"blog">[]) => {
  return posts.sort((a, b) => {
    const aDate: Date = new Date(a.data.publishedAt);
    const bDate: Date = new Date(b.data.publishedAt);
    return bDate.getTime() - aDate.getTime();
  });
};
