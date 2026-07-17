/**
 * BrightCard 会員データ（card.js）雛形
 * ------------------------------------------------------------
 * このファイルが「読み込ませるソース」です。1枚作る/更新するときは
 * このファイルだけを編集してください（index.htmlやランタイムは触らない）。
 *
 * 必須は name.ja のみ。他の項目は空文字 "" / 空配列 [] / フィールド省略で
 * かまいません。空のセクションはランタイムが自動で非表示にします
 * （TODO残置・書き忘れ事故を構造的に防ぐための設計です）。
 *
 * 記入が終わったら、ローカルでこのフォルダの index.html を開き、
 * URL末尾に "?debug=1" を付けて欠落チェックパネルを確認してください。
 * 例: file:///path/to/members/<slug>/index.html?debug=1
 *
 * SNS type に使える値:
 *   line / line-official / whatsapp / instagram / x / facebook /
 *   youtube / tiktok / linkedin / github
 *
 * 写真:
 *   photo.jpg     … 表示用（長辺1600px/画質72/300KB以下）。省略可
 *                    （省略時は氏名の頭文字モノグラムを自動表示）
 *   photo-data.js … vCard埋込用サムネイル（480px/画質60/Base64後40KB以下）
 *                    tools/photo.sh で1コマンド生成できます
 */
window.CARD = {
  // スキーマバージョン。変更しないでください（ランタイムが参照します）
  schemaVersion: 1,

  // このカードのURLスラッグ（フォルダ名と一致させる）
  slug: "",

  // ===== デザイン =====
  design: {
    // テンプレート（全11種）:
    //   標準/C系（生成背景＋額装ポートレート）: bright / aura / editorial / washi / minimal
    //   差別化/B系（撮影名刺→抽出→章立て）    : onyx / alloy / kiln / flux / kinari
    //   オーナー（GQ最上位・products/qr対応）  : owner-editorial
    // ★テンプレ固有の追加フィールド（background / metrics / products / worksIntro / qr）は
    //   下のコメントスタブ＋ members/cmp-<template>/card.js の実例を参照して記入すること。
    template: "bright",
    // アクセントカラー（16進）。省略時はテンプレ既定色（ember系）
    accent: "#c0392b",
    // ヒーロー写真の表示位置（CSS object-position）。省略時 "center top"
    photoPosition: "center top",
  },

  // ===== 背景（C系テンプレ bright/aura/editorial/washi/minimal のみ使用） =====
  // background: { ref: "bright/01" }, // _assets/backgrounds/<ref>.webp を参照。会員独自画像は { src: "bg.jpg" }

  // ===== 氏名（必須は name.ja のみ） =====
  name: {
    ja: "", // 例: "米川 昌志"（必須・姓名の間に全角/半角スペース）
    en: "", // 例: "Masashi Yonekawa"（ローマ字。伝統ヘボン式）
    kana: {
      last: "",  // 例: "よねかわ"
      first: "", // 例: "まさし"
    },
  },

  // ===== 肩書き（会社×役職。複数可・0件も可） =====
  positions: [
    // { company: "株式会社ヨネカワ", role: "代表", url: "" },
  ],

  // ===== キャッチコピー（1〜2行の短文。空なら非表示） =====
  tagline: "",

  // ===== 自己紹介文（About。空なら非表示） =====
  about: "",

  // ===== 座右の銘・理念（Philosophy。空なら非表示） =====
  philosophy: {
    label: "", // 例: "座右の銘"
    text: "",  // 例: "感謝と縁で架ける信頼の和"
  },

  // ===== 連絡先（各項目とも空なら該当行を非表示） =====
  contacts: {
    address: {
      postal: "",   // 例: "860-0806"
      region: "",   // 例: "熊本県"
      locality: "", // 例: "熊本市中央区"
      street: "",   // 例: "花畑町x-x"
      display: "",  // 表示用の1行表記。例: "熊本市中央区花畑町x-x"
    },
    phone: "",   // 例: "090-0000-0000"
    email: "",
    website: "",
  },

  // ===== SNS（0〜8件。上から4件が右側フロート表示） =====
  sns: [
    // { type: "line-official", id: "@xxxxxxx", badge: "公式" },
    // { type: "instagram", id: "your_handle" },
  ],

  // ===== 兼業・複数事業（0件可。会社カードとして表示） =====
  businesses: [
    // {
    //   name: "Don Espaco",
    //   role: "オーナー",
    //   url: "",
    //   image: "", // 例: "shop.jpg"（省略可・省略時は汎用アイコン）
    //   tags: ["飲食店", "熊本"],
    //   desc: "",
    // },
  ],

  // ===== 汎用リンク（businessesに当てはまらない任意リンク。0件可） =====
  links: [
    // { label: "note", url: "", desc: "" },
  ],

  // ===== テンプレ固有フィールド（該当テンプレのみ有効・他テンプレは無視。実例=members/cmp-<template>/card.js） =====
  // ▼ 差別化B系（onyx/alloy/kiln/flux/kinari）: Story章の実績メトリクス（0件可）
  // metrics: [ { value: 28, suffix: "", label: "ブランド設計" }, { static: "SNS", label: "写真起点の導線" } ],
  // ▼ owner-editorial のみ: Works章の商品紹介（worksIntro=導入文 / products=各商品。0件可）
  // worksIntro: "",
  // products: [ { category: "", name: "", url: "", desc: "", price: "料金：要見積" } ],
  // ▼ owner-editorial が標準描画するQR。tools/qr.sh mecard で生成した静的SVGを貼る（他テンプレは非描画）
  // qr: { svg: "<svg ...>...</svg>" },

  // ===== vCard（連絡先保存）関連 =====
  vcard: {
    filename: "", // 例: "yonekawa_masashi"（拡張子不要。空ならslugから自動生成）
    org: "",      // ORG行を上書きしたい場合のみ指定（通常はpositions[0]から自動）
    note: "",     // NOTE行に追記したい文言（空なら自動生成のみ）
  },

  // ===== 更新履歴（運用ログ。vバンプ＝課金1回の記録用） =====
  updates: [
    // { date: "2026-07-20", note: "初回制作（bright / #c0392b）" },
  ],
};
