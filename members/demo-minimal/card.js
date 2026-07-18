/**
 * BrightCard デモ（架空人物・minimal）
 * 全11デザイン×別人物のショーケース用。実在しない架空の事業者データ（連絡先は example.jp）。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "demo-minimal",

  design: {
    template: "minimal",
    accent: "#2D6AE0",
    photoPosition: "center top",
  },

  background: { ref: "minimal/01" },

  name: {
    ja: "南 悠",
    en: "Yu Minami",
    kana: { last: "みなみ", first: "ゆう" },
  },

  positions: [
    { company: "株式会社ミナモ", role: "代表取締役 CEO", url: "https://example.jp" },
  ],

  tagline: "シンプルに、本質だけを。",

  about:
    "業務効率化SaaSを開発する株式会社ミナモ創業者。「引き算のプロダクト」を信条に、現場が本当に使うツールをつくる。",

  philosophy: { label: "", text: "" },

  contacts: {
    address: {
      postal: "860-0000",
      region: "熊本県",
      locality: "熊本市中央区",
      street: "安政町1-2-3",
      display: "熊本県熊本市中央区安政町1-2-3",
    },
    phone: "096-355-0005",
    email: "hello@minamo.example.jp",
    website: "https://example.jp",
  },

  sns: [
    { type: "line-official", id: "@example", badge: "公式LINE" },
  ],

  businesses: [],
  links: [],

  vcard: { filename: "minami_yu", org: "株式会社ミナモ", note: "" },

  updates: [
    { date: "", note: "デモ（minimal・架空人物サンプル）" },
  ],
};
