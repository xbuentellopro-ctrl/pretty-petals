// netlify/functions/generate-bouquet-preview.js
//
// Calls OpenAI's image API to render a realistic photo of the bouquet the
// customer is currently building — using 1-2 of Yazmin's actual premade
// bouquet photos (pulled live from Supabase) as visual style references,
// so the result actually looks like a Pretty Petals bouquet instead of a
// generic stock-photo florist style. Keeps the API key server-side.
//
// Setup:
// 1. Get an API key at https://platform.openai.com/api-keys
// 2. In Netlify: Site settings -> Environment variables -> add OPENAI_API_KEY
// 3. Deploy. The function will be live at /.netlify/functions/generate-bouquet-preview

const SUPABASE_URL = "https://kxvdgjnybtwsusjvzmfc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4dmRnam55YnR3c3VzanZ6bWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDIwODEsImV4cCI6MjA5NTcxODA4MX0.8u1AZ0DJpyQc9ZnG8Pg6OTwrA_e5EgEjmpDXKUKdbHk";

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
    const referenceImages = await getStyleReferenceImages();

    let response;
    if (referenceImages.length > 0) {
      // Use the image-edit endpoint with real Pretty Petals bouquet photos
      // as style references, so the result matches the shop's actual look
      // (wrap style, photography style, color treatment) rather than a
      // generic AI florist photo.
      const form = new FormData();
      form.append("model", "gpt-image-1");
      form.append("prompt", prompt);
      form.append("size", "1024x1024");
      form.append("quality", "medium");
      referenceImages.forEach(img => form.append("image[]", img.blob, img.filename));

      response = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
      });
    } else {
      // Fallback: no premade bouquet photos available yet, generate from
      // the text prompt alone.
      response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt,
          size: "1024x1024",
          quality: "medium",
          n: 1,
        }),
      });
    }

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
      body: JSON.stringify({ image: `data:image/png;base64,${b64}`, prompt, usedStyleReference: referenceImages.length > 0 }),
    };
  } catch (err) {
    console.error("generate-bouquet-preview error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Unexpected server error" }) };
  }
};

// Pulls 1-2 of Yazmin's real premade bouquet photos from Supabase to use
// as style references for the AI render. Picks the most recently sorted
// active ones — good enough as a "house style" sample without needing any
// extra admin UI. Returns [] if anything is missing so generation still
// works (falls back to text-only prompt).
async function getStyleReferenceImages() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/premade_bouquets?active=eq.true&select=image_url&order=sort_order.asc,created_at.asc&limit=2`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const rows = await res.json();
    if (!Array.isArray(rows)) return [];

    const images = [];
    for (const row of rows) {
      if (!row.image_url) continue;
      try {
        const imgRes = await fetch(row.image_url);
        if (!imgRes.ok) continue;
        const buf = await imgRes.arrayBuffer();
        const contentType = imgRes.headers.get("content-type") || "image/jpeg";
        const ext = contentType.includes("png") ? "png" : "jpg";
        images.push({
          blob: new Blob([buf], { type: contentType }),
          filename: `style-reference.${ext}`,
        });
      } catch {
        // skip any image that fails to download
      }
    }
    return images;
  } catch (e) {
    console.error("Could not load style reference images:", e);
    return [];
  }
}

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
    "Using the attached reference photo(s) as a guide for the overall photography style, wrapping style, and finishing touches (the 'Pretty Petals' house look),",
    "create a new, different bouquet photo in that same style:",
    parts.join(", ") || "a beautiful mixed seasonal bouquet",
    descriptors,
    "Match flower colors precisely to what is specified — do not substitute different colors.",
    "Keep the same clean, soft, photorealistic florist product-photography feel as the reference image(s): soft natural lighting, shallow depth of field, no text, no watermark.",
  ].filter(Boolean).join(" ");
}
