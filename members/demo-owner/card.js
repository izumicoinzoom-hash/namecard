/**
 * BrightCard デモ（架空人物・owner-editorial / オーナー最上位版）
 * 全11デザイン×別人物のショーケース用。実在しない架空の事業者データ（連絡先は example.jp）。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "demo-owner",

  design: {
    template: "owner-editorial",
    accent: "#E8703A",
    photoPosition: "50% 18%",
  },

  name: {
    ja: "山岡 誠",
    en: "Makoto Yamaoka",
    kana: { last: "やまおか", first: "まこと" },
  },

  positions: [
    {
      company: "山岡珈琲焙煎所",
      role: "店主・焙煎士",
      url: "https://example.jp",
      desc: "熊本・城東町の自家焙煎珈琲店。街の小さなよりどころ。",
    },
  ],

  tagline: "一杯に、暮らしの余白を。",

  philosophy: {
    label: "",
    text:
      "豆と、火と、時間。\n\n" +
      "一杯のコーヒーは、飲む人の一日にそっと余白をつくる。焙煎の香りとともに、街の小さなよりどころでありたい。",
  },

  // Proof章（実績・任意）。value系はカウントアップ、static系は静的表示（架空のデモ数値）
  metrics: [
    { value: 15, suffix: "年", label: "自家焙煎ひとすじ" },
    { value: 40, suffix: "種", label: "季節でめぐる焙煎豆" },
    { value: 800, suffix: "名", label: "月替わり珈琲便の会員" },
    { static: "手網焙煎", label: "一杯ずつ、香りを確かめて" },
  ],

  worksIntro: "山岡珈琲焙煎所のメニュー。気になるものは、お気軽にご相談ください。",

  products: [
    {
      category: "焙煎豆",
      name: "スペシャルティ・シングルオリジン",
      url: "https://example.jp",
      desc: "世界各地の農園から届く個性豊かな豆を、注文ごとに焙煎してお渡しします。",
      price: "料金：100g 800円〜",
    },
    {
      category: "カフェ",
      name: "ハンドドリップ",
      url: "https://example.jp",
      desc: "その日のおすすめを一杯ずつ丁寧に。店内でゆっくりお過ごしください。",
      price: "料金：500円〜",
    },
    {
      category: "定期便",
      name: "月替わり珈琲便",
      url: "https://example.jp",
      desc: "毎月違う産地の豆をご自宅へ。おうち時間に、小さな旅を。",
      price: "料金：月2,000円〜",
    },
  ],

  contacts: {
    address: {
      postal: "860-0000",
      region: "熊本県",
      locality: "熊本市中央区",
      street: "城東町1-2-3",
      display: "熊本県熊本市中央区城東町1-2-3",
    },
    phone: "096-1234-5678",
    email: "info@yamaoka-coffee.example.jp",
    website: "https://example.jp",
  },

  sns: [
    { type: "line-official", id: "@example", badge: "公式LINE" },
    { type: "whatsapp", id: "819012345678" },
  ],

  // Contact章のQR（segno生成のMECARD・架空データ）
  qr: {
    svg:
      "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 47 47\" class=\"segno\"><path fill=\"#f4f2ec\" d=\"M0 0h47v47h-47z\"/><path class=\"qrline\" stroke=\"#0a0a0a\" d=\"M1 1.5h7m2 0h1m1 0h3m1 0h1m3 0h1m1 0h1m3 0h1m2 0h1m7 0h1m1 0h7m-45 1h1m5 0h1m5 0h1m1 0h2m2 0h2m2 0h1m1 0h2m1 0h1m1 0h2m2 0h1m1 0h1m2 0h1m5 0h1m-45 1h1m1 0h3m1 0h1m1 0h2m2 0h1m5 0h2m5 0h1m1 0h3m2 0h2m1 0h1m2 0h1m1 0h3m1 0h1m-45 1h1m1 0h3m1 0h1m1 0h2m6 0h11m2 0h1m1 0h2m2 0h2m1 0h1m1 0h3m1 0h1m-45 1h1m1 0h3m1 0h1m1 0h1m5 0h1m1 0h1m3 0h5m1 0h1m2 0h8m1 0h1m1 0h3m1 0h1m-45 1h1m5 0h1m1 0h5m2 0h2m1 0h1m1 0h1m3 0h1m2 0h1m2 0h1m1 0h1m5 0h1m5 0h1m-45 1h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7m-37 1h1m1 0h1m2 0h1m1 0h1m1 0h4m3 0h4m3 0h5m-36 1h1m1 0h5m2 0h2m1 0h1m2 0h2m1 0h7m8 0h3m2 0h5m-43 1h2m2 0h1m3 0h2m1 0h2m4 0h2m5 0h1m4 0h2m2 0h5m1 0h4m-43 1h1m2 0h1m2 0h2m4 0h2m1 0h1m1 0h2m5 0h3m4 0h3m5 0h1m3 0h1m-44 1h4m1 0h1m4 0h2m1 0h2m3 0h3m2 0h1m1 0h2m1 0h1m1 0h1m1 0h1m1 0h1m2 0h1m4 0h2m-41 1h1m2 0h1m3 0h2m2 0h1m3 0h1m1 0h1m1 0h1m2 0h2m1 0h1m1 0h2m1 0h1m2 0h2m3 0h1m1 0h2m-45 1h1m1 0h1m2 0h1m2 0h2m2 0h2m2 0h1m2 0h3m3 0h1m1 0h1m1 0h1m2 0h2m1 0h3m2 0h1m3 0h1m-43 1h1m1 0h5m2 0h1m1 0h2m1 0h6m1 0h2m1 0h2m3 0h1m2 0h3m3 0h1m1 0h2m-44 1h1m1 0h2m1 0h1m1 0h1m1 0h1m1 0h3m1 0h5m1 0h1m1 0h1m1 0h2m1 0h1m1 0h1m1 0h2m3 0h6m1 0h1m-44 1h1m1 0h1m1 0h2m3 0h2m6 0h2m1 0h1m1 0h1m6 0h1m2 0h1m1 0h1m7 0h2m-43 1h3m2 0h1m3 0h2m2 0h2m2 0h2m1 0h1m4 0h1m4 0h2m2 0h2m1 0h1m3 0h2m-45 1h2m1 0h4m1 0h2m2 0h4m1 0h1m2 0h1m2 0h5m1 0h1m2 0h1m1 0h1m3 0h2m3 0h1m-44 1h6m1 0h1m1 0h1m2 0h1m1 0h1m1 0h1m1 0h2m1 0h1m1 0h6m1 0h2m1 0h1m1 0h1m3 0h1m1 0h3m-44 1h1m1 0h7m1 0h1m2 0h2m2 0h2m1 0h7m3 0h5m1 0h6m1 0h1m-44 1h2m2 0h1m3 0h1m2 0h2m1 0h2m3 0h2m3 0h1m1 0h1m2 0h2m2 0h2m1 0h1m3 0h5m-45 1h1m2 0h2m1 0h1m1 0h5m3 0h2m1 0h2m1 0h1m1 0h1m3 0h2m3 0h1m2 0h1m1 0h1m1 0h3m-40 1h2m3 0h1m1 0h2m1 0h1m2 0h1m3 0h1m3 0h1m1 0h2m6 0h3m3 0h4m-44 1h3m1 0h6m2 0h3m1 0h2m1 0h6m1 0h1m3 0h2m1 0h2m1 0h5m1 0h2m-42 1h1m4 0h1m1 0h2m1 0h2m4 0h2m2 0h2m3 0h1m1 0h2m1 0h1m2 0h2m1 0h1m2 0h2m-38 1h2m1 0h1m1 0h1m1 0h1m2 0h2m5 0h2m1 0h2m2 0h1m5 0h3m2 0h2m1 0h1m-44 1h2m3 0h1m1 0h1m1 0h1m2 0h1m3 0h2m1 0h1m2 0h1m1 0h1m1 0h1m5 0h4m3 0h2m1 0h1m-40 1h2m1 0h5m9 0h1m2 0h6m1 0h2m1 0h2m1 0h2m3 0h1m1 0h1m-44 1h1m2 0h3m3 0h2m1 0h4m1 0h2m2 0h2m2 0h1m1 0h1m1 0h1m2 0h1m2 0h1m6 0h1m1 0h1m-45 1h1m1 0h1m2 0h3m3 0h1m2 0h3m3 0h4m2 0h1m4 0h6m4 0h2m-41 1h1m1 0h1m2 0h1m2 0h2m2 0h1m1 0h1m4 0h1m2 0h1m1 0h1m1 0h2m2 0h3m2 0h3m1 0h3m-44 1h2m4 0h1m1 0h1m1 0h2m1 0h1m2 0h1m1 0h1m4 0h1m2 0h1m2 0h2m1 0h1m1 0h1m2 0h3m3 0h1m-41 1h1m3 0h1m1 0h1m2 0h2m1 0h8m4 0h1m2 0h2m4 0h2m4 0h1m1 0h1m-41 1h1m1 0h1m1 0h2m1 0h1m1 0h1m2 0h3m1 0h1m1 0h1m3 0h1m2 0h1m2 0h1m3 0h2m2 0h1m1 0h2m-43 1h4m5 0h1m1 0h7m2 0h2m1 0h1m1 0h3m3 0h3m4 0h2m1 0h1m1 0h1m-45 1h1m2 0h2m1 0h1m1 0h1m1 0h2m2 0h2m1 0h2m1 0h5m1 0h1m2 0h4m3 0h6m1 0h2m-37 1h3m3 0h1m3 0h1m1 0h1m3 0h1m4 0h2m1 0h3m1 0h1m3 0h1m1 0h3m-45 1h7m2 0h1m1 0h2m2 0h1m3 0h2m1 0h1m1 0h4m4 0h5m1 0h1m1 0h2m-42 1h1m5 0h1m1 0h2m1 0h2m1 0h1m1 0h1m2 0h2m3 0h1m4 0h3m1 0h1m2 0h1m3 0h4m-44 1h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h1m7 0h5m5 0h2m1 0h8m1 0h3m-45 1h1m1 0h3m1 0h1m1 0h1m1 0h3m1 0h5m1 0h1m1 0h2m4 0h4m1 0h3m1 0h1m2 0h1m2 0h2m-45 1h1m1 0h3m1 0h1m1 0h4m1 0h1m2 0h4m1 0h1m1 0h1m1 0h5m1 0h1m1 0h1m2 0h2m4 0h2m-44 1h1m5 0h1m5 0h1m3 0h2m1 0h3m5 0h1m2 0h1m1 0h4m6 0h1m-43 1h7m1 0h2m1 0h1m1 0h1m2 0h1m1 0h1m5 0h2m1 0h2m1 0h2m3 0h2m1 0h1m1 0h2m1 0h1\"/></svg>",
  },

  vcard: { filename: "yamaoka_makoto", org: "山岡珈琲焙煎所", note: "" },

  updates: [
    { date: "", note: "デモ（owner-editorial・架空人物サンプル）" },
  ],
};
