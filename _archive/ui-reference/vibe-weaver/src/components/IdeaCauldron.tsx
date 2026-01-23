import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Feather } from "lucide-react";

interface IdeaCauldronProps {
  value: string;
  onChange: (value: string) => void;
}

export const IdeaCauldron: React.FC<IdeaCauldronProps> = ({ value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      {/* Floating ink drops when focused */}
      {isFocused && (
        <div className="absolute -top-4 right-8 flex gap-2 pointer-events-none">
          <div 
            className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bubble" 
            style={{ animationDelay: "0s" }}
          />
          <div 
            className="w-2 h-2 rounded-full bg-primary/40 animate-bubble" 
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      )}

      {/* Parchment label with quill */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Feather className="w-6 h-6 text-primary" />
          <h2 className="font-display text-2xl font-semibold text-foreground">
            The Alchemist's Notes
          </h2>
        </div>
        <span className="text-muted-foreground text-sm italic">
          — inscribe your vision here
        </span>
      </div>

      {/* Stacked parchment papers effect */}
      <div className="relative">
        {/* Bottom paper (3rd layer) - rotated slightly */}
        <div 
          className="absolute inset-0 rounded-lg bg-card/80 border border-border/50"
          style={{ 
            transform: "rotate(1.5deg) translateY(6px) translateX(-3px)",
            boxShadow: "2px 4px 8px rgba(0,0,0,0.3)"
          }}
        />
        
        {/* Middle paper (2nd layer) - rotated opposite */}
        <div 
          className="absolute inset-0 rounded-lg bg-card/90 border border-border/60"
          style={{ 
            transform: "rotate(-1deg) translateY(3px) translateX(2px)",
            boxShadow: "1px 3px 6px rgba(0,0,0,0.25)"
          }}
        />

        {/* Main paper (top layer) */}
        <div 
          className={cn(
            "relative rounded-lg transition-all duration-300",
            "bg-card border border-border",
            isFocused && "ring-2 ring-primary/30 border-primary/50"
          )}
          style={{
            boxShadow: isFocused 
              ? "0 4px 20px hsl(var(--primary) / 0.15), inset 0 1px 0 rgba(255,255,255,0.05)" 
              : "0 2px 10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {/* Subtle texture lines */}
          <div 
            className="absolute inset-0 rounded-lg pointer-events-none opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
              `,
              backgroundSize: "24px 32px"
            }}
          />

          {/* Wax seal decoration */}
          <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 border-2 border-primary/50 flex items-center justify-center shadow-lg z-10">
            <span className="text-primary-foreground text-xs font-display">✦</span>
          </div>

          {/* Subtle decorative spots */}
          <div className="absolute bottom-4 left-3 w-6 h-6 rounded-full bg-primary/5 blur-sm pointer-events-none" />
          <div className="absolute top-12 right-6 w-4 h-4 rounded-full bg-primary/5 blur-sm pointer-events-none" />

          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="A fleeting thought, a whispered secret, an observation from the mundane world... inscribe it here and let the transformation begin ✨"
            className={cn(
              "w-full h-44 px-6 py-5 bg-transparent",
              "text-foreground placeholder:text-muted-foreground",
              "resize-none focus:outline-none text-lg leading-relaxed",
              "font-sans"
            )}
          />

          {/* Bottom decorative bar - like page numbering */}
          <div className="px-6 py-3 border-t border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Feather className="w-3 h-3" />
              <span>Ink Flow</span>
            </div>
            <div className="flex items-center gap-1">
              <div 
                className={cn(
                  "h-1.5 rounded-full bg-muted transition-all duration-300",
                  value.length > 0 ? "w-12" : "w-16"
                )}
              />
              <div 
                className="h-1.5 rounded-full bg-primary transition-all duration-300"
                style={{ width: Math.min(value.length / 2, 60) }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative quill shadow at bottom right */}
      <div className="absolute -bottom-1 -right-4 opacity-20 pointer-events-none">
        <Feather className="w-8 h-8 text-primary transform rotate-45" />
      </div>
    </div>
  );
};
