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
    "mini carnation": "mini-carnation.jpg", "glitter": "roses.jpg",
    "pink": "peonies.jpg", "coral": "gerbera.jpg",
  };
  for (const key of Object.keys(fileMap)) {
    if (text.includes(key)) return "/flowers/" + fileMap[key];
  }
  return "/flowers/roses.jpg";
};


const SUPABASE_URL = "https://kxvdgjnybtwsusjvzmfc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4dmRnam55YnR3c3VzanZ6bWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDIwODEsImV4cCI6MjA5NTcxODA4MX0.8u1AZ0DJpyQc9ZnG8Pg6OTwrA_e5EgEjmpDXKUKdbHk";
const ADMIN_PASSWORD = "YazC2001";

const STATUS_COLORS = {
  "New": { bg: "#e3f2fd", text: "#1565c0" },
  "Confirmed": { bg: "#e8f5e9", text: "#2e7d32" },
  "In Progress": { bg: "#fff8e1", text: "#f57f17" },
  "Ready": { bg: "#f3e5f5", text: "#6a1b9a" },
  "Delivered": { bg: "#e0f2f1", text: "#00695c" },
  "Completed": { bg: "#fce4ec", text: "#880e4f" },
  "Cancelled": { bg: "#ffebee", text: "#c62828" },
};
const STATUS_OPTIONS = ["New", "Confirmed", "In Progress", "Ready", "Delivered", "Completed", "Cancelled"];

// ─── helpers ───────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── CALENDAR VIEW ─────────────────────────────────────────
function CalendarView({ orders }) {
  const [month, setMonth] = useState(new Date());
  const year = month.getFullYear();
  const mon = month.getMonth();
  const firstDay = new Date(year, mon, 1).getDay();
  const daysInMonth = new Date(year, mon + 1, 0).getDate();
  const today = new Date();

  const ordersByDate = {};
  orders.forEach(o => {
    if (o.date_needed) {
      if (!ordersByDate[o.date_needed]) ordersByDate[o.date_needed] = [];
      ordersByDate[o.date_needed].push(o);
    }
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <button onClick={() => setMonth(new Date(year, mon - 1, 1))} style={{ background: "white", border: "1.5px solid #f0d0de", borderRadius: "10px", padding: "8px 14px", color: "#b06080", cursor: "pointer", fontSize: "16px" }}>‹</button>
        <h3 style={{ margin: 0, color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontSize: "22px" }}>
          {month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <button onClick={() => setMonth(new Date(year, mon + 1, 1))} style={{ background: "white", border: "1.5px solid #f0d0de", borderRadius: "10px", padding: "8px 14px", color: "#b06080", cursor: "pointer", fontSize: "16px" }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "4px" }}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "10px", color: "#b06080", fontWeight: "600", fontFamily: "Montserrat, sans-serif", padding: "4px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = `${year}-${String(mon + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayOrders = ordersByDate[dateStr] || [];
          const isToday = today.getDate() === day && today.getMonth() === mon && today.getFullYear() === year;
          return (
            <div key={i} style={{
              minHeight: "64px", padding: "6px", borderRadius: "10px",
              background: isToday ? "#fce4ec" : dayOrders.length > 0 ? "#fff8fb" : "white",
              border: isToday ? "1.5px solid #d4547a" : "1px solid #f0e0ea",
            }}>
              <div style={{ fontSize: "11px", fontWeight: "600", color: isToday ? "#d4547a" : "#8b3a5e", marginBottom: "3px", fontFamily: "Montserrat, sans-serif" }}>{day}</div>
              {dayOrders.slice(0, 3).map(o => (
                <div key={o.id} style={{
                  fontSize: "9px", borderRadius: "4px", padding: "2px 4px", marginBottom: "2px",
                  background: STATUS_COLORS[o.status]?.bg || "#f5f5f5",
                  color: STATUS_COLORS[o.status]?.text || "#555",
                  fontFamily: "Montserrat, sans-serif", fontWeight: "600",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                }}>{o.first_name} {o.last_name?.charAt(0)}.</div>
              ))}
              {dayOrders.length > 3 && <div style={{ fontSize: "9px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>+{dayOrders.length - 3} more</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── FINANCE VIEW ────────────────────────────────────────
function FinanceView({ orders }) {
  const [period, setPeriod] = useState("month");

  const now = new Date();
  const filtered = orders.filter(o => {
    if (!o.created_at) return false;
    const d = new Date(o.created_at);
    if (period === "day") return d.toDateString() === now.toDateString();
    if (period === "week") {
      const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
      return d >= weekAgo;
    }
    if (period === "month") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (period === "year") return d.getFullYear() === now.getFullYear();
    return true;
  });

  const revenue = filtered.reduce((s, o) => s + (parseFloat(o.total_price) || 0), 0);
  const paidRevenue = filtered.filter(o => o.is_paid).reduce((s, o) => s + (parseFloat(o.total_price) || 0), 0);
  const pendingRevenue = revenue - paidRevenue;
  const materials = filtered.reduce((s, o) => s + (parseFloat(o.material_cost) || 0), 0);
  const labor = filtered.reduce((s, o) => s + (parseFloat(o.labor_fee) || 0), 0);
  const delivery = filtered.reduce((s, o) => s + (parseFloat(o.delivery_fee) || 0), 0);
  const profit = paidRevenue - materials;

  // Payment method breakdown
  const payMethods = ["Square", "Cash", "Zelle", "CashApp"];
  const methodTotals = payMethods.map(m => ({
    method: m,
    total: filtered.filter(o => o.is_paid && o.payment_method === m).reduce((s, o) => s + (parseFloat(o.total_price) || 0), 0),
    count: filtered.filter(o => o.is_paid && o.payment_method === m).length
  })).filter(m => m.count > 0);

  const periodLabels = { day: "Today", week: "This Week", month: "This Month", year: "This Year" };

  return (
    <div style={{ padding: "16px", maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "#8b3a5e", fontSize: "22px", fontWeight: "400", margin: "0 0 16px" }}>💵 Finance & Profit Tracker</h2>

      {/* Period selector */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {["day", "week", "month", "year"].map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{
            flex: 1, padding: "8px", borderRadius: "10px", fontSize: "12px", cursor: "pointer",
            border: `1.5px solid ${period === p ? "#d4547a" : "#f0d0de"}`,
            background: period === p ? "#d4547a" : "white",
            color: period === p ? "white" : "#b06080",
            fontFamily: "Montserrat, sans-serif", fontWeight: "600"
          }}>{periodLabels[p]}</button>
        ))}
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
        {[
          { label: "Total Revenue", value: revenue, emoji: "💰", color: "#2e7d32", bg: "#e8f5e9" },
          { label: "Paid ✅", value: paidRevenue, emoji: "✅", color: "#1b5e20", bg: "#c8e6c9" },
          { label: "Pending 🕐", value: pendingRevenue, emoji: "🕐", color: "#e65100", bg: "#fff3e0" },
          { label: "Net Profit", value: profit, emoji: "📈", color: profit >= 0 ? "#2e7d32" : "#c62828", bg: profit >= 0 ? "#e8f5e9" : "#ffebee" },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, borderRadius: "14px", padding: "16px", textAlign: "center", border: `1px solid ${c.color}22` }}>
            <div style={{ fontSize: "24px", marginBottom: "4px" }}>{c.emoji}</div>
            <div style={{ fontSize: "26px", fontWeight: "600", color: c.color, fontFamily: "Cormorant Garamond, serif" }}>${c.value.toFixed(2)}</div>
            <div style={{ fontSize: "10px", color: "#666", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Payment method breakdown */}
      {methodTotals.length > 0 && (
        <div style={{ background: "white", borderRadius: "14px", padding: "16px", marginBottom: "20px", border: "1px solid #f0d0de" }}>
          <p style={{ margin: "0 0 10px", fontSize: "11px", color: "#b06080", fontWeight: "600", fontFamily: "Montserrat, sans-serif" }}>PAYMENT METHODS</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px" }}>
            {methodTotals.map(m => (
              <div key={m.method} style={{ background: "#f8fce8", borderRadius: "10px", padding: "10px", border: "1px solid #c5e1a5", textAlign: "center" }}>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#33691e", fontFamily: "Montserrat, sans-serif" }}>{m.method}</div>
                <div style={{ fontSize: "18px", fontWeight: "600", color: "#2e7d32", fontFamily: "Cormorant Garamond, serif" }}>${m.total.toFixed(2)}</div>
                <div style={{ fontSize: "10px", color: "#558b2f", fontFamily: "Montserrat, sans-serif" }}>{m.count} order{m.count > 1 ? "s" : ""}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Margin */}
      {revenue > 0 && (
        <div style={{ background: "white", borderRadius: "14px", padding: "16px", marginBottom: "20px", border: "1px solid #f0d0de" }}>
          <p style={{ margin: "0 0 8px", fontSize: "11px", color: "#b06080", fontWeight: "600", fontFamily: "Montserrat, sans-serif" }}>PROFIT MARGIN</p>
          <div style={{ background: "#f0d0de", borderRadius: "10px", height: "12px", overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg, #d4547a, #c0396a)", height: "100%", width: `${Math.min(100, Math.max(0, (profit / revenue) * 100))}%`, borderRadius: "10px", transition: "width 0.5s" }} />
          </div>
          <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#8b3a5e", fontWeight: "600", fontFamily: "Montserrat, sans-serif", textAlign: "right" }}>{((profit / revenue) * 100).toFixed(1)}%</p>
        </div>
      )}

      {/* Order breakdown */}
      <div style={{ background: "white", borderRadius: "14px", padding: "16px", border: "1px solid #f0d0de" }}>
        <p style={{ margin: "0 0 12px", fontSize: "11px", color: "#b06080", fontWeight: "600", fontFamily: "Montserrat, sans-serif" }}>ORDER BREAKDOWN — {periodLabels[period].toUpperCase()}</p>
        {filtered.length === 0 ? (
          <p style={{ color: "#b06080", fontSize: "13px", textAlign: "center", fontFamily: "Montserrat, sans-serif" }}>No orders for this period</p>
        ) : filtered.map(o => (
          <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f8e8f0" }}>
            <div>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#3a1a2e", fontFamily: "Montserrat, sans-serif" }}>{o.first_name} {o.last_name}</p>
              <p style={{ margin: 0, fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{o.occasion} · {o.status}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#2e7d32", fontFamily: "Cormorant Garamond, serif" }}>${(parseFloat(o.total_price) || 0).toFixed(2)}</p>
              {o.is_paid
                ? <span style={{ fontSize: "10px", color: "#2e7d32", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>✅ {o.payment_method}</span>
                : o.deposit_paid
                ? <span style={{ fontSize: "10px", color: "#f57f17", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>💛 Deposit Paid</span>
                : <span style={{ fontSize: "10px", color: "#e65100", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>🕐 Unpaid</span>
              }
              {o.material_cost > 0 && <p style={{ margin: 0, fontSize: "11px", color: "#e65100", fontFamily: "Montserrat, sans-serif" }}>-${(parseFloat(o.material_cost) || 0).toFixed(2)} cost</p>}
            </div>
          </div>
        ))}
        {filtered.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", marginTop: "4px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#8b3a5e", fontFamily: "Montserrat, sans-serif" }}>Total Profit</span>
            <span style={{ fontSize: "16px", fontWeight: "600", color: profit >= 0 ? "#2e7d32" : "#c62828", fontFamily: "Cormorant Garamond, serif" }}>${profit.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ANALYTICS VIEW ────────────────────────────────────────
function AnalyticsView({ orders }) {
  const monthlyData = {};
  const bouquetCount = {};
  const sourceCount = {};
  const budgetCount = {};

  orders.forEach(o => {
    if (o.created_at) {
      const key = o.created_at.substring(0, 7);
      monthlyData[key] = (monthlyData[key] || 0) + 1;
    }
    if (o.bouquet_summary) {
      const match = o.bouquet_summary.match(/Primary: ([^|]+)/);
      if (match) {
        const flowers = match[1].split(",").map(f => f.trim().split("(")[0].trim());
        flowers.forEach(f => { if (f) bouquetCount[f] = (bouquetCount[f] || 0) + 1; });
      }
    }
    if (o.source) sourceCount[o.source] = (sourceCount[o.source] || 0) + 1;
    if (o.budget) budgetCount[o.budget] = (budgetCount[o.budget] || 0) + 1;
  });

  const months = Object.keys(monthlyData).sort().slice(-6);
  const maxOrders = Math.max(...months.map(m => monthlyData[m]), 1);
  const topBouquets = Object.entries(bouquetCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      {/* Orders per month */}
      <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 12px rgba(180,80,120,0.08)", border: "1px solid #f0d0de" }}>
        <h3 style={{ margin: "0 0 16px", color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontWeight: "400" }}>📊 Orders Per Month</h3>
        {months.length === 0 ? <p style={{ color: "#b06080", fontFamily: "Montserrat, sans-serif", fontSize: "13px" }}>No data yet</p> : (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "120px" }}>
            {months.map(m => (
              <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ fontSize: "11px", color: "#8b3a5e", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>{monthlyData[m]}</div>
                <div style={{
                  width: "100%", borderRadius: "6px 6px 0 0",
                  background: "linear-gradient(180deg, #d4547a, #f4a7b9)",
                  height: `${(monthlyData[m] / maxOrders) * 80}px`, minHeight: "4px"
                }} />
                <div style={{ fontSize: "9px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{m.substring(5)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top flowers */}
      <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 12px rgba(180,80,120,0.08)", border: "1px solid #f0d0de" }}>
        <h3 style={{ margin: "0 0 16px", color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontWeight: "400" }}>🌹 Most Requested Flowers</h3>
        {topBouquets.length === 0 ? <p style={{ color: "#b06080", fontFamily: "Montserrat, sans-serif", fontSize: "13px" }}>No bouquet data yet</p> : topBouquets.map(([name, count], i) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <div style={{ width: "20px", fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>#{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "13px", color: "#3a1a2e", fontFamily: "Montserrat, sans-serif" }}>{name}</span>
                <span style={{ fontSize: "12px", color: "#d4547a", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>{count}</span>
              </div>
              <div style={{ height: "6px", borderRadius: "3px", background: "#f8e0eb" }}>
                <div style={{ height: "100%", borderRadius: "3px", background: "linear-gradient(90deg, #d4547a, #f4a7b9)", width: `${(count / (topBouquets[0]?.[1] || 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
        {[
          { label: "Total Orders", value: orders.length, emoji: "📋" },
          { label: "Delivered", value: orders.filter(o => o.status === "Delivered").length, emoji: "✅" },
          { label: "This Month", value: monthlyData[new Date().toISOString().substring(0, 7)] || 0, emoji: "📅" },
        ].map(s => (
          <div key={s.label} style={{ background: "white", borderRadius: "14px", padding: "16px", textAlign: "center", boxShadow: "0 2px 12px rgba(180,80,120,0.08)", border: "1px solid #f0d0de" }}>
            <div style={{ fontSize: "24px", marginBottom: "6px" }}>{s.emoji}</div>
            <div style={{ fontSize: "28px", fontWeight: "600", color: "#d4547a", fontFamily: "Cormorant Garamond, serif" }}>{s.value}</div>
            <div style={{ fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>{s.label}</div>
          </div>
        ))}
      </div>


    </div>
  );
}

// ─── INVENTORY VIEW ────────────────────────────────────────
function InventoryView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", unit: "stems", low_threshold: "10" });
  const [adding, setAdding] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [priceInput, setPriceInput] = useState("");
  const [holidayMode, setHolidayMode] = useState(false);
  const [showPwPrompt, setShowPwPrompt] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const [invRes, holidayRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/inventory?select=*&order=name.asc`, {
          headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        }),
        fetch(`${SUPABASE_URL}/rest/v1/settings?select=value&key=eq.holiday_mode`, {
          headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        })
      ]);
      const data = await invRes.json();
      const holidayData = await holidayRes.json();
      setItems(Array.isArray(data) ? data : []);
      if (Array.isArray(holidayData) && holidayData[0]) {
        setHolidayMode(holidayData[0].value === "true" || holidayData[0].value === true);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchInventory(); }, []);

  const confirmToggle = async () => {
    if (pwInput !== ADMIN_PASSWORD) { setPwError("Wrong password"); return; }
    const newVal = !holidayMode;
    setHolidayMode(newVal);
    setShowPwPrompt(false); setPwInput(""); setPwError("");
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/settings`, {
        method: "POST",
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({ key: "holiday_mode", value: String(newVal) })
      });
    } catch (e) { console.error("Failed to save holiday mode", e); }
  };

  const updateQty = async (id, delta) => {
    const item = items.find(i => i.id === id);
    const newQty = Math.max(0, (item.quantity || 0) + delta);
    await fetch(`${SUPABASE_URL}/rest/v1/inventory?id=eq.${id}`, {
      method: "PATCH",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
      body: JSON.stringify({ quantity: newQty })
    });
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: newQty } : i));
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.quantity) return;
    const res = await fetch(`${SUPABASE_URL}/rest/v1/inventory`, {
      method: "POST",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=representation" },
      body: JSON.stringify({ name: newItem.name, quantity: parseInt(newItem.quantity), unit: newItem.unit, low_threshold: parseInt(newItem.low_threshold) || 10 })
    });
    const data = await res.json();
    if (Array.isArray(data)) setItems(prev => [...prev, ...data]);
    setNewItem({ name: "", quantity: "", unit: "stems", low_threshold: "10" });
    setAdding(false);
  };

  const deleteItem = async (id) => {
    await fetch(`${SUPABASE_URL}/rest/v1/inventory?id=eq.${id}`, {
      method: "DELETE",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const savePrice = async (id) => {
    await fetch(`${SUPABASE_URL}/rest/v1/inventory?id=eq.${id}`, {
      method: "PATCH",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
      body: JSON.stringify({ standard_cost: parseFloat(priceInput) || 0 })
    });
    setItems(prev => prev.map(i => i.id === id ? { ...i, standard_cost: parseFloat(priceInput) || 0 } : i));
    setEditingPrice(null);
  };

  const lowStock = items.filter(i => i.quantity <= i.low_threshold);

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      {lowStock.length > 0 && (
        <div style={{ background: "#fff3e0", border: "1.5px solid #ffb74d", borderRadius: "14px", padding: "14px 16px", marginBottom: "16px" }}>
          <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#e65100", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>⚠️ Low Stock Alert</p>
          {lowStock.map(i => (
            <p key={i.id} style={{ margin: "2px 0", fontSize: "12px", color: "#bf360c", fontFamily: "Montserrat, sans-serif" }}>• {i.name} — only {i.quantity} {i.unit} left</p>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <h3 style={{ margin: 0, color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontSize: "22px", fontWeight: "400" }}>📦 Inventory</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>Holiday Pricing</span>
            <div onClick={() => { setShowPwPrompt(true); setPwInput(""); setPwError(""); }} style={{ width: "44px", height: "24px", borderRadius: "12px", cursor: "pointer", background: holidayMode ? "#d4547a" : "#e0e0e0", position: "relative" }}>
              <div style={{ position: "absolute", top: "3px", left: holidayMode ? "23px" : "3px", width: "18px", height: "18px", borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </div>
          </div>
          <button onClick={() => setAdding(!adding)} style={{ background: "linear-gradient(135deg, #d4547a, #c0396a)", border: "none", color: "white", borderRadius: "10px", padding: "8px 16px", fontSize: "12px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>+ Add Item</button>
        </div>
      </div>

      {showPwPrompt && (
        <div style={{ background: "#fff8fb", borderRadius: "12px", padding: "14px", marginBottom: "14px", border: "1.5px solid #f0d0de" }}>
          <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#8b3a5e", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>
            {holidayMode ? "🔓 Turn OFF Holiday Pricing?" : "🎄 Turn ON Holiday Pricing?"} Enter password to confirm:
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="password" placeholder="Password" value={pwInput} onChange={e => { setPwInput(e.target.value); setPwError(""); }}
              style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "13px", fontFamily: "Montserrat, sans-serif" }} />
            <button onClick={confirmToggle} style={{ background: "#d4547a", border: "none", color: "white", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>Confirm</button>
            <button onClick={() => { setShowPwPrompt(false); setPwInput(""); setPwError(""); }} style={{ background: "white", border: "1px solid #f0d0de", color: "#8b3a5e", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", cursor: "pointer" }}>Cancel</button>
          </div>
          {pwError && <p style={{ margin: "6px 0 0", fontSize: "11px", color: "#c62828", fontFamily: "Montserrat, sans-serif" }}>{pwError}</p>}
        </div>
      )}

      {adding && (
        <div style={{ background: "white", borderRadius: "14px", padding: "16px", marginBottom: "14px", border: "1.5px solid #f0d0de" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "8px", marginBottom: "10px" }}>
            <input placeholder="Flower / item name" value={newItem.name} onChange={e => setNewItem(s => ({ ...s, name: e.target.value }))}
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "13px", fontFamily: "Montserrat, sans-serif" }} />
            <input type="number" placeholder="Qty" value={newItem.quantity} onChange={e => setNewItem(s => ({ ...s, quantity: e.target.value }))}
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "13px", fontFamily: "Montserrat, sans-serif" }} />
            <input placeholder="Unit" value={newItem.unit} onChange={e => setNewItem(s => ({ ...s, unit: e.target.value }))}
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "13px", fontFamily: "Montserrat, sans-serif" }} />
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input type="number" placeholder="Low stock alert at" value={newItem.low_threshold} onChange={e => setNewItem(s => ({ ...s, low_threshold: e.target.value }))}
              style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "13px", fontFamily: "Montserrat, sans-serif" }} />
            <button onClick={addItem} style={{ background: "linear-gradient(135deg, #d4547a, #c0396a)", border: "none", color: "white", borderRadius: "8px", padding: "8px 20px", fontSize: "13px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>Save</button>
            <button onClick={() => setAdding(false)} style={{ background: "white", border: "1.5px solid #f0d0de", color: "#b06080", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <p style={{ textAlign: "center", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>Loading...</p> : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "16px", border: "1px solid #f0d0de" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>📦</div>
          <p style={{ color: "#b06080", fontFamily: "Montserrat, sans-serif", fontSize: "13px" }}>No inventory items yet. Add your first item above.</p>
        </div>
      ) : items.map(item => (
        <div key={item.id} style={{ background: "white", borderRadius: "14px", padding: "14px 16px", marginBottom: "10px", boxShadow: "0 2px 12px rgba(180,80,120,0.06)", border: `1px solid ${item.quantity <= item.low_threshold ? "#ffb74d" : "#f0d0de"}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px", color: "#3a1a2e", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>{item.name}</span>
                {item.quantity <= item.low_threshold && <span style={{ fontSize: "10px", background: "#fff3e0", color: "#e65100", padding: "2px 8px", borderRadius: "10px", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>⚠️ LOW</span>}
              </div>
              <span style={{ fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>Alert at {item.low_threshold} {item.unit}</span>
              {editingPrice === item.id ? (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#b06080" }}>$</span>
                  <input type="number" placeholder="0.00" value={priceInput} onChange={e => setPriceInput(e.target.value)}
                    style={{ width: "80px", padding: "5px 8px", borderRadius: "6px", border: "1.5px solid #d4547a", fontSize: "13px" }} />
                  <button onClick={() => savePrice(item.id)} style={{ background: "#d4547a", border: "none", color: "white", borderRadius: "6px", padding: "5px 10px", fontSize: "11px", cursor: "pointer", fontWeight: "600" }}>Save</button>
                  <button onClick={() => setEditingPrice(null)} style={{ background: "white", border: "1px solid #f0d0de", color: "#8b3a5e", borderRadius: "6px", padding: "5px 8px", fontSize: "11px", cursor: "pointer" }}>✕</button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                  <span style={{ fontSize: "11px", color: holidayMode ? "#e65100" : "#2e7d32", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>
                    ${holidayMode ? parseFloat((item.standard_cost || 0) * 2).toFixed(2) : parseFloat(item.standard_cost || 0).toFixed(2)}/stem
                    {holidayMode && <span style={{ fontSize: "10px", color: "#e65100", marginLeft: "4px" }}>🎄 holiday</span>}
                  </span>
                  <button onClick={() => { setEditingPrice(item.id); setPriceInput(item.standard_cost || ""); }} style={{ background: "#fce4ec", border: "none", color: "#d4547a", borderRadius: "6px", padding: "3px 8px", fontSize: "10px", cursor: "pointer", fontWeight: "600" }}>✏️ Edit Price</button>
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button onClick={() => updateQty(item.id, -10)} style={{ background: "#f8e0eb", border: "none", borderRadius: "6px", width: "28px", height: "28px", cursor: "pointer", color: "#d4547a", fontSize: "14px", fontWeight: "600" }}>−−</button>
              <button onClick={() => updateQty(item.id, -1)} style={{ background: "#f8e0eb", border: "none", borderRadius: "6px", width: "28px", height: "28px", cursor: "pointer", color: "#d4547a", fontSize: "14px", fontWeight: "600" }}>−</button>
              <span style={{ fontSize: "16px", fontWeight: "600", color: "#8b3a5e", fontFamily: "Montserrat, sans-serif", minWidth: "50px", textAlign: "center" }}>{item.quantity} <span style={{ fontSize: "11px", fontWeight: "400" }}>{item.unit}</span></span>
              <button onClick={() => updateQty(item.id, 1)} style={{ background: "#e8f5e9", border: "none", borderRadius: "6px", width: "28px", height: "28px", cursor: "pointer", color: "#2e7d32", fontSize: "14px", fontWeight: "600" }}>+</button>
              <button onClick={() => updateQty(item.id, 10)} style={{ background: "#e8f5e9", border: "none", borderRadius: "6px", width: "28px", height: "28px", cursor: "pointer", color: "#2e7d32", fontSize: "14px", fontWeight: "600" }}>++</button>
              <button onClick={() => deleteItem(item.id)} style={{ background: "#ffebee", border: "none", borderRadius: "6px", width: "28px", height: "28px", cursor: "pointer", color: "#c62828", fontSize: "14px" }}>🗑</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── REVIEWS VIEW ──────────────────────────────────────────
function ReviewsView() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/reviews?select=*&order=created_at.desc`, {
          headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        });
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  const avg = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1) : "—";

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ background: "linear-gradient(135deg, #fff0f6, #fce4ec)", borderRadius: "16px", padding: "20px", marginBottom: "16px", textAlign: "center", border: "1px solid #f0d0de" }}>
        <div style={{ fontSize: "40px", fontFamily: "Cormorant Garamond, serif", color: "#d4547a", fontWeight: "600" }}>{avg}</div>
        <div style={{ fontSize: "20px", marginBottom: "4px" }}>{"★".repeat(Math.round(avg))}</div>
        <div style={{ fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
      </div>

      {loading ? <p style={{ textAlign: "center", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>Loading...</p> :
        reviews.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "16px", border: "1px solid #f0d0de" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>⭐</div>
            <p style={{ color: "#b06080", fontFamily: "Montserrat, sans-serif", fontSize: "13px" }}>No reviews yet. They'll appear here once customers submit them.</p>
          </div>
        ) : reviews.map(r => (
          <div key={r.id} style={{ background: "white", borderRadius: "14px", padding: "16px", marginBottom: "10px", boxShadow: "0 2px 12px rgba(180,80,120,0.06)", border: "1px solid #f0d0de" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <div>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#3a1a2e", fontFamily: "Montserrat, sans-serif" }}>{r.customer_name || "Customer"}</span>
                <div style={{ fontSize: "16px", color: "#f9ca24", marginTop: "2px" }}>{"★".repeat(r.rating || 0)}{"☆".repeat(5 - (r.rating || 0))}</div>
              </div>
              <span style={{ fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{r.created_at ? new Date(r.created_at).toLocaleDateString() : ""}</span>
            </div>
            {r.comment && <p style={{ margin: 0, fontSize: "13px", color: "#5a2a3e", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", lineHeight: "1.6" }}>"{r.comment}"</p>}
          </div>
        ))
      }
    </div>
  );
}

// ─── DELIVERY MAP VIEW ─────────────────────────────────────
const SHOP_LAT = 29.7468;
const SHOP_LNG = -95.3352; // 410 Exchange St, Houston TX 77020

const DELIVERY_ZONES = [
  { maxMiles: 5,  fee: 10, label: "Zone 1" },
  { maxMiles: 10, fee: 15, label: "Zone 2" },
  { maxMiles: 15, fee: 20, label: "Zone 3" },
  { maxMiles: 20, fee: 25, label: "Zone 4" },
];

function haversine(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function getZone(miles) {
  for (const z of DELIVERY_ZONES) {
    if (miles <= z.maxMiles) return z;
  }
  return null; // outside range
}

function DeliveryMapView({ orders }) {
  const deliveryOrders = orders.filter(o => o.delivery_type === "delivery" && o.delivery_address);
  const [selected, setSelected] = useState(null);
  const [distances, setDistances] = useState({});
  const [geocoding, setGeocoding] = useState(false);
  const [customFees, setCustomFees] = useState({});

  const MAPS_KEY = "AIzaSyDGBwlMgOy3Figp08Yd-i3Ix_JH-uIsz-E";
  const mapSrc = selected
    ? `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${encodeURIComponent(selected.delivery_address + ", " + (selected.delivery_city || "Houston") + ", TX " + (selected.delivery_zip || ""))}&zoom=16`
    : `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=Houston,TX&zoom=11`;

  const geocodeOrder = async (order) => {
    if (distances[order.id]) return; // already computed
    const addr = `${order.delivery_address}, ${order.delivery_city || "Houston"}, TX ${order.delivery_zip || ""}`;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}&limit=1`, {
        headers: { "User-Agent": "PrettyPetals/1.0" }
      });
      const data = await res.json();
      if (data && data[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const miles = haversine(SHOP_LAT, SHOP_LNG, lat, lng);
        const zone = getZone(miles);
        setDistances(prev => ({ ...prev, [order.id]: { miles: miles.toFixed(1), zone: zone?.label || "Outside Zone", fee: zone?.fee || null } }));
      }
    } catch (e) { console.error("Geocode error", e); }
  };

  const geocodeAll = async () => {
    setGeocoding(true);
    for (const order of deliveryOrders) {
      await geocodeOrder(order);
      await new Promise(r => setTimeout(r, 1100)); // Nominatim rate limit: 1 req/sec
    }
    setGeocoding(false);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      {/* Zone legend */}
      <div style={{ background: "white", borderRadius: "14px", padding: "14px 16px", marginBottom: "14px", border: "1px solid #f0d0de" }}>
        <p style={{ margin: "0 0 8px", fontSize: "11px", color: "#b06080", fontWeight: "600", fontFamily: "Montserrat, sans-serif" }}>DELIVERY ZONES (from 410 Exchange St)</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px" }}>
          {DELIVERY_ZONES.map(z => (
            <div key={z.label} style={{ background: "#fff8fb", borderRadius: "10px", padding: "8px", textAlign: "center", border: "1px solid #f0d0de" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#d4547a", fontFamily: "Montserrat, sans-serif" }}>{z.label}</div>
              <div style={{ fontSize: "10px", color: "#8b3a5e", fontFamily: "Montserrat, sans-serif" }}>≤{z.maxMiles} mi</div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#2e7d32", fontFamily: "Montserrat, sans-serif" }}>${z.fee}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>20+ miles = enter custom fee on the order</span>
          <button onClick={geocodeAll} disabled={geocoding} style={{ background: geocoding ? "#f0d0de" : "#d4547a", border: "none", color: "white", borderRadius: "8px", padding: "6px 14px", fontSize: "11px", cursor: geocoding ? "not-allowed" : "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>
            {geocoding ? "Calculating..." : "📍 Calculate All Distances"}
          </button>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", marginBottom: "16px", boxShadow: "0 2px 12px rgba(180,80,120,0.08)", border: "1px solid #f0d0de" }}>
        <iframe
          key={mapSrc}
          title="Delivery Map"
          src={mapSrc}
          style={{ width: "100%", height: "300px", border: "none" }}
        />
      </div>

      {selected && (
        <div style={{ background: "#fce4ec", borderRadius: "12px", padding: "12px 16px", marginBottom: "12px", border: "1.5px solid #d4547a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#8b3a5e", fontFamily: "Montserrat, sans-serif" }}>📍 {selected.first_name} {selected.last_name}</p>
            <p style={{ margin: 0, fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{selected.delivery_address}, {selected.delivery_city} {selected.delivery_zip}</p>
            {distances[selected.id] && (
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#2e7d32", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>
                {distances[selected.id].miles} miles · {distances[selected.id].zone} · {distances[selected.id].fee ? `$${distances[selected.id].fee} delivery fee` : customFees[selected.id] ? `$${customFees[selected.id]} custom fee` : "Outside delivery zone — enter custom fee below"}
              </p>
            )}
          </div>
          <button onClick={() => setSelected(null)} style={{ background: "white", border: "1px solid #f0d0de", borderRadius: "8px", padding: "6px 12px", color: "#b06080", cursor: "pointer", fontSize: "12px" }}>Clear</button>
        </div>
      )}

      <h3 style={{ margin: "0 0 12px", color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontWeight: "400" }}>🗺️ Delivery Orders — tap to pin</h3>

      {deliveryOrders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "16px", border: "1px solid #f0d0de" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🗺️</div>
          <p style={{ color: "#b06080", fontFamily: "Montserrat, sans-serif", fontSize: "13px" }}>No delivery orders yet.</p>
        </div>
      ) : deliveryOrders.map(o => {
        const dist = distances[o.id];
        const isOutside = dist && !dist.fee;
        const customFee = customFees[o.id] || "";
        return (
          <div key={o.id} onClick={() => { setSelected(o); geocodeOrder(o); }} style={{ background: selected?.id === o.id ? "#fce4ec" : "white", borderRadius: "14px", padding: "14px 16px", marginBottom: "10px", boxShadow: "0 2px 8px rgba(180,80,120,0.06)", border: `1.5px solid ${selected?.id === o.id ? "#d4547a" : "#f0d0de"}`, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "600", color: "#3a1a2e", fontFamily: "Montserrat, sans-serif" }}>📍 {o.first_name} {o.last_name}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{o.delivery_address}, {o.delivery_city} {o.delivery_zip}</p>
                {dist ? (
                  <div>
                    <p style={{ margin: "3px 0 0", fontSize: "11px", color: isOutside ? "#c62828" : "#2e7d32", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>
                      {dist.miles} mi · {dist.zone}{!isOutside ? ` · $${dist.fee} fee` : " · Outside standard zones"}
                    </p>
                    {isOutside && (
                      <div onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                        <span style={{ fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>Custom fee: $</span>
                        <input
                          type="number"
                          placeholder="0"
                          value={customFee}
                          onChange={e => setCustomFees(prev => ({ ...prev, [o.id]: e.target.value }))}
                          style={{ width: "70px", padding: "4px 8px", borderRadius: "6px", border: "1.5px solid #d4547a", fontSize: "13px", fontFamily: "Montserrat, sans-serif" }}
                        />
                        {customFee && <span style={{ fontSize: "12px", color: "#2e7d32", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>= ${customFee} delivery</span>}
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ margin: "3px 0 0", fontSize: "10px", color: "#c49aae", fontFamily: "Montserrat, sans-serif" }}>Tap to calculate distance</p>
                )}
              </div>
              <span style={{ padding: "2px 10px", borderRadius: "20px", fontSize: "10px", background: STATUS_COLORS[o.status]?.bg || "#f5f5f5", color: STATUS_COLORS[o.status]?.text || "#555", fontWeight: "600", fontFamily: "Montserrat, sans-serif" }}>{o.status}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── FLOWER REPORT VIEW ────────────────────────────────────
function FlowerReportView({ orders }) {
  const [view, setView] = useState("day");

  function parseFlowers(summary) {
    if (!summary) return [];
    const flowers = [];
    const parts = summary.split(" | ");
    for (const part of parts) {
      if (!part.startsWith("Primary:") && !part.startsWith("Secondary:")) continue;
      const type = part.startsWith("Primary:") ? "Primary" : "Secondary";
      const itemsStr = part.replace("Primary:", "").replace("Secondary:", "").trim();
      const items = [];
      let depth = 0, current = "";
      for (let i = 0; i < itemsStr.length; i++) {
        const ch = itemsStr[i];
        if (ch === "(") depth++;
        else if (ch === ")") depth--;
        if (ch === "," && depth === 0 && itemsStr[i + 1] === " ") { items.push(current.trim()); current = ""; i++; }
        else current += ch;
      }
      if (current.trim()) items.push(current.trim());
      for (const item of items) {
        const match = item.match(/^(.+?)\s*\((.+)\)$/);
        if (match) {
          const name = match[1].trim();
          const details = match[2];
          if (details.includes("—")) {
            const [totalPart, colorPart] = details.split("—").map(s => s.trim());
            const totalMatch = totalPart.match(/(\d+)\s*stems/);
            const totalStems = totalMatch ? parseInt(totalMatch[1]) : 0;
            const colors = {};
            if (colorPart) colorPart.split(",").forEach(seg => { const cm = seg.trim().match(/^(.+?):\s*(\d+)$/); if (cm) colors[cm[1].trim()] = parseInt(cm[2]); });
            flowers.push({ type, name, colors: Object.keys(colors).length ? colors : { "Assorted": totalStems }, stems: totalStems });
          } else {
            const stemMatch = details.match(/(\d+)\s*stems?/);
            const stems = stemMatch ? parseInt(stemMatch[1]) : 0;
            flowers.push({ type, name, colors: { "Assorted": stems }, stems });
          }
        } else if (item.trim()) {
          flowers.push({ type, name: item.trim(), colors: { "Assorted": 0 }, stems: 0 });
        }
      }
    }
    return flowers;
  }

  const grouped = {};
  for (const order of orders.filter(o => o.bouquet_summary && o.date_needed)) {
    const flowers = parseFlowers(order.bouquet_summary);
    if (!flowers.length) continue;
    let key = view === "day" ? order.date_needed : view === "week" ? (() => { const d = new Date(order.date_needed); d.setDate(d.getDate() - d.getDay()); return d.toISOString().split("T")[0]; })() : order.date_needed.substring(0, 4);
    if (!grouped[key]) grouped[key] = {};
    for (const f of flowers) {
      if (!grouped[key][f.name]) grouped[key][f.name] = { type: f.type, colors: {}, totalStems: 0 };
      grouped[key][f.name].totalStems += f.stems;
      for (const [c, q] of Object.entries(f.colors)) grouped[key][f.name].colors[c] = (grouped[key][f.name].colors[c] || 0) + (q || 0);
    }
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        {[["day", "📅 By Day"], ["week", "📆 By Week"], ["year", "🗓️ By Year"]].map(([v, label]) => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "10px", borderRadius: "12px", fontSize: "12px",
            border: `1.5px solid ${view === v ? "#d4547a" : "#f0d0de"}`,
            background: view === v ? "#fce4ec" : "white",
            color: view === v ? "#8b3a5e" : "#b06080",
            cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: view === v ? "600" : "400"
          }}>{label}</button>
        ))}
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "16px", border: "1px solid #f0d0de" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🌿</div>
          <p style={{ color: "#b06080", fontFamily: "Montserrat, sans-serif", fontSize: "13px" }}>No flower selections yet. Appears once customers build bouquets.</p>
        </div>
      ) : Object.keys(grouped).sort().map(key => (
        <div key={key} style={{ marginBottom: "16px", background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(180,80,120,0.08)", border: "1px solid #f0d0de" }}>
          <div style={{ padding: "14px 20px", background: "linear-gradient(135deg, #fff0f6, #fce4ec)", borderBottom: "1px solid #f0d0de", display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0, fontSize: "17px", color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontWeight: "600" }}>{fmtDate(key)}</h3>
            <span style={{ fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>{Object.keys(grouped[key]).length} flower types</span>
          </div>
          <div style={{ padding: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1fr", gap: "8px", marginBottom: "8px", padding: "0 8px" }}>
              {["Flower", "Type", "Colors", "Stems"].map(h => (
                <p key={h} style={{ margin: 0, fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600", textTransform: "uppercase" }}>{h}</p>
              ))}
            </div>
            {Object.entries(grouped[key]).sort(([, a], [, b]) => a.type.localeCompare(b.type)).map(([name, data]) => (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1fr", gap: "8px", padding: "10px 8px", borderRadius: "10px", marginBottom: "6px", background: "#fff8fb", border: "1px solid #f8e0eb", alignItems: "start" }}>
                <p style={{ margin: 0, fontSize: "14px", color: "#3a1a2e", fontWeight: "600", fontFamily: "Cormorant Garamond, serif" }}>{name}</p>
                <span style={{ padding: "2px 8px", borderRadius: "10px", fontSize: "10px", background: data.type === "Primary" ? "#fce4ec" : "#f0e6ff", color: data.type === "Primary" ? "#d4547a" : "#9b59b6", fontFamily: "Montserrat, sans-serif", fontWeight: "600", display: "inline-block" }}>{data.type}</span>
                <div>{Object.entries(data.colors).map(([color, qty]) => (
                  <div key={color} style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                    <span style={{ fontSize: "11px", color: "#5a2a3e", fontFamily: "Montserrat, sans-serif" }}>{color}</span>
                    {qty > 0 && <span style={{ fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{qty}</span>}
                  </div>
                ))}</div>
                <p style={{ margin: 0, fontSize: "15px", color: "#d4547a", fontWeight: "600", fontFamily: "Montserrat, sans-serif" }}>{data.totalStems > 0 ? data.totalStems : "—"}</p>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #f0d0de", paddingTop: "10px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>TOTAL STEMS NEEDED</span>
              <span style={{ fontSize: "18px", color: "#8b3a5e", fontWeight: "600", fontFamily: "Cormorant Garamond, serif" }}>{Object.values(grouped[key]).reduce((s, d) => s + d.totalStems, 0)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


// ─── ROSE TIERS EDITOR ─────────────────────────────────────
function RoseTiersEditor() {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [holidayMode, setHolidayMode] = useState(false);
  const [showPwPrompt, setShowPwPrompt] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");

  const fetchTiers = async () => {
    setLoading(true);
    try {
      const [tiersRes, holidayRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/rose_tiers?select=*&order=quantity.asc`, {
          headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        }),
        fetch(`${SUPABASE_URL}/rest/v1/settings?select=value&key=eq.rose_holiday_mode`, {
          headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        })
      ]);
      const tiersData = await tiersRes.json();
      const holidayData = await holidayRes.json();
      setTiers(Array.isArray(tiersData) ? tiersData : []);
      if (Array.isArray(holidayData) && holidayData[0]) {
        setHolidayMode(holidayData[0].value === "true" || holidayData[0].value === true);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const confirmToggle = async () => {
    if (pwInput !== ADMIN_PASSWORD) { setPwError("Wrong password"); return; }
    const newVal = !holidayMode;
    setHolidayMode(newVal);
    setShowPwPrompt(false); setPwInput(""); setPwError("");
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/settings`, {
        method: "POST",
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({ key: "rose_holiday_mode", value: String(newVal) })
      });
    } catch (e) { console.error("Failed to save holiday mode", e); }
  };

  useEffect(() => { fetchTiers(); }, []);
  const updateTier = async (id, field, value) => {
    setSaving(id);
    const updates = { [field]: parseFloat(value) || 0 };
    await fetch(`${SUPABASE_URL}/rest/v1/rose_tiers?id=eq.${id}`, {
      method: "PATCH",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
      body: JSON.stringify(updates)
    });
    setTiers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    setSaving(null);
  };
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "16px", border: "1px solid #f0d0de" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontWeight: "400" }}>🌹 Rose Bouquet Pricing</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>Holiday Mode</span>
            <div onClick={() => { setShowPwPrompt(true); setPwInput(""); setPwError(""); }} style={{ width: "44px", height: "24px", borderRadius: "12px", cursor: "pointer", background: holidayMode ? "#d4547a" : "#e0e0e0", position: "relative" }}>
              <div style={{ position: "absolute", top: "3px", left: holidayMode ? "23px" : "3px", width: "18px", height: "18px", borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </div>
          </div>
        </div>
        {showPwPrompt && (
          <div style={{ background: "#fff8fb", borderRadius: "12px", padding: "14px", marginBottom: "16px", border: "1.5px solid #f0d0de" }}>
            <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#8b3a5e", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>
              {holidayMode ? "🔓 Turn OFF Holiday Pricing?" : "🎄 Turn ON Holiday Pricing?"} Enter password to confirm:
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="password" placeholder="Password" value={pwInput} onChange={e => { setPwInput(e.target.value); setPwError(""); }}
                style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "13px", fontFamily: "Montserrat, sans-serif" }} />
              <button onClick={confirmToggle} style={{ background: "#d4547a", border: "none", color: "white", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>Confirm</button>
              <button onClick={() => { setShowPwPrompt(false); setPwInput(""); setPwError(""); }} style={{ background: "white", border: "1px solid #f0d0de", color: "#8b3a5e", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", cursor: "pointer" }}>Cancel</button>
            </div>
            {pwError && <p style={{ margin: "6px 0 0", fontSize: "11px", color: "#c62828", fontFamily: "Montserrat, sans-serif" }}>{pwError}</p>}
          </div>
        )}
        {loading ? <p style={{ color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>Loading...</p> : (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", marginBottom: "8px" }}>
              {["Stems", "Qty", "Standard $", "Holiday $"].map(h => (
                <p key={h} style={{ margin: 0, fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600", textTransform: "uppercase" }}>{h}</p>
              ))}
            </div>
            {tiers.map(tier => (
              <div key={tier.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f8e0eb" }}>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#3a1a2e", fontFamily: "Cormorant Garamond, serif" }}>{tier.stem_count}</div>
                <div style={{ fontSize: "13px", color: "#b06080" }}>{tier.quantity}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                  <span style={{ fontSize: "11px", color: "#b06080" }}>$</span>
                  <input type="number" defaultValue={tier.standard_price} onBlur={e => updateTier(tier.id, "standard_price", e.target.value)} style={{ width: "65px", padding: "5px 6px", borderRadius: "6px", border: "1.5px solid #f0d0de", fontSize: "12px" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                  <span style={{ fontSize: "11px", color: "#b06080" }}>$</span>
                  <input type="number" defaultValue={tier.holiday_price} onBlur={e => updateTier(tier.id, "holiday_price", e.target.value)} style={{ width: "65px", padding: "5px 6px", borderRadius: "6px", border: "1.5px solid #f0d0de", fontSize: "12px" }} />
                </div>
                {saving === tier.id && <span style={{ fontSize: "9px", color: "#b06080", gridColumn: "span 4" }}>saving...</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PREMADE BOUQUETS VIEW ──────────────────────────────────
function PremadeBouquetsView() {
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", image_url: "", category: "seasonal", active: true });
  const fetchBouquets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/premade_bouquets?select=*&order=sort_order.asc`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      setBouquets(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };
  useEffect(() => { fetchBouquets(); }, []);
  const saveBouquet = async () => {
    setSaving(true);
    try {
      const payload = { name: form.name, description: form.description, price: parseFloat(form.price) || 0, image_url: form.image_url, category: form.category, active: form.active };
      if (editingId) {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/premade_bouquets?id=eq.${editingId}`, { method: "PATCH", headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=representation" }, body: JSON.stringify(payload) });
        const data = await res.json();
        console.log("PATCH result:", data);
      } else {
        await fetch(`${SUPABASE_URL}/rest/v1/premade_bouquets`, { method: "POST", headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" }, body: JSON.stringify(payload) });
      }
      setForm({ name: "", description: "", price: "", image_url: "", category: "seasonal", active: true });
      setAdding(false); setEditingId(null);
      await fetchBouquets();
    } catch (e) { console.error("Save error:", e); }
    setSaving(false);
  };
  const toggleActive = async (id, val) => {
    await fetch(`${SUPABASE_URL}/rest/v1/premade_bouquets?id=eq.${id}`, { method: "PATCH", headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" }, body: JSON.stringify({ active: val }) });
    setBouquets(prev => prev.map(b => b.id === id ? { ...b, active: val } : b));
  };
  const deleteBouquet = async (id) => {
    await fetch(`${SUPABASE_URL}/rest/v1/premade_bouquets?id=eq.${id}`, { method: "DELETE", headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } });
    setBouquets(prev => prev.filter(b => b.id !== id));
  };
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ margin: 0, color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontSize: "22px", fontWeight: "400" }}>💐 Premade Arrangements</h3>
        <button onClick={() => { setAdding(true); setEditingId(null); setForm({ name: "", description: "", price: "", image_url: "", category: "seasonal", active: true }); }} style={{ background: "linear-gradient(135deg, #d4547a, #c0396a)", border: "none", color: "white", borderRadius: "10px", padding: "9px 16px", fontSize: "12px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>+ Add</button>
      </div>
      {(adding || editingId) && (
        <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "16px", border: "1.5px solid #d4547a" }}>
          <h4 style={{ margin: "0 0 14px", color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontSize: "18px", fontWeight: "400" }}>{editingId ? "Edit" : "New"} Arrangement</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            {[["name","Name","e.g. Spring Bliss"],["price","Price ($)","e.g. 85"]].map(([f,l,p]) => (
              <div key={f}><p style={{ margin: "0 0 4px", fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>{l}</p>
              <input type={f==="price"?"number":"text"} placeholder={p} value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "13px", boxSizing: "border-box" }} /></div>
            ))}
          </div>
          <div style={{ marginBottom: "10px" }}><p style={{ margin: "0 0 4px", fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>Description</p>
          <input type="text" placeholder="Short description..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "13px", boxSizing: "border-box" }} /></div>
          <div style={{ marginBottom: "10px" }}><p style={{ margin: "0 0 4px", fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>Image URL</p>
          <input type="text" placeholder="e.g. /flowers/36-Count-Red-Roses.jpg" value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "13px", boxSizing: "border-box" }} />
          {form.image_url && <img src={form.image_url} alt="preview" style={{ marginTop: "8px", width: "80px", height: "80px", borderRadius: "10px", objectFit: "cover" }} onError={e => e.target.style.display="none"} />}</div>
          <div style={{ marginBottom: "14px" }}><p style={{ margin: "0 0 4px", fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>Category</p>
          <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "13px" }}>
            {["seasonal","roses","tropical","wildflower","sympathy","wedding","other"].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
          </select></div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={saveBouquet} disabled={saving} style={{ flex: 1, background: "linear-gradient(135deg, #d4547a, #c0396a)", border: "none", color: "white", borderRadius: "10px", padding: "10px", fontSize: "13px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>{saving ? "Saving..." : "Save"}</button>
            <button onClick={() => { setAdding(false); setEditingId(null); }} style={{ background: "white", border: "1px solid #f0d0de", color: "#8b3a5e", borderRadius: "10px", padding: "10px 16px", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}
      {loading ? <p style={{ textAlign: "center", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>Loading...</p> :
        bouquets.length === 0 ? <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "16px", border: "1px solid #f0d0de" }}><div style={{ fontSize: "40px", marginBottom: "10px" }}>💐</div><p style={{ color: "#b06080", fontFamily: "Montserrat, sans-serif", fontSize: "13px" }}>No premade arrangements yet.</p></div> :
        bouquets.map(b => (
          <div key={b.id} style={{ background: "white", borderRadius: "14px", marginBottom: "10px", border: "1px solid #f0d0de", overflow: "hidden" }}>
            <div style={{ display: "flex", gap: "12px", padding: "14px 16px" }}>
              {<img src={b.image_url || getFlowerFallback(b.name, b.description)} alt={b.name} style={{ width: "70px", height: "70px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }} onError={e => e.target.style.display="none"} />}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "16px", fontWeight: "600", color: "#3a1a2e", fontFamily: "Cormorant Garamond, serif" }}>{b.name}</span>
                  <span style={{ fontSize: "18px", fontWeight: "600", color: "#d4547a", fontFamily: "Cormorant Garamond, serif" }}>${b.price}</span>
                </div>
                {b.description && <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{b.description}</p>}
                <span style={{ fontSize: "10px", background: b.active ? "#e8f5e9" : "#ffebee", color: b.active ? "#2e7d32" : "#c62828", borderRadius: "10px", padding: "2px 8px", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>{b.active ? "Active" : "Hidden"}</span>
              </div>
            </div>
            <div style={{ padding: "0 16px 12px", display: "flex", gap: "8px" }}>
              <button onClick={() => toggleActive(b.id, !b.active)} style={{ background: b.active ? "#ffebee" : "#e8f5e9", border: "none", color: b.active ? "#c62828" : "#2e7d32", borderRadius: "8px", padding: "6px 12px", fontSize: "11px", cursor: "pointer", fontWeight: "600" }}>{b.active ? "Hide" : "Show"}</button>
              <button onClick={() => { setEditingId(b.id); setAdding(false); setForm({ name: b.name, description: b.description||"", price: b.price, image_url: b.image_url||"", category: b.category||"seasonal", active: b.active }); }} style={{ background: "#fce4ec", border: "none", color: "#d4547a", borderRadius: "8px", padding: "6px 12px", fontSize: "11px", cursor: "pointer", fontWeight: "600" }}>✏️ Edit</button>
              <button onClick={() => deleteBouquet(b.id)} style={{ background: "#ffebee", border: "none", color: "#c62828", borderRadius: "8px", padding: "6px 12px", fontSize: "11px", cursor: "pointer", fontWeight: "600" }}>🗑</button>
            </div>
          </div>
        ))
      }
    </div>
  );
}

// ─── MAIN DASHBOARD ────────────────────────────────────────
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mainView, setMainView] = useState("orders");
  const [calView, setCalView] = useState("list"); // list | calendar
  const [filter, setFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // order id
  const [paymentModal, setPaymentModal] = useState(null); // { order, type: 'deposit'|'final' }
  const [orderTotal, setOrderTotal] = useState("");
  const [laborFee, setLaborFee] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [paymentSending, setPaymentSending] = useState(false);
  const [paymentSent, setPaymentSent] = useState(null); // order id that got sent
  const [deletePw, setDeletePw] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [paidModal, setPaidModal] = useState(null); // order id
  const [addOrderModal, setAddOrderModal] = useState(false);
  const [addOrderForm, setAddOrderForm] = useState({ first_name:"",last_name:"",email:"",phone:"",occasion:"Birthday",date_needed:"",time_needed:"",delivery_type:"pickup",delivery_address:"",budget:"",total_price:"",bouquet_description:"",personal_note:"",source:"In Person",payment_method:"Cash",status:"Confirmed",payment_status:"unpaid",deposit_paid:false,is_paid:false });
  const [addOrderSaving, setAddOrderSaving] = useState(false);
  const [payMethod, setPayMethod] = useState("");

  const markPaid = async (order, paidType) => {
    if (!payMethod) return;
    const isFinal = paidType === "final";
    const updates = isFinal
      ? { is_paid: true, deposit_paid: true, payment_method: payMethod, paid_at: new Date().toISOString() }
      : { deposit_paid: true, payment_method: payMethod, paid_at: new Date().toISOString() };
    await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${order.id}`, {
      method: "PATCH",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
      body: JSON.stringify(updates)
    });
    if (isFinal) {
      await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${order.id}`, {
        method: "PATCH",
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
        body: JSON.stringify({ status: "Completed" })
      });
    }
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, ...updates, ...(isFinal ? { status: "Completed" } : {}) } : o));
    setPaidModal(null);
    setPayMethod("");
  };

  const deleteOrder = async (id) => {
    if (deletePw !== ADMIN_PASSWORD) { setDeleteError("Wrong password"); return; }
    await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
      method: "DELETE",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    setOrders(prev => prev.filter(o => o.id !== id));
    setDeleteConfirm(null); setDeletePw(""); setDeleteError("");
  };

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); fetchOrders(); }
    else setPwError("Incorrect password");
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const saveManualOrder = async () => {
    if (!addOrderForm.first_name || !addOrderForm.last_name) { alert("First and last name required"); return; }
    setAddOrderSaving(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, { method:"POST", headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json","Prefer":"return=representation"}, body:JSON.stringify({...addOrderForm,total_price:parseFloat(addOrderForm.total_price)||null,created_at:new Date().toISOString()}) });
      const data = await res.json();
      if (data?.[0]) { setOrders(prev=>[data[0],...prev]); setAddOrderModal(false); setAddOrderForm({first_name:"",last_name:"",email:"",phone:"",occasion:"Birthday",date_needed:"",time_needed:"",delivery_type:"pickup",delivery_address:"",budget:"",total_price:"",bouquet_description:"",personal_note:"",source:"In Person",payment_method:"Cash",status:"Confirmed",payment_status:"unpaid",deposit_paid:false,is_paid:false}); }
    } catch(e){alert("Failed");}
    setAddOrderSaving(false);
  };

  const updateStatus = async (id, status) => {
    await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
      method: "PATCH",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
      body: JSON.stringify({ status })
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const sendPaymentLink = async () => {
    if (!paymentModal) return;
    setPaymentSending(true);
    const { order, type } = paymentModal;
    const labor = parseFloat(laborFee) || 0;
    const delivery = parseFloat(deliveryFee) || 0;
    const budget = parseFloat(orderTotal) || parseFloat((order.total_price || "0").toString().replace(/[^0-9.]/g, "")) || 0;
    const total = budget + labor + delivery;
    const amount = type === "deposit" ? total * 0.5 : total * 0.5;
    const label = type === "deposit" ? "50% Deposit" : "Final Payment (50%)";
    try {
      const res = await fetch("/.netlify/functions/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          customer_name: `${order.first_name} ${order.last_name}`,
          customer_email: order.email,
          customer_phone: order.phone,
          order_id: order.id,
          payment_type: label,
          total_amount: total,
          note: order.personal_note || ""
        })
      });
      const result = await res.json();
      if (result.url) {
        // Save total and payment link to order
        await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${order.id}`, {
          method: "PATCH",
          headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
          body: JSON.stringify({ total_amount: total, payment_link: result.url })
        });
        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, total_amount: total, payment_link: result.url } : o));
        setPaymentSent(order.id);
        alert(`✅ Payment link sent!\n\n${label}: $${amount.toFixed(2)}\nTotal: $${total.toFixed(2)}\n\nLink: ${result.url}`);
        setPaymentModal(null);
      } else {
        alert("❌ Error creating payment link: " + JSON.stringify(result));
      }
    } catch(err) {
      alert("❌ Error: " + err.message);
    }
    setPaymentSending(false);
  };

  const filtered = orders.filter(o => {
    const matchFilter = filter === "All" || o.status === filter;
    const matchSource = sourceFilter === "All" || o.source === sourceFilter;
    const matchSearch = !search || `${o.first_name} ${o.last_name} ${o.email} ${o.phone}`.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSource && matchSearch;
  });

  if (!authed) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fff0f6 0%, #fce4ec 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, sans-serif" }}>
      <div style={{ background: "white", borderRadius: "20px", padding: "40px", width: "320px", boxShadow: "0 8px 40px rgba(180,80,120,0.15)", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌸</div>
        <h1 style={{ color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontSize: "28px", fontWeight: "400", margin: "0 0 8px" }}>Pretty Petals</h1>
        <p style={{ color: "#b06080", fontSize: "13px", margin: "0 0 24px" }}>Admin Dashboard</p>
        <input type="password" placeholder="Enter password" value={pw}
          onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && login()}
          style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1.5px solid #f0d0de", fontSize: "14px", boxSizing: "border-box", outline: "none", marginBottom: "8px" }} />
        {pwError && <p style={{ color: "#c0392b", fontSize: "12px", margin: "0 0 8px" }}>{pwError}</p>}
        <button onClick={login} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "linear-gradient(135deg, #d4547a, #c0396a)", color: "white", border: "none", fontSize: "15px", cursor: "pointer", fontFamily: "Cormorant Garamond, serif", fontWeight: "600" }}>Login</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#fdf6f9", fontFamily: "Montserrat, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet" />

      {addOrderModal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}} onClick={()=>setAddOrderModal(false)}>
          <div style={{background:"white",borderRadius:"20px",padding:"24px",width:"100%",maxWidth:"500px",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
              <h3 style={{margin:0,color:"#8b3a5e",fontFamily:"Cormorant Garamond, serif",fontSize:"22px"}}>🌸 Add Manual Order</h3>
              <button onClick={()=>setAddOrderModal(false)} style={{background:"none",border:"none",fontSize:"20px",cursor:"pointer",color:"#b06080"}}>✕</button>
            </div>
            {[["First Name","first_name","text"],["Last Name","last_name","text"],["Email","email","email"],["Phone","phone","tel"],["Date Needed","date_needed","date"],["Total Price ($)","total_price","number"],["Bouquet Description","bouquet_description","text"],["Note","personal_note","text"]].map(([lbl,fld,typ])=>(
              <div key={fld} style={{marginBottom:"12px"}}>
                <label style={{display:"block",fontSize:"11px",color:"#8b3a5e",fontFamily:"Montserrat, sans-serif",fontWeight:"600",marginBottom:"4px",textTransform:"uppercase"}}>{lbl}</label>
                <input type={typ} value={addOrderForm[fld]} onChange={e=>setAddOrderForm(p=>({...p,[fld]:e.target.value}))} style={{width:"100%",padding:"8px 10px",borderRadius:"8px",border:"1.5px solid #f0d0de",fontSize:"13px",fontFamily:"Montserrat, sans-serif",boxSizing:"border-box"}}/>
              </div>
            ))}
            {[["Occasion","occasion",["Birthday","Anniversary","Wedding","Just Because","Valentine's Day","Mother's Day","Other"]],["Delivery","delivery_type",["pickup","delivery"]],["Source","source",["In Person","Instagram","Facebook","TikTok","Text","Email"]],["Payment Method","payment_method",["Cash","Zelle","Square","Other"]],["Status","status",["New","Confirmed","In Progress","Ready","Delivered","Completed"]]].map(([lbl,fld,opts])=>(
              <div key={fld} style={{marginBottom:"12px"}}>
                <label style={{display:"block",fontSize:"11px",color:"#8b3a5e",fontFamily:"Montserrat, sans-serif",fontWeight:"600",marginBottom:"4px",textTransform:"uppercase"}}>{lbl}</label>
                <select value={addOrderForm[fld]} onChange={e=>setAddOrderForm(p=>({...p,[fld]:e.target.value}))} style={{width:"100%",padding:"8px 10px",borderRadius:"8px",border:"1.5px solid #f0d0de",fontSize:"13px",fontFamily:"Montserrat, sans-serif",background:"white"}}>
                  {opts.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            {addOrderForm.delivery_type==="delivery"&&<div style={{marginBottom:"12px"}}><label style={{display:"block",fontSize:"11px",color:"#8b3a5e",fontFamily:"Montserrat, sans-serif",fontWeight:"600",marginBottom:"4px",textTransform:"uppercase"}}>Delivery Address</label><input value={addOrderForm.delivery_address} onChange={e=>setAddOrderForm(p=>({...p,delivery_address:e.target.value}))} style={{width:"100%",padding:"8px 10px",borderRadius:"8px",border:"1.5px solid #f0d0de",fontSize:"13px",fontFamily:"Montserrat, sans-serif",boxSizing:"border-box"}}/></div>}
            <div style={{display:"flex",gap:"16px",marginTop:"8px"}}>
              <label style={{display:"flex",alignItems:"center",gap:"6px",fontSize:"13px",fontFamily:"Montserrat, sans-serif",color:"#8b3a5e",cursor:"pointer"}}><input type="checkbox" checked={addOrderForm.deposit_paid} onChange={e=>setAddOrderForm(p=>({...p,deposit_paid:e.target.checked,payment_status:e.target.checked?"deposit_paid":"unpaid"}))}/> Deposit Paid</label>
              <label style={{display:"flex",alignItems:"center",gap:"6px",fontSize:"13px",fontFamily:"Montserrat, sans-serif",color:"#8b3a5e",cursor:"pointer"}}><input type="checkbox" checked={addOrderForm.is_paid} onChange={e=>setAddOrderForm(p=>({...p,is_paid:e.target.checked,deposit_paid:e.target.checked?true:p.deposit_paid,payment_status:e.target.checked?"fully_paid":(p.deposit_paid?"deposit_paid":"unpaid")}))}/> Fully Paid</label>
            </div>
            <button onClick={saveManualOrder} disabled={addOrderSaving} style={{width:"100%",marginTop:"20px",padding:"14px",background:"#d4547a",color:"white",border:"none",borderRadius:"12px",fontSize:"15px",fontFamily:"Montserrat, sans-serif",fontWeight:"600",cursor:"pointer"}}>
              {addOrderSaving?"Saving...":"💾 Save Order"}
            </button>
          </div>
        </div>
      )}
      {/* Payment Modal */}
      {paymentModal && (() => {
        const { order, type } = paymentModal;
        const labor = parseFloat(laborFee) || 0;
        const delivery = parseFloat(deliveryFee) || 0;
        const budget = parseFloat(orderTotal) || parseFloat((order.total_price || "0").toString().replace(/[^0-9.]/g, "")) || 0;
        const total = budget + labor + delivery;
        const half = total * 0.5;
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{ background: "white", borderRadius: "20px", padding: "28px", width: "100%", maxWidth: "380px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
              <h3 style={{ margin: "0 0 6px", color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontSize: "22px", fontWeight: "400" }}>
                {type === "deposit" ? "💳 Send Deposit Link" : "💳 Send Final Payment"}
              </h3>
              <p style={{ margin: "0 0 18px", color: "#b06080", fontSize: "12px" }}>{order.first_name} {order.last_name} · {order.phone}</p>

              <div style={{ background: "#fdf6f9", borderRadius: "10px", padding: "12px", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#b06080", fontWeight: "600" }}>ORDER TOTAL ($)</span>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={orderTotal}
                    onChange={e => setOrderTotal(e.target.value)}
                    style={{ width: "110px", padding: "5px 10px", borderRadius: "8px", border: "1.5px solid #d4547a", fontSize: "13px", fontWeight: "600", color: "#3a1a2e", textAlign: "right", outline: "none" }}
                  />
                </div>
                {type === "deposit" && <>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "12px", color: "#b06080" }}>Labor Fee</span>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "#3a1a2e" }}>${labor.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#b06080" }}>Delivery Fee</span>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "#3a1a2e" }}>${delivery.toFixed(2)}</span>
                  </div>
                  <div style={{ borderTop: "1px solid #f0d0de", paddingTop: "8px", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#8b3a5e" }}>Total</span>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#8b3a5e" }}>${total.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                    <span style={{ fontSize: "13px", color: "#d4547a", fontWeight: "600" }}>50% Due Now</span>
                    <span style={{ fontSize: "13px", color: "#d4547a", fontWeight: "600" }}>${half.toFixed(2)}</span>
                  </div>
                </>}
                {type === "final" && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                    <span style={{ fontSize: "13px", color: "#d4547a", fontWeight: "600" }}>Final 50% Due</span>
                    <span style={{ fontSize: "13px", color: "#d4547a", fontWeight: "600" }}>${half.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {type === "deposit" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: "10px", color: "#b06080", fontWeight: "600" }}>LABOR FEE ($)</p>
                    <input type="text" placeholder="0" value={laborFee} onChange={e => setLaborFee(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "14px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: "10px", color: "#b06080", fontWeight: "600" }}>DELIVERY FEE ($)</p>
                    <input type="text" placeholder="0" value={deliveryFee} onChange={e => setDeliveryFee(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "14px", boxSizing: "border-box" }} />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={sendPaymentLink} disabled={paymentSending}
                  style={{ flex: 1, background: "linear-gradient(135deg, #d4547a, #c0396a)", border: "none", color: "white", borderRadius: "10px", padding: "12px", fontSize: "13px", cursor: "pointer", fontWeight: "600" }}>
                  {paymentSending ? "Sending..." : `Send $${half.toFixed(2)} Link`}
                </button>
                <button onClick={() => setPaymentModal(null)}
                  style={{ background: "white", border: "1px solid #f0d0de", color: "#8b3a5e", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", cursor: "pointer" }}>
                  Skip
                </button>
              </div>
              <p style={{ margin: "10px 0 0", fontSize: "10px", color: "#b06080", textAlign: "center" }}>Link sent via SMS to {order.phone}</p>
            </div>
          </div>
        );
      })()}

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #d4547a, #c0396a)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px" }}>🌸</span>
          <div>
            <h1 style={{ color: "white", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontWeight: "400", margin: 0 }}>Pretty Petals Admin</h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", margin: 0 }}>{orders.length} total orders</p>
          </div>
        </div>
        <button onClick={fetchOrders} style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", color: "white", borderRadius: "8px", padding: "7px 12px", fontSize: "12px", cursor: "pointer" }}>🔄 Refresh</button>
      </div>

      {/* Main Nav */}
      <div style={{ background: "white", borderBottom: "1px solid #f0d0de", padding: "12px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "6px", maxWidth: "700px", margin: "0 auto 6px" }}>
          {[
            ["orders", "📋", "Orders"],
            ["premade", "💐", "Premade"],
            ["roses", "🌹", "Roses"],
            ["flowers", "🌸", "Flowers"],
            ["analytics", "📊", "Analytics"],
            ["inventory", "📦", "Inventory"],
            ["reviews", "⭐", "Reviews"],
            ["map", "🗺️", "Map"],
          ].map(([v, icon, label]) => (
            <button key={v} onClick={() => setMainView(v)} style={{
              padding: "8px 4px", borderRadius: "10px", fontSize: "11px",
              border: `1.5px solid ${mainView === v ? "#d4547a" : "#f0d0de"}`,
              background: mainView === v ? "#fce4ec" : "white",
              color: mainView === v ? "#8b3a5e" : "#b06080",
              cursor: "pointer", fontFamily: "Montserrat, sans-serif",
              fontWeight: mainView === v ? "600" : "400", textAlign: "center"
            }}>{icon}<br />{label}</button>
          ))}
        </div>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <button onClick={() => setMainView("finance")} style={{
            width: "100%", padding: "8px", borderRadius: "10px", fontSize: "12px",
            border: `1.5px solid ${mainView === "finance" ? "#d4547a" : "#f0d0de"}`,
            background: mainView === "finance" ? "linear-gradient(135deg, #d4547a, #c0396a)" : "white",
            color: mainView === "finance" ? "white" : "#b06080",
            cursor: "pointer", fontFamily: "Montserrat, sans-serif",
            fontWeight: "600", textAlign: "center"
          }}>💵 Finance & Profit Tracker</button>
        </div>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {/* ORDERS */}
        {mainView === "orders" && (
          <>
            <div style={{ maxWidth: "700px", margin: "0 auto 14px" }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <button onClick={() => setCalView("list")} style={{ flex: 1, padding: "9px", borderRadius: "10px", fontSize: "12px", border: `1.5px solid ${calView === "list" ? "#d4547a" : "#f0d0de"}`, background: calView === "list" ? "#fce4ec" : "white", color: calView === "list" ? "#8b3a5e" : "#b06080", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: calView === "list" ? "600" : "400" }}>📋 Order List</button>
                <button onClick={() => setCalView("calendar")} style={{ flex: 1, padding: "9px", borderRadius: "10px", fontSize: "12px", border: `1.5px solid ${calView === "calendar" ? "#d4547a" : "#f0d0de"}`, background: calView === "calendar" ? "#fce4ec" : "white", color: calView === "calendar" ? "#8b3a5e" : "#b06080", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: calView === "calendar" ? "600" : "400" }}>📅 Calendar</button>
                <button onClick={()=>setAddOrderModal(true)} style={{padding:"9px 14px",borderRadius:"10px",fontSize:"12px",border:"1.5px solid #d4547a",background:"#d4547a",color:"white",cursor:"pointer",fontFamily:"Montserrat, sans-serif",fontWeight:"600",whiteSpace:"nowrap"}}>+ Add Order</button>
              </div>
              {calView === "list" && (
                <>
                  <input placeholder="Search by name, email, phone..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #f0d0de", fontSize: "13px", boxSizing: "border-box", outline: "none", marginBottom: "10px" }} />
                  <p style={{ margin: "0 0 6px", fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600", textTransform: "uppercase" }}>Filter by Status</p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                    {["All", ...STATUS_OPTIONS].map(s => (
                      <button key={s} onClick={() => setFilter(s)} style={{
                        padding: "5px 12px", borderRadius: "20px", fontSize: "11px", cursor: "pointer",
                        border: filter === s ? "none" : "1px solid #f0d0de",
                        background: filter === s ? "#d4547a" : "white",
                        color: filter === s ? "white" : "#8b3a5e", fontFamily: "Montserrat, sans-serif"
                      }}>{s}</button>
                    ))}
                  </div>
                  <p style={{ margin: "0 0 6px", fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600", textTransform: "uppercase" }}>Filter by Source</p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {["All", "In Person", "TikTok", "Instagram", "Facebook", "Text", "Email"].map(s => (
                      <button key={s} onClick={() => setSourceFilter(s)} style={{
                        padding: "5px 12px", borderRadius: "20px", fontSize: "11px", cursor: "pointer",
                        border: sourceFilter === s ? "none" : "1px solid #f0d0de",
                        background: sourceFilter === s ? "#8b3a5e" : "white",
                        color: sourceFilter === s ? "white" : "#8b3a5e", fontFamily: "Montserrat, sans-serif"
                      }}>{s}</button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {calView === "calendar" ? <CalendarView orders={orders} /> : (
              <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                {loading ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "#b06080" }}>Loading orders...</div>
                ) : filtered.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "#b06080" }}>
                    <div style={{ fontSize: "40px", marginBottom: "10px" }}>🌸</div>
                    <p style={{ fontFamily: "Montserrat, sans-serif" }}>No orders found</p>
                  </div>
                ) : filtered.map(order => (
                  <div key={order.id} style={{ background: "white", borderRadius: "14px", marginBottom: "10px", boxShadow: "0 2px 12px rgba(180,80,120,0.08)", overflow: "hidden", border: "1px solid #f8e8f0" }}>
                    <div onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                      style={{ padding: "14px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ fontWeight: "600", color: "#3a1a2e", fontSize: "15px" }}>{order.first_name} {order.last_name}</span>
                          <span style={{ padding: "2px 10px", borderRadius: "20px", fontSize: "10px", background: STATUS_COLORS[order.status]?.bg || "#f5f5f5", color: STATUS_COLORS[order.status]?.text || "#555", fontWeight: "600", fontFamily: "Montserrat, sans-serif" }}>{order.status}</span>
                        </div>
                        <p style={{ margin: "0 0 2px", color: "#b06080", fontSize: "12px", fontFamily: "Montserrat, sans-serif" }}>{order.occasion} · {fmtDate(order.date_needed)}</p>
                        <p style={{ margin: 0, color: "#b06080", fontSize: "12px", fontFamily: "Montserrat, sans-serif" }}>{order.delivery_type === "delivery" ? "🚗 Delivery" : "🏪 Pickup"}{order.budget ? ` · ${order.budget}` : ""}</p>
                      </div>
                      <span style={{ color: "#d4547a", fontSize: "16px" }}>{expanded === order.id ? "▲" : "▼"}</span>
                    </div>

                    {expanded === order.id && (
                      <div style={{ padding: "0 16px 16px", borderTop: "1px solid #f8e8f0" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px", marginBottom: "12px" }}>
                          {[
                            ["📧 Email", order.email],
                            ["📱 Phone", order.phone],
                            ["📅 Date", fmtDate(order.date_needed)],
                            ["⏰ Time", (() => { if (!order.time_needed) return "—"; const [h, m] = order.time_needed.split(":"); const hr = parseInt(h); return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; })()],
                            ["🏠 Address", order.delivery_address ? `${order.delivery_address}, ${order.delivery_city} ${order.delivery_zip}` : "—"],
                            ["💌 Recipient", order.recipient_name || "—"],
                          ].map(([label, val]) => (
                            <div key={label} style={{ background: "#fdf6f9", borderRadius: "8px", padding: "8px 10px" }}>
                              <p style={{ margin: "0 0 2px", fontSize: "10px", color: "#b06080", fontWeight: "600", fontFamily: "Montserrat, sans-serif" }}>{label}</p>
                              <p style={{ margin: 0, fontSize: "12px", color: "#3a1a2e", fontFamily: "Montserrat, sans-serif" }}>{val || "—"}</p>
                            </div>
                          ))}
                        </div>
                        {order.personal_note && (
                          <div style={{ background: "#fff8fb", borderRadius: "8px", padding: "10px", marginBottom: "10px", border: "1px solid #f0d0de" }}>
                            <p style={{ margin: "0 0 4px", fontSize: "10px", color: "#b06080", fontWeight: "600", fontFamily: "Montserrat, sans-serif" }}>💬 NOTE</p>
                            <p style={{ margin: 0, fontSize: "13px", color: "#3a1a2e", fontStyle: "italic", fontFamily: "Cormorant Garamond, serif" }}>{order.personal_note}</p>
                          </div>
                        )}
                        {order.color_notes && (
                          <div style={{ background: "#fff8fb", borderRadius: "8px", padding: "10px", marginBottom: "10px", border: "1px solid #f0d0de" }}>
                            <p style={{ margin: "0 0 4px", fontSize: "10px", color: "#b06080", fontWeight: "600", fontFamily: "Montserrat, sans-serif" }}>🌸 FLOWER NOTES</p>
                            <p style={{ margin: 0, fontSize: "13px", color: "#3a1a2e", fontFamily: "Montserrat, sans-serif" }}>{order.color_notes}</p>
                          </div>
                        )}
                        {order.bouquet_summary && (
                          <div style={{ background: "#fff8fb", borderRadius: "8px", padding: "10px", marginBottom: "10px", border: "1px solid #f0d0de" }}>
                            <p style={{ margin: "0 0 4px", fontSize: "10px", color: "#b06080", fontWeight: "600", fontFamily: "Montserrat, sans-serif" }}>💐 BOUQUET</p>
                            <p style={{ margin: 0, fontSize: "12px", color: "#3a1a2e", fontFamily: "Montserrat, sans-serif", lineHeight: "1.6" }}>{order.bouquet_summary}</p>
                          </div>
                        )}
                        <p style={{ margin: "0 0 8px", fontSize: "10px", color: "#b06080", fontWeight: "600", fontFamily: "Montserrat, sans-serif" }}>UPDATE STATUS:</p>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                          {STATUS_OPTIONS.map(s => (
                            <button key={s} onClick={() => updateStatus(order.id, s)} style={{
                              padding: "6px 12px", borderRadius: "8px", fontSize: "11px", cursor: "pointer",
                              border: order.status === s ? "none" : "1px solid #f0d0de",
                              background: order.status === s ? "#d4547a" : "white",
                              color: order.status === s ? "white" : "#8b3a5e",
                              fontFamily: "Montserrat, sans-serif", fontWeight: "600"
                            }}>{s}</button>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px", alignItems: "center" }}>
                          {/* Fully paid */}
                          {order.is_paid && (
                            <div style={{ background: "#e8f5e9", borderRadius: "8px", padding: "6px 14px", border: "1px solid #a5d6a7", display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ fontSize: "12px", color: "#2e7d32", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>✅ Fully Paid via {order.payment_method}</span>
                              {order.total_price && <span style={{ fontSize: "11px", color: "#388e3c", fontFamily: "Montserrat, sans-serif" }}>${parseFloat(order.total_price).toFixed(2)}</span>}
                            </div>
                          )}
                          {/* Deposit paid badge */}
                          {order.deposit_paid && !order.is_paid && (
                            <div style={{ background: "#fff8e1", borderRadius: "8px", padding: "6px 14px", border: "1px solid #ffe082" }}>
                              <span style={{ fontSize: "12px", color: "#f57f17", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>💛 Deposit Paid via {order.payment_method}</span>
                            </div>
                          )}
                          {/* Payment method picker (inline) */}
                          {paidModal === order.id && (
                            <div style={{ background: "#f1f8e9", borderRadius: "10px", padding: "12px", border: "1px solid #c5e1a5", width: "100%" }}>
                              <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#33691e", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>
                                💵 How was {order.status === "Ready" ? "final payment" : "deposit"} received?
                              </p>
                              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                                {["Square", "Cash", "Zelle", "CashApp"].map(m => (
                                  <button key={m} onClick={() => setPayMethod(m)} style={{
                                    padding: "6px 14px", borderRadius: "8px", fontSize: "12px", cursor: "pointer",
                                    border: payMethod === m ? "none" : "1px solid #c5e1a5",
                                    background: payMethod === m ? "#558b2f" : "white",
                                    color: payMethod === m ? "white" : "#33691e",
                                    fontFamily: "Montserrat, sans-serif", fontWeight: "600"
                                  }}>{m}</button>
                                ))}
                              </div>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button onClick={() => markPaid(order, order.status === "Ready" ? "final" : "deposit")} disabled={!payMethod} style={{ background: payMethod ? "#558b2f" : "#ccc", border: "none", color: "white", borderRadius: "8px", padding: "8px 16px", fontSize: "12px", cursor: payMethod ? "pointer" : "not-allowed", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>
                                  ✅ Confirm {order.status === "Ready" ? "Final Payment" : "Deposit"} {order.total_price ? `($${(parseFloat(order.total_price) * 0.5).toFixed(2)})` : ""}
                                </button>
                                <button onClick={() => { setPaidModal(null); setPayMethod(""); }} style={{ background: "white", border: "1px solid #f0d0de", color: "#8b3a5e", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", cursor: "pointer" }}>Cancel</button>
                              </div>
                            </div>
                          )}
                          {/* Buttons — only show when picker not open */}
                          {paidModal !== order.id && (
                            <>
                              {order.status === "Confirmed" && !order.deposit_paid && !order.is_paid && (
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                  <button onClick={() => { setPaymentModal({ order, type: "deposit" }); setOrderTotal(""); setLaborFee(""); setDeliveryFee(""); }} style={{ background: "#e3f2fd", border: "1px solid #90caf9", color: "#1565c0", borderRadius: "8px", padding: "6px 14px", fontSize: "11px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>
                                    💳 Send Deposit Link (50%)
                                  </button>
                                  <button onClick={() => { setPaidModal(order.id); setPayMethod(""); }} style={{ background: "#fff8e1", border: "1px solid #ffe082", color: "#f57f17", borderRadius: "8px", padding: "6px 14px", fontSize: "11px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>
                                    💛 Mark Deposit Paid (50%)
                                  </button>
                                </div>
                              )}
                              {order.status === "Ready" && !order.is_paid && (
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                  <button onClick={() => { setPaymentModal({ order, type: "final" }); setOrderTotal(""); setLaborFee(""); setDeliveryFee(""); }} style={{ background: "#f3e5f5", border: "1px solid #ce93d8", color: "#6a1b9a", borderRadius: "8px", padding: "6px 14px", fontSize: "11px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>
                                    💳 Send Final Payment Link (50%)
                                  </button>
                                  <button onClick={() => { setPaidModal(order.id); setPayMethod(""); }} style={{ background: "#e8f5e9", border: "1px solid #a5d6a7", color: "#2e7d32", borderRadius: "8px", padding: "6px 14px", fontSize: "11px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>
                                    💵 Mark Final Payment Paid (50%)
                                  </button>
                                </div>
                              )}

                            </>
                          )}
                        </div>
                        {deleteConfirm === order.id ? (
                          <div style={{ background: "#ffebee", borderRadius: "10px", padding: "12px", border: "1px solid #ffcdd2" }}>
                            <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#c62828", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>Enter password to delete this order:</p>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <input type="password" placeholder="Password" value={deletePw} onChange={e => { setDeletePw(e.target.value); setDeleteError(""); }}
                                style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #ffcdd2", fontSize: "13px", fontFamily: "Montserrat, sans-serif" }} />
                              <button onClick={() => deleteOrder(order.id)} style={{ background: "#c62828", border: "none", color: "white", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>Delete</button>
                              <button onClick={() => { setDeleteConfirm(null); setDeletePw(""); setDeleteError(""); }} style={{ background: "white", border: "1px solid #f0d0de", color: "#8b3a5e", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", cursor: "pointer" }}>Cancel</button>
                            </div>
                            {deleteError && <p style={{ margin: "6px 0 0", fontSize: "11px", color: "#c62828", fontFamily: "Montserrat, sans-serif" }}>{deleteError}</p>}
                          </div>
                        ) : (
                          <button onClick={() => { setDeleteConfirm(order.id); setDeletePw(""); setDeleteError(""); }} style={{ background: "#ffebee", border: "1px solid #ffcdd2", color: "#c62828", borderRadius: "8px", padding: "6px 14px", fontSize: "11px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>🗑 Delete Order</button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {mainView === "flowers" && <FlowerReportView orders={orders} />}
        {mainView === "premade" && <PremadeBouquetsView />}
        {mainView === "roses" && <RoseTiersEditor />}
        {mainView === "analytics" && <AnalyticsView orders={orders} />}
        {mainView === "finance" && <FinanceView orders={orders} />}
        {mainView === "inventory" && <InventoryView />}
        {mainView === "reviews" && <ReviewsView />}
        {mainView === "map" && <DeliveryMapView orders={orders} />}
      </div>
    </div>
  );
}
