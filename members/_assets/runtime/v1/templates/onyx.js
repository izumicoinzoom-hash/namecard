/**
 * BrightCard runtime v1 — templates/onyx.js
 * 「Onyx」テンプレ（差別化ライン再設計版・2026-07）。黒曜石・重厚のスキン。
 * 章構成: 01 Portrait（全幅ブリードの大判ヒーロー・黒グラデで背景へ溶かす）→ 02 Proof（serif大型カウンター）→
 * 03 Story（about/philosophy/businesses/links の編集組版）→ 04 Reveal（紙名刺→漆黒鏡面の銘板）→
 * 05 Save & Connect（vCard/共有/QR opt-in）。章番号は動的採番（空章はスキップして詰める）。
 * 旧「名刺スキャン→抽出表」開幕は廃止（BRIGHTCARD-差別化ライン再設計.md §2・§6準拠）。
 * §runtime共通制約: name.ja以外は省略可・空はセクション（または行）非表示／写真なし→全面モノグラム／
 * accent1色で着せ替え／Products・From WBT枠は存在しない／フッターは「© YYYY 氏名」＋控えめクレジットのみ。
 * モーションは CSS + IntersectionObserver + requestAnimationFrame のみ（transform/opacity限定）。
 *
 * データは card.js（C schema）から取る。実績は card.metrics[]（任意）:
 * {value, suffix, label} または {static, label}。0件なら Proof 章ごとスキップ。
 * 04章の文言は card.reveal.{copy, caption}（任意）で差し替え可。無ければ既定文言。
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

  // SNSブランド別のFAB配色・アイコン（現行実装を無変更で続投）。
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
    var revealCfg = (card.reveal && typeof card.reveal === "object") ? card.reveal : {};
    var reduce = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var palette = core.deriveAccentPalette(design.accent || "#e8703a");
    var root = document.documentElement;
    root.classList.add("bc-onyx");
    root.style.setProperty("--bc-onyx-accent", palette.accent);
    root.style.setProperty("--bc-onyx-accent-dark", palette.accentDark);
    root.style.setProperty("--bc-onyx-accent-light", palette.accentLight);
    root.style.setProperty("--bc-onyx-accent-glow", palette.accentGlow);
    root.style.setProperty("--bc-onyx-accent-border", palette.accentBorder);

    var wrap = el("div", { class: "bc-onyx-root" });
    wrap.appendChild(el("div", { class: "bc-onyx-noise", "aria-hidden": "true" }));

    var app = el("main", { class: "bc-onyx-app" });

    // ---------- 動的採番（空章はスキップして詰める。ghost も追従） ----------
    var chapterNo = 0;
    function chap() {
      chapterNo += 1;
      return (chapterNo < 10 ? "0" : "") + chapterNo;
    }
    function secHead(no, label, withRule) {
      var parts = [
        el("div", { class: "bc-onyx-ghost", "aria-hidden": "true", text: no }),
        el("div", { class: "bc-onyx-sec-head" }, [
          el("span", { class: "bc-onyx-chapno", text: no }),
          el("span", { class: "bc-onyx-sec-label", text: label }),
        ]),
      ];
      if (withRule) parts.push(el("hr", { class: "bc-onyx-rule" }));
      return parts;
    }

    // ---------- 01 Portrait（全幅ブリード・黒曜石の額。写真下端は背景へ溶かす） ----------
    var heroNo = chap();

    var heroPhoto = el("div", { class: "bc-onyx-hero-photo" });
    var img = new Image();
    img.alt = name.ja ? name.ja + "の顔写真" : "";
    img.style.objectPosition = design.photoPosition || "center center";
    var monogramShown = false;
    img.onerror = function () {
      if (img.parentNode) img.parentNode.removeChild(img);
      if (!monogramShown) {
        monogramShown = true;
        heroPhoto.appendChild(el("div", { class: "bc-onyx-hero-monogram" }, [
          el("span", { text: core.monogramInitial(name.ja) }),
        ]));
      }
    };
    img.src = "photo.jpg";
    heroPhoto.appendChild(img);

    // 額装は極細1pxの内側accent罫（CSS擬似要素）。alloyのネジ・プレート縁は使わない。
    var heroMedia = el("div", { class: "bc-onyx-hero-media" }, [heroPhoto]);

    var heroIdChildren = [];
    if (nonEmpty(primary.role)) {
      heroIdChildren.push(el("div", { class: "bc-onyx-tag bc-onyx-hi-1", text: primary.role }));
    }
    heroIdChildren.push(el("h1", { class: "bc-onyx-name-ja bc-onyx-hi-2", text: (name.ja || "").replace(/\s+/, " ") }));

    var kana = name.kana || {};
    if (nonEmpty(kana.last) || nonEmpty(kana.first)) {
      heroIdChildren.push(el("div", { class: "bc-onyx-yomi bc-onyx-hi-3", text: [kana.last, kana.first].filter(nonEmpty).join(" ") }));
    }
    if (nonEmpty(name.en)) {
      heroIdChildren.push(el("div", { class: "bc-onyx-name-en bc-onyx-hi-3", text: name.en }));
    }
    var roleLine = buildRoleLine(positions);
    if (nonEmpty(roleLine)) {
      heroIdChildren.push(el("div", { class: "bc-onyx-role-line bc-onyx-hi-4", text: roleLine }));
    }
    if (nonEmpty(card.tagline)) {
      heroIdChildren.push(el("p", { class: "bc-onyx-tagline bc-onyx-hi-4", text: card.tagline }));
    }

    var heroSection = el(
      "section",
      { class: "bc-onyx-section bc-onyx-hero", id: "bc-onyx-hero" },
      secHead(heroNo, "Portrait", false).concat([
        heroMedia,
        el("div", { class: "bc-onyx-hero-id" }, heroIdChildren),
      ])
    );
    app.appendChild(heroSection);

    // ---------- 02 Proof（実績・serif大型カウンター。metrics 0件なら章スキップ） ----------
    var proofItems = [];
    if (metrics.length) {
      var proofNo = chap();
      var proofList = el("div", { class: "bc-onyx-proof-list" });
      metrics.forEach(function (m, i) {
        if (!m) return;
        var isStatic = nonEmpty(m.static);
        var valEl = el("span", { class: "bc-onyx-num-val", text: isStatic ? String(m.static) : "0" });
        var numClass = "bc-onyx-num";
        if (isStatic && String(m.static).length > 5) numClass += " bc-onyx-num-long";
        var numEl = el("span", { class: numClass }, [valEl]);
        if (!isStatic && nonEmpty(m.suffix)) {
          numEl.appendChild(el("span", { class: "bc-onyx-num-unit", text: m.suffix }));
        }
        var item = el("div", { class: "bc-onyx-p-item" + (i === 0 ? " bc-onyx-p-feature" : "") }, [
          numEl,
          el("span", { class: "bc-onyx-num-bar", "aria-hidden": "true" }),
          el("div", { class: "bc-onyx-lbl", text: m.label || "" }),
        ]);
        proofItems.push({ item: item, valEl: valEl, isStatic: isStatic, to: parseInt(m.value, 10) || 0 });
        proofList.appendChild(item);
      });
      app.appendChild(el(
        "section",
        { class: "bc-onyx-section", id: "bc-onyx-proof" },
        secHead(proofNo, "Proof", true).concat([
          el("p", { class: "bc-onyx-proof-lead", text: "数字で見る、これまでの歩み。" }),
          proofList,
        ])
      ));
    }

    // ---------- 03 Story（about / philosophy / businesses / links の編集組版） ----------
    var philosophy = card.philosophy || {};
    var businesses = Array.isArray(card.businesses) ? card.businesses.filter(Boolean) : [];
    var links = Array.isArray(card.links) ? card.links.filter(function (l) { return l && nonEmpty(l.url); }) : [];
    var hasStory = nonEmpty(card.about) || nonEmpty(philosophy.text) || businesses.length > 0 || links.length > 0;
    if (hasStory) {
      var storyNo = chap();
      var storyChildren = secHead(storyNo, "Story", true);

      if (nonEmpty(card.about)) {
        storyChildren.push(el("p", { class: "bc-onyx-bio reveal", text: card.about }));
      }
      if (nonEmpty(philosophy.text)) {
        storyChildren.push(el("div", { class: "bc-onyx-philosophy reveal" }, [
          nonEmpty(philosophy.label) ? el("div", { class: "bc-onyx-phi-label", text: philosophy.label }) : null,
          el("div", { class: "bc-onyx-phi-text", text: philosophy.text }),
        ]));
      }
      if (businesses.length) {
        var bizWrap = el("div", { class: "bc-onyx-biz-list" });
        businesses.forEach(function (b, i) {
          var idx = (i + 1 < 10 ? "0" : "") + (i + 1) + ".";
          var tags = (Array.isArray(b.tags) ? b.tags : []).filter(nonEmpty);
          var main = el("div", { class: "bc-onyx-biz-main" }, [
            el("div", { class: "bc-onyx-biz-name", text: b.name || "" }),
            nonEmpty(b.role) ? el("div", { class: "bc-onyx-biz-role", text: b.role }) : null,
            nonEmpty(b.desc) ? el("div", { class: "bc-onyx-biz-desc", text: b.desc }) : null,
            tags.length ? el("div", { class: "bc-onyx-biz-tags", text: tags.join("・") }) : null,
          ]);
          var rowChildren = [el("span", { class: "bc-onyx-biz-no", text: idx }), main];
          var tag = "div";
          var attrs = { class: "bc-onyx-biz-row reveal" };
          if (nonEmpty(b.url)) {
            tag = "a";
            attrs.href = absoluteUrl(b.url);
            attrs.target = "_blank";
            attrs.rel = "noopener";
            rowChildren.push(el("span", { class: "bc-onyx-biz-arrow", html: icons.contact.externalLink }));
          }
          bizWrap.appendChild(el(tag, attrs, rowChildren));
        });
        storyChildren.push(bizWrap);
      }
      if (links.length) {
        var linkWrap = el("div", { class: "bc-onyx-link-list" });
        links.forEach(function (l) {
          linkWrap.appendChild(el("a", { class: "bc-onyx-link-row reveal", href: absoluteUrl(l.url), target: "_blank", rel: "noopener" }, [
            el("div", { class: "bc-onyx-link-main" }, [
              el("div", { class: "bc-onyx-link-label", text: l.label || displayUrl(l.url) }),
              nonEmpty(l.desc) ? el("div", { class: "bc-onyx-link-desc", text: l.desc }) : null,
            ]),
            el("span", { class: "bc-onyx-biz-arrow", html: icons.contact.externalLink }),
          ]));
        });
        storyChildren.push(linkWrap);
      }
      app.appendChild(el("section", { class: "bc-onyx-section", id: "bc-onyx-story" }, storyChildren));
    }

    // ---------- 04 Reveal（紙名刺 → 漆黒鏡面の銘板。抽出表は存在しない） ----------
    var revealNo = chap();

    var meishiLines = [
      { mk: "Co", value: primary.company },
      { mk: "Tel", value: contacts.phone },
      { mk: "Mail", value: contacts.email },
      { mk: "Web", value: displayUrl(contacts.website) },
    ].filter(function (l) {
      return nonEmpty(l.value);
    });

    var meishiChildren = [
      el("span", { class: "bc-onyx-m-accent", "aria-hidden": "true" }),
    ];
    if (nonEmpty(primary.role)) meishiChildren.push(el("div", { class: "bc-onyx-m-role", text: primary.role }));
    meishiChildren.push(el("div", { class: "bc-onyx-m-name", text: name.ja || "" }));
    if (nonEmpty(name.en)) meishiChildren.push(el("div", { class: "bc-onyx-m-en", text: name.en.toUpperCase() }));
    if (meishiLines.length) {
      meishiChildren.push(el("div", { class: "bc-onyx-m-div" }));
      meishiLines.forEach(function (l) {
        meishiChildren.push(el("div", { class: "bc-onyx-m-line" }, [
          el("span", { class: "bc-onyx-mk", text: l.mk }),
          el("span", { text: l.value }),
        ]));
      });
    }
    var meishi = el("div", { class: "bc-onyx-meishi bc-onyx-meishi-paper" }, meishiChildren);

    // デジタル銘板（漆黒鏡面の黒曜石板。左端accentは紙名刺の m-accent と対）
    var plateChildren = [
      el("span", { class: "bc-onyx-plate-accent", "aria-hidden": "true" }),
      el("div", { class: "bc-onyx-plate-name", text: name.ja || "" }),
    ];
    if (nonEmpty(name.en)) plateChildren.push(el("div", { class: "bc-onyx-plate-en", text: name.en.toUpperCase() }));
    var plateRole = [primary.role, primary.company].filter(nonEmpty).join(" ／ ");
    if (nonEmpty(plateRole)) plateChildren.push(el("div", { class: "bc-onyx-plate-role", text: plateRole }));
    var plateRows = meishiLines.filter(function (l) { return l.mk !== "Co"; }).slice(0, 3);
    if (plateRows.length) {
      plateChildren.push(el("div", { class: "bc-onyx-plate-rows" }, plateRows.map(function (l) {
        return el("div", { class: "bc-onyx-plate-row" }, [
          el("span", { class: "bc-onyx-mk", text: l.mk }),
          el("span", { text: l.value }),
        ]);
      })));
    }
    plateChildren.push(el("div", { class: "bc-onyx-plate-badge", text: "BrightCard ── 章立てデジタル名刺" }));
    var plate = el("div", { class: "bc-onyx-plate" }, plateChildren);

    var stage = el("div", { class: "bc-onyx-stage", id: "bc-onyx-stage" }, [
      el("span", { class: "bc-onyx-reticle bc-onyx-reticle-tl", "aria-hidden": "true" }),
      el("span", { class: "bc-onyx-reticle bc-onyx-reticle-tr", "aria-hidden": "true" }),
      el("span", { class: "bc-onyx-reticle bc-onyx-reticle-bl", "aria-hidden": "true" }),
      el("span", { class: "bc-onyx-reticle bc-onyx-reticle-br", "aria-hidden": "true" }),
      el("span", { class: "bc-onyx-scan", "aria-hidden": "true" }),
      meishi,
      plate,
    ]);

    var revealSection = el(
      "section",
      { class: "bc-onyx-section bc-onyx-reveal", id: "bc-onyx-reveal" },
      secHead(revealNo, "Reveal", true).concat([
        el("p", { class: "bc-onyx-reveal-copy", text: nonEmpty(revealCfg.copy) ? revealCfg.copy : "1枚の紙の名刺から、このページは生まれました。" }),
        stage,
        el("div", { class: "bc-onyx-reveal-cap reveal", text: nonEmpty(revealCfg.caption) ? revealCfg.caption : "紙の名刺が、章立ての一冊に。" }),
      ])
    );
    app.appendChild(revealSection);

    // ---------- 05 Save & Connect ----------
    var saveNo = chap();
    var contactRows = [];
    if (nonEmpty(contacts.phone)) {
      contactRows.push(el("a", { class: "bc-onyx-crow", href: "tel:" + contacts.phone }, [
        el("span", { class: "bc-onyx-ck", text: "Phone" }),
        el("span", { class: "bc-onyx-cv", text: contacts.phone }),
      ]));
    }
    if (nonEmpty(contacts.email)) {
      contactRows.push(el("a", { class: "bc-onyx-crow", href: "mailto:" + contacts.email }, [
        el("span", { class: "bc-onyx-ck", text: "Mail" }),
        el("span", { class: "bc-onyx-cv", text: contacts.email }),
      ]));
    }
    if (nonEmpty(contacts.website)) {
      contactRows.push(el("a", { class: "bc-onyx-crow", href: absoluteUrl(contacts.website), target: "_blank", rel: "noopener" }, [
        el("span", { class: "bc-onyx-ck", text: "Web" }),
        el("span", { class: "bc-onyx-cv", text: displayUrl(contacts.website) }),
      ]));
    }
    var addrDisplay = nonEmpty(addr.display) ? addr.display : [addr.region, addr.locality, addr.street].filter(nonEmpty).join("");
    if (nonEmpty(addrDisplay)) {
      contactRows.push(el("div", { class: "bc-onyx-crow" }, [
        el("span", { class: "bc-onyx-ck", text: "Address" }),
        el("span", { class: "bc-onyx-cv", text: addrDisplay }),
      ]));
    }

    var saveBtnPrimary = el("button", {
      class: "bc-onyx-btn bc-onyx-btn-primary",
      type: "button",
      text: "連絡先を保存（vCard）",
      onclick: function () { core.downloadVCard(card, photoBase64); },
    });
    var shareBtn = el("button", {
      class: "bc-onyx-btn bc-onyx-btn-ghost",
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

    var saveChildren = secHead(saveNo, "Save & Connect", true);
    if (contactRows.length) saveChildren.push(el("div", { class: "bc-onyx-contact" }, contactRows));
    var qrPanel = core.renderQr(card);
    if (qrPanel) saveChildren.push(qrPanel);
    saveChildren.push(el("div", { class: "bc-onyx-btns" }, [saveBtnPrimary, shareBtn]));

    app.appendChild(el("section", { class: "bc-onyx-section", id: "bc-onyx-save" }, saveChildren));

    // ---------- Footer（C規約: © YYYY 氏名 ＋ Powered by BrightCard） ----------
    var year = new Date().getFullYear();
    app.appendChild(el("div", { class: "bc-onyx-foot" }, [
      document.createTextNode("© " + year + " " + (name.ja || "")),
      el("div", { class: "bc-onyx-powered-by", html: "Powered by <a href=\"https://withbt.com/card/\" target=\"_blank\" rel=\"noopener\">BrightCard</a>（合同会社WBT）" }),
    ]));

    wrap.appendChild(app);

    // ---------- 収納式FAB（SNS） ----------
    var normSns = core.normalizeSns(card.sns).slice(0, 4);
    var fabWrap = el("div", { class: "bc-onyx-fab-wrap", id: "bc-onyx-fab", "data-open": "false" });
    var fabMain = el("button", {
      class: "bc-onyx-fab-main",
      id: "bc-onyx-fab-main",
      type: "button",
      "aria-expanded": "false",
      "aria-controls": "bc-onyx-fab",
      "aria-label": "SNSを開く",
      html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    });
    fabWrap.appendChild(fabMain);
    normSns.forEach(function (s) {
      var style = CHAN_STYLE[s.type] || { bg: palette.accent, color: "#fff" };
      var iconSvg = style.svg || (icons.sns && icons.sns[s.type]) || icons.contact.link;
      fabWrap.appendChild(el("a", {
        class: "bc-onyx-chan",
        href: s.url,
        target: "_blank",
        rel: "noopener",
        "aria-label": s.label,
        style: "background:" + style.bg + ";color:" + style.color,
        html: iconSvg,
      }));
    });
    if (normSns.length) wrap.appendChild(fabWrap);

    var toastEl = el("div", { class: "bc-onyx-toast", id: "bc-onyx-toast", role: "status", "aria-live": "polite" });
    wrap.appendChild(toastEl);

    document.body.appendChild(wrap);

    // ---------- アニメーション ----------
    var toastTimer;
    function showToast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add("bc-onyx-show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toastEl.classList.remove("bc-onyx-show"); }, 2200);
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

    // 02 Proof: IO発火 → 90msステップの stagger reveal ＋ rAFカウントアップ
    var proofsDone = false;
    function runProofs() {
      if (proofsDone) return;
      proofsDone = true;
      proofItems.forEach(function (p, i) {
        if (reduce) {
          p.item.classList.add("bc-onyx-p-on");
          if (!p.isStatic) p.valEl.textContent = String(p.to);
          return;
        }
        setTimeout(function () {
          p.item.classList.add("bc-onyx-p-on");
          if (!p.isStatic) countUp(p.valEl, p.to, "", 1100);
        }, i * 90);
      });
    }
    if (proofItems.length) {
      if ("IntersectionObserver" in global && !reduce) {
        var pio = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            runProofs();
            pio.unobserve(entry.target);
          });
        }, { threshold: 0.35 });
        var proofSectionEl = document.getElementById("bc-onyx-proof");
        if (proofSectionEl) pio.observe(proofSectionEl);
        else runProofs();
      } else {
        runProofs();
      }
    }

    // 04 Reveal: IO発火（1回のみ）→ スキャン → 紙が退く(500ms) → 銘板が立つ(900ms)
    var revealDone = false;
    function runReveal() {
      if (revealDone) return;
      revealDone = true;
      if (reduce) {
        // reduce時は静的最終状態（CSS側でも指定済み）。クラス付与のみ。
        meishi.classList.add("bc-onyx-paper-out");
        plate.classList.add("bc-onyx-plate-on");
        return;
      }
      stage.classList.add("bc-onyx-scanning");
      setTimeout(function () { meishi.classList.add("bc-onyx-paper-out"); }, 500);
      setTimeout(function () { plate.classList.add("bc-onyx-plate-on"); }, 900);
    }
    if ("IntersectionObserver" in global && !reduce) {
      var rio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runReveal();
          rio.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      rio.observe(stage);
    } else {
      runReveal();
    }

    // 03 Story ほか .reveal 要素のスクロール表示（core共通IO）
    core.initScrollReveal(wrap);

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
  global.BrightCardTemplates.onyx = render;
})(window);
