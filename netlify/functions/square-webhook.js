const crypto = require("crypto");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
const WEBHOOK_SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

function verifySignature(body, signature, url) {
  if (!WEBHOOK_SIGNATURE_KEY) return true; // skip in dev
  const hmac = crypto.createHmac("sha256", WEBHOOK_SIGNATURE_KEY);
  hmac.update(url + body);
  const expected = hmac.digest("base64");
  return expected === signature;
}

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  // Verify Square signature
  const signature = event.headers["x-square-hmacsha256-signature"];
  const webhookUrl = `https://prttypetals.com/.netlify/functions/square-webhook`;
  if (!verifySignature(event.body, signature, webhookUrl)) {
    console.error("Invalid Square webhook signature");
    return { statusCode: 401, body: "Invalid signature" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch(e) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  console.log("Square webhook event:", payload.type);

  // Only handle completed payments
  if (payload.type !== "payment.updated") {
    return { statusCode: 200, body: "Ignored" };
  }

  const payment = payload.data?.object?.payment;
  if (!payment) {
    return { statusCode: 200, body: "No payment object" };
  }

  // Only process when payment status is COMPLETED
  if (payment.status !== "COMPLETED") {
    console.log("Ignoring payment status:", payment.status);
    return { statusCode: 200, body: "Payment not completed yet" };
  }

  // Extract order_id from the note we stored: "order_id:123 type:50% Deposit"
  const note = payment.note || "";
  const orderIdMatch = note.match(/order_id:([^\s]+)/);
  const paymentType = note.match(/type:(.+)/)?.[1] || "";
  const orderId = orderIdMatch?.[1];

  if (!orderId) {
    console.log("No order_id found in payment note:", note);
    return { statusCode: 200, body: "No order_id in note" };
  }

  const amountPaid = (payment.amount_money?.amount || 0) / 100; // cents to dollars
  const isDeposit = paymentType.toLowerCase().includes("deposit");
  const paymentMethod = "Square";

  // Fetch current order to check existing values
  const fetchRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}&select=total_price,deposit_amount,is_paid,deposit_paid`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    }
  });
  const orders = await fetchRes.json();
  const order = orders?.[0];

  if (!order) {
    console.error("Order not found:", orderId);
    return { statusCode: 200, body: "Order not found" };
  }

  // Build the update
  let update = {
    payment_method: paymentMethod,
    paid_at: new Date().toISOString()
  };

  if (isDeposit) {
    update.deposit_paid = true;
    update.deposit_amount = amountPaid;
    update.payment_status = "deposit_paid";
    // Set total_price if not already set (deposit = 50% so total = deposit * 2)
    if (!order.total_price || order.total_price === 0) {
      update.total_price = amountPaid * 2;
    }
  } else {
    // Final payment
    update.is_paid = true;
    update.deposit_paid = true;
    update.payment_status = "fully_paid";
    update.balance_amount = amountPaid;
    if (!order.total_price || order.total_price === 0) {
      const depositAmt = order.deposit_amount || amountPaid;
      update.total_price = depositAmt + amountPaid;
    }
  }

  // Update Supabase
  const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`, {
    method: "PATCH",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(update)
  });

  if (!updateRes.ok) {
    const err = await updateRes.text();
    console.error("Supabase update failed:", err);
    return { statusCode: 500, body: "Supabase update failed" };
  }

  console.log(`✅ Order ${orderId} updated — ${isDeposit ? "deposit paid" : "fully paid"} $${amountPaid}`);
  return { statusCode: 200, body: "OK" };
};
