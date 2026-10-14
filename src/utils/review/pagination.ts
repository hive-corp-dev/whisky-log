// レビュー一覧（すべて／産地別／種類別）のページ送り。1 ページ 12 件（PC 3 列・2 列どちらでも端数が出ない）
export const REVIEW_PER_PAGE = 12;

export interface ReviewPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  /** 1 ページ目の URL（末尾スラッシュなし）。2 ページ目以降は `${baseUrl}/page/${n}` */
  baseUrl: string;
}

export const getTotalPages = (count: number): number => Math.max(1, Math.ceil(count / REVIEW_PER_PAGE));

/** page（1 始まり）のぶんだけ切り出す */
export const slicePage = <T>(items: T[], page: number): T[] =>
  items.slice((page - 1) * REVIEW_PER_PAGE, page * REVIEW_PER_PAGE);

export const getPageUrl = (baseUrl: string, page: number): string =>
  page <= 1 ? `${baseUrl}/` : `${baseUrl}/page/${page}/`;

/** 2 ページ目以降のページ番号（getStaticPaths 用） */
export const getRestPages = (count: number): number[] => {
  const total = getTotalPages(count);
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => i + 2);
};
