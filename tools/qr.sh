#!/usr/bin/env bash
#
# BrightCard 運用ツール — qr.sh
# 公開URLからQRコード画像(PNG)を生成する。納品物は「URL＋QRコード画像」のみ
# （§1.3）。 qrencode があればそれを使い、無ければ Python の qrcode パッケージに
# フォールバックする。どちらも無い場合はインストール手順を案内して終了する。
#
# 使い方:
#   tools/qr.sh <公開URL> <出力PNGパス>
# 例:
#   tools/qr.sh https://withbt.com/card/yonekawa/ members/yonekawa/qr.png
set -euo pipefail

usage() {
  echo "使い方: $0 <公開URL> <出力PNGパス>" >&2
  echo "例:     $0 https://withbt.com/card/yonekawa/ members/yonekawa/qr.png" >&2
  exit 1
}

[ $# -eq 2 ] || usage

URL="$1"
OUT="$2"
mkdir -p "$(dirname "$OUT")"

if command -v qrencode >/dev/null 2>&1; then
  qrencode -o "$OUT" -s 10 -m 2 -l M "$URL"
  echo "OK  qrencode で生成しました: $OUT"
  exit 0
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
  exit 0
fi

cat >&2 <<EOF
エラー: QRコード生成ツールが見つかりません。以下のいずれかを導入してください。

  brew install qrencode
  # または
  pip3 install qrcode[pil]

導入後、再度 tools/qr.sh $URL $OUT を実行してください。
EOF
exit 1
