import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL_CANDIDATES = [
  "google/gemini-3-flash-preview",
  "google/gemini-2.5-flash",
  "google/gemini-2.5-flash-lite",
] as const;

async function requestMatchesFromAI(prompt: string, apiKey: string) {
  let lastError = "Unknown AI error";

  for (const model of MODEL_CANDIDATES) {
    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices?.[0]?.message?.content ?? "[]";
    }

    const errorText = await response.text();
    lastError = `AI API ${response.status}: ${errorText}`;
    console.error(`AI API error with model ${model}:`, response.status, errorText);

    if (response.status !== 404) {
      throw new Error(lastError);
    }
  }

  throw new Error(lastError);
}

function parseMatches(content: string) {
  let cleaned = content.trim();

  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const arrayStart = cleaned.indexOf("[");
  const arrayEnd = cleaned.lastIndexOf("]");
  if (arrayStart >= 0 && arrayEnd > arrayStart) {
    cleaned = cleaned.slice(arrayStart, arrayEnd + 1);
  }

  const parsed = JSON.parse(cleaned);
  return Array.isArray(parsed) ? parsed : [];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const today = new Date().toISOString().split("T")[0];

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const prompt = `You are a football/soccer data assistant. Return ONLY valid JSON (no markdown, no code blocks).

Find all major football/soccer matches scheduled for today (${today}). Include matches from top leagues like:
- Brasileirão Série A
- Copa Libertadores
- Premier League
- La Liga
- Serie A (Italy)
- Bundesliga
- Ligue 1
- Champions League
- Copa do Brasil

For each match, provide this exact JSON structure as an array:
[
  {
    "id": "unique string id",
    "competition": "league/competition name",
    "homeTeam": {
      "name": "Full team name",
      "shortName": "3-letter abbreviation",
      "logo": "URL to team badge from Wikipedia or similar public source"
    },
    "awayTeam": {
      "name": "Full team name",
      "shortName": "3-letter abbreviation",
      "logo": "URL to team badge from Wikipedia or similar public source"
    },
    "date": "DD/MM/YYYY",
    "time": "HH:MM (local time in Brazil, BRT/GMT-3)",
    "venue": "Stadium name",
    "city": "City name",
    "matchday": "Round/Matchweek info"
  }
]

If there are no matches today, return an empty array [].
Return between 4-12 matches from the most important games of the day.
For team logos, use URLs from upload.wikimedia.org when possible.
IMPORTANT: Return ONLY the JSON array, nothing else.`;

    const rawContent = await requestMatchesFromAI(prompt, LOVABLE_API_KEY);
    const matches = parseMatches(rawContent);

    return new Response(JSON.stringify({ matches, date: today }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching matches:", message);

    // Return 200 with empty array to avoid breaking UI; frontend already falls back to mockMatches.
    return new Response(JSON.stringify({ error: message, matches: [], date: today }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
