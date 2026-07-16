/**
 * BrightCard 統合PoC サンプルデータ（高橋 亮・Alloy検証用）
 * トラックB「Alloy」デザイン（brightcard/preview/theme-alloy.html + card-alloy.js）を
 * 正本C（members runtime v1）の card.js schema へ移植した検証用カード。
 * 目的: Cのcard.js（データ）でBの物語構造デザインが破綻なく描画されることの実証。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "cmp-alloy",

  design: {
    template: "alloy",
    accent: "#6fa8d6",
    photoPosition: "center top",
  },

  name: {
    ja: "高橋 亮",
    en: "Ryo Takahashi",
    kana: { last: "たかはし", first: "りょう" },
  },

  positions: [
    { company: "Meta Works", role: "Product Designer" },
  ],

  tagline: "図面の精度で、\n道具の手ざわりを設計する。",

  about: "日用品から産業機器まで、素材と量産工程を見据えて形をつくるプロダクト／工業デザイナー。図面と試作を往復しながら、道具としての手ざわりと生産効率を両立させる設計を得意とする。写真付き名刺からは肩書き・連絡先とともに、製品化実績への導線を拾い上げている。",

  philosophy: {
    label: "",
    text: "",
  },

  contacts: {
    address: {
      postal: "",
      region: "東京都",
      locality: "品川区",
      street: "大崎2-00-00",
      display: "東京都品川区大崎2-00-00",
    },
    phone: "03-0000-3080",
    email: "ryo.takahashi@example.jp",
    website: "https://example.jp/metaworks",
  },

  sns: [
    { type: "line-official", id: "@brightcard-demo" },
    { type: "whatsapp", id: "819000002101" },
    { type: "instagram", id: "brightcard.demo" },
  ],

  // Alloy「02 Story」の実績グリッド（任意）。B側 proofs 4件を移植。
  metrics: [
    { value: 42, suffix: "", label: "製品化" },
    { value: 4, suffix: "", label: "グッドデザイン賞" },
    { value: 15, suffix: "+", label: "量産ライン" },
    { static: "素材", label: "素材から設計" },
  ],

  businesses: [],

  links: [],

  vcard: {
    filename: "ryo-takahashi",
    org: "",
    note: "",
  },

  updates: [
    { date: "2026-07-17", note: "BrightCard統合PoC：トラックB「Alloy」デザインをテンプレ移植（alloy / #6fa8d6）" },
  ],
};
