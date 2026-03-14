import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { skills, studyField } = body;
    const goalsText = Array.isArray(body.goals) ? body.goals.join(', ') : typeof body.goals === 'string' ? body.goals : '';
    const valuesText = Array.isArray(body.values) ? body.values.join(', ') : typeof body.values === 'string' ? body.values : '';
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert in career development and personal positioning for students.
Using the Ikigai concept (intersection of what you love, what you're good at, what the world needs, and what you can be paid for), create a unique positioning for the student.

Analyze the skills and information received and generate:
1. What You Love - passions and joyful activities
2. What You're Good At - key skills and abilities
3. What The World Needs - real problems they can solve
4. What You Can Be Paid For - monetizable services

Then generate:
- 3-5 Ikigai Statements - powerful positioning statements
- 3-5 Service Angles - unique service angles

Respond ONLY via tool call. Be specific, actionable and results-oriented.`;

    const skillsList = skills?.map((s: any) => `${s.skill} (${s.category})`).join(', ') || 'No skills';
    
    const userPrompt = `Analyze this student's profile and create their Ikigai:

**Field of study:** ${studyField || 'Not specified'}
**Identified skills:** ${skillsList}
**Personal goals:** ${goalsText || 'Not specified'}
**Personal values:** ${valuesText || 'Not specified'}

Generate a complete Ikigai and unique positioning.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        tools: [{
          type: "function",
          function: {
            name: "generate_ikigai",
            description: "Return the student's complete Ikigai",
            parameters: {
              type: "object",
              properties: {
                what_you_love: { type: "array", items: { type: "string" } },
                what_youre_good_at: { type: "array", items: { type: "string" } },
                what_world_needs: { type: "array", items: { type: "string" } },
                what_you_can_be_paid_for: { type: "array", items: { type: "string" } },
                ikigai_statements: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      statement: { type: "string" },
                      explanation: { type: "string" }
                    },
                    required: ["statement", "explanation"]
                  }
                },
                service_angles: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      target_audience: { type: "string" },
                      unique_value: { type: "string" }
                    },
                    required: ["title", "description", "target_audience", "unique_value"]
                  }
                },
                core_positioning: { type: "string" }
              },
              required: ["what_you_love", "what_youre_good_at", "what_world_needs", "what_you_can_be_paid_for", "ikigai_statements", "service_angles", "core_positioning"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_ikigai" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Insufficient credits." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Error generating Ikigai");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No valid AI response");

    return new Response(JSON.stringify(JSON.parse(toolCall.function.arguments)), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Ikigai builder error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
