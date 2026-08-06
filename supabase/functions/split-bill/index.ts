// Supabase Edge Function: split-bill
// Reads a photo of a restaurant/cafe receipt plus a note describing which
// items belong to the user. The AI only extracts and matches data (reading
// item names/prices/qty, matching the user's note, and simple per-unit
// division). ALL proportional math (the actual split) is computed
// deterministically in this function, never left to the model, so it is
// always arithmetically correct.
//
// Deploy with: supabase functions deploy split-bill
// Requires secret: GEMINI_API_KEY (same one used by parse-transaction)

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GEMINI_MODEL = "gemini-3.5-flash-lite";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { image, mediaType, myItems } = await req.json();
    const hasImage = image && typeof image === "string" && image.length > 100;
    const hasNote = myItems && typeof myItems === "string" && myItems.trim().length >= 2;
    if (!hasImage) {
      return new Response(JSON.stringify({ error: "missing_image" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!hasNote) {
      return new Response(JSON.stringify({ error: "missing_note" }), {
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

    // The model's ONLY jobs: (1) read the printed subtotal and grand total,
    // (2) find line items matching the user's note, (3) if a matched line
    // covers multiple units (e.g. "2 Beef Burisuke = 118000") divide by its
    // quantity to get a single unit price. No multi-step or compounding math.
    const systemPrompt = `You read an Indonesian restaurant/cafe receipt (bon/struk) photo and a note from the user describing which item(s) on it are theirs (bill shared with others).

Your only jobs:
1. Find the line(s) on the receipt matching the user's described item(s) (match casually/loosely, Indonesian slang is fine).
2. For each matched line, if it covers more than one unit (e.g. "2x Beef Burisuke ... 118000"), divide that line's total by its quantity to get ONE unit price. Do only this one simple division, nothing more.
3. Read the printed "Subtotal" value on the receipt (the sum of all items before tax/service/discount).
4. Read the printed final "Total" value on the receipt (grand total, after tax/service/discount, what was actually paid).

Return ONLY a raw JSON object, no markdown fences, no explanation, with exactly these fields:
{"matchedItems": [{"name": "item name", "unitPrice": number}], "subtotal": number, "grandTotal": number}

All numbers are IDR digits only, no currency symbol, no dots or commas, no decimals.
Do NOT calculate any proportions, ratios, shares, or splits yourself — just return the raw numbers above, that math is handled elsewhere.

If you cannot find any receipt in the image, return exactly {"error": "not_a_receipt"}.
If you can read the receipt but cannot match the user's described item(s) to anything on it, return exactly {"error": "items_not_found"}.`;

    const parts = [
      { inline_data: { mime_type: mediaType || "image/png", data: image } },
      { text: `Item saya: ${myItems}` },
    ];

    const requestBody = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts }],
      generationConfig: {
        maxOutputTokens: 400,
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

    let extracted;
    try {
      extracted = JSON.parse(cleaned);
    } catch {
      console.error(`GEMINI_PARSE_FAILED raw=${raw}`);
      return new Response(JSON.stringify({ error: "parse_failed" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (extracted.error) {
      return new Response(JSON.stringify(extracted), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const matchedItems = Array.isArray(extracted.matchedItems) ? extracted.matchedItems : [];
    const subtotal = Number(extracted.subtotal) || 0;
    const grandTotal = Number(extracted.grandTotal) || 0;

    if (matchedItems.length === 0 || subtotal <= 0 || grandTotal <= 0) {
      return new Response(JSON.stringify({ error: "items_not_found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Deterministic math starts here. Never trust the model for this. ---
    const myItemsSubtotal = matchedItems.reduce((sum: number, it: any) => sum + (Number(it.unitPrice) || 0), 0);
    const ratio = grandTotal / subtotal;
    const myShare = Math.round(myItemsSubtotal * ratio);
    // --- End deterministic math. ---

    const result = {
      amount: myShare,
      items: matchedItems.map((it: any) => it.name),
      note: matchedItems.map((it: any) => it.name).join(', ').slice(0, 40),
      breakdown: {
        myItemsSubtotal,
        subtotal,
        grandTotal,
        ratio: Math.round(ratio * 10000) / 10000,
      },
    };

    return new Response(JSON.stringify(result), {
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
