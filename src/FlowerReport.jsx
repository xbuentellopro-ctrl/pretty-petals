import { useState, useEffect } from "react";

const SUPABASE_URL = "https://kxvdgjnybtwsusjvzmfc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4dmRnam55YnR3c3VzanZ6bWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDIwODEsImV4cCI6MjA5NTcxODA4MX0.8u1AZ0DJpyQc9ZnG8Pg6OTwrA_e5EgEjmpDXKUKdbHk";

function parseFlowerSummary(summary) {
  if (!summary) return [];
  const flowers = [];
  const parts = summary.split(" | ");
  
  for (const part of parts) {
    if (!part.startsWith("Primary:") && !part.startsWith("Secondary:")) continue;
    
    const type = part.startsWith("Primary:") ? "Primary" : "Secondary";
    const itemsStr = part.replace("Primary:", "").replace("Secondary:", "").trim();
    
    // Split by flower entries respecting parentheses
    const items = [];
    let depth = 0;
    let current = "";
    for (let i = 0; i < itemsStr.length; i++) {
      const ch = itemsStr[i];
      if (ch === "(") depth++;
      else if (ch === ")") depth--;
      if (ch === "," && depth === 0 && itemsStr[i+1] === " ") {
        items.push(current.trim());
        current = "";
        i++;
      } else {
        current += ch;
      }
    }
    if (current.trim()) items.push(current.trim());
    
    for (const item of items) {
      const match = item.match(/^(.+?)\s*\((.+)\)$/);
      if (match) {
        const flowerName = match[1].trim();
        const details = match[2];

        // New format: "100 stems total — Red: 50, Pink: 50"
        // or "Red: 5 stems, Pink: 3 stems"
        if (details.includes("—")) {
          // Roses style: total + per-color breakdown
          const [totalPart, colorPart] = details.split("—").map(s => s.trim());
          const totalMatch = totalPart.match(/(\d+)\s*stems/);
          const totalStems = totalMatch ? parseInt(totalMatch[1]) : 0;
          const colors = {};
          if (colorPart) {
            colorPart.split(",").forEach(seg => {
              const cm = seg.trim().match(/^(.+?):\s*(\d+)$/);
              if (cm) colors[cm[1].trim()] = parseInt(cm[2]);
            });
          }
          flowers.push({ type, name: flowerName, colors: Object.keys(colors).length ? colors : { "Assorted": totalStems }, stems: totalStems });
        } else if (details.match(/:\s*\d+\s*stems/)) {
          // New per-color format: "Red: 5 stems, Pink: 3 stems"
          const colors = {};
          let totalStems = 0;
          details.split(",").forEach(seg => {
            const cm = seg.trim().match(/^(.+?):\s*(\d+)\s*stems?$/);
            if (cm) { colors[cm[1].trim()] = parseInt(cm[2]); totalStems += parseInt(cm[2]); }
          });
          flowers.push({ type, name: flowerName, colors: Object.keys(colors).length ? colors : { "Assorted": 0 }, stems: totalStems });
        } else {
          // Legacy format fallback
          const stemMatch = details.match(/(\d+)\s*stems?/);
          const stems = stemMatch ? parseInt(stemMatch[1]) : 0;
          const colorStr = details.replace(/,?\s*\d+\s*stems?/, "").replace(/,?\s*Custom Order/, "").trim();
          const colorArr = colorStr ? colorStr.split(",").map(c => c.trim()).filter(c => c.length > 0) : ["Assorted"];
          const colors = {};
          colorArr.forEach(c => { colors[c] = stems; });
          flowers.push({ type, name: flowerName, colors, stems });
        }
      } else if (item.trim()) {
        flowers.push({ type, name: item.trim(), colors: { "Assorted": 0 }, stems: 0 });
      }
    }
  }
  return flowers;
}

function getWeekRange(date) {
  const d = new Date(date);
  const day = d.getDay();
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatWeek(dateStr) {
  const { start, end } = getWeekRange(dateStr);
  return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

export default function FlowerReport() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("day"); // day | week | year
  const [report, setReport] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) buildReport();
  }, [orders, view]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?order=date_needed.asc&status=neq.Delivered`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      setOrders(data.filter(o => o.bouquet_summary && o.date_needed));
    } catch(err) {
      console.error(err);
    }
    setLoading(false);
  };

  const buildReport = () => {
    const grouped = {};
    for (const order of orders) {
      const flowers = parseFlowerSummary(order.bouquet_summary);
      if (flowers.length === 0) continue;

      let key;
      if (view === "day") {
        key = order.date_needed;
      } else if (view === "week") {
        const { start } = getWeekRange(order.date_needed);
        key = start.toISOString().split("T")[0];
      } else {
        key = order.date_needed?.substring(0, 4);
      }

      if (!grouped[key]) grouped[key] = {};

      for (const flower of flowers) {
        const flowerKey = flower.name;
        if (!grouped[key][flowerKey]) {
          grouped[key][flowerKey] = { type: flower.type, colors: {}, totalStems: 0 };
        }
        grouped[key][flowerKey].totalStems += flower.stems;
        for (const [color, qty] of Object.entries(flower.colors)) {
          if (!grouped[key][flowerKey].colors[color]) {
            grouped[key][flowerKey].colors[color] = 0;
          }
          grouped[key][flowerKey].colors[color] += qty || 0;
        }
      }
    }
    setReport(grouped);
  };

  const formatKey = (key) => {
    if (view === "day") return formatDate(key);
    if (view === "week") return formatWeek(key);
    return `Year ${key}`;
  };

  const typeColors = { "Primary": "#d4547a", "Secondary": "#9b59b6" };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", fontFamily: "Cormorant Garamond, serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "26px", color: "#8b3a5e", fontWeight: "400", margin: "0 0 4px" }}>🌸 Flower Sourcing Report</h2>
        <p style={{ color: "#b06080", fontFamily: "Montserrat, sans-serif", fontSize: "12px", margin: 0 }}>Know exactly what to order & when</p>
      </div>

      {/* View Toggle */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "20px" }}>
        {[["day", "📅 By Day"], ["week", "📆 By Week"], ["year", "🗓️ By Year"]].map(([v, label]) => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "10px", borderRadius: "12px", fontSize: "13px",
            border: `1.5px solid ${view === v ? "#d4547a" : "#f0d0de"}`,
            background: view === v ? "#fce4ec" : "white",
            color: view === v ? "#8b3a5e" : "#b06080",
            cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: view === v ? "600" : "400"
          }}>{label}</button>
        ))}
      </div>

      {/* Refresh */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
        <button onClick={fetchOrders} style={{
          padding: "8px 16px", borderRadius: "20px", fontSize: "12px",
          border: "1.5px solid #f0d0de", background: "white",
          color: "#b06080", cursor: "pointer", fontFamily: "Montserrat, sans-serif"
        }}>🔄 Refresh</button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#b06080" }}>Loading orders...</div>
      ) : Object.keys(report).length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "16px", boxShadow: "0 2px 12px rgba(180,80,120,0.08)" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌿</div>
          <p style={{ color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>No orders with flower selections yet</p>
          <p style={{ color: "#c49aae", fontFamily: "Montserrat, sans-serif", fontSize: "12px" }}>Orders will appear here once customers build their bouquets</p>
        </div>
      ) : (
        Object.keys(report).sort().map(key => (
          <div key={key} style={{ marginBottom: "20px", background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(180,80,120,0.08)", border: "1px solid #f0d0de" }}>
            {/* Date Header */}
            <div style={{ padding: "14px 20px", background: "linear-gradient(135deg, #fff0f6, #fce4ec)", borderBottom: "1px solid #f0d0de", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#8b3a5e", fontWeight: "600" }}>{formatKey(key)}</h3>
              <span style={{ fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>
                {Object.keys(report[key]).length} flower types
              </span>
            </div>

            {/* Flowers Table */}
            <div style={{ padding: "16px" }}>
              {/* Column Headers */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1fr", gap: "8px", marginBottom: "8px", padding: "0 8px" }}>
                {["Flower", "Type", "Colors", "Stems"].map(h => (
                  <p key={h} style={{ margin: 0, fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</p>
                ))}
              </div>

              {Object.entries(report[key])
                .sort(([, a], [, b]) => a.type.localeCompare(b.type))
                .map(([flowerName, data]) => (
                <div key={flowerName} style={{
                  display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1fr", gap: "8px",
                  padding: "10px 8px", borderRadius: "10px", marginBottom: "6px",
                  background: "#fff8fb", border: "1px solid #f8e0eb",
                  alignItems: "start"
                }}>
                  <p style={{ margin: 0, fontSize: "15px", color: "#3a1a2e", fontWeight: "600" }}>{flowerName}</p>
                  <span style={{
                    padding: "2px 8px", borderRadius: "10px", fontSize: "10px",
                    background: data.type === "Primary" ? "#fce4ec" : "#f0e6ff",
                    color: typeColors[data.type] || "#8b3a5e",
                    fontFamily: "Montserrat, sans-serif", fontWeight: "600",
                    display: "inline-block", whiteSpace: "nowrap"
                  }}>{data.type}</span>
                  <div>
                    {Object.entries(data.colors).map(([color, qty]) => (
                      <div key={color} style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                        <span style={{ fontSize: "12px", color: "#5a2a3e", fontFamily: "Montserrat, sans-serif" }}>{color}</span>
                        {qty > 0 && <span style={{ fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{qty} stems</span>}
                      </div>
                    ))}
                  </div>
                  <p style={{ margin: 0, fontSize: "16px", color: "#d4547a", fontWeight: "600", fontFamily: "Montserrat, sans-serif" }}>
                    {data.totalStems > 0 ? data.totalStems : "—"}
                  </p>
                </div>
              ))}

              {/* Total row */}
              <div style={{ borderTop: "1px solid #f0d0de", paddingTop: "10px", marginTop: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ margin: 0, fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>TOTAL STEMS NEEDED</p>
                <p style={{ margin: 0, fontSize: "18px", color: "#8b3a5e", fontWeight: "600" }}>
                  {Object.values(report[key]).reduce((sum, d) => sum + d.totalStems, 0)}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
