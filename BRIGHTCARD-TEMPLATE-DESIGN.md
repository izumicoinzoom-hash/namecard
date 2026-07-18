# BrightCard 静的テンプレートシステム 設計仕様書
## 同友会会員向けデジタル名刺（config駆動・複数デザインパターン・売り切り商品）

- 対象: `/Users/kemmei/wbt.company/digital-namecard/`（制作正本） + `withbt.com/card/`（公開先）
- 商品名: **BrightCard**（既存フッタークレジット継承）
- 設計: Fable（2026-07-13）。実装は後続タスク（§7）で Sonnet が行う。

---

## 0. 既存資産の読解サマリ（設計の根拠）

| 資産 | 内容 | 本設計での扱い |
|---|---|---|
| `digital-namecard/index.html`（1027行） | 清田さん本人版。ライト紙面＋ember。Hero写真→Products→Business→Contact→From WBT→フッター＋浮遊SNS＋固定CTA＋vCard JS（`photo-data.js` の `PHOTO_BASE64` を75桁折返しで埋込） | 会員版「Paper」テンプレの母体。**Products / From WBT は本人版専用として会員テンプレから構造ごと排除** |
| `digital-namecard/yonekawa/index.html`（763行） | 会員名刺の実制作前例（米川様・ダーク赤）。TODOコメント残置、vCardがJS内に手書き重複、SNSがプレースホルダのまま | 現行運用の痛みの実証。ダーク系「Bright」テンプレの母体。TODO残置・二重管理を本設計で構造的に解消 |
| `digital-namecard/editorial/index.html`（839行） | 雑誌調。Playfair＋金。body クラスで配色3種×レイアウト3種を切替（localStorage） | 「Editorial」テンプレの母体。閲覧者向け切替UIは会員版では撤去（商品としてはデザイン固定） |
| `index-monogram.html`（1219行） | 写真なし・モノグラム「K」ヒーロー | 独立パターンにせず、**全テンプレ共通の「写真なしフォールバック」**として吸収 |
| `brightcard/preview/a-minimal.html` | 白基調・丸アバター・チップ型役職 | 「Minimal」テンプレの母体。※`KENMEI KIYOTA` の誤記あり（正: Kemmei）。流用時に必ず修正 |
| `brightcard/preview/b-letterpress.html` | 和紙・活版・EB Garamond＋Noto Serif | 「Washi」テンプレの母体 |
| `brightcard/src/template.ts` | 自前 Mustache 風エンジン（`{{var}}` `{{#if}}` `{{#list}}`） | 直接は使わない（§1判断）。条件分岐の網羅リスト参照元 |
| `brightcard/src/types.ts` | `CardProfile`（positions[] / contacts / socials[] / accent_color / template_id） | §2 スキーマの出発点 |
| `brightcard/src/vcard.ts` | vCard 3.0 生成（N分割・PHOTO折返し・エスケープ） | クライアントJSへ移植（§5） |
| `brightcard/src/templates/socials.ts` | 8種SNSブランドSVG辞書＋URL正規化（`@id`→URL展開） | `icons.js` へ移植（§5） |
| `photo-data.js` | `const PHOTO_BASE64="..."`（約23KB） | 形式踏襲しつつ `window.CARD_PHOTO_BASE64` に名前空間化 |

---

## 1. アーキテクチャ方針

### 1.1 結論: 「薄いシェルHTML ＋ card.js（会員データ）＋ 共通ランタイム（テンプレ実装）」のクライアントサイド描画

会員1人分の公開フォルダは4ファイルだけ。

```
withbt.com/card/<slug>/
  index.html      ← 薄いシェル（静的OGP head ＋ script 2本の読込のみ。約40行）
  card.js         ← 会員データ＝「読み込ませるソース」。手編集はここ1箇所
  photo.jpg       ← ヒーロー写真（省略可）
  photo-data.js   ← vCard用サムネイルBase64（省略可）
```

テンプレ実装（HTML構造・CSS・vCard生成・SNS出し分け）はサイト共通の versioned ランタイムに集約。

```
withbt.com/card/_assets/runtime/v1/
  boot.js                 ← card.js を読み、design.template に応じてテンプレJS/CSSを注入
  core.js                 ← 共通部品（DOMヘルパ・vCard・SNS正規化・検証）
  icons.js                ← SNS/連絡先アイコンSVG辞書（socials.ts移植＋lucideサブセットのインライン化）
  templates/
    bright.js  bright.css
    paper.js   paper.css
    editorial.js editorial.css
    washi.js   washi.css
    minimal.js minimal.css
```

シェル `index.html` の本質:

```html
<head>
  <!-- ▼▼ 会員ごとに書き換えるのはこの4行だけ（OGPはクローラがJS実行しないため静的に持つ） -->
  <title>米川 昌志 | Masashi Yonekawa</title>
  <meta name="description" content="米川昌志 - 株式会社ヨネカワ 代表">
  <meta property="og:title" content="米川 昌志 | Masashi Yonekawa">
  <meta property="og:image" content="https://withbt.com/card/yonekawa/photo.jpg">
  <!-- ▲▲ -->
  <script src="card.js?v=1"></script>
  <script src="photo-data.js?v=1"></script>
  <script src="/card/_assets/runtime/v1/boot.js" defer></script>
</head>
<body><noscript>（氏名・電話・メールの最低限を静的に併記）</noscript></body>
```

### 1.2 3方式比較と選定

| 評価軸 | A. 全文手編集（現行yonekawa） | B. ローカル・プレレンダ | **C. クライアントサイド描画（採用）** |
|---|---|---|---|
| 1枚作る速さ | 速いが毎回ブレる | card.js編集＋renderコマンド | **card.js編集→ブラウザで開くだけ** |
| テンプレ差し替え | 作り直し | 再レンダ1コマンド | **`template: "bright"` の1語変更** |
| 二重管理 | vCard/SNS/本文が3箇所重複 | データ1箇所 | **データ1箇所** |
| 崩れにくさ | 編集のたび全体が壊れうる | 静的出力で最強 | シェルは触らない。typoは検証＋フォールバック吸収 |
| 全カード一斉修正 | 全ファイル手直し | 全再レンダ→全FTP | **`runtime/v1/` 1箇所上書きで販売済み全カードに波及** |
| 確定要件との整合 | ✕ | △（node実行が挟まる） | **◎（要件の文言どおり）** |

**C採用の決め手:** ①確定要件の文言に一致（コマンドレス） ②売り切り商品の品質保証コスト最小（不具合修正＝ランタイム1箇所） ③file:// でローカル確認可。

**トレードオフ手当て:** OGPはシェルhead静的4行／JS無効は`<noscript>`最小表示／ランタイム更新は `v1`＝バグ修正のみ・意匠変更は `v2` 新設で新規のみ参照。

### 1.3 課金モデルからの構造制約（§6連動）

- **納品物は「URL＋QRコード画像」のみ**。card.js・写真素材・フォルダ一式は会員に渡さない。編集権と正本は清田さん側に集約。
- **会員セルフ編集の仕組み（編集フォーム・管理画面）は作らない**（意図的不採用。§6.3）。
- card.js は開発者ツールで閲覧可能＝技術的秘匿は設計目標にしない。囲い込みの実体は「編集権・ホスティング・ドメイン・制作ノウハウ」。

---

## 2. 会員データスキーマ（card.js ＝「読み込ませるソース」）

JSONではなく **JSオブジェクトリテラル**（末尾カンマ許容・コメント可・`<script src>`読込でCORS不要）。

```js
window.CARD = {
  schemaVersion: 1,
  slug: "yonekawa",
  design: { template: "bright", accent: "#c0392b", photoPosition: "center top" },
  name: { ja: "米川 昌志", en: "Masashi Yonekawa", kana: { last: "よねかわ", first: "まさし" } },
  positions: [
    { company: "株式会社ヨネカワ", role: "代表", url: "" },
  ],
  tagline: "感謝と縁で架ける信頼の和",
  about: "…",
  philosophy: { label: "座右の銘", text: "感謝と縁で架ける信頼の和" },
  contacts: {
    address: { postal: "860-0806", region: "熊本県", locality: "熊本市中央区", street: "花畑町x-x", display: "熊本市中央区花畑町x-x" },
    phone: "090-0000-0000", email: "", website: "",
  },
  sns: [
    { type: "line-official", id: "@xxxxxxx", badge: "公式" },
    { type: "instagram", id: "donespaco" },
  ],
  businesses: [
    { name: "Don Espaco", role: "オーナー", url: "", image: "shop.jpg", tags: ["飲食店","熊本"], desc: "…" },
  ],
  links: [],
  vcard: { filename: "yonekawa_masashi", org: "", note: "" },
  updates: [ { date: "2026-07-20", note: "初回制作（bright / #c0392b）" } ],
};
```

**必須は `name.ja` のみ**。他は省略可＝空フィールドはセクションごと非表示（TODO残置事故を構造的に根絶）。業種の幅は汎用スロット（positions / businesses / links / philosophy）の組合せで吸収し、業種専用フィールドは作らない。
SNS対応: `line-official / line / whatsapp / instagram / x / facebook / youtube / tiktok / linkedin / github`。`id`（`@handle`/番号）→ランタイムがURL展開。
写真2系統: `photo.jpg`（表示・長辺1600px/q72/300KB以下）と `photo-data.js`（vCard埋込・480px/q60/Base64後40KB以下）。

---

## 3. デザインカタログ（11テンプレ・3ライン）※2026-07-17 統合で全面更新

3ラインで販売（価格は§6）。全テンプレは共通ランタイム（card.js の `design.template` 1語で切替）。ライブ見本＝`withbt.com/card/_catalog.html`（清田実データで11デザイン）。

### 標準ライン（C系・生成AI背景＋額装ポートレート／量産NFC名刺と同価格帯）
| テンプレ | 世界観 | 配色 | 想定業種 |
|---|---|---|---|
| **bright** | ダーク・シネマ／角丸縦フレーム | 黒＋accent(既定ember) | 建設・製造・自動車・運送 |
| **aura** | 柔光ボケ／円フレーム | 明＋accent | 医療・美容・サロン |
| **editorial** | 雑誌／左フレーム右明朝 | 黒＋金系 | ブランド志向経営者・高級飲食 |
| **washi** | 和紙・額装・落款 | 生成り＋墨 | 士業(伝統)・和食・工芸 |
| **minimal** | 白余白・小円アバター | 白＋accent一点 | IT・若手・写真なし |

背景＝生成AI画像（`background.ref` → `_assets/backgrounds/<ref>.webp`）。切り抜き不要のフレーム内配置。

### 差別化ライン（B系・撮影名刺型：名刺を撮る→AI抽出→章立て構成）
| テンプレ | 世界観 | 配色 |
|---|---|---|
| **onyx** | 漆黒エディトリアル・明朝 | 黒＋橙 |
| **alloy** | ブラッシュドアルミ・寒色ゴシック | 冷灰＋スチール青 |
| **kiln** | 明・クラフト紙・木 | 生成り＋焦茶 |
| **flux** | 深夜ネオン・モノ字 | 深紺＋発光ミント |
| **kinari** | 明・和紙・縦書きヒーロー | 生成り＋藍 |

構成＝撮影名刺インテイク→抽出フィールド→01 Portrait→02 Story→03 Save＋収納式FAB。Story章に `metrics[]` を使用。

### オーナーライン（GQ最上位・清田本人版を吸収）
| テンプレ | 世界観 |
|---|---|
| **owner-editorial** | 二重露光ヒーロー＋刻印モーション＋sticky-stack章＋実QR＋Works章 |

`products[]`(Works章・要見積)/`qr:{svg}`(MECARD静的SVG)/`philosophy` を使用。

**全テンプレ共通制約:** ①name.ja以外は省略可・空はセクション非表示 ②写真なし→頭文字モノグラム ③長さ耐性（会社名〜25字/positions1〜4/sns0〜8） ④共通ランタイム(boot/core/icons/templates)・**card.js1箇所編集**・全カード一斉修正はruntime1箇所上書き ⑤accent1色で着せ替え ⑥**「From WBT自己宣伝枠」は入れない**（会員自身の商品＝owner-editorialのproductsは可）。フッターは`© YYYY 氏名`＋小さく`Powered by BrightCard（合同会社WBT）`のみ。

---

## 4. ファイル構成と「1枚作る」フロー

### 制作正本
```
digital-namecard/
  index.html ほか            ← 清田さん本人版（現状維持・対象外）
  members/
    _assets/runtime/v1/ …    ← 公開ランタイム
    _template/               ← 雛形（index.html / card.js / photo-data.js）
    _catalog/                ← パターン見本（架空人物で5パターン）
    <slug>/                  ← 会員フォルダ
  tools/  photo.sh  qr.sh  deploy.sh  checklist.md
```

### 公開
- URL: `https://withbt.com/card/<slug>/`
- FTP: `/withbt.com/public_html/card/`（BB等と同docroot。資格情報は `reference_xserver_ftp`）

### 「1枚作る」手順（目標: 2枚目以降15〜30分/枚）
0. ヒアリング（記入シート＝申込書と一体）→ 1. 雛形コピー → 2. card.js記入 → 3. `photo.sh` で写真2系統自動生成 → 4. シェルhead4行書換 → 5. ローカル確認（`?debug=1`で欠落検証）→ 6. `deploy.sh <slug>` → 7. iPhone実機QA（表示・vCard・LINE OGP）→ 8. `qr.sh` でQR生成しURL＋QR納品 → 9. `updates[]`追記。
更新時は該当項目のみ→`card.js?v=N`を1つバンプ（**vバンプ＝課金1回**）。

---

## 5. vCard・写真・SNS・アイコンの共通化

- **vCardビルダー**（core.js・vcard.ts移植）: N分割／X-PHONETIC（kana）／ORG・TITLE／ADR構造化／itemN.URL＋X-ABLabel（businesses/links/LINE公式）／NOTE／PHOTO 75桁折返し／CRLF・UTF-8 BOMなし・VERSION:3.0・escape。保存はBlob＋`<a download>`。
- **写真2系統**を `photo.sh` が1コマンドで生成（上限検査込み）。
- **SNS出し分け**: `sns`にあるものだけ描画・0件なら保存ボタンのみ・浮遊列は先頭4件＋保存ボタン。URL正規化は index.ts の normalizeSocialUrl 移植。
- **脱CDN**: lucideは廃止しSVGパスを `icons.js` にインライン（unpkg障害＝全カードのアイコン消失を排除）。Google Fontsのみ外部依存として継続（swap＋フォールバック）。
- **QR統一方針（P3c・2026-07-17）**: Contact章「Scan to save」パネルのQRは `card.js` の `qr:{svg:"<インラインSVG文字列>"}`（MECARDエンコード）が正。`tools/qr.sh mecard` がビルド時に静的生成する（segno優先・qrcode SVGフォールバック、いずれもpipローカル・実行時CDN依存ゼロ）。描画は `core.js` の共通ヘルパ `BrightCardCore.renderQr(card)` に統一（card.qr.svgが無ければnullを返しパネル非表示）。owner-editorialはこれを標準搭載（現行の見た目・クラスは維持したまま内部委譲）、他テンプレ（bright/aura/onyx等）は現時点では追加しない任意opt-in（NFC＋URLが主導線のためスコープ外）。§1.3の「URL＋QR画像」納品物（`tools/qr.sh url`）とは別物＝混同しないこと。

---

## 6. 課金・料金設計（売り切り＋都度再課金）※2026-07-17 3ライン化・価格再確定（市場調査20観点→Fable統合）

### 6.0 市場調査サマリ（Sonnet並列10体・2026-07-13）
価格アンカーは2市場に割れる:
- **A. NFCデジタル名刺（量産品）**: プレーリーカード/lit.link/MEET等 ¥2,980〜4,980（専用デザインでも¥3,980）、更新無料。高級素材のみ¥14,000〜16,500。← 会員が「デジタル名刺いくら？」で想起する市場。
- **B. 専用デザイン1ページ制作**: ココナラ¥20,000〜38,000（中央値¥20,000〜28,000）、ランサーズ¥30,000〜58,000、士業LP¥70,000〜。← 本商品の中身が該当する市場。
- **C. リンク集ツール**: lit.link/Linktree 月¥0〜数千（セルフ入力）。← 別物。
- 更新スポット相場: ¥3,000〜10,000/回（簡易修正¥5,000程度）。直接競合(A)は更新無料。

**結論**: 当初アンカー¥22,000はB基準では妥当だが、会員はA(¥5,000)基準で見るため「4〜7倍」に映り高く感じる。会員仲間・口コミ前提なら量産品の少し上・制作代行の半額以下に置くのが刺さる。

### 6.1 本体価格 ★確定: 3ライン×素材別「全部入り」B方式（2026-07-17 再確定）
2026-07-17、11テンプレ統合（標準/差別化/オーナー）に伴い、市場調査20観点（Sonnet20体）→Fable統合で再設計。物理NFCカードを同梱した素材別「デジタル制作＋カード込み」の一括価格。市場は①既製¥2,980〜4,980／②カスタム¥4,980前後／③上位素材¥10,980〜17,200の三層で、**標準=②の上限／差別化=制作代行(¥2〜5万)・プロ撮影(¥1.5万)の代替中間帯／オーナー=空いていた最上位帯（1万円台）**に置く。

| ライン | 内容 | 黒(PVC) | 木(チェリー) | アルミ |
|---|---|---|---|---|
| **標準** | 生成背景・額装ポートレート5種（入口・量産NFCと同価格帯） | **¥4,900** | **¥5,400** | **¥5,900** |
| **差別化** | 撮影名刺型5種（名刺撮る→AI抽出→章立て・主力"竹"） | **¥6,900** | **¥7,400** | **¥7,900** |
| **オーナー** | GQ級最上位1種（材質アルミ固定・単一価格） | — | — | **¥14,800** |

- カード原価：黒¥136／木¥296／アルミ¥1,000（2026-03-23 Amazon実購入で確定・出品者eREC・圧縮余地ほぼ無し）。**「黒」は黒無地PVC**（黒メタルではない）。カードはNTAG215ブランク・名入れ印刷なし。
- **標準は据え置き**（量産カスタム帯¥4,980と一致＝「同価格で専用デザイン」が成立。黒¥4,900はlit.link∞¥4,980と被るためLPで「生成背景×額装＝量産テンプレではない」を最前面に）。
- **差別化は標準+¥2,000で新設**（撮影名刺型の工数＝プロ撮影¥1.5万相当の価値。標準と同価格では価値差を放棄。地方フリーランス名刺相場¥2〜3万の1/3以下で割安訴求も維持）。
- **オーナーは現行¥5,900→¥14,800（約2.5倍・単一）**＝Prairieブラックメタル¥14,980の直下に置き最上位の希少性を価格で語る（現行¥5,900では希少性を価格が語れず）。
- アンカリング：料金表先頭にオーナー¥14,800を置く松竹梅縦並び。参照点を量産NFCでなく「制作代行¥2〜5万／プロ撮影¥1.5万／1ページ¥3〜15万」に。売り切り主コピー＝「月額¥0・更新は必要な時だけ、外注より安い都度払い」。
- ★**オーナー¥14,800は同友会（価格感応度が高い零細/個人事業主）での実売未検証** → 先行数名限定のテスト販売で受容性を確認後に定価化を推奨。

### 6.2 更新の都度課金 ★半額原則維持・ライン別階層化（2026-07-17）
更新は都度課金（月額サブスクにしない＝サブスク疲れ層への訴求／Linq撤退例=サブスク併用の持続性の弱さが根拠）。初回価格の半額原則を維持しつつライン別に階層化。

| 種別 | 標準 | 差別化(+約20%) | オーナー |
|---|---|---|---|
| 軽微（テキスト修正・5項目まで） | ¥1,650 | ¥1,980 | ¥3,300 |
| 写真差し替え | ¥2,200 | ¥2,750 | ¥3,300 |
| 構成変更（セクション追加・書き直し） | ¥2,750 | ¥3,300 | ¥5,500 |
| デザイン全面変更（テンプレ切替＋QA） | ¥3,300 | ¥3,850 | ¥7,400 |

- **初回1ヶ月以内の軽微修正1回は無償**（標準/差別化）。**オーナーは初年度1回の軽微更新を無償同梱**（¥14,800の価格正当化材料）。最低受注¥1,650。
- **WBT側瑕疵（表示不具合・リンク切れ）は無償／会員都合の変更はすべて有償**。この線引きを納品案内に明記。
- ★最大競合Prairieが「更新永久無料」を掲げる以上、LPに正当化文言を必須で入れる：「専用デザインは更新も個別デザイン調整を伴う手作業だから有料。ただし外注し直す（¥5,000〜）より常に安い都度払い」。更新頻度が低い層には「年1回更新でも量産の年額より安い」の総額比較を添える。

### 6.3 立て付けが運用と整合する理由
①編集権の物理的集中（正本はリポジトリ＋清田さんのFTP権限内のみ）→「更新＝依頼＝再課金」が交渉なしで成立。②セルフ編集フォームは不採用（再課金の根拠を消す＋SaaS級サポート負債＋brightcard SaaSと役割衝突）。セルフ編集希望者は brightcard SaaS へ送客＝商品の住み分け。③守るのはデータ秘密でなく「運用の座」。④納品は物理NFCカード＋URL＋QRのみ・生ソース(card.js)は非納品を申込書に明記。カードのNFC書込先URL・編集権はWBT側に集約（会員が自分でURLを張り替え・更新できない＝再課金の物理的裏付け）。⑤フッター`Powered by BrightCard`が唯一かつ十分な営業導線。

### 6.4 パッケージ（任意・主軸は売り切り）
- 単発（主軸）: 初期のみ 標準¥4,900〜5,900／差別化¥6,900〜7,900／オーナー¥14,800（カード込み）。以後は都度課金
- 安心パック: 初期＋12ヶ月内の軽微修正2回 ＋¥2,200
- 5枚まとめ（企業・支部）: 1枚▲10〜15%
サブスクは不採用（請求管理コストが単価に見合わず、売り切りの明快さを損なう）。年次の情報棚卸しDMで更新受注を能動創出。

---

## 7. 実装タスク分解（Sonnet向け・依存順）

**MVP = T1〜T6**（Bright1パターン＋スキーマ＋架空サンプル1名を `withbt.com/card/sample/` に公開・実機QA通過）。以後の営業はMVPで開始可。

| # | タスク | 受入基準 | 依存 |
|---|---|---|---|
| T1 | スキャフォールド＋スキーマ確定 | card.jsが§2表と1:1・シェルの書換4行が明示 | — |
| T2 | ランタイムコア（boot/core） | 壊れたcard.jsでも白画面にならずフォールバック・`?debug=1`が欠落列挙・file://相対パスフォールバック | T1 |
| T3 | icons.js＋SNS正規化＋vCardビルダー | §5.1全プロパティ生成・iPhone実機で写真付き連絡先保存・lucide CDN参照ゼロ | T2 |
| T4 | テンプレ「Bright」 | §3共通制約6項目・写真なし/sns0件/positions4件で崩れない | T3 |
| T5 | サンプル会員＋清田サンプル | file://とHTTP両方表示・vCard・OGP正・「Kemmei Kiyota」「鈑金」表記正 | T4 |
| T6 | 運用ツール＋初公開 | photo.sh 1コマンドで2系統＋容量検査・`card/sample/`公開・checklist全通過 | T5 |
| T7 | テンプレ「Paper」「Minimal」 | `template:`1語変更のみで両パターン完全表示（KENMEI誤記修正） | T4 |
| T8 | テンプレ「Editorial」「Washi」 | 同上＋serifフォントは選択時のみ注入 | T4 |
| T9 | パターンカタログページ | 商談用1ページで5パターン提示（価格は載せない） | T7,T8 |
| T10 | 総合QAと磨き | 5テンプレ×3端末（iOS Safari/Chrome・Android・LINE/IGアプリ内）全通過・Lighthouse mobile90+ | T9 |

---

## 8. リスクと対策（抜粋）

| リスク | 対策 |
|---|---|
| card.js構文破壊で白画面 | 編集はcard.js1ファイル限定／未定義検知で最小表示に退避／`?debug=1`検証／公開前ローカル確認必須 |
| 写真容量過大 | photo.shが上限検査・超過でエラー停止・手動配置禁止 |
| vCard文字化け | VERSION3.0・UTF-8 BOMなし・CRLF・escapeをcore.jsに固定・両実機取込をchecklist必須 |
| iOS/アプリ内ブラウザの.vcf不発 | UA検知で「Safariで開く」案内・P2で静的card.vcf併置に切替可能な設計 |
| 外部CDN依存 | lucide廃止しインラインSVG・外部依存はGoogle Fontsのみ |
| 日本語表記ゆれ（板金/Kenmei等） | checklist表記検査（鈑金/伝統ヘボン式）＋**本人にLINEで承認取得後に公開** |
| キャッシュで更新見えず | `card.js?v=N`バンプ＝updates追記＝課金1回の三点セット |
| ランタイム更新で既販カード変化 | v1はバグ修正のみ・意匠変更はv2新設で新規のみ |
| 個人情報掲載事故 | ヒアリングシートに項目別掲載可否チェック |
| ホスティング停止・移管要求 | 申込書に掲載継続条件＋エクスポート有償対応明記・git正本で再公開は deploy.sh 一巡 |
