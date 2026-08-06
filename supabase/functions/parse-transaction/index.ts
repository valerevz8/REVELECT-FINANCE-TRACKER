// Supabase Edge Function: parse-transaction
// Reads a pasted bank/e-wallet notification (text and/or screenshot image) and
// uses Google Gemini (free tier) to extract structured transaction data.
//
// Deploy with: supabase functions deploy parse-transaction
// Requires secret: supabase secrets set GEMINI_API_KEY=AIza...
// Get a free key at: https://aistudio.google.com/app/apikey

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CATEGORY_LIST = [
  "food", "rent", "transport", "entertainment", "bills", "health", "gym", "shopping", "other_expense",
];

const GEMINI_MODEL = "gemini-3.5-flash-lite";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, image, mediaType } = await req.json();
    const hasText = text && typeof text === "string" && text.trim().length >= 5;
    const hasImage = image && typeof image === "string" && image.length > 100;
    if (!hasText && !hasImage) {
      return new Response(JSON.stringify({ error: "missing_input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "server_not_configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const today = new Date().toISOString().slice(0, 10);
    const systemPrompt = `You extract structured data from Indonesian bank/e-wallet transaction notifications, given either as pasted text or as a screenshot image of the notification (SMS or email, e.g. from BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay).
Return ONLY a raw JSON object, no markdown fences, no explanation, with exactly these fields:
{"type": "income" or "expense", "amount": number (IDR, digits only, no currency symbol, no dots or commas), "date": "YYYY-MM-DD" (use ${today} if no date is present in the text/image), "category": one of [${CATEGORY_LIST.join(", ")}] when type is "expense", otherwise null, "note": a short merchant or description string, max 40 characters}

Category guessing rules: Gojek/Grab/parking/fuel = transport. Tokopedia/Shopee/Lazada/retail store = shopping. Indomaret/Alfamart/GoFood/GrabFood/restaurant/cafe names = food. Netflix/Spotify/cinema/games = entertainment. Gym/fitness names = gym. Hospital/clinic/pharmacy/apotek = health. PLN/listrik/pulsa/wifi/internet/insurance = bills. Rent/kost/sewa = rent. If truly unclear, use "other_expense".
If the notification describes a debit, purchase, payment, or transfer out, type is "expense". If it describes a credit, incoming transfer, refund, or salary, type is "income" and category must be null.
If the given input does not look like a transaction notification at all, return exactly {"error": "not_a_transaction"} and nothing else.`;

    const parts = [];
    if (hasImage) {
      parts.push({ inline_data: { mime_type: mediaType || "image/png", data: image } });
      parts.push({ text: hasText ? text : "Extract the transaction details from this screenshot." });
    } else {
      parts.push({ text });
    }

    const requestBody = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts }],
      generationConfig: {
        maxOutputTokens: 300,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: "minimal" },
      },
    };

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!resp.ok) {
      const errText = await resp.text();
      console.error(`GEMINI_CALL_FAILED status=${resp.status} body=${errText}`);
      return new Response(JSON.stringify({ error: "gemini_error", detail: errText }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error(`GEMINI_PARSE_FAILED raw=${raw}`);
      return new Response(JSON.stringify({ error: "parse_failed" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(`UNEXPECTED_ERROR ${String(e)}`);
    return new Response(JSON.stringify({ error: "unexpected", detail: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
