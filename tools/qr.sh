#!/usr/bin/env bash
#
# BrightCard 運用ツール — qr.sh
# 外部ライブラリ/CDNには実行時依存しない。生成はすべてビルド時（この場で1回）に
# 完結し、成果物は静的PNG/静的インラインSVG文字列のみ。実行時にネットワークへ
# 出ることは無い。
#
# 2つのモードを持つ（用途がまったく別物なので混同しないこと）:
#
#  1) url    — 公開URLからQR画像(PNG)を生成する。物理NFCカード同梱の「URL＋QR」
#              納品物（§1.3・checklist.md 手順8）用。
#     使い方: tools/qr.sh url <公開URL> <出力PNGパス>
#     例:     tools/qr.sh url https://withbt.com/card/yonekawa/ members/yonekawa/qr.png
#     （旧形式 `tools/qr.sh <公開URL> <出力PNGパス>` も後方互換で動作する）
#
#  2) mecard — 氏名/TEL/Email/URL/社名からMECARDを組み立て、card.js に貼れる
#              `qr:{svg:"…"}` 形のインラインSVG文字列を生成する。Contact章の
#              「Scan to save」パネル（owner-editorial標準・他テンプレはopt-in、
#              core.renderQr() が描画）で使う静的QRはこちらが正。
#     使い方: tools/qr.sh mecard <氏名> <TEL> <Email> <URL> <社名> [出力パス]
#     例:     tools/qr.sh mecard "清田 兼明" "080-3946-1430" \
#                 "izumi.coinzoom@gmail.com" "https://withbt.com" "合同会社WBT" \
#                 /tmp/qr-snippet.txt
#     出力パスを省略すると標準出力に `qr: { svg: "…" },` を1ブロック印字する。
#     そのまま該当会員の card.js の qr フィールドへ貼り付ける。
#
# 依存ツール（いずれもpipでローカルインストール・CDN不要）:
#   url    モード: qrencode（brew） または python3 + qrcode パッケージ
#   mecard モード: python3 + segno パッケージ（推奨・onyxライン準拠のSVG）
#                  segno が無ければ python3 + qrcode（svgフォールバック）
set -euo pipefail

usage() {
  cat >&2 <<'EOF'
使い方:
  tools/qr.sh url    <公開URL> <出力PNGパス>
  tools/qr.sh mecard <氏名> <TEL> <Email> <URL> <社名> [出力パス]

例:
  tools/qr.sh url    https://withbt.com/card/yonekawa/ members/yonekawa/qr.png
  tools/qr.sh mecard "清田 兼明" "080-3946-1430" izumi.coinzoom@gmail.com https://withbt.com "合同会社WBT"
EOF
  exit 1
}

gen_url_png() {
  local URL="$1" OUT="$2"
  mkdir -p "$(dirname "$OUT")"

  if command -v qrencode >/dev/null 2>&1; then
    qrencode -o "$OUT" -s 10 -m 2 -l M "$URL"
    echo "OK  qrencode で生成しました: $OUT"
    return 0
  fi

  if command -v python3 >/dev/null 2>&1 && python3 -c "import qrcode" >/dev/null 2>&1; then
    python3 - "$URL" "$OUT" <<'PY'
import sys
import qrcode

url, out = sys.argv[1], sys.argv[2]
img = qrcode.make(url)
img.save(out)
print(f"OK  python qrcode で生成しました: {out}")
PY
    return 0
  fi

  cat >&2 <<EOF
エラー: QRコード生成ツールが見つかりません。以下のいずれかを導入してください。

  brew install qrencode
  # または
  pip3 install qrcode[pil]

導入後、再度 tools/qr.sh url $URL $OUT を実行してください。
EOF
  return 1
}

gen_mecard_svg() {
  local NAME="$1" TEL="$2" EMAIL="$3" URL="$4" COMPANY="$5" OUT="${6:-}"

  if command -v python3 >/dev/null 2>&1 && python3 -c "import segno" >/dev/null 2>&1; then
    python3 - "$NAME" "$TEL" "$EMAIL" "$URL" "$COMPANY" "$OUT" <<'PY'
import sys
import segno

name, tel, email, url, company, out = sys.argv[1:7]


def esc(v):
    # MECARD フィールドのエスケープ（\ ; , : の順で必ず先にバックスラッシュ）
    return (
        str(v)
        .replace("\\", "\\\\")
        .replace(";", "\\;")
        .replace(",", "\\,")
        .replace(":", "\\:")
    )


fields = []
if name:
    fields.append("N:" + esc(name))
if tel:
    fields.append("TEL:" + esc(tel))
if email:
    fields.append("EMAIL:" + esc(email))
if url:
    fields.append("URL:" + esc(url))
if company:
    fields.append("ORG:" + esc(company))
mecard = "MECARD:" + ";".join(fields) + ";;"

qr = segno.make(mecard, error="m")

import io

buf = io.BytesIO()
qr.save(
    buf,
    kind="svg",
    scale=1,
    border=1,
    dark="#0a0a0a",
    light="#f4f2ec",
    xmldecl=False,
    svgclass="segno",
    lineclass="qrline",
    omitsize=True,
    nl=False,
)
svg = buf.getvalue().decode("utf-8")
svg_one_line = svg.replace("\n", "").replace('"', '\\"')
snippet = 'qr: {\n  svg:\n    "' + svg_one_line + '",\n},'

if out:
    with open(out, "w", encoding="utf-8") as f:
        f.write(snippet + "\n")
    print(f"OK  segno で生成しました（card.js貼付用スニペット）: {out}")
else:
    print(snippet)
PY
    return 0
  fi

  if command -v python3 >/dev/null 2>&1 && python3 -c "import qrcode.image.svg" >/dev/null 2>&1; then
    python3 - "$NAME" "$TEL" "$EMAIL" "$URL" "$COMPANY" "$OUT" <<'PY'
import sys
import io
import qrcode
import qrcode.image.svg

name, tel, email, url, company, out = sys.argv[1:7]


def esc(v):
    return (
        str(v)
        .replace("\\", "\\\\")
        .replace(";", "\\;")
        .replace(",", "\\,")
        .replace(":", "\\:")
    )


fields = []
if name:
    fields.append("N:" + esc(name))
if tel:
    fields.append("TEL:" + esc(tel))
if email:
    fields.append("EMAIL:" + esc(email))
if url:
    fields.append("URL:" + esc(url))
if company:
    fields.append("ORG:" + esc(company))
mecard = "MECARD:" + ";".join(fields) + ";;"

img = qrcode.make(mecard, image_factory=qrcode.image.svg.SvgPathImage)
buf = io.BytesIO()
img.save(buf)
svg = buf.getvalue().decode("utf-8")
svg_one_line = svg.replace("\n", "").replace('"', '\\"')
snippet = 'qr: {\n  svg:\n    "' + svg_one_line + '",\n},'

if out:
    with open(out, "w", encoding="utf-8") as f:
        f.write(snippet + "\n")
    print(f"OK  python qrcode(SVGフォールバック) で生成しました（card.js貼付用スニペット）: {out}")
else:
    print(snippet)
PY
    return 0
  fi

  cat >&2 <<EOF
エラー: QR(SVG)生成ツールが見つかりません。以下のいずれかを導入してください。

  pip3 install segno
  # または
  pip3 install qrcode[pil]

導入後、再度
  tools/qr.sh mecard "$NAME" "$TEL" "$EMAIL" "$URL" "$COMPANY"
を実行してください。
EOF
  return 1
}

[ $# -ge 1 ] || usage

case "$1" in
  url)
    [ $# -eq 3 ] || usage
    gen_url_png "$2" "$3"
    ;;
  mecard)
    # $1=mecard を含むため、必須は氏名/TEL/Email/URL/社名の5つ＝$#6、出力パス指定で$#7
    [ $# -ge 6 ] && [ $# -le 7 ] || usage
    gen_mecard_svg "$2" "$3" "$4" "$5" "$6" "${7:-}"
    ;;
  *)
    # 後方互換: サブコマンド省略時は旧形式 `qr.sh <URL> <出力PNGパス>` とみなす
    if [ $# -eq 2 ]; then
      gen_url_png "$1" "$2"
    else
      usage
    fi
    ;;
esac
