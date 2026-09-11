// scripts/fetch-rakuten.mjs が生成した商品情報キャッシュを読む
import items from "@/data/rakuten/items.json";

export interface RakutenItem {
  query: string;
  itemCode: string;
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  affiliateUrl: string | null;
  imageUrl: string | null;
  shopName: string;
  reviewAverage?: number;
  reviewCount?: number;
  fetchedAt: string;
}

const cache = items as Record<string, RakutenItem>;

export const getRakutenItem = (slug: string): RakutenItem | undefined => cache[slug];
