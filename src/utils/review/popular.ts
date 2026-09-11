import type { CollectionEntry } from "astro:content";
import { popularReviewIds } from "@/data/review/popular";
import { getSortedReviewPosts } from "@/utils/review/posts";

/**
 * 人気順に並べた記事を返す。
 * src/data/review/popular.ts の順に並べ、そこに無い記事は新着順で後ろに付ける
 */
export const getPopularReviewPosts = (posts: CollectionEntry<"review">[], limit?: number) => {
  const byId = new Map(posts.map((post) => [post.id, post]));
  const ranked = popularReviewIds.map((id) => byId.get(id)).filter((post): post is CollectionEntry<"review"> => !!post);
  const rankedIds = new Set(ranked.map((post) => post.id));
  const rest = getSortedReviewPosts(posts.filter((post) => !rankedIds.has(post.id)));
  const all = [...ranked, ...rest];
  return limit ? all.slice(0, limit) : all;
};
