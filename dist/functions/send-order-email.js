exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let order;
  try {
    order = JSON.parse(event.body);
  } catch(e) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const emailBody = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8b3a5e; font-size: 28px; margin: 0;">🌸 Pretty Petals</h1>
        <p style="color: #b06080; margin: 5px 0;">New Order Request</p>
      </div>
      <div style="background: #fff0f6; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
        <h2 style="color: #8b3a5e; margin-top: 0;">Customer Info</h2>
        <p><strong>Name:</strong> ${order.first_name} ${order.last_name}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
      </div>
      <div style="background: #fff0f6; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
        <h2 style="color: #8b3a5e; margin-top: 0;">Order Details</h2>
        <p><strong>Occasion:</strong> ${order.occasion}</p>
        <p><strong>Date Needed:</strong> ${order.date_needed}</p>
        <p><strong>Time:</strong> ${order.time_needed || "Not specified"}</p>
        <p><strong>Delivery Type:</strong> ${order.delivery_type}</p>
        ${order.delivery_address ? `<p><strong>Address:</strong> ${order.delivery_address}, ${order.delivery_city} ${order.delivery_zip}</p>` : ""}
        <p><strong>Budget:</strong> ${order.budget}</p>
        <p><strong>Color Palette:</strong> ${order.color_palette}</p>
        ${order.color_notes ? `<p><strong>Color Notes:</strong> ${order.color_notes}</p>` : ""}
        ${order.recipient_name ? `<p><strong>Flowers For:</strong> ${order.recipient_name}</p>` : ""}
        ${order.personal_note ? `<p><strong>Card Message:</strong> ${order.personal_note}</p>` : ""}
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
        to: "prettypetals410@gmail.com",
        subject: `🌸 New Order from ${order.first_name} ${order.last_name}`,
        html: emailBody
      })
    });

    const data = await res.text();
    console.log("Resend response:", res.status, data);

    if (!res.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: data }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch(err) {
    console.error("Error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

// Customer notification handler
exports.notifyCustomer = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch(e) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { customer_email, customer_name, status, message } = data;

  const statusMessages = {
    "Confirmed": {
      subject: "🌸 Your Pretty Petals Order is Confirmed!",
      heading: "Your order is confirmed!",
      body: message || "We've reviewed your order and we're excited to create your arrangement. We'll keep you updated every step of the way!"
    },
    "In Progress": {
      subject: "🌸 Pretty Petals is Working on Your Order!",
      heading: "We're creating your arrangement!",
      body: message || "Your beautiful arrangement is currently being made with love and care. We'll let you know when it's ready!"
    },
    "Ready": {
      subject: "🌸 Your Pretty Petals Order is Ready!",
      heading: "Your flowers are ready!",
      body: message || "Your arrangement is ready for pickup/delivery. We can't wait for you to see it!"
    },
    "Delivered": {
      subject: "🌸 Thank You from Pretty Petals!",
      heading: "Thank you for your order!",
      body: message || "We hope you love your arrangement! Thank you for choosing Pretty Petals."
    }
  };

  const statusInfo = statusMessages[status] || {
    subject: "🌸 Update from Pretty Petals",
    heading: "Order Update",
    body: message || "There's been an update to your order."
  };

  const emailHtml = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8b3a5e; font-size: 28px; margin: 0;">🌸 Pretty Petals</h1>
      </div>
      <div style="background: #fff0f6; border-radius: 12px; padding: 24px; margin-bottom: 20px; text-align: center;">
        <h2 style="color: #8b3a5e; margin-top: 0;">Hi ${customer_name}!</h2>
        <h3 style="color: #d4547a;">${statusInfo.heading}</h3>
        <p style="color: #5a2a3e; line-height: 1.7;">${statusInfo.body}</p>
      </div>
      <div style="text-align: center; color: #b06080; font-size: 14px;">
        <p>Questions? Reply to this email or find us on Instagram <a href="https://instagram.com/prttypetalss" style="color: #d4547a;">@prttypetalss</a></p>
        <p style="margin-top: 20px;">Pretty Petals · Houston, TX</p>
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
    console.log("Customer notification sent:", res.status, result);

    if (!res.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: result }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch(err) {
    console.error("Error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
