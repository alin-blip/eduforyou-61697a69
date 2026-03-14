import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { type } = body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // ── CHAT (streaming) ──
    if (type === "chat") {
      const { messages, stats } = body;
      const systemPrompt = `You are a CEO AI assistant for EduForYou, a UK education platform. You have real-time access to these business metrics:
- Total Leads: ${stats?.contacts || 0}
- Applications: ${stats?.applications || 0}
- Appointments: ${stats?.appointments || 0}
- Active Agents: ${stats?.agents || 0}

Provide actionable, data-driven insights. Be concise but thorough. Use markdown formatting.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "system", content: systemPrompt }, ...messages],
          stream: true,
        }),
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`AI gateway error: ${status}`);
      }

      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // ── CONTENT GENERATION ──
    if (type === "content") {
      const { contentType, topic, tone } = body;
      const typeInstructions: Record<string, string> = {
        blog: "Write a comprehensive blog article (800-1200 words) with a compelling title, introduction, structured sections with headers, and a conclusion with a call to action.",
        social: "Write 3-5 social media post variations optimized for LinkedIn, Instagram, and Facebook. Include hashtag suggestions and emoji usage.",
        email: "Write a complete email campaign with subject line, preview text, body, and CTA button text. Make it engaging and action-oriented.",
      };

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: `You are a CMO content strategist for EduForYou, a UK education platform helping people access free university education. Write high-quality marketing content. Tone: ${tone || 'Professional'}.` },
            { role: "user", content: `${typeInstructions[contentType] || typeInstructions.blog}\n\nTopic: ${topic}` },
          ],
        }),
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`AI gateway error: ${status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "No content generated.";
      return new Response(JSON.stringify({ content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── SUMMARY ──
    if (type === "summary") {
      const { stats } = body;
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You are a CEO business analyst AI. Provide concise, actionable business summaries with insights and recommendations. Be direct and data-driven." },
            { role: "user", content: `Generate a daily CEO summary based on these metrics:\n- Total Leads: ${stats.contacts}\n- Applications: ${stats.applications}\n- Appointments: ${stats.appointments}\n- Active Agents: ${stats.agents}\n\nInclude: key highlights, conversion analysis, concerns, and 3 recommended actions.` },
          ],
        }),
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`AI gateway error: ${status}`);
      }

      const data = await response.json();
      const summary = data.choices?.[0]?.message?.content || "No summary generated.";
      return new Response(JSON.stringify({ summary }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── SUGGEST TASKS ──
    if (type === "suggest") {
      const { stats } = body;
      const tools = [{
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
      }];

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You are a CEO task recommendation AI for an education platform. Suggest actionable tasks." },
            { role: "user", content: `Based on these business metrics, suggest 3-5 actionable tasks:\n- Total Leads: ${stats.contacts}\n- Applications: ${stats.applications}\n- Appointments: ${stats.appointments}\n- Active Agents: ${stats.agents}` },
          ],
          tools,
          tool_choice: { type: "function", function: { name: "suggest_tasks" } },
        }),
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`AI gateway error: ${status}`);
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      let suggestions: any[] = [];
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
