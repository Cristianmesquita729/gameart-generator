import { Match } from "@/data/mockMatches";
import { MapPin, Clock, Trophy } from "lucide-react";

interface MatchCardProps {
  match: Match;
  onGenerate: (match: Match) => void;
}

const MatchCard = ({ match, onGenerate }: MatchCardProps) => {
  return (
    <button
      onClick={() => onGenerate(match)}
      className="group w-full rounded-lg border border-border bg-card p-4 text-left transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_hsl(var(--glow)/0.15)]"
    >
      <div className="mb-2 flex items-center gap-2">
        <Trophy className="h-3.5 w-3.5 text-primary" />
        <span className="font-body text-xs font-semibold uppercase tracking-wider text-primary">
          {match.competition}
        </span>
        {match.matchday && (
          <span className="ml-auto text-xs text-muted-foreground">{match.matchday}</span>
        )}
      </div>

      <div className="flex items-center justify-between py-3">
        <div className="flex flex-1 flex-col items-center gap-2">
          <img
            src={match.homeTeam.logo}
            alt={match.homeTeam.name}
            className="h-12 w-12 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <span className="font-display text-lg tracking-wide text-foreground">
            {match.homeTeam.shortName}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 px-4">
          <span className="font-display text-3xl tracking-wider text-foreground">VS</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span className="font-body text-sm font-medium">{match.time}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-2">
          <img
            src={match.awayTeam.logo}
            alt={match.awayTeam.name}
            className="h-12 w-12 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <span className="font-display text-lg tracking-wide text-foreground">
            {match.awayTeam.shortName}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span className="font-body">
          {match.venue}, {match.city}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-center">
        <span className="rounded-md bg-primary/10 px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          Gerar Arte
        </span>
      </div>
    </button>
  );
};

export default MatchCard;
