import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, stats } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";
    const tools: any[] = [];
    let tool_choice: any = undefined;

    if (type === "summary") {
      systemPrompt = "You are a CEO business analyst AI. Provide concise, actionable business summaries with insights and recommendations. Be direct and data-driven.";
      userPrompt = `Generate a daily CEO summary based on these metrics:
- Total Leads: ${stats.contacts}
- Applications: ${stats.applications}
- Appointments: ${stats.appointments}
- Active Agents: ${stats.agents}

Include: key highlights, conversion analysis, concerns, and 3 recommended actions.`;
    } else if (type === "suggest") {
      systemPrompt = "You are a CEO task recommendation AI for an education platform. Suggest actionable tasks.";
      userPrompt = `Based on these business metrics, suggest 3-5 actionable tasks:
- Total Leads: ${stats.contacts}
- Applications: ${stats.applications}
- Appointments: ${stats.appointments}
- Active Agents: ${stats.agents}`;
      tools.push({
        type: "function",
        function: {
          name: "suggest_tasks",
          description: "Return 3-5 actionable task suggestions for the CEO.",
          parameters: {
            type: "object",
            properties: {
              suggestions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    priority: { type: "string", enum: ["low", "medium", "high"] },
                    category: { type: "string", enum: ["marketing", "sales", "operations", "product", "general"] },
                  },
                  required: ["title", "priority", "category"],
                  additionalProperties: false,
                },
              },
            },
            required: ["suggestions"],
            additionalProperties: false,
          },
        },
      });
      tool_choice = { type: "function", function: { name: "suggest_tasks" } };
    } else {
      return new Response(JSON.stringify({ error: "Unknown type" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: any = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    };
    if (tools.length > 0) { body.tools = tools; body.tool_choice = tool_choice; }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();

    if (type === "summary") {
      const summary = data.choices?.[0]?.message?.content || "No summary generated.";
      return new Response(JSON.stringify({ summary }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "suggest") {
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      let suggestions = [];
      if (toolCall) {
        try { suggestions = JSON.parse(toolCall.function.arguments).suggestions; } catch {}
      }
      return new Response(JSON.stringify({ suggestions }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown type" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ceo-ai-engine error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
