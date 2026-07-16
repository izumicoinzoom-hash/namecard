/**
 * vCard埋込用サムネイル（Base64）雛形。
 * 写真が無い会員はこのファイルを空のまま（PHOTO_BASE64 = ""）にしてください。
 * 生成する場合は tools/photo.sh <元画像> members/<slug>/ を実行すると
 * このファイルが自動で上書きされます（480px/画質60/Base64後40KB以下）。
 */
window.CARD_PHOTO_BASE64 = "";
