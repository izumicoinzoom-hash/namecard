/**
 * BrightCard 設計見本（清田兼明・B系 kinari 検証用）
 * B系5デザイン比較のため、清田さん本人の実データを全デザイン共通で使用した確認用カード。
 * 本人版 digital-namecard/index.html（フルサイト）とは別物で、BrightCard商品として
 * のフッター・構成に統一している。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "cmp-kinari",

  design: {
    template: "kinari",
    accent: "#35506b",
    photoPosition: "center top",
  },

  name: {
    ja: "清田 兼明",
    en: "Kemmei Kiyota",
    kana: { last: "きよた", first: "けんめい" },
  },

  positions: [
    { company: "株式会社清田自動車", role: "代表取締役", url: "https://www.kiyota-cars.com" },
    { company: "合同会社WBT", role: "代表社員", url: "https://withbt.com" },
  ],

  tagline: "情の伝播 — テクノロジーと人の温もりで、明日をもっと明るくする。",

  about:
    "熊本・近見で自動車整備／鈑金を担う株式会社清田自動車と、テクノロジーで中小企業の明日を明るくする合同会社WBTを両輪で経営。現場で培った「人の温もり」とテクノロジーの力を重ね合わせ、地域と技術をつなぐことを仕事の芯にしている。",

  philosophy: {
    label: "",
    text: "",
  },

  contacts: {
    address: {
      postal: "861-4101",
      region: "熊本県",
      locality: "熊本市南区",
      street: "近見7丁目12番20号",
      display: "熊本県熊本市南区近見7丁目12番20号",
    },
    phone: "080-3946-1430",
    email: "izumi.coinzoom@gmail.com",
    website: "https://www.kiyota-cars.com",
  },

  sns: [
    { type: "line-official", id: "@308sidwc", badge: "WBT公式" },
    { type: "line", id: "https://line.me/ti/p/Q_Lhjmw-hp", badge: "個人" },
    { type: "whatsapp", id: "818039461430" },
  ],

  businesses: [],

  links: [],

  // ▼ B系（onyx/alloy/kiln/flux/kinari）: Story章の実績メトリクス
  metrics: [
    { static: "整備×鈑金", label: "清田自動車 代表取締役" },
    { static: "IT", label: "合同会社WBT 代表社員" },
    { value: 2, suffix: "", label: "経営する会社" },
    { static: "熊本", label: "拠点" },
  ],

  vcard: {
    filename: "kiyota_kemmei",
    org: "",
    note: "",
  },

  updates: [
    { date: "", note: "設計見本（kinari・清田実データ）" },
  ],
};
