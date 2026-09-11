export const getReviewPostLink = (id: string, category: string): string => {
  return `/review/${category}/${id}`;
};

export const getReviewCategoryLink = (category: string): string => {
  return `/review/${category}`;
};

export const getReviewTagLink = (tag: string): string => {
  return `/review/type/${tag}`;
};
