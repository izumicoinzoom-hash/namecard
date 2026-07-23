/**
 * BrightCard runtime v1 — templates/owner-editorial.js
 * 「Owner Editorial」テンプレ（清田兼明本人＝最上位オーナー版）。
 * _proto.html（トラックA・二重露光フルブリード写真＋sticky-stack章遷移＋
 * CSS Scroll-Driven刻印モーション）を、members runtime v1 の契約
 * （card.js 単一データ源・core.js 共通API）へ移植したもの。
 * §runtime共通制約: name.ja以外は省略可・空はセクション非表示／写真なし→モノグラム／
 * accent1色で着せ替え／フッターは「© YYYY 氏名」＋控えめクレジットのみ。
 *
 * データは card.js（C schema）から取る。
 * Works章は card.products[]（新規スキーマ・任意）: {category,name,url,desc,price,image}。
 * image（任意）はpage相対のシネマ画像。指定時のみ写真ブロックを商品名の前に差す
 * （§KIYOTA-MAISTER 3-2）。404はonerrorでmediaノード除去しテキストのみへフォールバック。
 * 未指定なら章ごと非表示。価格は文字列そのまま表示（例「料金：要見積」）。
 * Philosophy章は card.philosophy{label,text}（任意）。
 * Proof章（実績）は card.metrics[]（任意・B系と同スキーマ）:
 * {value:N,suffix,label}=rAFカウントアップ／{static,label}=静的表示。
 * 0件なら章ごとスキップ（採番も詰める）。見た目は誌面の "by the numbers"
 * スプレッド（明朝の大数字＋accent罫＋mono小ラベル。枠箱は使わない）。
 * QRは card.qr.svg（インラインSVG文字列）があれば core.renderQr() 経由で挿入、
 * 無ければ非表示（core未提供時は旧ロジックへフォールバック）。
 * Works章の導入コピーは任意フィールド card.worksIntro（未指定なら省略）。
 *
 * モーション: CSS Scroll-Driven（animation-timeline:scroll()）＋
 * IntersectionObserver（章内reveal）＋rAF1本のスクロールスパイ
 * （idx=round(scrollY/vh)）。GSAP/WebGLは使わない。
 * reduced-motionはCSSメディアクエリ＋JS matchMediaの二重防御（_proto踏襲）。
 * NFC到着演出（_protoの?src=nfcセレモニー）はowner-editorialでは移植しない
 * （本テンプレの対象＝清田さん個人ページはNFC配布運用が未確定のため対象外）。
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

  // Proof章のカウントアップ（rAF・cubic ease-out）。suffixは別要素なので数字のみ書く。
  function countUp(target, to, dur) {
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      target.textContent = String(Math.round(to * eased));
      if (p < 1) requestAnimationFrame(step);
      else target.textContent = String(to);
    }
    requestAnimationFrame(step);
  }

  // SNSブランド別のドック配色（onyx.js の CHAN_STYLE を踏襲）。未対応typeはaccent色にフォールバック。
  var CHAN_STYLE = {
    line: { bg: "#06C755", color: "#052a14" },
    "line-official": { bg: "#06C755", color: "#052a14" },
    whatsapp: { bg: "#25D366", color: "#052a14" },
    instagram: {
      bg: "radial-gradient(circle at 30% 107%,#fdf497 0%,#fdf497 5%,#fd5949 45%,#d6249f 60%,#285AEB 90%)",
      color: "#fff",
    },
    x: { bg: "#000", color: "#fff" },
    facebook: { bg: "#1877F2", color: "#fff" },
    youtube: { bg: "#FF0000", color: "#fff" },
    tiktok: { bg: "#000", color: "#fff" },
    linkedin: { bg: "#0A66C2", color: "#fff" },
    github: { bg: "#181717", color: "#fff" },
  };
  var DEFAULT_ABBR = {
    line: "個人",
    "line-official": "公式",
    whatsapp: "WA",
    instagram: "IG",
    x: "X",
    facebook: "FB",
    youtube: "YT",
    tiktok: "TT",
    linkedin: "IN",
    github: "GH",
  };

  function render(card, photoBase64, core, icons) {
    var name = card.name || {};
    var design = card.design || {};
    var positions = Array.isArray(card.positions) ? card.positions.filter(Boolean) : [];
    var contacts = card.contacts || {};
    var addr = contacts.address || {};
    var philosophy = card.philosophy || {};
    var products = Array.isArray(card.products) ? card.products.filter(Boolean) : [];
    var qr = card.qr || null;
    var reduce = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var palette = core.deriveAccentPalette(design.accent || "#E8703A");
    var htmlEl = document.documentElement;
    htmlEl.classList.add("bc-owner-editorial");
    htmlEl.style.setProperty("--bc-oe-accent", palette.accent);
    htmlEl.style.setProperty("--bc-oe-accent-dark", palette.accentDark);
    htmlEl.style.setProperty("--bc-oe-accent-light", palette.accentLight);
    htmlEl.style.setProperty("--bc-oe-accent-glow", palette.accentGlow);
    htmlEl.style.setProperty("--bc-oe-accent-border", palette.accentBorder);
    // 下部白抜け防止の保険（overscroll bounce対策。CSS側の.bc-owner-editorial黒地と二重で担保）
    document.body.style.background = "#0A0A0A";

    var wrap = el("div", { class: "bc-owner-editorial" });
    wrap.appendChild(el("div", { class: "bc-oe-grain", "aria-hidden": "true" }));

    var stack = el("main", { class: "bc-oe-stack" });
    var chapterEls = [];
    var chapIndex = 0;
    function nextChap() {
      var n = chapIndex++;
      return (n < 10 ? "0" : "") + n;
    }

    // ---------- 00 Hero ----------
    var heroMedia = el("div", { class: "bc-oe-hero-media" });
    var heroImg = new Image();
    heroImg.className = "bc-oe-hero-photo";
    heroImg.alt = name.ja ? name.ja + "の写真" : "";
    heroImg.style.objectPosition = design.photoPosition || "50% 18%";
    var monogramShown = false;
    heroImg.onerror = function () {
      if (heroImg.parentNode) heroImg.parentNode.removeChild(heroImg);
      if (!monogramShown) {
        monogramShown = true;
        heroMedia.insertBefore(
          el("div", { class: "bc-oe-hero-monogram" }, [el("span", { text: core.monogramInitial(name.ja) })]),
          heroMedia.firstChild
        );
      }
    };
    heroImg.src = "photo.jpg";
    heroMedia.appendChild(heroImg);
    heroMedia.appendChild(el("div", { class: "bc-oe-hero-scrim", "aria-hidden": "true" }));

    var heroInnerChildren = [];
    if (nonEmpty(name.en)) {
      heroInnerChildren.push(el("p", { class: "bc-oe-name-en bc-oe-kick-en", text: name.en }));
    }
    heroInnerChildren.push(el("h1", { class: "bc-oe-name-ja", text: (name.ja || "").replace(/\s+/, " ") }));
    var kana = name.kana || {};
    if (nonEmpty(kana.last) || nonEmpty(kana.first)) {
      heroInnerChildren.push(
        el("p", { class: "bc-oe-reading bc-oe-fade-up bc-oe-fu1", text: [kana.last, kana.first].filter(nonEmpty).join(" ") })
      );
    }
    if (positions.length) {
      var titlesWrap = el("div", { class: "bc-oe-titles bc-oe-fade-up bc-oe-fu2" });
      positions.forEach(function (p) {
        if (!nonEmpty(p.company) && !nonEmpty(p.role)) return;
        var rowChildren = [];
        if (nonEmpty(p.company)) rowChildren.push(el("b", { text: p.company }));
        if (nonEmpty(p.role)) rowChildren.push(document.createTextNode((rowChildren.length ? " " : "") + p.role));
        titlesWrap.appendChild(el("div", { class: "bc-oe-t" }, rowChildren));
      });
      heroInnerChildren.push(titlesWrap);
    }
    if (nonEmpty(card.tagline)) {
      heroInnerChildren.push(el("p", { class: "bc-oe-tag bc-oe-fade-up bc-oe-fu3", text: card.tagline }));
    }

    var heroChap = nextChap();
    var heroSection = el(
      "section",
      { class: "bc-oe-chapter bc-oe-hero", "data-chap": heroChap, "data-label": "—" },
      [
        heroMedia,
        el("span", { class: "bc-oe-ghost", "aria-hidden": "true", text: heroChap }),
        el("div", { class: "bc-oe-chap-inner" }, heroInnerChildren),
        el("div", { class: "bc-oe-scrollhint", "aria-hidden": "true" }, [
          document.createTextNode("Scroll"),
          el("span", { text: "↓" }),
        ]),
      ]
    );
    stack.appendChild(heroSection);
    chapterEls.push(heroSection);

    // ---------- Philosophy ----------
    if (nonEmpty(philosophy.text)) {
      var philChap = nextChap();
      var pullChildren = [];
      if (nonEmpty(philosophy.label)) {
        pullChildren.push(el("div", { class: "bc-oe-philo-label bc-oe-rv bc-oe-d1", text: philosophy.label }));
      }
      pullChildren.push(el("p", { class: "bc-oe-pull bc-oe-rv bc-oe-d2", text: philosophy.text }));
      var philSection = el(
        "section",
        { class: "bc-oe-chapter", "data-chap": philChap, "data-label": "Philosophy" },
        [
          el("span", { class: "bc-oe-ghost", "aria-hidden": "true", text: philChap }),
          el("div", { class: "bc-oe-chap-inner" }, [
            el("div", { class: "bc-oe-kick bc-oe-rv", text: philChap + " — Philosophy" }),
          ].concat(pullChildren)),
        ]
      );
      stack.appendChild(philSection);
      chapterEls.push(philSection);
    }

    // ---------- Proof（実績・任意。card.metrics[] 0件なら章スキップ＝採番も詰める） ----------
    var metrics = Array.isArray(card.metrics) ? card.metrics.filter(Boolean) : [];
    var metricItems = [];
    var proofSection = null;
    if (metrics.length) {
      var proofChap = nextChap();
      var metricsWrap = el("div", { class: "bc-oe-metrics" });
      metrics.forEach(function (m, i) {
        var isStatic = nonEmpty(m.static);
        var valEl = el("span", { class: "bc-oe-num-val", text: isStatic ? String(m.static) : "0" });
        var numClass = "bc-oe-num";
        if (isStatic && String(m.static).length > 5) numClass += " bc-oe-num-long";
        var numChildren = [valEl];
        if (!isStatic && nonEmpty(m.suffix)) {
          numChildren.push(el("span", { class: "bc-oe-num-unit", text: m.suffix }));
        }
        var itemChildren = [el("span", { class: numClass }, numChildren)];
        // 先頭1件はフィーチャー（誌面の大見出し数字＋accent罫）。以降は罫線区切りの行組。
        var itemClass = "bc-oe-metric bc-oe-rv bc-oe-d" + Math.min(i + 1, 3);
        if (i === 0) {
          itemClass += " bc-oe-metric-feature";
          itemChildren.push(el("span", { class: "bc-oe-num-bar bc-oe-rv", "aria-hidden": "true" }));
        }
        itemChildren.push(el("div", { class: "bc-oe-metric-label", text: m.label || "" }));
        var item = el("div", { class: itemClass }, itemChildren);
        metricItems.push({ valEl: valEl, isStatic: isStatic, to: parseInt(m.value, 10) || 0 });
        metricsWrap.appendChild(item);
      });
      proofSection = el(
        "section",
        { class: "bc-oe-chapter", "data-chap": proofChap, "data-label": "Proof" },
        [
          el("span", { class: "bc-oe-ghost", "aria-hidden": "true", text: proofChap }),
          el("div", { class: "bc-oe-chap-inner" }, [
            el("div", { class: "bc-oe-kick bc-oe-rv", text: proofChap + " — Proof" }),
            el("p", { class: "bc-oe-proof-lead bc-oe-rv bc-oe-d1", text: "数字が語る、これまで。" }),
            metricsWrap,
          ]),
        ]
      );
      stack.appendChild(proofSection);
      chapterEls.push(proofSection);
    }

    // ---------- Ventures ----------
    if (positions.length) {
      var venChap = nextChap();
      var credits = el("div", { class: "bc-oe-credits" });
      positions.forEach(function (p, i) {
        if (!nonEmpty(p.company) && !nonEmpty(p.role)) return;
        var coChildren = [document.createTextNode(p.company || "")];
        if (nonEmpty(p.url)) coChildren.push(el("span", { class: "bc-oe-arr", text: "↗" }));
        var creditChildren = [];
        if (nonEmpty(p.role)) creditChildren.push(el("div", { class: "bc-oe-role", text: p.role }));
        creditChildren.push(el("div", { class: "bc-oe-co" }, coChildren));
        if (nonEmpty(p.desc)) creditChildren.push(el("div", { class: "bc-oe-desc", text: p.desc }));
        var tag = nonEmpty(p.url) ? "a" : "div";
        var attrs = { class: "bc-oe-credit bc-oe-rv bc-oe-d" + Math.min(i + 1, 3) };
        if (nonEmpty(p.url)) {
          attrs.href = p.url;
          attrs.target = "_blank";
          attrs.rel = "noopener";
        }
        credits.appendChild(el(tag, attrs, creditChildren));
      });
      var venSection = el(
        "section",
        { class: "bc-oe-chapter", "data-chap": venChap, "data-label": "Ventures" },
        [
          el("span", { class: "bc-oe-ghost", "aria-hidden": "true", text: venChap }),
          el("div", { class: "bc-oe-chap-inner" }, [
            el("div", { class: "bc-oe-kick bc-oe-rv", text: venChap + " — Ventures" }),
            credits,
          ]),
        ]
      );
      stack.appendChild(venSection);
      chapterEls.push(venSection);
    }

    // ---------- Works / Products（任意） ----------
    if (products.length) {
      var workChap = nextChap();
      var workChapChildren = [
        el("div", { class: "bc-oe-kick bc-oe-rv", text: workChap + " — Works" }),
      ];
      if (nonEmpty(card.worksIntro)) {
        workChapChildren.push(el("p", { class: "bc-oe-lead bc-oe-rv bc-oe-d1", text: card.worksIntro }));
      }
      var productsWrap = el("div", { class: "bc-oe-products" });
      products.forEach(function (p, i) {
        if (!nonEmpty(p.name)) return;
        var nameChildren = [document.createTextNode(p.name)];
        if (nonEmpty(p.url)) nameChildren.push(el("span", { class: "bc-oe-arr", text: "↗" }));
        var prodChildren = [];
        if (nonEmpty(p.image)) {
          var pImg = el("img", { src: p.image, alt: p.name + " のイメージ", loading: "lazy", decoding: "async" });
          var pMedia = el("div", { class: "bc-oe-p-media" }, [pImg]);
          pImg.onerror = function () { if (pMedia.parentNode) pMedia.parentNode.removeChild(pMedia); };
          prodChildren.push(pMedia);
        }
        if (nonEmpty(p.category)) prodChildren.push(el("div", { class: "bc-oe-p-cat", text: p.category }));
        prodChildren.push(el("div", { class: "bc-oe-p-name" }, nameChildren));
        if (nonEmpty(p.desc)) prodChildren.push(el("div", { class: "bc-oe-p-desc", text: p.desc }));
        var footChildren = [];
        if (nonEmpty(p.price)) footChildren.push(el("span", { class: "bc-oe-p-price", text: p.price }));
        if (nonEmpty(p.url)) footChildren.push(el("span", { class: "bc-oe-p-cta", text: "詳しく見る →" }));
        if (footChildren.length) prodChildren.push(el("div", { class: "bc-oe-p-foot" }, footChildren));
        var tag = nonEmpty(p.url) ? "a" : "div";
        var attrs = { class: "bc-oe-product bc-oe-rv bc-oe-d" + Math.min(i + 1, 3) };
        if (nonEmpty(p.url)) {
          attrs.href = p.url;
          attrs.target = "_blank";
          attrs.rel = "noopener";
        }
        productsWrap.appendChild(el(tag, attrs, prodChildren));
      });
      workChapChildren.push(productsWrap);
      var workSection = el(
        "section",
        { class: "bc-oe-chapter", "data-chap": workChap, "data-label": "Works" },
        [el("span", { class: "bc-oe-ghost", "aria-hidden": "true", text: workChap }), el("div", { class: "bc-oe-chap-inner" }, workChapChildren)]
      );
      stack.appendChild(workSection);
      chapterEls.push(workSection);
    }

    // ---------- Contact ----------
    var contactChap = nextChap();
    var rows = [];
    var addrDisplay = nonEmpty(addr.display) ? addr.display : [addr.region, addr.locality, addr.street].filter(nonEmpty).join("");
    if (nonEmpty(addrDisplay)) {
      rows.push(el("div", { class: "bc-oe-row" }, [
        el("span", { html: icons.contact.mapPin }),
        el("span", { text: addrDisplay }),
      ]));
    }
    if (nonEmpty(contacts.phone)) {
      rows.push(el("div", { class: "bc-oe-row" }, [
        el("span", { html: icons.contact.phone }),
        el("a", { href: "tel:" + contacts.phone.replace(/[^\d+]/g, ""), text: contacts.phone }),
      ]));
    }
    if (nonEmpty(contacts.email)) {
      rows.push(el("div", { class: "bc-oe-row" }, [
        el("span", { html: icons.contact.mail }),
        el("a", { href: "mailto:" + contacts.email, text: contacts.email }),
      ]));
    }
    if (nonEmpty(contacts.website)) {
      rows.push(el("div", { class: "bc-oe-row" }, [
        el("span", { html: icons.contact.globe }),
        el("a", { href: absoluteUrl(contacts.website), target: "_blank", rel: "noopener", text: displayUrl(contacts.website) }),
      ]));
    }

    var normSns = core.normalizeSns(card.sns).slice(0, 4);
    var snsWrap = null;
    if (normSns.length) {
      snsWrap = el("div", { class: "bc-oe-sns bc-oe-rv bc-oe-d2" });
      normSns.forEach(function (s) {
        var iconSvg = (icons.sns && icons.sns[s.type]) || icons.contact.link;
        snsWrap.appendChild(el("a", { href: s.url, target: "_blank", rel: "noopener", html: iconSvg + "<span>" + (s.label || "") + "</span>" }));
      });
    }

    var saveBtn = el("button", { class: "bc-oe-save", id: "bc-oe-save", "data-state": "idle", type: "button", "aria-label": "連絡先を保存" }, [
      el("span", { class: "bc-oe-layer bc-oe-l-idle" }, [
        el("span", { html: icons.contact.save }),
        document.createTextNode("連絡先に保存"),
      ]),
      el("span", { class: "bc-oe-layer bc-oe-l-done", html: '<svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>保存しました' }),
    ]);
    var saveNote = el("div", { class: "bc-oe-save-note", text: "連絡先アプリを開いて追加を確認してください" });

    var contactChapChildren = [
      el("div", { class: "bc-oe-kick bc-oe-rv", text: contactChap + " — Contact" }),
    ];
    if (rows.length) contactChapChildren.push(el("div", { class: "bc-oe-rows bc-oe-rv bc-oe-d1" }, rows));
    if (snsWrap) contactChapChildren.push(snsWrap);
    contactChapChildren.push(el("div", { class: "bc-oe-save-wrap" }, [saveBtn, saveNote]));

    // QR描画は core.renderQr（統一ヘルパ）に委譲。owner-editorial固有クラス
    // （bc-oe-qr / bc-oe-qr-code / bc-oe-cap）を追加付与し、既存CSS・見た目は不変。
    if (core.renderQr) {
      var qrNode = core.renderQr(card);
      if (qrNode) {
        qrNode.classList.add("bc-oe-qr", "bc-oe-rv", "bc-oe-d3");
        var qrCodeEl = qrNode.querySelector(".bc-qr-code");
        if (qrCodeEl) qrCodeEl.classList.add("bc-oe-qr-code");
        var qrCapEl = qrNode.querySelector(".bc-qr-cap");
        if (qrCapEl) qrCapEl.classList.add("bc-oe-cap");
        contactChapChildren.push(qrNode);
      }
    } else if (qr && nonEmpty(qr.svg)) {
      // core.renderQr 未提供時のフォールバック（旧ロジックそのまま）
      contactChapChildren.push(
        el("div", { class: "bc-oe-qr bc-oe-rv bc-oe-d3" }, [
          el("div", { class: "bc-oe-qr-code", role: "img", "aria-label": "連絡先QRコード", html: qr.svg }),
          el("div", { class: "bc-oe-cap" }, [
            el("b", { text: "Scan to save" }),
            document.createTextNode("スマホのカメラで読み取ると、連絡先を保存できます。"),
          ]),
        ])
      );
    }

    var year = new Date().getFullYear();
    contactChapChildren.push(
      el("div", { class: "bc-oe-foot" }, [
        document.createTextNode("© " + year + " " + (name.ja || "")),
        el("div", { class: "bc-oe-powered-by", html: "Powered by <a href=\"https://withbt.com/card/\" target=\"_blank\" rel=\"noopener\">BrightCard</a>（合同会社WBT）" }),
      ])
    );

    var contactSection = el(
      "section",
      { class: "bc-oe-chapter", "data-chap": contactChap, "data-label": "Contact" },
      [el("span", { class: "bc-oe-ghost", "aria-hidden": "true", text: contactChap }), el("div", { class: "bc-oe-chap-inner" }, contactChapChildren)]
    );
    stack.appendChild(contactSection);
    chapterEls.push(contactSection);

    wrap.appendChild(stack);

    // ---------- 固定要素: スクロールスパイ / CTAバー / SNSドック ----------
    var totalLabel = (chapterEls.length - 1 < 10 ? "0" : "") + (chapterEls.length - 1);
    var spy = el("div", { class: "bc-oe-spy", "aria-hidden": "true" }, [
      el("b", { id: "bc-oe-spy-n", text: heroChap }),
      document.createTextNode(" / " + totalLabel),
    ]);
    wrap.appendChild(spy);

    var ctaSaveBtn = el("button", { id: "bc-oe-save-bar", "data-state": "idle", type: "button", "aria-label": "連絡先を保存" }, [
      el("span", { class: "bc-oe-layer bc-oe-l-idle" }, [
        el("span", { html: icons.contact.save }),
        document.createTextNode("連絡先に保存"),
      ]),
      el("span", { class: "bc-oe-layer bc-oe-l-done", html: '<svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>保存しました' }),
    ]);
    var ctabar = el("div", { class: "bc-oe-ctabar", id: "bc-oe-ctabar" }, [ctaSaveBtn]);
    wrap.appendChild(ctabar);

    var dock = null;
    var dockToggle = null;
    if (normSns.length) {
      var socialLinks = el("div", { class: "bc-oe-social-links" });
      normSns.forEach(function (s) {
        var style = CHAN_STYLE[s.type] || { bg: palette.accent, color: "#fff" };
        var iconSvg = (icons.sns && icons.sns[s.type]) || icons.contact.link;
        var abbr = s.badge || DEFAULT_ABBR[s.type] || (s.label || "").slice(0, 2);
        socialLinks.appendChild(
          el("a", {
            class: "bc-oe-social-link",
            href: s.url,
            target: "_blank",
            rel: "noopener",
            "aria-label": s.label + (s.badge ? "（" + s.badge + "）" : ""),
            style: "--bc-oe-brand-bg:" + style.bg + ";--bc-oe-brand-fg:" + style.color,
            html: iconSvg + '<span class="bc-oe-social-abbr">' + abbr + "</span>",
          })
        );
      });
      dockToggle = el("button", {
        class: "bc-oe-social-toggle",
        id: "bc-oe-social-toggle",
        type: "button",
        "aria-expanded": "false",
        "aria-controls": "bc-oe-social-links",
        "aria-label": "SNSリンクを開く",
        html:
          '<span class="bc-oe-tg bc-oe-tg-open" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg></span>' +
          '<span class="bc-oe-tg bc-oe-tg-close" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></span>',
      });
      dock = el("div", { class: "bc-oe-social-dock", id: "bc-oe-social-dock", "aria-label": "SNS・連絡リンク" }, [socialLinks, dockToggle]);
      wrap.appendChild(dock);
    }

    document.body.appendChild(wrap);

    // ---------- reduced-motion 生存監視（CSS二重防御・_proto踏襲） ----------
    var mq = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)");
    function applyRM() {
      if (mq && mq.matches) wrap.setAttribute("data-reduced", "");
      else wrap.removeAttribute("data-reduced");
    }
    if (mq) {
      applyRM();
      if (mq.addEventListener) mq.addEventListener("change", applyRM);
    }

    // ---------- reveal（scroll-triggered） ----------
    var rvEls = wrap.querySelectorAll(".bc-oe-rv");
    if (reduce) {
      rvEls.forEach(function (e) { e.classList.add("bc-oe-in"); });
    } else if ("IntersectionObserver" in global) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("bc-oe-in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -12% 0px" }
      );
      rvEls.forEach(function (e) { io.observe(e); });
    } else {
      rvEls.forEach(function (e) { e.classList.add("bc-oe-in"); });
    }

    // ---------- Proof カウントアップ（章がIO threshold 0.35に入ったら1回だけ発火） ----------
    var metricsDone = false;
    function runMetrics() {
      if (metricsDone) return;
      metricsDone = true;
      metricItems.forEach(function (m) {
        if (m.isStatic) return;
        if (reduce) {
          // reduced-motion: 最終値を即時静的表示（アニメなし）
          m.valEl.textContent = String(m.to);
          return;
        }
        countUp(m.valEl, m.to, 1100);
      });
    }
    if (metricItems.length && proofSection) {
      if (!reduce && "IntersectionObserver" in global) {
        var mio = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              runMetrics();
              mio.unobserve(entry.target);
            });
          },
          { threshold: 0.35 }
        );
        mio.observe(proofSection);
      } else {
        runMetrics();
      }
    }

    // ---------- 章スクロールスパイ + CTAバー/ドックの表示切替（rAF1本）----------
    // sticky-stackで全章がtop:0にピンされるため、要素基準のIOでは現在章を判別できない。
    // スクロール位置から算出する: idx = round(scrollY / viewport)（_proto踏襲）。
    var spyN = spy.querySelector("#bc-oe-spy-n");
    var chapters = wrap.querySelectorAll(".bc-oe-chapter");
    var ticking = false;
    var lastIdx = -1;
    var barShown = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }
    function update() {
      ticking = false;
      var vh = global.innerHeight || 1;
      var idx = Math.round(global.scrollY / vh);
      if (idx < 0) idx = 0;
      if (idx > chapters.length - 1) idx = chapters.length - 1;
      if (idx !== lastIdx) {
        lastIdx = idx;
        if (spyN) spyN.textContent = chapters[idx].getAttribute("data-chap");
        var show = idx >= 1;
        if (show !== barShown) {
          barShown = show;
          ctabar.classList.toggle("bc-oe-show", show);
          if (dock) {
            dock.classList.toggle("bc-oe-show", show);
            if (!show) {
              dock.classList.remove("bc-oe-open");
              if (dockToggle) {
                dockToggle.setAttribute("aria-expanded", "false");
                dockToggle.setAttribute("aria-label", "SNSリンクを開く");
              }
            }
          }
        }
      }
    }
    global.addEventListener("scroll", onScroll, { passive: true });
    global.addEventListener("resize", onScroll, { passive: true });
    update();

    // ---------- SNSドック開閉 ----------
    if (dockToggle && dock) {
      dockToggle.addEventListener("click", function () {
        var open = dock.classList.toggle("bc-oe-open");
        dockToggle.setAttribute("aria-expanded", open ? "true" : "false");
        dockToggle.setAttribute("aria-label", open ? "SNSリンクを閉じる" : "SNSリンクを開く");
      });
    }

    // ---------- Save（vCard保存）状態管理 ----------
    var saveBtns = [saveBtn, ctaSaveBtn];
    var stateTimer = null;
    function setState(s) {
      saveBtns.forEach(function (b) { if (b) b.setAttribute("data-state", s); });
      if (stateTimer) clearTimeout(stateTimer);
      if (s === "done") stateTimer = setTimeout(function () { setState("idle"); }, 2600);
    }
    function doSave() {
      core.downloadVCard(card, photoBase64);
      setTimeout(function () { setState("done"); }, 180);
    }
    saveBtns.forEach(function (b) { if (b) b.addEventListener("click", doSave); });
  }

  global.BrightCardTemplates = global.BrightCardTemplates || {};
  global.BrightCardTemplates["owner-editorial"] = render;
})(window);
