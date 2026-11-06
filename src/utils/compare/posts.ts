import { getCollection } from "astro:content";

// 公開中の比較記事を新しい順に返す
export const getComparePosts = async () => {
  const posts = await getCollection("compare", ({ data }) => data.draft === false);
  return posts.sort((a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime());
};
