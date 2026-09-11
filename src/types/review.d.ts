export type ReviewCountry = "japan" | "scotland" | "ireland" | "us" | "uk" | "india" | "canada" | "taiwan";

export interface ReviewCategory {
  slug: string;
  label: string;
  /** 国旗表示用の国コード（Flag.astro の country） */
  country: ReviewCountry;
}

export interface ReviewTag {
  slug: string;
  label: string;
}
