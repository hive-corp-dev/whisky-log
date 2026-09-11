// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

import { SITE_URL } from "./src/data/siteData.ts";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  vite: {
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
