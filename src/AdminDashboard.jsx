import { useState, useEffect } from "react";

const SUPABASE_URL = "https://kxvdgjnybtwsusjvzmfc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4dmRnam55YnR3c3VzanZ6bWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDIwODEsImV4cCI6MjA5NTcxODA4MX0.8u1AZ0DJpyQc9ZnG8Pg6OTwrA_e5EgEjmpDXKUKdbHk";
const ADMIN_PASSWORD = "YazC2001";

const STATUS_COLORS = {
  "New": { bg: "#e3f2fd", text: "#1565c0" },
  "Confirmed": { bg: "#e8f5e9", text: "#2e7d32" },
  "In Progress": { bg: "#fff8e1", text: "#f57f17" },
  "Ready": { bg: "#f3e5f5", text: "#6a1b9a" },
  "Delivered": { bg: "#e0f2f1", text: "#00695c" },
  "Cancelled": { bg: "#ffebee", text: "#c62828" },
};
const STATUS_OPTIONS = ["New", "Confirmed", "In Progress", "Ready", "Delivered", "Cancelled"];

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

// ─── ANALYTICS / P&L VIEW ──────────────────────────────────
function AnalyticsView({ orders }) {
  const SUPABASE_URL_A = "https://kxvdgjnybtwsusjvzmfc.supabase.co";
  const SUPABASE_KEY_A = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4dmRnam55YnR3c3VzanZ6bWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDIwODEsImV4cCI6MjA5NTcxODA4MX0.8u1AZ0DJpyQc9ZnG8Pg6OTwrA_e5EgEjmpDXKUKdbHk";

  const [tab, setTab] = useState("pl"); // pl | orders | overhead
  const [period, setPeriod] = useState("month");
  const [overhead, setOverhead] = useState([]);
  const [loadingOH, setLoadingOH] = useState(true);
  const [ohForm, setOhForm] = useState({ month: new Date().toISOString().substring(0, 7) + "-01", rent: "", utilities: "", marketing: "", other: "", notes: "" });
  const [savingOH, setSavingOH] = useState(false);
  const [editingCosts, setEditingCosts] = useState(null);
  const [costForm, setCostForm] = useState({ flower_cost: "", labor_cost: "", supplies_cost: "" });
  const [savingCost, setSavingCost] = useState(false);
  const [localOrders, setLocalOrders] = useState(orders);

  useEffect(() => { setLocalOrders(orders); }, [orders]);

  const fetchOverhead = async () => {
    setLoadingOH(true);
    try {
      const res = await fetch(`${SUPABASE_URL_A}/rest/v1/overhead?select=*&order=month.desc`, {
        headers: { "apikey": SUPABASE_KEY_A, "Authorization": `Bearer ${SUPABASE_KEY_A}` }
      });
      const data = await res.json();
      setOverhead(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    setLoadingOH(false);
  };

  useEffect(() => { fetchOverhead(); }, []);

  const saveOverhead = async () => {
    setSavingOH(true);
    try {
      await fetch(`${SUPABASE_URL_A}/rest/v1/overhead`, {
        method: "POST",
        headers: { "apikey": SUPABASE_KEY_A, "Authorization": `Bearer ${SUPABASE_KEY_A}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
        body: JSON.stringify({
          month: ohForm.month,
          rent: parseFloat(ohForm.rent) || 0,
          utilities: parseFloat(ohForm.utilities) || 0,
          marketing: parseFloat(ohForm.marketing) || 0,
          other: parseFloat(ohForm.other) || 0,
          notes: ohForm.notes
        })
      });
      setOhForm({ month: new Date().toISOString().substring(0, 7) + "-01", rent: "", utilities: "", marketing: "", other: "", notes: "" });
      await fetchOverhead();
    } catch (e) { console.error(e); }
    setSavingOH(false);
  };

  const deleteOverhead = async (id) => {
    await fetch(`${SUPABASE_URL_A}/rest/v1/overhead?id=eq.${id}`, {
      method: "DELETE",
      headers: { "apikey": SUPABASE_KEY_A, "Authorization": `Bearer ${SUPABASE_KEY_A}` }
    });
    setOverhead(prev => prev.filter(o => o.id !== id));
  };

  const saveCosts = async (orderId) => {
    setSavingCost(true);
    try {
      await fetch(`${SUPABASE_URL_A}/rest/v1/orders?id=eq.${orderId}`, {
        method: "PATCH",
        headers: { "apikey": SUPABASE_KEY_A, "Authorization": `Bearer ${SUPABASE_KEY_A}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
        body: JSON.stringify({
          flower_cost: parseFloat(costForm.flower_cost) || 0,
          labor_cost: parseFloat(costForm.labor_cost) || 0,
          supplies_cost: parseFloat(costForm.supplies_cost) || 0,
        })
      });
      setLocalOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...{ flower_cost: parseFloat(costForm.flower_cost) || 0, labor_cost: parseFloat(costForm.labor_cost) || 0, supplies_cost: parseFloat(costForm.supplies_cost) || 0 } } : o));
      setEditingCosts(null);
    } catch (e) { console.error(e); }
    setSavingCost(false);
  };

  // ── helpers ──
  const budgetToRevenue = (budget) => {
    if (!budget) return 0;
    const map = { "Under $50": 40, "$50–$100": 75, "$100–$200": 150, "$200–$300": 250, "$300+": 350 };
    if (map[budget]) return map[budget];
    const m = budget.match(/\$?([\d,]+)/);
    return m ? parseFloat(m[1].replace(",", "")) : 0;
  };

  const getKey = (o) => {
    if (!o.created_at) return "unknown";
    if (period === "month") return o.created_at.substring(0, 7);
    if (period === "week") {
      const d = new Date(o.created_at);
      d.setDate(d.getDate() - d.getDay());
      return d.toISOString().substring(0, 10);
    }
    return o.created_at.substring(0, 4);
  };

  // ── aggregate P&L ──
  const plByPeriod = {};
  localOrders.filter(o => o.status !== "Cancelled").forEach(o => {
    const key = getKey(o);
    if (!plByPeriod[key]) plByPeriod[key] = { revenue: 0, flowerCost: 0, laborCost: 0, suppliesCost: 0, count: 0 };
    plByPeriod[key].revenue += budgetToRevenue(o.budget);
    plByPeriod[key].flowerCost += parseFloat(o.flower_cost) || 0;
    plByPeriod[key].laborCost += parseFloat(o.labor_cost) || 0;
    plByPeriod[key].suppliesCost += parseFloat(o.supplies_cost) || 0;
    plByPeriod[key].count += 1;
  });

  // add overhead per period
  overhead.forEach(oh => {
    const key = period === "month" ? oh.month?.substring(0, 7) : period === "year" ? oh.month?.substring(0, 4) : oh.month?.substring(0, 7);
    if (key && plByPeriod[key]) {
      plByPeriod[key].overhead = (plByPeriod[key].overhead || 0) + (parseFloat(oh.rent) || 0) + (parseFloat(oh.utilities) || 0) + (parseFloat(oh.marketing) || 0) + (parseFloat(oh.other) || 0);
    }
  });

  const periods = Object.keys(plByPeriod).sort().slice(-6);
  const maxRevenue = Math.max(...periods.map(p => plByPeriod[p].revenue), 1);

  // ── totals ──
  const totalRevenue = periods.reduce((s, p) => s + plByPeriod[p].revenue, 0);
  const totalCOGS = periods.reduce((s, p) => s + plByPeriod[p].flowerCost + plByPeriod[p].laborCost + plByPeriod[p].suppliesCost, 0);
  const totalOverhead = periods.reduce((s, p) => s + (plByPeriod[p].overhead || 0), 0);
  const totalProfit = totalRevenue - totalCOGS - totalOverhead;
  const margin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;

  const fmt = (n) => `$${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  const shortKey = (k) => period === "month" ? k.substring(5) : period === "year" ? k : k.substring(5);

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      {/* Sub tabs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        {[["pl", "📊 P&L Summary"], ["orders", "💰 Order Costs"], ["overhead", "🏠 Overhead"]].map(([v, label]) => (
          <button key={v} onClick={() => setTab(v)} style={{
            padding: "10px", borderRadius: "12px", fontSize: "12px",
            border: `1.5px solid ${tab === v ? "#d4547a" : "#f0d0de"}`,
            background: tab === v ? "#fce4ec" : "white",
            color: tab === v ? "#8b3a5e" : "#b06080",
            cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: tab === v ? "600" : "400"
          }}>{label}</button>
        ))}
      </div>

      {/* ── P&L SUMMARY ── */}
      {tab === "pl" && (
        <>
          {/* Period toggle */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {[["month", "Monthly"], ["week", "Weekly"], ["year", "Yearly"]].map(([v, l]) => (
              <button key={v} onClick={() => setPeriod(v)} style={{
                padding: "7px 14px", borderRadius: "20px", fontSize: "11px", cursor: "pointer",
                border: period === v ? "none" : "1px solid #f0d0de",
                background: period === v ? "#8b3a5e" : "white",
                color: period === v ? "white" : "#8b3a5e", fontFamily: "Montserrat, sans-serif"
              }}>{l}</button>
            ))}
          </div>

          {/* KPI cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
            {[
              { label: "Revenue", value: fmt(totalRevenue), emoji: "💵", color: "#2e7d32", bg: "#e8f5e9" },
              { label: "COGS", value: fmt(totalCOGS), emoji: "🌸", color: "#c0396a", bg: "#fce4ec" },
              { label: "Overhead", value: fmt(totalOverhead), emoji: "🏠", color: "#e65100", bg: "#fff3e0" },
              { label: "Net Profit", value: fmt(totalProfit), emoji: totalProfit >= 0 ? "✅" : "⚠️", color: totalProfit >= 0 ? "#1565c0" : "#c62828", bg: totalProfit >= 0 ? "#e3f2fd" : "#ffebee" },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: "14px", padding: "16px", border: `1px solid ${s.bg}` }}>
                <div style={{ fontSize: "20px", marginBottom: "4px" }}>{s.emoji}</div>
                <div style={{ fontSize: "22px", fontWeight: "600", color: s.color, fontFamily: "Cormorant Garamond, serif" }}>{s.value}</div>
                <div style={{ fontSize: "10px", color: "#666", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Margin badge */}
          <div style={{ background: "white", borderRadius: "14px", padding: "14px 20px", marginBottom: "16px", border: "1px solid #f0d0de", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "#8b3a5e", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>Profit Margin</span>
            <span style={{ fontSize: "24px", fontWeight: "600", fontFamily: "Cormorant Garamond, serif", color: parseFloat(margin) >= 30 ? "#2e7d32" : parseFloat(margin) >= 10 ? "#e65100" : "#c62828" }}>{margin}%</span>
          </div>

          {/* Revenue vs Profit chart */}
          <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 12px rgba(180,80,120,0.08)", border: "1px solid #f0d0de" }}>
            <h3 style={{ margin: "0 0 16px", color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontWeight: "400" }}>Revenue vs Profit</h3>
            {periods.length === 0 ? <p style={{ color: "#b06080", fontFamily: "Montserrat, sans-serif", fontSize: "13px" }}>No data yet</p> : (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "130px" }}>
                {periods.map(p => {
                  const d = plByPeriod[p];
                  const profit = d.revenue - d.flowerCost - d.laborCost - d.suppliesCost - (d.overhead || 0);
                  return (
                    <div key={p} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                      <div style={{ fontSize: "9px", color: "#2e7d32", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>{fmt(profit)}</div>
                      <div style={{ width: "100%", position: "relative", height: `${(d.revenue / maxRevenue) * 90}px`, minHeight: "4px" }}>
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(180deg, #d4547a, #f4a7b9)", borderRadius: "4px 4px 0 0", height: "100%" }} />
                        {profit > 0 && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(180deg, #43a047, #81c784)", borderRadius: "4px 4px 0 0", height: `${(profit / d.revenue) * 100}%` }} />}
                      </div>
                      <div style={{ fontSize: "9px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{shortKey(p)}</div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ display: "flex", gap: "16px", marginTop: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#d4547a" }} /><span style={{ fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>Revenue</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#43a047" }} /><span style={{ fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>Profit</span></div>
            </div>
          </div>

          {/* Period breakdown table */}
          <div style={{ background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 12px rgba(180,80,120,0.08)", border: "1px solid #f0d0de" }}>
            <h3 style={{ margin: "0 0 14px", color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontWeight: "400" }}>Breakdown by Period</h3>
            {periods.map(p => {
              const d = plByPeriod[p];
              const cogs = d.flowerCost + d.laborCost + d.suppliesCost;
              const profit = d.revenue - cogs - (d.overhead || 0);
              return (
                <div key={p} style={{ borderBottom: "1px solid #f8e0eb", paddingBottom: "12px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#3a1a2e", fontFamily: "Cormorant Garamond, serif" }}>{shortKey(p)}</span>
                    <span style={{ fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{d.count} orders</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "6px" }}>
                    {[["Revenue", d.revenue, "#2e7d32"], ["COGS", cogs, "#c0396a"], ["Overhead", d.overhead || 0, "#e65100"], ["Profit", profit, profit >= 0 ? "#1565c0" : "#c62828"]].map(([l, v, c]) => (
                      <div key={l} style={{ background: "#fdf6f9", borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: c, fontFamily: "Montserrat, sans-serif" }}>{fmt(v)}</div>
                        <div style={{ fontSize: "9px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {periods.length === 0 && <p style={{ color: "#b06080", fontFamily: "Montserrat, sans-serif", fontSize: "13px" }}>No orders yet</p>}
          </div>
        </>
      )}

      {/* ── ORDER COSTS ── */}
      {tab === "orders" && (
        <div>
          <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>Enter your actual costs per order to track real profit. Revenue is estimated from the budget range.</p>
          {localOrders.filter(o => o.status !== "Cancelled").sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(order => {
            const totalCost = (parseFloat(order.flower_cost) || 0) + (parseFloat(order.labor_cost) || 0) + (parseFloat(order.supplies_cost) || 0);
            const revenue = budgetToRevenue(order.budget);
            const profit = revenue - totalCost;
            const isEditing = editingCosts === order.id;
            return (
              <div key={order.id} style={{ background: "white", borderRadius: "14px", marginBottom: "10px", border: "1px solid #f0d0de", overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ margin: "0 0 2px", fontWeight: "600", fontSize: "14px", color: "#3a1a2e", fontFamily: "Montserrat, sans-serif" }}>{order.first_name} {order.last_name}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{fmtDate(order.date_needed)} · {order.budget || "No budget"}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "15px", fontWeight: "600", color: profit >= 0 ? "#2e7d32" : "#c62828", fontFamily: "Cormorant Garamond, serif" }}>{fmt(profit)}</div>
                    <div style={{ fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>profit est.</div>
                  </div>
                </div>
                <div style={{ padding: "0 16px 12px" }}>
                  {isEditing ? (
                    <div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                        {[["flower_cost", "🌸 Flowers"], ["labor_cost", "👐 Labor"], ["supplies_cost", "📦 Supplies"]].map(([field, label]) => (
                          <div key={field}>
                            <p style={{ margin: "0 0 4px", fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>{label}</p>
                            <input type="number" placeholder="0.00" value={costForm[field]}
                              onChange={e => setCostForm(prev => ({ ...prev, [field]: e.target.value }))}
                              style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "13px", boxSizing: "border-box" }} />
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => saveCosts(order.id)} disabled={savingCost} style={{ flex: 1, background: "#d4547a", border: "none", color: "white", borderRadius: "8px", padding: "8px", fontSize: "12px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>{savingCost ? "Saving..." : "Save Costs"}</button>
                        <button onClick={() => setEditingCosts(null)} style={{ background: "white", border: "1px solid #f0d0de", color: "#8b3a5e", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", cursor: "pointer" }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "12px" }}>
                        {[["🌸", order.flower_cost], ["👐", order.labor_cost], ["📦", order.supplies_cost]].map(([icon, val], i) => (
                          <span key={i} style={{ fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{icon} {fmt(parseFloat(val) || 0)}</span>
                        ))}
                      </div>
                      <button onClick={() => { setEditingCosts(order.id); setCostForm({ flower_cost: order.flower_cost || "", labor_cost: order.labor_cost || "", supplies_cost: order.supplies_cost || "" }); }} style={{ background: "#fce4ec", border: "none", color: "#d4547a", borderRadius: "8px", padding: "6px 12px", fontSize: "11px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>✏️ Edit Costs</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {localOrders.filter(o => o.status !== "Cancelled").length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "16px", border: "1px solid #f0d0de" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>💰</div>
              <p style={{ color: "#b06080", fontFamily: "Montserrat, sans-serif", fontSize: "13px" }}>No orders yet.</p>
            </div>
          )}
        </div>
      )}

      {/* ── OVERHEAD ── */}
      {tab === "overhead" && (
        <div>
          <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>Track monthly fixed costs like rent, utilities, and marketing.</p>

          {/* Add form */}
          <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "16px", border: "1px solid #f0d0de" }}>
            <h3 style={{ margin: "0 0 14px", color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontSize: "18px", fontWeight: "400" }}>➕ Add Monthly Overhead</h3>
            <div style={{ marginBottom: "10px" }}>
              <p style={{ margin: "0 0 4px", fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>MONTH</p>
              <input type="month" value={ohForm.month.substring(0, 7)} onChange={e => setOhForm(p => ({ ...p, month: e.target.value + "-01" }))}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "13px", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
              {[["rent", "🏠 Rent"], ["utilities", "💡 Utilities"], ["marketing", "📣 Marketing"], ["other", "📝 Other"]].map(([field, label]) => (
                <div key={field}>
                  <p style={{ margin: "0 0 4px", fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>{label}</p>
                  <input type="number" placeholder="0.00" value={ohForm[field]} onChange={e => setOhForm(p => ({ ...p, [field]: e.target.value }))}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "13px", boxSizing: "border-box" }} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: "12px" }}>
              <p style={{ margin: "0 0 4px", fontSize: "10px", color: "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>NOTES (optional)</p>
              <input type="text" placeholder="e.g. First month in new studio" value={ohForm.notes} onChange={e => setOhForm(p => ({ ...p, notes: e.target.value }))}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #f0d0de", fontSize: "13px", boxSizing: "border-box" }} />
            </div>
            <button onClick={saveOverhead} disabled={savingOH} style={{ width: "100%", background: "linear-gradient(135deg, #d4547a, #c0396a)", border: "none", color: "white", borderRadius: "10px", padding: "11px", fontSize: "14px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>
              {savingOH ? "Saving..." : "Save Overhead"}
            </button>
          </div>

          {/* Overhead list */}
          {loadingOH ? <p style={{ textAlign: "center", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>Loading...</p> :
            overhead.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px", background: "white", borderRadius: "16px", border: "1px solid #f0d0de" }}>
                <p style={{ color: "#b06080", fontFamily: "Montserrat, sans-serif", fontSize: "13px" }}>No overhead entries yet.</p>
              </div>
            ) : overhead.map(oh => {
              const total = (parseFloat(oh.rent) || 0) + (parseFloat(oh.utilities) || 0) + (parseFloat(oh.marketing) || 0) + (parseFloat(oh.other) || 0);
              return (
                <div key={oh.id} style={{ background: "white", borderRadius: "14px", padding: "16px", marginBottom: "10px", border: "1px solid #f0d0de" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "16px", fontWeight: "600", color: "#3a1a2e", fontFamily: "Cormorant Garamond, serif" }}>{oh.month?.substring(0, 7)}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "16px", fontWeight: "600", color: "#c0396a", fontFamily: "Cormorant Garamond, serif" }}>{fmt(total)}</span>
                      <button onClick={() => deleteOverhead(oh.id)} style={{ background: "#ffebee", border: "none", color: "#c62828", borderRadius: "6px", padding: "4px 8px", fontSize: "11px", cursor: "pointer" }}>🗑</button>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    {[["🏠", oh.rent, "Rent"], ["💡", oh.utilities, "Utilities"], ["📣", oh.marketing, "Marketing"], ["📝", oh.other, "Other"]].map(([icon, val, label]) => parseFloat(val) > 0 ? (
                      <span key={label} style={{ fontSize: "11px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{icon} {label}: {fmt(parseFloat(val))}</span>
                    ) : null)}
                  </div>
                  {oh.notes && <p style={{ margin: "6px 0 0", fontSize: "11px", color: "#888", fontFamily: "Montserrat, sans-serif", fontStyle: "italic" }}>{oh.notes}</p>}
                </div>
              );
            })
          }
        </div>
      )}
    </div>
  );
}

// ─── INVENTORY VIEW ────────────────────────────────────────
function InventoryView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", unit: "stems", low_threshold: "10" });
  const [adding, setAdding] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/inventory?select=*&order=name.asc`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchInventory(); }, []);

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
        <button onClick={() => setAdding(!adding)} style={{ background: "linear-gradient(135deg, #d4547a, #c0396a)", border: "none", color: "white", borderRadius: "10px", padding: "8px 16px", fontSize: "12px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>+ Add Item</button>
      </div>

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
function DeliveryMapView({ orders }) {
  const deliveryOrders = orders.filter(o => o.delivery_type === "delivery" && o.delivery_address);
  const [selected, setSelected] = useState(null);

  const MAPS_KEY = "AIzaSyDGBwlMgOy3Figp08Yd-i3Ix_JH-uIsz-E";
  const mapSrc = selected
    ? `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${encodeURIComponent(selected.delivery_address + ", " + (selected.delivery_city || "Houston") + ", TX " + (selected.delivery_zip || ""))}&zoom=16`
    : `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=Houston,TX&zoom=11`;

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
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
      ) : deliveryOrders.map(o => (
        <div key={o.id} onClick={() => setSelected(o)} style={{ background: selected?.id === o.id ? "#fce4ec" : "white", borderRadius: "14px", padding: "14px 16px", marginBottom: "10px", boxShadow: "0 2px 8px rgba(180,80,120,0.06)", border: `1.5px solid ${selected?.id === o.id ? "#d4547a" : "#f0d0de"}`, cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "600", color: "#3a1a2e", fontFamily: "Montserrat, sans-serif" }}>📍 {o.first_name} {o.last_name}</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{o.delivery_address}, {o.delivery_city} {o.delivery_zip}</p>
            </div>
            <span style={{ padding: "2px 10px", borderRadius: "20px", fontSize: "10px", background: STATUS_COLORS[o.status]?.bg || "#f5f5f5", color: STATUS_COLORS[o.status]?.text || "#555", fontWeight: "600", fontFamily: "Montserrat, sans-serif" }}>{o.status}</span>
          </div>
        </div>
      ))}
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
  const [deletePw, setDeletePw] = useState("");
  const [deleteError, setDeleteError] = useState("");

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

  const updateStatus = async (id, status) => {
    await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
      method: "PATCH",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
      body: JSON.stringify({ status })
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "6px", maxWidth: "700px", margin: "0 auto" }}>
          {[
            ["orders", "📋", "Orders"],
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
      </div>

      <div style={{ padding: "16px 20px" }}>
        {/* ORDERS */}
        {mainView === "orders" && (
          <>
            <div style={{ maxWidth: "700px", margin: "0 auto 14px" }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <button onClick={() => setCalView("list")} style={{ flex: 1, padding: "9px", borderRadius: "10px", fontSize: "12px", border: `1.5px solid ${calView === "list" ? "#d4547a" : "#f0d0de"}`, background: calView === "list" ? "#fce4ec" : "white", color: calView === "list" ? "#8b3a5e" : "#b06080", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: calView === "list" ? "600" : "400" }}>📋 Order List</button>
                <button onClick={() => setCalView("calendar")} style={{ flex: 1, padding: "9px", borderRadius: "10px", fontSize: "12px", border: `1.5px solid ${calView === "calendar" ? "#d4547a" : "#f0d0de"}`, background: calView === "calendar" ? "#fce4ec" : "white", color: calView === "calendar" ? "#8b3a5e" : "#b06080", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: calView === "calendar" ? "600" : "400" }}>📅 Calendar</button>
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
                            ["⏰ Time", order.time_needed],
                            ["🎨 Palette", order.color_palette],
                            ["💰 Budget", order.budget],
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
        {mainView === "analytics" && <AnalyticsView orders={orders} />}
        {mainView === "inventory" && <InventoryView />}
        {mainView === "reviews" && <ReviewsView />}
        {mainView === "map" && <DeliveryMapView orders={orders} />}
      </div>
    </div>
  );
}
