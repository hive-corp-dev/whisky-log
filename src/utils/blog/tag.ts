import type { BlogTag } from "@/types/blog";
import { blogTags } from "@/data/blog/tag";

export const getTagData = (slug: string): BlogTag => {
  const tagData = blogTags.find((tag) => tag.slug === slug);

  if (!tagData) {
    throw new Error(`Tag not found: ${slug}`);
  }

  return tagData;
};
