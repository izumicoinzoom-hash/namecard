/**
 * vCard埋込用サムネイル（Base64）。
 * PoC検証用のためBase64は未生成（空文字）。
 * kiyota-sampleの実データ（清田さん本人の写真）を誤って流用しないよう、
 * 本人（森直人）分のBase64が用意されるまでは空のままにする。
 * core.js の buildVCard は空文字なら PHOTO 行を省略するため、白画面にはならない。
 */
window.CARD_PHOTO_BASE64 = "";
