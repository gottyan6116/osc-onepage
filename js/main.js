(function () {
  "use strict";

  const { products, visuals, links } = window.OSC;
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = () => reduceMQ.matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const ARROW = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---------------- tween helper ---------------- */
  function tween(from, to, ms, onUpdate) {
    if (reduced()) { onUpdate(to); return () => {}; }
    let raf, start;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      start = start || now;
      const t = clamp((now - start) / ms, 0, 1);
      onUpdate(from + (to - from) * ease(t));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }

  /* ---------------- visuals ---------------- */
  function attachInteractions(container, id) {
    const svg = container.querySelector("svg");
    if (!svg) return;
    const host = container.closest(".product-card");
    if (id === "zw3d" && host) {
      svg._angle = 0;
      let stop = () => {};
      host.addEventListener("mouseenter", () => {
        stop();
        stop = tween(svg._angle, 24, 900, (v) => { svg._angle = v; visuals.rotateBracket(svg, v); });
      });
      host.addEventListener("mouseleave", () => {
        stop();
        stop = tween(svg._angle, 0, 900, (v) => { svg._angle = v; visuals.rotateBracket(svg, v); });
      });
    }
    if (id === "zwcad") {
      const cursor = svg.querySelector("[data-cursor]");
      container.addEventListener("pointermove", (e) => {
        const r = svg.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 400;
        const y = ((e.clientY - r.top) / r.height) * 280;
        cursor.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        container.classList.add("has-cursor");
      });
      container.addEventListener("pointerleave", () => container.classList.remove("has-cursor"));
    }
  }

  function mountVisual(container, id) {
    const make = visuals[id];
    if (!make) return null;
    const svg = make();
    container.prepend(svg);
    attachInteractions(container, id);
    return svg;
  }

  /* ---------------- product cards ---------------- */
  const grid = $("[data-product-grid]");
  grid.innerHTML = products
    .map(
      (p, i) => `
      <article class="product-card reveal" id="card-${p.id}" data-id="${p.id}" style="--i:${i}">
        <div class="card-visual" data-card-visual role="img" aria-label="${esc(p.visualLabel)}（自作イラスト）">
        </div>
        <div class="card-body">
          <p class="card-cat">${esc(p.category)}</p>
          <h3 class="card-name">${esc(p.name)}</h3>
          <p class="card-value">${esc(p.value)}</p>
          <ul class="card-feats">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
          <button class="card-cta" type="button" data-open="${p.id}" aria-haspopup="dialog" aria-label="${esc(p.name)}の詳細を見る">詳しく見る${ARROW}</button>
        </div>
      </article>`
    )
    .join("");
  $$(".product-card").forEach((card) => mountVisual($("[data-card-visual]", card), card.dataset.id));

  /* ---------------- compare table ---------------- */
  const dimCell = (p) => {
    const on3 = p.id === "zw3d";
    const note = on3 ? '<span class="dim-note">3Dモデルと連動した2D図面作成に対応</span>' : "";
    return `<span class="dim-badge"><i class="${on3 ? "" : "on"}">2D</i><i class="${on3 ? "on" : ""}">3D</i></span>${note}`;
  };
  const dwg = {
    zw3d: "図面をPDF／DWGに一括出力",
    zwcad: "DWG／DXFをネイティブに扱える",
    "zwcad-mfg": "DWG形式をそのまま運用できる"
  };
  const rows = [
    ["製品カテゴリ", (p) => esc(p.category)],
    ["主な用途", (p) => esc(p.usage)],
    ["2D ／ 3D", dimCell],
    ["代表的な機能", (p) => p.keyFeature.split("、").map(esc).join("<br>")],
    ["想定利用シーン", (p) => p.scene.split("、").map(esc).join("<br>")],
    ["DWGの扱い", (p) => esc(dwg[p.id])],
    ["参考価格<br><small>スタンドアロン版</small>", (p) => `<span class="price">${esc(p.price.from)}</span>`]
  ];
  $("[data-compare-table]").insertAdjacentHTML(
    "beforeend",
    `<colgroup><col class="c-head">${products.map(() => "<col>").join("")}</colgroup>
    <thead><tr><th scope="col"><span class="sr-only">比較項目</span></th>${products
      .map((p) => `<th scope="col"><button class="cmp-name" type="button" data-open="${p.id}" aria-haspopup="dialog"><small>${esc(p.category)}</small><span>${esc(p.name)}</span></button></th>`)
      .join("")}</tr></thead>
    <tbody>${rows
      .map(([label, fn]) => `<tr><th scope="row">${label}</th>${products.map((p) => `<td>${fn(p)}</td>`).join("")}</tr>`)
      .join("")}</tbody>`
  );

  /* ---------------- hero + misc visuals ---------------- */
  const ctaBg = $('[data-visual="cta-bg"]');
  ctaBg.appendChild(visuals.ctaBg());
  $$(".service-fig").forEach((el) => el.appendChild(visuals.service(el.dataset.visual)));

  /* ---------------- scroll reveal ---------------- */
  const revealIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        revealIO.unobserve(e.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => revealIO.observe(el));

  const drawIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-drawn");
        drawIO.unobserve(e.target);
      });
    },
    { threshold: 0.35 }
  );
  $$("[data-card-visual]").forEach((el) => drawIO.observe(el));
  drawIO.observe(ctaBg);

  /* ---------------- scroll-linked effects ---------------- */
  const header = $(".site-header");
  const progress = $(".scroll-progress");
  const hero = $(".hero");
  const heroFrame = $("[data-hero-parallax]");
  const flow = $("[data-flow]");
  const flowFill = $("[data-flow-fill]");
  const flowSteps = $$(".flow-steps li");
  let ticking = false;

  function onScroll() {
    ticking = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle("is-scrolled", y > 8);
    progress.style.setProperty("--sp", max > 0 ? (y / max).toFixed(4) : 0);

    // Hero: subtle parallax on the key visual (desktop only)
    const hr = hero.getBoundingClientRect();
    if (hr.bottom > 0 && heroFrame) {
      const shift = !reduced() && innerWidth > 960 ? clamp(-hr.top, 0, hr.height) * 0.07 : 0;
      heroFrame.style.setProperty("--hero-py", shift.toFixed(1) + "px");
    }

    // Support flow line
    const fr = flow.getBoundingClientRect();
    const fp = clamp((innerHeight * 0.85 - fr.top) / (fr.height + innerHeight * 0.25), 0, 1);
    flow.style.setProperty("--flow", fp.toFixed(3));
    flowSteps.forEach((li, i) => li.classList.toggle("is-on", fp >= (i / flowSteps.length) * 0.9 + 0.02));
  }
  const requestScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  };
  window.addEventListener("scroll", requestScroll, { passive: true });
  window.addEventListener("resize", requestScroll);
  onScroll();

  // Active nav link
  const navLinks = $$("[data-nav]");
  const navIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle("is-active", a.dataset.nav === e.target.id));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  ["products", "compare", "support"].forEach((id) => navIO.observe(document.getElementById(id)));

  /* ---------------- mobile menu ---------------- */
  const toggle = $(".menu-toggle");
  const mnav = $("#mobile-nav");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    mnav.hidden = !open;
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  mnav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !mnav.hidden) { setMenu(false); toggle.focus(); }
  });

  /* ---------------- issues -> product card ---------------- */
  const issueBtns = $$(".issue");
  issueBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      issueBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      const card = document.getElementById("card-" + btn.dataset.target);
      card.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center" });
      card.classList.add("is-in");
      card.classList.remove("is-highlight");
      void card.offsetWidth;
      card.classList.add("is-highlight");
      setTimeout(() => $(".card-cta", card).focus({ preventScroll: true }), reduced() ? 0 : 700);
    })
  );

  /* =========================================================
     Product modal — container-transform from the clicked card
     ========================================================= */
  const modal = $("#product-modal");
  const panel = $("[data-modal-panel]");
  const body = $("[data-modal-body]");
  let state = null; // { id, origin, trigger, busy }

  function modalHTML(p) {
    const list = (arr) => `<ul class="m-list">${arr.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`;
    const rot =
      p.id === "zw3d"
        ? `<label class="rot-control">ROTATE<input type="range" min="-40" max="40" value="0" step="1" data-rot aria-label="イラストの回転角度"></label>`
        : "";
    return `
      <div class="m-grid">
        <div class="m-visual">
          <div class="m-visual-inner" data-m-visual role="img" aria-label="${esc(p.visualLabel)}（自作イラスト）"></div>
          <div class="m-visual-foot">
            <p class="m-fig-note">※ 自作の技術イラストです。${esc(p.name)}の実際の画面ではありません。</p>
            ${rot}
          </div>
        </div>
        <div class="m-content">
          <p class="m-cat">${esc(p.category)}</p>
          <h2 class="m-title" id="modal-title">${esc(p.name)}</h2>
          <p class="m-catch">${esc(p.catch)}</p>
          <p class="m-summary">${esc(p.summary)}</p>
          <section class="m-sec" aria-labelledby="m-feat">
            <h3 id="m-feat">主な機能</h3>
            <ol class="m-feats">${p.features.map((x) => `<li><div><b>${esc(x.t)}</b><p>${esc(x.d)}</p></div></li>`).join("")}</ol>
          </section>
          <section class="m-sec" aria-labelledby="m-scene">
            <h3 id="m-scene">利用シーン</h3>
            ${list(p.scenes)}
          </section>
          <section class="m-sec" aria-labelledby="m-out">
            <h3 id="m-out">導入によって期待できること</h3>
            ${list(p.outcomes)}
          </section>
          <section class="m-sec" aria-labelledby="m-price">
            <h3 id="m-price">参考価格（スタンドアロン版）</h3>
            <table class="m-price"><tbody>${p.price.rows.map(([a, b]) => `<tr><th scope="row">${esc(a)}</th><td>${esc(b)}</td></tr>`).join("")}</tbody></table>
            <p class="m-price-note">既存ページ掲載の価格（2026年9月18日確認）。ネットワークライセンス版もあります。最新の価格・税区分はお問い合わせください。</p>
          </section>
          <div class="m-cta">
            <p>${esc(p.name)}の導入を検討中の方へ</p>
            <div class="m-cta-row">
              <button class="btn btn-ghost" type="button" data-doc-request>資料を請求する</button>
              <a class="btn btn-primary" href="${links.contact}" target="_blank" rel="noopener">導入について相談する<span class="ext" aria-hidden="true"></span><span class="sr-only">（公式サイト・別タブ）</span></a>
            </div>
            <div class="m-links">
              <a href="${links.trial}" target="_blank" rel="noopener">30日間無料体験版を申し込む<span class="ext" aria-hidden="true"></span></a>
              <a href="${p.page}" target="_blank" rel="noopener">現行の${esc(p.name)}製品ページ<span class="ext" aria-hidden="true"></span></a>
            </div>
          </div>
        </div>
      </div>`;
  }

  const insetFrom = (pr, r) => {
    const t = clamp(r.top - pr.top, 0, pr.height - 40);
    const l = clamp(r.left - pr.left, 0, pr.width - 40);
    const b = clamp(pr.bottom - r.bottom, 0, pr.height - t - 40);
    const rr = clamp(pr.right - r.right, 0, pr.width - l - 40);
    return `inset(${t}px ${rr}px ${b}px ${l}px round 14px)`;
  };
  const inView = (r) => r.bottom > 0 && r.top < innerHeight && r.width > 0;

  function visualFlip(fromEl, toEl) {
    // transform that maps toEl's box onto fromEl's box (uniform scale by width)
    const a = fromEl.getBoundingClientRect();
    const b = toEl.getBoundingClientRect();
    const s = a.width / b.width;
    return `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${s})`;
  }

  const EASE = "cubic-bezier(.2,.8,.2,1)";

  function openModal(id, trigger) {
    const p = byId[id];
    if (!p || (state && state.busy)) return;
    const card = document.getElementById("card-" + id);
    const origin = trigger.closest(".product-card") || trigger;
    state = { id, origin, trigger, card, busy: true };

    body.innerHTML = modalHTML(p);
    body.scrollTop = 0;
    const mv = $("[data-m-visual]", body);
    const svg = mountVisual(mv, id);
    const rng = $("[data-rot]", body);
    if (rng) {
      rng.addEventListener("input", () => visuals.rotateBracket(svg, +rng.value));
      dragRotate(mv, svg, rng);
    }

    modal.showModal();
    document.documentElement.classList.add("is-locked");
    modal.classList.add("is-entering");
    requestAnimationFrame(() => modal.classList.add("is-open"));

    const done = () => {
      modal.classList.remove("is-entering");
      state.busy = false;
      setTimeout(() => mv.classList.add("is-drawn"), reduced() ? 0 : 60);
    };

    if (reduced()) {
      panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160 });
      mv.classList.add("is-drawn");
      done();
      return;
    }

    const pr = panel.getBoundingClientRect();
    const or = origin.getBoundingClientRect();
    if (origin.classList.contains("product-card")) origin.classList.add("is-origin");
    panel.animate(
      [{ clipPath: insetFrom(pr, or) }, { clipPath: "inset(0px 0px 0px 0px round 18px)" }],
      { duration: 640, easing: EASE }
    );
    const cardVis = origin.querySelector && origin.querySelector("[data-card-visual] svg");
    if (cardVis) {
      svg.animate([{ transform: visualFlip(cardVis, svg), transformOrigin: "0 0" }, { transform: "none", transformOrigin: "0 0" }], {
        duration: 640,
        easing: EASE
      });
    }
    setTimeout(() => {
      modal.classList.remove("is-entering");
    }, 260);
    setTimeout(done, 640);
  }

  function closeModal() {
    if (!state || state.busy) return;
    state.busy = true;
    const { origin, trigger } = state;
    const finish = () => {
      modal.close();
      modal.classList.remove("is-open", "is-entering");
      document.documentElement.classList.remove("is-locked");
      origin.classList.remove("is-origin");
      body.innerHTML = "";
      const t = trigger;
      state = null;
      if (t && document.contains(t)) t.focus({ preventScroll: true });
    };
    modal.classList.remove("is-open");

    const or = origin.getBoundingClientRect();
    if (reduced() || !inView(or)) {
      const a = panel.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: reduced() ? "none" : "scale(.97)" }], {
        duration: reduced() ? 120 : 260,
        easing: EASE
      });
      a.onfinish = finish;
      return;
    }
    modal.classList.add("is-entering");
    const pr = panel.getBoundingClientRect();
    const svg = $("[data-m-visual] svg", body);
    const cardVis = origin.querySelector && origin.querySelector("[data-card-visual] svg");
    if (svg && cardVis) {
      svg.animate([{ transform: "none", transformOrigin: "0 0" }, { transform: visualFlip(cardVis, svg), transformOrigin: "0 0" }], {
        duration: 520,
        easing: EASE,
        fill: "forwards"
      });
    }
    const a = panel.animate(
      [{ clipPath: "inset(0px 0px 0px 0px round 18px)" }, { clipPath: insetFrom(pr, or) }],
      { duration: 520, easing: EASE, fill: "forwards" }
    );
    a.onfinish = () => {
      finish();
      a.cancel();
    };
  }

  function dragRotate(area, svg, rng) {
    let startX = null, startV = 0;
    area.style.touchAction = "pan-y";
    area.style.cursor = "grab";
    area.addEventListener("pointerdown", (e) => {
      startX = e.clientX; startV = +rng.value;
      area.setPointerCapture(e.pointerId);
      area.style.cursor = "grabbing";
    });
    area.addEventListener("pointermove", (e) => {
      if (startX === null) return;
      const v = clamp(Math.round(startV + (e.clientX - startX) / 4), -40, 40);
      rng.value = v;
      visuals.rotateBracket(svg, v);
    });
    const end = () => { startX = null; area.style.cursor = "grab"; };
    area.addEventListener("pointerup", end);
    area.addEventListener("pointercancel", end);
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open]");
    if (t) { e.preventDefault(); openModal(t.dataset.open, t); }
  });
  $("[data-modal-close]").addEventListener("click", closeModal);
  modal.addEventListener("cancel", (e) => { e.preventDefault(); closeModal(); });
  // Handle Esc directly as well: Chrome's close watcher may swallow repeated cancel events.
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); closeModal(); }
  });
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  /* ---------------- demo dialog (資料請求) ---------------- */
  const demo = $("#demo-dialog");
  let demoReturn = null;
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-doc-request]");
    if (!t) return;
    demoReturn = t;
    demo.showModal();
    document.documentElement.classList.add("is-locked");
  });
  const closeDemo = () => demo.close();
  $("[data-demo-close]").addEventListener("click", closeDemo);
  demo.addEventListener("click", (e) => { if (e.target === demo) closeDemo(); });
  demo.addEventListener("close", () => {
    if (!modal.open) document.documentElement.classList.remove("is-locked");
    if (demoReturn) demoReturn.focus({ preventScroll: true });
  });

  /* ---------------- deep link (?product=zw3d) ---------------- */
  const q = new URLSearchParams(location.search).get("product");
  if (q && byId[q]) {
    const card = document.getElementById("card-" + q);
    $$(".reveal").forEach((el) => el.classList.add("is-in"));
    card.scrollIntoView({ block: "center" });
    setTimeout(() => openModal(q, $(".card-cta", card)), 300);
  }
  if (new URLSearchParams(location.search).has("static")) {
    $$(".reveal").forEach((el) => el.classList.add("is-in"));
    $$("[data-card-visual]").forEach((el) => el.classList.add("is-drawn"));
    ctaBg.classList.add("is-drawn");
  }
})();
