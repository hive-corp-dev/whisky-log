// レビュー記事（src/content/review/*.mdx）をコンパイルする前にソースを書き換え、
// 「## 飲み方別の評価」セクションの直後（次の h2 の手前）に主商品の購入ボックス
//   <AffiliateBox id={slug} title={name} keyword={searchKeyword} />
// を差し込む Vite プラグイン。基本情報の下と記事末尾のボックスは PostContent.astro 側。
// Astro 7 の既定 Markdown プロセッサ（satteri）は remark プラグインを通さないので、ソース文字列の段階で入れている。
// affiliate: false の記事には入れない。
import path from "node:path";
import { parse as parseYaml } from "yaml";

const REVIEW_RE = /[\\/]src[\\/]content[\\/]review[\\/][^\\/]+\.mdx$/;

export default function viteMidAffiliate() {
  return {
    name: "whisky-log:mid-affiliate",
    enforce: "pre",
    transform(code, id) {
      const file = id.split("?")[0];
      if (!REVIEW_RE.test(file)) return null;

      const m = code.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
      if (!m) return null;
      const fm = parseYaml(m[1]) ?? {};
      if (fm.affiliate === false) return null;
      const title = fm.name ?? fm.title;
      const keyword = fm.searchKeyword ?? fm.name ?? fm.title;
      if (!title || !keyword) return null;

      const slug = path.basename(file, ".mdx");
      const lines = code.split("\n");
      const start = lines.findIndex((l) => /^##\s+.*飲み方別の評価/.test(l));
      if (start === -1) return null;
      const next = lines.findIndex((l, i) => i > start && /^##\s+/.test(l));
      if (next === -1) return null;

      const box = `<AffiliateBox id="${slug}" title={${JSON.stringify(String(title))}} keyword={${JSON.stringify(String(keyword))}} />`;
      lines.splice(next, 0, box, "");
      return { code: lines.join("\n"), map: null };
    },
  };
}
