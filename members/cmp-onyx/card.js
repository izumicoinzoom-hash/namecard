/**
 * BrightCard 統合PoC サンプルデータ（佐伯 凛・Onyx検証用）
 * トラックB「Onyx」デザイン（brightcard/preview/tpl-onyx.html + card-onyx.js）を
 * 正本C（members runtime v1）の card.js schema へ移植した検証用カード。
 * 目的: Cのcard.js（データ）でBの物語構造デザインが破綻なく描画されることの実証。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "cmp-onyx",

  design: {
    template: "onyx",
    accent: "#e8703a",
    photoPosition: "center top",
  },

  name: {
    ja: "佐伯 凛",
    en: "Rin Saeki",
    kana: { last: "さえき", first: "りん" },
  },

  positions: [
    { company: "Studio Kitami", role: "Brand Strategist" },
  ],

  tagline: "ブランドの温度を、\nプロダクトの言葉に変える。",

  about: "D2Cブランドや地域企業の立ち上げを支援するブランドストラテジスト。写真付き名刺から名前・肩書き・Web導線・SNSの見せ方を拾い、自己紹介ページでは言葉と実績の順番を編集している。",

  philosophy: {
    label: "",
    text: "",
  },

  contacts: {
    address: {
      postal: "",
      region: "東京都",
      locality: "渋谷区",
      street: "神南1-00-00",
      display: "東京都渋谷区神南1-00-00",
    },
    phone: "03-0000-2101",
    email: "rin.saeki@example.jp",
    website: "https://example.jp/studio-kitami",
  },

  sns: [
    { type: "line-official", id: "@brightcard-demo" },
    { type: "whatsapp", id: "819000002101" },
    { type: "instagram", id: "brightcard.demo" },
  ],

  // Onyx「02 Story」の実績グリッド（任意）。B側 proofs 4件を移植。
  metrics: [
    { value: 28, suffix: "", label: "ブランド設計プロジェクト" },
    { value: 3, suffix: "", label: "地域プロダクト立ち上げ" },
    { static: "SNS", label: "写真起点の導線" },
    { value: 120, suffix: "+", label: "共有された名刺" },
  ],

  businesses: [],

  links: [],

  vcard: {
    filename: "rin-saeki",
    org: "",
    note: "",
  },

  updates: [
    { date: "2026-07-16", note: "BrightCard統合PoC：トラックB「Onyx」デザインをテンプレ移植（onyx / #e8703a）" },
  ],
};
