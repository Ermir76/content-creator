import React from "react";
import { cn } from "@/lib/utils";
import { VibePresetData } from "@/components/VibePreset";

interface ToneCardProps {
  preset: VibePresetData;
  selected: boolean;
  onSelect: () => void;
}

export const ToneCard: React.FC<ToneCardProps> = ({ preset, selected, onSelect }) => {
  const Icon = preset.icon;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300",
        "min-w-[120px] max-w-[140px]",
        "border-2",
        selected
          ? "bg-primary/10 border-primary shadow-lg shadow-primary/20"
          : "bg-card/50 border-border/50 hover:border-primary/50 hover:bg-card/80"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
          selected 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground group-hover:text-foreground"
        )}
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Name */}
      <span className={cn(
        "font-semibold text-sm text-center leading-tight transition-colors",
        selected ? "text-primary" : "text-foreground"
      )}>
        {preset.name}
      </span>

      {/* Description */}
      <span className="text-xs text-muted-foreground text-center leading-tight">
        {preset.description}
      </span>

      {/* Selection indicator */}
      {selected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
};
