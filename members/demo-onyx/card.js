/**
 * BrightCard デモ（架空人物・onyx / B系）
 * 全11デザイン×別人物のショーケース用。実在しない架空の事業者データ（連絡先は example.jp）。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "demo-onyx",

  design: {
    template: "onyx",
    accent: "#E8703A",
    photoPosition: "center top",
  },

  name: {
    ja: "佐伯 里佳",
    en: "Rika Saeki",
    kana: { last: "さえき", first: "りか" },
  },

  positions: [
    { company: "佐伯不動産", role: "代表", url: "https://example.jp" },
  ],

  tagline: "地域の暮らしに、確かな住まいを。",

  about:
    "熊本市を中心に住宅・投資物件を扱う佐伯不動産の代表。売買から賃貸管理まで、住まいの一生に寄り添う。",

  philosophy: { label: "", text: "" },

  contacts: {
    address: {
      postal: "860-0000",
      region: "熊本県",
      locality: "熊本市中央区",
      street: "手取本町1-2-3",
      display: "熊本県熊本市中央区手取本町1-2-3",
    },
    phone: "096-355-0006",
    email: "info@saeki-estate.example.jp",
    website: "https://example.jp",
  },

  sns: [
    { type: "line-official", id: "@example", badge: "公式LINE" },
  ],

  businesses: [],
  links: [],

  metrics: [
    { static: "不動産", label: "佐伯不動産 代表" },
    { value: 18, suffix: "年", label: "業界歴" },
    { value: 1200, suffix: "件", label: "仲介実績" },
    { static: "熊本", label: "拠点" },
  ],

  vcard: { filename: "saeki_rika", org: "佐伯不動産", note: "" },

  updates: [
    { date: "", note: "デモ（onyx・架空人物サンプル）" },
  ],
};
