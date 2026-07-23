# 清田兼明 デジタル名刺「マイスター統合フォーマット」設計仕様書

- 作成日: 2026-07-23
- 対象URL: https://withbt.com/digital-namecard/ （清田さんが共有している本人カードURL）
- 統合元:
  - デザイン土台 = **owner-editorial テンプレ**（`members/_assets/runtime/v1/templates/owner-editorial.{js,css}`・二重露光フルブリードHero＋sticky-stack GQ誌面）
  - コンテンツ = **現行 `/digital-namecard/index.html` の Products 章**（BrightBoard / BrightAcademy / BrightShield / BrightCompliance の4商品）
- 変更点の核: Products をアプリスクショではなく **シネマティックAI生成画像**（暗め・ember光・映画的＝ヒーロー二重露光と同一世界観）で見せる
- 成果物: 本仕様書＋AI画像生成プロンプト4本（生成は采配役が実施。実装・デプロイは次工程）

---

## 1. 配置先の判断

| 案 | 内容 | 長所 | 短所 |
|---|---|---|---|
| **①〔推奨〕** | `/digital-namecard/index.html` を members 同様の**薄いシェル＋card.js＋runtime参照**へ作り替える | URL不変・card.js単一データ源・テンプレ改善が自動で本人カードにも波及する | ルート直下から `members/_assets/` を参照する初のケース（動作確認が1点増える） |
| ② | owner-editorial を土台に**単一HTMLへ移植**（現行index.html方式の継続） | 完全自己完結でランタイム非依存 | テンプレ本体とのコード分裂（BB正本分裂事故と同型のリスク）・二重メンテ |
| ③ | `/card/kiyota/` に新設し `/digital-namecard/` からリダイレクト | members体系に完全準拠 | 共有済みURLの見た目が変わる・リダイレクト設定が増える・OG解決が二段になる |

**推奨 = ①。** 根拠:
- `boot.js` は `resolveRuntimeBase()` で **自分自身の src からランタイムベースを解決**するため、シェルから `<script src="members/_assets/runtime/v1/boot.js" defer>` と書くだけで templates/core/icons が正しく解決される（パス改修不要）。
- `owner-editorial.js` の Hero 写真は `heroImg.src = "photo.jpg"`（**ページ相対**）。`/digital-namecard/photo.jpg`（既存・二重露光済み133KB）がそのまま使われる。`photo-data.js`（vCard用base64）も既存を流用。
- ソース分裂を作らない（`feedback_bb_canonical_source` の教訓）。テンプレは1本、データは card.js 1枚。

シェル雛形は `members/demo-owner/index.html` を踏襲（書き換えは title / description / og:title / og:image の4行＋script参照3本のみ）。og:image は絶対URL `https://withbt.com/digital-namecard/photo.jpg`。既存 index.html は `index.bak-YYYYMMDD.html` として退避する。

---

## 2. 章構成（清田版）

owner-editorial の章は card.js のデータ有無で自動点灯する。清田版の点灯は以下の5章（採番は自動）。

| 章 | データ源 | 目的・コピー方向 |
|---|---|---|
| **00 Hero** | `name` / `positions` / `tagline` / photo.jpg | 二重露光フルブリード＝既存 `/digital-namecard/photo.jpg` 流用。`photoPosition: "50% 18%"`。氏名=清田 兼明（きよた けんめい / Kemmei Kiyota）、肩書2行（清田自動車 代表取締役・合同会社WBT 代表社員）、tagline=「情の伝播 — テクノロジーと人の温もりで、明日をもっと明るくする。」（現行踏襲） |
| **01 Philosophy** | `philosophy.text` | 情の伝播の理念。cmp-owner の文面を正とする（「情を、伝播させる。感情・情報・熱情を織り合わせ…」）。明朝プルクオートで大きく見せる |
| **02 Ventures** | `positions[]`（url/desc 付き） | 現行カードの **Business 章の吸収先**。清田自動車（鈑金・車検整備・販売・保険・レッカー）と合同会社WBT（With Bright Tomorrow）の2社をクレジット行で。desc は cmp-owner 準拠（「熊本・近見の自動車整備／**鈑金**。…」） |
| **03 Works (Products)** | `products[]`＋新規 `image` | **本設計の核。** 現行 Products 章の4商品（名前・説明・リンク・バッジ→category）をそのまま踏襲し、各商品にシネマ生成画像を差す（§3） |
| **04 Contact** | `contacts` / `sns` / `qr` / vCard | 住所・電話・メール・SNS（WBT公式LINE/個人LINE/WhatsApp）・vCard保存・QR。全て清田実データ（kiyota-sample / cmp-owner 準拠） |

- **Proof（実績 metrics）章は今回スキップ**。清田の実数値が未確定のため `metrics` は card.js に書かない（未定義なら章ごと非点灯・採番も自動で詰まる）。将来「創業年数 / BB稼働拠点数 / 教育修了者数」等が確定したら `metrics:[{value,suffix,label}]` を追加するだけで点灯する、と card.js にコメントで注記しておく。
- 現行の「From WBT」章（Bright Series 3リンク）は Products と重複するため**廃止**。「料金と根拠」リンクは Works 章の `worksIntro` 下には載せず、BrightBoard の url 先（withbt.com）に委ねる。
- Ventures 章は仕様指定の4章（Hero→Philosophy→Products→Contact）に対する追加だが、positions[] を書けば自動点灯する owner-editorial の標準動作であり、現行カードの Business 章（2社紹介）の受け皿として**残す**（消すには positions から url/desc を削る改修が必要になり本末転倒）。

---

## 3. Products 章に画像を足す設計

### 3-1. スキーマ拡張（後方互換）

`products[]` に**任意フィールド `image`** を追加する。

```js
products: [
  {
    category: "SaaS",
    name: "BrightBoard",
    url: "...",
    desc: "...",
    price: "",                      // 空なら非表示（既存仕様どおり）
    image: "works/brightboard.webp" // ★新規・任意。ページ相対パス
  },
]
```

- `image` 未指定 → **従来どおりテキストのみ描画**（demo-owner / cmp-owner は無改修で表示不変＝後方互換）。
- 画像404 → `onerror` で media ノードを除去しテキストのみへフォールバック（Hero写真と同じ流儀）。

### 3-2. テンプレ描画追加（owner-editorial.js）

Works ループ内・`p.category` 描画の**前**に挿入:

```js
if (nonEmpty(p.image)) {
  var pImg = el("img", { src: p.image, alt: p.name + " のイメージ", loading: "lazy", decoding: "async" });
  var pMedia = el("div", { class: "bc-oe-p-media" }, [pImg]);
  pImg.onerror = function () { if (pMedia.parentNode) pMedia.parentNode.removeChild(pMedia); };
  prodChildren.push(pMedia);
}
```

### 3-3. CSS追加（owner-editorial.css・Works節へ）

```css
/* ===== Works 画像（任意・image指定時のみ） ===== */
.bc-owner-editorial .bc-oe-p-media {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid var(--bc-oe-line-soft);
  background: #111010;
  margin-bottom: 14px;
}
.bc-owner-editorial .bc-oe-p-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* 下辺を黒地へ溶かし、ember光をヒーローscrimと同調させる */
.bc-owner-editorial .bc-oe-p-media::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(to top, rgba(10, 10, 10, 0.45), rgba(10, 10, 10, 0) 42%),
    radial-gradient(120% 80% at 70% 20%, var(--bc-oe-accent-light, rgba(232, 112, 58, 0.08)), transparent 60%);
}
.bc-owner-editorial .bc-oe-p-media + .bc-oe-p-cat { margin-top: 0; }
```

### 3-4. 見せ方の決定事項

- **アスペクト比 16:9**（生成もこの比率で行う。owner-editorial の 34rem 幅1カラム誌面に、写真→categoryキッカー→明朝の商品名→説明→CTA という「グラビア＋キャプション」の縦組み）。
- 画像はカード枠で囲わず**罫線区切りの誌面のまま**、角丸10pxの写真ブロックだけ差す（既存 `.bc-oe-product` の枠なし美学を維持）。
- ダーク地への馴染ませはCSSオーバーレイ（下辺黒グラデ＋ember微光）で担保。生成画像側も暗部基調で作る（§4）。
- 1商品=1画像。現行の BrightAcademy 2分割スクショ（日本語版/特定2号塾）は**1枚のシネマ画像に統合**し、2塾の区別は desc とタグ表現（category）で伝える。
- タグ列（現行 product-tags）は owner-editorial に対応要素がないため **category 1語＋desc に吸収**（誌面の情報密度を優先。price 欄は空で非表示）。

### 3-5. 4商品の順序とコピー（現行踏襲）

| # | category | name | url | desc（現行コピーそのまま） | image |
|---|---|---|---|---|---|
| 1 | SaaS | BrightBoard | `https://withbt.com/demodeta/demo/` | 自動車整備業向け業務効率化ダッシュボード。工程管理・顧客管理・予約をワンストップで。 | `works/brightboard.webp` |
| 2 | Education | BrightAcademy | `https://withbt.com/digital-namecard/demos/brightacademy/index.html` | 外国人材向け教育プラットフォーム。対面×eラーニングで日本語研修から特定技能2号取得まで。 | `works/brightacademy.webp` |
| 3 | Security | BrightShield | `https://withbt.com/digital-namecard/demos/brightcompliance/index.html` | 中小企業向け経営の盾。コンプライアンス・BCP・組織図をワンストップで管理。 | `works/brightshield.webp` |
| 4 | Coming Soon | BrightCompliance | `https://withbt.com/digital-namecard/demos/brightcompliance/index.html` | 保険代理店向けコンプライアンス管理SaaS。態勢整備から教育・記録までをデジタル化。 | `works/brightcompliance.webp` |

※ url は現行 index.html の遷移先を踏襲（demos/ 系は相対→絶対URL化して card.js の可搬性を確保）。バッジ（SaaS/Security/Coming Soon）は category 欄で継承。

---

## 4. ★AI画像生成プロンプト4本（そのままコピペで生成可）

**共通仕様**: 16:9 / 暗部基調 / ember (#E8703A) の温かい光 / 映画的（anamorphic・浅い被写界深度・フィルムグレイン）/ ヒーロー二重露光と同一世界観 / **文字・ロゴ・実在人物なし**（人物は後ろ姿・シルエットのみ）/ 画面内のUI・書類は判読不能の抽象発光ブロックにする。生成後は webp 化し **各≦150KB**（幅1600px目安・quality 72前後）。保存先: `/Users/kemmei/wbt.company/digital-namecard/works/`。

### 4-1. `brightboard.webp` — BrightBoard（夜の鈑金工場×光る工程ボード）

```
Cinematic still, 16:9 aspect ratio. A Japanese auto body repair workshop at night,
one car raised on a two-post lift in the mid-ground, its silhouette rim-lit by warm
ember-orange work lights (#E8703A). On the near wall, a large glowing digital
workflow board: an abstract grid of softly luminous amber and white rectangles and
progress bars — completely illegible, no readable characters. Deep shadows, dark
charcoal-black ambience (#0a0a0a base), faint drifting spark bokeh and thin haze in
the air. Moody film noir lighting, anamorphic lens feel, shallow depth of field,
subtle 35mm film grain, teal-free warm/black palette. Symbolic and atmospheric, like
a double-exposure magazine cover. No people. No text, no letters, no numbers, no
logos, no watermark, no brand marks, no legible UI.
```

### 4-2. `brightacademy.webp` — BrightAcademy（温かい光の教室で学ぶ多国籍人材）

```
Cinematic still, 16:9 aspect ratio. A warm evening classroom in Japan, seen from the
back of the room: a small group of diverse young international trainees seated at
wooden desks, silhouetted and viewed only from behind — faces never visible.
A single warm ember-orange pool of light (#E8703A) from low-hanging pendant lamps
falls across open notebooks and a softly glowing screen at the front showing only
abstract blurred shapes of light — nothing legible. Surrounding darkness fades to
near-black (#0a0a0a), window at dusk with deep blue-black night outside. Hopeful,
intimate, painterly mood; anamorphic shallow depth of field, gentle 35mm film grain,
cinematic contrast. Symbolic, editorial magazine tone. No identifiable faces, no
real persons, no text, no letters, no logos, no watermark, no flags.
```

### 4-3. `brightshield.webp` — BrightShield（中小企業を守る光の盾）

```
Cinematic still, 16:9 aspect ratio. A symbolic guardian image: a translucent dome of
warm ember-orange light (#E8703A) arcing protectively over a tiny cluster of small
Japanese workshop and office buildings at night, seen from a low dramatic angle.
The shield reads as woven threads of light — thin glowing lattice lines converging
overhead like a protective vault, embers drifting upward. Beyond the dome, vast
calm darkness (#0a0a0a) with faint cold rain streaks that never penetrate the light.
Strong chiaroscuro, monumental yet warm; feels like safety and quiet strength.
Anamorphic cinematic look, shallow depth of field, subtle 35mm film grain,
double-exposure magazine-cover aesthetic. No people, no text, no letters, no
numbers, no logos, no watermark, no shields with heraldic symbols.
```

### 4-4. `brightcompliance.webp` — BrightCompliance（秩序あるデジタル記録の殿堂）

```
Cinematic still, 16:9 aspect ratio. A dark archival hall rendered as a symbol of
perfect order: long converging rows of floating, softly glowing translucent panels
— abstract document sheets of light — aligned with immaculate precision, receding
into deep black distance (#0a0a0a). Each panel carries only blurred luminous bands,
nothing legible. A single warm ember-orange key light (#E8703A) grazes the edges of
the rows, with faint amber data-thread lines connecting panel to panel like a quiet
constellation of accountability. Atmosphere of calm, discipline and trust —
insurance-grade order. One-point perspective, cathedral-like depth, cinematic
chiaroscuro, anamorphic shallow depth of field, subtle 35mm film grain, editorial
double-exposure mood. No people, no text, no letters, no numbers, no logos, no
watermark, no recognizable documents.
```

**生成後の共通後処理（采配役）**:
```bash
# 例: png/jpg で受領した場合
cwebp -q 72 -resize 1600 0 brightboard.png -o works/brightboard.webp   # 各≦150KB確認
```

---

## 5. card.js（清田版・実装用ドラフト）

`/Users/kemmei/wbt.company/digital-namecard/card.js` として新設。氏名・連絡先・SNSは kiyota-sample / cmp-owner の実データ準拠。

```js
window.CARD = {
  schemaVersion: 1,
  slug: "digital-namecard",

  design: { template: "owner-editorial", accent: "#E8703A", photoPosition: "50% 18%" },

  name: { ja: "清田 兼明", en: "Kemmei Kiyota", kana: { last: "きよた", first: "けんめい" } },

  positions: [
    { company: "株式会社清田自動車", role: "代表取締役", url: "https://www.kiyota-cars.com",
      desc: "熊本・近見の自動車整備／鈑金。車検・整備・新車中古車販売・保険・レッカー。" },
    { company: "合同会社WBT", role: "代表社員", url: "https://withbt.com",
      desc: "With Bright Tomorrow。テクノロジーで中小企業の明日を明るくする。" },
  ],

  tagline: "情の伝播 — テクノロジーと人の温もりで、明日をもっと明るくする。",

  philosophy: {
    label: "",
    text: "情を、伝播させる。感情・情報・熱情を織り合わせ、明日をもっと明るくする。\n\n" +
          "自動車の現場から生まれた「人の温もり」と、テクノロジーの力。その二つを重ねることが、清田兼明の仕事の芯にある。",
  },

  // metrics は実数値確定まで書かない（追加すれば Proof 章が自動点灯する）
  // metrics: [{ value: 00, suffix: "年", label: "……" }],

  worksIntro: "合同会社WBTが提供するプロダクト。気になるものは、そのままご相談ください。",

  products: [
    { category: "SaaS", name: "BrightBoard", url: "https://withbt.com/demodeta/demo/",
      desc: "自動車整備業向け業務効率化ダッシュボード。工程管理・顧客管理・予約をワンストップで。",
      image: "works/brightboard.webp" },
    { category: "Education", name: "BrightAcademy", url: "https://withbt.com/digital-namecard/demos/brightacademy/index.html",
      desc: "外国人材向け教育プラットフォーム。対面×eラーニングで日本語研修から特定技能2号取得まで。",
      image: "works/brightacademy.webp" },
    { category: "Security", name: "BrightShield", url: "https://withbt.com/digital-namecard/demos/brightcompliance/index.html",
      desc: "中小企業向け経営の盾。コンプライアンス・BCP・組織図をワンストップで管理。",
      image: "works/brightshield.webp" },
    { category: "Coming Soon", name: "BrightCompliance", url: "https://withbt.com/digital-namecard/demos/brightcompliance/index.html",
      desc: "保険代理店向けコンプライアンス管理SaaS。態勢整備から教育・記録までをデジタル化。",
      image: "works/brightcompliance.webp" },
  ],

  contacts: {
    address: { postal: "861-4101", region: "熊本県", locality: "熊本市南区",
      street: "近見7丁目12番20号", display: "熊本県熊本市南区近見7丁目12番20号" },
    phone: "080-3946-1430",
    email: "izumi.coinzoom@gmail.com",
    website: "https://www.kiyota-cars.com",
  },

  sns: [
    { type: "line-official", id: "https://lin.ee/SJVNO5k", badge: "WBT公式" },
    { type: "line", id: "https://line.me/ti/p/Q_Lhjmw-hp", badge: "個人" },
    { type: "whatsapp", id: "818039461430" },
  ],

  qr: { svg: /* cmp-owner/card.js の MECARD QR SVG をそのまま流用 */ "" },

  vcard: { filename: "kiyota_kemmei", org: "株式会社清田自動車",
    note: "株式会社清田自動車 代表取締役 / 合同会社WBT 代表社員" },

  updates: [{ date: "", note: "マイスター統合フォーマット初版（owner-editorial＋シネマProducts）" }],
};
```

シェル `/digital-namecard/index.html`（置き換え後）:

```html
<title>清田 兼明 | Kemmei Kiyota</title>
<meta name="description" content="清田兼明 - 株式会社清田自動車 代表取締役 / 合同会社WBT 代表社員">
<meta property="og:title" content="清田 兼明 | Kemmei Kiyota">
<meta property="og:image" content="https://withbt.com/digital-namecard/photo.jpg">
...
<script src="card.js?v=1"></script>
<script src="photo-data.js?v=1"></script>
<script src="members/_assets/runtime/v1/boot.js" defer></script>
```

---

## 6. 制約（厳守）

- 表記: **「鈑金」**（板金は不可）／ **「Kemmei Kiyota」**（Kenmei は不可）／ **「合同会社WBT」**。
- 連絡先はダミー禁止。清田実データ（§5のとおり。kiyota-sample/card.js 準拠）。
- モーションは owner-editorial 既存のまま（CSS Scroll-Driven＋IntersectionObserver＋rAF 1本。**backdrop-filter / GSAP / WebGL 禁止**。reduced-motion 二重防御維持）。今回のテンプレ改修は §3-2/3-3 の追加のみで、既存モーションへ手を入れない。
- 生成画像は webp 化・**各≦150KB**・`loading="lazy"` 必須（Hero 写真の初期表示を邪魔しない）。
- 後方互換: `image` 未指定の既存カード（demo-owner / cmp-owner）の表示が 1px も変わらないこと。

---

## 7. 実装への申し送り

### 触るファイル

| ファイル | 操作 |
|---|---|
| `digital-namecard/works/brightboard.webp` ほか4枚 | 新規（采配役が生成→webp化→配置） |
| `digital-namecard/card.js` | 新規（§5ドラフト。QRは cmp-owner から流用） |
| `digital-namecard/index.html` | 薄いシェルへ全置換（旧版は `index.bak-YYYYMMDD.html` 退避） |
| `members/_assets/runtime/v1/templates/owner-editorial.js` | Works ループへ image 描画追加（§3-2） |
| `members/_assets/runtime/v1/templates/owner-editorial.css` | `.bc-oe-p-media` 追加（§3-3） |

### 段階

1. **画像生成**（采配役）: §4 の4プロンプトで生成 → webp化（≦150KB）→ `works/` へ配置
2. **テンプレ改修**: owner-editorial.{js,css} へ §3 の追加（cmp-owner で無変化を確認＝後方互換テスト）
3. **card.js / シェル作成**: §5 のとおり。旧 index.html 退避
4. **ローカルプレビュー**: `file://` 直開き＋ローカルHTTPで確認（boot.js は file:// 対応済み）
5. **デプロイ**: withbt.com へ FTP（`reference_xserver_ftp` 参照）。`?v=` キャッシュバスタ更新

### 検証項目

- [ ] Hero: 二重露光 photo.jpg がフルブリード表示・氏名刻印モーション・「Kemmei Kiyota」表記
- [ ] 章点灯: Hero→Philosophy→Ventures→Works→Contact の5章・Proof 非表示・採番が 00〜04 で詰まる
- [ ] Works: 4商品とも画像表示・16:9・下辺が黒地へ溶ける・リンク遷移正常・image を1件外すとテキストのみに戻る
- [ ] 画像404時に media ブロックが消えてレイアウト破綻しない
- [ ] Contact: 電話/メール/住所/SNS 3種/QR/vCard 保存（PHOTO 込み）動作
- [ ] cmp-owner / demo-owner の表示が改修前後で不変（後方互換）
- [ ] 390px 幅で水平スクロールなし・reduced-motion で全アニメ停止
- [ ] 転送量: 初期ロード合計が現行（スクショPNG群）以下になること
- [ ] OGP: og:image が絶対URLで解決（LINE/X のカードプレビュー確認）
