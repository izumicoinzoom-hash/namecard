/**
 * BrightCard デモ（架空人物・kinari / B系）
 * 全11デザイン×別人物のショーケース用。実在しない架空の事業者データ（連絡先は example.jp）。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "demo-kinari",

  design: {
    template: "kinari",
    accent: "#8A9A5B",
    photoPosition: "center top",
  },

  name: {
    ja: "山本 直子",
    en: "Naoko Yamamoto",
    kana: { last: "やまもと", first: "なおこ" },
  },

  positions: [
    { company: "山本呉服店", role: "女将", url: "https://example.jp" },
  ],

  tagline: "受け継ぐ美を、次の世代へ。",

  about:
    "創業百年の呉服店の女将。着付け教室や誂えの相談を通じて、日本の装いの文化を暮らしの中に届けている。",

  philosophy: { label: "", text: "" },

  contacts: {
    address: {
      postal: "860-0000",
      region: "熊本県",
      locality: "熊本市中央区",
      street: "新市街1-2-3",
      display: "熊本県熊本市中央区新市街1-2-3",
    },
    phone: "096-355-0010",
    email: "info@yamamoto-gofuku.example.jp",
    website: "https://example.jp",
  },

  sns: [
    { type: "line-official", id: "@example", badge: "公式LINE" },
  ],

  businesses: [],
  links: [],

  metrics: [
    { static: "呉服・和装", label: "山本呉服店 女将" },
    { value: 100, suffix: "年", label: "創業" },
    { static: "誂え", label: "あつらえ承ります" },
    { static: "熊本", label: "店舗" },
  ],

  vcard: { filename: "yamamoto_naoko", org: "山本呉服店", note: "" },

  updates: [
    { date: "", note: "デモ（kinari・架空人物サンプル）" },
  ],
};
