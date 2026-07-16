/**
 * BrightCard runtime v1 — core.js
 * 共通部品: スキーマ検証・SNS正規化・vCardビルダー・配色生成・スクロール制御。
 * テンプレJS（templates/*.js）から window.BrightCardCore として呼び出す。
 * brightcard/src/vcard.ts・templates/socials.ts を移植（NTAG非依存・クライアント完結）。
 */
(function (global) {
  "use strict";

  var SNS_LABELS = {
    line: "LINE",
    "line-official": "LINE公式",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    x: "X",
    facebook: "Facebook",
    youtube: "YouTube",
    tiktok: "TikTok",
    linkedin: "LinkedIn",
    github: "GitHub",
  };

  // ---------- 汎用ヘルパ ----------

  function isNonEmpty(v) {
    return v !== undefined && v !== null && String(v).trim() !== "";
  }

  function get(obj, path) {
    var parts = path.split(".");
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur === undefined || cur === null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  // ---------- スキーマ検証（?debug=1 用） ----------

  /**
   * card.js の内容を検証する。エラー（必須欠落・型異常）と
   * 推奨項目の欠落（警告）を分けて返す。白画面を出さないため、
   * このチェック自体は例外を投げない。
   */
  function validateCard(card) {
    var errors = [];
    var warnings = [];

    if (!card || typeof card !== "object") {
      errors.push("window.CARD が定義されていません（card.js の読み込み失敗、または構文エラーの可能性）");
      return { ok: false, errors: errors, warnings: warnings };
    }

    if (!isNonEmpty(get(card, "name.ja"))) {
      errors.push("name.ja が空です（唯一の必須項目）");
    }

    var validTemplates = ["bright", "aura", "editorial", "washi", "minimal"];
    var tpl = get(card, "design.template");
    if (!isNonEmpty(tpl)) {
      warnings.push("design.template が未指定です（既定の bright を使用）");
    } else if (validTemplates.indexOf(tpl) === -1) {
      warnings.push('design.template "' + tpl + '" は未知のテンプレートです（bright にフォールバック）');
    }

    if (!isNonEmpty(get(card, "design.accent"))) warnings.push("design.accent が未指定です（既定色を使用）");
    if (!isNonEmpty(card.name && card.name.en)) warnings.push("name.en が空です（英語表記欄が非表示になります）");
    if (!isNonEmpty(get(card, "tagline"))) warnings.push("tagline が空です（キャッチコピー欄が非表示）");
    if (!isNonEmpty(get(card, "about"))) warnings.push("about が空です（About セクションが非表示）");
    if (!isNonEmpty(get(card, "philosophy.text"))) warnings.push("philosophy.text が空です（理念セクションが非表示）");

    if (!Array.isArray(card.positions) || card.positions.length === 0) {
      warnings.push("positions が0件です（肩書き欄が非表示）");
    }

    var c = card.contacts || {};
    var addr = c.address || {};
    if (!isNonEmpty(addr.display) && !isNonEmpty(addr.street)) warnings.push("contacts.address が空です（住所行が非表示）");
    if (!isNonEmpty(c.phone)) warnings.push("contacts.phone が空です（電話行が非表示・vCardにTELが入りません）");
    if (!isNonEmpty(c.email)) warnings.push("contacts.email が空です（メール行が非表示）");
    if (!isNonEmpty(c.website)) warnings.push("contacts.website が空です（サイト行が非表示）");

    if (!Array.isArray(card.sns) || card.sns.length === 0) {
      warnings.push("sns が0件です（フロートSNSは保存ボタンのみ表示）");
    } else {
      card.sns.forEach(function (s, i) {
        if (!s || !SNS_LABELS[s.type]) {
          warnings.push("sns[" + i + "].type が不正、または未対応の種別です: " + (s && s.type));
        }
        if (!s || !isNonEmpty(s.id)) {
          warnings.push("sns[" + i + "].id が空です");
        }
      });
    }

    if (!Array.isArray(card.businesses) || card.businesses.length === 0) {
      warnings.push("businesses が0件です（事業セクションが非表示）");
    }
    if (!Array.isArray(card.links) || card.links.length === 0) {
      warnings.push("links が0件です（リンクセクションが非表示）");
    }

    if (!isNonEmpty(get(card, "vcard.filename"))) {
      warnings.push("vcard.filename が未指定です（slug から自動生成）");
    }

    if (!Array.isArray(card.updates) || card.updates.length === 0) {
      warnings.push("updates が0件です（更新履歴の記録漏れの可能性）");
    }

    return { ok: errors.length === 0, errors: errors, warnings: warnings };
  }

  // ---------- SNS 正規化 ----------

  function stripAt(id) {
    return String(id || "").replace(/^@/, "");
  }

  function normalizeSnsUrl(type, id) {
    var raw = String(id || "").trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;

    switch (type) {
      case "line-official":
        // LINE公式アカウントの友だち追加リンク（@id形式）
        return "https://line.me/R/ti/p/" + encodeURIComponent(raw.indexOf("@") === 0 ? raw : "@" + raw);
      case "line":
        return "https://line.me/ti/p/~" + encodeURIComponent(raw.replace(/^~/, ""));
      case "whatsapp":
        return "https://wa.me/" + raw.replace(/[^\d]/g, "");
      case "instagram":
        return "https://instagram.com/" + stripAt(raw);
      case "x":
        return "https://x.com/" + stripAt(raw);
      case "facebook":
        return "https://facebook.com/" + raw;
      case "youtube":
        return "https://youtube.com/" + (raw.indexOf("@") === 0 ? raw : "@" + raw);
      case "tiktok":
        return "https://tiktok.com/@" + stripAt(raw);
      case "linkedin":
        return "https://linkedin.com/in/" + raw;
      case "github":
        return "https://github.com/" + stripAt(raw);
      default:
        return raw;
    }
  }

  /**
   * card.sns[] を描画用に正規化する。未対応typeは除外。
   */
  function normalizeSns(snsList) {
    if (!Array.isArray(snsList)) return [];
    var out = [];
    snsList.forEach(function (s) {
      if (!s || !s.type || !SNS_LABELS[s.type]) return;
      var url = normalizeSnsUrl(s.type, s.id);
      if (!url) return;
      out.push({
        type: s.type,
        id: s.id,
        url: url,
        label: SNS_LABELS[s.type],
        badge: s.badge || "",
      });
    });
    return out;
  }

  // ---------- vCard ビルダー ----------

  function escapeVCard(v) {
    return String(v == null ? "" : v)
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r\n|\n/g, "\\n");
  }

  function splitNameJa(nameJa) {
    var parts = String(nameJa || "").split(/[\s　]+/).filter(Boolean);
    if (parts.length >= 2) return { surname: parts[0], given: parts.slice(1).join(" ") };
    return { surname: nameJa || "", given: "" };
  }

  // ひらがな→カタカナ（X-PHONETIC用。iOS連絡先の読み仮名は通常カタカナ）
  function toKatakana(str) {
    return String(str || "").replace(/[ぁ-ゖ]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) + 0x60);
    });
  }

  function foldBase64(b64) {
    // vCard PHOTO は 75桁で折り返し、継続行の先頭に半角スペースを1つ付ける
    var out = [];
    for (var i = 0; i < b64.length; i += 75) {
      out.push(b64.substring(i, i + 75));
    }
    return out.join("\r\n ");
  }

  function slugify(str) {
    return String(str || "card")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "_")
      .toLowerCase() || "card";
  }

  /**
   * card.js（+ 任意でphotoBase64）から vCard 3.0 文字列を生成する。
   * VERSION:3.0 / UTF-8 BOMなし / CRLF / escape 済み。
   */
  function buildVCard(card, photoBase64) {
    var lines = ["BEGIN:VCARD", "VERSION:3.0"];
    var name = (card && card.name) || {};
    var nameJa = name.ja || "";
    var split = splitNameJa(nameJa);

    lines.push("N:" + escapeVCard(split.surname) + ";" + escapeVCard(split.given) + ";;;");
    lines.push("FN:" + escapeVCard(nameJa));

    var kana = name.kana || {};
    if (isNonEmpty(kana.last)) lines.push("X-PHONETIC-LAST-NAME:" + escapeVCard(toKatakana(kana.last)));
    if (isNonEmpty(kana.first)) lines.push("X-PHONETIC-FIRST-NAME:" + escapeVCard(toKatakana(kana.first)));

    var positions = Array.isArray(card.positions) ? card.positions : [];
    var primary = positions[0];
    if (primary) {
      if (isNonEmpty(primary.company)) lines.push("ORG:" + escapeVCard(primary.company) + ";");
      if (isNonEmpty(primary.role)) lines.push("TITLE:" + escapeVCard(primary.role));
    }
    var vcardCfg = card.vcard || {};
    if (isNonEmpty(vcardCfg.org)) {
      // ORG明示指定があれば上書き（先に積んだ行を差し替え）
      lines = lines.filter(function (l) { return l.indexOf("ORG:") !== 0; });
      lines.push("ORG:" + escapeVCard(vcardCfg.org) + ";");
    }

    var c = card.contacts || {};
    if (isNonEmpty(c.phone)) lines.push("TEL;TYPE=CELL,VOICE:" + escapeVCard(c.phone));
    if (isNonEmpty(c.email)) lines.push("EMAIL;TYPE=WORK:" + escapeVCard(c.email));
    if (isNonEmpty(c.website)) lines.push("URL;TYPE=WORK:" + escapeVCard(c.website));

    var addr = c.address || {};
    if (isNonEmpty(addr.street) || isNonEmpty(addr.locality) || isNonEmpty(addr.region) || isNonEmpty(addr.postal)) {
      lines.push(
        "ADR;TYPE=WORK:;;" +
          escapeVCard(addr.street) + ";" +
          escapeVCard(addr.locality) + ";" +
          escapeVCard(addr.region) + ";" +
          escapeVCard(addr.postal) + ";" +
          "日本"
      );
    }

    // itemN.URL + X-ABLabel: businesses / links / LINE公式
    var itemN = 1;
    var normSns = normalizeSns(card.sns);
    normSns.forEach(function (s) {
      if (s.type === "line-official") {
        lines.push("item" + itemN + ".URL:" + escapeVCard(s.url));
        lines.push("item" + itemN + ".X-ABLabel:" + escapeVCard("LINE公式" + (s.id ? " (" + s.id + ")" : "")));
        itemN++;
      }
    });
    (Array.isArray(card.businesses) ? card.businesses : []).forEach(function (b) {
      if (b && isNonEmpty(b.url)) {
        lines.push("item" + itemN + ".URL:" + escapeVCard(b.url));
        lines.push("item" + itemN + ".X-ABLabel:" + escapeVCard(b.name || "Business"));
        itemN++;
      }
    });
    (Array.isArray(card.links) ? card.links : []).forEach(function (l) {
      if (l && isNonEmpty(l.url)) {
        lines.push("item" + itemN + ".URL:" + escapeVCard(l.url));
        lines.push("item" + itemN + ".X-ABLabel:" + escapeVCard(l.label || "Link"));
        itemN++;
      }
    });

    var noteParts = [];
    if (positions.length > 1) {
      noteParts.push(positions.map(function (p) {
        return [p.company, p.role].filter(isNonEmpty).join(" ");
      }).filter(Boolean).join(" / "));
    }
    if (isNonEmpty(card.tagline)) noteParts.push(card.tagline);
    if (isNonEmpty(vcardCfg.note)) noteParts.push(vcardCfg.note);
    if (noteParts.length) lines.push("NOTE:" + escapeVCard(noteParts.join(" / ")));

    if (isNonEmpty(photoBase64)) {
      lines.push("PHOTO;ENCODING=b;TYPE=JPEG:" + foldBase64(photoBase64));
    }

    lines.push("END:VCARD");
    return lines.join("\r\n");
  }

  function vcardFilename(card) {
    var vcardCfg = (card && card.vcard) || {};
    if (isNonEmpty(vcardCfg.filename)) return slugify(vcardCfg.filename) + ".vcf";
    var base = (card && card.name && (card.name.en || card.name.ja)) || card.slug || "card";
    return slugify(base) + ".vcf";
  }

  /**
   * vCardをBlobとして生成しダウンロードさせる。
   */
  function downloadVCard(card, photoBase64) {
    try {
      var vcard = buildVCard(card, photoBase64);
      var blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = vcardFilename(card);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    } catch (e) {
      // 保存に失敗しても白画面にはしない
      // eslint-disable-next-line no-alert
      alert("連絡先の保存に失敗しました。時間をおいて再度お試しください。");
      if (global.console) console.error("[BrightCard] downloadVCard failed", e);
    }
  }

  // ---------- アクセントカラー派生 ----------

  function hexToRgb(hex) {
    var h = String(hex || "").replace("#", "");
    if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
    var num = parseInt(h, 16);
    if (isNaN(num) || h.length !== 6) return { r: 192, g: 57, b: 43 }; // フォールバック（既定ember寄り赤）
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function rgba(rgb, a) {
    return "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + a + ")";
  }

  function darken(rgb, factor) {
    return {
      r: Math.max(0, Math.round(rgb.r * (1 - factor))),
      g: Math.max(0, Math.round(rgb.g * (1 - factor))),
      b: Math.max(0, Math.round(rgb.b * (1 - factor))),
    };
  }

  function rgbToHex(rgb) {
    function h(n) { return ("0" + n.toString(16)).slice(-2); }
    return "#" + h(rgb.r) + h(rgb.g) + h(rgb.b);
  }

  /**
   * accentカラー1色から派生パレットを生成する（テンプレのCSS変数に注入）。
   */
  function deriveAccentPalette(accentHex) {
    var rgb = hexToRgb(accentHex || "#c0392b");
    var dark = darken(rgb, 0.22);
    return {
      accent: rgbToHex(rgb),
      accentDark: rgbToHex(dark),
      accentLight: rgba(rgb, 0.08),
      accentGlow: rgba(rgb, 0.25),
      accentBorder: rgba(rgb, 0.2),
    };
  }

  // ---------- モノグラム ----------

  function monogramInitial(nameJa) {
    var s = String(nameJa || "").trim();
    return s ? s.charAt(0) : "?";
  }

  // ---------- スクロール制御・reveal ----------

  function initScrollReveal(root) {
    var els = (root || document).querySelectorAll(".reveal");
    if (!("IntersectionObserver" in global)) {
      els.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(function (el) { observer.observe(el); });
  }

  function initProgressBar(progressEl) {
    if (!progressEl) return;
    window.addEventListener("scroll", function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progressEl.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    }, { passive: true });
  }

  function initFloatingSns(el, thresholdRatio) {
    if (!el) return;
    el.classList.add("hidden");
    window.addEventListener("scroll", function () {
      var heroHeight = window.innerHeight * (thresholdRatio || 0.6);
      if (window.scrollY > heroHeight) el.classList.remove("hidden");
      else el.classList.add("hidden");
    }, { passive: true });
  }

  // ---------- 公開 ----------

  global.BrightCardCore = {
    validateCard: validateCard,
    normalizeSns: normalizeSns,
    normalizeSnsUrl: normalizeSnsUrl,
    buildVCard: buildVCard,
    downloadVCard: downloadVCard,
    vcardFilename: vcardFilename,
    deriveAccentPalette: deriveAccentPalette,
    monogramInitial: monogramInitial,
    initScrollReveal: initScrollReveal,
    initProgressBar: initProgressBar,
    initFloatingSns: initFloatingSns,
    isNonEmpty: isNonEmpty,
    escapeVCard: escapeVCard,
  };
})(window);
