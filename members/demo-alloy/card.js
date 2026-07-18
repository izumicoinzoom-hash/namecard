/**
 * BrightCard デモ（架空人物・alloy / B系）
 * 全11デザイン×別人物のショーケース用。実在しない架空の事業者データ（連絡先は example.jp）。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "demo-alloy",

  design: {
    template: "alloy",
    accent: "#6E8BA6",
    photoPosition: "center top",
  },

  name: {
    ja: "高橋 亮",
    en: "Ryo Takahashi",
    kana: { last: "たかはし", first: "りょう" },
  },

  positions: [
    { company: "タカハシ製作所", role: "代表取締役", url: "https://example.jp" },
  ],

  tagline: "精密を、あたりまえに。",

  about:
    "精密鈑金・金属加工を担うタカハシ製作所の三代目。試作から量産まで、ミクロン単位のものづくりで顧客の設計を形にする。",

  philosophy: { label: "", text: "" },

  contacts: {
    address: {
      postal: "860-0000",
      region: "熊本県",
      locality: "熊本市北区",
      street: "龍田1-2-3",
      display: "熊本県熊本市北区龍田1-2-3",
    },
    phone: "096-355-0007",
    email: "info@takahashi-works.example.jp",
    website: "https://example.jp",
  },

  sns: [
    { type: "line-official", id: "@example", badge: "公式LINE" },
  ],

  businesses: [],
  links: [],

  metrics: [
    { static: "精密鈑金", label: "タカハシ製作所 代表" },
    { value: 55, suffix: "年", label: "創業" },
    { static: "±0.01mm", label: "加工精度" },
    { static: "熊本", label: "工場" },
  ],

  vcard: { filename: "takahashi_ryo", org: "タカハシ製作所", note: "" },

  updates: [
    { date: "", note: "デモ（alloy・架空人物サンプル）" },
  ],
};
