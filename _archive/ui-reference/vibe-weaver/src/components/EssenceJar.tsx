import React from "react";
import { cn } from "@/lib/utils";
import { VibePresetData } from "@/components/VibePreset";

interface EssenceJarProps {
  preset: VibePresetData;
  selected: boolean;
  onSelect: () => void;
}

const essenceColors: Record<string, { primary: string; secondary: string; glow: string }> = {
  "friendly-expert": { 
    primary: "hsl(42 90% 55%)", 
    secondary: "hsl(38 100% 70%)",
    glow: "hsl(42 90% 55% / 0.5)"
  },
  "bold-creator": { 
    primary: "hsl(15 90% 55%)", 
    secondary: "hsl(25 100% 65%)",
    glow: "hsl(15 90% 55% / 0.5)"
  },
  "chill-storyteller": { 
    primary: "hsl(200 70% 50%)", 
    secondary: "hsl(190 80% 60%)",
    glow: "hsl(200 70% 50% / 0.5)"
  },
  "hot-take": { 
    primary: "hsl(350 85% 55%)", 
    secondary: "hsl(20 100% 60%)",
    glow: "hsl(350 85% 55% / 0.5)"
  },
  "main-character": { 
    primary: "hsl(280 70% 55%)", 
    secondary: "hsl(300 80% 70%)",
    glow: "hsl(280 70% 55% / 0.5)"
  },
};

export const EssenceJar: React.FC<EssenceJarProps> = ({ preset, selected, onSelect }) => {
  const colors = essenceColors[preset.id] || essenceColors["friendly-expert"];

  return (
    <button
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col items-center p-2 rounded-lg transition-all duration-300",
        "hover:scale-105 active:scale-95",
        selected && "scale-105"
      )}
      style={{
        filter: selected ? `drop-shadow(0 0 12px ${colors.glow})` : undefined
      }}
    >
      {/* Tiny cork-topped vial */}
      <div className="relative">
        <svg width="36" height="48" viewBox="0 0 36 48" fill="none">
          {/* Cork */}
          <rect
            x="12"
            y="2"
            width="12"
            height="8"
            rx="2"
            fill="hsl(30 30% 35%)"
            stroke="hsl(30 20% 25%)"
            strokeWidth="1"
          />
          <rect x="13" y="3" width="3" height="6" rx="1" fill="hsl(30 25% 40%)" opacity="0.5" />
          
          {/* Vial neck */}
          <path
            d="M14 10 L14 14 L10 18 L10 44 C10 46 12 48 18 48 C24 48 26 46 26 44 L26 18 L22 14 L22 10 Z"
            fill="hsl(270 20% 15%)"
            stroke={selected ? colors.primary : "hsl(270 15% 25%)"}
            strokeWidth="1.5"
            className="transition-colors duration-300"
          />
          
          {/* Glass highlight */}
          <path
            d="M12 16 L12 42 C12 44 14 46 18 46"
            stroke="hsl(0 0% 100% / 0.1)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Liquid fill */}
          <path
            d="M11 22 L11 43 C11 45 13 47 18 47 C23 47 25 45 25 43 L25 22 C25 20 23 19 18 19 C13 19 11 20 11 22 Z"
            fill={selected ? colors.primary : "hsl(270 20% 20%)"}
            opacity={selected ? 0.7 : 0.3}
            className="transition-all duration-500"
          />
          
          {/* Bubbles when selected */}
          {selected && (
            <>
              <circle cx="15" cy="32" r="1.5" fill={colors.secondary} opacity="0.8" className="animate-pulse" />
              <circle cx="20" cy="38" r="1" fill={colors.secondary} opacity="0.6" className="animate-pulse" style={{ animationDelay: "0.2s" }} />
              <circle cx="17" cy="42" r="1.5" fill={colors.secondary} opacity="0.7" className="animate-pulse" style={{ animationDelay: "0.4s" }} />
            </>
          )}
          
          {/* Emoji centered */}
          <text
            x="18"
            y="35"
            textAnchor="middle"
            fontSize="12"
            className="select-none"
          >
            {preset.emoji}
          </text>
        </svg>
      </div>

      {/* Label underneath */}
      <div className={cn(
        "mt-1 px-2 py-0.5 rounded text-center transition-all duration-300 max-w-[80px]",
        selected 
          ? "bg-primary/20" 
          : "bg-transparent"
      )}>
        <span className={cn(
          "text-[10px] font-medium leading-tight block truncate transition-colors",
          selected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        )}>
          {preset.name}
        </span>
      </div>

      {/* Selection indicator */}
      {selected && (
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
          style={{ backgroundColor: colors.primary }}
        />
      )}
    </button>
  );
};
