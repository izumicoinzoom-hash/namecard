/**
 * BrightCard デモ（架空人物・washi）
 * 全11デザイン×別人物のショーケース用。実在しない架空の事業者データ（連絡先は example.jp）。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "demo-washi",

  design: {
    template: "washi",
    accent: "#9C6B3F",
    photoPosition: "center top",
  },

  background: { ref: "washi/01" },

  name: {
    ja: "白石 宗一",
    en: "Soichi Shiraishi",
    kana: { last: "しらいし", first: "そういち" },
  },

  positions: [
    { company: "白石税理士事務所", role: "所長・税理士", url: "https://example.jp" },
  ],

  tagline: "数字の向こうの、想いに寄り添う。",

  about:
    "熊本で40年続く会計事務所の二代目所長。相続・事業承継に強く、地域の家業を次代へつなぐ支援を得意とする。",

  philosophy: { label: "", text: "" },

  contacts: {
    address: {
      postal: "860-0000",
      region: "熊本県",
      locality: "熊本市中央区",
      street: "練兵町1-2-3",
      display: "熊本県熊本市中央区練兵町1-2-3",
    },
    phone: "096-355-0004",
    email: "info@shiraishi-tax.example.jp",
    website: "https://example.jp",
  },

  sns: [
    { type: "line-official", id: "@example", badge: "相談LINE" },
  ],

  businesses: [],
  links: [],

  vcard: { filename: "shiraishi_soichi", org: "白石税理士事務所", note: "" },

  updates: [
    { date: "", note: "デモ（washi・架空人物サンプル）" },
  ],
};
