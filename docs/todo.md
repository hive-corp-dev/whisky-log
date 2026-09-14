# Whisky Log やることリスト

2026-09-11 公開時点の残タスクと、今後やりたいこと。終わったものは「済み」に移す。

## 公開直後にやること（外部サービス側）

- [ ] Search Console のサイトマップのステータスが「成功しました」に変わるか、数時間後に確認（送信直後は「取得できませんでした」表示）
- [ ] HyperForm の管理画面で、送信後のリダイレクト先を `https://whisky-log.com/contact/thanks/` に設定し、テスト送信して通知メールが届くことを確認
- [ ] GA4 の「リアルタイム」で自分のアクセスが出ることを確認（本番だけ計測。ローカルは対象外）
- [ ] Microsoft Clarity にセッションが記録され始めることを確認
- [ ] Amazon アソシエイトの成果が `whiskylog-22` に付いているか、数日後にレポートで確認

## 機能として入れたいもの

### 購入ボックスの画像・価格を楽天から Amazon に切り替える

- 今は楽天商品検索 API（`scripts/fetch-rakuten.mjs` → `src/data/rakuten/items.json`）から画像・価格・リンクを取っている
- Amazon は Creators API（旧 PA-API）が必要で、**過去 30 日に条件を満たす売上が 10 件以上**ないとアクセスできない。公開直後は満たせないので保留
- 売上が月 10 件を超える状態が続いたら:
  1. アソシエイト・セントラル → クリエイター API → アプリケーションを作成して認証情報を取得（承認まで最大 48 時間）
  2. 楽天と同じ形の取得スクリプト（`scripts/fetch-amazon.mjs`）を作り、ASIN で画像・価格・リンクを取って `src/data/amazon/items.json` にキャッシュ
  3. `AffiliateButtons.astro` の画像・価格の参照先を Amazon 優先に切り替え、楽天はフォールバック
- それまでの代替: 記事の frontmatter `links.amazon` に商品ページ URL（`https://www.amazon.co.jp/dp/ASIN`）を入れて、検索結果ではなく商品ページに直接飛ばす。11 本分の ASIN を調べて入れる作業は先にやっておける

### サイト内のテキスト検索

- 銘柄名・産地・種類・本文で記事を探せる検索窓。静的サイトなので、ビルド時に検索用の索引（JSON）を作ってブラウザ側で絞り込む方式
- 候補: Pagefind（Astro の静的サイトで定番。ビルド後に索引を作り、UI も付属）か、自前で記事の title / name / tags / 本文の一部を JSON にして絞り込む軽量版
- 置き場所の案: ヘッダー右の検索アイコン → モーダル、またはレビュー一覧ページの絞り込みの上
- 記事が 20〜30 本を超えたあたりで効いてくる。それまでは産地・種類の絞り込みで足りる

### そのほか

- [ ] 非表示にしている 3 本（グレンフィディック 12 年、グレンリベット 12 年、ブラックブッシュ）の書き直しと写真の撮り直し → `draft: false` に戻す。`src/data/review/popular.ts` の順位にも入れ直す
- [ ] 飲み方別の写真（straight / rock / highball）がない記事に写真を追加。今あるのはアラン、バスカー、ブラックブッシュだけ
- [ ] `src/data/review/popular.ts`（フッターのおすすめレビューの順位）を、GA4 の閲覧数が溜まったら実データで並べ替える
- [ ] 楽天の価格・画像の定期更新（`npm run fetch:rakuten -- --all`）。7 日以上前のものだけ更新する仕組みなので、記事を書くタイミングで回せばよい
- [ ] ブラックニッカ スペシャルの楽天商品を現行品に固定したいなら `rakutenItemCode` を指定（今はキーワード検索で現行品に当たっている）
- [ ] バランタイン 12 年は 1L 瓶で買ったが、楽天に現行の 1L がなく、購入ボックスは 700ml 基準。1L の商品コードが見つかれば差し替え
- [ ] Whisky Lab の `johnnie-walker-green-label-15.json` を、記事の slug `johnnie-walker-green-label` に合わせてリネーム
- [ ] `@vercel/edge` は Basic 認証を外したので未使用。`package.json` から外してよい
- [ ] プロフィールページ（「このサイトについて」）。今は不要と判断。名前や経歴は出さない方針なので、作るとしてもサイドバーの説明文と同じ内容

## 記事を増やすときの手順（メモ）

1. 撮影 → HEIC/JPG を `src/content/review/images/<slug>/thumb.jpg`（幅 2000px、16:9）に変換。飲み方別は `straight.jpg` / `rock.jpg` / `highball.jpg`
2. `docs/review-writing-manual.md` に沿って `src/content/review/<slug>.mdx` を書く。終売・リニューアル・後継の有無は必ず調べる
3. `npm run fetch:rakuten -- --slug <slug>` で購入ボックスの商品を取得。違う商品に当たったら `rakutenItemCode` で固定
4. `npm run build` が 0 エラーであることを確認してからコミット・プッシュ

## 済み（2026-09-11）

- Vercel のデプロイ成功と Basic 認証の解除を確認（whisky-log.com が 200 で公開中）
- Search Console: URL プレフィックス プロパティ `https://whisky-log.com/` を HTML タグ方式で所有権確認し、`sitemap-index.xml` を送信

- 記事 14 本（公開 11・非表示 3）、記事テンプレート、産地別・種類別の一覧、サイドバー・フッター
- プライバシーポリシー、お問い合わせ（HyperForm）、サンクスページ、404、robots.txt、sitemap、ファビコン、OGP
- Basic 認証の解除、GA4、Clarity、Amazon トラッキング ID（whiskylog-22）
- バリューコマース承認（2026-09-14）→ Yahoo!ショッピング（プログラム 2025875、2%〜）と提携。購入ボックスの Yahoo ボタンは MyLink（sid 3781252 / pid 892701837）で検索ページをアフィリエイト化
