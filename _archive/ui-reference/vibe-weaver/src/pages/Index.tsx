import React, { useState } from "react";
import { Eye } from "lucide-react";
import { IdeaCauldron } from "@/components/IdeaCauldron";
import { PlatformBottle } from "@/components/PlatformBottle";
import { IngredientTag } from "@/components/IngredientTag";
import { BrewButton } from "@/components/BrewButton";
import { PotionRack } from "@/components/PotionRack";
import { RecipeModal } from "@/components/RecipeModal";
import { vibePresets, VibeConfig } from "@/components/VibePreset";
import { PromptPreviewModal } from "@/components/PromptPreviewModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";

const platforms = ["Instagram", "TikTok", "X/Twitter", "LinkedIn", "Facebook", "Reddit"];

const defaultVibeConfig: VibeConfig = {
  humanity: 70,
  friendliness: 70,
  provocative: 30,
  professionalism: 50,
  vulnerability: 40,
  opinionated: 50,
  honesty: 75,
  polished: 60,
  raw: 40,
};

const Index = () => {
  const [contentIdea, setContentIdea] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [vibeConfig, setVibeConfig] = useState<VibeConfig>(defaultVibeConfig);
  const [perspective, setPerspective] = useState("first-person");
  const [corporateVoice, setCorporateVoice] = useState(false);
  
  const [customizeModal, setCustomizeModal] = useState<string | null>(null);
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleVibeSelect = (vibeId: string) => {
    if (selectedVibe === vibeId) {
      setSelectedVibe(null);
      setVibeConfig(defaultVibeConfig);
    } else {
      setSelectedVibe(vibeId);
      const preset = vibePresets.find((v) => v.id === vibeId);
      if (preset) {
        setVibeConfig(preset.config);
      }
    }
  };

  const handleGenerate = async () => {
    if (!contentIdea.trim()) {
      toast.error("Drop something in the cauldron first! 🧪");
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast.error("Pick at least one potion bottle! 🍾");
      return;
    }

    setIsGenerating(true);
    
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    const mockOutputs: Record<string, string> = {};
    
    selectedPlatforms.forEach((platform) => {
      if (platform === "Instagram") {
        mockOutputs[platform] = `✨ ${contentIdea}\n\nThis is giving exactly what it needs to give 💅\n\n#contentcreator #aesthetic #vibes #fyp #trending`;
      } else if (platform === "TikTok") {
        mockOutputs[platform] = `POV: You just discovered ${contentIdea.toLowerCase()} and it changed everything 🤯\n\n*insert trending audio*\n\n#fyp #viral #relatable`;
      } else if (platform === "X/Twitter") {
        mockOutputs[platform] = `Hot take: ${contentIdea}\n\nAnd honestly? I'm not sorry about it. 🔥\n\nRT if you agree, QRT if you're wrong.`;
      } else if (platform === "LinkedIn") {
        mockOutputs[platform] = `I've been thinking about ${contentIdea.toLowerCase()}.\n\nHere's what I've learned after 10 years in this industry:\n\n1. Authenticity wins\n2. Consistency > perfection\n3. Your network is your net worth\n\nAgree? ♻️ Repost to share with your network.`;
      } else if (platform === "Facebook") {
        mockOutputs[platform] = `🌟 ${contentIdea} 🌟\n\nI just had to share this with you all! Who else can relate? Drop a ❤️ if this speaks to you!\n\n#community #sharing #blessed`;
      } else if (platform === "Reddit") {
        mockOutputs[platform] = `[Discussion] ${contentIdea}\n\nHey everyone, I've been thinking about this lately and wanted to get the community's thoughts. What's your experience with this? Any tips appreciated!\n\nEdit: Wow, this blew up! Thanks for the awards kind strangers!`;
      }
    });

    setOutputs(mockOutputs);
    setIsGenerating(false);
    toast.success("Potions brewed successfully! ✨🧪");
  };

  return (
    <div className="min-h-screen gradient-bg overflow-hidden">
      {/* Decorative floating sparkles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[
          { left: 8, top: 12 }, { left: 92, top: 8 }, { left: 45, top: 5 },
          { left: 23, top: 78 }, { left: 67, top: 85 }, { left: 85, top: 45 },
          { left: 12, top: 55 }, { left: 78, top: 22 }, { left: 35, top: 68 },
          { left: 55, top: 15 }, { left: 3, top: 35 }, { left: 95, top: 72 },
          { left: 42, top: 92 }, { left: 18, top: 28 }, { left: 72, top: 58 },
          { left: 88, top: 88 }, { left: 28, top: 45 }, { left: 62, top: 38 },
        ].map((pos, i) => (
          <div
            key={i}
            className="floating-sparkle"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              animationDelay: `${i * 0.4}s`,
              width: `${3 + (i % 3)}px`,
              height: `${3 + (i % 3)}px`,
            }}
          />
        ))}
      </div>

      {/* Hero Header */}
      <header className="relative pt-16 pb-12 px-6">
        {/* Theme Toggle - Top Right */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          {/* Lab sign */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border mb-8 animate-fade-in">
            <span className="text-2xl">🧪</span>
            <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
              Welcome to the Laboratory
            </span>
            <span className="text-2xl">✨</span>
          </div>

          {/* Main title */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in leading-tight">
            The{" "}
            <span className="gradient-text">Alchemy</span>
            {" "}Lab
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in leading-relaxed">
            Transform your raw ideas into pure content gold. 
            <br className="hidden md:block" />
            Pick your potions, add your essence, and let the magic begin.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          
          {/* Two Column Layout on Desktop */}
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Left Column - The Workbench */}
            <div className="lg:col-span-3 space-y-10">
              
              {/* Idea Cauldron */}
              <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <IdeaCauldron 
                  value={contentIdea} 
                  onChange={setContentIdea} 
                />
              </section>

              {/* Ingredient Tags */}
              <section className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">🏷️</span>
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-foreground">
                      Ingredient Tags
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Pick your writing essence
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 justify-start">
                  {vibePresets.map((preset, index) => (
                    <div 
                      key={preset.id}
                      style={{ 
                        transform: `rotate(${(index % 2 === 0 ? -1 : 1) * (1 + index * 0.5)}deg)`,
                      }}
                    >
                      <IngredientTag
                        preset={preset}
                        selected={selectedVibe === preset.id}
                        onSelect={() => handleVibeSelect(preset.id)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column - Bottle Rack */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Platform Bottles */}
              <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">🍾</span>
                  <h2 className="font-display text-2xl font-semibold text-foreground">
                    Potion Bottles
                  </h2>
                </div>
                <p className="text-muted-foreground text-sm mb-5">
                  Select the vessels for your content magic
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  {platforms.map((platform) => (
                    <PlatformBottle
                      key={platform}
                      platform={platform}
                      selected={selectedPlatforms.includes(platform)}
                      onToggle={() => togglePlatform(platform)}
                      onCustomize={() => setCustomizeModal(platform)}
                    />
                  ))}
                </div>
              </section>

              {/* Brew Button */}
              <section className="animate-slide-up pt-4" style={{ animationDelay: "0.4s" }}>
                <div className="flex flex-col items-center gap-4">
                  <BrewButton
                    onClick={handleGenerate}
                    isLoading={isGenerating}
                    disabled={!contentIdea.trim() || selectedPlatforms.length === 0}
                  />
                  
                  <button
                    onClick={() => setShowPromptPreview(true)}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Peek at the spell
                  </button>
                </div>
              </section>
            </div>
          </div>

          {/* Output Area - Full Width */}
          {selectedPlatforms.length > 0 && (
            <section className="mt-16 animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <PotionRack
                outputs={outputs}
                selectedPlatforms={selectedPlatforms}
                isGenerating={isGenerating}
              />
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span>Brewed with</span>
            <span className="text-primary">✨</span>
            <span>for content alchemists</span>
          </p>
        </div>
      </footer>

      {/* Modals */}
      <RecipeModal
        open={!!customizeModal}
        onOpenChange={(open) => !open && setCustomizeModal(null)}
        platform={customizeModal || ""}
        config={vibeConfig}
        onConfigChange={setVibeConfig}
        perspective={perspective}
        onPerspectiveChange={setPerspective}
        corporateVoice={corporateVoice}
        onCorporateVoiceChange={setCorporateVoice}
      />

      <PromptPreviewModal
        open={showPromptPreview}
        onOpenChange={setShowPromptPreview}
        contentIdea={contentIdea}
        selectedPlatforms={selectedPlatforms}
        vibeConfig={vibeConfig}
        perspective={perspective}
        corporateVoice={corporateVoice}
      />
    </div>
  );
};

export default Index;
