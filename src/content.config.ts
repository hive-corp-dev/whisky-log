import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

// 国（産地）。review の country と Flag コンポーネントで共通利用
const Countries = ["japan", "scotland", "ireland", "us", "uk", "canada", "india", "taiwan"] as const;

// レビュー記事のカテゴリ（産地別）。src/data/review/category.ts の slug と一致させること
const ReviewCategories = ["japanese", "scotch", "irish", "american", "english", "canadian", "indian", "taiwanese"] as const;

// レビュー記事のタグ（分類）。src/data/review/tag.ts の slug と一致させること
const ReviewTags = [
  "blended",
  "single-malt",
  "blended-malt",
  "grain",
  "single-grain",
  "bourbon",
  "rye",
  "corn",
] as const;

// 飲み方。src/utils/review/spec.ts の WAY_LABELS と一致させること
export const Ways = ["straight", "rock", "highball"] as const;

// 1〜5 の 0.5 刻み
const star = z
  .number()
  .min(1)
  .max(5)
  .refine((v) => Number.isInteger(v * 2), { message: "評価は 0.5 刻みで指定してください" });

const review = defineCollection({
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/review" }),
  schema: ({ image }) =>
    z.object({
      draft: z.boolean(),
      title: z.string(),
      description: z.string(),
      image: image(),
      category: z.enum(ReviewCategories),
      tags: z.array(z.enum(ReviewTags)),
      country: z.enum(Countries).optional(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),

      // --- 基本情報（スペック表に表示） ---
      name: z.string().optional(), // 正式な商品名（title と別に持つ）
      maker: z.string().optional(),
      distillery: z.string().optional(),
      casks: z.array(z.string()).optional(),
      abv: z.number().optional(), // 度数 (%)
      volume: z.number().optional(), // 容量 (ml)
      price: z.number().optional(), // 参考価格（円）
      priceCheckedAt: z.string().optional(), // 価格を確認した年月 "2026-09"

      // --- 導入・評価 ---
      intro: z.string().optional(), // 導入文。空行区切りで段落になる
      verdict: z.array(z.string()).max(4).optional(), // 冒頭の結論（1〜4 行）
      rating: z
        .object({
          straight: star,
          rock: star,
          highball: star,
          cost: star,
          overall: star,
        })
        .optional(),
      // おすすめの飲み方。1 つなら文字列、複数なら配列（例: ["straight", "highball"]）
      recommendedWay: z.union([z.enum(Ways), z.array(z.enum(Ways)).min(1)]).optional(),

      // --- 収益導線 ---
      // false にすると購入ボックスを出さず、楽天の取得もしない（日本未発売の銘柄など）
      affiliate: z.boolean().default(true),
      // 各 EC の商品ページ URL（アフィリエイトリンク）。未指定なら searchKeyword で検索リンクを生成
      links: z
        .object({
          amazon: z.url().optional(),
          rakuten: z.url().optional(),
          yahoo: z.url().optional(),
        })
        .optional(),
      searchKeyword: z.string().optional(),
      // 楽天の商品コード（"shop-name:10012345"）。scripts/fetch-rakuten.mjs が画像・価格・リンクを取得する
      rakutenItemCode: z.string().optional(),
    }),
});

export const collections = { review };
