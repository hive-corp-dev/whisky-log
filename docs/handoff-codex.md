# Whisky Log / Whisky Lab の概要（Codex 向け）

## 記事の修正を始める前に（2026-09-11更新）

先に [記事の構成・セクション別執筆マニュアル](./review-writing-manual.md) を読む。記事の上から順に、各セクションで何を書くか・細かいルールを記録している。これを次の記事の主資料とし、過去の具体例や本人の好みを確認する場合は [補足メモ](./writing-preferences.md) を参照する。本人の新しい指示が最優先。

アラン10年は `src/content/review/arran-10.mdx` が「ほぼ完成」と確認された記事。URLは `/review/scotch/arran-10/`。次の記事ではこの文章の流れを参考にするが、本人の体験や点数を他銘柄に流用しない。記事は依頼されたものから修正し、一括変更しない。

2 つのプロジェクトは兄弟フォルダで、記事の slug を共有している。

```
/Users/akaotatsuya/dev/whisky-blog/
├── whisky-dev/   # Whisky Log（公開するブログ）
└── whisky-lab/   # Whisky Lab（ローカル専用の下書き・比較ツール）
```

## Whisky Log（whisky-dev）

ウイスキーのレビューブログ。1 銘柄 1 記事で、ストレート・ロック・ハイボールの 3 つの飲み方で評価し、どの飲み方が合うかを記録する。収益は Amazon / 楽天 / Yahoo のアフィリエイト。

- **技術:** Astro 7 + MDX + SCSS、静的ビルド、Vercel にデプロイ（公開前で Basic 認証中）。Node 22.12 以上。
- **記事:** `src/content/review/<slug>.mdx`。frontmatter に基本情報・結論・点数（`rating`）・検索キーワードなど、本文に「○○とは → 香り・味・余韻 → 飲み方別の評価 → ○○の評価まとめ」。スキーマは `src/content.config.ts`。
- **本文で使う部品:** `<KeyPoints>`（とはの末尾の要点）、`<TastingNote way rating image>`（飲み方別）、`<Rating>`（点数表）、`<ProsCons>`（おすすめする人・しない人／良い声・気になる声）、`<AffiliateBox>`（主商品以外の購入ボックス）、`<LinkCard slug="..." label="..." />`（本文中に置く別記事へのリンクカード。slug は記事ファイル名、非公開や存在しない slug なら何も出ない）。実体は `src/components/pages/posts/post-content/parts/`。
- **写真:** `src/content/review/images/<slug>/thumb.jpg`（16:9、幅 2000px）。飲み方別は `straight.jpg` / `rock.jpg` / `highball.jpg`。
- **楽天の商品情報:** `npm run fetch:rakuten -- --slug <slug>` で `src/data/rakuten/items.json` に画像・価格・リンクをキャッシュする。API キーは `.env`（`.env.example` 参照）。
- **一覧:** 産地別 `/review/<category>/`、種類別 `/review/type/<tag>/`。産地は `src/data/review/category.ts`、種類は `src/data/review/tag.ts`。
- **確認:** `npm run build`（`astro check` 込み）が 0 エラーであること。表示は `npm run preview`（4322）か `npm run dev`（4321）。
- **非公開にしたい記事:** frontmatter を `draft: true` にすると一覧・サイドバー・フッター・件数から消える。

### 記事を書くときのルール（要点）

- 味の描写は複数のレビューの平均で書く。1 サイトの文をなぞらない。
- 事実（樽・度数・発売年・終売・リニューアル）はメーカー公式・プレスリリース・ボトル表示で裏を取る。終売と後継品の有無は必ず調べる。
- 書き手の名前は出さない。本人の体験と率直な感想を反映し、おすすめの対象も具体的に書く。締めで購入や試飲を後押しする文章は本人の希望。旧方針の「描写と判断だけで止める」は適用しない。
- 度数・容量だけの行、「スモーキーが好きな人」のような埋め草は書かない。
- 英単語と日本語の間にスペースを入れない。価格は税込表記。

## Whisky Lab（whisky-lab）

テイスティングを、他サイトの評価と自分の評価で横並びに比較する**ローカル専用**の Astro アプリ。公開しない。ホスティングも認証もない。

- **起動:** `npm run dev`（http://127.0.0.1:4325）。
- **データ:** `data/<slug>.json`。`sources[]` が他サイトの要約（AI が書く）、`mine` が自分の評価（ブラウザで入力して保存）。項目は 香り / 味わい / 余韻 / まとめ / ストレート / ロック / ハイボール / 総合評価（★ 1〜5、0.5 刻み）。定義は `src/lib/schema.ts` の `FIELDS`。未記入は `null`。
- **Whisky Log との関係:** slug は Whisky Log の記事と同じ。記事を書く前に `data/<slug>.json` を見て、他サイトの平均と自分の点数・メモを反映する。
- **ルールの詳細:** `whisky-lab/CLAUDE.md`。

## 注意

- どちらもまだ git にコミットしていない変更が多い。コミットは指示があるまでしない。
- `.env` の鍵と Basic 認証の情報はファイルに書かない。
- Whisky Lab の `johnnie-walker-green-label-15.json` は、Whisky Log 側の記事 slug が `johnnie-walker-green-label` になっている。どちらかに揃える必要がある。
