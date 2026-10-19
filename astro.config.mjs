// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

import { SITE_URL } from "./src/data/siteData.ts";
import viteMidAffiliate from "./src/plugins/vite-mid-affiliate.mjs";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  vite: {
    // レビュー記事の「飲み方別の評価」の直後に購入ボックスを差し込む（src/plugins/vite-mid-affiliate.mjs）
    plugins: [viteMidAffiliate()],
    css: {
      preprocessorOptions: {
        scss: {
          // 全 SCSS で mixin / var を自動 @use する（src/styles/_mixin.scss, _var.scss）
          loadPaths: [fileURLToPath(new URL("./src/styles", import.meta.url))],
          additionalData: `
          @use "mixin" as mixin;
          @use "var" as var;
          `,
        },
      },
    },
  },
  integrations: [
    mdx(),
    react(),
    // サンクスページのような noindex のページは sitemap に載せない
    sitemap({ filter: (page) => !page.includes("/contact/thanks") }),
  ],
});
