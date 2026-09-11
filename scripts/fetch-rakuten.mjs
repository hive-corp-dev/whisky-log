// 楽天商品検索 API で、各レビュー記事の商品情報（画像・価格・アフィリエイト URL）を取得し
// src/data/rakuten/items.json に保存する。
//
// 使い方:
//   RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY / RAKUTEN_AFFILIATE_ID を .env に書いて
//   npm run fetch:rakuten            … 未取得・7日以上前の記事だけ更新
//   npm run fetch:rakuten -- --all   … 全記事を更新
//   npm run fetch:rakuten -- --slug busker-triple-cask-triple-smooth
//
// 記事側の指定（frontmatter）:
//   rakutenItemCode: "shop-name:10012345"   … 商品コードで確定（推奨）
//   searchKeyword: "バスカー トリプルカスク"  … itemCode が無いときはキーワード検索し、
//                                             セット品・ケース品を除いて単品（volume と一致する容量）を選ぶ
//
// 本文側の指定（MDX）: 大容量版など、主商品以外の購入ボックス
//   <AffiliateBox id="riku-4000" title="…" keyword="キリン ウイスキー 陸 4000ml" volume={4000} />
//   <AffiliateBox id="…" title="…" keyword="…" itemCode="shop:12345" />
//   id をキャッシュのキーにする（サイト全体で一意）

import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import https from "node:https";
import path from "node:path";
import { parse as parseYaml } from "yaml";

const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT_DIR = path.join(ROOT, "src/content/review");
const OUT_FILE = path.join(ROOT, "src/data/rakuten/items.json");
const ENDPOINT = "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701";
const SITE_ORIGIN = "https://whisky-log.com";
const STALE_DAYS = 7;
const IMAGE_SIZE = 400; // mediumImageUrls の _ex パラメータを書き換えて拡大する
const SEARCH_HITS = 15;

// セット・ケース・ミニボトル・グラス付き・旧ボトルなどを除外するパターン
// 「6本まで」「1本」のような単品表記は除外しない
const EXCLUDE_PATTERN = /ケース|セット|本組|[×x✕]\s*\d|\d+本入|\d+本組|飲み比べ|詰め合わせ|ミニ|50ml|180ml|200ml|グラス付|レトロ|オールドボトル|旧ボトル|旧規格|旧ラベル|終売品/;

// --- .env を読む（dotenv を入れずに最小限で） ---
const loadEnv = async () => {
  const envPath = path.join(ROOT, ".env");
  if (!existsSync(envPath)) return;
  const text = await readFile(envPath, "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
};
await loadEnv();

const APP_ID = process.env.RAKUTEN_APP_ID;
const ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY;
const AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID;

if (!APP_ID || !ACCESS_KEY) {
  console.error("RAKUTEN_APP_ID と RAKUTEN_ACCESS_KEY を .env に設定してください（.env.example 参照）");
  process.exit(1);
}
if (!AFFILIATE_ID) {
  console.warn("警告: RAKUTEN_AFFILIATE_ID が未設定です。アフィリエイト URL なしで取得します");
}

const args = process.argv.slice(2);
const forceAll = args.includes("--all");
const onlySlug = args.includes("--slug") ? args[args.indexOf("--slug") + 1] : null;

// --- frontmatter と本文の <AffiliateBox> の読み取り ---
const readArticle = async (file) => {
  const text = await readFile(file, "utf8");
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = m ? parseYaml(m[1]) : {};
  const body = m ? text.slice(m[0].length) : text;
  const boxes = [];
  for (const tag of body.matchAll(/<AffiliateBox\s+([^>]*?)\/?>/g)) {
    const attrs = {};
    for (const a of tag[1].matchAll(/(\w+)=(?:"([^"]*)"|\{([^}]*)\})/g)) {
      attrs[a[1]] = a[2] ?? a[3].trim().replace(/^["']|["']$/g, "");
    }
    if (attrs.id) boxes.push(attrs);
  }
  return { fm, boxes };
};

// --- API 呼び出し ---
// アプリは「Webアプリケーション」種別（Referer で許可サイトを判定）として登録しているので、
// ローカル実行でも自サイトの Referer / Origin を付けて呼ぶ。
// fetch() ではこれらのヘッダを付けられない（禁止ヘッダ）ため node:https を使う
const getJson = (url) =>
  new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.get(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers: {
          Referer: `${SITE_ORIGIN}/`,
          Origin: SITE_ORIGIN,
          "User-Agent": "whisky-log-fetch/1.0",
          Accept: "application/json",
        },
      },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 200)}`));
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      },
    );
    req.on("error", reject);
  });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const toRecord = (item) => {
  const image = item.mediumImageUrls?.[0];
  return {
    itemCode: item.itemCode,
    itemName: item.itemName,
    itemPrice: item.itemPrice,
    itemUrl: item.itemUrl,
    affiliateUrl: item.affiliateUrl || null,
    imageUrl: image ? image.replace(/_ex=\d+x\d+/, `_ex=${IMAGE_SIZE}x${IMAGE_SIZE}`) : null,
    shopName: item.shopName,
    reviewAverage: item.reviewAverage,
    reviewCount: item.reviewCount,
    fetchedAt: new Date().toISOString(),
  };
};

// キーワード検索の候補から「単品」を選ぶ
const pickSingleBottle = (items, volume) => {
  const singles = items.filter((it) => !EXCLUDE_PATTERN.test(it.itemName));
  if (singles.length === 0) return null;
  if (volume) {
    const withVolume = singles.filter((it) => it.itemName.includes(`${volume}ml`));
    if (withVolume.length > 0) return withVolume[0];
  }
  return singles[0];
};

const searchItem = async ({ itemCode, keyword, volume }) => {
  const params = new URLSearchParams({
    applicationId: APP_ID,
    accessKey: ACCESS_KEY,
    formatVersion: "2",
    ...(AFFILIATE_ID ? { affiliateId: AFFILIATE_ID } : {}),
    ...(itemCode ? { itemCode, hits: "1" } : { keyword, hits: String(SEARCH_HITS), sort: "standard" }),
  });
  const json = await getJson(`${ENDPOINT}?${params}`);
  const items = json.Items ?? [];
  const item = itemCode ? items[0] : pickSingleBottle(items, volume);
  return item ? toRecord(item) : null;
};

// --- メイン ---
const cache = existsSync(OUT_FILE) ? JSON.parse(await readFile(OUT_FILE, "utf8")) : {};
const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith(".mdx") && !f.startsWith("_"));

let updated = 0;
for (const file of files) {
  const slug = file.replace(/\.mdx$/, "");
  if (onlySlug && slug !== onlySlug) continue;

  const { fm, boxes } = await readArticle(path.join(CONTENT_DIR, file));

  // 取得ジョブ: 主商品（キー = slug）+ 本文の <AffiliateBox>（キー = id）
  const jobs = [];
  if (fm.affiliate === false) {
    delete cache[slug];
    console.log(`skip  ${slug}（affiliate: false）`);
  } else if (fm.rakutenItemCode) {
    jobs.push({ key: slug, query: { itemCode: fm.rakutenItemCode } });
  } else if (fm.searchKeyword) {
    jobs.push({ key: slug, query: { keyword: fm.searchKeyword, volume: fm.volume } });
  } else {
    console.log(`skip  ${slug}（rakutenItemCode も searchKeyword も無い）`);
  }
  for (const box of boxes) {
    if (box.itemCode) jobs.push({ key: box.id, query: { itemCode: box.itemCode } });
    else if (box.keyword) jobs.push({ key: box.id, query: { keyword: box.keyword, volume: box.volume ? Number(box.volume) : undefined } });
    else console.log(`skip  ${box.id}（itemCode も keyword も無い）`);
  }

  for (const { key, query } of jobs) {
    const prev = cache[key];
    const isFresh = prev && Date.now() - new Date(prev.fetchedAt).getTime() < STALE_DAYS * 86400e3;
    const sameQuery = prev && prev.query === JSON.stringify(query);
    if (!forceAll && !onlySlug && isFresh && sameQuery) {
      console.log(`keep  ${key}`);
      continue;
    }

    try {
      const item = await searchItem(query);
      if (!item) {
        console.log(`none  ${key}（該当商品なし: ${JSON.stringify(query)}）`);
      } else {
        cache[key] = { query: JSON.stringify(query), ...item };
        updated++;
        console.log(`ok    ${key}\n      ${item.itemName.slice(0, 60)}\n      ¥${item.itemPrice} / ${item.shopName} / ${item.itemCode}`);
      }
    } catch (e) {
      console.error(`error ${key}: ${e.message}`);
    }
    await sleep(1200); // 1 リクエスト/秒の制限
  }
}

await mkdir(path.dirname(OUT_FILE), { recursive: true });
await writeFile(OUT_FILE, JSON.stringify(cache, null, 2) + "\n");
console.log(`\n${updated} 件更新 → ${path.relative(ROOT, OUT_FILE)}`);
