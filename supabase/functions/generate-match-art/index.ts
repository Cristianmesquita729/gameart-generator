import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const { match } = await req.json();
    if (!match) {
      return new Response(JSON.stringify({ error: "Match data is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `Create a professional football/soccer matchday promotional poster image in a modern sports broadcast style (like ESPN, DAZN, Sky Sports). The image should be vertical (portrait orientation, 9:16 aspect ratio).

Design requirements:
- Dark background with dynamic blue/cyan tones and geometric shapes
- Team badges/crests prominently displayed on the left side, vertically arranged with "VERSUS" text between them
- Match time "${match.time}" displayed large and bold
- Match date "${match.date}" below the time
- Competition name "${match.competition}" at the top or as a label
- Matchday info "${match.matchday || ''}" visible
- Stadium "${match.venue}" and city "${match.city}" at the bottom
- A dramatic, action-pose football player silhouette or figure as the main visual element on the right side
- Team names: "${match.homeTeam.name}" (home) vs "${match.awayTeam.name}" (away)
- Short names: "${match.homeTeam.shortName}" vs "${match.awayTeam.shortName}"
- Modern typography with bold sans-serif fonts
- Professional sports graphic design quality
- Include subtle texture/grain effects
- Color accent: lime green or cyan highlights
- Bottom bar with "MATCHDAY" label and match details

Make it look like an official broadcast-quality matchday announcement poster. High contrast, dramatic lighting, professional sports design.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI image generation error:", response.status, errorText);
      throw new Error(`AI API returned ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("No image in AI response:", JSON.stringify(data).slice(0, 500));
      throw new Error("No image generated");
    }

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error generating match art:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
