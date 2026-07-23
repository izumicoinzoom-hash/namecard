/**
 * BrightCard 本人カード（清田兼明）— マイスター統合フォーマット
 * デザイン土台 = owner-editorial テンプレ（二重露光フルブリードHero＋sticky-stack GQ誌面）。
 * Products 章の各商品にシネマティックAI生成画像（works/*.webp）を差した本人版。
 * 設計正本: KIYOTA-MAISTER-DESIGN.md。連絡先/SNS/QRは kiyota-sample / cmp-owner 準拠の実データ。
 * runtime参照方式（薄シェル + card.js + members/_assets/runtime/v1/boot.js）。ソース分裂を作らない。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "digital-namecard",

  design: { template: "owner-editorial", accent: "#E8703A", photoPosition: "50% 18%" },

  name: { ja: "清田 兼明", en: "Kemmei Kiyota", kana: { last: "きよた", first: "けんめい" } },

  positions: [
    {
      company: "株式会社清田自動車",
      role: "代表取締役",
      url: "https://www.kiyota-cars.com",
      desc: "熊本・近見の自動車整備／鈑金。車検・整備・新車中古車販売・保険・レッカー。",
    },
    {
      company: "合同会社WBT",
      role: "代表社員",
      url: "https://withbt.com",
      desc: "With Bright Tomorrow。テクノロジーで中小企業の明日を明るくする。",
    },
  ],

  tagline: "情の伝播 — テクノロジーと人の温もりで、明日をもっと明るくする。",

  philosophy: {
    label: "",
    text:
      "情を、伝播させる。感情・情報・熱情を織り合わせ、明日をもっと明るくする。\n\n" +
      "自動車の現場から生まれた「人の温もり」と、テクノロジーの力。その二つを重ねることが、清田兼明の仕事の芯にある。",
  },

  // metrics は実数値確定まで書かない（追加すれば Proof 章が自動点灯・採番も自動）。
  // 例) metrics: [{ value: 00, suffix: "年", label: "創業からの歩み" }],

  worksIntro: "合同会社WBTが提供するプロダクト。気になるものは、そのままご相談ください。",

  products: [
    {
      category: "SaaS",
      name: "BrightBoard",
      url: "https://withbt.com/demodeta/demo/",
      desc: "自動車整備業向け業務効率化ダッシュボード。工程管理・顧客管理・予約をワンストップで。",
      image: "works/brightboard.webp",
    },
    {
      category: "Education",
      name: "BrightAcademy",
      url: "https://withbt.com/digital-namecard/demos/brightacademy/index.html",
      desc: "外国人材向け教育プラットフォーム。対面×eラーニングで日本語研修から特定技能2号取得まで。",
      image: "works/brightacademy.webp",
    },
    {
      category: "Security",
      name: "BrightShield",
      url: "https://withbt.com/digital-namecard/demos/brightcompliance/index.html",
      desc: "中小企業向け経営の盾。コンプライアンス・BCP・組織図をワンストップで管理。",
      image: "works/brightshield.webp",
    },
    {
      category: "Coming Soon",
      name: "BrightCompliance",
      url: "https://withbt.com/digital-namecard/demos/brightcompliance/index.html",
      desc: "保険代理店向けコンプライアンス管理SaaS。態勢整備から教育・記録までをデジタル化。",
      image: "works/brightcompliance.webp",
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

  // Contact章のQR（cmp-owner/card.js の segno生成MECARD SVGをそのまま流用）
  qr: {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55 55" preserveAspectRatio="xMidYMid meet" class="segno"><path fill="#f4f2ec" d="M0 0h55v55h-55z"/><path class="qrline" stroke="#0a0a0a" d="M3 3.5h7m2 0h1m3 0h5m2 0h1m1 0h1m1 0h1m1 0h3m1 0h3m1 0h3m3 0h1m1 0h7m-49 1h1m5 0h1m3 0h1m3 0h1m2 0h1m2 0h1m4 0h1m1 0h2m5 0h2m2 0h3m1 0h1m5 0h1m-49 1h1m1 0h3m1 0h1m2 0h1m1 0h1m1 0h1m1 0h4m1 0h1m3 0h1m1 0h1m1 0h1m3 0h1m1 0h2m1 0h1m1 0h2m1 0h1m1 0h3m1 0h1m-49 1h1m1 0h3m1 0h1m6 0h2m1 0h3m2 0h3m3 0h3m4 0h1m2 0h1m1 0h1m2 0h1m1 0h3m1 0h1m-49 1h1m1 0h3m1 0h1m4 0h5m2 0h3m1 0h5m1 0h1m1 0h1m3 0h2m6 0h1m1 0h3m1 0h1m-49 1h1m5 0h1m1 0h2m4 0h2m1 0h1m2 0h1m1 0h1m3 0h5m7 0h1m3 0h1m5 0h1m-49 1h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7m-40 1h1m1 0h3m3 0h1m4 0h1m3 0h1m2 0h2m1 0h1m2 0h2m2 0h2m-41 1h1m2 0h1m1 0h2m1 0h3m1 0h1m1 0h3m1 0h2m2 0h5m1 0h1m1 0h2m1 0h1m2 0h3m1 0h2m1 0h1m-44 1h1m1 0h3m2 0h1m3 0h2m1 0h1m3 0h5m2 0h1m10 0h1m2 0h1m2 0h6m-48 1h1m1 0h1m3 0h1m2 0h1m1 0h4m4 0h3m2 0h1m2 0h2m2 0h2m1 0h2m1 0h1m3 0h2m3 0h3m-49 1h1m1 0h1m1 0h2m2 0h1m1 0h5m1 0h1m3 0h1m1 0h1m2 0h1m2 0h6m1 0h1m1 0h1m1 0h1m1 0h1m3 0h1m1 0h1m-47 1h1m1 0h2m1 0h2m2 0h2m1 0h1m1 0h2m3 0h1m4 0h1m2 0h7m2 0h3m2 0h3m-43 1h1m4 0h2m1 0h4m4 0h3m2 0h3m3 0h1m1 0h1m2 0h2m1 0h1m2 0h2m1 0h2m2 0h1m-47 1h3m2 0h1m1 0h1m1 0h1m3 0h1m2 0h2m1 0h1m4 0h1m2 0h1m2 0h1m1 0h1m4 0h3m2 0h1m4 0h1m-46 1h2m4 0h1m2 0h1m3 0h3m1 0h1m1 0h1m1 0h4m2 0h2m2 0h2m2 0h3m3 0h3m-47 1h1m3 0h1m1 0h6m2 0h4m6 0h2m1 0h2m5 0h2m1 0h1m2 0h3m1 0h1m1 0h2m-48 1h1m6 0h3m1 0h1m7 0h1m1 0h1m3 0h1m1 0h5m2 0h1m1 0h1m4 0h1m1 0h1m-44 1h1m2 0h2m1 0h1m1 0h1m2 0h1m1 0h5m2 0h2m1 0h1m1 0h3m2 0h2m2 0h2m2 0h1m6 0h2m-43 1h2m3 0h5m1 0h1m1 0h2m2 0h2m1 0h3m2 0h2m1 0h1m1 0h4m8 0h1m1 0h1m-48 1h6m2 0h1m9 0h3m1 0h2m1 0h1m1 0h2m1 0h1m4 0h1m2 0h2m2 0h1m2 0h3m-47 1h1m2 0h1m2 0h2m1 0h1m1 0h1m2 0h1m4 0h2m3 0h1m1 0h2m2 0h3m2 0h5m1 0h2m1 0h1m1 0h1m-49 1h1m2 0h6m2 0h3m1 0h2m2 0h2m1 0h6m1 0h1m1 0h5m2 0h1m1 0h5m3 0h1m-49 1h5m3 0h2m5 0h1m2 0h5m3 0h6m2 0h1m1 0h1m3 0h1m3 0h2m-45 1h1m1 0h2m1 0h1m1 0h1m1 0h2m5 0h2m1 0h1m1 0h1m1 0h1m1 0h3m1 0h8m2 0h1m1 0h1m1 0h2m1 0h1m-45 1h2m3 0h2m1 0h2m1 0h1m1 0h1m1 0h2m2 0h1m3 0h1m2 0h1m1 0h1m2 0h4m2 0h1m3 0h1m2 0h1m-48 1h1m1 0h1m1 0h5m4 0h1m2 0h4m1 0h7m1 0h1m1 0h2m1 0h2m2 0h1m1 0h6m2 0h1m-48 1h1m2 0h1m3 0h1m3 0h1m2 0h2m5 0h2m1 0h1m2 0h4m1 0h1m1 0h1m2 0h2m1 0h3m1 0h1m-46 1h2m1 0h1m1 0h2m3 0h2m1 0h2m1 0h1m3 0h3m1 0h1m1 0h1m2 0h1m2 0h1m1 0h1m5 0h5m1 0h1m1 0h1m-47 1h1m1 0h2m2 0h1m2 0h6m1 0h3m1 0h6m1 0h1m1 0h2m5 0h1m4 0h1m1 0h2m-44 1h1m2 0h1m3 0h2m2 0h1m1 0h5m1 0h1m3 0h1m1 0h1m1 0h4m2 0h2m1 0h2m1 0h1m2 0h4m-48 1h2m1 0h2m2 0h1m3 0h3m1 0h3m2 0h2m1 0h3m1 0h2m1 0h1m1 0h2m7 0h4m2 0h1m-46 1h1m1 0h2m1 0h2m4 0h1m1 0h2m1 0h1m2 0h2m1 0h1m2 0h1m1 0h1m2 0h5m3 0h1m1 0h5m-44 1h2m1 0h1m2 0h1m1 0h13m4 0h1m3 0h1m3 0h1m3 0h2m2 0h1m1 0h2m-48 1h1m3 0h2m3 0h1m1 0h1m3 0h5m5 0h1m2 0h5m2 0h1m1 0h2m1 0h2m2 0h4m-49 1h4m1 0h1m2 0h1m2 0h2m2 0h2m1 0h7m1 0h2m3 0h1m2 0h1m1 0h3m5 0h1m2 0h2m-48 1h1m2 0h1m1 0h3m1 0h2m1 0h2m2 0h1m1 0h1m2 0h1m1 0h5m1 0h3m3 0h2m3 0h1m1 0h1m2 0h1m1 0h1m-49 1h2m1 0h1m4 0h1m1 0h2m4 0h1m1 0h2m1 0h2m4 0h1m1 0h1m2 0h3m2 0h1m1 0h2m2 0h1m1 0h1m-45 1h1m3 0h3m1 0h1m2 0h1m2 0h2m1 0h1m2 0h3m2 0h1m1 0h1m2 0h3m1 0h2m1 0h2m2 0h2m4 0h1m-48 1h3m4 0h1m2 0h3m1 0h1m1 0h1m3 0h3m1 0h1m1 0h2m1 0h4m2 0h3m2 0h4m3 0h1m-49 1h3m3 0h1m1 0h3m1 0h3m2 0h1m1 0h9m4 0h1m2 0h2m1 0h1m1 0h5m1 0h1m1 0h1m-41 1h4m1 0h2m1 0h1m3 0h3m3 0h1m1 0h2m6 0h1m1 0h3m3 0h1m1 0h1m-47 1h7m4 0h1m1 0h1m1 0h3m1 0h1m2 0h1m1 0h1m1 0h1m1 0h1m2 0h2m2 0h1m3 0h2m1 0h1m1 0h2m1 0h2m-49 1h1m5 0h1m1 0h5m4 0h1m2 0h3m3 0h1m3 0h2m1 0h5m2 0h1m3 0h1m1 0h1m-47 1h1m1 0h3m1 0h1m6 0h6m2 0h6m1 0h1m2 0h1m1 0h1m1 0h2m2 0h7m-46 1h1m1 0h3m1 0h1m1 0h3m2 0h2m2 0h2m1 0h1m1 0h1m1 0h2m1 0h1m4 0h2m2 0h1m3 0h1m1 0h1m2 0h1m2 0h1m-49 1h1m1 0h3m1 0h1m3 0h1m2 0h1m2 0h1m2 0h1m1 0h2m1 0h1m1 0h1m1 0h4m2 0h1m1 0h2m6 0h5m-49 1h1m5 0h1m3 0h1m1 0h1m4 0h1m3 0h2m1 0h4m1 0h4m1 0h1m5 0h2m2 0h3m-47 1h7m1 0h1m3 0h5m2 0h3m1 0h5m3 0h1m3 0h1m8 0h1m2 0h2"/></svg>',
  },

  vcard: {
    filename: "kiyota_kemmei",
    org: "株式会社清田自動車",
    note: "株式会社清田自動車 代表取締役 / 合同会社WBT 代表社員",
  },

  updates: [
    { date: "2026-07-23", note: "マイスター統合フォーマット初版（owner-editorial＋シネマProducts 4枚）" },
  ],
};
