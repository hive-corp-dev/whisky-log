// 人気のレビュー（フッターなどで使う並び順）
// GA の閲覧数（本人共有）をもとに、記事の id（ファイル名から .mdx を除いたもの）を上位から順に並べる。
// 存在しない id は無視され、足りない分は新着で補われる。最終更新: 2026-10-14
export const popularReviewIds: string[] = [
  "iw-harper-12",
  "white-horse-nagomi",
  "four-roses-black",
  "busker-triple-cask-triple-smooth",
  "black-nikka-special",
];
