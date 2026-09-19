/*
 * Hand-built technical illustrations (SVG).
 * These are original drawings for this mock — NOT screenshots of ZWSOFT products.
 */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const f = (n) => Math.round(n * 10) / 10;
  let uid = 0;

  /* ---------- shared defs ---------- */
  function defs(id) {
    return `
    <defs>
      <linearGradient id="${id}-metal" x1="0" x2="1">
        <stop offset="0" stop-color="#7d8894"/><stop offset=".32" stop-color="#e3e7eb"/>
        <stop offset=".6" stop-color="#b3bcc6"/><stop offset="1" stop-color="#65707c"/>
      </linearGradient>
      <linearGradient id="${id}-metalTop" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f4f6f8"/><stop offset="1" stop-color="#c9d0d7"/>
      </linearGradient>
      <linearGradient id="${id}-blue" x1="0" x2="1">
        <stop offset="0" stop-color="#15408f"/><stop offset=".3" stop-color="#5b8ef0"/>
        <stop offset=".62" stop-color="#2b63cf"/><stop offset="1" stop-color="#12367c"/>
      </linearGradient>
      <linearGradient id="${id}-blueTop" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#b7cdf8"/><stop offset="1" stop-color="#6f98ea"/>
      </linearGradient>
      <radialGradient id="${id}-hole" cx=".5" cy=".35" r=".7">
        <stop offset="0" stop-color="#20262d"/><stop offset="1" stop-color="#4a535d"/>
      </radialGradient>
      <radialGradient id="${id}-shadow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#1e2226" stop-opacity=".22"/><stop offset="1" stop-color="#1e2226" stop-opacity="0"/>
      </radialGradient>
      <pattern id="${id}-teeth" width="7" height="10" patternUnits="userSpaceOnUse">
        <rect width="3" height="10" fill="#0c2a66" opacity=".38"/>
      </pattern>
      <pattern id="${id}-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="#1b5bd6" stroke-width="1"/>
      </pattern>
      <marker id="${id}-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 1.5L10 5L0 8.5z" fill="#4a5159"/>
      </marker>
    </defs>`;
  }

  /* ---------- coaxial cylinder (isometric-ish) ---------- */
  function cyl(id, o) {
    const { cx, y, rx, h } = o;
    const ry = rx * 0.42;
    const top = y - h;
    const mat = o.mat || "metal";
    const side = `M${f(cx - rx)} ${f(top)}L${f(cx - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(y)}L${f(cx + rx)} ${f(top)}Z`;
    let s = `<path d="${side}" fill="url(#${id}-${mat})" stroke="#252b33" stroke-width=".9" stroke-opacity=".75"/>`;
    if (o.teeth) s += `<path d="${side}" fill="url(#${id}-teeth)"/>`;
    if (o.teeth) {
      s += `<ellipse cx="${cx}" cy="${f(top)}" rx="${f(rx + 5)}" ry="${f(ry + 2.2)}" fill="none" stroke="#123a86" stroke-width="7" stroke-dasharray="5 4.2"/>`;
    }
    s += `<ellipse cx="${cx}" cy="${f(top)}" rx="${f(rx)}" ry="${f(ry)}" fill="url(#${id}-${mat}Top)" stroke="#252b33" stroke-width=".9" stroke-opacity=".75"/>`;
    if (o.ring) {
      s += `<ellipse cx="${cx}" cy="${f(top)}" rx="${f(rx * 0.72)}" ry="${f(ry * 0.72)}" fill="none" stroke="#5a646f" stroke-width="1"/>`;
    }
    if (o.bolts) {
      const R = rx * 0.78;
      [45, 135, 225, 315].forEach((a) => {
        const t = (a * Math.PI) / 180;
        s += `<ellipse cx="${f(cx + R * Math.cos(t))}" cy="${f(top + R * 0.42 * Math.sin(t))}" rx="9" ry="3.8" fill="url(#${id}-hole)"/>`;
      });
    }
    if (o.hole) {
      s += `<ellipse cx="${cx}" cy="${f(top)}" rx="${o.hole}" ry="${f(o.hole * 0.42)}" fill="url(#${id}-hole)"/>`;
    }
    return s;
  }

  function el(markup, cls, label) {
    const wrap = document.createElement("div");
    wrap.innerHTML = markup.trim();
    const svg = wrap.firstChild;
    if (cls) svg.setAttribute("class", cls);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    if (label) svg.dataset.label = label;
    return svg;
  }

  /* ---------- HERO: exploded assembly ---------- */
  function hero() {
    const id = "h" + ++uid;
    const cx = 300;
    const parts = [
      { name: "BASE FLANGE", rx: 168, h: 30, bolts: true, hole: 0 },
      { name: "BEARING HOUSING", rx: 92, h: 44, ring: true },
      { name: "SPUR GEAR", rx: 136, h: 28, mat: "blue", teeth: true, hole: 30 },
      { name: "COLLAR", rx: 56, h: 22, hole: 27 },
      { name: "STEPPED SHAFT", shaft: true }
    ];
    let y = 585;
    let g = "";
    const table = [];
    parts.forEach((p, i) => {
      let body = "";
      let h;
      let rx;
      if (p.shaft) {
        body += cyl(id, { cx, y, rx: 40, h: 16 });
        body += cyl(id, { cx, y: y - 16, rx: 26, h: 118 });
        body += `<ellipse cx="${cx}" cy="${f(y - 134)}" rx="16" ry="6.7" fill="none" stroke="#5a646f" stroke-width="1"/>`;
        h = 134;
        rx = 26;
      } else {
        body += cyl(id, { cx, y, rx: p.rx, h: p.h, mat: p.mat, teeth: p.teeth, hole: p.hole, bolts: p.bolts, ring: p.ring });
        h = p.h;
        rx = p.rx;
      }
      const mid = y - h / 2;
      const bx = 522;
      const balloon = `
        <g class="balloon">
          <path d="M${f(cx + rx * 0.82)} ${f(mid)}L${bx - 34} ${f(mid)}L${bx - 13} ${f(mid)}" stroke="#1b5bd6" stroke-width="1" fill="none"/>
          <circle cx="${f(cx + rx * 0.82)}" cy="${f(mid)}" r="2.4" fill="#1b5bd6"/>
          <circle cx="${bx}" cy="${f(mid)}" r="13" fill="#fff" stroke="#1b5bd6" stroke-width="1.2"/>
          <text x="${bx}" y="${f(mid + 4)}" text-anchor="middle" class="svg-mono" font-size="11" fill="#1b5bd6">${i + 1}</text>
        </g>`;
      g += `<g class="part" style="--k:${i}"><g class="part-in" style="--d:${i}">${body}${balloon}</g></g>`;
      table.push(p.name);
      y = y - h - 4;
    });

    const tbl = table
      .map((n, i) => `<text x="30" y="${52 + i * 17}" class="svg-mono" font-size="10.5" fill="#4a5159"><tspan fill="#1b5bd6">${String(i + 1).padStart(2, "0")}</tspan>  ${n}</text>`)
      .join("");

    return el(
      `<svg xmlns="${NS}" viewBox="0 0 560 640" preserveAspectRatio="xMidYMid meet">
        ${defs(id)}
        <g class="hero-meta">
          <text x="30" y="30" class="svg-mono" font-size="10" fill="#7a828b" letter-spacing="1.5">PARTS LIST</text>
          <line x1="30" y1="37" x2="190" y2="37" stroke="#c9ced4"/>
          ${tbl}
        </g>
        <line class="centerline" x1="${cx}" y1="40" x2="${cx}" y2="622" stroke="#1b5bd6" stroke-width=".9" stroke-dasharray="14 4 3 4" opacity=".55"/>
        <ellipse cx="${cx}" cy="590" rx="190" ry="40" fill="url(#${id}-shadow)"/>
        ${g}
        <g class="dim">
          <line x1="${cx - 168}" y1="596" x2="${cx - 168}" y2="628" stroke="#8a929b" stroke-width=".8"/>
          <line x1="${cx + 168}" y1="596" x2="${cx + 168}" y2="628" stroke="#8a929b" stroke-width=".8"/>
          <line x1="${cx - 166}" y1="622" x2="${cx + 166}" y2="622" stroke="#4a5159" stroke-width=".8" marker-start="url(#${id}-arr)" marker-end="url(#${id}-arr)"/>
          <rect x="${cx - 24}" y="614" width="48" height="14" fill="#fbfcfd"/>
          <text x="${cx}" y="625" text-anchor="middle" class="svg-mono" font-size="10.5" fill="#4a5159">Ø336</text>
        </g>
        <g class="triad" transform="translate(44 596)">
          <line x1="0" y1="0" x2="24" y2="12" stroke="#d0453b" stroke-width="1.6"/>
          <line x1="0" y1="0" x2="-24" y2="12" stroke="#2e9e5b" stroke-width="1.6"/>
          <line x1="0" y1="0" x2="0" y2="-26" stroke="#1b5bd6" stroke-width="1.6"/>
          <text x="27" y="19" class="svg-mono" font-size="9" fill="#d0453b">X</text>
          <text x="-33" y="19" class="svg-mono" font-size="9" fill="#2e9e5b">Y</text>
          <text x="-3" y="-30" class="svg-mono" font-size="9" fill="#1b5bd6">Z</text>
        </g>
      </svg>`,
      "hero-svg"
    );
  }

  /* ---------- iso engine for ZW3D bracket ---------- */
  function isoProj(theta, s, ox, oy, c) {
    const ct = Math.cos(theta), st = Math.sin(theta);
    const c30 = Math.cos(Math.PI / 6), s30 = 0.5;
    return (x, y, z) => {
      const dx = x - c[0], dy = y - c[1];
      const rx = dx * ct - dy * st, ry = dx * st + dy * ct;
      return [ox + (rx - ry) * c30 * s, oy + (rx + ry) * s30 * s - (z - c[2]) * s, rx + ry + (z - c[2])];
    };
  }
  const poly = (pts) => "M" + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join("L") + "Z";

  function bracketSVG(theta) {
    const P = isoProj(theta, 1.22, 206, 156, [60, 40, 46]);
    const faces = [];
    const face = (pts3, fill, extra) => {
      const pts = pts3.map((p) => P(...p));
      const depth = pts.reduce((a, p) => a + p[2], 0) / pts.length;
      faces.push({ d: poly(pts), fill, depth, extra: extra || "" });
    };
    const circ = (c, r, plane) => {
      const pts = [];
      for (let k = 0; k < 40; k++) {
        const a = (k / 40) * Math.PI * 2;
        const u = r * Math.cos(a), v = r * Math.sin(a);
        if (plane === "z") pts.push(P(c[0] + u, c[1] + v, c[2]));
        else pts.push(P(c[0], c[1] + u, c[2] + v));
      }
      return poly(pts);
    };
    const TOP = "#a9c3f6", FX = "#3f71d9", FY = "#2654b6";
    const boxFaces = (x0, x1, y0, y1, z0, z1, tag) => {
      face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], TOP, tag + "top");
      face([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], FX, tag + "x");
      face([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], FY, tag + "y");
    };
    // base plate, upright, rib
    const out = [];
    const draw = (list) => list.sort((a, b) => a.depth - b.depth).forEach((q) => out.push(q));
    const base = [];
    faces.length = 0;
    boxFaces(0, 120, 0, 80, 0, 14, "b");
    base.push(...faces.splice(0));
    boxFaces(0, 18, 0, 80, 14, 92, "u");
    const up = faces.splice(0);
    // rib (triangular prism at y 34..46)
    face([[18, 46, 14], [78, 46, 14], [18, 46, 48]], FY, "r");
    face([[18, 34, 48], [18, 46, 48], [78, 46, 14], [78, 34, 14]], "#6d93e6", "r");
    const rib = faces.splice(0);
    draw(base);
    let svg = out.map((q) => `<path d="${q.d}" fill="${q.fill}" stroke="#0f2f74" stroke-width=".9" stroke-linejoin="round"/>`).join("");
    // holes on base top
    [[80, 18], [80, 62], [104, 18], [104, 62]].forEach(([x, y]) => {
      svg += `<path d="${circ([x, y, 14], 6.5, "z")}" fill="#12275a" stroke="#0f2f74" stroke-width=".7"/>`;
    });
    out.length = 0;
    draw(up);
    svg += out.map((q) => `<path d="${q.d}" fill="${q.fill}" stroke="#0f2f74" stroke-width=".9" stroke-linejoin="round"/>`).join("");
    // bore on upright face (x=18)
    svg += `<path d="${circ([18, 40, 68], 15, "x")}" fill="#12275a" stroke="#0f2f74" stroke-width=".8"/>`;
    svg += `<path d="${circ([18, 40, 68], 21, "x")}" fill="none" stroke="#c9dafb" stroke-width="1" stroke-dasharray="3 3"/>`;
    out.length = 0;
    draw(rib);
    svg += out.map((q) => `<path d="${q.d}" fill="${q.fill}" stroke="#0f2f74" stroke-width=".9" stroke-linejoin="round"/>`).join("");
    return svg;
  }

  function zw3d() {
    const id = "z" + ++uid;
    const svg = el(
      `<svg xmlns="${NS}" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet">
        ${defs(id)}
        <ellipse cx="205" cy="232" rx="150" ry="26" fill="url(#${id}-shadow)"/>
        <g class="bracket" data-bracket>${bracketSVG(0)}</g>
        <g transform="translate(34 246)">
          <line x1="0" y1="0" x2="18" y2="9" stroke="#d0453b" stroke-width="1.5"/>
          <line x1="0" y1="0" x2="-18" y2="9" stroke="#2e9e5b" stroke-width="1.5"/>
          <line x1="0" y1="0" x2="0" y2="-20" stroke="#1b5bd6" stroke-width="1.5"/>
        </g>
        <text x="20" y="28" class="svg-mono" font-size="10" fill="#7a828b" letter-spacing="1.2">SOLID ／ SHADED</text>
        <text x="380" y="28" text-anchor="end" class="svg-mono" font-size="10" fill="#1b5bd6" data-angle>ROT 0°</text>
      </svg>`,
      "vis-svg vis-zw3d"
    );
    return svg;
  }

  function rotateBracket(svg, deg) {
    const g = svg.querySelector("[data-bracket]");
    if (!g) return;
    g.innerHTML = bracketSVG((deg * Math.PI) / 180);
    const t = svg.querySelector("[data-angle]");
    if (t) t.textContent = `ROT ${Math.round(deg)}°`;
  }

  /* ---------- ZWCAD: 2D drawing ---------- */
  function zwcad() {
    const id = "c" + ++uid;
    const L = (d, cls, extra) => `<path class="${cls || "ln"}" d="${d}" pathLength="1" ${extra || ""}/>`;
    const circle = (cx, cy, r) =>
      `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
    let g = "";
    // outline with chamfers
    g += L("M72 70H300L318 88V196H72Z");
    // corner holes
    [[96, 94], [294, 112], [96, 172], [294, 172]].forEach(([x, y]) => (g += L(circle(x, y, 8))));
    // center bore + slot
    g += L(circle(190, 133, 30));
    g += L(circle(190, 133, 18), "ln thin");
    g += L("M242 118H270A15 15 0 0 1 270 148H242A15 15 0 0 1 242 118Z");
    // center lines
    g += L("M150 133H232M190 93V173", "cl");
    g += L("M84 94H108M96 82V106M84 172H108M96 160V184M282 172H306M294 160V184M282 112H306M294 100V124", "cl");
    // dims
    g += L("M72 62V44M318 80V44", "dm");
    g += L("M72 50H318", "dm", `marker-start="url(#${id}-arr)" marker-end="url(#${id}-arr)"`);
    g += L("M64 70H44M64 196H44", "dm");
    g += L("M50 70V196", "dm", `marker-start="url(#${id}-arr)" marker-end="url(#${id}-arr)"`);
    g += L("M211 112L236 88H262", "dm");
    // title block
    g += L("M262 218H386V266H262ZM262 234H386M262 250H386M322 218V266", "tb");
    return el(
      `<svg xmlns="${NS}" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet">
        ${defs(id)}
        <g class="draw">${g}</g>
        <g class="svg-mono" font-size="10" fill="#4a5159">
          <text x="195" y="45" text-anchor="middle">246</text>
          <text x="40" y="136" text-anchor="middle" transform="rotate(-90 40 133)">126</text>
          <text x="238" y="84">Ø60</text>
          <text x="268" y="229" font-size="8.5">PLATE-A01</text>
          <text x="328" y="229" font-size="8.5">A4</text>
          <text x="268" y="245" font-size="8.5">SCALE 1:1</text>
          <text x="328" y="245" font-size="8.5">SS400</text>
          <text x="268" y="261" font-size="8.5">DWG</text>
          <text x="328" y="261" font-size="8.5">REV.B</text>
        </g>
        <g class="cursor" data-cursor>
          <line x1="-16" y1="0" x2="16" y2="0" stroke="#1b5bd6" stroke-width="1"/>
          <line x1="0" y1="-16" x2="0" y2="16" stroke="#1b5bd6" stroke-width="1"/>
          <rect x="-4" y="-4" width="8" height="8" fill="none" stroke="#1b5bd6" stroke-width="1"/>
        </g>
        <text x="20" y="28" class="svg-mono" font-size="10" fill="#7a828b" letter-spacing="1.2">2D DRAWING ／ TOP</text>
      </svg>`,
      "vis-svg vis-zwcad"
    );
  }

  /* ---------- ZWCAD MFG: mechanical drawing + BOM ---------- */
  function mfg() {
    const id = "m" + ++uid;
    const L = (d, cls, extra) => `<path class="${cls || "ln"}" d="${d}" pathLength="1" ${extra || ""}/>`;
    let g = "";
    // stepped shaft (front view)
    g += L("M40 112H70V100H108V92H168V100H250V106H290V112H300V150H290V156H250V162H168V170H108V162H70V150H40Z");
    // bearings (standard parts) left & right
    g += L("M92 84H122V100H92ZM92 162H122V178H92Z", "ln std");
    g += L("M92 84L122 100M122 84L92 100M92 162L122 178M122 162L92 178", "ln std thin");
    g += L("M258 90H288V106H258ZM258 156H288V172H258Z", "ln std");
    g += L("M258 90L288 106M288 90L258 106M258 156L288 172M288 156L258 172", "ln std thin");
    // keyway
    g += L("M186 92V98H222V92", "ln thin");
    // center line
    g += L("M28 131H314", "cl");
    // balloons
    const balloons = [
      [60, 112, 58, 52, "1"],
      [204, 92, 204, 52, "2"],
      [107, 84, 134, 52, "3"],
      [232, 150, 330, 190, "4"]
    ];
    let b = "";
    balloons.forEach(([x1, y1, bx, by, n]) => {
      b += `<g class="bl"><path class="ln lead" d="M${x1} ${y1}L${bx} ${by + 11}" pathLength="1"/><circle cx="${x1}" cy="${y1}" r="2" fill="#1b5bd6"/>
        <circle cx="${bx}" cy="${by}" r="11" fill="#fff" stroke="#1b5bd6" stroke-width="1.1"/>
        <text x="${bx}" y="${by + 3.6}" text-anchor="middle" class="svg-mono" font-size="10" fill="#1b5bd6">${n}</text></g>`;
    });
    // BOM table
    const rows = [
      ["No", "品名", "規格", "数"],
      ["1", "シャフト", "S45C", "1"],
      ["2", "平行キー", "JIS", "1"],
      ["3", "玉軸受", "6204", "2"],
      ["4", "止め輪", "JIS", "1"]
    ];
    let t = `<rect x="20" y="198" width="266" height="72" fill="#fff" stroke="#9aa3ad" stroke-width=".8"/>`;
    rows.forEach((r, i) => {
      const yy = 198 + i * 14.4;
      if (i) t += `<line x1="20" y1="${yy}" x2="286" y2="${yy}" stroke="#d3d8dd" stroke-width=".8"/>`;
      const xs = [30, 60, 160, 262];
      r.forEach((c, j) => {
        t += `<text x="${xs[j]}" y="${yy + 10.4}" font-size="9" class="${j === 0 || j === 2 || j === 3 ? "svg-mono" : "svg-jp"}" fill="${i ? "#2a3038" : "#1b5bd6"}">${c}</text>`;
      });
    });
    t += `<line x1="52" y1="198" x2="52" y2="270" stroke="#d3d8dd" stroke-width=".8"/><line x1="152" y1="198" x2="152" y2="270" stroke="#d3d8dd" stroke-width=".8"/><line x1="254" y1="198" x2="254" y2="270" stroke="#d3d8dd" stroke-width=".8"/>`;
    return el(
      `<svg xmlns="${NS}" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet">
        ${defs(id)}
        <rect x="168" y="92" width="82" height="78" fill="url(#${id}-hatch)" opacity=".28"/>
        <g class="draw">${g}</g>
        ${b}
        <g class="bom">${t}<text x="296" y="210" class="svg-mono" font-size="9" fill="#7a828b">BOM</text><text x="296" y="222" class="svg-mono" font-size="8" fill="#9aa3ad">AUTO</text></g>
        <g class="rough" transform="translate(236 70)"><path d="M0 0L6 10L18 -12" fill="none" stroke="#4a5159" stroke-width=".9"/><text x="-4" y="-4" class="svg-mono" font-size="8" fill="#4a5159">Ra1.6</text></g>
        <text x="20" y="28" class="svg-mono" font-size="10" fill="#7a828b" letter-spacing="1.2">ASSY DRAWING ／ BOM</text>
      </svg>`,
      "vis-svg vis-mfg"
    );
  }

  /* ---------- final CTA background drawing ---------- */
  function ctaBg() {
    const L = (d, extra) => `<path d="${d}" pathLength="1" ${extra || ""}/>`;
    const circle = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
    let g = "";
    g += L(circle(1040, 250, 210));
    g += L(circle(1040, 250, 150));
    g += L(circle(1040, 250, 60));
    g += L("M760 250H1320M1040 -20V520", `class="cl"`);
    g += L("M-20 430H420L470 380H700", "");
    g += L("M120 60V360M120 60H360", "");
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2;
      g += `<circle cx="${f(1040 + 180 * Math.cos(a))}" cy="${f(250 + 180 * Math.sin(a))}" r="8"/>`;
    }
    return el(
      `<svg xmlns="${NS}" viewBox="0 0 1280 500" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor" stroke-width="1">${g}</svg>`,
      "cta-svg"
    );
  }

  window.OSC = window.OSC || {};
  window.OSC.visuals = {
    hero,
    zw3d,
    zwcad,
    "zwcad-mfg": mfg,
    ctaBg,
    rotateBracket
  };
})();
