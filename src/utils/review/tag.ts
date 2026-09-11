import type { ReviewTag } from "@/types/review";
import { reviewTags } from "@/data/review/tag";

export const getReviewTagData = (slug: string): ReviewTag => {
  const tagData = reviewTags.find((tag) => tag.slug === slug);

  if (!tagData) {
    throw new Error(`Tag not found: ${slug}`);
  }

  return tagData;
};
