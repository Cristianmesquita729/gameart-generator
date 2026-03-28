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
    const today = new Date().toISOString().split("T")[0];

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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", errorText);
      throw new Error(`AI API returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";

    // Clean the response - remove potential markdown code blocks
    let cleaned = content.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const matches = JSON.parse(cleaned);

    return new Response(JSON.stringify({ matches, date: today }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return new Response(
      JSON.stringify({ error: error.message, matches: [] }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
