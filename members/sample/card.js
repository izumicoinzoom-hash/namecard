/**
 * BrightCard サンプル会員データ（架空人物・全フィールド使用）
 * 実在の同友会会員とは一切関係ありません。テンプレ検証用のダミーデータです。
 * sns 5件・positions 4件など、崩れ耐性の検証を兼ねています（写真は意図的に未配置
 * = 頭文字モノグラムのフォールバック確認用）。
 */
window.CARD = {
  schemaVersion: 1,
  slug: "sample",

  design: {
    template: "aura",
    accent: "#0284C7",
    photoPosition: "center top",
  },

  background: { ref: "aura/01" },

  name: {
    ja: "山田 太郎",
    en: "Taro Yamada",
    kana: { last: "やまだ", first: "たろう" },
  },

  positions: [
    { company: "サンプル製作所株式会社", role: "代表取締役", url: "https://example.com" },
    { company: "合同会社デモワークス", role: "顧問", url: "" },
    { company: "サンプル地域まちづくり協議会", role: "理事", url: "" },
    { company: "サンプル青年会議所", role: "会員", url: "" },
  ],

  tagline: "一期一会を大切に、明日の縁をつくる。",

  about:
    "熊本市内で製造業を営む傍ら、地域の中小企業支援にも力を入れています。\n" +
    "座右の銘は「継続は力なり」。若手経営者のネットワークづくりをライフワークにしています。",

  philosophy: {
    label: "座右の銘",
    text: "継続は力なり",
  },

  contacts: {
    address: {
      postal: "860-0000",
      region: "熊本県",
      locality: "熊本市中央区",
      street: "サンプル町1-2-3",
      display: "熊本県熊本市中央区サンプル町1-2-3",
    },
    phone: "096-000-0000",
    email: "sample@example.com",
    website: "https://example.com",
  },

  sns: [
    { type: "line-official", id: "@sample1234", badge: "公式" },
    { type: "instagram", id: "sample_yamada" },
    { type: "facebook", id: "sample.yamada" },
    { type: "x", id: "sample_taro" },
    { type: "youtube", id: "@sampleyamada" },
  ],

  businesses: [
    {
      name: "サンプル製作所株式会社",
      role: "代表取締役",
      url: "https://example.com",
      image: "",
      tags: ["製造業", "熊本"],
      desc: "精密部品の製造・加工を行う地域密着の製造業。",
    },
    {
      name: "合同会社デモワークス",
      role: "顧問",
      url: "",
      image: "",
      tags: ["コンサルティング", "業務改善"],
      desc: "中小企業の業務改善・DX導入支援。",
    },
  ],

  links: [
    { label: "note（経営コラム）", url: "https://note.com/example", desc: "経営コラムを発信中" },
  ],

  vcard: {
    filename: "yamada_taro",
    org: "",
    note: "",
  },

  updates: [
    { date: "2026-07-13", note: "初回制作（bright / #0284C7・架空サンプル）" },
    { date: "2026-07-15", note: "フレーム内配置モデルへ移行・aura / background(aura/01)に変更" },
  ],
};
