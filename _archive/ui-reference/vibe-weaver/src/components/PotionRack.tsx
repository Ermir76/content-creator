import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface PotionRackProps {
  outputs: Record<string, string>;
  selectedPlatforms: string[];
  isGenerating: boolean;
}

const platformColors: Record<string, string> = {
  Instagram: "hsl(340 75% 50%)",
  TikTok: "hsl(180 90% 40%)",
  "X/Twitter": "hsl(200 90% 50%)",
  LinkedIn: "hsl(210 85% 45%)",
  Facebook: "hsl(220 65% 50%)",
  Reddit: "hsl(16 100% 50%)",
};

export const PotionRack: React.FC<PotionRackProps> = ({
  outputs,
  selectedPlatforms,
  isGenerating,
}) => {
  const [activePotion, setActivePotion] = useState(selectedPlatforms[0] || "");
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(activePotion)) {
      setActivePotion(selectedPlatforms[0]);
    }
  }, [selectedPlatforms, activePotion]);

  const handleCopy = async () => {
    const content = outputs[activePotion];
    if (content) {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Potion poured to clipboard! 📋");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (selectedPlatforms.length === 0) {
    return null;
  }

  const hasOutput = Object.values(outputs).some((o) => o);

  return (
    <div className="animate-fade-in">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              Your Potions
            </h3>
            <p className="text-sm text-muted-foreground">
              Fresh from the cauldron
            </p>
          </div>
        </div>
        
        {hasOutput && (
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl",
              "bg-card border border-border hover:border-primary/50",
              "text-muted-foreground hover:text-foreground",
              "transition-all duration-200"
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-accent" />
                <span>Poured!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Pour to clipboard</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Potion tabs - styled as bottle caps */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedPlatforms.map((platform) => (
          <button
            key={platform}
            onClick={() => setActivePotion(platform)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
              "border-2",
              activePotion === platform
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-muted-foreground/50"
            )}
            style={activePotion === platform ? {
              borderColor: platformColors[platform],
              color: platformColors[platform],
              backgroundColor: `${platformColors[platform]}15`,
            } : undefined}
          >
            <span className="flex items-center gap-2">
              <span 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: platformColors[platform] }}
              />
              {platform}
            </span>
          </button>
        ))}
      </div>

      {/* Potion content display */}
      <div className="output-potion relative min-h-[200px]">
        {/* Decorative corner flourishes */}
        <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-primary/30 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />

        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-[200px] gap-4">
            {/* Brewing animation */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-muted border-t-primary animate-spin" />
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl animate-pulse"
              >
                🧪
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Brewing your <span className="text-primary font-medium">{activePotion}</span> potion...
            </p>
          </div>
        ) : outputs[activePotion] ? (
          <div className="p-8">
            <p className="text-foreground whitespace-pre-wrap leading-relaxed font-sans">
              {outputs[activePotion]}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] text-center">
            {/* Empty bottle illustration */}
            <svg width="64" height="80" viewBox="0 0 64 80" fill="none" className="mb-4 opacity-40">
              <path
                d="M24 12H40V22C40 22 48 24 50 32C52 40 52 45 52 52V68C52 76 46 80 38 80H26C18 80 12 76 12 68V52C12 45 12 40 14 32C16 24 24 22 24 22V12Z"
                fill="hsl(270 20% 15%)"
                stroke="hsl(270 20% 25%)"
                strokeWidth="2"
              />
              <rect x="22" y="4" width="20" height="10" rx="2" fill="hsl(30 40% 30%)" />
              <text x="32" y="55" textAnchor="middle" fontSize="24" className="select-none">?</text>
            </svg>
            <p className="text-muted-foreground text-sm">
              Your <span className="font-medium">{activePotion}</span> potion awaits brewing
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
