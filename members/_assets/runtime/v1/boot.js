/**
 * BrightCard runtime v1 — boot.js
 * card.js を読み、design.template に応じてテンプレJS/CSSを注入する。
 *
 * 設計上の責務:
 *  - card.js が壊れている/未定義でも白画面にせず最小表示にフォールバックする
 *  - ?debug=1 で欠落フィールドを列挙するパネルを出す
 *  - file:// で開いても（fetchを使わず<script src>/<link>注入のみで）動く
 *
 * 読み込み順: card.js → photo-data.js → boot.js(defer) → core.js → icons.js
 *            → templates/<template>.js + .css → テンプレのrender()呼び出し
 */
(function () {
  "use strict";

  var CURRENT_SCRIPT = document.currentScript;
  var RUNTIME_BASE = resolveRuntimeBase(CURRENT_SCRIPT);
  var DEFAULT_TEMPLATE = "bright";
  var qs = parseQuery(location.search);
  var DEBUG = qs.debug === "1";

  function resolveRuntimeBase(scriptEl) {
    try {
      var src = scriptEl && scriptEl.src;
      if (!src) throw new Error("no currentScript.src");
      // 自分自身(boot.js)と同じディレクトリを runtime のベースとする。
      // URL API は file:// でも動作するため、file://直開きでも相対解決できる。
      return new URL(".", src).href;
    } catch (e) {
      // 最終手段: 既知の相対パスにフォールバック
      return "../_assets/runtime/v1/";
    }
  }

  function parseQuery(search) {
    var out = {};
    String(search || "").replace(/^\?/, "").split("&").forEach(function (pair) {
      if (!pair) return;
      var kv = pair.split("=");
      out[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || "");
    });
    return out;
  }

  function loadScript(src, onload, onerror) {
    var s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.onload = onload;
    s.onerror = function () { (onerror || function () {})(new Error("load failed: " + src)); };
    document.head.appendChild(s);
  }

  function loadCss(href) {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
    return l;
  }

  // ---------- 最小フォールバック表示（core.js すら読めない最悪ケース用） ----------

  function renderMinimalFallback(reason) {
    try {
      var card = window.CARD;
      var name = (card && card.name && card.name.ja) || (card && card.slug) || "BrightCard";
      var wrap = document.createElement("div");
      wrap.setAttribute("style", [
        "max-width:480px", "margin:60px auto", "padding:32px 24px",
        "font-family:-apple-system,'Noto Sans JP',sans-serif", "line-height:1.9",
        "color:#0a0a0a", "background:#fff",
      ].join(";"));

      var h1 = document.createElement("h1");
      h1.style.fontSize = "20px";
      h1.style.marginBottom = "12px";
      h1.textContent = name;
      wrap.appendChild(h1);

      var c = (card && card.contacts) || {};
      if (c.phone) {
        var p = document.createElement("div");
        p.innerHTML = "電話: <a href=\"tel:" + c.phone + "\">" + c.phone + "</a>";
        wrap.appendChild(p);
      }
      if (c.email) {
        var e = document.createElement("div");
        e.innerHTML = "メール: <a href=\"mailto:" + c.email + "\">" + c.email + "</a>";
        wrap.appendChild(e);
      }

      var note = document.createElement("p");
      note.style.marginTop = "20px";
      note.style.fontSize = "12px";
      note.style.color = "#94a3b8";
      note.textContent = "表示の読み込みに問題が発生したため簡易表示中です。";
      wrap.appendChild(note);

      document.body.appendChild(wrap);
    } catch (e) {
      // ここで例外が起きても何もしない（本当に最後の砦）
    }
    if (DEBUG) renderDebugPanelRaw(reason);
  }

  // core.js が無い場合用の簡易デバッグパネル（テキストのみ）
  function renderDebugPanelRaw(reason) {
    var pre = document.createElement("pre");
    pre.setAttribute("style", [
      "position:fixed", "top:0", "left:0", "right:0", "z-index:9999",
      "background:#111", "color:#f87171", "font-size:11px", "padding:12px",
      "white-space:pre-wrap", "max-height:40vh", "overflow:auto", "margin:0",
    ].join(";"));
    pre.textContent = "[BrightCard debug]\nランタイム読み込みエラー: " + (reason && reason.message ? reason.message : reason) +
      "\n\nwindow.CARD raw dump:\n" + safeStringify(window.CARD);
    document.body.insertBefore(pre, document.body.firstChild);
  }

  function safeStringify(obj) {
    try { return JSON.stringify(obj, null, 2); } catch (e) { return String(obj); }
  }

  // ---------- core.js 読み込み後のデバッグパネル ----------

  function renderDebugPanel(result) {
    var core = window.BrightCardCore;
    var box = document.createElement("div");
    box.setAttribute("style", [
      "position:fixed", "top:0", "left:0", "right:0", "z-index:9999",
      "background:rgba(10,10,10,0.95)", "color:#fff", "font-size:11px",
      "font-family:monospace", "padding:12px 14px", "max-height:45vh",
      "overflow:auto", "line-height:1.6",
    ].join(";"));

    var title = document.createElement("div");
    title.style.fontWeight = "bold";
    title.style.marginBottom = "6px";
    title.textContent = "[BrightCard ?debug=1] template=" + (window.CARD && window.CARD.design && window.CARD.design.template);
    box.appendChild(title);

    (result.errors || []).forEach(function (msg) {
      var d = document.createElement("div");
      d.style.color = "#f87171";
      d.textContent = "✗ " + msg;
      box.appendChild(d);
    });
    (result.warnings || []).forEach(function (msg) {
      var d = document.createElement("div");
      d.style.color = "#fbbf24";
      d.textContent = "△ " + msg;
      box.appendChild(d);
    });
    if (!(result.errors || []).length && !(result.warnings || []).length) {
      var ok = document.createElement("div");
      ok.style.color = "#4ade80";
      ok.textContent = "✓ 欠落項目なし";
      box.appendChild(ok);
    }

    document.body.insertBefore(box, document.body.firstChild);
  }

  // ---------- メイン処理 ----------

  function boot() {
    var card = window.CARD;
    var photoBase64 = window.CARD_PHOTO_BASE64 || "";

    var validation = { ok: false, errors: ["window.CARD が未定義です"], warnings: [] };

    try {
      loadScript(RUNTIME_BASE + "core.js", function () {
        try {
          validation = window.BrightCardCore.validateCard(card);
        } catch (e) {
          validation = { ok: false, errors: ["validateCard実行時エラー: " + e.message], warnings: [] };
        }

        if (!validation.ok) {
          // name.ja すら無い致命的ケース → 最小表示のみ
          renderMinimalFallback(new Error(validation.errors.join(" / ")));
          return;
        }

        loadScript(RUNTIME_BASE + "icons.js", function () {
          var template = (card.design && card.design.template) || DEFAULT_TEMPLATE;
          var validTemplates = ["bright", "aura", "editorial", "washi", "minimal", "onyx", "alloy", "kiln", "flux", "kinari", "owner-editorial"]; // 実装済みテンプレ一覧
          if (validTemplates.indexOf(template) === -1) template = DEFAULT_TEMPLATE;

          loadCss(RUNTIME_BASE + "templates/" + template + ".css");
          loadScript(
            RUNTIME_BASE + "templates/" + template + ".js",
            function () {
              try {
                var renderer = window.BrightCardTemplates && window.BrightCardTemplates[template];
                if (typeof renderer !== "function") throw new Error("テンプレート " + template + " が登録されていません");
                renderer(card, photoBase64, window.BrightCardCore, window.BrightCardIcons);
              } catch (e) {
                renderMinimalFallback(e);
              }
              if (DEBUG) renderDebugPanel(validation);
            },
            function (e) {
              renderMinimalFallback(e);
              if (DEBUG) renderDebugPanel(validation);
            }
          );
        }, function (e) {
          renderMinimalFallback(e);
          if (DEBUG) renderDebugPanel(validation);
        });
      }, function (e) {
        renderMinimalFallback(e);
        if (DEBUG) renderDebugPanelRaw(e);
      });
    } catch (e) {
      renderMinimalFallback(e);
      if (DEBUG) renderDebugPanelRaw(e);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
