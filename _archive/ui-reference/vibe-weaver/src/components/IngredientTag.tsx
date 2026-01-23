import React from "react";
import { cn } from "@/lib/utils";
import { VibePresetData } from "@/components/VibePreset";

interface IngredientTagProps {
  preset: VibePresetData;
  selected: boolean;
  onSelect: () => void;
}

// Unique wax seal colors for each preset
const sealColors: Record<string, { wax: string; glow: string }> = {
  "friendly-expert": { wax: "hsl(42, 90%, 45%)", glow: "hsl(42, 90%, 55%)" },
  "bold-creator": { wax: "hsl(0, 75%, 45%)", glow: "hsl(0, 85%, 55%)" },
  "chill-storyteller": { wax: "hsl(180, 60%, 40%)", glow: "hsl(180, 70%, 50%)" },
  "hot-take": { wax: "hsl(25, 90%, 50%)", glow: "hsl(25, 100%, 60%)" },
  "main-character": { wax: "hsl(280, 70%, 50%)", glow: "hsl(280, 80%, 60%)" },
};

export const IngredientTag: React.FC<IngredientTagProps> = ({ preset, selected, onSelect }) => {
  const Icon = preset.icon;
  const colors = sealColors[preset.id] || sealColors["friendly-expert"];

  return (
    <button
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col items-center transition-all duration-300",
        "w-[130px]",
        selected ? "z-10" : "z-0",
        // Hover effects
        "hover:-translate-y-1 hover:rotate-1"
      )}
      style={{
        filter: selected ? `drop-shadow(0 0 20px ${colors.glow})` : undefined,
      }}
    >
      {/* Wax Seal */}
      <div
        className={cn(
          "relative w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300",
          "shadow-lg",
          selected ? "scale-110" : "group-hover:scale-105"
        )}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${colors.wax}, ${colors.wax.replace("45%", "35%").replace("40%", "30%").replace("50%", "40%")})`,
          boxShadow: selected 
            ? `0 4px 20px ${colors.glow}, inset 0 -2px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)`
            : `inset 0 -2px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2), 0 4px 8px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Seal emboss effect */}
        <div className="absolute inset-1 rounded-full border border-white/10" />
        <Icon 
          className={cn(
            "w-5 h-5 transition-all duration-300",
            selected ? "text-white drop-shadow-md" : "text-white/90"
          )} 
        />
      </div>

      {/* Parchment Tag */}
      <div
        className={cn(
          "relative -mt-3 pt-6 pb-3 px-3 w-full transition-all duration-300",
          "ingredient-tag-parchment",
          selected && "ingredient-tag-selected"
        )}
        style={{
          clipPath: "polygon(5% 0%, 95% 2%, 100% 8%, 98% 92%, 93% 100%, 8% 97%, 0% 93%, 2% 5%)",
        }}
      >
        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center">
          <span className={cn(
            "block font-display text-sm font-semibold mb-0.5 transition-colors",
            selected ? "text-amber-900" : "text-stone-700 group-hover:text-stone-900"
          )}>
            {preset.name}
          </span>
          <span className={cn(
            "block text-[10px] leading-tight transition-colors",
            selected ? "text-amber-800/80" : "text-stone-500 group-hover:text-stone-600"
          )}>
            {preset.description}
          </span>
        </div>

        {/* Selected glow indicator */}
        {selected && (
          <div 
            className="absolute inset-0 rounded-lg opacity-20 pointer-events-none animate-pulse"
            style={{
              background: `radial-gradient(circle at center, ${colors.glow}, transparent 70%)`,
            }}
          />
        )}
      </div>

      {/* String/thread connecting seal to tag */}
      <div 
        className={cn(
          "absolute top-10 left-1/2 -translate-x-1/2 w-[2px] h-4 z-5 transition-colors",
          selected ? "bg-amber-700" : "bg-stone-400"
        )}
        style={{
          background: selected 
            ? "linear-gradient(to bottom, transparent, hsl(35, 50%, 35%))"
            : "linear-gradient(to bottom, transparent, hsl(30, 10%, 50%))",
        }}
      />
    </button>
  );
};
