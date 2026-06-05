exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch(e) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { amount, customer_name, customer_email, order_id, payment_type } = data;
  const STRIPE_SECRET = "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";

  try {
    // Create a Stripe Payment Link
    const res = await fetch("https://api.stripe.com/v1/payment_links", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        "line_items[0][price_data][currency]": "usd",
        "line_items[0][price_data][unit_amount]": Math.round(amount * 100),
        "line_items[0][price_data][product_data][name]": `Pretty Petals - ${payment_type} Payment`,
        "line_items[0][price_data][product_data][description]": `Custom floral arrangement for ${customer_name}`,
        "line_items[0][quantity]": "1",
        "after_completion[type]": "redirect",
        "after_completion[redirect][url]": "https://prttypetals.com",
      }).toString()
    });

    const result = await res.json();
    console.log("Stripe result:", result);

    if (!res.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: result }) };
    }

    return { statusCode: 200, body: JSON.stringify({ url: result.url }) };
  } catch(err) {
    console.error("Stripe error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
