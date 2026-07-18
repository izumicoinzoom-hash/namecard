/**
 * BrightCard デモ（架空人物・bright）
 * 全11デザイン×別人物のショーケース用。実在しない架空の事業者データ（連絡先は example.jp）。
 * 清田さん本人の cmp-* / kiyota-sample とは別物。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "demo-bright",

  design: {
    template: "bright",
    accent: "#EA580C",
    photoPosition: "center top",
  },

  background: { ref: "bright/01" },

  name: {
    ja: "北野 大地",
    en: "Daichi Kitano",
    kana: { last: "きたの", first: "だいち" },
  },

  positions: [
    { company: "北野工務店", role: "代表取締役", url: "https://example.jp" },
  ],

  tagline: "まっすぐ、実直に。地域の暮らしを建てる。",

  about:
    "熊本で住宅の新築・リフォームを手がける北野工務店の三代目。「一棟入魂」を掲げ、住む人の暮らしに寄り添った家づくりを続けている。",

  philosophy: { label: "", text: "" },

  contacts: {
    address: {
      postal: "860-0000",
      region: "熊本県",
      locality: "熊本市東区",
      street: "新南部1-2-3",
      display: "熊本県熊本市東区新南部1-2-3",
    },
    phone: "096-355-0001",
    email: "info@kitano-koumuten.example.jp",
    website: "https://example.jp",
  },

  sns: [
    { type: "line-official", id: "@example", badge: "公式LINE" },
  ],

  businesses: [],
  links: [],

  vcard: { filename: "kitano_daichi", org: "北野工務店", note: "" },

  updates: [
    { date: "", note: "デモ（bright・架空人物サンプル）" },
  ],
};
