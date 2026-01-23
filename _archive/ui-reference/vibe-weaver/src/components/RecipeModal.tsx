import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomSlider } from "@/components/ui/custom-slider";
import { VibeConfig } from "@/components/VibePreset";
import { cn } from "@/lib/utils";

interface RecipeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: string;
  config: VibeConfig;
  onConfigChange: (config: VibeConfig) => void;
  perspective: string;
  onPerspectiveChange: (perspective: string) => void;
  corporateVoice: boolean;
  onCorporateVoiceChange: (value: boolean) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  open,
  onOpenChange,
  platform,
  config,
  onConfigChange,
  perspective,
  onPerspectiveChange,
  corporateVoice,
  onCorporateVoiceChange,
}) => {
  const [activeTab, setActiveTab] = useState("ingredients");

  const updateConfig = (key: keyof VibeConfig, value: number) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] recipe-card rounded-3xl p-0 overflow-hidden border-0">
        {/* Header - styled as recipe card title */}
        <DialogHeader className="px-8 pt-8 pb-6 border-b border-border/50">
          <div className="flex items-center gap-4">
            {/* Decorative seal */}
            <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
              <span className="text-2xl">📜</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                Secret Recipe for
              </p>
              <DialogTitle className="font-display text-2xl font-bold text-primary">
                {platform} Potion
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start px-8 py-3 bg-transparent border-b border-border/50 rounded-none h-auto gap-2">
            <TabsTrigger value="ingredients" className="recipe-tab">
              🧪 Ingredients
            </TabsTrigger>
            <TabsTrigger value="technique" className="recipe-tab">
              ✨ Technique
            </TabsTrigger>
            <TabsTrigger value="presentation" className="recipe-tab">
              🎨 Presentation
            </TabsTrigger>
          </TabsList>

          <div className="p-8 max-h-[420px] overflow-y-auto">
            <TabsContent value="ingredients" className="mt-0 space-y-6">
              {/* Personality section */}
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌿</span>
                  <h4 className="font-display text-lg font-semibold text-foreground">
                    Personality Essence
                  </h4>
                </div>
                
                <div className="space-y-4 pl-7">
                  <CustomSlider
                    label="Human Touch"
                    value={config.humanity}
                    onChange={(v) => updateConfig("humanity", v)}
                    leftLabel="Mechanical"
                    rightLabel="Soulful"
                  />
                  <CustomSlider
                    label="Warmth"
                    value={config.friendliness}
                    onChange={(v) => updateConfig("friendliness", v)}
                    leftLabel="Cool"
                    rightLabel="Cozy"
                  />
                  <CustomSlider
                    label="Spice Level 🌶️"
                    value={config.provocative}
                    onChange={(v) => updateConfig("provocative", v)}
                    leftLabel="Mild"
                    rightLabel="Fire"
                  />
                  <CustomSlider
                    label="Polish"
                    value={config.professionalism}
                    onChange={(v) => updateConfig("professionalism", v)}
                    leftLabel="Rough"
                    rightLabel="Refined"
                  />
                </div>
              </div>

              {/* Authenticity section */}
              <div className="space-y-5 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💎</span>
                  <h4 className="font-display text-lg font-semibold text-foreground">
                    Authenticity Crystals
                  </h4>
                </div>
                
                <div className="space-y-4 pl-7">
                  <CustomSlider
                    label="Vulnerability"
                    value={config.vulnerability}
                    onChange={(v) => updateConfig("vulnerability", v)}
                    leftLabel="Guarded"
                    rightLabel="Open heart"
                  />
                  <CustomSlider
                    label="Opinion Strength"
                    value={config.opinionated}
                    onChange={(v) => updateConfig("opinionated", v)}
                    leftLabel="Neutral"
                    rightLabel="Bold takes"
                  />
                  <CustomSlider
                    label="Truth Serum"
                    value={config.honesty}
                    onChange={(v) => updateConfig("honesty", v)}
                    leftLabel="Diplomatic"
                    rightLabel="Blunt"
                  />
                  <CustomSlider
                    label="Raw Energy"
                    value={config.raw}
                    onChange={(v) => updateConfig("raw", v)}
                    leftLabel="Filtered"
                    rightLabel="Uncut"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="technique" className="mt-0 space-y-6">
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎭</span>
                  <h4 className="font-display text-lg font-semibold text-foreground">
                    Voice & Perspective
                  </h4>
                </div>

                <div className="space-y-4 pl-7">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Speaking As...
                    </Label>
                    <Select value={perspective} onValueChange={onPerspectiveChange}>
                      <SelectTrigger className={cn(
                        "w-full rounded-xl bg-muted/50 border-border/50",
                        "focus:ring-primary/30"
                      )}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border rounded-xl">
                        <SelectItem value="first-person">🙋 First Person (I, me, my)</SelectItem>
                        <SelectItem value="second-person">👆 Second Person (you, your)</SelectItem>
                        <SelectItem value="third-person">👤 Third Person (they, them)</SelectItem>
                        <SelectItem value="we">👥 Collective (we, our)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className={cn(
                    "flex items-center justify-between p-4 rounded-xl",
                    "bg-muted/30 border border-border/50"
                  )}>
                    <div>
                      <Label className="text-sm font-medium text-foreground">
                        Corporate Charm
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        More polished, brand-safe tone
                      </p>
                    </div>
                    <Switch
                      checked={corporateVoice}
                      onCheckedChange={onCorporateVoiceChange}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="presentation" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
                  <span className="text-4xl">🎨</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Presentation Magic
                </h3>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  Emoji style, hashtag strategy, formatting spells... coming to the grimoire soon ✨
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer with seal */}
        <div className="px-8 py-4 border-t border-border/50 flex justify-center">
          <p className="text-xs text-muted-foreground italic">
            ~ Brewed with care in the Alchemy Lab ~
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
