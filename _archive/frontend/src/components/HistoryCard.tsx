import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, Eye, Cpu, Calendar, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ContentModal } from './ContentModal';
import { contentApi } from '../services/contentApi';
import type { ContentHistoryItem } from '../types/content';

const PLATFORM_COLORS: Record<string, string> = {
    linkedin: 'bg-blue-600 shadow-blue-600/20',
    x: 'bg-sky-500 shadow-sky-500/20',
    reddit: 'bg-orange-600 shadow-orange-600/20',
    instagram: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 shadow-pink-500/20',
    facebook: 'bg-blue-700 shadow-blue-700/20',
    tiktok: 'bg-black shadow-black/20',
};

const PLATFORM_LABELS: Record<string, string> = {
    linkedin: 'LinkedIn',
    x: 'X',
    reddit: 'Reddit',
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'TikTok',
};

const MODEL_LABELS: Record<string, string> = {
    gemini: 'Gemini',
    openai: 'GPT-5',
    anthropic: 'Claude',
    xai: 'Grok',
};

const MODEL_COLORS: Record<string, string> = {
    gemini: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-700',
    openai: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-700',
    anthropic: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-700',
    xai: 'bg-slate-100 text-slate-700 dark:bg-slate-700/30 dark:text-slate-300 border-slate-200 dark:border-slate-600',
};

interface HistoryCardProps {
    item: ContentHistoryItem;
    onDelete?: (id: number) => Promise<void>;
    onUpdate?: (id: number, newContent: string) => void;
}

export function HistoryCard({ item, onDelete, onUpdate }: HistoryCardProps) {
    const [copied, setCopied] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentContent, setCurrentContent] = useState(item.content_text);

    const platformColor = PLATFORM_COLORS[item.platform.toLowerCase()] || 'bg-gray-600';
    const platformLabel = PLATFORM_LABELS[item.platform.toLowerCase()] || item.platform;
    const modelLabel = item.model_used ? (MODEL_LABELS[item.model_used.toLowerCase()] || item.model_used) : null;
    const modelColor = item.model_used ? (MODEL_COLORS[item.model_used.toLowerCase()] || 'bg-muted text-muted-foreground') : '';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(currentContent);
            setCopied(true);
            toast.success('Copied to clipboard!', {
                description: `${platformLabel} content is ready to paste`
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy');
        }
    };

    const handleDelete = async () => {
        if (!onDelete || deleting) return;

        toast('Delete this content?', {
            description: `This will permanently remove the ${platformLabel} content.`,
            action: {
                label: 'Delete',
                onClick: async () => {
                    setDeleting(true);
                    try {
                        await onDelete(item.id);
                        toast.success('Content deleted', {
                            description: `${platformLabel} content removed from history`
                        });
                    } catch (err) {
                        console.error('Failed to delete:', err);
                        toast.error('Failed to delete', {
                            description: 'Please try again'
                        });
                    } finally {
                        setDeleting(false);
                    }
                }
            },
            cancel: {
                label: 'Cancel',
                onClick: () => { }
            }
        });
    };

    const handleSaveEdit = async (newContent: string) => {
        await contentApi.updateContent(item.id, newContent);
        setCurrentContent(newContent);
        onUpdate?.(item.id, newContent);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Truncate content for preview
    const previewText = currentContent.length > 200
        ? currentContent.substring(0, 200) + '...'
        : currentContent;

    return (
        <>
            <Card className="card-hover overflow-hidden animate-bounce-in">
                <CardHeader className="pb-2 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <Badge className={`${platformColor} text-white shadow-sm`}>
                                {platformLabel}
                            </Badge>
                            {modelLabel && (
                                <Badge variant="outline" className={`${modelColor} text-xs`}>
                                    <Cpu className="w-3 h-3 mr-1" />
                                    {modelLabel}
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.created_at)}
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate italic">
                        "{item.idea_prompt}"
                    </p>
                </CardHeader>
                <CardContent className="space-y-3">
                    {/* Content Preview - Clickable to open modal */}
                    <div
                        onClick={() => setModalOpen(true)}
                        className="bg-muted/50 p-3 rounded-xl border-2 border-border cursor-pointer hover:border-secondary transition-all duration-200"
                    >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground line-clamp-4">
                            {previewText}
                        </p>
                    </div>

                    {/* Character count */}
                    <div className="text-xs text-muted-foreground text-right">
                        {currentContent.length} characters
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setModalOpen(true)}
                            variant="secondary"
                            size="sm"
                            className="flex-1"
                        >
                            <Eye className="mr-1 h-4 w-4" />
                            View
                        </Button>
                        <Button
                            onClick={handleCopy}
                            variant="outline"
                            size="sm"
                            className={`flex-1 transition-all ${copied ? 'bg-success/10 border-success text-success' : ''}`}
                            disabled={copied}
                        >
                            {copied ? (
                                <>
                                    <Check className="mr-1 h-4 w-4" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="mr-1 h-4 w-4" />
                                    Copy
                                </>
                            )}
                        </Button>
                        {onDelete && (
                            <Button
                                onClick={handleDelete}
                                variant="destructive"
                                size="sm"
                                disabled={deleting}
                            >
                                <Trash2 className={`mr-1 h-4 w-4 ${deleting ? 'animate-pulse' : ''}`} />
                                {deleting ? '...' : 'Delete'}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Modal */}
            <ContentModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                platform={item.platform}
                content={currentContent}
                modelUsed={item.model_used}
                createdAt={item.created_at}
                ideaPrompt={item.idea_prompt}
                contentId={item.id}
                onSave={handleSaveEdit}
                onContentUpdate={setCurrentContent}
                canEdit={true}
            />
        </>
    );
}
