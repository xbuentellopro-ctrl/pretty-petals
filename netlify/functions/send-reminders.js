// Netlify Scheduled Function — runs daily at 3pm UTC (10am Houston time)
// Schedule is set in netlify.toml

const SUPABASE_URL = "https://kxvdgjnybtwsusjvzmfc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4dmRnam55YnR3c3VzanZ6bWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDIwODEsImV4cCI6MjA5NTcxODA4MX0.8u1AZ0DJpyQc9ZnG8Pg6OTwrA_e5EgEjmpDXKUKdbHk";
const RESEND_KEY = "re_KxHrD7Rb_BXwm3ZazwMn9voTUPiLnhqJE";
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM = process.env.TWILIO_PHONE_NUMBER;

function getDaysUntil(occasionDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();
  // Use this year's occurrence of the occasion
  const oDate = new Date(occasionDate);
  let next = new Date(year, oDate.getMonth(), oDate.getDate());
  if (next < today) next = new Date(year + 1, oDate.getMonth(), oDate.getDate());
  const diff = Math.round((next - today) / (1000 * 60 * 60 * 24));
  return diff;
}

async function sendEmail(to, name, label, occasionType, daysOut) {
  const dayText = daysOut === 7 ? "7 days" : "3 days";
  const subject = `🌸 ${label} is in ${dayText} — order flowers today!`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 32px 24px; background: #fff5f8; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #d4547a; font-size: 28px; margin: 0;">🌸 Pretty Petals</h1>
      </div>
      <h2 style="color: #8b3a5e; font-size: 22px; margin: 0 0 12px;">Hi ${name}!</h2>
      <p style="color: #5a2a3e; font-size: 16px; line-height: 1.6;">
        Just a friendly reminder — <strong>${label}</strong> (${occasionType}) is coming up in <strong>${dayText}</strong>! 
      </p>
      <p style="color: #5a2a3e; font-size: 16px; line-height: 1.6;">
        Make it extra special with a beautiful bouquet from Pretty Petals. We'll handle all the details!
      </p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="https://prttypetals.com" style="background: linear-gradient(135deg, #d4547a, #c0396a); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px; font-weight: bold;">
          Order Now 🌹
        </a>
      </div>
      <p style="color: #b06080; font-size: 13px; text-align: center; margin-top: 24px;">
        Pretty Petals · Houston, TX · <a href="https://prttypetals.com" style="color: #d4547a;">prttypetals.com</a>
      </p>
    </div>
  `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Pretty Petals <noreply@prttypetals.com>",
      to: [to],
      subject,
      html
    })
  });
}

async function sendSMS(to, name, label, daysOut) {
  const dayText = daysOut === 7 ? "7 days" : "3 days";
  const message = `🌸 Hi ${name}! Just a reminder — ${label} is in ${dayText}! Order beautiful flowers at prttypetals.com 💐`;
  
  if (!to || to.length < 10) return;
  const phone = to.replace(/\D/g, "");
  const e164 = phone.length === 10 ? `+1${phone}` : `+${phone}`;

  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64")
    },
    body: new URLSearchParams({ To: e164, From: TWILIO_FROM, Body: message }).toString()
  });
}

const YAZMIN_EMAIL = "prettypetals410@gmail.com";

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

async function sendDailyDigest(orders) {
  if (!orders || orders.length === 0) return;

  const rows = orders.map(o => {
    const depositBadge = o.deposit_paid
      ? `<span style="color:#2e7d32;font-weight:bold;">💛 Deposit Paid</span>`
      : `<span style="color:#c62828;font-weight:bold;">⚠️ No Deposit</span>`;
    const paymentBadge = o.payment_status === "paid"
      ? `<span style="color:#2e7d32;font-weight:bold;">✅ Fully Paid</span>`
      : depositBadge;
    const delivery = o.delivery_type === "delivery"
      ? `🚗 Delivery — ${o.delivery_address || "—"}`
      : `🏠 Pickup`;
    return `
      <tr style="border-bottom:1px solid #f0d6e0;">
        <td style="padding:12px 8px;">
          <strong style="color:#8b3a5e;">${o.first_name} ${o.last_name}</strong><br/>
          <span style="color:#888;font-size:13px;">${o.email || ""}</span>
        </td>
        <td style="padding:12px 8px;color:#5a2a3e;font-size:14px;">${o.time || "—"}</td>
        <td style="padding:12px 8px;color:#5a2a3e;font-size:13px;">${delivery}</td>
        <td style="padding:12px 8px;font-size:13px;">${paymentBadge}</td>
      </tr>
    `;
  }).join("");

  const todayLabel = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const html = `
    <div style="font-family:Georgia,serif;max-width:620px;margin:0 auto;padding:32px 24px;background:#fff5f8;border-radius:16px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#d4547a;font-size:26px;margin:0;">🌸 Pretty Petals</h1>
        <p style="color:#b06080;margin:4px 0 0;">Daily Order Digest — ${todayLabel}</p>
      </div>
      <p style="color:#5a2a3e;font-size:15px;">You have <strong>${orders.length}</strong> order${orders.length !== 1 ? "s" : ""} today:</p>
      <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;">
        <thead>
          <tr style="background:#d4547a;color:#fff;font-size:13px;">
            <th style="padding:10px 8px;text-align:left;">Customer</th>
            <th style="padding:10px 8px;text-align:left;">Time</th>
            <th style="padding:10px 8px;text-align:left;">Delivery</th>
            <th style="padding:10px 8px;text-align:left;">Payment</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="color:#b06080;font-size:13px;text-align:center;margin-top:24px;">
        Pretty Petals · Houston, TX · <a href="https://prttypetals.com/admin" style="color:#d4547a;">Open Dashboard</a>
      </p>
    </div>
  `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Pretty Petals <noreply@prttypetals.com>",
      to: [YAZMIN_EMAIL],
      subject: `📋 Today's Orders — ${todayLabel} (${orders.length} order${orders.length !== 1 ? "s" : ""})`,
      html
    })
  });

  console.log(`Daily digest sent for ${orders.length} orders`);
}

async function sendDepositChaseEmail(orders) {
  if (!orders || orders.length === 0) return;

  const rows = orders.map(o => {
    const delivery = o.delivery_type === "delivery"
      ? `🚗 Delivery — ${o.delivery_address || "—"}`
      : `🏠 Pickup`;
    return `
      <tr style="border-bottom:1px solid #f0d6e0;">
        <td style="padding:12px 8px;">
          <strong style="color:#8b3a5e;">${o.first_name} ${o.last_name}</strong><br/>
          <span style="color:#888;font-size:13px;">${o.email || ""} · ${o.phone || ""}</span>
        </td>
        <td style="padding:12px 8px;color:#5a2a3e;font-size:14px;">${formatDate(o.date)}</td>
        <td style="padding:12px 8px;color:#5a2a3e;font-size:13px;">${delivery}</td>
        <td style="padding:12px 8px;color:#5a2a3e;font-size:13px;">${o.total_price ? `$${o.total_price}` : "—"}</td>
      </tr>
    `;
  }).join("");

  const html = `
    <div style="font-family:Georgia,serif;max-width:620px;margin:0 auto;padding:32px 24px;background:#fff5f8;border-radius:16px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#d4547a;font-size:26px;margin:0;">🌸 Pretty Petals</h1>
        <p style="color:#b06080;margin:4px 0 0;">Deposit Chase Reminder</p>
      </div>
      <p style="color:#5a2a3e;font-size:15px;">
        ⚠️ The following <strong>${orders.length}</strong> order${orders.length !== 1 ? "s are" : " is"} due in <strong>3 days</strong> and still need${orders.length === 1 ? "s" : ""} a deposit:
      </p>
      <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;">
        <thead>
          <tr style="background:#c0396a;color:#fff;font-size:13px;">
            <th style="padding:10px 8px;text-align:left;">Customer</th>
            <th style="padding:10px 8px;text-align:left;">Date</th>
            <th style="padding:10px 8px;text-align:left;">Delivery</th>
            <th style="padding:10px 8px;text-align:left;">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="text-align:center;margin:28px 0;">
        <a href="https://prttypetals.com/admin" style="background:linear-gradient(135deg,#d4547a,#c0396a);color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-size:16px;font-weight:bold;">
          Open Dashboard to Chase 💌
        </a>
      </div>
      <p style="color:#b06080;font-size:13px;text-align:center;margin-top:24px;">
        Pretty Petals · Houston, TX · <a href="https://prttypetals.com" style="color:#d4547a;">prttypetals.com</a>
      </p>
    </div>
  `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Pretty Petals <noreply@prttypetals.com>",
      to: [YAZMIN_EMAIL],
      subject: `⚠️ ${orders.length} Order${orders.length !== 1 ? "s" : ""} Need${orders.length === 1 ? "s" : ""} a Deposit — Due in 3 Days`,
      html
    })
  });

  console.log(`Deposit chase email sent for ${orders.length} orders`);
}

exports.handler = async function(event) {
  try {
    // Get today's date and 3-days-out date in Houston time
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
    const todayStr = now.toISOString().split("T")[0];
    const threeDaysOut = new Date(now);
    threeDaysOut.setDate(threeDaysOut.getDate() + 3);
    const threeDaysStr = threeDaysOut.toISOString().split("T")[0];

    // Fetch all non-cancelled orders
    const ordersRes = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?select=*&status=neq.Cancelled`,
      { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } }
    );
    const allOrders = await ordersRes.json();

    if (Array.isArray(allOrders)) {
      // Daily digest — orders due today
      const todaysOrders = allOrders.filter(o => o.date === todayStr);
      await sendDailyDigest(todaysOrders);

      // Deposit chase — orders due in 3 days with no deposit
      const depositChaseOrders = allOrders.filter(o => o.date === threeDaysStr && !o.deposit_paid);
      await sendDepositChaseEmail(depositChaseOrders);
    }

    // Get all reminders
    const remRes = await fetch(`${SUPABASE_URL}/rest/v1/occasion_reminders?select=*`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const reminders = await remRes.json();
    // Get all customers
    const custRes = await fetch(`${SUPABASE_URL}/rest/v1/customers?select=*`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const customers = await custRes.json();
    const customerMap = {};
    if (Array.isArray(customers)) customers.forEach(c => { customerMap[c.id] = c; });

    let sent = 0;
    for (const reminder of (Array.isArray(reminders) ? reminders : [])) {
      const customer = customerMap[reminder.customer_id];
      if (!customer) continue;

      const daysOut = getDaysUntil(reminder.occasion_date);
      const shouldSend7 = reminder.remind_7 && daysOut === 7;
      const shouldSend3 = reminder.remind_3 && daysOut === 3;
      if (!shouldSend7 && !shouldSend3) continue;

      const days = shouldSend7 ? 7 : 3;

      if (customer.email) {
        await sendEmail(customer.email, customer.first_name, reminder.label, reminder.occasion_type, days);
      }
      if (customer.phone) {
        try { await sendSMS(customer.phone, customer.first_name, reminder.label, days); }
        catch (e) { console.log("SMS failed:", e.message); }
      }

      sent++;
      console.log(`Sent to ${customer.email} for ${reminder.label} (${days} days)`);
    }

    return { statusCode: 200, body: JSON.stringify({ sent }) };
  } catch (e) {
    console.error("Reminder error:", e);
    return { statusCode: 500, body: e.message };
  }
};
