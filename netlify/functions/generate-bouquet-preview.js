// netlify/functions/generate-bouquet-preview.js
//
// Calls OpenAI's image generation API to render a realistic photo of the
// bouquet the customer is currently building. Keeps the API key server-side.
//
// Setup:
// 1. Get an API key at https://platform.openai.com/api-keys
// 2. In Netlify: Site settings -> Environment variables -> add OPENAI_API_KEY
// 3. Deploy. The function will be live at /.netlify/functions/generate-bouquet-preview

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Server is missing OPENAI_API_KEY" }) };
  }

  let selections;
  try {
    selections = JSON.parse(event.body).selections;
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  const prompt = buildPrompt(selections);

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
        quality: "medium", // "low" is cheapest if you want to cut cost further
        n: 1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI image API error:", data);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: data.error?.message || "Image generation failed" }),
      };
    }

    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: "No image returned" }) };
    }

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ image: `data:image/png;base64,${b64}`, prompt }),
    };
  } catch (err) {
    console.error("generate-bouquet-preview error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Unexpected server error" }) };
  }
};

// Turns the customer's BouquetBuilder selections into a descriptive prompt
// for a clean, professional florist product photo.
function buildPrompt(selections = {}) {
  const parts = [];

  const describeFlowers = (names, colorMap) =>
    (names || []).map(name => {
      const colors = (colorMap?.[name] || []).filter(c => c && !/assorted/i.test(c));
      return colors.length > 0 ? `${colors.join(" and ")} ${name}` : name;
    }).join(", ");

  const primary = describeFlowers(selections.primaryFlowers, selections.primaryColors);
  const secondary = describeFlowers(selections.secondaryFlowers, selections.secondaryColors);
  const greenery = (selections.greenery || []).join(", ");

  if (primary) parts.push(`featuring ${primary} as the main flowers, in exactly those colors`);
  if (secondary) parts.push(`accented with ${secondary}`);
  if (greenery) parts.push(`with ${greenery} as greenery and filler`);

  let wrap = "";
  if (selections.arrangementStyle === "Vase") {
    wrap = "arranged in a simple clear glass vase";
  } else if (selections.arrangementStyle === "Round Bouquet Wrap") {
    wrap = selections.paperWrap
      ? `hand-tied into a classic round bouquet shape, wrapped in ${selections.paperWrap.toLowerCase()} paper`
      : "hand-tied into a classic round bouquet shape";
  } else if (selections.arrangementStyle === "Flat Bouquet Wrap") {
    wrap = selections.paperWrap
      ? `arranged in a modern flat-front presentation style, wrapped in ${selections.paperWrap.toLowerCase()} paper, flowers fanned forward rather than round`
      : "arranged in a modern flat-front presentation style, flowers fanned forward rather than round";
  } else if (selections.arrangementStyle === "Funeral Arrangement") {
    wrap = "styled as a respectful funeral tribute arrangement";
  }

  const ribbon = selections.ribbon && selections.ribbon !== "No Ribbon"
    ? `tied with a ${selections.ribbon.toLowerCase()} ribbon bow`
    : "";

  const descriptors = [wrap, ribbon].filter(Boolean).join(", ");

  return [
    "A professional, photorealistic product photograph of a fresh hand-tied flower bouquet,",
    parts.join(", ") || "a beautiful mixed seasonal bouquet",
    descriptors,
    "Match flower colors precisely to what is specified — do not substitute different colors.",
    "shot on a clean soft white studio background, soft natural lighting, high detail, shallow depth of field, florist catalog style, no text, no watermark.",
  ].filter(Boolean).join(" ");
}
