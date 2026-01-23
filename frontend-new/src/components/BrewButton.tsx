import React from "react";
import { cn } from "@/lib/utils";

interface BrewButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const BrewButton: React.FC<BrewButtonProps> = ({
  onClick,
  isLoading,
  disabled
}) => {
  return (
    <div className="relative">
      {/* Background glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl blur-2xl transition-opacity duration-500",
          "bg-primary/30",
          isLoading ? "opacity-80 animate-pulse" : "opacity-40"
        )}
      />

      {/* Main button */}
      <button
        onClick={onClick}
        disabled={disabled || isLoading}
        className="brew-button relative flex items-center justify-center gap-4 min-w-[200px]"
      >
        {isLoading ? (
          <>
            {/* Brewing animation */}
            <div className="relative w-7 h-7">
              {/* Cauldron */}
              <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
                <path
                  d="M4 14C4 10 6 7 14 7C22 7 24 10 24 14V15C24 20 20 24 14 24C8 24 4 20 4 15V14Z"
                  fill="hsl(270 25% 10%)"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                {/* Bubbles */}
                <circle
                  cx="10" cy="16" r="2"
                  fill="hsl(42 90% 70%)"
                  className="animate-cauldron-bubble"
                  style={{ animationDelay: "0s" }}
                />
                <circle
                  cx="16" cy="14" r="1.5"
                  fill="hsl(42 90% 75%)"
                  className="animate-cauldron-bubble"
                  style={{ animationDelay: "0.3s" }}
                />
                <circle
                  cx="13" cy="18" r="1"
                  fill="hsl(42 90% 80%)"
                  className="animate-cauldron-bubble"
                  style={{ animationDelay: "0.6s" }}
                />
              </svg>
            </div>
            <span className="font-display text-xl">Brewing...</span>
          </>
        ) : (
          <>
            {/* Sparkle icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-6 h-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3L14.5 8.5L20 9L16 13.5L17 20L12 17L7 20L8 13.5L4 9L9.5 8.5L12 3Z" />
            </svg>
            <span className="font-display text-xl">Brew It</span>
            {/* Arrow */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>

      {/* Steam/smoke effects when brewing */}
      {isLoading && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none">
          <div
            className="w-3 h-3 rounded-full bg-muted-foreground/30 animate-smoke"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="w-4 h-4 rounded-full bg-muted-foreground/20 animate-smoke"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="w-3 h-3 rounded-full bg-muted-foreground/30 animate-smoke"
            style={{ animationDelay: "1s" }}
          />
        </div>
      )}
    </div>
  );
};
