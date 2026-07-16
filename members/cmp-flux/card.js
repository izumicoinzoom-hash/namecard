/**
 * BrightCard 統合PoC サンプルデータ（An Nguyen・Flux検証用）
 * トラックB「Flux」デザイン（brightcard/preview/theme-flux.html + card-flux.js）を
 * 正本C（members runtime v1）の card.js schema へ移植した検証用カード。
 * 目的: Cのcard.js（データ）でBの深夜ネオン意匠が破綻なく描画されることの実証。
 * ★氏名がラテン文字（An Nguyen）のケース検証を兼ねる（name.ja にラテン文字を入れてもh1は英字表示のまま破綻しない）。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "cmp-flux",

  design: {
    template: "flux",
    accent: "#34e6b4",
    photoPosition: "center top",
  },

  name: {
    ja: "An Nguyen",
    en: "An Nguyen",
    kana: { last: "グエン", first: "アン" },
  },

  positions: [
    { company: "Fluxlab", role: "Software Engineer" },
  ],

  tagline: "光る前のコードに、\nいちばん時間をかける。",

  about: "Web/AIプロダクトのエンジニア。動くだけでなく、暗がりで手が届く導線まで設計することを大切にしている。写真付き名刺から名前・肩書き・連絡先を拾い、自己紹介ページでは機能と実績を静かに並べている。",

  philosophy: {
    label: "",
    text: "",
  },

  contacts: {
    address: {
      postal: "",
      region: "福岡県",
      locality: "福岡市中央区",
      street: "天神2-00-00",
      display: "福岡県福岡市中央区天神2-00-00",
    },
    phone: "090-0000-5120",
    email: "an.nguyen@example.jp",
    website: "https://example.jp/fluxlab",
  },

  sns: [
    { type: "line-official", id: "@brightcard-demo" },
    { type: "whatsapp", id: "819000005120" },
    { type: "instagram", id: "brightcard.demo" },
  ],

  // Flux「02 Story」の実績グリッド（card-flux.js の proofs 4件を移植）
  metrics: [
    { value: 60, suffix: "+", label: "リリースした機能" },
    { value: 12, suffix: "", label: "OSSコントリビュート" },
    { static: "AI", label: "実装した推論導線" },
    { value: 200, suffix: "+", label: "共有された名刺" },
  ],

  businesses: [],

  links: [],

  vcard: {
    filename: "an-nguyen",
    org: "",
    note: "",
  },

  updates: [
    { date: "2026-07-17", note: "BrightCard統合PoC：トラックB「Flux」デザインをテンプレ移植（flux / #34e6b4）" },
  ],
};
