export const formatDate = (publishedAt: Date): string => {
  return publishedAt.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const convertToJST = (publishedAt: Date): string => {
  const offsetDate = new Date(publishedAt.getTime() - publishedAt.getTimezoneOffset() * 60000);
  const localISO = offsetDate.toISOString().slice(0, -1) + "+09:00";
  return localISO;
};
