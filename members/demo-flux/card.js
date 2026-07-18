/**
 * BrightCard デモ（架空人物・flux / B系）
 * 全11デザイン×別人物のショーケース用。実在しない架空の事業者データ（連絡先は example.jp）。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "demo-flux",

  design: {
    template: "flux",
    accent: "#34D9B4",
    photoPosition: "center top",
  },

  name: {
    ja: "安藤 蓮",
    en: "Ren Ando",
    kana: { last: "あんどう", first: "れん" },
  },

  positions: [
    { company: "クリエイティブスタジオ FLUX", role: "代表・アートディレクター", url: "https://example.jp" },
  ],

  tagline: "変化を、デザインする。",

  about:
    "ブランディングとWeb制作を手がけるクリエイティブスタジオFLUX代表。企業の「らしさ」を掘り起こし、伝わる形に翻訳する。",

  philosophy: { label: "", text: "" },

  contacts: {
    address: {
      postal: "860-0000",
      region: "熊本県",
      locality: "熊本市中央区",
      street: "下通1-2-3",
      display: "熊本県熊本市中央区下通1-2-3",
    },
    phone: "096-355-0009",
    email: "hello@flux-studio.example.jp",
    website: "https://example.jp",
  },

  sns: [
    { type: "line-official", id: "@example", badge: "公式LINE" },
  ],

  businesses: [],
  links: [],

  metrics: [
    { static: "デザイン", label: "FLUX 代表" },
    { value: 120, suffix: "社", label: "支援実績" },
    { static: "Brand / Web", label: "領域" },
    { static: "熊本", label: "拠点" },
  ],

  vcard: { filename: "ando_ren", org: "クリエイティブスタジオ FLUX", note: "" },

  updates: [
    { date: "", note: "デモ（flux・架空人物サンプル）" },
  ],
};
