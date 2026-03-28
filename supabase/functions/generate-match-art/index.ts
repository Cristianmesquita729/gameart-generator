import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const IMAGE_MODELS = [
  "google/gemini-3.1-flash-image-preview",
  "google/gemini-3-pro-image-preview",
  "google/gemini-2.5-flash-image",
] as const;

type MatchInput = {
  competition: string;
  matchday?: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  homeTeam: { name: string; shortName: string };
  awayTeam: { name: string; shortName: string };
};

function buildPrompt(match: MatchInput) {
  return `Create a professional football/soccer matchday promotional poster image in a modern sports broadcast style (like ESPN, DAZN, Sky Sports). The image should be vertical (portrait orientation, 9:16 aspect ratio).

Design requirements:
- Dark background with dynamic blue/cyan tones and geometric shapes
- Team badges/crests prominently displayed on the left side, vertically arranged with "VERSUS" text between them
- Match time "${match.time}" displayed large and bold
- Match date "${match.date}" below the time
- Competition name "${match.competition}" at the top or as a label
- Matchday info "${match.matchday || "Matchday"}" visible
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
}

async function generateImageWithFallback(prompt: string, apiKey: string) {
  let lastError = "Image generation failed";

  for (const model of IMAGE_MODELS) {
    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });

    const payloadText = await response.text();

    if (response.ok) {
      const payload = JSON.parse(payloadText);
      const imageUrl = payload?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      if (imageUrl) return imageUrl;

      lastError = `Model ${model} returned no image`;
      console.error("No image in AI response for model", model, payloadText.slice(0, 500));
      continue;
    }

    lastError = `AI API ${response.status}: ${payloadText.slice(0, 300)}`;
    console.error("AI image generation error", { model, status: response.status, body: payloadText.slice(0, 500) });

    if (response.status === 402 || response.status === 429) {
      throw new Error(lastError);
    }

    // 404/5xx may happen for specific model; try next one.
    if (response.status >= 500 || response.status === 404 || response.status === 400) {
      continue;
    }

    throw new Error(lastError);
  }

  throw new Error(lastError);
}

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

    const prompt = buildPrompt(match as MatchInput);
    const imageUrl = await generateImageWithFallback(prompt, LOVABLE_API_KEY);

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("429")) {
      return new Response(JSON.stringify({ error: "Muitas requisições agora. Tente novamente em alguns segundos." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (message.includes("402")) {
      return new Response(JSON.stringify({ error: "Créditos de IA insuficientes no workspace." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.error("Error generating match art:", message);

    return new Response(JSON.stringify({ error: `Falha ao gerar arte: ${message}` }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
