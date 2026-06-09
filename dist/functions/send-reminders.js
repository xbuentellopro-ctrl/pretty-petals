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

exports.handler = async function(event) {
  try {
    // Get all reminders
    const remRes = await fetch(`${SUPABASE_URL}/rest/v1/occasion_reminders?select=*`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const reminders = await remRes.json();

    if (!Array.isArray(reminders) || reminders.length === 0) {
      console.log("No reminders found");
      return { statusCode: 200, body: "No reminders" };
    }

    // Get all customers
    const custRes = await fetch(`${SUPABASE_URL}/rest/v1/customers?select=*`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const customers = await custRes.json();
    const customerMap = {};
    if (Array.isArray(customers)) customers.forEach(c => { customerMap[c.id] = c; });

    let sent = 0;
    for (const reminder of reminders) {
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
