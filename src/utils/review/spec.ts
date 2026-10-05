import type { CollectionEntry } from "astro:content";

export type ReviewData = CollectionEntry<"review">["data"];
export type Way = "straight" | "rock" | "highball";

export const WAY_LABELS: Record<Way, string> = {
  straight: "ストレート",
  rock: "ロック",
  highball: "ハイボール",
};

export const COUNTRY_LABELS: Record<NonNullable<ReviewData["country"]>, string> = {
  japan: "日本",
  scotland: "スコットランド",
  ireland: "アイルランド",
  us: "アメリカ",
  uk: "イギリス",
  canada: "カナダ",
  india: "インド",
  taiwan: "台湾",
};

/**
 * 総合の星 = ストレート・ロック・ハイボール・コスパの平均。小数第 2 位を四捨五入して第 1 位まで（例: 4.25 → 4.3）。
 * content.config.ts のスキーマと、MDX から生の frontmatter を受け取る <Rating /> の両方で使う
 */
export const calcOverall = (r: { straight: number; rock: number; highball: number; cost: number }): number =>
  Math.round(((r.straight + r.rock + r.highball + r.cost) / 4) * 10) / 10;

/** 星の数値の表示用。小数第 1 位まで（「4.0」「4.3」） */
export const formatScore = (n: number): string => (Math.round(n * 10) / 10).toFixed(1);

/** ★☆ の 5 段階表記 */
export const stars = (n: number): string => "★".repeat(n) + "☆".repeat(5 - n);

/** 1 杯（30ml）あたりの価格。price / volume が無ければ null */
export const pricePerGlass = (data: Pick<ReviewData, "price" | "volume">): number | null => {
  if (!data.price || !data.volume) return null;
  return Math.round((data.price / data.volume) * 30);
};

export const formatYen = (n: number): string => `${n.toLocaleString("ja-JP")}円`;

/** "2026-09" → "2026年9月" */
export const formatYearMonth = (ym: string): string => {
  const [y, m] = ym.split("-");
  return m ? `${y}年${Number(m)}月` : y;
};
