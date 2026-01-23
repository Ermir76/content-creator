import React from "react";
import { cn } from "@/lib/utils";
import { Instagram, Music2, Twitter, Linkedin, Facebook, MessageSquare, Settings2 } from "lucide-react";

interface PlatformBottleProps {
  platform: string;
  selected: boolean;
  onToggle: () => void;
  onCustomize: () => void;
}

const platformConfig: Record<string, { 
  icon: React.ElementType; 
  color: string; 
  liquidColor: string;
  label: string;
}> = {
  Instagram: { 
    icon: Instagram, 
    color: "instagram", 
    liquidColor: "hsl(340 75% 50%)",
    label: "Ig" 
  },
  TikTok: { 
    icon: Music2, 
    color: "tiktok", 
    liquidColor: "hsl(180 90% 40%)",
    label: "Tk" 
  },
  "X/Twitter": { 
    icon: Twitter, 
    color: "twitter", 
    liquidColor: "hsl(200 90% 50%)",
    label: "X" 
  },
  LinkedIn: { 
    icon: Linkedin, 
    color: "linkedin", 
    liquidColor: "hsl(210 85% 45%)",
    label: "Li" 
  },
  Facebook: { 
    icon: Facebook, 
    color: "facebook", 
    liquidColor: "hsl(220 65% 50%)",
    label: "Fb" 
  },
  Reddit: { 
    icon: MessageSquare, 
    color: "reddit", 
    liquidColor: "hsl(16 100% 50%)",
    label: "Rd" 
  },
};

export const PlatformBottle: React.FC<PlatformBottleProps> = ({
  platform,
  selected,
  onToggle,
  onCustomize,
}) => {
  const config = platformConfig[platform];
  const Icon = config?.icon || MessageSquare;

  return (
    <div className="relative group">
      {/* Ambient glow - subtle, contained behind bottle */}
      {!selected && (
        <div 
          className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-16 rounded-full blur-xl opacity-40 pointer-events-none"
          style={{ backgroundColor: config?.liquidColor }}
        />
      )}
      
      <button
        onClick={onToggle}
        className={cn(
          "potion-bottle flex flex-col items-center gap-2 p-3 min-w-[80px]",
          selected && "potion-bottle-selected"
        )}
        aria-pressed={selected}
      >
        {/* Bottle SVG */}
        <div className="relative w-14 h-20">
          <svg viewBox="0 0 56 80" fill="none" className="w-full h-full">
            {/* Defs for gradients */}
            <defs>
              {/* Glass gradient for unselected state */}
              <linearGradient id={`glass-${platform}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(270 25% 18%)" />
                <stop offset="40%" stopColor="hsl(270 20% 12%)" />
                <stop offset="100%" stopColor="hsl(270 25% 8%)" />
              </linearGradient>
              
              {/* Shimmer effect */}
              <linearGradient id={`shimmer-${platform}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="45%" stopColor="white" stopOpacity="0.08" />
                <stop offset="55%" stopColor="white" stopOpacity="0.08" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>

              {/* Residue gradient - hint of platform color */}
              <linearGradient id={`residue-${platform}`} x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor={config?.liquidColor} stopOpacity="0.25" />
                <stop offset="30%" stopColor={config?.liquidColor} stopOpacity="0.08" />
                <stop offset="100%" stopColor={config?.liquidColor} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Bottle body */}
            <path
              d="M22 8H34V18C34 18 40 20 42 26C44 32 44 35 44 40V68C44 74 40 78 34 78H22C16 78 12 74 12 68V40C12 35 12 32 14 26C16 20 22 18 22 18V8Z"
              fill={`url(#glass-${platform})`}
              stroke={selected ? config?.liquidColor : "hsl(270 20% 28%)"}
              strokeWidth="2"
              className="transition-all duration-300"
              style={{
                filter: selected ? `drop-shadow(0 0 8px ${config?.liquidColor})` : undefined,
              }}
            />

            {/* Glass highlight - left edge */}
            <path
              d="M16 30C16 30 14 35 14 45V65C14 70 16 74 20 76"
              stroke="white"
              strokeOpacity={selected ? "0.15" : "0.08"}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              className="transition-opacity duration-300"
            />

            {/* Glass highlight - right shimmer */}
            <path
              d="M40 30C40 30 42 35 42 45V60"
              stroke={`url(#shimmer-${platform})`}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            
            {/* Bottle cork with more detail */}
            <rect
              x="20"
              y="2"
              width="16"
              height="8"
              rx="2"
              fill="hsl(30 40% 35%)"
              stroke="hsl(30 35% 25%)"
              strokeWidth="1"
            />
            {/* Cork grain lines */}
            <line x1="24" y1="3" x2="24" y2="9" stroke="hsl(30 30% 28%)" strokeWidth="0.5" />
            <line x1="28" y1="3" x2="28" y2="9" stroke="hsl(30 30% 28%)" strokeWidth="0.5" />
            <line x1="32" y1="3" x2="32" y2="9" stroke="hsl(30 30% 28%)" strokeWidth="0.5" />

            {/* Residue/hint of color when unselected */}
            {!selected && (
              <path
                d="M14 55V66C14 72 18 76 22 76H34C38 76 42 72 42 66V55C42 55 38 58 28 58C18 58 14 55 14 55Z"
                fill={`url(#residue-${platform})`}
                className="transition-opacity duration-500"
              />
            )}

            {/* Liquid fill - animated */}
            <path
              d="M14 40C14 35 14.5 32 16 28C17.5 24 22 22 22 22H34C34 22 38.5 24 40 28C41.5 32 42 35 42 40V66C42 72 38 76 34 76H22C18 76 14 72 14 66V40Z"
              fill={selected ? config?.liquidColor : "transparent"}
              className={cn(
                "transition-all duration-500",
                selected && "animate-pour"
              )}
              style={{
                opacity: selected ? 0.85 : 0,
              }}
            />

            {/* Liquid surface shine */}
            {selected && (
              <ellipse
                cx="28"
                cy="30"
                rx="10"
                ry="3"
                fill="white"
                opacity="0.25"
              />
            )}

            {/* Bubbles when selected */}
            {selected && (
              <>
                <circle cx="20" cy="55" r="2" fill="white" opacity="0.4" className="animate-bubble" style={{ animationDelay: "0s" }} />
                <circle cx="32" cy="60" r="1.5" fill="white" opacity="0.35" className="animate-bubble" style={{ animationDelay: "0.5s" }} />
                <circle cx="26" cy="50" r="1" fill="white" opacity="0.3" className="animate-bubble" style={{ animationDelay: "1s" }} />
              </>
            )}

            {/* Dust particles in empty bottle */}
            {!selected && (
              <>
                <circle cx="22" cy="50" r="0.8" fill={config?.liquidColor} opacity="0.3" className="animate-bubble" style={{ animationDelay: "0.2s", animationDuration: "4s" }} />
                <circle cx="34" cy="58" r="0.6" fill={config?.liquidColor} opacity="0.25" className="animate-bubble" style={{ animationDelay: "1.5s", animationDuration: "5s" }} />
                <circle cx="28" cy="65" r="0.7" fill={config?.liquidColor} opacity="0.2" className="animate-bubble" style={{ animationDelay: "0.8s", animationDuration: "4.5s" }} />
              </>
            )}

            {/* Platform icon in center */}
            <foreignObject x="16" y="38" width="24" height="24">
              <div className="w-full h-full flex items-center justify-center">
                <Icon 
                  className={cn(
                    "w-5 h-5 transition-all duration-300",
                    selected ? "text-white drop-shadow-lg" : "text-muted-foreground group-hover:text-foreground"
                  )} 
                  style={{
                    filter: selected ? `drop-shadow(0 0 4px ${config?.liquidColor})` : undefined,
                  }}
                />
              </div>
            </foreignObject>
          </svg>

          {/* Glow effect */}
          {selected && (
            <div 
              className="absolute inset-0 rounded-full blur-xl opacity-50 -z-10 animate-pulse"
              style={{ backgroundColor: config?.liquidColor }}
            />
          )}

        </div>

        {/* Label tag */}
        <div 
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium transition-all duration-300",
            selected 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground"
          )}
        >
          {platform}
        </div>
      </button>

      {/* Customize button - appears as a hanging tag */}
      {selected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCustomize();
          }}
          className={cn(
            "absolute -right-2 top-8 w-7 h-7 rounded-full",
            "bg-card border-2 border-primary/50 text-primary",
            "flex items-center justify-center",
            "hover:bg-primary hover:text-primary-foreground hover:border-primary",
            "transition-all duration-200 hover:scale-110",
            "shadow-lg animate-fade-in"
          )}
          aria-label={`Customize ${platform}`}
          title="Tweak the recipe"
        >
          <Settings2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
