import { useState } from "react";

const ROSE_BOUQUET_SIZES = ["12", "24", "36", "50", "75", "100", "150", "200", "Custom Quantity"];

const BASIC_COLORS = ["Red", "Pink", "Hot Pink", "White", "Light Pink", "Lavender", "Peach", "Orange", "Yellow", "Purple", "Coral", "Burgundy", "Blush", "Tinted", "Bicolor"];
const SIMPLE_COLORS = ["Red", "White", "Pink", "Yellow"];

const PRIMARY_FLOWERS = [
  { name: "Roses", photo: "/flowers/roses.jpg", emoji: "🌹", desc: "Classic & romantic", colors: ["Red", "Pink", "Hot Pink", "White", "Super White", "Light Pink", "Lavender", "Peach", "Orange", "Yellow", "Bicolor", "Garden", "Tinted", "Glitter Tinted"] },
  { name: "Peonies", photo: "/flowers/peonies.jpg", emoji: "🌸", desc: "Full & lush blooms", colors: SIMPLE_COLORS },
  { name: "Ranunculus", photo: "/flowers/ranunculus.jpg", emoji: "🌺", desc: "Delicate layered petals", colors: ["Assorted Colors"] },
  { name: "Tulips", photo: "/flowers/tulips.jpg", emoji: "🌷", desc: "Elegant & sleek", colors: SIMPLE_COLORS },
  { name: "Hydrangea", photo: "/flowers/hydrangea.jpg", emoji: "💐", desc: "Full & voluminous", colors: ["White", "Pink", "Light Blue", "Lavender", "Emerald Green", "Blush", "Burgundy", "Natural Colors"] },
  { name: "Sunflower", photo: "/flowers/sunflower.jpg", emoji: "🌻", desc: "Bright & cheerful", colors: ["Yellow"] },
  { name: "Lily Oriental", photo: "/flowers/lily-oriental.jpg", emoji: "🌼", desc: "Fragrant & bold", colors: ["Assorted Colors"] },
  { name: "Rose Lily", photo: "/flowers/rose-lily.jpg", emoji: "🌸", desc: "Soft & romantic", colors: ["Assorted Colors"] },
  { name: "Orchid", photo: "/flowers/orchid.jpg", emoji: "🪷", desc: "Exotic & elegant", colors: ["White", "Pink", "Purple"] },
  { name: "Dahlia", photo: "/flowers/dahlia.jpg", emoji: "🌺", desc: "Rich & dramatic", colors: SIMPLE_COLORS },
  { name: "Gerbera", photo: "/flowers/gerbera.jpg", emoji: "🌼", desc: "Cheerful & colorful", colors: SIMPLE_COLORS },
];

const SECONDARY_FLOWERS = [
  { name: "Spray Roses", photo: "/flowers/spray-roses.jpg", emoji: "🌹", desc: "Petite rose clusters", colors: BASIC_COLORS },
  { name: "Carnation Supreme", photo: "/flowers/carnation-supreme.jpg", emoji: "🌸", desc: "Full & ruffled", colors: BASIC_COLORS },
  { name: "Mini Carnation", photo: "/flowers/mini-carnation.jpg", emoji: "🌼", desc: "Delicate & sweet", colors: BASIC_COLORS },
  { name: "Snapdragon", photo: "/flowers/snapdragon.jpg", emoji: "🌺", desc: "Tall & dramatic", colors: ["Assorted Colors"] },
  { name: "Delphinium", photo: "/flowers/delphinium.jpg", emoji: "💜", desc: "Airy & elevated", colors: ["White", "Pink", "Light Pink", "Lavender", "Purple", "Blue", "Dark Blue"] },
  { name: "Stock", photo: "/flowers/stock.jpg", emoji: "🌸", desc: "Fragrant spikes", colors: ["Assorted Colors"] },
  { name: "Campanula", photo: "/flowers/campanula.jpg", emoji: "🔔", desc: "Bell-shaped blooms", colors: ["Assorted Colors"] },
  { name: "Wax Flowers", photo: "/flowers/carnation-supreme.jpg", emoji: "🌸", desc: "Delicate filler", colors: ["White", "Pink", "Hot Pink", "Lavender", "Purple", "Coral"] },
  { name: "Dianthus Sweet", photo: "/flowers/dianthus-sweet.jpg", emoji: "🌸", desc: "Sweet & spicy", colors: ["Assorted Colors"] },
  { name: "Poppies", photo: "/flowers/poppies.jpg", emoji: "🌺", desc: "Wispy & romantic", colors: ["Red", "Pink", "White", "Orange", "Peach", "Coral", "Burgundy", "Lavender"] },
  { name: "Craspedias", photo: "/flowers/craspedias.jpg", emoji: "🟡", desc: "Golden button blooms", colors: ["Yellow"] },
];

const GREENERY = [
  { name: "Baby's Breath", photo: "/flowers/babys-breath.jpg", emoji: "🤍", desc: "Classic cloud filler" },
  { name: "Baby Blue Eucalyptus", photo: "/flowers/baby-blue-eucalyptus.jpg", emoji: "🌿", desc: "Silvery & aromatic" },
  { name: "Silver Dollar Eucalyptus", photo: "/flowers/silver-dollar-eucalyptus.jpg", emoji: "🌿", desc: "Round coin leaves" },
  { name: "Seeded Eucalyptus", photo: "/flowers/seeded-eucalyptus.jpg", emoji: "🌿", desc: "Textured & natural" },
  { name: "Italian Ruscus", photo: "/flowers/italian-ruscus.jpg", emoji: "🍃", desc: "Deep glossy green" },
  { name: "Israeli Ruscus", photo: "/flowers/italian-ruscus.jpg", emoji: "🍃", desc: "Light bright green" },
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
  { name: "Paper Wrap", emoji: "🎁", desc: "Choose your wrap style" },
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

function SelectionGrid({ items, selected, onToggle, maxSelect, label, colorSelections, onColorChange, stemSelections, onStemChange }) {
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
                    src={item.photo}
                    alt={item.name}
                    onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
                    style={{ width: "44px", height: "44px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                  />
                ) : null}
                <span style={{ fontSize: "20px", display: item.photo ? "none" : "block" }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "13px", color: isSelected ? "#8b3a5e" : "#3a1a2e", fontFamily: "Cormorant Garamond, serif", fontWeight: isSelected ? "600" : "400" }}>{item.name}</p>
                  <p style={{ margin: 0, fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{item.desc}</p>
                </div>
                {isSelected && <span style={{ color: "#d4547a", fontSize: "14px" }}>✓</span>}
              </button>
              {isSelected && onStemChange && (
                <div style={{
                  padding: "12px", background: "#fff0f6",
                  border: "1.5px solid #d4547a", borderTop: "none",
                  borderRadius: "0 0 12px 12px"
                }}>
                  {item.name === "Roses" ? (
                    /* ── ROSES: pick bouquet size first, then per-color qty ── */
                    <>
                      <p style={{ margin: "0 0 6px", fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>BOUQUET SIZE (TOTAL STEMS):</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "12px" }}>
                        {ROSE_BOUQUET_SIZES.map(size => {
                          const isSizeSelected = stemSelections?.[item.name]?.total === size;
                          return (
                            <button key={size} onClick={e => { e.stopPropagation(); onStemChange(item.name, { ...stemSelections?.[item.name], total: isSizeSelected ? "" : size }); }}
                              style={{
                                padding: "4px 10px", borderRadius: "14px", fontSize: "11px",
                                border: `1.5px solid ${isSizeSelected ? "#d4547a" : "#f0d0de"}`,
                                background: isSizeSelected ? "#d4547a" : "white",
                                color: isSizeSelected ? "white" : "#8b3a5e",
                                cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600", transition: "all 0.15s"
                              }}>{size}</button>
                          );
                        })}
                      </div>
                      {stemSelections?.[item.name]?.total === "Custom Quantity" && (
                        <input
                          type="number" min="1" placeholder="Enter total stems..."
                          value={stemSelections?.[item.name]?.customTotal || ""}
                          onClick={e => e.stopPropagation()}
                          onChange={e => { e.stopPropagation(); onStemChange(item.name, { ...stemSelections?.[item.name], customTotal: e.target.value }); }}
                          style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "13px", fontFamily: "Montserrat, sans-serif", color: "#8b3a5e", boxSizing: "border-box", marginBottom: "12px" }}
                        />
                      )}
                      {/* Color picker + per-color qty */}
                      <p style={{ margin: "0 0 6px", fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>SELECT COLORS & QTY PER COLOR:</p>
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
                      {/* Per-color qty inputs for selected colors */}
                      {(colorSelections?.[item.name] || []).length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                          {(colorSelections[item.name]).map(c => (
                            <div key={c} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "12px", color: "#8b3a5e", fontFamily: "Montserrat, sans-serif", fontWeight: "600", minWidth: "80px" }}>{c}</span>
                              <input
                                type="number" min="1" placeholder="# stems"
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
                                    type="number" min="1" placeholder="# stems"
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
                          <p style={{ margin: "0 0 6px", fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>HOW MANY STEMS?</p>
                          <input
                            type="number" min="1" placeholder="e.g. 5"
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

export default function BouquetBuilder({ onComplete, onBack }) {
  const [path, setPath] = useState(null); // "premade" | "custom"
  const [builderStep, setBuilderStep] = useState(1);
  const [selections, setSelections] = useState({
    primaryFlowers: [],
    primaryColors: {},
    primaryStems: {},
    secondaryFlowers: [],
    secondaryColors: {},
    secondaryStems: {},
    greenery: [],
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
    const styleDetail = selections.arrangementStyle === "Paper Wrap" && selections.paperWrap
      ? `Paper Wrap - ${selections.paperWrap}`
      : selections.arrangementStyle === "Funeral Arrangement" && selections.funeralType
      ? `Funeral - ${selections.funeralType}`
      : selections.arrangementStyle === "Special Event"
      ? `Special Event: ${selections.specialEventNote || "Details TBD"}`
      : selections.arrangementStyle;
    const summary = [
      primaryDetails.length > 0 ? `Primary: ${primaryDetails.join(", ")}` : null,
      secondaryDetails.length > 0 ? `Secondary: ${secondaryDetails.join(", ")}` : null,
      selections.greenery.length > 0 ? `Greenery: ${selections.greenery.join(", ")}` : null,
      selections.addOns.length > 0 ? `Add-Ons: ${selections.addOns.join(", ")}` : null,
      styleDetail ? `Style: ${styleDetail}` : null,
      selections.ribbon && selections.ribbon !== "No Ribbon" ? `Ribbon: ${selections.ribbon}` : null,
      selections.ribbonMessage ? `Ribbon Message: ${selections.ribbonMessage}` : null,
      selections.customAddOnNote ? `Custom Note: ${selections.customAddOnNote}` : null,
    ].filter(Boolean).join(" | ");
    onComplete(summary);
  };

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

  // Premade bouquets
  const PREMADE_BOUQUETS = [
    {
      id: "pink-75-babies-breath",
      name: "Pink 75 Count w/ Baby's Breath",
      desc: "75 premium pink roses arranged with a Baby's Breath letter & Baby's Breath filler — a stunning statement bouquet",
      price: "$190",
      image: "/bouquets/pink-75-babies-breath.jpg",
      emoji: "🌸",
      details: "Primary: Roses (75 stems total — Pink: 75) | Style: Paper Wrap | Secondary: Baby's Breath Letter & Filler"
    },
  ];

  if (path === "premade") return (
    <div>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet" />
      <h2 style={{ fontSize: "26px", fontWeight: "400", color: "#8b3a5e", margin: "0 0 4px", fontFamily: "Cormorant Garamond, serif" }}>Premade Bouquets 🛍️</h2>
      <p style={{ color: "#b06080", fontSize: "13px", margin: "0 0 16px", fontFamily: "Montserrat, sans-serif", fontWeight: "300" }}>Our most loved arrangements — ready to order</p>
      <FloralDivider />

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
        {PREMADE_BOUQUETS.map(bouquet => (
          <div key={bouquet.id} style={{
            borderRadius: "16px", overflow: "hidden",
            border: "1.5px solid #f0d0de",
            boxShadow: "0 4px 16px rgba(180,80,120,0.1)",
            background: "white"
          }}>
            {/* Photo */}
            <div style={{
              width: "100%", height: "260px", background: "linear-gradient(135deg, #fce4ec, #fff0f6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", position: "relative"
            }}>
              <img
                src={bouquet.image}
                alt={bouquet.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
              />
              <div style={{ display: "none", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "absolute", inset: 0 }}>
                <span style={{ fontSize: "64px" }}>{bouquet.emoji}</span>
                <p style={{ margin: "8px 0 0", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontSize: "12px" }}>Photo coming soon</p>
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontWeight: "600", flex: 1 }}>{bouquet.name}</h3>
                <span style={{ fontSize: "20px", color: "#d4547a", fontFamily: "Montserrat, sans-serif", fontWeight: "600", marginLeft: "12px" }}>{bouquet.price}</span>
              </div>
              <p style={{ margin: "0 0 14px", fontSize: "13px", color: "#b06080", fontFamily: "Montserrat, sans-serif", lineHeight: "1.6" }}>{bouquet.desc}</p>
              <button
                onClick={() => { onComplete(bouquet.details, true); }}
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

  return (
    <div>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet" />

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
            <SelectionGrid items={GREENERY} selected={selections.greenery} onToggle={(name) => toggle("greenery", name, 3)} maxSelect={3} label="Select up to 3 greenery options" />
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

            {/* Paper Wrap Options */}
            {selections.arrangementStyle === "Paper Wrap" && (
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
                <p style={{ margin: "0 0 6px", fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>🎀 CUSTOM RIBBON MESSAGE (optional)</p>
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
