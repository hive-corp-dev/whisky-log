# Whisky Log（ウイスキーログ）

ウイスキーのレビュー・評価を紹介する個人ブログ。Astro 製の静的サイトで、Vercel にデプロイする想定。

## 技術スタック

- Astro 7 + MDX（記事は `src/content/review/*.mdx`）
- React（`react-icons` のアイコン用途のみ）
- SCSS（`src/styles/_mixin.scss`, `_var.scss` は全 SCSS に自動 `@use` される）
- Node.js 22.12 以上

## コマンド

| コマンド          | 内容                                       |
| :---------------- | :----------------------------------------- |
| `npm install`     | 依存関係のインストール                     |
| `npm run dev`     | 開発サーバー起動（`localhost:4321`）       |
| `npm run check`   | 型チェック（`astro check`）                |
| `npm run build`   | 型チェック後、`./dist/` に本番ビルド       |
| `npm run preview` | ビルド結果をローカルでプレビュー           |

## ディレクトリ構成

```text
src/
├── content.config.ts      # コンテンツコレクションのスキーマ定義
├── content/review/        # レビュー記事（MDX）と記事用画像
│   └── images/<slug>/     # 記事ごとの画像（thumb.jpg がサムネイル）
├── data/                  # サイト設定・カテゴリ・タグのマスタ
├── pages/
│   ├── index.astro        # トップ（新着レビュー）
│   └── review/            # /review, /review/[category], /review/[category]/[slug]
├── components/
│   └── pages/posts/post-content/parts/  # MDX 内で使えるコンポーネント（Speech, Img, CitedFigure, Spacer）
├── layouts/Layout.astro   # 共通レイアウト（SEO メタ含む）
└── styles/                # グローバル SCSS
```

## 記事の追加方法

1. `src/content/review/images/<slug>/` に写真を置く（`thumb.jpg` 必須）
2. `src/content/review/<slug>.mdx` を作成し、frontmatter を記述

```yaml
---
draft: false
title: "○○を飲んでみたレビュー・評価"
description: "検索結果に表示される説明文（100文字前後）"
image: "./images/<slug>/thumb.jpg"
category: "japanese"   # src/data/review/category.ts の slug
tags: ["single-malt"]  # src/data/review/tag.ts の slug
country: "japan"
publishedAt: "2026-01-01T22:00:00"
---
```

3. 本文では `<Speech>`, `<Img>`, `<CitedFigure>`, `<Spacer>` が import なしで使える

## 楽天の商品情報（画像・価格・アフィリエイトリンク）の取得

購入ボックスの画像・価格・楽天リンクは、楽天商品検索 API で取得したキャッシュ `src/data/rakuten/items.json` から表示する。

1. `.env.example` を `.env` にコピーし、楽天ウェブサービスの `RAKUTEN_APP_ID` / `RAKUTEN_ACCESS_KEY` と、楽天アフィリエイトの `RAKUTEN_AFFILIATE_ID` を書く
2. 記事の frontmatter に `rakutenItemCode: "shop-name:10012345"`（推奨。商品ページ URL 末尾のショップ名と商品番号）か、`searchKeyword` を書く
3. 取得する

```bash
npm run fetch:rakuten
```

日本で買えない銘柄など、購入ボックスを出したくない記事は frontmatter に `affiliate: false` を書く（取得もスキップされる）。

未取得または 7 日以上前の記事だけ更新される。全件更新は `npm run fetch:rakuten -- --all`、1 記事だけは `-- --slug <slug>`。生成された `items.json` はコミットする（ビルド時に API は呼ばない）。

## 人気のレビュー（フッター）の並び順

閲覧数が取れるまでは `src/data/review/popular.ts` の配列が並び順の正。記事 id（ファイル名から `.mdx` を除いたもの）を上位から並べる。無い id は無視、足りない分は新着で補われる。

## サイト設定

- サイト名・説明・URL・SNS: `src/data/siteData.ts`
  - `SITE_URL` は本番ドメイン確定後に差し替える（sitemap / canonical / OGP に使用）
- Basic 認証（Vercel Edge Middleware）: ルートの `middleware.ts`。環境変数 `BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD` を設定すると有効
