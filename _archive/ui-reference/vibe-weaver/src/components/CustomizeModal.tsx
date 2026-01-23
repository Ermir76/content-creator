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
import { User, Palette, Layout, Cpu } from "lucide-react";

interface CustomizeModalProps {
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

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
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
  const [activeTab, setActiveTab] = useState("persona");

  const updateConfig = (key: keyof VibeConfig, value: number) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] bg-card border-border rounded-3xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-gradient-to-b from-muted/50 to-transparent">
          <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
            <span>Customize</span>
            <span className="text-primary">{platform}</span>
            <span className="text-lg">✨</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start px-6 py-2 bg-transparent border-b border-border rounded-none h-auto gap-1">
            <TabsTrigger
              value="persona"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 text-sm font-medium transition-all"
            >
              <User className="w-4 h-4 mr-2" />
              Persona
            </TabsTrigger>
            <TabsTrigger
              value="style"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 text-sm font-medium transition-all"
            >
              <Palette className="w-4 h-4 mr-2" />
              Style
            </TabsTrigger>
            <TabsTrigger
              value="format"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 text-sm font-medium transition-all"
            >
              <Layout className="w-4 h-4 mr-2" />
              Format
            </TabsTrigger>
            <TabsTrigger
              value="models"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 text-sm font-medium transition-all"
            >
              <Cpu className="w-4 h-4 mr-2" />
              Models
            </TabsTrigger>
          </TabsList>

          <div className="p-6 max-h-[400px] overflow-y-auto">
            <TabsContent value="persona" className="mt-0 space-y-6">
              <div className="space-y-5">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Personality Traits
                </h4>
                <CustomSlider
                  label="Humanity"
                  value={config.humanity}
                  onChange={(v) => updateConfig("humanity", v)}
                  leftLabel="Robotic"
                  rightLabel="Human"
                />
                <CustomSlider
                  label="Friendliness"
                  value={config.friendliness}
                  onChange={(v) => updateConfig("friendliness", v)}
                  leftLabel="Reserved"
                  rightLabel="Warm"
                />
                <CustomSlider
                  label="Provocative"
                  value={config.provocative}
                  onChange={(v) => updateConfig("provocative", v)}
                  leftLabel="Safe"
                  rightLabel="Edgy"
                />
                <CustomSlider
                  label="Professionalism"
                  value={config.professionalism}
                  onChange={(v) => updateConfig("professionalism", v)}
                  leftLabel="Casual"
                  rightLabel="Formal"
                />
                <CustomSlider
                  label="Vulnerability"
                  value={config.vulnerability}
                  onChange={(v) => updateConfig("vulnerability", v)}
                  leftLabel="Guarded"
                  rightLabel="Open"
                />
                <CustomSlider
                  label="Opinionated"
                  value={config.opinionated}
                  onChange={(v) => updateConfig("opinionated", v)}
                  leftLabel="Neutral"
                  rightLabel="Strong takes"
                />
              </div>

              <div className="space-y-5 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Authenticity
                </h4>
                <CustomSlider
                  label="Honesty"
                  value={config.honesty}
                  onChange={(v) => updateConfig("honesty", v)}
                  leftLabel="Diplomatic"
                  rightLabel="Blunt"
                />
                <CustomSlider
                  label="Polished"
                  value={config.polished}
                  onChange={(v) => updateConfig("polished", v)}
                  leftLabel="Rough"
                  rightLabel="Refined"
                />
                <CustomSlider
                  label="Raw"
                  value={config.raw}
                  onChange={(v) => updateConfig("raw", v)}
                  leftLabel="Filtered"
                  rightLabel="Unfiltered"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Perspective</Label>
                  <Select value={perspective} onValueChange={onPerspectiveChange}>
                    <SelectTrigger className="w-full rounded-xl bg-muted border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border rounded-xl">
                      <SelectItem value="first-person">First Person (I, me, my)</SelectItem>
                      <SelectItem value="second-person">Second Person (you, your)</SelectItem>
                      <SelectItem value="third-person">Third Person (they, them)</SelectItem>
                      <SelectItem value="we">Collective (we, our)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-sm font-medium">Corporate Voice</Label>
                    <p className="text-xs text-muted-foreground">More formal, brand-safe tone</p>
                  </div>
                  <Switch
                    checked={corporateVoice}
                    onCheckedChange={onCorporateVoiceChange}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="style" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Palette className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Style Settings</h3>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  Tone, emoji usage, hashtag style, and more coming soon ✨
                </p>
              </div>
            </TabsContent>

            <TabsContent value="format" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Layout className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Format Settings</h3>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  Post length, structure, call-to-actions coming soon ✨
                </p>
              </div>
            </TabsContent>

            <TabsContent value="models" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Cpu className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">AI Model Selection</h3>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  Choose your AI model (GPT-4, Claude, etc.) coming soon ✨
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
