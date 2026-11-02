// ─────────────────────────────────────────────────────────────
//  Pretty Petals — seasonal theme switch
//
//  To change the look of the customer site, edit ONE line:
//
//      ACTIVE_THEME = "november-harvest" → November fall: oranges, browns, dark reds
//      ACTIVE_THEME = "harvest-marigold" → Thanksgiving + Día de Muertos
//                                          (marigolds, papel picado, candlelight)
//      ACTIVE_THEME = "fall-dark"        → dark fall / Halloween look
//      ACTIVE_THEME = null               → normal pink Pretty Petals look
//
//  Then commit + push. Netlify rebuilds and the site switches.
//  Your source files (App.jsx, BouquetBuilder.jsx, CustomerPortal.jsx)
//  are never edited — colors are swapped only in the built site.
//  The admin dashboard is not affected.
// ─────────────────────────────────────────────────────────────

export const ACTIVE_THEME = "november-harvest";

// Files that get re-colored (customer-facing pages only)
const THEMED_FILES = /src\/(App|BouquetBuilder|CustomerPortal)\.jsx$/;

const THEMES = {
  "fall-dark": {
    themeColor: "#1D1418",
    logo: "/logo-fall-dark.svg",

    // Whole-value swaps (page backgrounds) — checked before per-color swaps
    literals: {
      "linear-gradient(160deg, #fff0f6 0%, #fce4ec 50%, #f8d7e8 100%)":
        "radial-gradient(ellipse at top, #2c1a21 0%, #1d1418 65%)",
      "linear-gradient(135deg, #fff0f6 0%, #fce4ec 40%, #f8bbd0 100%)":
        "radial-gradient(ellipse at top, #2c1a21 0%, #1d1418 65%)",
      "drop-shadow(0 4px 16px rgba(180,80,120,0.18))": "none",
    },

    // Backgrounds: cards, chips, buttons, panels
    bg: {
      "#ffffff": "#2a1d22",
      "#fafafa": "#241a1e",
      "#fff0f6": "#34232a", "#fff8fb": "#34232a", "#fdf8f5": "#34232a", "#fdf6f9": "#34232a",
      "#fce4ec": "#3d2830", "#f8e0eb": "#3d2830", "#f8d7e8": "#3d2830",
      "#f8bbd0": "#4a2e36",
      "#d4547a": "#b9581f",   // main accent → burnt orange
      "#c0396a": "#9e4316",
      "#8b3a5e": "#5e2a3a",
      "#2a0d1e": "#120b0e",
      "#e8b4c8": "#5a3e44",
      "#ffebee": "#3a1e22", "#e8f5e9": "#1f2e22", "#e0f2f1": "#1c2e2c",
      "#f3e5f5": "#2e2236", "#fff8e1": "#33291a", "#e3f2fd": "#1a2633",
      "#f4a7b9": "#e08a3c",   // current step in progress bars
      "#f0d0de": "#4a3238",   // empty step in progress bars
      "#e8a0b8": "#7a4a30",   // button while loading
    },

    // Text colors
    text: {
      "#8b3a5e": "#fbf1e8",   // headings / labels → cream
      "#b06080": "#e9c3ae",   // secondary text → soft peach
      "#d4547a": "#f0a35e",   // accent text → pumpkin orange
      "#c49aae": "#b0958c",   // muted
      "#5a2a3e": "#f3e6dc", "#3a1a2e": "#fbf1e8", "#2d3436": "#f3e6dc",
      "#f4a7b9": "#f0c9b5",
      "#c0392b": "#ff8a80", "#c62828": "#ff8a80",
      "#2e7d32": "#8bd69a", "#00695c": "#7fd6c8", "#6a1b9a": "#d7a6f0", "#1565c0": "#90c2ff",
    },

    // Borders and divider lines
    border: {
      "#f0d0de": "#4a3238",
      "#f4a7b9": "#6a4a4c",
      "#d4547a": "#e08a3c",
      "#f8e8f0": "#3a2a30",
      "#e8b4c8": "#5a3e44",
    },

    // rgba(...) swaps per role: [r,g,b] → [r,g,b, alphaMultiplier]
    rgba: {
      bg:     { "255,255,255": [42, 29, 34, 1], "58,26,46": [8, 5, 6, 1.3] },
      shadow: { "180,80,120": [0, 0, 0, 2], "212,84,122": [224, 138, 60, 1], "58,26,46": [0, 0, 0, 1.4] },
    },

    // Added to <head>: page base colors + form fields
    // (scoped to html.pp-themed, which is only set on customer pages, never /admin)
    css: `
      html.pp-themed, html.pp-themed body { background: #1D1418; color-scheme: dark; }
      html.pp-themed body { color: #FBF1E8; }
      html.pp-themed input, html.pp-themed textarea, html.pp-themed select { color: #FBF1E8; }
      html.pp-themed input::placeholder, html.pp-themed textarea::placeholder { color: #8C7570; opacity: 1; }
      html.pp-themed button { border-bottom: 1.5px solid #4A3238; }
      html.pp-themed #root { position: relative; z-index: 1; }
      .pp-leaves { display: none; }
      html.pp-themed .pp-leaves { display: block; position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
      .pp-leaves svg { position: absolute; top: -60px; opacity: .55; animation: pp-fall linear infinite; }
      @keyframes pp-fall {
        0%   { transform: translate3d(0, -60px, 0) rotate(0deg); }
        100% { transform: translate3d(60px, 110vh, 0) rotate(300deg); }
      }
      @media (prefers-reduced-motion: reduce) {
        .pp-leaves svg { animation: none; opacity: .35; }
        .pp-leaves svg:nth-child(odd)  { top: 30%; }
        .pp-leaves svg:nth-child(even) { top: 70%; }
      }
    `,

    // Added at the top of <body>: a few slow falling leaves behind the page
    bodyHtml: (() => {
      const leaf = (color) =>
        `<path d="M0,-14 L3,-6 L10,-9 L7,-2 L13,1 L5,3 L6,11 L0,6 L-6,11 L-5,3 L-13,1 L-7,-2 L-10,-9 L-3,-6 Z" fill="${color}"/>` +
        `<path d="M0,6 L0,16" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>`;
      const leaves = [
        ["4%", 34, "#C9652B", 19, 0], ["14%", 22, "#D9A441", 24, 6], ["26%", 28, "#A8432A", 21, 13],
        ["72%", 26, "#E08A3C", 23, 3], ["84%", 36, "#A8432A", 18, 10], ["94%", 22, "#D9A441", 26, 16],
      ];
      return `<div class="pp-leaves" aria-hidden="true">` +
        leaves.map(([left, size, color, dur, delay]) =>
          `<svg width="${size}" height="${size}" viewBox="-16 -16 32 34" style="left:${left};animation-duration:${dur}s;animation-delay:-${delay}s">${leaf(color)}</svg>`
        ).join("") + `</div>`;
    })(),
  },
  // ── November: Thanksgiving harvest × Día de Muertos marigolds ──
  "harvest-marigold": {
    themeColor: "#1A0F17",
    logo: "/logo-harvest-marigold.svg",

    // Page backgrounds go see-through so the candlelight glow, papel picado
    // and falling petals (drawn on <body>) show behind the cards.
    literals: {
      "linear-gradient(160deg, #fff0f6 0%, #fce4ec 50%, #f8d7e8 100%)": "transparent",
      "linear-gradient(135deg, #fff0f6 0%, #fce4ec 40%, #f8bbd0 100%)": "transparent",
      "drop-shadow(0 4px 16px rgba(180,80,120,0.18))": "drop-shadow(0 0 22px rgba(242,159,5,0.22))",
    },

    bg: {
      "#ffffff": "#2A1823",
      "#fafafa": "#24141E",
      "#fff0f6": "#33202B", "#fff8fb": "#33202B", "#fdf8f5": "#33202B", "#fdf6f9": "#33202B",
      "#fce4ec": "#3D2532", "#f8e0eb": "#3D2532", "#f8d7e8": "#3D2532",
      "#f8bbd0": "#4C2D3C",
      "#d4547a": "#C8580E",   // main accent → marigold / burnt orange
      "#c0396a": "#A8440A",
      "#8b3a5e": "#6B2A4A",   // deep plum (Día de Muertos night)
      "#2a0d1e": "#12090F",
      "#e8b4c8": "#5E3B4A",
      "#ffebee": "#3A1E24", "#e8f5e9": "#1F2E22", "#e0f2f1": "#1C2E2C",
      "#f3e5f5": "#2E2236", "#fff8e1": "#33291A", "#e3f2fd": "#1A2633",
      "#f4a7b9": "#F29F05",   // current step in progress bars → marigold
      "#f0d0de": "#4A2E3B",   // empty step in progress bars
      "#e8a0b8": "#7A4A2A",   // button while loading
    },

    text: {
      "#8b3a5e": "#FFF4E2",   // headings / labels → candle cream
      "#b06080": "#F2C9A0",   // secondary text → soft apricot
      "#d4547a": "#F6A623",   // accent text → marigold
      "#c49aae": "#B59A93",   // muted
      "#5a2a3e": "#F7EADB", "#3a1a2e": "#FFF4E2", "#2d3436": "#F7EADB",
      "#f4a7b9": "#F5A9C4",   // keeps a touch of Pretty Petals pink
      "#c0392b": "#FF8A80", "#c62828": "#FF8A80",
      "#2e7d32": "#8BD69A", "#00695c": "#7FD6C8", "#6a1b9a": "#D7A6F0", "#1565c0": "#90C2FF",
    },

    border: {
      "#f0d0de": "#4A2E3B",
      "#f4a7b9": "#6E4452",
      "#d4547a": "#F29F05",
      "#f8e8f0": "#3A2430",
      "#e8b4c8": "#5E3B4A",
    },

    rgba: {
      bg:     { "255,255,255": [42, 24, 35, 1], "58,26,46": [10, 5, 8, 1.3] },
      shadow: { "180,80,120": [0, 0, 0, 2], "212,84,122": [242, 159, 5, 1], "58,26,46": [0, 0, 0, 1.4] },
    },

    css: `
      html.pp-themed, html.pp-themed body { background: #1A0F17; color-scheme: dark; }
      html.pp-themed body { color: #FFF4E2; margin: 0; }
      html.pp-themed input, html.pp-themed textarea, html.pp-themed select { color: #FFF4E2; }
      html.pp-themed input::placeholder, html.pp-themed textarea::placeholder { color: #8F7680; opacity: 1; }
      html.pp-themed button { border-bottom: 1.5px solid #4A2E3B; }
      html.pp-themed #root { position: relative; z-index: 1; }

      .pp-glow, .pp-picado, .pp-petals { display: none; }

      /* candlelight glow behind everything */
      html.pp-themed .pp-glow { display: block; position: fixed; inset: 0; z-index: 0; pointer-events: none;
        background:
          radial-gradient(ellipse 70% 45% at 50% -8%, rgba(242,159,5,.20), transparent 70%),
          radial-gradient(ellipse 60% 40% at 0% 105%, rgba(224,69,123,.13), transparent 70%),
          radial-gradient(ellipse 60% 40% at 100% 105%, rgba(123,63,160,.16), transparent 70%); }

      /* papel picado banner across the top */
      html.pp-themed .pp-picado { display: block; position: relative; z-index: 2; pointer-events: none; line-height: 0; }
      .pp-picado svg { width: 100%; max-width: 1400px; margin: 0 auto; height: auto; display: block; filter: drop-shadow(0 3px 4px rgba(0,0,0,.35)); }
      .pp-picado .pp-flag { transform-origin: 50% 0; animation: pp-sway 5s ease-in-out infinite; }
      .pp-picado .pp-wide { display: block; } .pp-picado .pp-narrow { display: none; }
      @media (max-width: 640px) { .pp-picado .pp-wide { display: none; } .pp-picado .pp-narrow { display: block; } }
      @keyframes pp-sway { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }

      /* falling marigold petals */
      html.pp-themed .pp-petals { display: block; position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
      .pp-petals svg { position: absolute; top: -40px; opacity: .8; animation: pp-drift linear infinite; }
      @keyframes pp-drift {
        0%   { transform: translate3d(0, -40px, 0) rotate(0deg); }
        50%  { transform: translate3d(-30px, 55vh, 0) rotate(160deg); }
        100% { transform: translate3d(40px, 110vh, 0) rotate(340deg); }
      }
      @media (prefers-reduced-motion: reduce) {
        .pp-picado .pp-flag { animation: none; }
        .pp-petals svg { animation: none; opacity: .45; }
        .pp-petals svg:nth-child(odd)  { top: 35%; }
        .pp-petals svg:nth-child(even) { top: 72%; }
      }
    `,

    bodyHtml: (() => {
      // Papel picado: cut-paper flags on a string. Center flags spell GRACIAS.
      const COLORS = ["#E0457B", "#F29F05", "#7B3FA0", "#17A398", "#E85D04"];
      const W = 56, H = 66, GAP = 8;
      const cutouts = (k) => {
        // little cut patterns: flower, diamonds, dots
        const flower = Array.from({ length: 6 }, (_, i) =>
          `<ellipse cx="28" cy="28" rx="4" ry="8" transform="rotate(${i * 60} 28 36) translate(0 0)" fill="black"/>`).join("") +
          `<circle cx="28" cy="36" r="4" fill="white"/>`;
        const diamonds = `<path d="M28 20 L36 34 L28 48 L20 34 Z" fill="black"/><path d="M28 27 L32 34 L28 41 L24 34 Z" fill="white"/>`;
        const dots = [12, 22, 34, 44].map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 26 : 40}" r="3.6" fill="black"/>`).join("");
        return [flower, diamonds, dots][k % 3];
      };
      const border = `<g fill="black">${[10, 18, 26, 34, 42].map(x => `<circle cx="${x + 2}" cy="12" r="1.8"/>`).join("")}</g>`;
      const flag = (i, x, letter, id) => {
        const c = COLORS[i % COLORS.length];
        const zig = Array.from({ length: 8 }, (_, j) => `L${W - j * 7 - 3.5},${H} L${W - (j + 1) * 7},${H - 6}`).join(" ");
        const cut = letter
          ? `<text x="28" y="47" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="30" fill="black">${letter}</text>`
          : cutouts(i);
        return `<g transform="translate(${x},12)"><g class="pp-flag" style="animation-delay:-${(i * 0.37) % 5}s">` +
          `<mask id="${id}"><rect width="${W}" height="${H}" fill="white"/>${border}${cut}</mask>` +
          `<path d="M0,0 L${W},0 L${W},${H - 6} ${zig} L0,${H - 6} Z" fill="${c}" mask="url(#${id})"/>` +
          `</g></g>`;
      };
      const banner = (cls, letters, pad) => {
        const n = letters.length + pad * 2;
        const width = n * (W + GAP) + GAP;
        const flags = Array.from({ length: n }, (_, i) => {
          const L = i >= pad && i < pad + letters.length ? letters[i - pad] : null;
          return flag(i, GAP + i * (W + GAP), L, `pp-${cls}-${i}`);
        }).join("");
        return `<svg class="${cls}" viewBox="0 0 ${width} ${H + 20}" preserveAspectRatio="xMidYMin meet" role="img" aria-label="Gracias">` +
          `<path d="M0,12 Q${width / 2},17 ${width},12" stroke="#C9A27A" stroke-width="1.6" fill="none"/>${flags}</svg>`;
      };

      // Falling petals + a few whole marigolds
      const petal = (c) => `<ellipse cx="0" cy="0" rx="4.5" ry="8" fill="${c}"/><path d="M0,-6 L0,6" stroke="rgba(0,0,0,.18)" stroke-width="1"/>`;
      const bloom = () => [["#D9620B", 10, 4.6], ["#EE8410", 7.5, 4], ["#FFC53D", 4, 3]]
        .map(([c, r, w]) => Array.from({ length: 12 }, (_, i) =>
          `<ellipse cx="0" cy="-${r}" rx="${w * 0.6}" ry="${w}" fill="${c}" transform="rotate(${i * 30 + r * 3})"/>`).join("")).join("") +
        `<circle r="2.4" fill="#B04A08"/>`;
      const items = [
        ["3%", 16, "p", "#F29F05", 17, 0], ["9%", 30, "b", "", 24, 9], ["17%", 14, "p", "#E0457B", 20, 4],
        ["24%", 18, "p", "#EE8410", 26, 14], ["78%", 16, "p", "#F7A21B", 19, 2], ["85%", 28, "b", "", 27, 12],
        ["91%", 14, "p", "#E0457B", 22, 7], ["97%", 18, "p", "#F29F05", 18, 16], ["50%", 12, "p", "#FFC53D", 30, 20],
      ];
      const petals = items.map(([left, size, kind, c, dur, delay]) =>
        `<svg width="${size}" height="${size}" viewBox="-14 -14 28 28" style="left:${left};animation-duration:${dur}s;animation-delay:-${delay}s">${kind === "b" ? bloom() : petal(c)}</svg>`
      ).join("");

      return `<div class="pp-glow" aria-hidden="true"></div>` +
        `<div class="pp-petals" aria-hidden="true">${petals}</div>` +
        `<div class="pp-picado">${banner("pp-wide", "GRACIAS", 5)}${banner("pp-narrow", "GRACIAS", 0)}</div>`;
    })(),
  },
  // ── November fall: burnt orange, browns, dark reds ──
  "november-harvest": {
    themeColor: "#1C120D",
    logo: "/logo-november-harvest.svg",

    // Page backgrounds go see-through so the warm glow, leaf garland
    // and falling leaves (drawn on <body>) show behind the cards.
    literals: {
      "linear-gradient(160deg, #fff0f6 0%, #fce4ec 50%, #f8d7e8 100%)": "transparent",
      "linear-gradient(135deg, #fff0f6 0%, #fce4ec 40%, #f8bbd0 100%)": "transparent",
      "drop-shadow(0 4px 16px rgba(180,80,120,0.18))": "drop-shadow(0 0 22px rgba(217,142,43,0.18))",
    },

    bg: {
      "#ffffff": "#2A1C15",
      "#fafafa": "#241811",
      "#fff0f6": "#33231A", "#fff8fb": "#33231A", "#fdf8f5": "#33231A", "#fdf6f9": "#33231A",
      "#fce4ec": "#3D2A1F", "#f8e0eb": "#3D2A1F", "#f8d7e8": "#3D2A1F",
      "#f8bbd0": "#4C3324",
      "#d4547a": "#B8501A",   // main accent → burnt orange
      "#c0396a": "#93391A",
      "#8b3a5e": "#7A2A1E",   // deep cranberry red
      "#2a0d1e": "#120B07",
      "#e8b4c8": "#5E4030",
      "#ffebee": "#3A1E1A", "#e8f5e9": "#232B1C", "#e0f2f1": "#1F2A24",
      "#f3e5f5": "#2E2228", "#fff8e1": "#33291A", "#e3f2fd": "#1E2630",
      "#f4a7b9": "#D98E2B",   // current step in progress bars → amber
      "#f0d0de": "#4A3326",   // empty step in progress bars
      "#e8a0b8": "#7A4A2A",   // button while loading
    },

    text: {
      "#8b3a5e": "#FBEBD7",   // headings / labels → cream
      "#b06080": "#E6B98C",   // secondary text → wheat
      "#d4547a": "#E8913A",   // accent text → pumpkin orange
      "#c49aae": "#A89080",   // muted
      "#5a2a3e": "#F3E2CE", "#3a1a2e": "#FBEBD7", "#2d3436": "#F3E2CE",
      "#f4a7b9": "#E8A86A",
      "#c0392b": "#FF8A70", "#c62828": "#FF8A70",
      "#2e7d32": "#A8C77A", "#00695c": "#8CC7B0", "#6a1b9a": "#D9A6C0", "#1565c0": "#9CC0E8",
    },

    border: {
      "#f0d0de": "#4A3326",
      "#f4a7b9": "#6E4A36",
      "#d4547a": "#D98E2B",
      "#f8e8f0": "#3A2A20",
      "#e8b4c8": "#5E4030",
    },

    rgba: {
      bg:     { "255,255,255": [42, 28, 21, 1], "58,26,46": [10, 6, 4, 1.3] },
      shadow: { "180,80,120": [0, 0, 0, 2], "212,84,122": [217, 142, 43, 1], "58,26,46": [0, 0, 0, 1.4] },
    },

    css: `
      html.pp-themed, html.pp-themed body { background: #1C120D; color-scheme: dark; }
      html.pp-themed body { color: #FBEBD7; margin: 0; }
      html.pp-themed input, html.pp-themed textarea, html.pp-themed select { color: #FBEBD7; }
      html.pp-themed input::placeholder, html.pp-themed textarea::placeholder { color: #8C7566; opacity: 1; }
      html.pp-themed button { border-bottom: 1.5px solid #4A3326; }
      html.pp-themed #root { position: relative; z-index: 1; }

      .pp-glow, .pp-garland, .pp-leaves { display: none; }

      /* warm harvest glow behind everything */
      html.pp-themed .pp-glow { display: block; position: fixed; inset: 0; z-index: 0; pointer-events: none;
        background:
          radial-gradient(ellipse 70% 45% at 50% -8%, rgba(217,142,43,.18), transparent 70%),
          radial-gradient(ellipse 60% 40% at 0% 105%, rgba(142,42,30,.20), transparent 70%),
          radial-gradient(ellipse 60% 40% at 100% 105%, rgba(184,80,26,.16), transparent 70%); }

      /* leaf garland across the top */
      html.pp-themed .pp-garland { display: block; position: relative; z-index: 2; pointer-events: none; line-height: 0; }
      .pp-garland svg { width: 100%; max-width: 1400px; margin: 0 auto; height: auto; display: block; filter: drop-shadow(0 3px 4px rgba(0,0,0,.35)); }
      .pp-garland .pp-sway { transform-box: fill-box; transform-origin: 50% 0; animation: pp-sway 6s ease-in-out infinite; }
      .pp-garland .pp-wide { display: block; } .pp-garland .pp-narrow { display: none; }
      @media (max-width: 640px) { .pp-garland .pp-wide { display: none; } .pp-garland .pp-narrow { display: block; } }
      @keyframes pp-sway { 0%,100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }

      /* falling leaves */
      html.pp-themed .pp-leaves { display: block; position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
      .pp-leaves svg { position: absolute; top: -50px; opacity: .75; animation: pp-drift linear infinite; }
      @keyframes pp-drift {
        0%   { transform: translate3d(0, -50px, 0) rotate(0deg); }
        50%  { transform: translate3d(-35px, 55vh, 0) rotate(170deg); }
        100% { transform: translate3d(45px, 110vh, 0) rotate(340deg); }
      }
      @media (prefers-reduced-motion: reduce) {
        .pp-garland .pp-sway { animation: none; }
        .pp-leaves svg { animation: none; opacity: .4; }
        .pp-leaves svg:nth-child(odd)  { top: 35%; }
        .pp-leaves svg:nth-child(even) { top: 72%; }
      }
    `,

    bodyHtml: (() => {
      const LEAF_COLORS = ["#B8501A", "#8E2A1E", "#D98E2B", "#7A4A2A", "#A3271C", "#C9652B"];
      const maple = (c) =>
        `<path d="M0,-14 L3,-6 L10,-9 L7,-2 L13,1 L5,3 L6,11 L0,6 L-6,11 L-5,3 L-13,1 L-7,-2 L-10,-9 L-3,-6 Z" fill="${c}"/>` +
        `<path d="M0,6 L0,16" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>`;
      const oak = (c) =>
        `<path d="M0,-15 C4,-13 2,-9 6,-8 C10,-7 7,-3 9,-1 C12,2 7,4 7,7 C7,11 2,10 0,14 C-2,10 -7,11 -7,7 C-7,4 -12,2 -9,-1 C-7,-3 -10,-7 -6,-8 C-2,-9 -4,-13 0,-15 Z" fill="${c}"/>` +
        `<path d="M0,-10 L0,18" stroke="rgba(0,0,0,.25)" stroke-width="1.2"/>`;
      const mum = () => [["#B8481A", 9, 4.2], ["#D4682A", 6.5, 3.6], ["#F2B45C", 3.5, 2.6]]
        .map(([c, r, w]) => Array.from({ length: 12 }, (_, i) =>
          `<ellipse cx="0" cy="-${r}" rx="${w * 0.6}" ry="${w}" fill="${c}" transform="rotate(${i * 30 + r * 3})"/>`).join("")).join("") +
        `<circle r="2.2" fill="#7A3410"/>`;

      // Garland: a twine line with leaves (and a few mums) hanging off it
      const garland = (cls, n) => {
        const step = 46, width = n * step + 20, sag = Math.min(18, width * 0.015);
        const yAt = (x) => 10 + sag * Math.sin(Math.PI * x / width);
        const items = Array.from({ length: n }, (_, i) => {
          const x = 20 + i * step + (i % 2 ? 6 : 0), y = yAt(x);
          const c = LEAF_COLORS[(i * 5) % LEAF_COLORS.length];
          const isMum = i % 5 === 2;
          const shape = isMum ? mum() : (i % 2 ? oak(c) : maple(c));
          const rot = ((i * 37) % 50) - 25;
          const s = isMum ? 1.15 : 1.25 + ((i * 13) % 5) / 20;
          return `<g transform="translate(${x},${y + (isMum ? 10 : 16)})"><g class="pp-sway" style="animation-delay:-${(i * 0.53) % 6}s">` +
            `<g transform="rotate(${isMum ? 0 : rot + 180}) scale(${s})">${shape}</g></g></g>`;
        }).join("");
        return `<svg class="${cls}" viewBox="0 0 ${width} ${sag + 46}" preserveAspectRatio="xMidYMin meet" aria-hidden="true">` +
          `<path d="M0,10 Q${width / 2},${10 + sag * 2} ${width},10" stroke="#9C7A55" stroke-width="2" fill="none"/>${items}</svg>`;
      };

      const fall = [
        ["3%", 26, "m", 0, 18, 0], ["9%", 30, "o", 1, 24, 9], ["17%", 22, "m", 4, 20, 4], ["24%", 24, "u", 0, 27, 14],
        ["76%", 24, "o", 2, 19, 2], ["84%", 30, "m", 1, 26, 12], ["91%", 22, "o", 4, 22, 7], ["97%", 26, "m", 3, 18, 16],
        ["50%", 20, "m", 5, 30, 20],
      ];
      const leaves = fall.map(([left, size, kind, ci, dur, delay]) => {
        const c = LEAF_COLORS[ci];
        const body = kind === "u" ? mum() : kind === "o" ? oak(c) : maple(c);
        return `<svg width="${size}" height="${size}" viewBox="-16 -16 32 34" style="left:${left};animation-duration:${dur}s;animation-delay:-${delay}s">${body}</svg>`;
      }).join("");

      return `<div class="pp-glow" aria-hidden="true"></div>` +
        `<div class="pp-leaves" aria-hidden="true">${leaves}</div>` +
        `<div class="pp-garland" aria-hidden="true">${garland("pp-wide", 28)}${garland("pp-narrow", 9)}</div>`;
    })(),
  },
};

// ── plugin internals (no need to touch) ──────────────────────

const ROLE_KEYS = {
  bg: /^(background|backgroundColor|backgroundImage)$/,
  text: /^(color|fill|stroke|caretColor|accentColor|textDecorationColor)$/,
  border: /^(border|borderTop|borderBottom|borderLeft|borderRight|borderColor|outline|outlineColor)$/,
  shadow: /^(boxShadow|textShadow|filter)$/,
};

const LOGO_DATA_URI = /data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAACeoAAAOr[A-Za-z0-9+/=]+/;

function normHex(h) {
  h = h.toLowerCase();
  return h.length === 4 ? "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3] : h;
}

// Find which style property a string literal belongs to by looking back
// from its opening quote for the nearest `key:` in the same expression.
function roleFor(code, start) {
  const before = code.slice(Math.max(0, start - 400), start);
  const stripped = before.replace(/"[^"\n]*"/g, '""');
  const re = /([A-Za-z]+)\s*:(?!:)/g;
  let m, last = null;
  while ((m = re.exec(stripped))) last = m;
  if (!last) return null;
  const between = stripped.slice(last.index + last[0].length).replace(/\$\{/g, "");
  if (/[,;{}]/.test(between)) return null;
  // Skip data lists like { name: "Blush Pink", color: "#f4a7b9" } (ribbon swatches etc.)
  const objStart = stripped.lastIndexOf("{");
  if (objStart !== -1 && /\bname\s*:/.test(stripped.slice(objStart))) return null;
  for (const [role, keyRe] of Object.entries(ROLE_KEYS)) if (keyRe.test(last[1])) return role;
  return null;
}

function recolor(value, role, t) {
  if (t.literals[value] !== undefined) return t.literals[value];
  let out = value;
  if (role === "bg" && /^\s*white\s*$/.test(out)) return t.bg["#ffffff"];
  const map = role === "border" ? t.border : role === "text" ? t.text : role === "bg" ? t.bg : null;
  if (map) {
    out = out.replace(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g, (h) => map[normHex(h)] ?? h);
    if (role === "bg") out = out.replace(/\bwhite\b/g, t.bg["#ffffff"]);
  }
  const rmap = t.rgba[role];
  if (rmap) {
    out = out.replace(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/g, (all, r, g, b, a) => {
      const hit = rmap[`${r},${g},${b}`];
      if (!hit) return all;
      const alpha = Math.min(1, +a * hit[3]);
      return `rgba(${hit[0]},${hit[1]},${hit[2]},${+alpha.toFixed(3)})`;
    });
  }
  return out;
}

function themeSource(code, t) {
  code = code.replace(LOGO_DATA_URI, t.logo);

  // Template literals first (they can hold ternaries with inner "strings")
  const tplRanges = [];
  code = code.replace(/`[^`]*`/g, (lit, offset) => {
    tplRanges.push([offset, offset + lit.length]);
    const role = roleFor(code, offset);
    if (!role) return lit;
    return lit.replace(/"([^"\n]*)"/g, (s, v) => `"${recolor(v, role, t)}"`)
              .replace(/^`([^$`]*)/, (s, v) => "`" + recolor(v, role, t));
  });

  // Then ordinary "double-quoted" values
  return code.replace(/"([^"\n]*)"/g, (lit, value, offset) => {
    if (tplRanges.some(([a, b]) => offset > a && offset < b)) return lit;
    if (!/#[0-9a-fA-F]{3,6}\b|rgba\(|\bwhite\b|gradient|drop-shadow/.test(value)) return lit;
    const role = roleFor(code, offset);
    if (!role) return lit;
    return `"${recolor(value, role, t)}"`;
  });
}

export default function seasonalTheme() {
  const t = ACTIVE_THEME ? THEMES[ACTIVE_THEME] : null;
  return {
    name: "pretty-petals-seasonal-theme",
    enforce: "pre",
    transform(code, id) {
      if (!t || !THEMED_FILES.test(id.split("?")[0])) return null;
      return { code: themeSource(code, t), map: null };
    },
    transformIndexHtml(html, ctx) {
      if (!t) return html;
      return html
        .replace(/<meta name="theme-color" content="[^"]*"\s*\/?>/, `<meta name="theme-color" content="${t.themeColor}" />`)
        .replace("</head>",
          `<style id="seasonal-theme">${t.css}</style>\n` +
          `<script>if(!window.__PRETTY_PETALS_ADMIN__&&location.hash.indexOf("#admin")!==0)document.documentElement.classList.add("pp-themed");</script>\n</head>`)
        .replace(/<body>/, `<body>\n${t.bodyHtml}`);
    },
  };
}
