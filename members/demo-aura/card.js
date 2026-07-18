/**
 * BrightCard デモ（架空人物・aura）
 * 全11デザイン×別人物のショーケース用。実在しない架空の事業者データ（連絡先は example.jp）。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "demo-aura",

  design: {
    template: "aura",
    accent: "#C77B8B",
    photoPosition: "center top",
  },

  background: { ref: "aura/01" },

  name: {
    ja: "花村 恵",
    en: "Megumi Hanamura",
    kana: { last: "はなむら", first: "めぐみ" },
  },

  positions: [
    { company: "hair & spa AURA", role: "オーナースタイリスト", url: "https://example.jp" },
  ],

  tagline: "髪から、あなたの一日を明るく。",

  about:
    "熊本・上通のヘアサロン「AURA」オーナースタイリスト。カットとヘッドスパで、忙しい毎日にひとときの余白を届ける。",

  philosophy: { label: "", text: "" },

  contacts: {
    address: {
      postal: "860-0000",
      region: "熊本県",
      locality: "熊本市中央区",
      street: "上通町1-2-3",
      display: "熊本県熊本市中央区上通町1-2-3",
    },
    phone: "096-355-0002",
    email: "info@salon-aura.example.jp",
    website: "https://example.jp",
  },

  sns: [
    { type: "line-official", id: "@example", badge: "予約LINE" },
  ],

  businesses: [],
  links: [],

  vcard: { filename: "hanamura_megumi", org: "hair & spa AURA", note: "" },

  updates: [
    { date: "", note: "デモ（aura・架空人物サンプル）" },
  ],
};
