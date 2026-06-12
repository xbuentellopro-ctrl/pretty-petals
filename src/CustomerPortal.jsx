import { useState, useEffect } from "react";

const SUPABASE_URL = "https://kxvdgjnybtwsusjvzmfc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4dmRnam55YnR3c3VzanZ6bWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDIwODEsImV4cCI6MjA5NTcxODA4MX0.8u1AZ0DJpyQc9ZnG8Pg6OTwrA_e5EgEjmpDXKUKdbHk";

const STATUS_STEPS = ["New", "Confirmed", "In Progress", "Ready", "Delivered"];
const STATUS_COLORS = {
  "New": { bg: "#e3f2fd", text: "#1565c0" },
  "Confirmed": { bg: "#e8f5e9", text: "#2e7d32" },
  "In Progress": { bg: "#fff8e1", text: "#f57f17" },
  "Ready": { bg: "#f3e5f5", text: "#6a1b9a" },
  "Delivered": { bg: "#e0f2f1", text: "#00695c" },
  "Cancelled": { bg: "#ffebee", text: "#c62828" },
};

const OCCASION_TYPES = ["Birthday", "Anniversary", "Valentine's Day", "Mother's Day", "Wedding", "Graduation", "Other"];

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function StatusTracker({ status }) {
  const currentIdx = STATUS_STEPS.indexOf(status);
  const isCancelled = status === "Cancelled";
  return (
    <div style={{ margin: "16px 0" }}>
      {isCancelled ? (
        <div style={{ background: "#ffebee", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
          <p style={{ margin: 0, color: "#c62828", fontFamily: "Montserrat, sans-serif", fontWeight: "600", fontSize: "13px" }}>❌ Order Cancelled</p>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center" }}>
          {STATUS_STEPS.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STATUS_STEPS.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: i <= currentIdx ? "linear-gradient(135deg, #d4547a, #c0396a)" : "#f0e0ea",
                  fontSize: "12px", fontWeight: "600", color: i <= currentIdx ? "white" : "#c49aae",
                  boxShadow: i === currentIdx ? "0 0 0 3px rgba(212,84,122,0.2)" : "none"
                }}>
                  {i < currentIdx ? "✓" : i === currentIdx ? "●" : "○"}
                </div>
                <span style={{ fontSize: "8px", color: i <= currentIdx ? "#d4547a" : "#c49aae", fontFamily: "Montserrat, sans-serif", fontWeight: "600", textAlign: "center", maxWidth: "40px", lineHeight: "1.2" }}>{s}</span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div style={{ flex: 1, height: "2px", background: i < currentIdx ? "linear-gradient(90deg, #d4547a, #c0396a)" : "#f0e0ea", margin: "0 2px", marginBottom: "18px" }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CustomerPortal({ onClose }) {
  const [screen, setScreen] = useState("login");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [session, setSession] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [newReminder, setNewReminder] = useState({ label: "", occasion_type: "Birthday", occasion_date: "", remind_7: true, remind_3: true });
  const [addingReminder, setAddingReminder] = useState(false);

  const sendOTP = async () => {
    if (!email.trim()) { setError("Please enter your email address"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
        method: "POST",
        headers: { "apikey": SUPABASE_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), create_user: true })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || data.msg || "Failed to send code");
      setScreen("verify");
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const verifyOTP = async () => {
    if (!code.trim()) { setError("Please enter the code"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
        method: "POST",
        headers: { "apikey": SUPABASE_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), token: code, type: "email" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || "Invalid code");
      setSession(data);
      await loadCustomerData(data.access_token, email.trim().toLowerCase());
      setScreen("home");
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const loadCustomerData = async (token, userEmail) => {
    // Get user id
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` }
    });
    const user = await userRes.json();
    if (!user?.id) { console.error("No user id", user); return; }

    // Try to get existing profile
    const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/customers?id=eq.${user.id}&select=*`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` }
    });
    const profiles = await profileRes.json();
    let profile = Array.isArray(profiles) ? profiles[0] : null;

    // Create profile if doesn't exist
    if (!profile) {
      // Look up their name from orders
      const ordersRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?email=ilike.${encodeURIComponent(userEmail)}&order=created_at.desc&limit=1&select=first_name,last_name,phone`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
      });
      const orderData = await ordersRes.json();
      const firstOrder = Array.isArray(orderData) ? orderData[0] : null;

      // Insert using service key so RLS doesn't block
      const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/customers`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          id: user.id,
          first_name: firstOrder?.first_name || "",
          last_name: firstOrder?.last_name || "",
          phone: firstOrder?.phone || "",
          email: userEmail
        })
      });
      const inserted = await insertRes.json();
      if (Array.isArray(inserted) && inserted[0]) {
        profile = inserted[0];
      } else {
        // Insert may have failed due to conflict — retry fetch by email
        console.log("Customer insert result:", JSON.stringify(inserted));
        const retryRes = await fetch(`${SUPABASE_URL}/rest/v1/customers?email=eq.${encodeURIComponent(userEmail)}&select=*`, {
          headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        });
        const retryData = await retryRes.json();
        profile = Array.isArray(retryData) ? retryData[0] : null;
      }
    }

    if (profile) setCustomer(profile);

    // Load orders by email
    const ordersRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?email=ilike.${encodeURIComponent(userEmail)}&order=created_at.desc&select=*`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const orderData = await ordersRes.json();
    setOrders(Array.isArray(orderData) ? orderData : []);

    // Load reminders
    if (profile?.id) {
      const remRes = await fetch(`${SUPABASE_URL}/rest/v1/occasion_reminders?customer_id=eq.${profile.id}&order=occasion_date.asc&select=*`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` }
      });
      const remData = await remRes.json();
      setReminders(Array.isArray(remData) ? remData : []);
    }
  };

  const addReminder = async () => {
    if (!newReminder.label || !newReminder.occasion_date) { setError("Please fill in all fields"); return; }
    if (!customer?.id) { setError("Account not loaded yet. Please log out and log in again."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/occasion_reminders`, {
        method: "POST",
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${session.access_token}`, "Content-Type": "application/json", "Prefer": "return=representation" },
        body: JSON.stringify({ customer_id: customer.id, ...newReminder })
      });
      const data = await res.json();
      if (Array.isArray(data)) setReminders(prev => [...prev, ...data]);

      // Check if occasion is exactly 7 or 3 days away — if so send immediately
      const today = new Date(); today.setHours(0,0,0,0);
      const oDate = new Date(newReminder.occasion_date + "T00:00:00");
      const diff = Math.round((oDate - today) / (1000 * 60 * 60 * 24));
      if ((diff === 7 && newReminder.remind_7) || (diff === 3 && newReminder.remind_3)) {
        await fetch("/.netlify/functions/send-reminders", { method: "POST" });
      }
      setNewReminder({ label: "", occasion_type: "Birthday", occasion_date: "", remind_7: true, remind_3: true });
      setAddingReminder(false);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const deleteReminder = async (id) => {
    await fetch(`${SUPABASE_URL}/rest/v1/occasion_reminders?id=eq.${id}`, {
      method: "DELETE",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${session.access_token}` }
    });
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const inputStyle = { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1.5px solid #f0d0de", fontSize: "15px", fontFamily: "Montserrat, sans-serif", boxSizing: "border-box", outline: "none", color: "#3a1a2e", background: "white" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: "480px", maxHeight: "92vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet" />

        <div style={{ background: "linear-gradient(135deg, #d4547a, #c0396a)", padding: "20px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <h2 style={{ color: "white", fontFamily: "Cormorant Garamond, serif", fontSize: "24px", fontWeight: "400", margin: 0 }}>
              {screen === "home" || screen === "reminders" ? `Hi, ${customer?.first_name || "there"} 🌸` : "My Account"}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", margin: 0, fontFamily: "Montserrat, sans-serif" }}>Pretty Petals Customer Portal</p>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", borderRadius: "50%", width: "32px", height: "32px", fontSize: "18px", cursor: "pointer" }}>×</button>
        </div>

        {(screen === "home" || screen === "reminders") && (
          <div style={{ display: "flex", borderBottom: "1px solid #f0d0de", background: "white", flexShrink: 0 }}>
            {[["home", "📋 My Orders"], ["reminders", "🔔 Reminders"]].map(([s, label]) => (
              <button key={s} onClick={() => setScreen(s)} style={{ flex: 1, padding: "12px", border: "none", borderBottom: screen === s ? "2px solid #d4547a" : "2px solid transparent", background: "white", color: screen === s ? "#d4547a" : "#b06080", fontFamily: "Montserrat, sans-serif", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>{label}</button>
            ))}
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>

          {screen === "login" && (
            <div>
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <div style={{ fontSize: "48px", marginBottom: "8px" }}>🌸</div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", color: "#8b3a5e", fontSize: "24px", fontWeight: "400", margin: "0 0 6px" }}>Welcome Back</h3>
                <p style={{ color: "#b06080", fontFamily: "Montserrat, sans-serif", fontSize: "13px", margin: 0 }}>Enter your email to get a login code</p>
              </div>
              <input type="email" placeholder="your@email.com" value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && sendOTP()}
                style={inputStyle} />
              {error && <p style={{ color: "#c62828", fontSize: "12px", fontFamily: "Montserrat, sans-serif", margin: "8px 0 0" }}>{error}</p>}
              <button onClick={sendOTP} disabled={loading} style={{ width: "100%", marginTop: "16px", padding: "14px", borderRadius: "12px", border: "none", background: loading ? "#e8a0b8" : "linear-gradient(135deg, #d4547a, #c0396a)", color: "white", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Cormorant Garamond, serif", fontWeight: "600", boxShadow: "0 4px 20px rgba(180,80,120,0.3)" }}>
                {loading ? "Sending..." : "Send Login Code 📧"}
              </button>
              <p style={{ textAlign: "center", color: "#c49aae", fontSize: "12px", fontFamily: "Montserrat, sans-serif", marginTop: "16px", lineHeight: "1.6" }}>
                We'll email you a 6-digit code. No password needed.
              </p>
            </div>
          )}

          {screen === "verify" && (
            <div>
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <div style={{ fontSize: "48px", marginBottom: "8px" }}>📧</div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", color: "#8b3a5e", fontSize: "24px", fontWeight: "400", margin: "0 0 6px" }}>Check Your Email</h3>
                <p style={{ color: "#b06080", fontFamily: "Montserrat, sans-serif", fontSize: "13px", margin: 0 }}>We sent a 6-digit code to {email}</p>
              </div>
              <input type="number" placeholder="123456" value={code}
                onChange={e => { setCode(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && verifyOTP()}
                style={{ ...inputStyle, fontSize: "28px", textAlign: "center", letterSpacing: "8px" }} />
              {error && <p style={{ color: "#c62828", fontSize: "12px", fontFamily: "Montserrat, sans-serif", margin: "8px 0 0" }}>{error}</p>}
              <button onClick={verifyOTP} disabled={loading} style={{ width: "100%", marginTop: "16px", padding: "14px", borderRadius: "12px", border: "none", background: loading ? "#e8a0b8" : "linear-gradient(135deg, #d4547a, #c0396a)", color: "white", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Cormorant Garamond, serif", fontWeight: "600", boxShadow: "0 4px 20px rgba(180,80,120,0.3)" }}>
                {loading ? "Verifying..." : "Verify Code ✓"}
              </button>
              <button onClick={() => { setScreen("login"); setCode(""); setError(""); }} style={{ width: "100%", marginTop: "10px", padding: "12px", borderRadius: "12px", border: "1.5px solid #f0d0de", background: "white", color: "#b06080", fontSize: "14px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>← Back</button>
            </div>
          )}

          {screen === "home" && (
            <div>
              {orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌸</div>
                  <p style={{ color: "#b06080", fontFamily: "Montserrat, sans-serif", fontSize: "14px" }}>No orders yet. Place your first order!</p>
                </div>
              ) : orders.map(order => (
                <div key={order.id} style={{ background: "white", borderRadius: "16px", marginBottom: "14px", boxShadow: "0 2px 16px rgba(180,80,120,0.1)", border: "1px solid #f0d0de", overflow: "hidden" }}>
                  <div onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} style={{ padding: "16px", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <p style={{ margin: "0 0 2px", fontSize: "15px", fontWeight: "600", color: "#3a1a2e", fontFamily: "Cormorant Garamond, serif" }}>{order.occasion || "Flower Order"}</p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{fmtDate(order.date_needed)}</p>
                      </div>
                      <span style={{ padding: "3px 12px", borderRadius: "20px", fontSize: "11px", background: STATUS_COLORS[order.status]?.bg || "#f5f5f5", color: STATUS_COLORS[order.status]?.text || "#555", fontWeight: "600", fontFamily: "Montserrat, sans-serif" }}>{order.status}</span>
                    </div>
                    <StatusTracker status={order.status} />
                    <p style={{ margin: 0, fontSize: "11px", color: "#c49aae", fontFamily: "Montserrat, sans-serif", textAlign: "right" }}>{expandedOrder === order.id ? "tap to collapse ▲" : "tap for details ▼"}</p>
                  </div>
                  {expandedOrder === order.id && (
                    <div style={{ padding: "0 16px 16px", borderTop: "1px solid #f8e8f0" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px" }}>
                        {[
                          ["📅 Date", fmtDate(order.date_needed)],
                          ["⏰ Time", order.time_needed || "—"],
                          ["🚗 Type", order.delivery_type === "delivery" ? "Delivery" : "Pickup"],
                          ["💰 Budget", order.budget || "—"],
                          ["🎨 Palette", order.color_palette || "—"],
                          ["🏠 Address", order.delivery_address ? `${order.delivery_address}, ${order.delivery_city}` : "—"],
                        ].map(([label, val]) => (
                          <div key={label} style={{ background: "#fdf6f9", borderRadius: "8px", padding: "8px 10px" }}>
                            <p style={{ margin: "0 0 2px", fontSize: "10px", color: "#b06080", fontWeight: "600", fontFamily: "Montserrat, sans-serif" }}>{label}</p>
                            <p style={{ margin: 0, fontSize: "12px", color: "#3a1a2e", fontFamily: "Montserrat, sans-serif" }}>{val}</p>
                          </div>
                        ))}
                      </div>
                      {order.personal_note && (
                        <div style={{ background: "#fff8fb", borderRadius: "8px", padding: "10px", marginTop: "10px", border: "1px solid #f0d0de" }}>
                          <p style={{ margin: "0 0 4px", fontSize: "10px", color: "#b06080", fontWeight: "600", fontFamily: "Montserrat, sans-serif" }}>💌 YOUR NOTE</p>
                          <p style={{ margin: 0, fontSize: "13px", color: "#3a1a2e", fontStyle: "italic", fontFamily: "Cormorant Garamond, serif" }}>{order.personal_note}</p>
                        </div>
                      )}
                      {order.status === "Ready" && <div style={{ background: "#f3e5f5", borderRadius: "10px", padding: "12px", marginTop: "10px", textAlign: "center" }}><p style={{ margin: 0, color: "#6a1b9a", fontFamily: "Montserrat, sans-serif", fontSize: "13px", fontWeight: "600" }}>🌸 Your bouquet is ready! Yazmin will be in touch shortly.</p></div>}
                      {order.status === "Delivered" && <div style={{ background: "#e0f2f1", borderRadius: "10px", padding: "12px", marginTop: "10px", textAlign: "center" }}><p style={{ margin: 0, color: "#00695c", fontFamily: "Montserrat, sans-serif", fontSize: "13px", fontWeight: "600" }}>💚 Delivered! Thank you for choosing Pretty Petals 🌸</p></div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {screen === "reminders" && (
            <div>
              <div style={{ background: "linear-gradient(135deg, #fff0f6, #fce4ec)", borderRadius: "14px", padding: "14px 16px", marginBottom: "16px", border: "1px solid #f0d0de" }}>
                <p style={{ margin: "0 0 4px", fontSize: "14px", color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontWeight: "600" }}>🔔 Never Miss a Special Day</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif", lineHeight: "1.6" }}>We'll text and email you 7 days and 3 days before so you have time to order something beautiful.</p>
              </div>
              <button onClick={() => setAddingReminder(true)} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #d4547a, #c0396a)", color: "white", fontSize: "14px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600", marginBottom: "16px" }}>+ Add Reminder</button>
              {addingReminder && (
                <div style={{ background: "white", borderRadius: "14px", padding: "16px", marginBottom: "16px", border: "1.5px solid #f0d0de" }}>
                  <input placeholder="e.g. Mom's Birthday, Our Anniversary" value={newReminder.label} onChange={e => setNewReminder(s => ({ ...s, label: e.target.value }))} style={{ ...inputStyle, marginBottom: "10px", fontSize: "14px" }} />
                  <select value={newReminder.occasion_type} onChange={e => setNewReminder(s => ({ ...s, occasion_type: e.target.value }))} style={{ ...inputStyle, marginBottom: "10px", fontSize: "14px" }}>
                    {OCCASION_TYPES.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <input type="date" value={newReminder.occasion_date} onChange={e => setNewReminder(s => ({ ...s, occasion_date: e.target.value }))} style={{ ...inputStyle, marginBottom: "10px", fontSize: "14px" }} />
                  <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
                    {[["remind_7", "7 days before"], ["remind_3", "3 days before"]].map(([key, label]) => (
                      <label key={key} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "12px", color: "#8b3a5e", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>
                        <input type="checkbox" checked={newReminder[key]} onChange={e => setNewReminder(s => ({ ...s, [key]: e.target.checked }))} />{label}
                      </label>
                    ))}
                  </div>
                  {error && <p style={{ color: "#c62828", fontSize: "12px", fontFamily: "Montserrat, sans-serif", margin: "0 0 8px" }}>{error}</p>}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={addReminder} disabled={loading} style={{ flex: 2, padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #d4547a, #c0396a)", color: "white", fontSize: "14px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>Save</button>
                    <button onClick={() => { setAddingReminder(false); setError(""); }} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1.5px solid #f0d0de", background: "white", color: "#b06080", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              )}
              {reminders.length === 0 && !addingReminder ? (
                <div style={{ textAlign: "center", padding: "30px 20px" }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>🔔</div>
                  <p style={{ color: "#b06080", fontFamily: "Montserrat, sans-serif", fontSize: "13px" }}>No reminders yet. Add one above!</p>
                </div>
              ) : reminders.map(r => (
                <div key={r.id} style={{ background: "white", borderRadius: "14px", padding: "14px 16px", marginBottom: "10px", boxShadow: "0 2px 12px rgba(180,80,120,0.06)", border: "1px solid #f0d0de", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "600", color: "#3a1a2e", fontFamily: "Montserrat, sans-serif" }}>{r.label}</p>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>{r.occasion_type} · {fmtDate(r.occasion_date)}</p>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {r.remind_7 && <span style={{ fontSize: "10px", background: "#fce4ec", color: "#d4547a", padding: "2px 8px", borderRadius: "10px", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>7 days</span>}
                      {r.remind_3 && <span style={{ fontSize: "10px", background: "#fce4ec", color: "#d4547a", padding: "2px 8px", borderRadius: "10px", fontFamily: "Montserrat, sans-serif", fontWeight: "600" }}>3 days</span>}
                    </div>
                  </div>
                  <button onClick={() => deleteReminder(r.id)} style={{ background: "#ffebee", border: "none", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", color: "#c62828", fontSize: "16px" }}>🗑</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

