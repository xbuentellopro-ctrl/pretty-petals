exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch(e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { amount, customer_name, customer_email, customer_phone, order_id, payment_type, note } = data;
  const SQUARE_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
  const SQUARE_LOCATION = process.env.SQUARE_LOCATION_ID;
  const RESEND_KEY = "re_KxHrD7Rb_BXwm3ZazwMn9voTUPiLnhqJE";

  // --- Square payment link ---
  let paymentUrl = null;
  try {
    const idempotencyKey = `${order_id}-${payment_type}-${Date.now()}`;
    const amountCents = Math.round(amount * 100);

    const squareRes = await fetch("https://connect.squareup.com/v2/online-checkout/payment-links", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SQUARE_TOKEN}`,
        "Content-Type": "application/json",
        "Square-Version": "2025-01-23"
      },
      body: JSON.stringify({
        idempotency_key: idempotencyKey,
        quick_pay: {
          name: `Pretty Petals – ${payment_type}`,
          price_money: {
            amount: amountCents,
            currency: "USD"
          },
          location_id: SQUARE_LOCATION
        },
        checkout_options: {
          redirect_url: "https://prttypetals.com",
          ask_for_shipping_address: false
        },
        pre_populated_data: {
          buyer_email: customer_email || undefined
        },
        description: note || `Custom floral arrangement for ${customer_name}`
      })
    });

    const squareText = await squareRes.text();
    console.log("Square raw response:", squareRes.status, squareText);

    let squareResult;
    try {
      squareResult = JSON.parse(squareText);
    } catch(e) {
      return { statusCode: 500, body: JSON.stringify({ error: "Square returned non-JSON: " + squareText.substring(0, 200) }) };
    }

    if (!squareRes.ok || !squareResult.payment_link) {
      return { statusCode: 500, body: JSON.stringify({ error: squareResult }) };
    }

    paymentUrl = squareResult.payment_link.url;
  } catch(err) {
    console.error("Square error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Square request failed: " + err.message }) };
  }

  // --- Send via email (Resend) while SMS/Twilio A2P is pending ---
  const isDeposit = payment_type && payment_type.toLowerCase().includes("deposit");
  const firstName = customer_name ? customer_name.split(" ")[0] : "there";

  const emailHtml = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8b3a5e; font-size: 32px; margin: 0;">🌸 Pretty Petals</h1>
        <p style="color: #b06080; font-size: 14px; margin: 4px 0 0; letter-spacing: 0.1em;">CUSTOM FLORAL ARRANGEMENTS · HOUSTON, TX</p>
      </div>
      <div style="background: #fff0f6; border-radius: 16px; padding: 32px; margin-bottom: 24px; text-align: center;">
        <h2 style="color: #8b3a5e; margin: 0 0 8px;">Hi ${firstName}! 🌸</h2>
        <h3 style="color: #d4547a; margin: 0 0 16px; font-weight: normal;">
          ${isDeposit ? "Your order is confirmed — please pay your deposit!" : "Your flowers are ready — please pay your balance!"}
        </h3>
        <p style="color: #5a2a3e; line-height: 1.8; font-size: 16px; margin: 0 0 24px;">
          ${isDeposit
            ? `We're excited to create your arrangement! To lock in your order, please pay your 50% deposit of <strong>$${amount.toFixed(2)}</strong> using the button below.`
            : `Your beautiful arrangement is ready! Please complete your final payment of <strong>$${amount.toFixed(2)}</strong> to confirm pickup or delivery.`
          }
        </p>
        <a href="${paymentUrl}"
           style="display: inline-block; padding: 16px 40px; background-color: #d4547a; color: white; text-decoration: none; border-radius: 12px; font-size: 18px; font-weight: bold;">
          Pay $${amount.toFixed(2)} Now
        </a>
        <p style="color: #b06080; margin: 16px 0 0; font-size: 13px;">
          Or copy this link:<br/>
          <a href="${paymentUrl}" style="color: #d4547a; word-break: break-all;">${paymentUrl}</a>
        </p>
      </div>
      <div style="text-align: center; color: #b06080; font-size: 14px; line-height: 1.8;">
        <p>Questions? Email us at <a href="mailto:orders@prttypetals.com" style="color: #d4547a;">orders@prttypetals.com</a></p>
        <p>Follow us on Instagram <a href="https://instagram.com/prttypetalss" style="color: #d4547a;">@prttypetalss</a></p>
        <p style="margin-top: 20px; font-size: 12px;">© 2026 Pretty Petals · Houston, TX</p>
      </div>
    </div>
  `;

  try {
    if (customer_email) {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_KEY}`
        },
        body: JSON.stringify({
          from: "Pretty Petals <orders@prttypetals.com>",
          to: customer_email,
          subject: isDeposit
            ? `🌸 Pretty Petals – Please pay your deposit ($${amount.toFixed(2)})`
            : `🌸 Pretty Petals – Your flowers are ready! ($${amount.toFixed(2)})`,
          html: emailHtml
        })
      });
      const emailResult = await emailRes.text();
      console.log("Resend result:", emailRes.status, emailResult);
    } else {
      console.log("No customer email provided — skipping email send");
    }
  } catch(err) {
    console.error("Email error:", err);
    // Don't fail — Square link was created, just log the email failure
  }

  return { statusCode: 200, body: JSON.stringify({ url: paymentUrl }) };
};
