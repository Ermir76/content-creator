import React from "react";
import { cn } from "@/lib/utils";
import { Instagram, Music2, Twitter, Linkedin, Facebook, MessageSquare, Settings2 } from "lucide-react";

interface PlatformChipProps {
    platform: string;
    selected: boolean;
    onToggle: () => void;
    onCustomize: () => void;
}

const platformConfig: Record<string, { icon: React.ElementType; color: string; bgClass: string }> = {
    Instagram: { icon: Instagram, color: "instagram", bgClass: "bg-instagram" },
    TikTok: { icon: Music2, color: "tiktok", bgClass: "bg-tiktok" },
    "X/Twitter": { icon: Twitter, color: "twitter", bgClass: "bg-twitter" },
    LinkedIn: { icon: Linkedin, color: "linkedin", bgClass: "bg-linkedin" },
    Facebook: { icon: Facebook, color: "facebook", bgClass: "bg-facebook" },
    Reddit: { icon: MessageSquare, color: "reddit", bgClass: "bg-reddit" },
};

export const PlatformChip: React.FC<PlatformChipProps> = ({
    platform,
    selected,
    onToggle,
    onCustomize,
}) => {
    const config = platformConfig[platform];
    const Icon = config?.icon || MessageSquare;

    return (
        <div className="flex items-center">
            <button
                onClick={onToggle}
                className={cn(
                    "platform-chip flex items-center gap-2",
                    selected
                        ? `platform-chip-selected ${config?.bgClass}`
                        : "platform-chip-unselected",
                    selected && "rounded-r-none pr-2"
                )}
            >
                <Icon className="w-4 h-4" />
                <span>{platform}</span>
            </button>

            {selected && (
                <button
                    onClick={onCustomize}
                    className={cn(
                        "h-full px-2.5 py-2 rounded-r-full flex items-center justify-center transition-all hover:brightness-110",
                        config?.bgClass,
                        "text-white border-l border-white/20"
                    )}
                    aria-label={`Customize ${platform}`}
                    title="Customize settings"
                >
                    <Settings2 className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};
