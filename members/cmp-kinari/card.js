/**
 * BrightCard 統合PoC サンプルデータ（山本 千尋・Kinari検証用）
 * トラックB「Kinari（和紙）」デザイン（brightcard/preview/theme-washi.html + card-washi.js）を
 * 正本C（members runtime v1）の card.js schema へ移植した検証用カード。
 * 目的: Cのcard.js（データ）でBの縦書きヒーロー意匠が破綻なく描画されることの実証。
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
    ja: "山本 千尋",
    en: "Chihiro Yamamoto",
    kana: { last: "やまもと", first: "ちひろ" },
  },

  positions: [
    { company: "山本書斎", role: "Calligrapher" },
  ],

  tagline: "余白は、いちばん饒舌な墨。",

  about: "書と和紙の作家。企業ロゴの揮毫から個展まで、墨と余白のバランスにこだわりながら手がけている。写真付き名刺から名前・肩書き・連絡先を拾い、自己紹介ページでは余白の設計そのものを見せ方の主題にしている。",

  philosophy: {
    label: "",
    text: "",
  },

  contacts: {
    address: {
      postal: "",
      region: "京都府",
      locality: "京都市左京区",
      street: "0-00",
      display: "京都府京都市左京区0-00",
    },
    phone: "075-000-6300",
    email: "chihiro.yamamoto@example.jp",
    website: "https://example.jp/yamamoto-sho",
  },

  sns: [
    { type: "line-official", id: "@yamamoto-sho-demo" },
    { type: "whatsapp", id: "817500006300" },
    { type: "instagram", id: "yamamoto.sho" },
  ],

  // Kinari「02 Story」の実績グリッド（任意）。B側 proofs 4件を移植。
  metrics: [
    { value: 18, suffix: "", label: "個展・企画展" },
    { value: 40, suffix: "+", label: "揮毫した題字" },
    { static: "墨", label: "余白の設計" },
    { value: 70, suffix: "+", label: "共有された名刺" },
  ],

  businesses: [],

  links: [],

  vcard: {
    filename: "chihiro-yamamoto",
    org: "",
    note: "",
  },

  updates: [
    { date: "2026-07-17", note: "BrightCard統合PoC：トラックB「Kinari（和紙）」デザインをテンプレ移植（kinari / #35506b・01 Portraitのみ縦書き化）" },
  ],
};
