/**
 * BrightCard runtime v1 — templates/kinari.js
 * 「Kinari（和紙）」テンプレ（差別化ライン再設計版・2026-07）。
 * 章構成: 01 Portrait（和紙額装×縦書き2カラムヒーロー）→ 02 Proof（大型カウンター）→
 * 03 Story（about/philosophy/businesses/links の編集組版）→ 04 Reveal（紙名刺→和紙短冊の銘板）→
 * 05 Save & Connect（vCard/共有/QR opt-in）。章番号は動的採番（空章はスキップして詰める）。
 * 旧「名刺スキャン→抽出表」開幕は廃止（BRIGHTCARD-差別化ライン再設計.md §2・§6準拠）。
 * kinari 固有（§3.1）: 01 ヒーローだけは他4テンプレと骨格が別 —
 * 縦長3/4・幅58%の washi 額装写真を左置き、右に縦書き氏名ブロック（tategaki 続投）を
 * 並べる2カラム（flex row-reverse・現行流儀）。写真右下に落款シール半重ね。
 * stagger 順は 縦書きブロック → 落款 → en → roleLine（§3.4）。
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

    var palette = core.deriveAccentPalette(design.accent || "#35506b");
    var root = document.documentElement;
    root.classList.add("bc-kinari");
    root.style.setProperty("--bc-kinari-accent", palette.accent);
    root.style.setProperty("--bc-kinari-accent-dark", palette.accentDark);
    root.style.setProperty("--bc-kinari-accent-light", palette.accentLight);
    root.style.setProperty("--bc-kinari-accent-glow", palette.accentGlow);
    root.style.setProperty("--bc-kinari-accent-border", palette.accentBorder);

    var wrap = el("div", { class: "bc-kinari-root" });
    wrap.appendChild(el("div", { class: "bc-kinari-noise", "aria-hidden": "true" }));

    var app = el("main", { class: "bc-kinari-app" });

    // ---------- 動的採番（空章はスキップして詰める。ghost も追従） ----------
    var chapterNo = 0;
    function chap() {
      chapterNo += 1;
      return (chapterNo < 10 ? "0" : "") + chapterNo;
    }
    function secHead(no, label, withRule) {
      var parts = [
        el("div", { class: "bc-kinari-ghost", "aria-hidden": "true", text: no }),
        el("div", { class: "bc-kinari-sec-head" }, [
          el("span", { class: "bc-kinari-chapno", text: no }),
          el("span", { class: "bc-kinari-sec-label", text: label }),
        ]),
      ];
      if (withRule) parts.push(el("hr", { class: "bc-kinari-rule" }));
      return parts;
    }

    // ---------- 01 Portrait（和紙額装×縦書き2カラムヒーロー・kinari専用構図 §3.1） ----------
    var heroNo = chap();

    var heroPhoto = el("div", { class: "bc-kinari-hero-photo" });
    var img = new Image();
    img.alt = name.ja ? name.ja + "の顔写真" : "";
    img.style.objectPosition = design.photoPosition || "center center";
    var monogramShown = false;
    img.onerror = function () {
      if (img.parentNode) img.parentNode.removeChild(img);
      if (!monogramShown) {
        monogramShown = true;
        heroPhoto.appendChild(el("div", { class: "bc-kinari-hero-monogram" }, [
          el("span", { text: core.monogramInitial(name.ja) }),
        ]));
      }
    };
    img.src = "photo.jpg";
    heroPhoto.appendChild(img);

    // washi 額装＋右下に落款シール（写真に半重ね・stagger 2番手）
    var heroMedia = el("div", { class: "bc-kinari-hero-media" }, [
      heroPhoto,
      el("span", {
        class: "bc-kinari-seal bc-kinari-hero-seal bc-kinari-hi-2",
        "aria-hidden": "true",
        text: core.monogramInitial(name.ja),
      }),
    ]);

    // 縦書きブロック（右から タグライン → よみ → 氏名 の順にflex row-reverseで積む。
    // 現行 tategaki 続投。stagger 1番手）
    var tategakiChildren = [];
    if (nonEmpty(card.tagline)) {
      tategakiChildren.push(el("p", { class: "bc-kinari-tagline", text: card.tagline }));
    }
    var kana = name.kana || {};
    var yomiText = [kana.last, kana.first].filter(nonEmpty).join("　");
    if (nonEmpty(yomiText)) {
      tategakiChildren.push(el("p", { class: "bc-kinari-yomi", "aria-hidden": "true", text: yomiText }));
    }
    var nameJaDisplay = (name.ja || "").replace(/[\s　]+/g, " ");
    tategakiChildren.push(el("h1", { class: "bc-kinari-name-ja", "aria-label": name.ja || "" }, [
      document.createTextNode(nameJaDisplay),
    ]));
    var tategaki = el("div", { class: "bc-kinari-tategaki bc-kinari-hi-1" }, tategakiChildren);

    // 2カラム（row-reverse: DOM先頭=縦書きブロックが右、写真が左）
    var heroMain = el("div", { class: "bc-kinari-hero-main" }, [tategaki, heroMedia]);

    var heroChildren = secHead(heroNo, "Portrait", false);
    if (nonEmpty(primary.role)) {
      heroChildren.push(el("div", { class: "bc-kinari-tag bc-kinari-hi-1", text: primary.role }));
    }
    heroChildren.push(heroMain);
    if (nonEmpty(name.en)) {
      heroChildren.push(el("div", { class: "bc-kinari-name-en bc-kinari-hi-3", text: name.en }));
    }
    var roleLine = buildRoleLine(positions);
    if (nonEmpty(roleLine)) {
      heroChildren.push(el("div", { class: "bc-kinari-role-line bc-kinari-hi-4", text: roleLine }));
    }

    var heroSection = el("section", { class: "bc-kinari-section bc-kinari-hero", id: "bc-kinari-hero" }, heroChildren);
    app.appendChild(heroSection);

    // ---------- 02 Proof（実績・大型カウンター。metrics 0件なら章スキップ） ----------
    var proofItems = [];
    if (metrics.length) {
      var proofNo = chap();
      var proofList = el("div", { class: "bc-kinari-proof-list" });
      metrics.forEach(function (m, i) {
        if (!m) return;
        var isStatic = nonEmpty(m.static);
        var valEl = el("span", { class: "bc-kinari-num-val", text: isStatic ? String(m.static) : "0" });
        var numClass = "bc-kinari-num";
        if (isStatic && String(m.static).length > 5) numClass += " bc-kinari-num-long";
        var numEl = el("span", { class: numClass }, [valEl]);
        if (!isStatic && nonEmpty(m.suffix)) {
          numEl.appendChild(el("span", { class: "bc-kinari-num-unit", text: m.suffix }));
        }
        var item = el("div", { class: "bc-kinari-p-item" + (i === 0 ? " bc-kinari-p-feature" : "") }, [
          numEl,
          el("span", { class: "bc-kinari-num-bar", "aria-hidden": "true" }),
          el("div", { class: "bc-kinari-lbl", text: m.label || "" }),
        ]);
        proofItems.push({ item: item, valEl: valEl, isStatic: isStatic, to: parseInt(m.value, 10) || 0 });
        proofList.appendChild(item);
      });
      app.appendChild(el(
        "section",
        { class: "bc-kinari-section", id: "bc-kinari-proof" },
        secHead(proofNo, "Proof", true).concat([
          el("p", { class: "bc-kinari-proof-lead", text: "数字で見る、これまでの歩み。" }),
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
        storyChildren.push(el("p", { class: "bc-kinari-bio reveal", text: card.about }));
      }
      if (nonEmpty(philosophy.text)) {
        storyChildren.push(el("div", { class: "bc-kinari-philosophy reveal" }, [
          nonEmpty(philosophy.label) ? el("div", { class: "bc-kinari-phi-label", text: philosophy.label }) : null,
          el("div", { class: "bc-kinari-phi-text", text: philosophy.text }),
        ]));
      }
      if (businesses.length) {
        var bizWrap = el("div", { class: "bc-kinari-biz-list" });
        businesses.forEach(function (b, i) {
          var idx = (i + 1 < 10 ? "0" : "") + (i + 1) + ".";
          var tags = (Array.isArray(b.tags) ? b.tags : []).filter(nonEmpty);
          var main = el("div", { class: "bc-kinari-biz-main" }, [
            el("div", { class: "bc-kinari-biz-name", text: b.name || "" }),
            nonEmpty(b.role) ? el("div", { class: "bc-kinari-biz-role", text: b.role }) : null,
            nonEmpty(b.desc) ? el("div", { class: "bc-kinari-biz-desc", text: b.desc }) : null,
            tags.length ? el("div", { class: "bc-kinari-biz-tags", text: tags.join("・") }) : null,
          ]);
          var rowChildren = [el("span", { class: "bc-kinari-biz-no", text: idx }), main];
          var tag = "div";
          var attrs = { class: "bc-kinari-biz-row reveal" };
          if (nonEmpty(b.url)) {
            tag = "a";
            attrs.href = absoluteUrl(b.url);
            attrs.target = "_blank";
            attrs.rel = "noopener";
            rowChildren.push(el("span", { class: "bc-kinari-biz-arrow", html: icons.contact.externalLink }));
          }
          bizWrap.appendChild(el(tag, attrs, rowChildren));
        });
        storyChildren.push(bizWrap);
      }
      if (links.length) {
        var linkWrap = el("div", { class: "bc-kinari-link-list" });
        links.forEach(function (l) {
          linkWrap.appendChild(el("a", { class: "bc-kinari-link-row reveal", href: absoluteUrl(l.url), target: "_blank", rel: "noopener" }, [
            el("div", { class: "bc-kinari-link-main" }, [
              el("div", { class: "bc-kinari-link-label", text: l.label || displayUrl(l.url) }),
              nonEmpty(l.desc) ? el("div", { class: "bc-kinari-link-desc", text: l.desc }) : null,
            ]),
            el("span", { class: "bc-kinari-biz-arrow", html: icons.contact.externalLink }),
          ]));
        });
        storyChildren.push(linkWrap);
      }
      app.appendChild(el("section", { class: "bc-kinari-section", id: "bc-kinari-story" }, storyChildren));
    }

    // ---------- 04 Reveal（紙名刺 → 和紙短冊の銘板。抽出表は存在しない） ----------
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
      el("span", { class: "bc-kinari-m-accent", "aria-hidden": "true" }),
    ];
    if (nonEmpty(primary.role)) meishiChildren.push(el("div", { class: "bc-kinari-m-role", text: primary.role }));
    meishiChildren.push(el("div", { class: "bc-kinari-m-name", text: name.ja || "" }));
    if (nonEmpty(name.en)) meishiChildren.push(el("div", { class: "bc-kinari-m-en", text: name.en.toUpperCase() }));
    if (meishiLines.length) {
      meishiChildren.push(el("div", { class: "bc-kinari-m-div" }));
      meishiLines.forEach(function (l) {
        meishiChildren.push(el("div", { class: "bc-kinari-m-line" }, [
          el("span", { class: "bc-kinari-mk", text: l.mk }),
          el("span", { text: l.value }),
        ]));
      });
    }
    var meishi = el("div", { class: "bc-kinari-meishi bc-kinari-meishi-paper" }, meishiChildren);

    // 和紙短冊の銘板（生成り紙地＋右下に落款。文字は可読優先で横組みserif・glowなし §3.3）
    var plateChildren = [
      el("span", {
        class: "bc-kinari-seal bc-kinari-plate-seal",
        "aria-hidden": "true",
        text: core.monogramInitial(name.ja),
      }),
      el("div", { class: "bc-kinari-plate-name", text: name.ja || "" }),
    ];
    if (nonEmpty(name.en)) plateChildren.push(el("div", { class: "bc-kinari-plate-en", text: name.en.toUpperCase() }));
    var plateRole = [primary.role, primary.company].filter(nonEmpty).join(" ／ ");
    if (nonEmpty(plateRole)) plateChildren.push(el("div", { class: "bc-kinari-plate-role", text: plateRole }));
    var plateRows = meishiLines.filter(function (l) { return l.mk !== "Co"; }).slice(0, 3);
    if (plateRows.length) {
      plateChildren.push(el("div", { class: "bc-kinari-plate-rows" }, plateRows.map(function (l) {
        return el("div", { class: "bc-kinari-plate-row" }, [
          el("span", { class: "bc-kinari-mk", text: l.mk }),
          el("span", { text: l.value }),
        ]);
      })));
    }
    plateChildren.push(el("div", { class: "bc-kinari-plate-badge", text: "BrightCard ── 章立てデジタル名刺" }));
    var plate = el("div", { class: "bc-kinari-plate" }, plateChildren);

    var stage = el("div", { class: "bc-kinari-stage", id: "bc-kinari-stage" }, [
      el("span", { class: "bc-kinari-reticle bc-kinari-reticle-tl", "aria-hidden": "true" }),
      el("span", { class: "bc-kinari-reticle bc-kinari-reticle-tr", "aria-hidden": "true" }),
      el("span", { class: "bc-kinari-reticle bc-kinari-reticle-bl", "aria-hidden": "true" }),
      el("span", { class: "bc-kinari-reticle bc-kinari-reticle-br", "aria-hidden": "true" }),
      el("span", { class: "bc-kinari-scan", "aria-hidden": "true" }),
      meishi,
      plate,
    ]);

    var revealSection = el(
      "section",
      { class: "bc-kinari-section bc-kinari-reveal", id: "bc-kinari-reveal" },
      secHead(revealNo, "Reveal", true).concat([
        el("p", { class: "bc-kinari-reveal-copy", text: nonEmpty(revealCfg.copy) ? revealCfg.copy : "1枚の紙の名刺から、このページは生まれました。" }),
        stage,
        el("div", { class: "bc-kinari-reveal-cap reveal", text: nonEmpty(revealCfg.caption) ? revealCfg.caption : "紙の名刺が、章立ての一冊に。" }),
      ])
    );
    app.appendChild(revealSection);

    // ---------- 05 Save & Connect ----------
    var saveNo = chap();
    var contactRows = [];
    if (nonEmpty(contacts.phone)) {
      contactRows.push(el("a", { class: "bc-kinari-crow", href: "tel:" + contacts.phone }, [
        el("span", { class: "bc-kinari-ck", text: "Phone" }),
        el("span", { class: "bc-kinari-cv", text: contacts.phone }),
      ]));
    }
    if (nonEmpty(contacts.email)) {
      contactRows.push(el("a", { class: "bc-kinari-crow", href: "mailto:" + contacts.email }, [
        el("span", { class: "bc-kinari-ck", text: "Mail" }),
        el("span", { class: "bc-kinari-cv", text: contacts.email }),
      ]));
    }
    if (nonEmpty(contacts.website)) {
      contactRows.push(el("a", { class: "bc-kinari-crow", href: absoluteUrl(contacts.website), target: "_blank", rel: "noopener" }, [
        el("span", { class: "bc-kinari-ck", text: "Web" }),
        el("span", { class: "bc-kinari-cv", text: displayUrl(contacts.website) }),
      ]));
    }
    var addrDisplay = nonEmpty(addr.display) ? addr.display : [addr.region, addr.locality, addr.street].filter(nonEmpty).join("");
    if (nonEmpty(addrDisplay)) {
      contactRows.push(el("div", { class: "bc-kinari-crow" }, [
        el("span", { class: "bc-kinari-ck", text: "Address" }),
        el("span", { class: "bc-kinari-cv", text: addrDisplay }),
      ]));
    }

    var saveBtnPrimary = el("button", {
      class: "bc-kinari-btn bc-kinari-btn-primary",
      type: "button",
      text: "連絡先を保存（vCard）",
      onclick: function () { core.downloadVCard(card, photoBase64); },
    });
    var shareBtn = el("button", {
      class: "bc-kinari-btn bc-kinari-btn-ghost",
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
    if (contactRows.length) saveChildren.push(el("div", { class: "bc-kinari-contact" }, contactRows));
    var qrPanel = core.renderQr(card);
    if (qrPanel) saveChildren.push(qrPanel);
    saveChildren.push(el("div", { class: "bc-kinari-btns" }, [saveBtnPrimary, shareBtn]));

    app.appendChild(el("section", { class: "bc-kinari-section", id: "bc-kinari-save" }, saveChildren));

    // ---------- Footer（C規約: © YYYY 氏名 ＋ Powered by BrightCard） ----------
    var year = new Date().getFullYear();
    app.appendChild(el("div", { class: "bc-kinari-foot" }, [
      document.createTextNode("© " + year + " " + (name.ja || "")),
      el("div", { class: "bc-kinari-powered-by", html: "Powered by <a href=\"https://withbt.com/card/\" target=\"_blank\" rel=\"noopener\">BrightCard</a>（合同会社WBT）" }),
    ]));

    wrap.appendChild(app);

    // ---------- 収納式FAB（SNS。kinari は現行どおり3chまで） ----------
    var normSns = core.normalizeSns(card.sns).slice(0, 3);
    var fabWrap = el("div", { class: "bc-kinari-fab-wrap", id: "bc-kinari-fab", "data-open": "false" });
    var fabMain = el("button", {
      class: "bc-kinari-fab-main",
      id: "bc-kinari-fab-main",
      type: "button",
      "aria-expanded": "false",
      "aria-controls": "bc-kinari-fab",
      "aria-label": "SNSを開く",
      html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    });
    fabWrap.appendChild(fabMain);
    normSns.forEach(function (s) {
      var style = CHAN_STYLE[s.type] || { bg: palette.accent, color: "#fff" };
      var iconSvg = style.svg || (icons.sns && icons.sns[s.type]) || icons.contact.link;
      fabWrap.appendChild(el("a", {
        class: "bc-kinari-chan",
        href: s.url,
        target: "_blank",
        rel: "noopener",
        "aria-label": s.label,
        style: "background:" + style.bg + ";color:" + style.color,
        html: iconSvg,
      }));
    });
    if (normSns.length) wrap.appendChild(fabWrap);

    var toastEl = el("div", { class: "bc-kinari-toast", id: "bc-kinari-toast", role: "status", "aria-live": "polite" });
    wrap.appendChild(toastEl);

    document.body.appendChild(wrap);

    // ---------- アニメーション ----------
    var toastTimer;
    function showToast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add("bc-kinari-show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toastEl.classList.remove("bc-kinari-show"); }, 2200);
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
          p.item.classList.add("bc-kinari-p-on");
          if (!p.isStatic) p.valEl.textContent = String(p.to);
          return;
        }
        setTimeout(function () {
          p.item.classList.add("bc-kinari-p-on");
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
        var proofSectionEl = document.getElementById("bc-kinari-proof");
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
        meishi.classList.add("bc-kinari-paper-out");
        plate.classList.add("bc-kinari-plate-on");
        return;
      }
      stage.classList.add("bc-kinari-scanning");
      setTimeout(function () { meishi.classList.add("bc-kinari-paper-out"); }, 500);
      setTimeout(function () { plate.classList.add("bc-kinari-plate-on"); }, 900);
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
  global.BrightCardTemplates.kinari = render;
})(window);
