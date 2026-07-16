/**
 * BrightCard 実データサンプル（清田兼明・検証用）
 * BrightCardテンプレシステムのMVP実装検証のために、清田さん本人の実データで
 * 制作した確認用カードです。本人版 digital-namecard/index.html（Products/From WBT
 * を含むフルサイト）とは別物で、BrightCard商品としてのフッター・構成に統一しています。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "kiyota-sample",

  design: {
    template: "minimal",
    accent: "#EA580C",
    photoPosition: "center top",
  },

  background: { ref: "minimal/01" },

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

  about: "",

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

  vcard: {
    filename: "kiyota_kemmei",
    org: "",
    note: "",
  },

  updates: [
    { date: "2026-07-13", note: "BrightCard MVP テンプレ実装検証用サンプル（bright / #EA580C）" },
    { date: "2026-07-15", note: "フレーム内配置モデルへ移行・background(bright/01)追加" },
  ],
};
