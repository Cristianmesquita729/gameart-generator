import { useState } from "react";
import { Zap } from "lucide-react";
import { mockMatches, Match } from "@/data/mockMatches";
import MatchCard from "@/components/MatchCard";
import MatchArtModal from "@/components/MatchArtModal";

const Index = () => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-body text-xs font-semibold text-primary">
            {mockMatches.length} partidas hoje
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="container py-8">
        <div className="mb-6">
          <h2 className="font-display text-4xl tracking-wider text-foreground">
            PARTIDAS DO DIA
          </h2>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            Clique em uma partida para gerar a arte
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {mockMatches.map((match) => (
            <MatchCard key={match.id} match={match} onGenerate={handleGenerate} />
          ))}
        </div>
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
