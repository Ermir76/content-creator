import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Flame, Coffee, Zap, Crown } from "lucide-react";
import type {
  WritingStyle,
  FormatConfig,
  ModelRouting,
  Constraints
} from "@/types/policy";

export interface VibeConfig {
  humanity: number;
  friendliness: number;
  provocative: number;
  professionalism: number;
  vulnerability: number;
  opinionated: number;
  honesty: number;
  polished: number;
  raw: number;

  // Advanced Policy Fields
  writing_style?: WritingStyle;
  format?: FormatConfig;
  models?: ModelRouting;
  constraints?: Constraints;
}

export interface VibePresetData {
  id: string;
  name: string;
  emoji: string;
  description: string;
  icon: React.ElementType;
  config: VibeConfig;
}

export const vibePresets: VibePresetData[] = [
  {
    id: "friendly-expert",
    name: "Friendly Expert",
    emoji: "✨",
    description: "Knowledgeable but approachable",
    icon: Sparkles,
    config: {
      humanity: 75,
      friendliness: 85,
      provocative: 20,
      professionalism: 70,
      vulnerability: 40,
      opinionated: 50,
      honesty: 80,
      polished: 70,
      raw: 30,
    },
  },
  {
    id: "bold-creator",
    name: "Bold Creator",
    emoji: "🔥",
    description: "Confident and attention-grabbing",
    icon: Flame,
    config: {
      humanity: 65,
      friendliness: 55,
      provocative: 75,
      professionalism: 40,
      vulnerability: 30,
      opinionated: 85,
      honesty: 70,
      polished: 60,
      raw: 50,
    },
  },
  {
    id: "chill-storyteller",
    name: "Chill Storyteller",
    emoji: "☕",
    description: "Relaxed, personal vibes",
    icon: Coffee,
    config: {
      humanity: 90,
      friendliness: 80,
      provocative: 15,
      professionalism: 35,
      vulnerability: 70,
      opinionated: 40,
      honesty: 85,
      polished: 40,
      raw: 75,
    },
  },
  {
    id: "hot-take",
    name: "Hot Take",
    emoji: "⚡",
    description: "Spicy opinions, high engagement",
    icon: Zap,
    config: {
      humanity: 50,
      friendliness: 35,
      provocative: 95,
      professionalism: 25,
      vulnerability: 20,
      opinionated: 100,
      honesty: 75,
      polished: 45,
      raw: 70,
    },
  },
  {
    id: "main-character",
    name: "Main Character",
    emoji: "👑",
    description: "Unapologetically you",
    icon: Crown,
    config: {
      humanity: 80,
      friendliness: 60,
      provocative: 65,
      professionalism: 30,
      vulnerability: 55,
      opinionated: 75,
      honesty: 90,
      polished: 35,
      raw: 80,
    },
  },
];

interface VibePresetProps {
  preset: VibePresetData;
  selected: boolean;
  onSelect: () => void;
}

export const VibePreset: React.FC<VibePresetProps> = ({ preset, selected, onSelect }) => {
  const Icon = preset.icon;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "vibe-card text-left w-full",
        selected ? "vibe-card-selected" : "vibe-card-unselected"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{preset.emoji}</span>
            <span className="font-semibold text-foreground">{preset.name}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{preset.description}</p>
        </div>
      </div>
    </button>
  );
};
