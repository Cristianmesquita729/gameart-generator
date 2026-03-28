import { useState } from "react";
import { Zap, RefreshCw, Loader2 } from "lucide-react";
import { Match } from "@/data/mockMatches";
import { useMatches } from "@/hooks/useMatches";
import MatchCard from "@/components/MatchCard";
import MatchArtModal from "@/components/MatchArtModal";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { matches, loading, error, refetch } = useMatches();

  const handleGenerate = (match: Match) => {
    setSelectedMatch(match);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl tracking-wider text-foreground">
                MATCHDAY
              </h1>
              <p className="font-body text-xs text-muted-foreground">
                Gerador de Artes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading}
              className="gap-2 font-body"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Atualizar
            </Button>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-body text-xs font-semibold text-primary">
              {loading ? "..." : `${matches.length} partidas hoje`}
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container py-8">
        <div className="mb-6">
          <h2 className="font-display text-4xl tracking-wider text-foreground">
            PARTIDAS DO DIA
          </h2>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            {error
              ? "Usando dados de exemplo — clique em Atualizar para tentar novamente"
              : "Clique em uma partida para gerar a arte"}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 font-body text-sm text-muted-foreground">
              Buscando partidas do dia...
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} onGenerate={handleGenerate} />
            ))}
          </div>
        )}
      </main>

      <MatchArtModal
        match={selectedMatch}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default Index;
