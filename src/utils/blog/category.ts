import type { BlogCategory } from "@/types/blog";
import { blogCategories } from "@/data/blog/category.ts";

// frontmatterのcategoryの値から、カテゴリーのデータを取得する関数
export const getCategoryData = (slug: string): BlogCategory => {
  const categoryData = blogCategories.find((category) => category.slug === slug);

  if (!categoryData) {
    throw new Error(`Category not found: ${slug}`);
  }

  return categoryData;
};
