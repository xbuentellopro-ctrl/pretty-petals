import { useState, useEffect } from "react";
const getFlowerFallback = (name, desc) => {
  const text = ((name || "") + " " + (desc || "")).toLowerCase();
  const fileMap = {
    "rose": "roses.jpg", "roses": "roses.jpg", "sunflower": "sunflower.jpg",
    "tulip": "tulips.jpg", "tulips": "tulips.jpg", "peony": "peonies.jpg",
    "peonies": "peonies.jpg", "orchid": "orchid.jpg", "dahlia": "dahlia.jpg",
    "gerbera": "gerbera.jpg", "hydrangea": "hydrangea.jpg",
    "ranunculus": "ranunculus.jpg", "carnation": "carnation-supreme.jpg",
    "snapdragon": "snapdragon.jpg", "poppies": "poppies.jpg", "poppy": "poppies.jpg",
    "lily": "rose-lily.jpg", "lilies": "rose-lily.jpg",
    "eucalyptus": "seeded-eucalyptus.jpg", "baby breath": "babys-breath.jpg",
    "spray rose": "spray-roses.jpg", "stock": "stock.jpg",
    "veronica": "veronica.jpg", "dianthus": "dianthus-sweet.jpg",
    "hipericum": "hipericum.jpg", "limonium": "limonium.jpg",
    "solidago": "solidago.jpg", "monstera": "monstera.jpg", "palma": "palma.jpg",
    "craspedias": "craspedias.jpg", "campanula": "campanula.jpg",
    "wax flower": "wax-flowers.jpg", "delphinium": "delphinium.jpg",
    "leather": "leather-leaf.jpg", "ruscus": "italian-ruscus.jpg",
    "pompon": "cushion-pompons.jpg", "silver dollar": "silver-dollar-eucalyptus.jpg",
    "mini carnation": "mini-carnation.jpg",
  };
  for (const key of Object.keys(fileMap)) {
    if (text.includes(key)) return "/flowers/" + fileMap[key];
  }
  return "/flowers/roses.jpg";
};


const ROSE_BOUQUET_SIZES = ["12", "25", "36", "50", "75", "100", "150", "200", "Custom (200+)"];

const BASIC_COLORS = ["Red", "Pink", "Hot Pink", "White", "Light Pink", "Lavender", "Peach", "Orange", "Yellow", "Purple", "Coral", "Burgundy", "Blush", "Tinted", "Bicolor"];
const SIMPLE_COLORS = ["Red", "White", "Pink", "Yellow"];

const PRIMARY_FLOWERS = [
  { name: "Roses", photo: "/flowers/roses.jpg", emoji: "🌹", desc: "Classic & romantic", colors: ["Red", "Pink", "Hot Pink", "White", "Super White", "Light Pink", "Lavender", "Peach", "Orange", "Yellow", "Bicolor", "Garden", "Tinted", "Glitter Tinted"] },
  { name: "Peonies", photo: "/flowers/peonies.jpg", emoji: "🌸", desc: "Full & lush blooms", colors: ["Assorted Colors"] },
  { name: "Ranunculus", photo: "/flowers/ranunculus.jpg", emoji: "🌺", desc: "Delicate layered petals", colors: ["Assorted Colors"] },
  { name: "Tulips", photo: "/flowers/tulips.jpg", emoji: "🌷", desc: "Elegant & sleek", colors: ["Assorted Colors"] },
  { name: "Hydrangea", photo: "/flowers/hydrangea.jpg", emoji: "💐", desc: "Full & voluminous", colors: ["White", "Pink", "Light Blue", "Lavender", "Emerald Green", "Natural Colors"] },
  { name: "Sunflower", photo: "/flowers/sunflower.jpg", emoji: "🌻", desc: "Bright & cheerful", colors: ["Yellow"] },
  { name: "Lily Oriental", photo: "/flowers/lily-oriental.jpg", emoji: "🌼", desc: "Fragrant & bold", colors: ["Assorted Colors"] },
  { name: "Rose Lily", photo: "/flowers/rose-lily.jpg", emoji: "🌸", desc: "Soft & romantic", colors: ["Assorted Colors"] },
  { name: "Orchid", photo: "/flowers/orchid.jpg", emoji: "🪷", desc: "Exotic & elegant", colors: ["White", "Pink", "Purple"] },
  { name: "Dahlia", photo: "/flowers/dahlia.jpg", emoji: "🌺", desc: "Rich & dramatic", colors: ["Assorted Colors"] },
  { name: "Gerbera", photo: "/flowers/gerbera.jpg", emoji: "🌼", desc: "Cheerful & colorful", colors: ["Assorted Colors"] },
];

const SECONDARY_FLOWERS = [
  { name: "Spray Roses", photo: "/flowers/spray-roses.jpg", emoji: "🌹", desc: "Petite rose clusters", colors: ["Red", "Pink", "Hot Pink", "White", "Lavender", "Peach", "Yellow", "Coral"] },
  { name: "Carnation Supreme", photo: "/flowers/carnation-supreme.jpg", emoji: "🌸", desc: "Full & ruffled", colors: ["Assorted Colors"] },
  { name: "Mini Carnation", photo: "/flowers/mini-carnation.jpg", emoji: "🌼", desc: "Delicate & sweet", colors: ["Assorted Colors"] },
  { name: "Snapdragon", photo: "/flowers/snapdragon.jpg", emoji: "🌺", desc: "Tall & dramatic", colors: ["Assorted Colors"] },
  { name: "Delphinium", photo: "/flowers/delphinium.jpg", emoji: "💜", desc: "Airy & elevated", colors: ["White", "Pink", "Lavender", "Purple", "Blue"] },
  { name: "Stock", photo: "/flowers/stock.jpg", emoji: "🌸", desc: "Fragrant spikes", colors: ["Assorted Colors"] },
  { name: "Campanula", photo: "/flowers/campanula.jpg", emoji: "🔔", desc: "Bell-shaped blooms", colors: ["Assorted Colors"] },
  { name: "Wax Flowers", photo: "/flowers/wax-flowers.jpg", emoji: "🌸", desc: "Delicate filler", colors: ["Assorted Colors"] },
  { name: "Dianthus Sweet", photo: "/flowers/dianthus-sweet.jpg", emoji: "🌸", desc: "Sweet & spicy", colors: ["Assorted Colors"] },
  { name: "Poppies", photo: "/flowers/poppies.jpg", emoji: "🌺", desc: "Wispy & romantic", colors: ["Assorted Colors"] },
  { name: "Craspedias", photo: "/flowers/craspedias.jpg", emoji: "🟡", desc: "Golden button blooms", colors: ["Yellow"] },
];

const GREENERY = [
  { name: "Baby's Breath", photo: "/flowers/babys-breath.jpg", emoji: "🤍", desc: "Classic cloud filler" },
  { name: "Baby Blue Eucalyptus", photo: "/flowers/baby-blue-eucalyptus.jpg", emoji: "🌿", desc: "Silvery & aromatic" },
  { name: "Seeded Eucalyptus", photo: "/flowers/seeded-eucalyptus.jpg", emoji: "🌿", desc: "Textured & natural" },
  { name: "Italian Ruscus", photo: "/flowers/italian-ruscus.jpg", emoji: "🍃", desc: "Deep glossy green" },
  { name: "Israeli Ruscus", photo: "/flowers/israeli-ruscus.jpg", emoji: "🍃", desc: "Light bright green" },
  { name: "Leather-Leaf", photo: "/flowers/leather-leaf.jpg", emoji: "🌿", desc: "Sturdy base green" },
  { name: "Monstera", photo: "/flowers/monstera.jpg", emoji: "🌱", desc: "Dramatic split leaf" },
  { name: "Bells of Ireland", photo: "/flowers/bells-of-ireland.jpg", emoji: "🔔", desc: "Lucky green spikes" },
  { name: "Dusty Miller", photo: "/flowers/dusty-miller.jpg", emoji: "🩶", desc: "Silvery gray texture" },
  { name: "Veronica", photo: "/flowers/veronica.jpg", emoji: "🌿", desc: "Tall feathery spikes" },
  { name: "Limonium", photo: "/flowers/limonium.jpg", emoji: "💜", desc: "Delicate purple filler" },
  { name: "Solidago", photo: "/flowers/solidago.jpg", emoji: "💛", desc: "Golden yellow filler" },
  { name: "Hipericum", photo: "/flowers/hipericum.jpg", emoji: "🫐", desc: "Berry accent stems" },
  { name: "Cushion Pompons", photo: "/flowers/cushion-pompons.jpg", emoji: "🌸", desc: "Round pom blooms" },
];

const ADD_ONS = [
  { name: "Ribbons", emoji: "🎀", desc: "Satin or organza" },
  { name: "Butterflies", emoji: "🦋", desc: "Decorative butterflies" },
  { name: "Diamond Pins", emoji: "💎", desc: "Crystal accents" },
  { name: "Pearl Bow Beads", emoji: "🤍", desc: "Elegant pearl details" },
  { name: "Toppers", emoji: "⭐", desc: "Specialty toppers" },
  { name: "Custom Cutouts", emoji: "✂️", desc: "Personalized shapes" },
  { name: "Newspaper Wrap", emoji: "📰", desc: "Vintage style wrap" },
  { name: "Chocolates", emoji: "🍫", desc: "Sweet addition" },
  { name: "Pictures", emoji: "🖼️", desc: "Photo keepsake" },
  { name: "Custom Add-On", emoji: "✨", desc: "Your special request" },
];

const PAPER_WRAP_OPTIONS = ["White", "Black", "Pink", "Red", "Kraft Brown", "Blush", "Sage Green", "Lavender", "Gold", "Silver", "Designer Print", "Floral Print", "Marble Print", "Geometric Print", "Custom Special Print"];
const FUNERAL_OPTIONS = ["Cross", "Heart", "Reef / Wreath", "Special Arrangement"];
const ARRANGEMENT_STYLES = [
  { name: "Round Bouquet Wrap", emoji: "💐", desc: "Classic hand-tied round shape" },
  { name: "Flat Bouquet Wrap", emoji: "🎁", desc: "Modern flat-front presentation wrap" },
  { name: "Vase", emoji: "🏺", desc: "Ready to display" },
  { name: "Funeral Arrangement", emoji: "🕊️", desc: "Respectful tribute" },
  { name: "Special Event", emoji: "🎊", desc: "Requires consultation" },
];

const RIBBON_COLORS = [
  { name: "Blush Pink", color: "#f4a7b9" },
  { name: "Red", color: "#c0392b" },
  { name: "White", color: "#f8f9fa" },
  { name: "Gold", color: "#f9ca24" },
  { name: "Silver", color: "#b2bec3" },
  { name: "Black", color: "#2d3436" },
  { name: "Purple", color: "#9b59b6" },
  { name: "Blue", color: "#3498db" },
  { name: "Emerald", color: "#27ae60" },
  { name: "Champagne", color: "#f8e1b0" },
  { name: "No Ribbon", color: "transparent" },
];

const FloralDivider = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "8px 0" }}>
    <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #e8b4c8)" }} />
    <span style={{ fontSize: "18px", opacity: 0.6 }}>✿</span>
    <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, #e8b4c8)" }} />
  </div>
);

function SelectionGrid({ items, selected, onToggle, maxSelect, label, colorSelections, onColorChange, stemSelections, onStemChange, pricing = {}, isHoliday = false, roseTiers = [], isRoseHoliday = false }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <p style={{ margin: 0, fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
        <p style={{ margin: 0, fontSize: "11px", color: selected.length >= maxSelect ? "#d4547a" : "#c49aae", fontFamily: "Montserrat, sans-serif" }}>
          {selected.length}/{maxSelect} selected
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {items.map(item => {
          const isSelected = selected.includes(item.name);
          const isDisabled = !isSelected && selected.length >= maxSelect;
          return (
            <div key={item.name}>
              <button
                onClick={() => !isDisabled && onToggle(item.name)}
                style={{
                  width: "100%", padding: "10px 12px",
                  borderRadius: isSelected && onStemChange ? "12px 12px 0 0" : "12px",
                  border: `1.5px solid ${isSelected ? "#d4547a" : isDisabled ? "#f5e0ea" : "#f0d0de"}`,
                  borderBottom: isSelected && onStemChange ? "none" : undefined,
                  background: isSelected ? "linear-gradient(135deg, #fce4ec, #fff0f6)" : isDisabled ? "#fafafa" : "white",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  textAlign: "left", transition: "all 0.2s",
                  opacity: isDisabled ? 0.5 : 1,
                  display: "flex", alignItems: "center", gap: "8px"
                }}
              >
                {item.photo ? (
                  <img
                    src={item.photo || getFlowerFallback(item.name, item.desc)}
                    alt={item.name}
                    onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
                    style={{ width: "80px", height: "80px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }}
                  />
                ) : null}
                <span style={{ fontSize: "20px", display: item.photo ? "none" : "block" }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "13px", color: isSelected ? "#8b3a5e" : "#3a1a2e", fontFamily: "Cormorant Garamond, serif", fontWeight: isSelected ? "600" : "400" }}>{item.name}</p>
                  <p style={{ margin: 0, fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{item.desc}</p>
                </div>
                {item.name === "Roses" ? (() => {
                  const selectedTotal = stemSelections?.[item.name]?.total;
                  const selectedTier = selectedTotal && selectedTotal !== "Custom (200+)"
                    ? roseTiers.find(t => String(t.quantity) === selectedTotal)
                    : null;
                  const rosePrice = selectedTier
                    ? (isRoseHoliday ? selectedTier.holiday_price : selectedTier.standard_price)
                    : null;
                  return (
                    <span style={{ fontSize: "11px", color: isSelected ? "#d4547a" : "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600", whiteSpace: "nowrap", textAlign: "right" }}>
                      {rosePrice !== null
                        ? <><span style={{ fontSize: "13px" }}>${rosePrice}</span><br/><span style={{ fontSize: "9px", fontWeight: "400" }}>bouquet</span></>
                        : <>from $25<br/><span style={{ fontSize: "9px", fontWeight: "400" }}>per bouquet</span></>
                      }
                    </span>
                  );
                })() : pricing[item.name] ? (
                  <span style={{ fontSize: "11px", color: isSelected ? "#d4547a" : "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600", whiteSpace: "nowrap" }}>
                    ${isHoliday ? pricing[item.name].holiday_price : pricing[item.name].standard_price}/stem
                    <span style={{ fontSize: "9px", color: "#c49aae", display: "block", textAlign: "right" }}>min 3</span>
                  </span>
                ) : null}
                {isSelected && <span style={{ color: "#d4547a", fontSize: "14px" }}>✓</span>}
              </button>
              {isSelected && onStemChange && (
                <div style={{
                  padding: "12px", background: "#fff0f6",
                  border: "1.5px solid #d4547a", borderTop: "none",
                  borderRadius: "0 0 12px 12px"
                }}>
                  {item.name === "Roses" ? (
                    /* ── ROSES: flat tier pricing ── */
                    <>
                      <p style={{ margin: "0 0 6px", fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>BOUQUET SIZE:</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                        {(roseTiers.length > 0
                          ? roseTiers.map(t => ({ key: String(t.quantity), label: `${t.quantity}`, price: isRoseHoliday ? t.holiday_price : t.standard_price }))
                          : ["12","25","36","50","75","100","150","200"].map(s => ({ key: s, label: s, price: null }))
                        ).map(({ key, label, price }) => {
                          const isSizeSelected = stemSelections?.[item.name]?.total === key;
                          return (
                            <button key={key} onClick={e => {
                              e.stopPropagation();
                              onStemChange(item.name, { total: isSizeSelected ? "" : key, perColor: {} });
                            }}
                              style={{
                                padding: "6px 12px", borderRadius: "14px", fontSize: "11px",
                                border: `1.5px solid ${isSizeSelected ? "#d4547a" : "#f0d0de"}`,
                                background: isSizeSelected ? "linear-gradient(135deg, #d4547a, #c0396a)" : "white",
                                color: isSizeSelected ? "white" : "#8b3a5e",
                                cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600",
                                transition: "all 0.15s", textAlign: "center", lineHeight: "1.4"
                              }}>
                              <span style={{ display: "block" }}>{label} stems</span>
                              {price !== null && <span style={{ display: "block", fontSize: "11px", fontWeight: "700" }}>${price}</span>}
                            </button>
                          );
                        })}
                        <button onClick={e => {
                          e.stopPropagation();
                          const isCustom = stemSelections?.[item.name]?.total === "Custom (200+)";
                          onStemChange(item.name, { total: isCustom ? "" : "Custom (200+)", perColor: {} });
                        }}
                          style={{
                            padding: "6px 12px", borderRadius: "14px", fontSize: "11px",
                            border: `1.5px solid ${stemSelections?.[item.name]?.total === "Custom (200+)" ? "#d4547a" : "#f0d0de"}`,
                            background: stemSelections?.[item.name]?.total === "Custom (200+)" ? "linear-gradient(135deg, #d4547a, #c0396a)" : "white",
                            color: stemSelections?.[item.name]?.total === "Custom (200+)" ? "white" : "#8b3a5e",
                            cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600",
                            transition: "all 0.15s", textAlign: "center", lineHeight: "1.4"
                          }}>
                          <span style={{ display: "block" }}>Custom</span>
                          <span style={{ display: "block", fontSize: "10px", fontWeight: "400" }}>describe order</span>
                        </button>
                      </div>
                      {stemSelections?.[item.name]?.total === "Custom (200+)" && (
                        <textarea
                          placeholder="Describe your custom order — e.g. 100 red roses and 50 pink roses..."
                          value={stemSelections?.[item.name]?.customTotal || ""}
                          onClick={e => e.stopPropagation()}
                          onChange={e => { e.stopPropagation(); onStemChange(item.name, { ...stemSelections?.[item.name], customTotal: e.target.value }); }}
                          rows={3}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "13px", fontFamily: "Montserrat, sans-serif", color: "#8b3a5e", boxSizing: "border-box", marginBottom: "12px", resize: "vertical" }}
                        />
                      )}
                      {/* Color picker + per-color qty with stem counter */}
                      {stemSelections?.[item.name]?.total && (() => {
                        const totalSelected = stemSelections[item.name].total === "Custom (200+)"
                          ? parseInt(stemSelections[item.name]?.customTotal) || 0
                          : parseInt(stemSelections[item.name].total) || 0;
                        const perColor = stemSelections?.[item.name]?.perColor || {};
                        const assigned = Object.values(perColor).reduce((a, b) => a + (parseInt(b) || 0), 0);
                        const remaining = totalSelected - assigned;
                        const isExact = remaining === 0;
                        const isOver = remaining < 0;
                        return (
                          <>
                            <p style={{ margin: "0 0 6px", fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>SELECT COLORS & QTY PER COLOR:</p>
                            {totalSelected > 0 && (
                              <div style={{ marginBottom: "8px", padding: "7px 12px", borderRadius: "10px", background: isOver ? "#ffebee" : isExact ? "#e8f5e9" : "#fff8e1", border: `1px solid ${isOver ? "#ef9a9a" : isExact ? "#a5d6a7" : "#ffe082"}` }}>
                                <span style={{ fontSize: "12px", fontWeight: "600", fontFamily: "Montserrat, sans-serif", color: isOver ? "#c62828" : isExact ? "#2e7d32" : "#f57f17" }}>
                                  {isOver ? `⚠️ ${Math.abs(remaining)} too many stems` : isExact ? "✅ Perfect — all stems assigned!" : `${remaining} stem${remaining !== 1 ? "s" : ""} left to assign`}
                                </span>
                              </div>
                            )}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                              {item.colors.map(c => {
                                const selectedColors = colorSelections?.[item.name] || [];
                                const isColorSelected = selectedColors.includes(c);
                                const isColorDisabled = !isColorSelected && selectedColors.length >= 3;
                                return (
                                  <button key={c} onClick={e => { e.stopPropagation(); if (!onColorChange) return; const current = colorSelections?.[item.name] || []; if (isColorSelected) { onColorChange(item.name, current.filter(x => x !== c)); onStemChange(item.name, { ...stemSelections?.[item.name], perColor: { ...(stemSelections?.[item.name]?.perColor || {}), [c]: "" } }); } else if (!isColorDisabled) { onColorChange(item.name, [...current, c]); } }}
                                    style={{
                                      padding: "4px 10px", borderRadius: "14px", fontSize: "11px",
                                      border: `1.5px solid ${isColorSelected ? "#d4547a" : "#f0d0de"}`,
                                      background: isColorSelected ? "#d4547a" : "white",
                                      color: isColorSelected ? "white" : "#8b3a5e",
                                      cursor: isColorDisabled ? "not-allowed" : "pointer", opacity: isColorDisabled ? 0.4 : 1,
                                      fontFamily: "Montserrat, sans-serif", fontWeight: "600", transition: "all 0.15s"
                                    }}>{c}</button>
                                );
                              })}
                            </div>
                            {(colorSelections?.[item.name] || []).length > 0 && (
                              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                                {(colorSelections[item.name]).map(c => {
                                  const val = parseInt(stemSelections?.[item.name]?.perColor?.[c]) || 0;
                                  const otherAssigned = assigned - val;
                                  const maxAllowed = totalSelected - otherAssigned;
                                  return (
                                    <div key={c} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                      <span style={{ fontSize: "12px", color: "#8b3a5e", fontFamily: "Montserrat, sans-serif", fontWeight: "600", minWidth: "80px" }}>{c}</span>
                                      <input
                                        type="number" min="1" max={maxAllowed} placeholder="# stems"
                                        value={stemSelections?.[item.name]?.perColor?.[c] || ""}
                                        onClick={e => e.stopPropagation()}
                                        onChange={e => {
                                          e.stopPropagation();
                                          const newVal = parseInt(e.target.value) || 0;
                                          const capped = Math.min(newVal, maxAllowed);
                                          onStemChange(item.name, { ...stemSelections?.[item.name], perColor: { ...(stemSelections?.[item.name]?.perColor || {}), [c]: capped > 0 ? String(capped) : "" } });
                                        }}
                                        style={{ flex: 1, padding: "6px 10px", borderRadius: "8px", border: `1.5px solid ${val > 0 ? "#d4547a" : "#f0d0de"}`, fontSize: "13px", fontFamily: "Montserrat, sans-serif", color: "#8b3a5e" }}
                                      />
                                      <span style={{ fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>stems</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    /* ── ALL OTHER FLOWERS: color picker + free qty per color ── */
                    <>
                      {item.colors && item.colors.length > 1 && (
                        <>
                          <p style={{ margin: "0 0 6px", fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>SELECT COLORS & QTY:</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                            {item.colors.map(c => {
                              const selectedColors = colorSelections?.[item.name] || [];
                              const isColorSelected = selectedColors.includes(c);
                              const isColorDisabled = !isColorSelected && selectedColors.length >= 3;
                              return (
                                <button key={c} onClick={e => { e.stopPropagation(); if (!onColorChange) return; const current = colorSelections?.[item.name] || []; if (isColorSelected) { onColorChange(item.name, current.filter(x => x !== c)); } else if (!isColorDisabled) { onColorChange(item.name, [...current, c]); } }}
                                  style={{
                                    padding: "4px 10px", borderRadius: "14px", fontSize: "11px",
                                    border: `1.5px solid ${isColorSelected ? "#d4547a" : "#f0d0de"}`,
                                    background: isColorSelected ? "#d4547a" : "white",
                                    color: isColorSelected ? "white" : "#8b3a5e",
                                    cursor: isColorDisabled ? "not-allowed" : "pointer", opacity: isColorDisabled ? 0.4 : 1,
                                    fontFamily: "Montserrat, sans-serif", fontWeight: "600", transition: "all 0.15s"
                                  }}>{c}</button>
                              );
                            })}
                          </div>
                          {/* Per-color qty inputs */}
                          {(colorSelections?.[item.name] || []).length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "4px" }}>
                              {(colorSelections[item.name]).map(c => (
                                <div key={c} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span style={{ fontSize: "12px", color: "#8b3a5e", fontFamily: "Montserrat, sans-serif", fontWeight: "600", minWidth: "80px" }}>{c}</span>
                                  <input
                                    type="number" min="3" placeholder="min 3"
                                    value={stemSelections?.[item.name]?.perColor?.[c] || ""}
                                    onClick={e => e.stopPropagation()}
                                    onChange={e => { e.stopPropagation(); onStemChange(item.name, { ...stemSelections?.[item.name], perColor: { ...(stemSelections?.[item.name]?.perColor || {}), [c]: e.target.value } }); }}
                                    style={{ flex: 1, padding: "6px 10px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "13px", fontFamily: "Montserrat, sans-serif", color: "#8b3a5e" }}
                                  />
                                  <span style={{ fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>stems</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                      {/* Single-color or no-color flowers: just a qty box */}
                      {(!item.colors || item.colors.length <= 1) && (
                        <>
                          <p style={{ margin: "0 0 6px", fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>HOW MANY STEMS? <span style={{ color: "#c49aae", fontWeight: "400" }}>(min 3)</span></p>
                          <input
                            type="number" min="3" placeholder="e.g. 5"
                            value={stemSelections?.[item.name]?.perColor?.["Assorted"] || stemSelections?.[item.name]?.perColor?.[(item.colors?.[0] || "Assorted")] || ""}
                            onClick={e => e.stopPropagation()}
                            onChange={e => { e.stopPropagation(); const colorKey = item.colors?.[0] || "Assorted"; onStemChange(item.name, { perColor: { [colorKey]: e.target.value } }); }}
                            style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "13px", fontFamily: "Montserrat, sans-serif", color: "#8b3a5e", boxSizing: "border-box" }}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GreeneryGrid({ items, selected, onToggle, bunches, onBunchChange, pricing = {}, isHoliday = false }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <p style={{ margin: 0, fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em" }}>Select up to 3 greenery options</p>
        <p style={{ margin: 0, fontSize: "11px", color: selected.length >= 3 ? "#d4547a" : "#c49aae", fontFamily: "Montserrat, sans-serif" }}>{selected.length}/3 selected</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {items.map(item => {
          const isSelected = selected.includes(item.name);
          const isDisabled = !isSelected && selected.length >= 3;
          const p = pricing[item.name];
          const pricePerBunch = p ? (isHoliday ? p.holiday_price : p.standard_price) * 10 : null;
          return (
            <div key={item.name}>
              <button
                onClick={() => !isDisabled && onToggle(item.name)}
                style={{
                  width: "100%", padding: "10px 12px",
                  borderRadius: isSelected ? "12px 12px 0 0" : "12px",
                  border: `1.5px solid ${isSelected ? "#d4547a" : isDisabled ? "#f5e0ea" : "#f0d0de"}`,
                  borderBottom: isSelected ? "none" : undefined,
                  background: isSelected ? "linear-gradient(135deg, #fce4ec, #fff0f6)" : isDisabled ? "#fafafa" : "white",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  textAlign: "left", transition: "all 0.2s",
                  opacity: isDisabled ? 0.5 : 1,
                  display: "flex", alignItems: "center", gap: "8px"
                }}
              >
                {item.photo ? (
                  <img src={item.photo} alt={item.name}
                    onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
                    style={{ width: "80px", height: "80px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }} />
                ) : null}
                <span style={{ fontSize: "20px", display: item.photo ? "none" : "block" }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "13px", color: isSelected ? "#8b3a5e" : "#3a1a2e", fontFamily: "Cormorant Garamond, serif", fontWeight: isSelected ? "600" : "400" }}>{item.name}</p>
                  <p style={{ margin: 0, fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{item.desc}</p>
                </div>
                {pricePerBunch && (
                  <span style={{ fontSize: "11px", color: isSelected ? "#d4547a" : "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600", whiteSpace: "nowrap" }}>
                    ${pricePerBunch.toFixed(2)}/bunch
                  </span>
                )}
                {isSelected && <span style={{ color: "#d4547a", fontSize: "14px" }}>✓</span>}
              </button>
              {isSelected && (
                <div style={{ padding: "12px", background: "#fff0f6", border: "1.5px solid #d4547a", borderTop: "none", borderRadius: "0 0 12px 12px" }}>
                  <p style={{ margin: "0 0 6px", fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>HOW MANY BUNCHES? <span style={{ color: "#c49aae", fontWeight: "400" }}>(min 1)</span></p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button onClick={e => { e.stopPropagation(); onBunchChange(item.name, Math.max(1, (bunches[item.name] || 1) - 1)); }}
                      style={{ background: "#f8e0eb", border: "none", borderRadius: "6px", width: "32px", height: "32px", cursor: "pointer", color: "#d4547a", fontSize: "18px", fontWeight: "600" }}>−</button>
                    <span style={{ fontSize: "16px", fontWeight: "600", color: "#8b3a5e", fontFamily: "Montserrat, sans-serif", minWidth: "30px", textAlign: "center" }}>{bunches[item.name] || 1}</span>
                    <button onClick={e => { e.stopPropagation(); onBunchChange(item.name, (bunches[item.name] || 1) + 1); }}
                      style={{ background: "#e8f5e9", border: "none", borderRadius: "6px", width: "32px", height: "32px", cursor: "pointer", color: "#2e7d32", fontSize: "18px", fontWeight: "600" }}>+</button>
                    {pricePerBunch && (
                      <span style={{ fontSize: "12px", color: "#d4547a", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>
                        = ${(pricePerBunch * (bunches[item.name] || 1)).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Live Bouquet Preview ──
// Layered, organically-positioned cluster of the actual flower photos the
// customer has selected so far. Greenery sits behind, secondary flowers in
// the middle ring, primary flowers up front — it updates instantly as
// selections change, no extra fetches or images needed.
const GREENERY_SLOTS = [
  { top: "6%", left: "50%", size: 92, rotate: 0 },
  { top: "14%", left: "22%", size: 78, rotate: -18 },
  { top: "14%", left: "78%", size: 78, rotate: 18 },
];
const SECONDARY_SLOTS = [
  { top: "30%", left: "50%", size: 88, rotate: 0 },
  { top: "38%", left: "26%", size: 76, rotate: -10 },
  { top: "38%", left: "74%", size: 76, rotate: 10 },
];
const PRIMARY_SLOTS = [
  { top: "48%", left: "50%", size: 120, rotate: 0 },
  { top: "56%", left: "27%", size: 100, rotate: -8 },
  { top: "56%", left: "73%", size: 100, rotate: 8 },
];

const WRAP_COLOR_HEX = {
  White: "#ffffff", Black: "#2d3436", Pink: "#f4a7b9", Red: "#c0392b",
  "Kraft Brown": "#b5895c", Blush: "#f7d7e3", "Sage Green": "#9caf88",
  Lavender: "#c9a8e0", Gold: "#e8c468", Silver: "#c9ccd1",
  "Designer Print": "#f4a7b9", "Floral Print": "#f4a7b9", "Marble Print": "#e8e6e3",
  "Geometric Print": "#d4547a", "Custom Special Print": "#d4547a",
};

const FLOWER_COLOR_HEX = {
  Red: "#c0392b", Pink: "#f4a7b9", "Hot Pink": "#e84393", White: "#ffffff",
  "Light Pink": "#f8c8dc", Lavender: "#c9a8e0", Peach: "#ffcba4", Orange: "#e8743b",
  Yellow: "#f1c40f", Purple: "#9b59b6", Coral: "#ff7f6b", Burgundy: "#5e2129",
  Blush: "#f7d7e3", "Super White": "#ffffff", Blue: "#3498db", "Light Blue": "#aed6f1",
  "Emerald Green": "#2e8b57",
};
function getFlowerTint(name, colorSelections) {
  const colors = colorSelections?.[name];
  if (!colors || colors.length === 0) return null;
  for (const c of colors) {
    if (FLOWER_COLOR_HEX[c]) return FLOWER_COLOR_HEX[c];
  }
  return null;
}

function BouquetPreview({ selections, ribbonColors }) {
  const flowerLookup = (name) =>
    PRIMARY_FLOWERS.find(f => f.name === name) || SECONDARY_FLOWERS.find(f => f.name === name);
  const greeneryLookup = (name) => GREENERY.find(g => g.name === name);

  const ribbon = ribbonColors.find(r => r.name === selections.ribbon);
  const wrapColor = selections.arrangementStyle === "Vase"
    ? "#cfe0e8"
    : (WRAP_COLOR_HEX[selections.paperWrap] || "#f0d0de");

  const hasAnything = selections.primaryFlowers.length > 0 || selections.secondaryFlowers.length > 0 || selections.greenery.length > 0;

  return (
    <div style={{
      position: "relative", borderRadius: "18px", overflow: "hidden",
      background: "linear-gradient(180deg, #fffaf9, #fff0f6)",
      border: "1.5px solid #f0d0de", marginBottom: "18px",
      boxShadow: "0 6px 20px rgba(180,80,120,0.12)"
    }}>
      <div style={{ position: "relative", height: "230px" }}>
        {!hasAnything && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", color: "#c49aae",
            fontFamily: "Montserrat, sans-serif", fontSize: "12px", gap: "6px"
          }}>
            <span style={{ fontSize: "30px" }}>💐</span>
            Your bouquet will appear here as you build it
          </div>
        )}

        {selections.greenery.map((name, i) => {
          const item = greeneryLookup(name);
          const slot = GREENERY_SLOTS[i % GREENERY_SLOTS.length];
          if (!item) return null;
          return (
            <div key={"g" + name} style={{
              position: "absolute", top: slot.top, left: slot.left,
              width: slot.size, height: slot.size, borderRadius: "50%",
              border: "3px solid white", overflow: "hidden",
              boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
              transform: `translate(-50%, -50%) rotate(${slot.rotate}deg)`,
              zIndex: 1, transition: "all 0.35s ease",
              background: "#e8f0e0", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <img src={item.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }} />
              <span style={{ display: "none", fontSize: slot.size * 0.4 }}>{item.emoji}</span>
            </div>
          );
        })}

        {selections.secondaryFlowers.map((name, i) => {
          const item = flowerLookup(name);
          const slot = SECONDARY_SLOTS[i % SECONDARY_SLOTS.length];
          if (!item) return null;
          const tint = getFlowerTint(name, selections.secondaryColors);
          return (
            <div key={"s" + name} style={{
              position: "absolute", top: slot.top, left: slot.left,
              width: slot.size, height: slot.size, borderRadius: "50%",
              border: "3px solid white", overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transform: `translate(-50%, -50%) rotate(${slot.rotate}deg)`,
              zIndex: 2, transition: "all 0.35s ease",
              background: "#fce4ec", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <img src={item.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }} />
              <span style={{ display: "none", fontSize: slot.size * 0.4 }}>{item.emoji}</span>
              {tint && <div style={{ position: "absolute", inset: 0, background: tint, mixBlendMode: "color", opacity: 0.6 }} />}
              {tint && <div style={{ position: "absolute", bottom: 2, right: 2, width: 12, height: 12, borderRadius: "50%", background: tint, border: "1.5px solid white" }} />}
            </div>
          );
        })}

        {selections.primaryFlowers.map((name, i) => {
          const item = flowerLookup(name);
          const slot = PRIMARY_SLOTS[i % PRIMARY_SLOTS.length];
          if (!item) return null;
          const tint = getFlowerTint(name, selections.primaryColors);
          return (
            <div key={"p" + name} style={{
              position: "absolute", top: slot.top, left: slot.left,
              width: slot.size, height: slot.size, borderRadius: "50%",
              border: "3px solid white", overflow: "hidden",
              boxShadow: "0 5px 16px rgba(0,0,0,0.18)",
              transform: `translate(-50%, -50%) rotate(${slot.rotate}deg)`,
              zIndex: 3, transition: "all 0.35s ease",
              background: "#fce4ec", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <img src={item.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }} />
              <span style={{ display: "none", fontSize: slot.size * 0.4 }}>{item.emoji}</span>
              {tint && <div style={{ position: "absolute", inset: 0, background: tint, mixBlendMode: "color", opacity: 0.6 }} />}
              {tint && <div style={{ position: "absolute", bottom: 3, right: 3, width: 16, height: 16, borderRadius: "50%", background: tint, border: "2px solid white" }} />}
            </div>
          );
        })}

        {/* Ribbon bow accent */}
        {ribbon && ribbon.name !== "No Ribbon" && hasAnything && (
          <div style={{
            position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)",
            display: "flex", alignItems: "center", gap: "6px", zIndex: 4
          }}>
            <div style={{
              width: "22px", height: "22px", borderRadius: "50%", background: ribbon.color,
              border: "2px solid white", boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
            }} />
            <span style={{ fontSize: "11px", color: "#8b3a5e", fontFamily: "Montserrat, sans-serif", fontWeight: "600", background: "rgba(255,255,255,0.85)", padding: "2px 8px", borderRadius: "10px" }}>
              {ribbon.name} ribbon
            </span>
          </div>
        )}
      </div>

      {/* Wrap / vase base band */}
      {hasAnything && selections.arrangementStyle && (
        <div style={{
          height: "16px", background: wrapColor,
          borderTop: "1.5px solid rgba(0,0,0,0.06)"
        }} />
      )}

      <div style={{ padding: "10px 14px", borderTop: "1px solid #f5e0ea" }}>
        <p style={{ margin: 0, fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          🌸 Live Preview
        </p>
      </div>
    </div>
  );
}

const SUPABASE_URL = "https://kxvdgjnybtwsusjvzmfc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4dmRnam55YnR3c3VzanZ6bWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDIwODEsImV4cCI6MjA5NTcxODA4MX0.8u1AZ0DJpyQc9ZnG8Pg6OTwrA_e5EgEjmpDXKUKdbHk";

export default function BouquetBuilder({ onComplete, onBack }) {
  const [path, setPath] = useState(null);
  const [builderStep, setBuilderStep] = useState(1);
  const [pricing, setPricing] = useState({});
  const [roseTiers, setRoseTiers] = useState([]);
  const [isRoseHoliday, setIsRoseHoliday] = useState(false);

  const [isHoliday, setIsHoliday] = useState(false);

  useEffect(() => {
    const headers = { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" };

    // Fetch all data in parallel
    Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/settings?select=value&key=eq.holiday_mode`, { headers }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/settings?select=value&key=eq.rose_holiday_mode`, { headers }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/inventory?select=name,standard_cost,holiday_cost,min_stems`, { headers }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/rose_tiers?select=*&order=quantity.asc`, { headers }).then(r => r.json()),
    ]).then(([holidayData, roseHolidayData, inventoryData, tiersData]) => {
      if (Array.isArray(holidayData) && holidayData[0]) {
        setIsHoliday(holidayData[0].value === "true" || holidayData[0].value === true);
      }
      if (Array.isArray(roseHolidayData) && roseHolidayData[0]) {
        setIsRoseHoliday(roseHolidayData[0].value === "true" || roseHolidayData[0].value === true);
      }
      if (Array.isArray(inventoryData)) {
        const map = {};
        inventoryData.forEach(item => {
          if (item.name === "Roses") return;
          map[item.name] = {
            standard_price: parseFloat((item.standard_cost * 1.5).toFixed(2)),
            holiday_price: parseFloat((item.standard_cost * 1.5 * 2).toFixed(2)),
            min_stems: item.min_stems || 3,
          };
        });
        setPricing(map);
      }
      if (Array.isArray(tiersData)) setRoseTiers(tiersData);
    }).catch(e => console.log("init fetch error:", e));

    // Poll every 10 seconds for holiday_mode changes
    const poll = setInterval(() => {
      fetch(`${SUPABASE_URL}/rest/v1/settings?select=value&key=eq.holiday_mode`, {
        headers: { 
          "apikey": SUPABASE_KEY, 
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        }
      }).then(r => r.json()).then(data => {
        if (Array.isArray(data) && data[0]) {
          setIsHoliday(data[0].value === "true" || data[0].value === true);
        }
      }).catch(() => {});
    }, 10000);

    return () => clearInterval(poll);
  }, []);

  const [selections, setSelections] = useState({
    primaryFlowers: [],
    primaryColors: {},
    primaryStems: {},
    secondaryFlowers: [],
    secondaryColors: {},
    secondaryStems: {},
    greenery: [],
    greeneryBunches: {},
    addOns: [],
    arrangementStyle: "",
    paperWrap: "",
    funeralType: "",
    specialEventNote: "",
    ribbon: "",
    ribbonMessage: "",
    customAddOnNote: "",
  });

  const toggle = (key, name, max) => {
    setSelections(s => {
      const arr = s[key];
      if (arr.includes(name)) return { ...s, [key]: arr.filter(x => x !== name) };
      if (arr.length >= max) return s;
      return { ...s, [key]: [...arr, name] };
    });
  };

  const buildFlowerDetail = (f, stemSel) => {
    const stemData = stemSel?.[f];
    if (f === "Roses") {
      const total = stemData?.total === "Custom Quantity" ? (stemData?.customTotal || "Custom") : stemData?.total;
      const perColor = stemData?.perColor || {};
      const colorBreakdown = Object.entries(perColor).filter(([, qty]) => qty).map(([c, qty]) => `${c}: ${qty}`).join(", ");
      const parts = [total ? `${total} stems total` : "", colorBreakdown].filter(Boolean).join(" — ");
      return parts ? `${f} (${parts})` : f;
    }
    const perColor = stemData?.perColor || {};
    const colorBreakdown = Object.entries(perColor).filter(([, qty]) => qty).map(([c, qty]) => `${c}: ${qty} stems`).join(", ");
    return colorBreakdown ? `${f} (${colorBreakdown})` : f;
  };

  const handleComplete = () => {
    const primaryDetails = selections.primaryFlowers.map(f => buildFlowerDetail(f, selections.primaryStems));
    const secondaryDetails = selections.secondaryFlowers.map(f => buildFlowerDetail(f, selections.secondaryStems));
    const greeneryDetails = selections.greenery.map(f => {
      const qty = selections.greeneryBunches[f] || 1;
      return `${f} (${qty} bunch${qty > 1 ? "es" : ""})`;
    });
    const isWrapStyle = selections.arrangementStyle === "Round Bouquet Wrap" || selections.arrangementStyle === "Flat Bouquet Wrap";
    const styleDetail = isWrapStyle && selections.paperWrap
      ? `${selections.arrangementStyle} - ${selections.paperWrap}`
      : selections.arrangementStyle === "Funeral Arrangement" && selections.funeralType
      ? `Funeral - ${selections.funeralType}`
      : selections.arrangementStyle === "Special Event"
      ? `Special Event: ${selections.specialEventNote || "Details TBD"}`
      : selections.arrangementStyle;
    const summary = [
      primaryDetails.length > 0 ? `Primary: ${primaryDetails.join(", ")}` : null,
      secondaryDetails.length > 0 ? `Secondary: ${secondaryDetails.join(", ")}` : null,
      greeneryDetails.length > 0 ? `Greenery: ${greeneryDetails.join(", ")}` : null,
      selections.addOns.length > 0 ? `Add-Ons: ${selections.addOns.join(", ")}` : null,
      styleDetail ? `Style: ${styleDetail}` : null,
      selections.ribbon && selections.ribbon !== "No Ribbon" ? `Ribbon: ${selections.ribbon}` : null,
      selections.ribbonMessage ? `Ribbon Message: ${selections.ribbonMessage}` : null,
      selections.customAddOnNote ? `Custom Note: ${selections.customAddOnNote}` : null,
    ].filter(Boolean).join(" | ");
    const finalEstimate = calcEstimate();
    const fullSummary = finalEstimate > 0
      ? `${summary} | Estimated: $${finalEstimate.toFixed(2)} (flowers only, excl. labor & delivery)`
      : summary;
    onComplete(fullSummary, false, finalEstimate > 0 ? finalEstimate : 0);
  };

  // Premade bouquets state — must be here before any early returns (React rules of hooks)
  const [premadeBouquets, setPremadeBouquets] = useState([]);
  const [premadeLoading, setPremadeLoading] = useState(false);

  useEffect(() => {
    if (path === "premade") {
      setPremadeLoading(true);
      fetch(`${SUPABASE_URL}/rest/v1/premade_bouquets?active=eq.true&order=sort_order.asc,created_at.asc`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
      }).then(r => r.json()).then(data => {
        setPremadeBouquets(Array.isArray(data) ? data : []);
      }).catch(() => {}).finally(() => setPremadeLoading(false));
    }
  }, [path]);

  // Landing — choose path
  if (!path) return (
    <div>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet" />
      <h2 style={{ fontSize: "28px", fontWeight: "400", color: "#8b3a5e", margin: "0 0 6px", fontFamily: "Cormorant Garamond, serif" }}>Design Your Bouquet 🌸</h2>
      <p style={{ color: "#b06080", fontSize: "14px", margin: "0 0 24px", fontFamily: "Montserrat, sans-serif", fontWeight: "300" }}>How would you like to start?</p>
      <FloralDivider />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "24px" }}>
        <button onClick={() => setPath("premade")} style={{
          padding: "24px 16px", borderRadius: "16px", border: "1.5px solid #f0d0de",
          background: "linear-gradient(135deg, #fff0f6, #fce4ec)",
          cursor: "pointer", textAlign: "center",
          boxShadow: "0 4px 16px rgba(180,80,120,0.1)"
        }}>
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>🛍️</div>
          <p style={{ margin: "0 0 6px", fontSize: "17px", color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontWeight: "600" }}>Premade Bouquets</p>
          <p style={{ margin: 0, fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>Browse our curated arrangements</p>
        </button>
        <button onClick={() => setPath("custom")} style={{
          padding: "24px 16px", borderRadius: "16px", border: "1.5px solid #d4547a",
          background: "linear-gradient(135deg, #fce4ec, #f8d7e8)",
          cursor: "pointer", textAlign: "center",
          boxShadow: "0 4px 16px rgba(180,80,120,0.2)"
        }}>
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>✨</div>
          <p style={{ margin: "0 0 6px", fontSize: "17px", color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontWeight: "600" }}>Build Your Own</p>
          <p style={{ margin: 0, fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>Customize every detail</p>
        </button>
      </div>
      <button onClick={onBack} style={{
        width: "100%", marginTop: "16px", padding: "12px", borderRadius: "12px",
        border: "1.5px solid #f0d0de", background: "white",
        color: "#b06080", fontSize: "14px", cursor: "pointer",
        fontFamily: "Cormorant Garamond, serif"
      }}>← Back to Order Form</button>
    </div>
  );

  if (path === "premade") return (
    <div>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet" />
      <h2 style={{ fontSize: "26px", fontWeight: "400", color: "#8b3a5e", margin: "0 0 4px", fontFamily: "Cormorant Garamond, serif" }}>Premade Bouquets 🛍️</h2>
      <p style={{ color: "#b06080", fontSize: "13px", margin: "0 0 16px", fontFamily: "Montserrat, sans-serif", fontWeight: "300" }}>Our most loved arrangements — ready to order</p>
      <FloralDivider />

      {premadeLoading ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>
          <div style={{ fontSize: "32px", marginBottom: "10px" }}>🌸</div>
          Loading bouquets...
        </div>
      ) : premadeBouquets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>💐</div>
          <p>No premade bouquets yet. Check back soon!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
          {premadeBouquets.map(bouquet => (
            <div key={bouquet.id} style={{
              borderRadius: "16px", overflow: "hidden",
              border: "1.5px solid #f0d0de",
              boxShadow: "0 4px 16px rgba(180,80,120,0.1)",
              background: "white"
            }}>
              {/* Photo */}
              <div style={{
                width: "100%", height: "380px", background: "linear-gradient(135deg, #fce4ec, #fff0f6)",
                overflow: "hidden", position: "relative"
              }}>
                {bouquet.image_url ? (
                  <img
                    src={bouquet.image_url}
                    alt={bouquet.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center" }}
                    onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                  />
                ) : null}
                <div style={{ display: bouquet.image_url ? "none" : "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "absolute", inset: 0 }}>
                  <span style={{ fontSize: "64px" }}>🌸</span>
                  <p style={{ margin: "8px 0 0", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontSize: "12px" }}>Photo coming soon</p>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontWeight: "600", flex: 1 }}>{bouquet.name}</h3>
                  <span style={{ fontSize: "20px", color: "#d4547a", fontFamily: "Montserrat, sans-serif", fontWeight: "600", marginLeft: "12px" }}>
                    ${parseFloat(bouquet.price || 100).toFixed(0)}
                  </span>
                </div>
                {bouquet.description && (
                  <p style={{ margin: "0 0 14px", fontSize: "13px", color: "#b06080", fontFamily: "Montserrat, sans-serif", lineHeight: "1.6" }}>{bouquet.description}</p>
                )}
                <button
                  onClick={() => onComplete(`Premade: ${bouquet.name} — Starting at $${parseFloat(bouquet.price || 100).toFixed(0)}`, true, parseFloat(bouquet.price) || 0)}
                  style={{
                    width: "100%", padding: "13px", borderRadius: "12px", border: "none",
                    background: "linear-gradient(135deg, #d4547a, #c0396a)",
                    color: "white", fontSize: "15px", cursor: "pointer",
                    fontFamily: "Cormorant Garamond, serif", fontWeight: "600",
                    boxShadow: "0 4px 16px rgba(180,80,120,0.3)"
                  }}>
                  🌸 Select This Bouquet
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button onClick={() => setPath(null)} style={{
          flex: 1, padding: "12px", borderRadius: "12px",
          border: "1.5px solid #f0d0de", background: "white",
          color: "#b06080", fontSize: "14px", cursor: "pointer", fontFamily: "Cormorant Garamond, serif"
        }}>← Back</button>
        <button onClick={() => setPath("custom")} style={{
          flex: 1, padding: "12px", borderRadius: "12px", border: "1.5px solid #d4547a",
          background: "white", color: "#d4547a", fontSize: "14px", cursor: "pointer",
          fontFamily: "Cormorant Garamond, serif", fontWeight: "600"
        }}>✨ Build Your Own</button>
      </div>
    </div>
  );

  // Custom Builder Steps
  const totalSteps = 5;
  const stepLabels = ["Primary", "Secondary", "Greenery", "Add-Ons", "Style & Finish"];

  const calcEstimate = () => {
    let total = 0;
    const allFlowers = [
      ...selections.primaryFlowers.map(f => ({ name: f, stems: selections.primaryStems[f] })),
      ...selections.secondaryFlowers.map(f => ({ name: f, stems: selections.secondaryStems[f] })),
      ...selections.greenery.map(f => ({ name: f, stems: { perColor: { bunch: selections.greeneryBunches[f] || 1 } }, isBunch: true })),
    ];
    allFlowers.forEach(({ name, stems, isBunch }) => {
      // Roses use flat tier pricing — handle before per-stem guard
      if (name === "Roses") {
        if (stems?.total && stems.total !== "Custom (200+)") {
          const qty = parseInt(stems.total) || 0;
          const tier = roseTiers.find(t => t.quantity === qty);
          if (tier) {
            total += isRoseHoliday ? tier.holiday_price : tier.standard_price;
          }
        } else if (stems?.total === "Custom (200+)" && stems?.customTotal) {
          // Custom: no tier price, show 0 (Yazmin quotes manually)
        }
        return;
      }

      const p = pricing[name];
      if (!p) return;
      const pricePerStem = isHoliday ? p.holiday_price : p.standard_price;
      let stemCount = 0;
      if (isBunch) {
        // Greenery: priced per bunch
        const bunchCount = parseInt(stems?.perColor?.bunch) || 1;
        const bunchPrice = isHoliday ? p.holiday_price : p.standard_price;
        total += bunchCount * bunchPrice * 10; // wholesale stored per stem, ~10 stems/bunch
      } else {
        if (stems?.perColor) stemCount = Object.values(stems.perColor).reduce((a, b) => a + (parseInt(b) || 0), 0);
        stemCount = Math.max(stemCount, p.min_stems);
        total += stemCount * pricePerStem;
      }
    });
    return total;
  };

  const estimate = calcEstimate();

  return (
    <div style={{ paddingBottom: estimate > 0 ? "70px" : "0" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet" />

      {estimate > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999,
          background: isHoliday ? "linear-gradient(135deg, #8b3a5e, #b8860b)" : "linear-gradient(135deg, #8b3a5e, #d4547a)",
          padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
          boxShadow: "0 -4px 20px rgba(180,80,120,0.3)"
        }}>
          <div>
            <p style={{ margin: 0, fontSize: "10px", color: "rgba(255,255,255,0.8)", fontFamily: "Montserrat, sans-serif" }}>
              {isHoliday ? "🎄 HOLIDAY PRICING · FLOWERS ONLY" : "ESTIMATED FLOWERS TOTAL"}
            </p>
            <p style={{ margin: 0, fontSize: "20px", color: "white", fontFamily: "Cormorant Garamond, serif", fontWeight: "600" }}>${estimate.toFixed(2)}</p>
          </div>
          <div style={{ textAlign: "right", maxWidth: "170px" }}>
            <p style={{ margin: "0 0 2px", fontSize: "10px", color: "rgba(255,255,255,0.9)", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>⚠️ Does not include:</p>
            <p style={{ margin: 0, fontSize: "10px", color: "rgba(255,255,255,0.7)", fontFamily: "Montserrat, sans-serif" }}>Labor · Delivery fee</p>
            <p style={{ margin: 0, fontSize: "9px", color: "rgba(255,255,255,0.6)", fontFamily: "Montserrat, sans-serif" }}>Final price confirmed by florist</p>
          </div>
        </div>
      )}

      {/* Builder Progress */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
          {stepLabels.map((label, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{
                height: "4px", borderRadius: "2px",
                background: builderStep > i + 1 ? "#d4547a" : builderStep === i + 1 ? "#f4a7b9" : "#f0d0de",
                marginBottom: "4px", transition: "background 0.3s"
              }} />
              <p style={{ margin: 0, fontSize: "9px", fontFamily: "Montserrat, sans-serif", color: builderStep === i + 1 ? "#8b3a5e" : "#c49aae", textAlign: "center", fontWeight: builderStep === i + 1 ? "600" : "400" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <BouquetPreview selections={selections} ribbonColors={RIBBON_COLORS} />

      {/* Step 1 — Primary Flowers */}
      {builderStep === 1 && (
        <div>
          <h2 style={{ fontSize: "26px", fontWeight: "400", color: "#8b3a5e", margin: "0 0 4px", fontFamily: "Cormorant Garamond, serif" }}>Primary Flowers 🌹</h2>
          <p style={{ color: "#b06080", fontSize: "13px", margin: "0 0 20px", fontFamily: "Montserrat, sans-serif", fontWeight: "300" }}>Choose up to 3 — these are the stars of your bouquet</p>
          <FloralDivider />
          <div style={{ marginTop: "16px" }}>
            <SelectionGrid
              items={PRIMARY_FLOWERS}
              selected={selections.primaryFlowers}
              onToggle={(name) => toggle("primaryFlowers", name, 3)}
              maxSelect={3}
              label="Select up to 3 primary flowers"
              colorSelections={selections.primaryColors}
              onColorChange={(flower, colors) => setSelections(s => ({ ...s, primaryColors: { ...s.primaryColors, [flower]: colors } }))}
              stemSelections={selections.primaryStems}
              onStemChange={(flower, count) => setSelections(s => ({ ...s, primaryStems: { ...s.primaryStems, [flower]: count } }))}
              pricing={pricing}
              isHoliday={isHoliday}
              roseTiers={roseTiers}
              isRoseHoliday={isRoseHoliday}
            />
          </div>
        </div>
      )}

      {/* Step 2 — Secondary Flowers */}
      {builderStep === 2 && (
        <div>
          <h2 style={{ fontSize: "26px", fontWeight: "400", color: "#8b3a5e", margin: "0 0 4px", fontFamily: "Cormorant Garamond, serif" }}>Secondary Flowers 🌸</h2>
          <p style={{ color: "#b06080", fontSize: "13px", margin: "0 0 20px", fontFamily: "Montserrat, sans-serif", fontWeight: "300" }}>Choose up to 3 — accent blooms that complement your primary flowers</p>
          <FloralDivider />
          <div style={{ marginTop: "16px" }}>
            <SelectionGrid
              items={SECONDARY_FLOWERS}
              selected={selections.secondaryFlowers}
              onToggle={(name) => toggle("secondaryFlowers", name, 3)}
              maxSelect={3}
              label="Select up to 3 accent flowers"
              colorSelections={selections.secondaryColors}
              onColorChange={(flower, colors) => setSelections(s => ({ ...s, secondaryColors: { ...s.secondaryColors, [flower]: colors } }))}
              stemSelections={selections.secondaryStems}
              onStemChange={(flower, count) => setSelections(s => ({ ...s, secondaryStems: { ...s.secondaryStems, [flower]: count } }))}
              pricing={pricing}
              isHoliday={isHoliday}
              roseTiers={roseTiers}
              isRoseHoliday={isRoseHoliday}
            />
          </div>
        </div>
      )}

      {/* Step 3 — Greenery */}
      {builderStep === 3 && (
        <div>
          <h2 style={{ fontSize: "26px", fontWeight: "400", color: "#8b3a5e", margin: "0 0 4px", fontFamily: "Cormorant Garamond, serif" }}>Greenery 🌿</h2>
          <p style={{ color: "#b06080", fontSize: "13px", margin: "0 0 20px", fontFamily: "Montserrat, sans-serif", fontWeight: "300" }}>Choose up to 3 — lush greenery brings your bouquet to life</p>
          <FloralDivider />
          <div style={{ marginTop: "16px" }}>
            <GreeneryGrid
              items={GREENERY}
              selected={selections.greenery}
              onToggle={(name) => toggle("greenery", name, 3)}
              bunches={selections.greeneryBunches}
              onBunchChange={(name, qty) => setSelections(s => ({ ...s, greeneryBunches: { ...s.greeneryBunches, [name]: qty } }))}
              pricing={pricing}
              isHoliday={isHoliday}
            />
          </div>
        </div>
      )}

      {/* Step 4 — Add Ons */}
      {builderStep === 4 && (
        <div>
          <h2 style={{ fontSize: "26px", fontWeight: "400", color: "#8b3a5e", margin: "0 0 4px", fontFamily: "Cormorant Garamond, serif" }}>Add-Ons ✨</h2>
          <p style={{ color: "#b06080", fontSize: "13px", margin: "0 0 20px", fontFamily: "Montserrat, sans-serif", fontWeight: "300" }}>Choose up to 5 — special touches that make it unique</p>
          <FloralDivider />
          <div style={{ marginTop: "16px" }}>
            <SelectionGrid items={ADD_ONS} selected={selections.addOns} onToggle={(name) => toggle("addOns", name, 5)} maxSelect={5} label="Select up to 5 add-ons" />
          </div>
          {selections.addOns.includes("Custom Add-On") && (
            <div style={{ marginTop: "14px" }}>
              <p style={{ margin: "0 0 6px", fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600", textTransform: "uppercase" }}>Describe your custom add-on</p>
              <textarea
                value={selections.customAddOnNote}
                onChange={e => setSelections(s => ({ ...s, customAddOnNote: e.target.value }))}
                placeholder="e.g. Houston Texans hat, concert tickets, etc."
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: "10px",
                  border: "1.5px solid #f0d0de", fontSize: "14px",
                  fontFamily: "Cormorant Garamond, serif", minHeight: "70px",
                  resize: "vertical", boxSizing: "border-box"
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Step 5 — Style & Finish */}
      {builderStep === 5 && (
        <div>
          <h2 style={{ fontSize: "26px", fontWeight: "400", color: "#8b3a5e", margin: "0 0 4px", fontFamily: "Cormorant Garamond, serif" }}>Style & Finish 🎀</h2>
          <p style={{ color: "#b06080", fontSize: "13px", margin: "0 0 20px", fontFamily: "Montserrat, sans-serif", fontWeight: "300" }}>Final touches for your perfect arrangement</p>
          <FloralDivider />

          {/* Arrangement Style */}
          <div style={{ marginTop: "16px", marginBottom: "16px" }}>
            <p style={{ margin: "0 0 10px", fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em" }}>Arrangement Style</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {ARRANGEMENT_STYLES.map(style => (
                <button key={style.name} onClick={() => setSelections(s => ({ ...s, arrangementStyle: style.name, paperWrap: "", funeralType: "", specialEventNote: "" }))} style={{
                  padding: "14px 12px", borderRadius: "12px", textAlign: "left",
                  border: `1.5px solid ${selections.arrangementStyle === style.name ? "#d4547a" : "#f0d0de"}`,
                  background: selections.arrangementStyle === style.name ? "linear-gradient(135deg, #fce4ec, #fff0f6)" : "white",
                  cursor: "pointer", transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: "10px"
                }}>
                  <span style={{ fontSize: "22px" }}>{style.emoji}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: "13px", color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontWeight: selections.arrangementStyle === style.name ? "600" : "400" }}>{style.name}</p>
                    <p style={{ margin: 0, fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{style.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Wrap Color Options */}
            {(selections.arrangementStyle === "Round Bouquet Wrap" || selections.arrangementStyle === "Flat Bouquet Wrap") && (
              <div style={{ marginTop: "12px", padding: "14px", background: "#fff0f6", borderRadius: "12px", border: "1px solid #f0d0de" }}>
                <p style={{ margin: "0 0 8px", fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>SELECT WRAP STYLE:</p>
                <select value={selections.paperWrap} onChange={e => setSelections(s => ({ ...s, paperWrap: e.target.value }))} style={{
                  width: "100%", padding: "8px 12px", borderRadius: "8px",
                  border: "1.5px solid #f0d0de", fontSize: "14px",
                  fontFamily: "Cormorant Garamond, serif", color: "#8b3a5e", background: "white"
                }}>
                  <option value="">Choose a wrap...</option>
                  <optgroup label="Basic Colors">
                    {["White", "Black", "Pink", "Red", "Kraft Brown", "Blush", "Sage Green", "Lavender", "Gold", "Silver"].map(w => <option key={w} value={w}>{w}</option>)}
                  </optgroup>
                  <optgroup label="Special Wraps">
                    {["Designer Print", "Floral Print", "Marble Print", "Geometric Print", "Custom Special Print"].map(w => <option key={w} value={w}>{w}</option>)}
                  </optgroup>
                </select>
              </div>
            )}

            {/* Funeral Arrangement Options */}
            {selections.arrangementStyle === "Funeral Arrangement" && (
              <div style={{ marginTop: "12px", padding: "14px", background: "#fff0f6", borderRadius: "12px", border: "1px solid #f0d0de" }}>
                <p style={{ margin: "0 0 8px", fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>SELECT ARRANGEMENT TYPE:</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {FUNERAL_OPTIONS.map(f => (
                    <button key={f} onClick={() => setSelections(s => ({ ...s, funeralType: f }))} style={{
                      padding: "10px", borderRadius: "10px", fontSize: "13px",
                      border: `1.5px solid ${selections.funeralType === f ? "#d4547a" : "#f0d0de"}`,
                      background: selections.funeralType === f ? "#fce4ec" : "white",
                      color: "#8b3a5e", cursor: "pointer", fontFamily: "Cormorant Garamond, serif",
                      fontWeight: selections.funeralType === f ? "600" : "400"
                    }}>{f}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Special Event */}
            {selections.arrangementStyle === "Special Event" && (
              <div style={{ marginTop: "12px", padding: "16px", background: "linear-gradient(135deg, #fff0f6, #fce4ec)", borderRadius: "12px", border: "1.5px solid #f4a7b9" }}>
                <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontWeight: "600" }}>🎊 Special Event Coordination</p>
                <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif", lineHeight: "1.6" }}>
                  Special events require a personalized consultation. After you submit, <strong>Yazmin</strong> from Pretty Petals will reach out via text, call, or in-person meeting to gather all the details and create something perfect for your event.
                </p>
                <p style={{ margin: "0 0 6px", fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>TELL US ABOUT YOUR EVENT:</p>
                <textarea
                  value={selections.specialEventNote}
                  onChange={e => setSelections(s => ({ ...s, specialEventNote: e.target.value }))}
                  placeholder="e.g. Wedding reception for 200 guests, Quinceañera in June, Corporate gala, etc."
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: "10px",
                    border: "1.5px solid #f0d0de", fontSize: "14px",
                    fontFamily: "Cormorant Garamond, serif", minHeight: "80px",
                    resize: "vertical", boxSizing: "border-box", background: "white"
                  }}
                />
              </div>
            )}
          </div>

          {/* Ribbon Color */}
          <div style={{ marginBottom: "16px" }}>
            <p style={{ margin: "0 0 10px", fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em" }}>Ribbon Color</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {RIBBON_COLORS.map(r => (
                <button key={r.name} onClick={() => setSelections(s => ({ ...s, ribbon: r.name }))} style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "6px 12px", borderRadius: "20px",
                  border: `1.5px solid ${selections.ribbon === r.name ? "#d4547a" : "#f0d0de"}`,
                  background: selections.ribbon === r.name ? "#fce4ec" : "white",
                  cursor: "pointer", transition: "all 0.2s"
                }}>
                  <div style={{
                    width: "14px", height: "14px", borderRadius: "50%",
                    background: r.color, border: r.color === "transparent" ? "1.5px dashed #f0d0de" : "1px solid rgba(0,0,0,0.1)"
                  }} />
                  <span style={{ fontSize: "12px", color: "#8b3a5e", fontFamily: "Montserrat, sans-serif", fontWeight: selections.ribbon === r.name ? "600" : "400" }}>{r.name}</span>
                </button>
              ))}
            </div>
            {selections.ribbon && selections.ribbon !== "No Ribbon" && (
              <div style={{ marginTop: "12px" }}>
                <p style={{ margin: "0 0 6px", fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>🎀 RIBBON MESSAGE (optional)</p>
                <input
                  type="text"
                  value={selections.ribbonMessage}
                  onChange={e => setSelections(s => ({ ...s, ribbonMessage: e.target.value }))}
                  placeholder="e.g. Happy Birthday, I Love You, Forever Yours..."
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: "10px",
                    border: "1.5px solid #f0d0de", fontSize: "14px",
                    fontFamily: "Cormorant Garamond, serif", boxSizing: "border-box",
                    color: "#8b3a5e"
                  }}
                />
              </div>
            )}
          </div>

          {/* Summary */}
          {(selections.primaryFlowers.length > 0 || selections.secondaryFlowers.length > 0) && (
            <div style={{ background: "linear-gradient(135deg, #fff0f6, #fce4ec)", borderRadius: "14px", padding: "16px", marginBottom: "16px" }}>
              <p style={{ margin: "0 0 10px", fontSize: "11px", color: "#8b3a5e", fontFamily: "Montserrat, sans-serif", fontWeight: "600", letterSpacing: "0.08em" }}>YOUR BOUQUET SUMMARY</p>
              {selections.primaryFlowers.length > 0 && <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#5a2a3e", fontFamily: "Montserrat, sans-serif" }}>🌹 {selections.primaryFlowers.join(", ")}</p>}
              {selections.secondaryFlowers.length > 0 && <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#5a2a3e", fontFamily: "Montserrat, sans-serif" }}>🌸 {selections.secondaryFlowers.join(", ")}</p>}
              {selections.greenery.length > 0 && <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#5a2a3e", fontFamily: "Montserrat, sans-serif" }}>🌿 {selections.greenery.join(", ")}</p>}
              {selections.addOns.length > 0 && <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#5a2a3e", fontFamily: "Montserrat, sans-serif" }}>✨ {selections.addOns.join(", ")}</p>}
              {selections.arrangementStyle && <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#5a2a3e", fontFamily: "Montserrat, sans-serif" }}>🎁 {selections.arrangementStyle}</p>}
              {selections.ribbon && selections.ribbon !== "No Ribbon" && <p style={{ margin: 0, fontSize: "13px", color: "#5a2a3e", fontFamily: "Montserrat, sans-serif" }}>🎀 {selections.ribbon} Ribbon</p>}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
        <button onClick={() => builderStep === 1 ? setPath(null) : setBuilderStep(s => s - 1)} style={{
          flex: 1, padding: "14px", borderRadius: "12px",
          border: "1.5px solid #f0d0de", background: "white",
          color: "#b06080", fontSize: "15px", cursor: "pointer",
          fontFamily: "Cormorant Garamond, serif"
        }}>← Back</button>
        {builderStep < totalSteps ? (
          <button onClick={() => setBuilderStep(s => s + 1)} style={{
            flex: 2, padding: "14px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #d4547a, #c0396a)",
            color: "white", fontSize: "16px", cursor: "pointer",
            fontFamily: "Cormorant Garamond, serif", fontWeight: "600",
            boxShadow: "0 4px 20px rgba(180,80,120,0.3)"
          }}>Continue →</button>
        ) : (
          <button onClick={handleComplete} style={{
            flex: 2, padding: "14px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #d4547a, #c0396a)",
            color: "white", fontSize: "16px", cursor: "pointer",
            fontFamily: "Cormorant Garamond, serif", fontWeight: "600",
            boxShadow: "0 4px 20px rgba(180,80,120,0.3)"
          }}>🌸 Add to Order →</button>
        )}
      </div>
    </div>
  );
}
