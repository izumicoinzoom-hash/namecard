/**
 * BrightCard runtime v1 — templates/flux.js
 * 「Flux」テンプレ（深夜ネオン・発光ミント。撮影された物理名刺のスキャン演出 → 円形ポートレート → Story → Save & Connect）。
 * brightcard/preview/theme-flux.html + card-flux.js（トラックB意匠）を、
 * members runtime v1 の契約（card.js 単一データ源・core.js 共通API）へ移植したもの。
 * 構造は onyx.js（実証済み）と同一。差分はクラス接頭辞（bc-flux-*）とCSS（flux.css）のみ。
 * §runtime共通制約: name.ja以外は省略可・空はセクション（または行）非表示／写真なし→モノグラム／
 * accent1色で着せ替え／Products・From WBT枠は存在しない／フッターは「© YYYY 氏名」＋控えめクレジットのみ。
 *
 * データは card.js（C schema）から取る。Bのwindow.CARD（card-flux.jsの旧データ形式）は使わない。
 * 実績（Story章の proofs 相当）は card.metrics[]（任意）: {value, suffix, label} または {static, label}。
 * 未指定なら Story は about のみ表示し、実績グリッドは描画しない。
 * ★氏名がラテン文字（例: "An Nguyen"）でも破綻しない（h1がそのまま英字表示される）。
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

  function displayUrl(u) {
    return String(u || "").replace(/^https?:\/\//i, "").replace(/\/$/, "");
  }

  function absoluteUrl(u) {
    var s = String(u || "").trim();
    if (!s) return "";
    return /^https?:\/\//i.test(s) ? s : "https://" + s;
  }

  // SNSブランド別のFAB配色・アイコン（theme-flux.html の .chan 実装を踏襲）。
  // 未対応typeは icons.sns[type] + accent色にフォールバック。
  var CHAN_STYLE = {
    line: {
      bg: "#06C755",
      color: "#fff",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 5.64 2 10.13c0 4.02 3.55 7.39 8.35 8.03.32.07.77.21.88.49.1.25.06.64.03.9l-.14.85c-.04.25-.2.98.86.53s5.72-3.37 7.8-5.77C21.3 13.6 22 11.94 22 10.13 22 5.64 17.52 2 12 2z"/></svg>',
    },
    "line-official": {
      bg: "#06C755",
      color: "#fff",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 5.64 2 10.13c0 4.02 3.55 7.39 8.35 8.03.32.07.77.21.88.49.1.25.06.64.03.9l-.14.85c-.04.25-.2.98.86.53s5.72-3.37 7.8-5.77C21.3 13.6 22 11.94 22 10.13 22 5.64 17.52 2 12 2z"/></svg>',
    },
    whatsapp: {
      bg: "#25D366",
      color: "#fff",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.92C21.95 6.45 17.5 2 12.04 2zm5.78 14.1c-.24.68-1.42 1.31-1.95 1.35-.5.05-.99.23-3.35-.7-2.83-1.11-4.63-3.99-4.77-4.18-.14-.19-1.14-1.52-1.14-2.9 0-1.38.72-2.06.98-2.34.24-.26.53-.33.71-.33.18 0 .35.002.51.01.16.008.39-.06.6.46.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.72 1.18 1.54 1.91 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.69-.8.87-1.08.18-.28.36-.23.61-.14.25.09 1.6.75 1.87.89.28.14.46.21.53.32.07.11.07.64-.17 1.32z"/></svg>',
    },
    instagram: {
      bg: "radial-gradient(circle at 30% 107%,#fdf497 0%,#fdf497 5%,#fd5949 45%,#d6249f 60%,#285AEB 90%)",
      color: "#fff",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
    },
    x: { bg: "#000", color: "#fff" },
    facebook: { bg: "#1877F2", color: "#fff" },
    youtube: { bg: "#FF0000", color: "#fff" },
    tiktok: { bg: "#000", color: "#fff" },
    linkedin: { bg: "#0A66C2", color: "#fff" },
    github: { bg: "#181717", color: "#fff" },
  };

  function buildRoleLine(positions) {
    var list = (Array.isArray(positions) ? positions : []).filter(Boolean);
    if (!list.length) return "";
    return list
      .map(function (p) {
        return [p.company, p.role].filter(nonEmpty).join(" ／ ");
      })
      .filter(nonEmpty)
      .join(" ・ ");
  }

  function render(card, photoBase64, core, icons) {
    var name = card.name || {};
    var design = card.design || {};
    var positions = Array.isArray(card.positions) ? card.positions : [];
    var primary = positions[0] || {};
    var contacts = card.contacts || {};
    var addr = contacts.address || {};
    var metrics = Array.isArray(card.metrics) ? card.metrics.filter(Boolean) : [];
    var reduce = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var palette = core.deriveAccentPalette(design.accent || "#34e6b4");
    var root = document.documentElement;
    root.classList.add("bc-flux");
    root.style.setProperty("--bc-flux-accent", palette.accent);
    root.style.setProperty("--bc-flux-accent-dark", palette.accentDark);
    root.style.setProperty("--bc-flux-accent-light", palette.accentLight);
    root.style.setProperty("--bc-flux-accent-glow", palette.accentGlow);
    root.style.setProperty("--bc-flux-accent-border", palette.accentBorder);

    var wrap = el("div", { class: "bc-flux-root" });
    wrap.appendChild(el("div", { class: "bc-flux-noise", "aria-hidden": "true" }));

    var app = el("main", { class: "bc-flux-app" });

    // ---------- 00 Card Intake ----------
    var fieldConf = { Name: 99, Role: 98, Company: 99, Phone: 97, Mail: 99, Web: 96 };
    var fieldsData = [
      { k: "Name", v: name.ja },
      { k: "Role", v: primary.role },
      { k: "Company", v: primary.company },
      { k: "Phone", v: contacts.phone },
      { k: "Mail", v: contacts.email },
      { k: "Web", v: displayUrl(contacts.website) },
    ].filter(function (f) {
      return nonEmpty(f.v);
    });

    var meishiLines = [
      { mk: "Co", value: primary.company },
      { mk: "Tel", value: contacts.phone },
      { mk: "Mail", value: contacts.email },
      { mk: "Web", value: displayUrl(contacts.website) },
    ].filter(function (l) {
      return nonEmpty(l.value);
    });

    var meishiChildren = [
      el("span", { class: "bc-flux-m-accent", "aria-hidden": "true" }),
    ];
    if (nonEmpty(primary.role)) meishiChildren.push(el("div", { class: "bc-flux-m-role", text: primary.role }));
    meishiChildren.push(el("div", { class: "bc-flux-m-name", text: name.ja || "" }));
    if (nonEmpty(name.en)) meishiChildren.push(el("div", { class: "bc-flux-m-en", text: name.en.toUpperCase() }));
    if (meishiLines.length) {
      meishiChildren.push(el("div", { class: "bc-flux-m-div" }));
      meishiLines.forEach(function (l) {
        meishiChildren.push(el("div", { class: "bc-flux-m-line" }, [
          el("span", { class: "bc-flux-mk", text: l.mk }),
          el("span", { text: l.value }),
        ]));
      });
    }

    var meishi = el("div", { class: "bc-flux-meishi" }, meishiChildren);

    var capture = el("div", { class: "bc-flux-capture", id: "bc-flux-namecard" }, [
      el("span", { class: "bc-flux-reticle bc-flux-reticle-tl", "aria-hidden": "true" }),
      el("span", { class: "bc-flux-reticle bc-flux-reticle-tr", "aria-hidden": "true" }),
      el("span", { class: "bc-flux-reticle bc-flux-reticle-bl", "aria-hidden": "true" }),
      el("span", { class: "bc-flux-reticle bc-flux-reticle-br", "aria-hidden": "true" }),
      el("span", { class: "bc-flux-scan", "aria-hidden": "true" }),
      meishi,
    ]);

    var fieldEls = [];
    var extractRows = el("div", { class: "bc-flux-extract-rows" });
    fieldsData.forEach(function (f) {
      var fieldEl = el("div", { class: "bc-flux-field", "data-conf": String(fieldConf[f.k] || 0) }, [
        el("span", { class: "bc-flux-k", text: f.k }),
        el("span", { class: "bc-flux-v", text: f.v }),
        el("span", { class: "bc-flux-c", text: "0%" }),
      ]);
      fieldEls.push(fieldEl);
      extractRows.appendChild(fieldEl);
    });

    var extract = el("div", { class: "bc-flux-extract", "aria-live": "polite" }, [
      el("div", { class: "bc-flux-extract-h" }, [
        el("span", { class: "bc-flux-t", text: "Extracted Fields" }),
        el("span", { class: "bc-flux-dot", "aria-hidden": "true" }),
      ]),
      extractRows,
    ]);

    var intakeSection = el("section", { class: "bc-flux-section", id: "bc-flux-intake" }, [
      el("div", { class: "bc-flux-ghost", "aria-hidden": "true", text: "00" }),
      el("div", { class: "bc-flux-sec-head" }, [
        el("span", { class: "bc-flux-chapno", text: "00" }),
        el("span", { class: "bc-flux-sec-label", text: "Card Intake" }),
      ]),
      el("hr", { class: "bc-flux-rule" }),
      el("p", { class: "bc-flux-intake-copy", text: "写真付きの名刺を読み取り、名前・肩書き・連絡先を自動で抽出します。" }),
      capture,
      extract,
    ]);
    app.appendChild(intakeSection);

    // ---------- 01 Portrait ----------
    var avatarWrap = el("div", { class: "bc-flux-avatar-wrap" });
    var img = new Image();
    img.alt = name.ja ? name.ja + "の顔写真" : "";
    img.style.objectPosition = design.photoPosition || "center center";
    var monogramShown = false;
    img.onerror = function () {
      if (img.parentNode) img.parentNode.removeChild(img);
      if (!monogramShown) {
        monogramShown = true;
        avatarWrap.appendChild(el("div", { class: "bc-flux-monogram" }, [
          el("span", { text: core.monogramInitial(name.ja) }),
        ]));
      }
    };
    img.src = "photo.jpg";
    avatarWrap.appendChild(img);

    var heroChildren = [
      el("div", { class: "bc-flux-ghost", "aria-hidden": "true", text: "01" }),
      el("div", { class: "bc-flux-sec-head" }, [
        el("span", { class: "bc-flux-chapno", text: "01" }),
        el("span", { class: "bc-flux-sec-label", text: "Portrait" }),
      ]),
      avatarWrap,
    ];
    if (nonEmpty(primary.role)) heroChildren.push(el("div", { class: "bc-flux-tag", text: primary.role }));
    heroChildren.push(el("h1", { class: "bc-flux-name-ja", text: (name.ja || "").replace(/\s+/, " ") }));
    if (nonEmpty(name.en)) heroChildren.push(el("div", { class: "bc-flux-name-en", text: name.en }));

    var kana = name.kana || {};
    if (nonEmpty(kana.last) || nonEmpty(kana.first)) {
      heroChildren.push(el("div", { class: "bc-flux-yomi", text: [kana.last, kana.first].filter(nonEmpty).join(" ") }));
    }

    var roleLine = buildRoleLine(positions);
    if (nonEmpty(roleLine)) heroChildren.push(el("div", { class: "bc-flux-role-line", text: roleLine }));

    if (nonEmpty(card.tagline)) heroChildren.push(el("p", { class: "bc-flux-tagline", text: card.tagline }));

    var heroSection = el("section", { class: "bc-flux-section bc-flux-hero", id: "bc-flux-hero" }, heroChildren);
    app.appendChild(heroSection);

    // ---------- 02 Story ----------
    if (nonEmpty(card.about) || metrics.length) {
      var storyChildren = [
        el("div", { class: "bc-flux-ghost", "aria-hidden": "true", text: "02" }),
        el("div", { class: "bc-flux-sec-head" }, [
          el("span", { class: "bc-flux-chapno", text: "02" }),
          el("span", { class: "bc-flux-sec-label", text: "Story" }),
        ]),
        el("hr", { class: "bc-flux-rule" }),
      ];
      if (nonEmpty(card.about)) storyChildren.push(el("p", { class: "bc-flux-bio", text: card.about }));

      var proofEls = [];
      if (metrics.length) {
        var proofsGrid = el("div", { class: "bc-flux-proofs" });
        metrics.forEach(function (m) {
          if (!m) return;
          var numAttrs = { class: "bc-flux-num" };
          var numText;
          if (nonEmpty(m.static)) {
            numAttrs["data-static"] = m.static;
            numText = m.static;
          } else {
            numAttrs["data-to"] = String(m.value || 0);
            numAttrs["data-suffix"] = m.suffix || "";
            numText = "0";
          }
          var numEl = el("span", numAttrs, [document.createTextNode(numText)]);
          var proofEl = el("div", { class: "bc-flux-proof" }, [
            numEl,
            el("div", { class: "bc-flux-lbl", text: m.label || "" }),
          ]);
          proofEls.push(numEl);
          proofsGrid.appendChild(proofEl);
        });
        storyChildren.push(proofsGrid);
      }

      var storySection = el("section", { class: "bc-flux-section", id: "bc-flux-story" }, storyChildren);
      app.appendChild(storySection);
    }

    // ---------- 03 Save & Connect ----------
    var contactRows = [];
    if (nonEmpty(contacts.phone)) {
      contactRows.push(el("a", { class: "bc-flux-crow", href: "tel:" + contacts.phone }, [
        el("span", { class: "bc-flux-ck", text: "Phone" }),
        el("span", { class: "bc-flux-cv", text: contacts.phone }),
      ]));
    }
    if (nonEmpty(contacts.email)) {
      contactRows.push(el("a", { class: "bc-flux-crow", href: "mailto:" + contacts.email }, [
        el("span", { class: "bc-flux-ck", text: "Mail" }),
        el("span", { class: "bc-flux-cv", text: contacts.email }),
      ]));
    }
    if (nonEmpty(contacts.website)) {
      contactRows.push(el("a", { class: "bc-flux-crow", href: absoluteUrl(contacts.website), target: "_blank", rel: "noopener" }, [
        el("span", { class: "bc-flux-ck", text: "Web" }),
        el("span", { class: "bc-flux-cv", text: displayUrl(contacts.website) }),
      ]));
    }
    var addrDisplay = nonEmpty(addr.display) ? addr.display : [addr.region, addr.locality, addr.street].filter(nonEmpty).join("");
    if (nonEmpty(addrDisplay)) {
      contactRows.push(el("div", { class: "bc-flux-crow" }, [
        el("span", { class: "bc-flux-ck", text: "Address" }),
        el("span", { class: "bc-flux-cv", text: addrDisplay }),
      ]));
    }

    var saveBtnPrimary = el("button", {
      class: "bc-flux-btn bc-flux-btn-primary",
      type: "button",
      text: "連絡先を保存（vCard）",
      onclick: function () { core.downloadVCard(card, photoBase64); },
    });
    var shareBtn = el("button", {
      class: "bc-flux-btn bc-flux-btn-ghost",
      type: "button",
      text: "このカードを共有",
      onclick: function () {
        var shareData = {
          title: (name.ja || "") + "｜BrightCard",
          text: (name.ja || "") + " — " + [primary.role, primary.company].filter(nonEmpty).join(" / "),
          url: location.href,
        };
        if (navigator.share) {
          navigator.share(shareData).catch(function () {});
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(location.href).then(
            function () { showToast("リンクをコピーしました"); },
            function () { showToast("共有に対応していません"); }
          );
        } else {
          showToast("共有に対応していません");
        }
      },
    });

    var saveChildren = [
      el("div", { class: "bc-flux-ghost", "aria-hidden": "true", text: "03" }),
      el("div", { class: "bc-flux-sec-head" }, [
        el("span", { class: "bc-flux-chapno", text: "03" }),
        el("span", { class: "bc-flux-sec-label", text: "Save & Connect" }),
      ]),
      el("hr", { class: "bc-flux-rule" }),
    ];
    if (contactRows.length) saveChildren.push(el("div", { class: "bc-flux-contact" }, contactRows));
    saveChildren.push(el("div", { class: "bc-flux-btns" }, [saveBtnPrimary, shareBtn]));

    var saveSection = el("section", { class: "bc-flux-section", id: "bc-flux-save" }, saveChildren);
    app.appendChild(saveSection);

    // ---------- Footer（C規約: © YYYY 氏名 ＋ Powered by BrightCard） ----------
    var year = new Date().getFullYear();
    app.appendChild(el("div", { class: "bc-flux-foot" }, [
      document.createTextNode("© " + year + " " + (name.ja || "")),
      el("div", { class: "bc-flux-powered-by", html: "Powered by <a href=\"https://withbt.com\" target=\"_blank\" rel=\"noopener\">BrightCard</a>（合同会社WBT）" }),
    ]));

    wrap.appendChild(app);

    // ---------- 収納式FAB（SNS） ----------
    var normSns = core.normalizeSns(card.sns).slice(0, 4);
    var fabWrap = el("div", { class: "bc-flux-fab-wrap", id: "bc-flux-fab", "data-open": "false" });
    var fabMain = el("button", {
      class: "bc-flux-fab-main",
      id: "bc-flux-fab-main",
      type: "button",
      "aria-expanded": "false",
      "aria-controls": "bc-flux-fab",
      "aria-label": "SNSを開く",
      html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    });
    fabWrap.appendChild(fabMain);
    normSns.forEach(function (s) {
      var style = CHAN_STYLE[s.type] || { bg: palette.accent, color: "#fff" };
      var iconSvg = style.svg || (icons.sns && icons.sns[s.type]) || icons.contact.link;
      fabWrap.appendChild(el("a", {
        class: "bc-flux-chan",
        href: s.url,
        target: "_blank",
        rel: "noopener",
        "aria-label": s.label,
        style: "background:" + style.bg + ";color:" + style.color,
        html: iconSvg,
      }));
    });
    if (normSns.length) wrap.appendChild(fabWrap);

    var toastEl = el("div", { class: "bc-flux-toast", id: "bc-flux-toast", role: "status", "aria-live": "polite" });
    wrap.appendChild(toastEl);

    document.body.appendChild(wrap);

    // ---------- アニメーション ----------
    var toastTimer;
    function showToast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add("bc-flux-show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toastEl.classList.remove("bc-flux-show"); }, 2200);
    }

    function countUp(target, to, suffix, dur) {
      if (reduce) { target.textContent = to + (suffix || ""); return; }
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        target.textContent = Math.round(to * eased) + (p >= 1 ? (suffix || "") : "");
        if (p < 1) requestAnimationFrame(step);
        else target.textContent = to + (suffix || "");
      }
      requestAnimationFrame(step);
    }

    var intakeDone = false;
    function runIntake() {
      if (intakeDone) return;
      intakeDone = true;
      if (reduce) {
        fieldEls.forEach(function (f) {
          f.classList.add("bc-flux-on");
          var c = f.querySelector(".bc-flux-c");
          if (c) c.textContent = (f.getAttribute("data-conf") || "0") + "%";
        });
        return;
      }
      capture.classList.add("bc-flux-scanning");
      fieldEls.forEach(function (f, i) {
        setTimeout(function () {
          f.classList.add("bc-flux-on");
          var conf = parseInt(f.getAttribute("data-conf"), 10) || 0;
          var cEl = f.querySelector(".bc-flux-c");
          if (cEl) countUp(cEl, conf, "%", 700);
        }, 700 + i * 260);
      });
    }

    var proofsDone = false;
    function runProofs() {
      if (proofsDone) return;
      proofsDone = true;
      proofEls.forEach(function (n) {
        if (n.hasAttribute("data-static")) return;
        countUp(n, parseInt(n.getAttribute("data-to"), 10) || 0, n.getAttribute("data-suffix") || "", 1100);
      });
    }

    if (reduce) runIntake();
    else setTimeout(runIntake, 420);

    if (proofEls.length) {
      if ("IntersectionObserver" in global) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            runProofs();
            io.unobserve(entry.target);
          });
        }, { threshold: 0.35 });
        var storyEl = document.getElementById("bc-flux-story");
        if (storyEl) io.observe(storyEl);
        else runProofs();
      } else {
        runProofs();
      }
    }

    // FAB開閉
    if (normSns.length) {
      var setOpen = function (open) {
        fabWrap.setAttribute("data-open", open ? "true" : "false");
        fabMain.setAttribute("aria-expanded", open ? "true" : "false");
        fabMain.setAttribute("aria-label", open ? "SNSを閉じる" : "SNSを開く");
      };
      fabMain.addEventListener("click", function () {
        setOpen(fabWrap.getAttribute("data-open") !== "true");
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && fabWrap.getAttribute("data-open") === "true") setOpen(false);
      });
      document.addEventListener("click", function (e) {
        if (fabWrap.getAttribute("data-open") === "true" && !fabWrap.contains(e.target)) setOpen(false);
      });
    }
  }

  global.BrightCardTemplates = global.BrightCardTemplates || {};
  global.BrightCardTemplates.flux = render;
})(window);
