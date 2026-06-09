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

  const { customer_email, customer_name, status, custom_message, payment_link } = data;

  const statusMessages = {
    "Confirmed": {
      subject: "Your Pretty Petals Order is Confirmed!",
      heading: "Your order is confirmed!",
      body: custom_message || "We've reviewed your order and we're excited to create your arrangement. We'll keep you updated every step of the way!"
    },
    "In Progress": {
      subject: "We're Working on Your Pretty Petals Arrangement!",
      heading: "Your flowers are being made!",
      body: custom_message || "Your beautiful arrangement is currently being crafted with love and care!"
    },
    "Ready": {
      subject: "Your Pretty Petals Order is Ready!",
      heading: "Your flowers are ready!",
      body: custom_message || "Your arrangement is ready! Please complete your final payment and coordinate pickup or delivery."
    },
    "Delivered": {
      subject: "Thank You from Pretty Petals!",
      heading: "Thank you for your order!",
      body: custom_message || "We hope you love your arrangement! Thank you for choosing Pretty Petals."
    },
    "Message": {
      subject: "Message from Pretty Petals",
      heading: "A message from Pretty Petals",
      body: custom_message || "You have a new message from Pretty Petals."
    }
  };

  const statusInfo = statusMessages[status] || {
    subject: "Update from Pretty Petals",
    heading: "Order Update",
    body: custom_message || "There has been an update to your order."
  };

  const paymentSection = payment_link
    ? `<div style="margin-top: 24px; text-align: center;">
        <p style="color: #8b3a5e; margin: 0 0 12px; font-size: 15px;">Click below to complete your payment:</p>
        <a href="${payment_link}" 
           style="display: inline-block; padding: 14px 32px; background-color: #d4547a; color: white; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: bold;">
          Pay Now
        </a>
        <p style="color: #b06080; margin: 12px 0 0; font-size: 13px;">Or copy this link: ${payment_link}</p>
      </div>`
    : '';

  const emailHtml = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8b3a5e; font-size: 32px; margin: 0;">Pretty Petals</h1>
        <p style="color: #b06080; font-size: 14px; margin: 4px 0 0; letter-spacing: 0.1em;">CUSTOM FLORAL ARRANGEMENTS - HOUSTON, TX</p>
      </div>
      <div style="background: #fff0f6; border-radius: 16px; padding: 32px; margin-bottom: 24px; text-align: center;">
        <h2 style="color: #8b3a5e; margin: 0 0 8px; font-size: 24px;">Hi ${customer_name}!</h2>
        <h3 style="color: #d4547a; margin: 0 0 16px; font-size: 20px; font-weight: normal;">${statusInfo.heading}</h3>
        <p style="color: #5a2a3e; line-height: 1.8; font-size: 16px; margin: 0;">${statusInfo.body}</p>
        ${paymentSection}
      </div>
      <div style="text-align: center; color: #b06080; font-size: 14px; line-height: 1.8;">
        <p>Questions? Email us at orders@prttypetals.com</p>
        <p>Follow us on Instagram @prttypetalss</p>
        <p style="margin-top: 20px; font-size: 12px;">2026 Pretty Petals - Houston, TX</p>
      </div>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer re_KxHrD7Rb_BXwm3ZazwMn9voTUPiLnhqJE`
      },
      body: JSON.stringify({
        from: "Pretty Petals <orders@prttypetals.com>",
        to: customer_email,
        subject: statusInfo.subject,
        html: emailHtml
      })
    });

    const result = await res.text();
    console.log("Customer notification:", res.status, result);

    if (!res.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: result }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch(err) {
    console.error("Error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
