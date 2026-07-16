#!/usr/bin/env bash
#
# BrightCard 運用ツール — deploy.sh（雛形。MVP段階では実行しない）
#
# 会員1名分のフォルダ、または runtime 共通アセットを withbt.com/card/ へ
# lftp mirror でアップロードするための雛形。
#
# 資格情報はこのファイルに直書きしない。XserverのFTPホスト/ユーザー/パスワードは
# reference_xserver_ftp（ユーザーのローカル参照）から取得し、環境変数で渡すこと。
#   export BC_FTP_HOST=...
#   export BC_FTP_USER=...
#   export BC_FTP_PASS=...
#
# 使い方（想定・現時点では未実行）:
#   tools/deploy.sh member <slug>     … members/<slug>/ を card/<slug>/ へ反映
#   tools/deploy.sh runtime           … members/_assets/runtime/v1/ を
#                                        card/_assets/runtime/v1/ へ反映
#                                        （v1はバグ修正のみ。意匠変更はv2新設）
#
# 注意:
#   - 本番デプロイは本タスク（T1〜T6 MVP実装）の対象外。雛形として置くのみ。
#   - 実行前に必ずローカル確認（?debug=1含む）と申込書上の掲載可否チェックを
#     終えていること（tools/checklist.md参照）。
set -euo pipefail

REMOTE_BASE="/withbt.com/public_html/card"
LOCAL_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

require_env() {
  local missing=0
  for v in BC_FTP_HOST BC_FTP_USER BC_FTP_PASS; do
    if [ -z "${!v:-}" ]; then
      echo "エラー: 環境変数 $v が未設定です（reference_xserver_ftp を参照して設定してください）" >&2
      missing=1
    fi
  done
  [ "$missing" -eq 0 ] || exit 1
}

mirror() {
  local local_dir="$1" remote_dir="$2"
  echo "[deploy.sh] mirror: $local_dir -> $remote_dir"
  lftp -u "$BC_FTP_USER,$BC_FTP_PASS" "$BC_FTP_HOST" <<EOF
set ftp:ssl-allow yes
mirror --reverse --delete --verbose "$local_dir" "$remote_dir"
bye
EOF
}

usage() {
  echo "使い方: $0 member <slug> | $0 runtime" >&2
  exit 1
}

[ $# -ge 1 ] || usage
require_env

case "$1" in
  member)
    [ $# -eq 2 ] || usage
    SLUG="$2"
    LOCAL_DIR="$LOCAL_ROOT/members/$SLUG"
    [ -d "$LOCAL_DIR" ] || { echo "エラー: $LOCAL_DIR が存在しません" >&2; exit 1; }
    mirror "$LOCAL_DIR" "$REMOTE_BASE/$SLUG"
    echo "完了。card.js の updates[] に今回の反映内容を追記してください（vバンプ＝課金1回）。"
    ;;
  runtime)
    mirror "$LOCAL_ROOT/members/_assets/runtime/v1" "$REMOTE_BASE/_assets/runtime/v1"
    echo "完了。v1は互換維持のバグ修正のみに限定すること（意匠変更はv2新設）。"
    ;;
  *)
    usage
    ;;
esac
