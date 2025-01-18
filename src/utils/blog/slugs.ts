export const getBlogPostLink = (id: string) => {
  return `/blog/${id}`;
};

export const getCategoryLink = (slug: string): string => {
  return `/blog/category/${slug}`;
};
