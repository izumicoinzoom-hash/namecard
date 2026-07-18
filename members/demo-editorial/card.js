/**
 * BrightCard デモ（架空人物・editorial）
 * 全11デザイン×別人物のショーケース用。実在しない架空の事業者データ（連絡先は example.jp）。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "demo-editorial",

  design: {
    template: "editorial",
    accent: "#C0A062",
    photoPosition: "center top",
  },

  background: { ref: "editorial/01" },

  name: {
    ja: "高瀬 玲",
    en: "Rei Takase",
    kana: { last: "たかせ", first: "れい" },
  },

  positions: [
    { company: "高瀬経営コンサルティング", role: "代表", url: "https://example.jp" },
  ],

  tagline: "経営に、明晰さを。",

  about:
    "中小企業の事業再構築・資金繰り改善を専門とする経営コンサルタント。数字と現場の両面から、経営者の意思決定に伴走する。",

  philosophy: { label: "", text: "" },

  contacts: {
    address: {
      postal: "860-0000",
      region: "熊本県",
      locality: "熊本市中央区",
      street: "花畑町1-2-3",
      display: "熊本県熊本市中央区花畑町1-2-3",
    },
    phone: "096-355-0003",
    email: "contact@takase-consulting.example.jp",
    website: "https://example.jp",
  },

  sns: [
    { type: "line-official", id: "@example", badge: "公式LINE" },
  ],

  businesses: [],
  links: [],

  vcard: { filename: "takase_rei", org: "高瀬経営コンサルティング", note: "" },

  updates: [
    { date: "", note: "デモ（editorial・架空人物サンプル）" },
  ],
};
