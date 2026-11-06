import { getCollection } from "astro:content";

// 比較記事を新しい順に返す。開発サーバーでは下書きも含める（公開前の記事を確認できるようにするため）
export const getComparePosts = async () => {
  const posts = await getCollection("compare", ({ data }) => import.meta.env.DEV || data.draft === false);
  return posts.sort((a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime());
};
