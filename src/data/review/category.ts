import type { ReviewCategory } from "@/types/review";

export const reviewCategories: ReviewCategory[] = [
  {
    slug: "japanese",
    label: "ジャパニーズ",
    country: "japan",
  },
  {
    slug: "scotch",
    label: "スコッチ",
    country: "scotland",
  },
  {
    slug: "irish",
    label: "アイリッシュ",
    country: "ireland",
  },
  {
    slug: "american",
    label: "アメリカン",
    country: "us",
  },
  {
    slug: "english",
    label: "イングリッシュ",
    country: "uk",
  },
  {
    slug: "canadian",
    label: "カナディアン",
    country: "canada",
  },
  {
    slug: "indian",
    label: "インディアン",
    country: "india",
  },
  {
    slug: "taiwanese",
    label: "台湾",
    country: "taiwan",
  },
];

export const reviewCategoryPaths = reviewCategories.map((category) => {
  return {
    params: {
      category: category.slug,
    },
  };
});
