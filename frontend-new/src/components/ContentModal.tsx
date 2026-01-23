import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ContentHistoryItem } from "@/types/content";
import { Copy, Save, Sparkles, Calendar, Feather } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: ContentHistoryItem | null;
    onSave: (id: number, newContent: string) => void;
}

export const ContentModal: React.FC<ContentModalProps> = ({
    isOpen,
    onClose,
    item,
    onSave
}) => {
    const [editableContent, setEditableContent] = useState("");

    // Reset content when item changes
    useEffect(() => {
        if (item) {
            setEditableContent(item.content_text);
        }
    }, [item]);

    if (!item) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(editableContent);
        toast.success("Potion content copied to clipboard!");
    };

    const handleSave = () => {
        onSave(item.id, editableContent);
        onClose();
    };

    const getPlatformColor = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'x':
            case 'twitter': return 'text-sky-500 bg-sky-500/10 border-sky-200/20';
            case 'linkedin': return 'text-blue-600 bg-blue-600/10 border-blue-200/20';
            case 'instagram': return 'text-pink-600 bg-pink-600/10 border-pink-200/20';
            case 'facebook': return 'text-indigo-500 bg-indigo-500/10 border-indigo-200/20';
            case 'reddit': return 'text-orange-500 bg-orange-500/10 border-orange-200/20';
            case 'tiktok': return 'text-cyan-400 bg-cyan-400/10 border-cyan-200/20';
            default: return 'text-primary bg-primary/10 border-primary/20';
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
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl bg-card border-border/50 shadow-2xl p-0 overflow-hidden sm:rounded-xl">
                {/* Alchemy Background Texture */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
                        `,
                        backgroundSize: "32px 32px"
                    }}
                />

                {/* Decorative header bar */}
                <div className="h-2 w-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

                <DialogHeader className="px-6 pt-6 pb-2 relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <div className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm",
                            getPlatformColor(item.platform)
                        )}>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{getPlatformLabel(item.platform)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                            <Calendar className="w-3.5 h-3.5 opacity-70" />
                            <span>{new Date(item.created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</span>
                        </div>
                    </div>
                    <DialogTitle className="text-xl font-display font-bold text-foreground flex items-center gap-2">
                        <span className="text-primary mr-1">✦</span>
                        Edit Potion Content
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 py-4 relative z-10 flex-1 min-h-[300px]">
                    <textarea
                        className="w-full h-[300px] p-4 rounded-lg bg-background/50 border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none font-sans leading-relaxed text-foreground placeholder:text-muted-foreground/50 transition-all outline-none"
                        value={editableContent}
                        onChange={(e) => setEditableContent(e.target.value)}
                        placeholder="Start brewing your content here..."
                    />

                    {/* Character count / Ink flow */}
                    <div className="absolute bottom-6 right-8 text-xs text-muted-foreground flex items-center gap-1.5 opacity-60">
                        <Feather className="w-3 h-3" />
                        <span>Ink Flow: {editableContent.length} chars</span>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 bg-muted/20 border-t border-border/40 relative z-10 flex items-center justify-between sm:justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            className="bg-background/50 hover:bg-background/80"
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
