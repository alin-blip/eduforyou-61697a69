import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { skills, ikigaiResult, studyField } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert in pricing and service offer creation for students who want to monetize their skills.
Based on the student's Ikigai and skills, create 3 service packages with strategic pricing.

Pricing rules:
- Starter: Accessible entry package, fast delivery (1-3 days)
- Standard: Excellent value, medium delivery (5-7 days)
- Premium: Complete service with extended support, premium delivery (7-14 days)

Prices should be in GBP (£) adapted for the UK market.
For students, starter prices begin from £30-60.

Be specific with deliverables and include concrete metrics.
Respond ONLY via tool call.`;

    const skillsList = Array.isArray(skills) ? skills.map((s: any) => `${s.skill} (${s.category})`).join(', ') : 'No skills';
    const serviceAngles = Array.isArray(ikigaiResult?.service_angles) ? ikigaiResult.service_angles.map((a: any) => a.title).join(', ') : 'Not specified';
    const corePositioning = ikigaiResult?.core_positioning || 'Not specified';
    const whatCanBePaidFor = Array.isArray(ikigaiResult?.what_you_can_be_paid_for) ? ikigaiResult.what_you_can_be_paid_for.join(', ') : 'Not specified';

    const userPrompt = `Create the service offer for this student:

**Ikigai Positioning:** ${corePositioning}
**Skills:** ${skillsList}
**What they can be paid for:** ${whatCanBePaidFor}
**Suggested service angles:** ${serviceAngles}
**Field of study:** ${studyField || 'Not specified'}

Generate 3 service packages with prices in GBP, SMV, and pricing justification.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        tools: [{
          type: "function",
          function: {
            name: "generate_offer",
            description: "Return the complete offer with service packages",
            parameters: {
              type: "object",
              properties: {
                smv: { type: "string" },
                target_market: { type: "string" },
                pricing_justification: { type: "string" },
                starter_package: {
                  type: "object",
                  properties: {
                    name: { type: "string" }, tagline: { type: "string" }, price: { type: "number" },
                    currency: { type: "string" }, delivery_time: { type: "string" },
                    deliverables: { type: "array", items: { type: "string" } },
                    ideal_for: { type: "string" }
                  },
                  required: ["name", "tagline", "price", "currency", "delivery_time", "deliverables", "ideal_for"]
                },
                standard_package: {
                  type: "object",
                  properties: {
                    name: { type: "string" }, tagline: { type: "string" }, price: { type: "number" },
                    currency: { type: "string" }, delivery_time: { type: "string" },
                    deliverables: { type: "array", items: { type: "string" } },
                    ideal_for: { type: "string" }, popular: { type: "boolean" }
                  },
                  required: ["name", "tagline", "price", "currency", "delivery_time", "deliverables", "ideal_for"]
                },
                premium_package: {
                  type: "object",
                  properties: {
                    name: { type: "string" }, tagline: { type: "string" }, price: { type: "number" },
                    currency: { type: "string" }, delivery_time: { type: "string" },
                    deliverables: { type: "array", items: { type: "string" } },
                    ideal_for: { type: "string" }, includes_support: { type: "boolean" }
                  },
                  required: ["name", "tagline", "price", "currency", "delivery_time", "deliverables", "ideal_for"]
                }
              },
              required: ["smv", "target_market", "pricing_justification", "starter_package", "standard_package", "premium_package"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_offer" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Insufficient credits." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("Error generating offer");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No valid AI response");

    return new Response(JSON.stringify(JSON.parse(toolCall.function.arguments)), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Offer builder error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
