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
