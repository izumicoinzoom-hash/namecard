# BrightCard 制作チェックリスト

対象: `digital-namecard/members/<slug>/`（制作正本）→ `withbt.com/card/<slug>/`（公開先）
参照: `../BRIGHTCARD-TEMPLATE-DESIGN.md`（設計正本）

## 「1枚作る」手順（§4）

- [ ] 0. ヒアリング（記入シート＝申込書と一体。個人情報の項目別掲載可否を確認）
- [ ] 1. `members/_template/` を `members/<slug>/` へコピー
- [ ] 2. `card.js` を記入（§2スキーマ。必須は `name.ja` のみ）
- [ ] 3. `tools/photo.sh <元画像> members/<slug>` で写真2系統を自動生成（容量検査込み）
- [ ] 4. `index.html` の head 4行を書き換え（title / description / og:title / og:image）
- [ ] 5. ローカル確認: `python3 -m http.server` を `digital-namecard/` 直下で起動し、
      `http://localhost:<port>/members/<slug>/index.html?debug=1` で欠落チェック
- [ ] 6. `tools/deploy.sh member <slug>`（本番反映。MVP段階では実行しない／将来運用）
- [ ] 7. iPhone実機QA（表示崩れ・vCard保存・LINE/Instagramアプリ内ブラウザでのOGP）
- [ ] 8. `tools/qr.sh <公開URL> members/<slug>/qr.png` でQR生成、URL＋QRを納品
- [ ] 9. `card.js` の `updates[]` に日付・内容を追記（`?v=N` バンプ＝課金1回の記録）

## 表記チェック（§8: 日本語表記ゆれ対策）

- [ ] 「板金」ではなく「**鈑金**」になっているか
- [ ] ローマ字氏名が**伝統ヘボン式**になっているか（例: Kemmei であって Kenmei ではない）
- [ ] 会員本人にLINE等で内容確認・承認を得てから公開しているか
- [ ] フッターに `© YYYY 氏名` と控えめな `Powered by BrightCard（合同会社WBT）` のみが入っているか
      （Products / From WBT 枠が紛れ込んでいないか）

## vCard品質チェック（§8: 文字化け対策）

- [ ] `VERSION:3.0` になっているか
- [ ] 改行がCRLFか（core.js の buildVCard を通していれば自動で満たされる）
- [ ] UTF-8・BOMなしで保存されているか
- [ ] iPhone実機で「連絡先に保存」→ 氏名・電話・会社・写真が正しく取り込まれるか
- [ ] Android実機（Google連絡先アプリ）でも同様に確認したか

## 写真チェック

- [ ] `photo.jpg` が長辺1600px・300KB以下か（`tools/photo.sh` の出力ログで確認）
- [ ] `photo-data.js` がBase64後40KB以下か
- [ ] 手動で別ツール生成した写真をそのまま配置していないか（`photo.sh` 経由のみ許可）
- [ ] 写真なしの場合、頭文字モノグラムが正しく表示されるか（`photo.jpg` を配置しない）

## 崩れ耐性チェック（§3共通制約）

- [ ] `name.ja` 以外を全部空にしても白画面にならず、該当セクションが非表示になるか
- [ ] `sns` が0件でもフロート列が「保存ボタンのみ」で崩れないか
- [ ] `sns` が8件でもフロート列は先頭4件＋保存ボタンに収まるか
- [ ] `positions` が4件でもヒーローが崩れないか
- [ ] 会社名が長い（〜25字）場合でも折り返しで崩れないか

## 外部依存チェック（§8: CDN障害対策）

- [ ] `lucide` 等の外部アイコンCDN参照がゼロになっているか（`icons.js` のインラインSVGのみ）
- [ ] 外部依存が Google Fonts のみになっているか

## 公開前の最終確認

- [ ] `card.js` に個人情報以外の秘匿情報（下書きメモ等）が残っていないか
- [ ] 生ソース（`card.js` 一式）を会員に渡していないか（納品物はURL＋QRのみ、§1.3/§6.3）
- [ ] 申込書に「掲載継続条件」「更新は都度課金」「WBT側瑕疵は無償／会員都合は有償」が明記されているか
