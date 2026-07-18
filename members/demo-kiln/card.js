/**
 * BrightCard デモ（架空人物・kiln / B系）
 * 全11デザイン×別人物のショーケース用。実在しない架空の事業者データ（連絡先は example.jp）。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "demo-kiln",

  design: {
    template: "kiln",
    accent: "#C2703A",
    photoPosition: "center top",
  },

  name: {
    ja: "森 一馬",
    en: "Kazuma Mori",
    kana: { last: "もり", first: "かずま" },
  },

  positions: [
    { company: "森陶房", role: "主宰・陶芸家", url: "https://example.jp" },
  ],

  tagline: "土と火から、暮らしの器を。",

  about:
    "熊本の里山に窯を構える陶芸家。日々の食卓で使える普段づかいの器を、登り窯の炎で焼き上げる。",

  philosophy: { label: "", text: "" },

  contacts: {
    address: {
      postal: "860-0000",
      region: "熊本県",
      locality: "熊本市西区",
      street: "花園1-2-3",
      display: "熊本県熊本市西区花園1-2-3",
    },
    phone: "096-355-0008",
    email: "info@mori-touhou.example.jp",
    website: "https://example.jp",
  },

  sns: [
    { type: "line-official", id: "@example", badge: "公式LINE" },
  ],

  businesses: [],
  links: [],

  metrics: [
    { static: "陶芸", label: "森陶房 主宰" },
    { value: 23, suffix: "年", label: "作陶歴" },
    { static: "登り窯", label: "焼成" },
    { static: "熊本", label: "工房" },
  ],

  vcard: { filename: "mori_kazuma", org: "森陶房", note: "" },

  updates: [
    { date: "", note: "デモ（kiln・架空人物サンプル）" },
  ],
};
