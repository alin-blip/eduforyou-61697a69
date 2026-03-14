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
    const { experiences, studyField } = body;
    
    let interestsText = '';
    if (Array.isArray(body.interests)) {
      interestsText = body.interests.join(', ');
    } else if (typeof body.interests === 'string') {
      interestsText = body.interests;
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert in skills analysis for students who want to monetize their abilities as freelancers or entrepreneurs.

Analyze the information received and identify:
1. Technical skills (hard skills) - extracted from experiences and field of study
2. Soft skills - deduced from experiences and interests
3. Hidden/emerging skills - unexploited potential based on the unique combination of abilities

For each skill, provide:
- Skill name
- Category (technical/soft/hidden)
- Estimated confidence level (1-5)
- Short, actionable description
- Monetization potential (low/medium/high)

Respond ONLY via tool call, no free text.`;

    const userPrompt = `Analyze this student's profile:

**Field of study:** ${studyField || 'Not specified'}

**Experiences and projects:**
${experiences || 'No experience specified'}

**Interests and hobbies:**
${interestsText || 'No interests specified'}

Identify all monetizable skills.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_skills",
              description: "Return the list of identified skills",
              parameters: {
                type: "object",
                properties: {
                  skills: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        category: { type: "string", enum: ["technical", "soft", "hidden"] },
                        confidence: { type: "number", minimum: 1, maximum: 5 },
                        description: { type: "string" },
                        monetization_potential: { type: "string", enum: ["low", "medium", "high"] }
                      },
                      required: ["name", "category", "confidence", "description", "monetization_potential"],
                      additionalProperties: false
                    }
                  },
                  summary: { type: "string" },
                  top_recommendation: { type: "string" }
                },
                required: ["skills", "summary", "top_recommendation"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_skills" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Insufficient credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Error analyzing skills");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No valid AI response received");

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Skill scanner error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
