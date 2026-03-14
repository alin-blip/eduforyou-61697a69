import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { offer, ikigaiResult, platform } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const platformNames: Record<string, string> = {
      linkedin: "LinkedIn (connection/message)",
      email: "Email (cold email)",
      dm: "DM Instagram/Twitter"
    };

    const systemPrompt = `You are an expert in copywriting and outreach for freelancers.
Create converting outreach messages based on the client's offer and unique positioning.

Rules:
1. Messages must be personalizable (with [CLIENT_NAME], [SPECIFIC_PROBLEM], etc.)
2. Professional but approachable tone
3. Each message must have a clear CTA
4. Keep messages short and to the point
5. Avoid being "salesy" or aggressive
6. Focus on value, not features

For ${platformNames[platform] || platform}:
${platform === 'linkedin' ? '- Connection message (max 300 chars) + Follow-up message' : ''}
${platform === 'email' ? '- Strong subject line + Structured email body' : ''}
${platform === 'dm' ? '- Short, casual message + Follow-up' : ''}

Write in English. Respond ONLY via tool call.`;

    const userPrompt = `Create outreach templates for ${platformNames[platform] || platform}:

**Value Proposition (SMV):** ${offer?.smv || 'Professional services'}
**Target Market:** ${offer?.target_market || 'Small businesses'}
**Positioning:** ${ikigaiResult?.core_positioning || 'Domain expert'}
**Services:** ${ikigaiResult?.service_angles?.map((a: any) => a.title).join(', ') || 'Various services'}

Generate 3 complete templates for ${platform}.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        tools: [{
          type: "function",
          function: {
            name: "generate_outreach",
            description: "Return outreach templates for the specified platform",
            parameters: {
              type: "object",
              properties: {
                platform: { type: "string" },
                templates: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      type: { type: "string", enum: ["connection", "intro", "follow_up", "value_add"] },
                      subject: { type: "string" },
                      content: { type: "string" },
                      tips: { type: "array", items: { type: "string" } },
                      best_time: { type: "string" }
                    },
                    required: ["name", "type", "content", "tips"]
                  }
                },
                sequence_suggestion: { type: "string" },
                response_rate_tips: { type: "array", items: { type: "string" } }
              },
              required: ["platform", "templates", "sequence_suggestion", "response_rate_tips"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_outreach" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Insufficient credits." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("Error generating templates");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No valid AI response");

    return new Response(JSON.stringify(JSON.parse(toolCall.function.arguments)), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Outreach generator error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
