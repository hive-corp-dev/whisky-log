export const SITE_NAME = "Whisky Log";
export const SITE_NAME_JA = "ウイスキーログ";
// サイト説明文。サイドバーのプロフィール欄・フッター・meta description で共用する（ここだけを直す）
export const SITE_DESCRIPTION_PARAGRAPHS = [
  "購入した銘柄100本超えの筆者による、ウイスキーのレビューブログです。",
  "それぞれストレート・ロック・ハイボールで飲み比べて、どの飲み方が合うかを記録しています。次の1本を選ぶ参考になれば嬉しいです。",
];
export const SITE_DESCRIPTION = SITE_DESCRIPTION_PARAGRAPHS.join("");

// sitemap / canonical / OGP に使用
export const SITE_URL = "https://whisky-log.com";

export const X_PROFILE_URL = "https://x.com/ta_whiskylog";

// Google Search Console の所有権確認用メタタグの値（公開値）。削除すると確認が外れる
export const GOOGLE_SITE_VERIFICATION = "CIsJNSDQztPNTWKgZLY35s4nlMMEdjex_V33TY9boYg";

// Google アナリティクス（GA4）の測定 ID。公開値なので環境変数にはしない。本番ビルドのときだけ読み込む
export const GA_MEASUREMENT_ID = "G-FQD24S9GQL";

// Microsoft Clarity のプロジェクト ID。公開値。本番ビルドのときだけ読み込む
export const CLARITY_PROJECT_ID = "yghgypmq2u";

// お問い合わせフォームの送信先（HyperForm のエンドポイント。公開 URL なので環境変数にはしない）
export const CONTACT_FORM_ACTION = "https://hyperform.jp/api/OCb7789f";

// アフィリエイト設定。ID が未設定の間は通常の検索リンクになる
export const AFFILIATE = {
  // Amazon アソシエイトのトラッキング ID（例: "whiskylog-22"）
  amazonTag: "whiskylog-22",
  // 楽天アフィリエイト: 記事ごとの links.rakuten に管理画面で生成した URL を貼る運用。
  // ここに ID を入れると検索結果リンクも計測対象にできる（例: "1a2b3c4d.5e6f7g8h"）
  rakutenId: "",
};

// 記事冒頭に出す広告表記（景品表示法・ステマ規制対応）
export const AFFILIATE_DISCLOSURE = "本記事にはアフィリエイト広告（Amazon・楽天市場・Yahoo!ショッピング）が含まれます。";
