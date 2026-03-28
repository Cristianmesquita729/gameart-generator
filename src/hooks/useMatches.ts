import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Match, mockMatches } from "@/data/mockMatches";

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke(
          "fetch-matches"
        );

        if (fnError) {
          console.error("Edge function error:", fnError);
          throw new Error(fnError.message);
        }

        if (data?.matches && Array.isArray(data.matches) && data.matches.length > 0) {
          setMatches(data.matches);
        } else {
          // Fallback to mock data if no matches found
          console.warn("No matches from API, using mock data");
          setMatches(mockMatches);
        }
      } catch (err: any) {
        console.error("Failed to fetch matches:", err);
        setError(err.message);
        // Fallback to mock data on error
        setMatches(mockMatches);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, []);

  const refetch = () => {
    setLoading(true);
    setError(null);
    supabase.functions
      .invoke("fetch-matches")
      .then(({ data, error: fnError }) => {
        if (fnError || !data?.matches?.length) {
          setMatches(mockMatches);
        } else {
          setMatches(data.matches);
        }
      })
      .catch(() => setMatches(mockMatches))
      .finally(() => setLoading(false));
  };

  return { matches, loading, error, refetch };
}
