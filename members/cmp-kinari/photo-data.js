/**
 * vCard埋込用サムネイル（Base64）。
 * PoC検証用のためBase64は未生成（空文字）。
 * 他会員の実データBase64を誤って流用しないよう、
 * 本人（山本千尋）分のBase64が用意されるまでは空のままにする。
 * core.js の buildVCard は空文字なら PHOTO 行を省略するため、白画面にはならない。
 */
window.CARD_PHOTO_BASE64 = "";
