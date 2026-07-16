/**
 * BrightCard 統合P2 実データ（清田兼明・owner-editorial 検証用）
 * トラックA「清田本人 Editorial GQプロト」（_proto.html）を、正本C（members runtime v1）
 * のテンプレ owner-editorial（清田さん本人の最上位オーナー版）へ移植した確認用カード。
 * 本人版 digital-namecard/index.html（フルサイト）とは別物で、BrightCard商品として
 * のフッター・構成に統一している。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "cmp-owner",

  design: {
    template: "owner-editorial",
    accent: "#E8703A",
    photoPosition: "50% 18%",
  },

  name: {
    ja: "清田 兼明",
    en: "Kemmei Kiyota",
    kana: { last: "きよた", first: "けんめい" },
  },

  positions: [
    {
      company: "株式会社清田自動車",
      role: "代表取締役",
      url: "https://www.kiyota-cars.com",
      desc: "熊本・近見の自動車整備／鈑金。地域とともに歩む現場。",
    },
    {
      company: "合同会社WBT",
      role: "代表社員",
      url: "https://withbt.com",
      desc: "テクノロジーで中小企業の明日を明るくする。BrightCard 提供元。",
    },
  ],

  tagline: "情の伝播 — テクノロジーと人の温もりで、明日をもっと明るくする。",

  philosophy: {
    label: "",
    text:
      "情を、伝播させる。感情・情報・熱情を織り合わせ、明日をもっと明るくする。\n\n" +
      "自動車の現場から生まれた「人の温もり」と、テクノロジーの力。その二つを重ねることが、清田兼明の仕事の芯にある。",
  },

  worksIntro: "株式会社清田自動車が提供するサービス。気になるものは、そのままご相談ください。",

  products: [
    {
      category: "車検",
      name: "立会車検",
      url: "https://www.kiyota-cars.com",
      desc: "その場で状態を確認しながら進める、透明な車検。何にいくらかかるかを見て納得してから。",
      price: "料金：要見積",
    },
    {
      category: "鈑金・塗装",
      name: "事故・キズ対応",
      url: "https://www.kiyota-cars.com",
      desc: "ぶつけた・擦った・へこんだを、元通り以上に。保険対応もそのままご相談を。",
      price: "料金：要見積",
    },
    {
      category: "一般整備",
      name: "点検・オイル交換",
      url: "https://www.kiyota-cars.com",
      desc: "日常のメンテナンスから不調の相談まで。長く安心して乗るための、身近なかかりつけ。",
      price: "料金：要見積",
    },
  ],

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
    { type: "line-official", id: "https://lin.ee/SJVNO5k", badge: "WBT公式" },
    { type: "line", id: "https://line.me/ti/p/Q_Lhjmw-hp", badge: "個人" },
    { type: "whatsapp", id: "818039461430" },
  ],

  // Contact章のQR（_proto.html の静的QR SVGをそのまま移植。segno生成のMECARD）
  qr: {
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55 55" preserveAspectRatio="xMidYMid meet" class="segno"><path fill="#f4f2ec" d="M0 0h55v55h-55z"/><path class="qrline" stroke="#0a0a0a" d="M3 3.5h7m2 0h1m3 0h5m2 0h1m1 0h1m1 0h1m1 0h3m1 0h3m1 0h3m3 0h1m1 0h7m-49 1h1m5 0h1m3 0h1m3 0h1m2 0h1m2 0h1m4 0h1m1 0h2m5 0h2m2 0h3m1 0h1m5 0h1m-49 1h1m1 0h3m1 0h1m2 0h1m1 0h1m1 0h1m1 0h4m1 0h1m3 0h1m1 0h1m1 0h1m3 0h1m1 0h2m1 0h1m1 0h2m1 0h1m1 0h3m1 0h1m-49 1h1m1 0h3m1 0h1m6 0h2m1 0h3m2 0h3m3 0h3m4 0h1m2 0h1m1 0h1m2 0h1m1 0h3m1 0h1m-49 1h1m1 0h3m1 0h1m4 0h5m2 0h3m1 0h5m1 0h1m1 0h1m3 0h2m6 0h1m1 0h3m1 0h1m-49 1h1m5 0h1m1 0h2m4 0h2m1 0h1m2 0h1m1 0h1m3 0h5m7 0h1m3 0h1m5 0h1m-49 1h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7m-40 1h1m1 0h3m3 0h1m4 0h1m3 0h1m2 0h2m1 0h1m2 0h2m2 0h2m-41 1h1m2 0h1m1 0h2m1 0h3m1 0h1m1 0h3m1 0h2m2 0h5m1 0h1m1 0h2m1 0h1m2 0h3m1 0h2m1 0h1m-44 1h1m1 0h3m2 0h1m3 0h2m1 0h1m3 0h5m2 0h1m10 0h1m2 0h1m2 0h6m-48 1h1m1 0h1m3 0h1m2 0h1m1 0h4m4 0h3m2 0h1m2 0h2m2 0h2m1 0h2m1 0h1m3 0h2m3 0h3m-49 1h1m1 0h1m1 0h2m2 0h1m1 0h5m1 0h1m3 0h1m1 0h1m2 0h1m2 0h6m1 0h1m1 0h1m1 0h1m1 0h1m3 0h1m1 0h1m-47 1h1m1 0h2m1 0h2m2 0h2m1 0h1m1 0h2m3 0h1m4 0h1m2 0h7m2 0h3m2 0h3m-43 1h1m4 0h2m1 0h4m4 0h3m2 0h3m3 0h1m1 0h1m2 0h2m1 0h1m2 0h2m1 0h2m2 0h1m-47 1h3m2 0h1m1 0h1m1 0h1m3 0h1m2 0h2m1 0h1m4 0h1m2 0h1m2 0h1m1 0h1m4 0h3m2 0h1m4 0h1m-46 1h2m4 0h1m2 0h1m3 0h3m1 0h1m1 0h1m1 0h4m2 0h2m2 0h2m2 0h3m3 0h3m-47 1h1m3 0h1m1 0h6m2 0h4m6 0h2m1 0h2m5 0h2m1 0h1m2 0h3m1 0h1m1 0h2m-48 1h1m6 0h3m1 0h1m7 0h1m1 0h1m3 0h1m1 0h5m2 0h1m1 0h1m4 0h1m1 0h1m-44 1h1m2 0h2m1 0h1m1 0h1m2 0h1m1 0h5m2 0h2m1 0h1m1 0h3m2 0h2m2 0h2m2 0h1m6 0h2m-43 1h2m3 0h5m1 0h1m1 0h2m2 0h2m1 0h3m2 0h2m1 0h1m1 0h4m8 0h1m1 0h1m-48 1h6m2 0h1m9 0h3m1 0h2m1 0h1m1 0h2m1 0h1m4 0h1m2 0h2m2 0h1m2 0h3m-47 1h1m2 0h1m2 0h2m1 0h1m1 0h1m2 0h1m4 0h2m3 0h1m1 0h2m2 0h3m2 0h5m1 0h2m1 0h1m1 0h1m-49 1h1m2 0h6m2 0h3m1 0h2m2 0h2m1 0h6m1 0h1m1 0h5m2 0h1m1 0h5m3 0h1m-49 1h5m3 0h2m5 0h1m2 0h5m3 0h6m2 0h1m1 0h1m3 0h1m3 0h2m-45 1h1m1 0h2m1 0h1m1 0h1m1 0h2m5 0h2m1 0h1m1 0h1m1 0h1m1 0h3m1 0h8m2 0h1m1 0h1m1 0h2m1 0h1m-45 1h2m3 0h2m1 0h2m1 0h1m1 0h1m1 0h2m2 0h1m3 0h1m2 0h1m1 0h1m2 0h4m2 0h1m3 0h1m2 0h1m-48 1h1m1 0h1m1 0h5m4 0h1m2 0h4m1 0h7m1 0h1m1 0h2m1 0h2m2 0h1m1 0h6m2 0h1m-48 1h1m2 0h1m3 0h1m3 0h1m2 0h2m5 0h2m1 0h1m2 0h4m1 0h1m1 0h1m2 0h2m1 0h3m1 0h1m-46 1h2m1 0h1m1 0h2m3 0h2m1 0h2m1 0h1m3 0h3m1 0h1m1 0h1m2 0h1m2 0h1m1 0h1m5 0h5m1 0h1m1 0h1m-47 1h1m1 0h2m2 0h1m2 0h6m1 0h3m1 0h6m1 0h1m1 0h2m5 0h1m4 0h1m1 0h2m-44 1h1m2 0h1m3 0h2m2 0h1m1 0h5m1 0h1m3 0h1m1 0h1m1 0h4m2 0h2m1 0h2m1 0h1m2 0h4m-48 1h2m1 0h2m2 0h1m3 0h3m1 0h3m2 0h2m1 0h3m1 0h2m1 0h1m1 0h2m7 0h4m2 0h1m-46 1h1m1 0h2m1 0h2m4 0h1m1 0h2m1 0h1m2 0h2m1 0h1m2 0h1m1 0h1m2 0h5m3 0h1m1 0h5m-44 1h2m1 0h1m2 0h1m1 0h13m4 0h1m3 0h1m3 0h1m3 0h2m2 0h1m1 0h2m-48 1h1m3 0h2m3 0h1m1 0h1m3 0h5m5 0h1m2 0h5m2 0h1m1 0h2m1 0h2m2 0h4m-49 1h4m1 0h1m2 0h1m2 0h2m2 0h2m1 0h7m1 0h2m3 0h1m2 0h1m1 0h3m5 0h1m2 0h2m-48 1h1m2 0h1m1 0h3m1 0h2m1 0h2m2 0h1m1 0h1m2 0h1m1 0h5m1 0h3m3 0h2m3 0h1m1 0h1m2 0h1m1 0h1m-49 1h2m1 0h1m4 0h1m1 0h2m4 0h1m1 0h2m1 0h2m4 0h1m1 0h1m2 0h3m2 0h1m1 0h2m2 0h1m1 0h1m-45 1h1m3 0h3m1 0h1m2 0h1m2 0h2m1 0h1m2 0h3m2 0h1m1 0h1m2 0h3m1 0h2m1 0h2m2 0h2m4 0h1m-48 1h3m4 0h1m2 0h3m1 0h1m1 0h1m3 0h3m1 0h1m1 0h2m1 0h4m2 0h3m2 0h4m3 0h1m-49 1h3m3 0h1m1 0h3m1 0h3m2 0h1m1 0h9m4 0h1m2 0h2m1 0h1m1 0h5m1 0h1m1 0h1m-41 1h4m1 0h2m1 0h1m3 0h3m3 0h1m1 0h2m6 0h1m1 0h3m3 0h1m1 0h1m-47 1h7m4 0h1m1 0h1m1 0h3m1 0h1m2 0h1m1 0h1m1 0h1m1 0h1m2 0h2m2 0h1m3 0h2m1 0h1m1 0h2m1 0h2m-49 1h1m5 0h1m1 0h5m4 0h1m2 0h3m3 0h1m3 0h2m1 0h5m2 0h1m3 0h1m1 0h1m-47 1h1m1 0h3m1 0h1m6 0h6m2 0h6m1 0h1m2 0h1m1 0h1m1 0h2m2 0h7m-46 1h1m1 0h3m1 0h1m1 0h3m2 0h2m2 0h2m1 0h1m1 0h1m1 0h2m1 0h1m4 0h2m2 0h1m3 0h1m1 0h1m2 0h1m2 0h1m-49 1h1m1 0h3m1 0h1m3 0h1m2 0h1m2 0h1m2 0h1m1 0h2m1 0h1m1 0h1m1 0h4m2 0h1m1 0h2m6 0h5m-49 1h1m5 0h1m3 0h1m1 0h1m4 0h1m3 0h2m1 0h4m1 0h4m1 0h1m5 0h2m2 0h3m-47 1h7m1 0h1m3 0h5m2 0h3m1 0h5m3 0h1m3 0h1m8 0h1m2 0h2"/></svg>',
  },

  vcard: {
    filename: "kiyota_kemmei",
    org: "",
    note: "",
  },

  updates: [
    { date: "2026-07-17", note: "BrightCard統合P2：トラックA「清田本人 Editorial GQプロト」をテンプレ移植（owner-editorial / #E8703A）" },
  ],
};
