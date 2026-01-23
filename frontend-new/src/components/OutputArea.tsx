import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface OutputAreaProps {
    outputs: Record<string, string>;
    selectedPlatforms: string[];
    isGenerating: boolean;
}

export const OutputArea: React.FC<OutputAreaProps> = ({
    outputs,
    selectedPlatforms,
    isGenerating,
}) => {
    const [activeTab, setActiveTab] = useState(selectedPlatforms[0] || "");
    const [copied, setCopied] = useState(false);

    // Update active tab when platforms change
    React.useEffect(() => {
        if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(activeTab)) {
            setActiveTab(selectedPlatforms[0]);
        }
    }, [selectedPlatforms, activeTab]);

    const handleCopy = async () => {
        const content = outputs[activeTab];
        if (content) {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            toast.success("Copied to clipboard! 📋");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (selectedPlatforms.length === 0) {
        return null;
    }

    const hasOutput = Object.values(outputs).some((o) => o);

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Your Content
                </h3>
                {hasOutput && (
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-secondary text-muted-foreground hover:text-secondary-foreground transition-all text-sm font-medium"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                Copy
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Platform Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
                {selectedPlatforms.map((platform) => (
                    <button
                        key={platform}
                        onClick={() => setActiveTab(platform)}
                        className={cn(
                            "output-tab",
                            activeTab === platform ? "output-tab-active" : "output-tab-inactive"
                        )}
                    >
                        {platform}
                    </button>
                ))}
            </div>

            {/* Output Content */}
            <div className="relative min-h-[200px] bg-card rounded-2xl border border-border p-5 shadow-card">
                {isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-[200px] gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border-4 border-muted border-t-primary animate-spin" />
                            <Sparkles className="w-5 h-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <p className="text-muted-foreground text-sm animate-pulse">
                            Creating magic for {activeTab}...
                        </p>
                    </div>
                ) : outputs[activeTab] ? (
                    <div className="prose prose-sm max-w-none">
                        <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                            {outputs[activeTab]}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] text-center">
                        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Your {activeTab} content will appear here
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
