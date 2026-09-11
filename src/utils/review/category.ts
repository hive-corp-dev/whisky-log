import type { ReviewCategory } from "@/types/review";
import { reviewCategories } from "@/data/review/category.ts";

export const getReviewCategoryData = (slug: string): ReviewCategory => {
  const categoryData = reviewCategories.find((category) => category.slug === slug);

  if (!categoryData) {
    throw new Error(`Category not found: ${slug}`);
  }

  return categoryData;
};
