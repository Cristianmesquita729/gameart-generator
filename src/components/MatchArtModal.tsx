import { Match } from "@/data/mockMatches";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect, useCallback } from "react";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MatchArtModalProps {
  match: Match | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MatchArtModal = ({ match, open, onOpenChange }: MatchArtModalProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateArt = useCallback(async () => {
    if (!match) return;

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "generate-match-art",
        { body: { match } }
      );

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        throw new Error("Nenhuma imagem foi gerada");
      }
    } catch (err: any) {
      console.error("Error generating art:", err);
      const msg = err.message || "Erro ao gerar arte";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [match]);

  useEffect(() => {
    if (open && match) {
      generateArt();
    }
    if (!open) {
      setImageUrl(null);
      setError(null);
    }
  }, [open, match, generateArt]);

  const handleDownload = useCallback(() => {
    if (!imageUrl || !match) return;

    const link = document.createElement("a");
    link.download = `${match.homeTeam.shortName}-vs-${match.awayTeam.shortName}.png`;
    link.href = imageUrl;
    link.click();
  }, [imageUrl, match]);

  if (!match) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-border bg-card p-0 shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="mb-4 text-center">
            <h3 className="font-display text-xl tracking-wider text-foreground">
              {match.homeTeam.shortName} VS {match.awayTeam.shortName}
            </h3>
            <p className="font-body text-xs text-muted-foreground">
              {match.competition}
            </p>
          </div>

          {/* Image Area */}
          <div
            className="relative flex items-center justify-center overflow-hidden rounded-lg bg-muted"
            style={{ minHeight: "400px" }}
          >
            {loading && (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="font-body text-sm text-muted-foreground">
                  Gerando arte com IA...
                </p>
                <p className="font-body text-xs text-muted-foreground/60">
                  Isso pode levar alguns segundos
                </p>
              </div>
            )}

            {error && !loading && (
              <div className="flex flex-col items-center gap-3 px-4 text-center">
                <p className="font-body text-sm text-destructive">{error}</p>
                <Button
                  onClick={generateArt}
                  variant="outline"
                  size="sm"
                  className="gap-2 font-body"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Tentar novamente
                </Button>
              </div>
            )}

            {imageUrl && !loading && (
              <img
                src={imageUrl}
                alt={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
                className="h-auto w-full rounded-lg"
              />
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-center gap-2">
            <Button
              onClick={handleDownload}
              disabled={!imageUrl || loading}
              className="gap-2 font-body"
            >
              <Download className="h-4 w-4" />
              Baixar Arte
            </Button>
            <Button
              onClick={generateArt}
              disabled={loading}
              variant="outline"
              className="gap-2 font-body"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchArtModal;
