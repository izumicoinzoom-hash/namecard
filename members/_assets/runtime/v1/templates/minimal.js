/**
 * BrightCard runtime v1 — templates/minimal.js
 * 「Minimal」テンプレ描画本体（白・余白／AI生成背景＋小さめ円フレーム・左上配置）。
 * §3共通制約: name.ja以外は省略可・空はセクション非表示／写真なし→モノグラム／
 * 長さ耐性（sns0〜8・positions0〜4等）／accent1色で着せ替え／
 * Products・From WBT枠は存在しない／フッターは「© YYYY 氏名」＋控えめクレジットのみ。
 *
 * background: { ref: "minimal/01" } または { src: "bg.jpg" } を card.js に指定すると
 * ヒーロー背景にAI生成画像を敷く。ref は "../_assets/backgrounds/<ref>.png"
 * （会員ページ = members/<slug>/index.html からの相対パス）で解決、src は同一フォルダ相対。
 * 未指定・読込失敗時は CSS の下地色（--bc-bg）で成立させ、白画面にはしない。
 */
(function (global) {
  "use strict";

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === "class") node.className = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else if (k === "text") node.textContent = attrs[k];
      else if (k.indexOf("on") === 0 && typeof attrs[k] === "function") node[k] = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      if (c) node.appendChild(c);
    });
    return node;
  }

  function nonEmpty(v) {
    return v !== undefined && v !== null && String(v).trim() !== "";
  }

  function resolveBackgroundSrc(bg) {
    if (!bg || typeof bg !== "object") return "";
    if (nonEmpty(bg.src)) return bg.src;
    if (nonEmpty(bg.ref)) return "../_assets/backgrounds/" + bg.ref + ".png";
    return "";
  }

  function render(card, photoBase64, core, icons) {
    var name = card.name || {};
    var design = card.design || {};
    var background = card.background || null;
    var palette = core.deriveAccentPalette(design.accent);

    var root = document.documentElement;
    root.style.setProperty("--bc-accent", palette.accent);
    root.style.setProperty("--bc-accent-dark", palette.accentDark);
    root.style.setProperty("--bc-accent-light", palette.accentLight);
    root.style.setProperty("--bc-accent-glow", palette.accentGlow);
    root.style.setProperty("--bc-accent-border", palette.accentBorder);
    root.classList.add("bc-minimal");

    var container = el("div", { class: "bc-root" });

    // ---- Progress bar ----
    var progress = el("div", { class: "bc-progress" });
    container.appendChild(progress);

    // ---- Floating SNS + save ----
    var normSns = core.normalizeSns(card.sns).slice(0, 4);
    var floating = el("div", { class: "bc-floating-sns bc-hidden" });
    normSns.forEach(function (s) {
      var iconSvg = (icons.sns && icons.sns[s.type]) || "";
      var a = el("a", {
        class: "bc-floating-item",
        href: s.url,
        target: "_blank",
        rel: "noopener",
        "aria-label": s.label,
        html: iconSvg + (s.badge ? '<span class="bc-sns-badge">' + escapeHtml(s.badge) + '</span>' : ""),
      });
      floating.appendChild(a);
    });
    var saveBtnFloat = el("button", {
      class: "bc-floating-item bc-save",
      type: "button",
      "aria-label": "連絡先を保存",
      html: icons.contact.save,
      onclick: function () { core.downloadVCard(card, photoBase64); },
    });
    floating.appendChild(saveBtnFloat);
    container.appendChild(floating);

    // ---- Hero: AI背景 + 小さめ円フレーム・左上配置 ----
    var bgWrap = el("div", { class: "bc-minimal-bg" });
    var bgSrc = resolveBackgroundSrc(background);
    if (bgSrc) {
      var bgImg = new Image();
      bgImg.alt = "";
      bgImg.onerror = function () {
        if (bgImg.parentNode) bgImg.parentNode.removeChild(bgImg);
      };
      bgImg.src = bgSrc;
      bgWrap.appendChild(bgImg);
    }

    var frame = el("div", { class: "bc-minimal-frame" });
    var img = new Image();
    img.alt = name.ja || "";
    img.style.objectPosition = design.photoPosition || "center top";
    var monogram = null;
    img.onerror = function () {
      if (img.parentNode) img.parentNode.removeChild(img);
      if (!monogram) {
        monogram = el("div", { class: "bc-monogram" }, [
          el("span", { text: core.monogramInitial(name.ja) }),
        ]);
      }
      frame.appendChild(monogram);
    };
    img.src = "photo.jpg";
    frame.appendChild(img);

    var bodyChildren = [];
    if (nonEmpty(name.en)) bodyChildren.push(el("div", { class: "bc-minimal-en reveal", text: name.en }));
    bodyChildren.push(el("h1", { class: "bc-minimal-ja reveal reveal-d1", text: name.ja || "" }));

    var kana = name.kana || {};
    if (nonEmpty(kana.last) || nonEmpty(kana.first)) {
      bodyChildren.push(el("div", {
        class: "bc-minimal-reading reveal reveal-d1",
        text: [kana.last, kana.first].filter(nonEmpty).join(" "),
      }));
    }

    bodyChildren.push(el("div", { class: "bc-minimal-rule reveal reveal-d1" }));

    var positions = Array.isArray(card.positions) ? card.positions : [];
    if (positions.length) {
      var titlesWrap = el("div", { class: "bc-minimal-titles reveal reveal-d2" });
      positions.forEach(function (p) {
        if (!p) return;
        var companySpan = el("span", { class: "bc-company" });
        if (nonEmpty(p.url)) {
          companySpan.appendChild(el("a", { href: p.url, target: "_blank", rel: "noopener", text: p.company || "" }));
        } else {
          companySpan.textContent = p.company || "";
        }
        var row = el("div", { class: "bc-minimal-title-item" }, [
          companySpan,
          nonEmpty(p.role) ? el("span", { class: "bc-role", text: p.role }) : null,
        ]);
        titlesWrap.appendChild(row);
      });
      bodyChildren.push(titlesWrap);
    }

    if (nonEmpty(card.tagline)) {
      bodyChildren.push(el("p", { class: "bc-minimal-tag reveal reveal-d3", text: card.tagline }));
    }

    var bodyAttrs = { class: "bc-minimal-body" };
    if (background && background.overlay === "none") bodyAttrs.class += " bc-no-overlay";
    var body = el("div", bodyAttrs, bodyChildren);

    var inner = el("div", { class: "bc-minimal-inner" }, [frame, body]);
    var hero = el("section", { class: "bc-hero" }, [bgWrap, inner]);
    container.appendChild(hero);

    // ---- About ----
    if (nonEmpty(card.about)) {
      container.appendChild(el("section", { class: "bc-section" }, [
        el("div", { class: "bc-section-label reveal", text: "About" }),
        el("div", { class: "bc-about-text reveal reveal-d1", text: card.about }),
      ]));
    }

    // ---- Philosophy ----
    var philosophy = card.philosophy || {};
    if (nonEmpty(philosophy.text)) {
      container.appendChild(el("section", { class: "bc-section" }, [
        el("div", { class: "bc-section-label reveal", text: "Philosophy" }),
        el("div", { class: "bc-philosophy reveal reveal-d1" }, [
          nonEmpty(philosophy.label) ? el("div", { class: "bc-philosophy-label", text: philosophy.label }) : null,
          el("div", { class: "bc-philosophy-text", text: philosophy.text }),
        ]),
      ]));
    }

    // ---- Businesses ----
    var businesses = Array.isArray(card.businesses) ? card.businesses.filter(Boolean) : [];
    if (businesses.length) {
      var bizGrid = el("div", { class: "bc-biz-grid reveal reveal-d1" });
      businesses.forEach(function (b) {
        var iconBox = el("div", { class: "bc-biz-icon" });
        if (nonEmpty(b.image)) {
          iconBox.appendChild(el("img", { src: b.image, alt: b.name || "" }));
        } else {
          iconBox.innerHTML = icons.contact.briefcase;
        }
        var headerChildren = [
          iconBox,
          el("div", {}, [
            el("div", { class: "bc-biz-name", text: b.name || "" }),
            nonEmpty(b.role) ? el("div", { class: "bc-biz-role", text: b.role }) : null,
          ]),
        ];
        if (nonEmpty(b.url)) {
          headerChildren.push(el("span", { class: "bc-biz-arrow", html: icons.contact.externalLink }));
        }
        var cardChildren = [el("div", { class: "bc-biz-header" }, headerChildren)];
        if (nonEmpty(b.desc)) cardChildren.push(el("div", { class: "bc-biz-desc", text: b.desc }));
        if (Array.isArray(b.tags) && b.tags.length) {
          var tagsWrap = el("div", { class: "bc-biz-tags" });
          b.tags.forEach(function (t) { if (nonEmpty(t)) tagsWrap.appendChild(el("span", { class: "bc-tag", text: t })); });
          cardChildren.push(tagsWrap);
        }
        var tag = nonEmpty(b.url) ? "a" : "div";
        var attrs = { class: "bc-biz-card" };
        if (nonEmpty(b.url)) { attrs.href = b.url; attrs.target = "_blank"; attrs.rel = "noopener"; }
        bizGrid.appendChild(el(tag, attrs, cardChildren));
      });
      container.appendChild(el("section", { class: "bc-section" }, [
        el("div", { class: "bc-section-label reveal", text: "Business" }),
        bizGrid,
      ]));
    }

    // ---- Links ----
    var links = Array.isArray(card.links) ? card.links.filter(function (l) { return l && nonEmpty(l.url); }) : [];
    if (links.length) {
      var linkGrid = el("div", { class: "bc-link-grid reveal reveal-d1" });
      links.forEach(function (l) {
        linkGrid.appendChild(el("a", { class: "bc-link-card", href: l.url, target: "_blank", rel: "noopener" }, [
          el("div", { class: "bc-link-icon", html: icons.contact.link }),
          el("div", { class: "bc-link-text" }, [
            el("div", { class: "bc-link-label", text: l.label || l.url }),
            nonEmpty(l.desc) ? el("div", { class: "bc-link-desc", text: l.desc }) : null,
          ]),
        ]));
      });
      container.appendChild(el("section", { class: "bc-section" }, [
        el("div", { class: "bc-section-label reveal", text: "Links" }),
        linkGrid,
      ]));
    }

    // ---- Contact ----
    var c = card.contacts || {};
    var addr = c.address || {};
    var addrDisplay = nonEmpty(addr.display) ? addr.display : [addr.region, addr.locality, addr.street].filter(nonEmpty).join("");
    var contactRows = [];
    if (nonEmpty(addrDisplay)) {
      contactRows.push(el("div", { class: "bc-contact-row" }, [
        el("div", { class: "bc-contact-icon", html: icons.contact.mapPin }),
        el("span", { text: addrDisplay }),
      ]));
    }
    if (nonEmpty(c.phone)) {
      contactRows.push(el("div", { class: "bc-contact-row" }, [
        el("div", { class: "bc-contact-icon", html: icons.contact.phone }),
        el("a", { href: "tel:" + c.phone, text: c.phone }),
      ]));
    }
    if (nonEmpty(c.email)) {
      contactRows.push(el("div", { class: "bc-contact-row" }, [
        el("div", { class: "bc-contact-icon", html: icons.contact.mail }),
        el("a", { href: "mailto:" + c.email, text: c.email }),
      ]));
    }
    if (nonEmpty(c.website)) {
      contactRows.push(el("div", { class: "bc-contact-row" }, [
        el("div", { class: "bc-contact-icon", html: icons.contact.globe }),
        el("a", { href: c.website, target: "_blank", rel: "noopener", text: c.website }),
      ]));
    }
    if (contactRows.length) {
      container.appendChild(el("section", { class: "bc-section" }, [
        el("div", { class: "bc-section-label reveal", text: "Contact" }),
        el("div", { class: "bc-contact-grid reveal reveal-d1" }, contactRows),
      ]));
    }

    // ---- Footer ----
    var year = new Date().getFullYear();
    container.appendChild(el("div", { class: "bc-footer" }, [
      document.createTextNode("© " + year + " " + (name.ja || "")),
      el("div", { class: "bc-powered-by", html: "Powered by <a href=\"https://withbt.com\" target=\"_blank\" rel=\"noopener\">BrightCard</a>（合同会社WBT）" }),
    ]));

    // ---- Fixed bottom CTA ----
    var ctaBtn = el("button", {
      class: "bc-fixed-bottom-btn",
      type: "button",
      html: icons.contact.save + " 連絡先に保存",
      onclick: function () { core.downloadVCard(card, photoBase64); },
    });
    container.appendChild(el("div", { class: "bc-fixed-bottom" }, [ctaBtn]));

    document.body.appendChild(container);

    core.initProgressBar(progress);
    core.initFloatingSns(floating, 0.55);
    core.initScrollReveal(container);
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  global.BrightCardTemplates = global.BrightCardTemplates || {};
  global.BrightCardTemplates.minimal = render;
})(window);
