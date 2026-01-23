import React from "react";
import { Copy, Trash2, Calendar, Sparkles, Pencil, Feather } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ContentHistoryItem } from "@/types/content";

interface HistoryCardProps {
    item: ContentHistoryItem;
    onEdit: (item: ContentHistoryItem) => void;
    onDelete: (id: number) => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ item, onEdit, onDelete }) => {
    const wordCount = item.content_text.trim().split(/\s+/).length;

    const handleCopy = () => {
        navigator.clipboard.writeText(item.content_text);
        toast.success("Potion copied to clipboard!");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getPlatformStyles = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'x':
            case 'twitter':
                return 'text-sky-400 border-sky-400/20 bg-sky-400/5';
            case 'linkedin':
                return 'text-blue-500 border-blue-500/20 bg-blue-500/5';
            case 'instagram':
                return 'text-pink-500 border-pink-500/20 bg-pink-500/5';
            case 'facebook':
                return 'text-indigo-500 border-indigo-500/20 bg-indigo-500/5';
            case 'reddit':
                return 'text-orange-500 border-orange-500/20 bg-orange-500/5';
            case 'tiktok':
                return 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5';
            default:
                return 'text-primary border-primary/20 bg-primary/5';
        }
    };

    const getPlatformLabel = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'x': return 'X/Twitter';
            case 'linkedin': return 'LinkedIn';
            case 'instagram': return 'Instagram';
            case 'facebook': return 'Facebook';
            case 'reddit': return 'Reddit';
            case 'tiktok': return 'TikTok';
            default: return platform;
        }
    };

    return (
        <div className="relative group h-full">
            {/* Stacked parchment papers effect (Decorative layers) */}
            {/* Bottom paper (3rd layer) */}
            <div
                className="absolute inset-0 rounded-lg bg-card/80 border border-border/50 transition-colors duration-300 group-hover:bg-card/90"
                style={{
                    transform: "rotate(1.5deg) translateY(6px) translateX(-3px)",
                    boxShadow: "2px 4px 8px rgba(0,0,0,0.3)",
                    zIndex: 0
                }}
            />
            {/* Middle paper (2nd layer) */}
            <div
                className="absolute inset-0 rounded-lg bg-card/90 border border-border/60 transition-colors duration-300 group-hover:bg-card/95"
                style={{
                    transform: "rotate(-1deg) translateY(3px) translateX(2px)",
                    boxShadow: "1px 3px 6px rgba(0,0,0,0.25)",
                    zIndex: 1
                }}
            />

            {/* Main Card */}
            <div className="relative z-10 h-full p-5 rounded-lg bg-card border border-border transition-all duration-300 hover:border-primary/50 flex flex-col shadow-sm">

                {/* Alchemy Texture: Visible Grid */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.05]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
                        `,
                        backgroundSize: "24px 32px"
                    }}
                />

                {/* Wax seal decoration */}
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 border-2 border-primary/50 flex items-center justify-center shadow-lg z-20 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-primary-foreground text-xs font-display">✦</span>
                </div>

                {/* Decorative quill shadow */}
                <div className="absolute -bottom-1 -right-4 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-300 z-0">
                    <Feather className="w-8 h-8 text-primary transform rotate-45" />
                </div>

                {/* Header */}
                <div className="relative flex items-center justify-between mb-4 z-10">
                    {/* Platform Badge - Wax Seal Style */}
                    <div className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-2 shadow-sm backdrop-blur-sm",
                        getPlatformStyles(item.platform)
                    )}>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{getPlatformLabel(item.platform)}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 font-mono">
                        <Calendar className="w-3 h-3 opacity-70" />
                        <span>{formatDate(item.created_at)}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="relative flex-1 mb-6 select-text">
                    <p className="text-sm text-foreground/90 leading-relaxed line-clamp-4 font-normal whitespace-pre-wrap font-sans">
                        {item.content_text}
                    </p>
                </div>

                {/* Footer: Ink Flow Style Metadata & Actions */}
                <div className="relative mt-auto pt-3 border-t border-border/50 flex items-center justify-between z-10">
                    {/* Ink Flow / Stats */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs">
                            <Feather className="w-3 h-3" />
                            <span className="font-medium">Ink Flow ({wordCount})</span>
                        </div>
                        {/* Visual Ink Bar (Mini) */}
                        <div className="flex items-center gap-1 opacity-50">
                            <div className="w-8 h-1 rounded-full bg-primary/20">
                                <div className="h-full bg-primary rounded-full" style={{ width: '40%' }} />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 p-1 shadow-sm">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                            onClick={handleCopy}
                            title="Copy"
                        >
                            <Copy className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                            onClick={() => onEdit(item)}
                            title="Edit"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
                            onClick={() => onDelete(item.id)}
                            title="Delete"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
