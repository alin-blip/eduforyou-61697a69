import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { offer, ikigaiResult, platform, userName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const platformInstructions: Record<string, string> = {
      facebook: `Generate a professional Facebook business page profile with:
- bio: Short description (max 255 chars)
- about: Detailed "About" section (300-500 words)
- cta: A compelling call-to-action
- username_suggestions: 3 professional username ideas`,
      instagram: `Generate an optimized Instagram bio with:
- bio: Short, impactful bio (max 150 chars) with emoji
- hashtags: 15 relevant hashtags
- content_pillars: 4-5 content themes
- cta: A call-to-action for link in bio
- username_suggestions: 3 creative username ideas`,
      linkedin: `Generate a complete LinkedIn profile with:
- headline: Professional headline (max 220 chars)
- about: Comprehensive "About" section (2000-2600 chars)
- cta: A professional call-to-action
- username_suggestions: 3 professional URL ideas`,
      tiktok: `Generate a TikTok creator profile with:
- bio: Very short, catchy bio (max 80 chars)
- hashtags: 10 trending and niche hashtags
- content_pillars: 3-4 content themes
- cta: A short call-to-action
- username_suggestions: 3 catchy username ideas`
    };

    const systemPrompt = `You are an expert social media strategist. Create optimized profile content.
Write in English. Be specific. Focus on benefits and transformation.
${platformInstructions[platform] || platformInstructions.instagram}`;

    const userPrompt = `Create a ${platform.toUpperCase()} profile for:
NAME: ${userName || 'Freelancer'}
OFFER: Target Market: ${offer?.target_market || 'Not specified'}, Value: ${offer?.smv || 'Professional services'}
IKIGAI: Love: ${ikigaiResult?.what_you_love?.join(', ') || 'Helping others'}, Good at: ${ikigaiResult?.what_youre_good_at?.join(', ') || 'Skills'}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        tools: [{
          type: "function",
          function: {
            name: "generate_profile",
            description: "Generate social media profile content",
            parameters: {
              type: "object",
              properties: {
                bio: { type: "string" }, headline: { type: "string" }, about: { type: "string" },
                hashtags: { type: "array", items: { type: "string" } },
                content_pillars: { type: "array", items: { type: "string" } },
                cta: { type: "string" },
                username_suggestions: { type: "array", items: { type: "string" } }
              },
              required: ["bio", "cta"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_profile" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Insufficient credits." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) throw new Error("Invalid AI response format");

    return new Response(JSON.stringify(JSON.parse(toolCall.function.arguments)), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Profile builder error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
