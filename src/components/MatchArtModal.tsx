import { Match } from "@/data/mockMatches";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRef, useCallback } from "react";
import { MapPin, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface MatchArtModalProps {
  match: Match | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MatchArtModal = ({ match, open, onOpenChange }: MatchArtModalProps) => {
  const artRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!artRef.current || !match) return;

    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(artRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `${match.homeTeam.shortName}-vs-${match.awayTeam.shortName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Error generating image:", err);
    }
  }, [match]);

  if (!match) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border bg-transparent p-0 shadow-2xl">
        {/* The Art Card */}
        <div
          ref={artRef}
          className="relative overflow-hidden rounded-xl"
          style={{
            background: "linear-gradient(135deg, hsl(220 25% 12%), hsl(220 20% 5%))",
            aspectRatio: "16/9",
          }}
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 20px, white 20px, white 21px)",
            }}
          />

          {/* Glow effects */}
          <div className="absolute -left-20 top-1/2 h-60 w-60 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute -right-20 top-1/2 h-60 w-60 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />

          {/* Top bar - Competition */}
          <div className="relative z-10 flex items-center justify-center gap-2 border-b border-primary/20 px-6 py-3">
            <span
              className="text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: "hsl(82 85% 50%)", fontFamily: '"Inter", sans-serif' }}
            >
              {match.competition}
            </span>
            {match.matchday && (
              <span className="ml-2 text-xs uppercase tracking-wider text-gray-400" style={{ fontFamily: '"Inter", sans-serif' }}>
                • {match.matchday}
              </span>
            )}
          </div>

          {/* Main content */}
          <div className="relative z-10 flex h-[calc(100%-80px)] items-center justify-between px-8">
            {/* Home team */}
            <div className="flex flex-1 flex-col items-center gap-3">
              <img
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                className="h-20 w-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <span
                className="text-4xl tracking-wider text-white"
                style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}
              >
                {match.homeTeam.shortName}
              </span>
              <span className="text-xs text-gray-400" style={{ fontFamily: '"Inter", sans-serif' }}>
                {match.homeTeam.name}
              </span>
            </div>

            {/* Center - VS and info */}
            <div className="flex flex-col items-center gap-2">
              <span
                className="text-6xl tracking-widest"
                style={{
                  fontFamily: '"Bebas Neue", Impact, sans-serif',
                  color: "hsl(82 85% 50%)",
                  textShadow: "0 0 30px hsl(82 85% 50% / 0.3)",
                }}
              >
                VS
              </span>
              <div className="mt-1 flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Calendar className="h-3 w-3" style={{ color: "hsl(82 85% 50%)" }} />
                  <span className="text-xs font-medium" style={{ fontFamily: '"Inter", sans-serif' }}>
                    {match.date}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Clock className="h-3 w-3" style={{ color: "hsl(82 85% 50%)" }} />
                  <span className="text-xs font-medium" style={{ fontFamily: '"Inter", sans-serif' }}>
                    {match.time}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <MapPin className="h-3 w-3" style={{ color: "hsl(82 85% 50%)" }} />
                  <span className="text-xs font-medium" style={{ fontFamily: '"Inter", sans-serif' }}>
                    {match.venue}
                  </span>
                </div>
              </div>
            </div>

            {/* Away team */}
            <div className="flex flex-1 flex-col items-center gap-3">
              <img
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                className="h-20 w-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <span
                className="text-4xl tracking-wider text-white"
                style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}
              >
                {match.awayTeam.shortName}
              </span>
              <span className="text-xs text-gray-400" style={{ fontFamily: '"Inter", sans-serif' }}>
                {match.awayTeam.name}
              </span>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-primary/20 px-6 py-2 text-center">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500" style={{ fontFamily: '"Inter", sans-serif' }}>
              {match.city} • {match.venue}
            </span>
          </div>
        </div>

        {/* Download button */}
        <div className="flex justify-center pb-4 pt-2">
          <Button onClick={handleDownload} className="gap-2 font-body">
            <Download className="h-4 w-4" />
            Baixar Arte
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchArtModal;
