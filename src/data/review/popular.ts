// 人気のレビュー（フッターなどで使う並び順）
// 閲覧数を取れるようになるまでは、ここに記事の id（ファイル名から .mdx を除いたもの）を
// 上位から順に並べて管理する。存在しない id は無視され、足りない分は新着で補われる。
export const popularReviewIds: string[] = [
  "busker-triple-cask-triple-smooth",
  "black-nikka-special",
  "riku",
  "arran-10",
  "johnnie-walker-green-label",
];
