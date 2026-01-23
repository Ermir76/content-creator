import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Sparkles, Save, CheckCircle, Cpu, Feather, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { DraftTabs } from "./DraftTabs";
import type { PlatformResult } from "@/types/content";
import axios from "axios";

interface PotionRackProps {
  platformResults: Record<string, PlatformResult>;
  selectedPlatforms: string[];
  isGenerating: boolean;
  ideaPrompt: string; // Needed for saving
  onRetry?: (platform: string) => void; // Retry a single failed platform
}

const platformColors: Record<string, string> = {
  Instagram: "hsl(340 75% 50%)",
  TikTok: "hsl(180 90% 40%)",
  "X/Twitter": "hsl(200 90% 50%)",
  LinkedIn: "hsl(210 85% 45%)",
  Facebook: "hsl(220 65% 50%)",
  Reddit: "hsl(16 100% 50%)",
};

// Map display names to API names
const platformApiMap: Record<string, string> = {
  "Instagram": "instagram",
  "TikTok": "tiktok",
  "X/Twitter": "x",
  "LinkedIn": "linkedin",
  "Facebook": "facebook",
  "Reddit": "reddit"
};



export const PotionRack: React.FC<PotionRackProps> = ({
  platformResults,
  selectedPlatforms,
  isGenerating,
  ideaPrompt,
  onRetry,
}) => {
  const [activePotion, setActivePotion] = useState(selectedPlatforms[0] || "");
  const [copied, setCopied] = useState(false);
  // Track selected draft index per platform
  const [selectedDraftIndex, setSelectedDraftIndex] = useState<Record<string, number>>({});
  // Track saved state per platform
  const [savedPlatforms, setSavedPlatforms] = useState<Record<string, boolean>>({});
  const [savingPlatform, setSavingPlatform] = useState<string | null>(null);

  React.useEffect(() => {
    if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(activePotion)) {
      setActivePotion(selectedPlatforms[0]);
    }
  }, [selectedPlatforms, activePotion]);

  // Get current platform result
  const currentResult = platformResults[activePotion];
  const isError = currentResult && !currentResult.success;
  const drafts = currentResult?.drafts || [];
  const currentDraftIndex = selectedDraftIndex[activePotion] ?? (drafts.length - 1); // Default to final draft

  // Get the content and model to display (either from selected draft or final content)
  const getDisplayContent = () => {
    if (drafts.length > 0 && currentDraftIndex >= 0 && currentDraftIndex < drafts.length) {
      return drafts[currentDraftIndex].content;
    }
    return currentResult?.content || "";
  };

  const getDisplayModel = () => {
    if (drafts.length > 0 && currentDraftIndex >= 0 && currentDraftIndex < drafts.length) {
      return drafts[currentDraftIndex].model;
    }
    return currentResult?.model_used;
  };

  const displayContent = getDisplayContent();
  const displayModel = getDisplayModel();
  const charCount = displayContent.length;
  const isSaved = savedPlatforms[activePotion] || false;

  const handleCopy = async () => {
    if (displayContent) {
      await navigator.clipboard.writeText(displayContent);
      setCopied(true);
      toast.success("Potion poured to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = async () => {
    if (!displayContent || isSaved || savingPlatform === activePotion) return;

    setSavingPlatform(activePotion);
    try {
      await axios.post('/content/save', {
        idea_prompt: ideaPrompt,
        platform: platformApiMap[activePotion] || activePotion.toLowerCase(),
        content_text: displayContent,
        model_used: displayModel,
        char_count: charCount,
      });

      setSavedPlatforms(prev => ({ ...prev, [activePotion]: true }));
      toast.success("Potion preserved in the archives!");
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error("Failed to preserve this potion");
    } finally {
      setSavingPlatform(null);
    }
  };

  const handleDraftSelect = (index: number) => {
    setSelectedDraftIndex(prev => ({
      ...prev,
      [activePotion]: index
    }));
  };

  if (selectedPlatforms.length === 0) {
    return null;
  }

  const hasOutput = Object.values(platformResults).some((r) => r?.content);

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

        {/* Action buttons */}
        {hasOutput && (
          <div className="flex items-center gap-2">
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

            <button
              onClick={handleSave}
              disabled={isSaved || savingPlatform === activePotion || !displayContent}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl",
                "border transition-all duration-200",
                isSaved
                  ? "bg-accent/10 border-accent/50 text-accent"
                  : "bg-card border-border hover:border-accent/50 text-muted-foreground hover:text-foreground",
                (isSaved || savingPlatform === activePotion) && "opacity-80 cursor-not-allowed"
              )}
            >
              {isSaved ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Preserved</span>
                </>
              ) : savingPlatform === activePotion ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Preserving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Preserve</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Potion tabs - styled as bottle caps */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedPlatforms.map((platform) => {
          const platformSaved = savedPlatforms[platform];
          const platformResult = platformResults[platform];
          const platformFailed = platformResult && !platformResult.success;
          return (
            <button
              key={platform}
              onClick={() => setActivePotion(platform)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                "border-2 relative",
                platformFailed
                  ? "border-destructive/50 bg-destructive/10 text-destructive"
                  : activePotion === platform
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-muted-foreground/50"
              )}
              style={!platformFailed && activePotion === platform ? {
                borderColor: platformColors[platform],
                color: platformColors[platform],
                backgroundColor: `${platformColors[platform]}15`,
              } : undefined}
            >
              <span className="flex items-center gap-2">
                {platformFailed ? (
                  <AlertCircle className="w-3 h-3 text-destructive" />
                ) : (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: platformColors[platform] }}
                  />
                )}
                {platform}
                {platformSaved && (
                  <CheckCircle className="w-3 h-3 text-accent" />
                )}
              </span>
            </button>
          );
        })}
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
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Brewing your <span className="text-primary font-medium">{activePotion}</span> potion...
            </p>
          </div>
        ) : isError ? (
          /* Error state with retry button */
          <div className="flex flex-col items-center justify-center h-[200px] gap-4 p-6">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-semibold text-destructive">Potion brewing failed!</p>
              <p className="text-sm text-muted-foreground max-w-md">
                {currentResult?.error || "Something went wrong while generating content for this platform."}
              </p>
            </div>
            {onRetry && (
              <button
                onClick={() => onRetry(activePotion)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl",
                  "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                  "font-medium transition-all duration-200"
                )}
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            )}
          </div>
        ) : displayContent ? (
          <div className="p-8">
            {/* Header row: Draft Tabs + Model Badge */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              {/* Draft Tabs - Show evolution of content */}
              {drafts.length > 0 ? (
                <DraftTabs
                  drafts={drafts}
                  selectedIndex={currentDraftIndex}
                  onSelect={handleDraftSelect}
                />
              ) : (
                <div /> // Spacer
              )}

              {/* Model Badge - Alchemy style */}
              {displayModel && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/80 border border-border text-xs text-muted-foreground">
                  <Cpu className="w-3.5 h-3.5" />
                  <span className="font-medium">{displayModel}</span>
                </div>
              )}
            </div>

            <p className="text-foreground whitespace-pre-wrap leading-relaxed font-sans">
              {displayContent}
            </p>

            {/* Footer: Character count + Ink Flow style */}
            <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Feather className="w-3.5 h-3.5" />
                <span>Ink Flow</span>
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                {charCount} characters
              </div>
            </div>
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
