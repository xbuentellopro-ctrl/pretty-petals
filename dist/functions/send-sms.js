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

  const { to, message } = data;

  const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_FROM = process.env.TWILIO_PHONE_NUMBER;

  const body = new URLSearchParams({
    To: to,
    MessagingServiceSid: "MG3079b1be5831b907f45879cf251ef048",
    Body: message
  }).toString();

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": "Basic " + Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64")
        },
        body
      }
    );

    const result = await res.json();
    console.log("SMS result:", result);

    if (!res.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: result }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch(err) {
    console.error("SMS error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
