// ─────────────────────────────────────────────────────────────
//  Pretty Petals — seasonal theme switch
//
//  To change the look of the customer site, edit ONE line:
//
//      ACTIVE_THEME = "fall-dark"   → dark fall / Halloween look
//      ACTIVE_THEME = null          → normal pink Pretty Petals look
//
//  Then commit + push. Netlify rebuilds and the site switches.
//  Your source files (App.jsx, BouquetBuilder.jsx, CustomerPortal.jsx)
//  are never edited — colors are swapped only in the built site.
//  The admin dashboard is not affected.
// ─────────────────────────────────────────────────────────────

export const ACTIVE_THEME = "fall-dark";

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
