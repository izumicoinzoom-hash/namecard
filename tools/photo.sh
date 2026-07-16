#!/usr/bin/env bash
#
# BrightCard 運用ツール — photo.sh
# 元写真から「表示用photo.jpg」と「vCard埋込用photo-data.js」の2系統を1コマンドで生成する。
# 容量検査込み（超過時は自動で画質を下げて再試行し、それでも超える場合はエラー終了）。
#
# 使い方:
#   tools/photo.sh <元画像パス> <会員フォルダ (例: members/yonekawa)>
#
# 生成物:
#   <会員フォルダ>/photo.jpg       … 表示用。長辺1600px / 画質72 / 300KB以下
#   <会員フォルダ>/photo-data.js  … vCard埋込用。長辺480px / 画質60 / Base64後40KB以下
#
# 依存: macOS標準の sips / base64（追加インストール不要）
set -euo pipefail

DISPLAY_MAX_EDGE=1600
DISPLAY_QUALITY_START=72
DISPLAY_MAX_BYTES=$((300 * 1024))

THUMB_MAX_EDGE=480
THUMB_QUALITY_START=60
THUMB_MAX_B64_BYTES=$((40 * 1024))

MIN_QUALITY=25
QUALITY_STEP=8

usage() {
  echo "使い方: $0 <元画像パス> <会員フォルダ>" >&2
  echo "例:     $0 ~/Desktop/yonekawa.jpg members/yonekawa" >&2
  exit 1
}

[ $# -eq 2 ] || usage

SRC="$1"
DEST_DIR="$2"

[ -f "$SRC" ] || { echo "エラー: 元画像が見つかりません: $SRC" >&2; exit 1; }
mkdir -p "$DEST_DIR"

filesize() {
  stat -f%z "$1" 2>/dev/null || stat -c%s "$1"
}

# 引数: 元画像 長辺px 出力先 開始画質
# 容量制限を満たすまで画質を段階的に下げながらリサイズする
resize_under_limit() {
  local src="$1" edge="$2" out="$3" quality="$4" max_bytes="$5"
  while [ "$quality" -ge "$MIN_QUALITY" ]; do
    sips -Z "$edge" -s format jpeg -s formatOptions "$quality" "$src" --out "$out" >/dev/null 2>&1
    local size
    size=$(filesize "$out")
    if [ "$size" -le "$max_bytes" ]; then
      echo "$quality:$size"
      return 0
    fi
    quality=$((quality - QUALITY_STEP))
  done
  return 1
}

echo "== BrightCard photo.sh =="
echo "元画像: $SRC"
echo "出力先: $DEST_DIR"

# ---- 1. 表示用 photo.jpg ----
DISPLAY_OUT="$DEST_DIR/photo.jpg"
if RESULT=$(resize_under_limit "$SRC" "$DISPLAY_MAX_EDGE" "$DISPLAY_OUT" "$DISPLAY_QUALITY_START" "$DISPLAY_MAX_BYTES"); then
  Q="${RESULT%%:*}"; SZ="${RESULT##*:}"
  echo "OK  photo.jpg       画質=${Q} サイズ=$((SZ / 1024))KB (上限300KB)"
else
  echo "エラー: photo.jpg が画質${MIN_QUALITY}まで下げても300KBに収まりません。元画像を見直してください。" >&2
  exit 1
fi

# ---- 2. vCard用サムネイル → Base64 → photo-data.js ----
TMP_THUMB="$(mktemp -t brightcard-thumb).jpg"
trap 'rm -f "$TMP_THUMB"' EXIT

quality="$THUMB_QUALITY_START"
ENCODED=""
FINAL_Q=""
while [ "$quality" -ge "$MIN_QUALITY" ]; do
  sips -Z "$THUMB_MAX_EDGE" -s format jpeg -s formatOptions "$quality" "$SRC" --out "$TMP_THUMB" >/dev/null 2>&1
  ENCODED=$(base64 -i "$TMP_THUMB" | tr -d '\n')
  B64_BYTES=${#ENCODED}
  if [ "$B64_BYTES" -le "$THUMB_MAX_B64_BYTES" ]; then
    FINAL_Q="$quality"
    break
  fi
  quality=$((quality - QUALITY_STEP))
done

if [ -z "$FINAL_Q" ]; then
  echo "エラー: photo-data.js 用サムネイルが画質${MIN_QUALITY}まで下げてもBase64後40KBに収まりません。" >&2
  exit 1
fi

PHOTO_DATA_JS="$DEST_DIR/photo-data.js"
{
  echo "/**"
  echo " * vCard埋込用サムネイル（Base64・自動生成）。"
  echo " * tools/photo.sh で生成。手動編集しないこと。"
  echo " * 生成条件: 長辺${THUMB_MAX_EDGE}px / 画質${FINAL_Q} / Base64後$((B64_BYTES / 1024))KB"
  echo " */"
  printf 'window.CARD_PHOTO_BASE64 = "%s";\n' "$ENCODED"
} > "$PHOTO_DATA_JS"

echo "OK  photo-data.js  画質=${FINAL_Q} Base64サイズ=$((B64_BYTES / 1024))KB (上限40KB)"
echo "完了。$DEST_DIR/photo.jpg と $DEST_DIR/photo-data.js を確認してください。"
