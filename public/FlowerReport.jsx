import { useState, useEffect } from "react";

const SUPABASE_URL = "https://kxvdgjnybtwsusjvzmfc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4dmRnam55YnR3c3VzanZ6bWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDIwODEsImV4cCI6MjA5NTcxODA4MX0.8u1AZ0DJpyQc9ZnG8Pg6OTwrA_e5EgEjmpDXKUKdbHk";

export default function FlowerReport() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    }).then(r => r.json()).then(data => {
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: "#b06080", fontFamily: "Montserrat, sans-serif" }}>Loading...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "Montserrat, sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "#8b3a5e", fontFamily: "Cormorant Garamond, serif", fontSize: "32px", fontWeight: "400" }}>🌸 Flower Report</h1>
      <p style={{ color: "#b06080" }}>{orders.length} total orders</p>
      {orders.map(o => (
        <div key={o.id} style={{ background: "white", borderRadius: "12px", padding: "16px", marginBottom: "12px", boxShadow: "0 2px 8px rgba(180,80,120,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <strong style={{ color: "#3a1a2e" }}>{o.first_name} {o.last_name}</strong>
            <span style={{ color: "#d4547a", fontSize: "13px", fontWeight: "600" }}>{o.status}</span>
          </div>
          <p style={{ margin: "0 0 4px", color: "#b06080", fontSize: "13px" }}>{o.occasion} · {o.date_needed} · {o.budget}</p>
          <p style={{ margin: 0, color: "#b06080", fontSize: "13px" }}>{o.color_palette} {o.color_notes ? `· ${o.color_notes}` : ""}</p>
        </div>
      ))}
    </div>
  );
}
