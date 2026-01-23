import React from "react";
import { cn } from "@/lib/utils";
import { Pencil, Eye, Wand2, Sparkles } from "lucide-react";
import type { Draft } from "@/types/content";

interface DraftTabsProps {
    drafts: Draft[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}

/**
 * Returns an icon and label for each step in the agentic flow
 */
const getStepInfo = (step: string) => {
    const stepLower = step.toLowerCase();

    if (stepLower.includes("drafter") || stepLower.includes("generator") || stepLower.includes("v1")) {
        return { icon: Pencil, label: "Draft", tooltip: "Initial Draft" };
    }
    if (stepLower.includes("challenger") || stepLower.includes("critic") || stepLower.includes("v2")) {
        return { icon: Eye, label: "Critique", tooltip: "Challenger Review" };
    }
    if (stepLower.includes("synthesizer") || stepLower.includes("improver") || stepLower.includes("v3")) {
        return { icon: Wand2, label: "Refined", tooltip: "Synthesized Version" };
    }
    if (stepLower.includes("final") || stepLower.includes("judge")) {
        return { icon: Sparkles, label: "Final", tooltip: "Final Polished Version" };
    }

    // Default fallback
    return { icon: Pencil, label: step, tooltip: step };
};

export const DraftTabs: React.FC<DraftTabsProps> = ({ drafts, selectedIndex, onSelect }) => {
    if (!drafts || drafts.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {drafts.map((draft, idx) => {
                const { icon: Icon, label, tooltip } = getStepInfo(draft.step);
                const isSelected = selectedIndex === idx;

                return (
                    <button
                        key={idx}
                        onClick={() => onSelect(idx)}
                        title={`${tooltip} (${draft.model})`}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium",
                            "border transition-all duration-200",
                            isSelected
                                ? "border-primary bg-primary/10 text-primary shadow-sm"
                                : "border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                        )}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{label}</span>
                        {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};
