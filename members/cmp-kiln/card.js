/**
 * BrightCard 統合PoC サンプルデータ（森 直人・Kiln検証用）
 * トラックB「Kiln」デザイン（brightcard/preview/theme-kiln.html + card-kiln.js）を
 * 正本C（members runtime v1）の card.js schema へ移植した検証用カード。
 * 目的: Cのcard.js（データ）でBの物語構造デザイン（クラフト紙・明るい背景）が破綻なく描画されることの実証。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "cmp-kiln",

  design: {
    template: "kiln",
    accent: "#b5602f",
    photoPosition: "center top",
  },

  name: {
    ja: "森 直人",
    en: "Naoto Mori",
    kana: { last: "もり", first: "なおと" },
  },

  positions: [
    { company: "Mori Atelier", role: "一級建築士" },
    { role: "Architect" },
  ],

  tagline: "木の年輪の時間を、\n住まいの静けさに変える。",

  about: "木造住宅や地域の公共空間を手がける一級建築士。素材の経年変化と光の入り方を設計に織り込み、暮らしの中に静けさをもたらす空間をつくっている。写真付き名刺から名前・肩書き・連絡先を拾い、自己紹介ページでは仕事の背景と実績の順番を編集している。",

  philosophy: {
    label: "",
    text: "",
  },

  contacts: {
    address: {
      postal: "",
      region: "長野県",
      locality: "松本市",
      street: "中央3-00-00",
      display: "長野県松本市中央3-00-00",
    },
    phone: "0263-00-4210",
    email: "naoto.mori@example.jp",
    website: "https://example.jp/mori-atelier",
  },

  sns: [
    { type: "line-official", id: "@brightcard-demo" },
    { type: "whatsapp", id: "8126300004210" },
    { type: "instagram", id: "mori.atelier.demo" },
  ],

  // Kiln「02 Story」の実績グリッド（任意）。B側 proofs 4件を移植。
  metrics: [
    { value: 36, suffix: "", label: "設計した住まい" },
    { value: 2, suffix: "", label: "建築賞 受賞" },
    { static: "木", label: "国産材の活用" },
    { value: 90, suffix: "+", label: "共有された名刺" },
  ],

  businesses: [],

  links: [],

  vcard: {
    filename: "naoto-mori",
    org: "",
    note: "",
  },

  updates: [
    { date: "2026-07-17", note: "BrightCard統合PoC：トラックB「Kiln」デザインをテンプレ移植（kiln / #b5602f）" },
  ],
};
