import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, ChevronDown, ChevronUp, Cpu, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import type { ContentHistoryItem } from '../types/content';

const PLATFORM_COLORS: Record<string, string> = {
    linkedin: 'bg-blue-600 shadow-blue-600/20',
    twitter: 'bg-sky-500 shadow-sky-500/20',
    reddit: 'bg-orange-600 shadow-orange-600/20',
    instagram: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 shadow-pink-500/20',
    facebook: 'bg-blue-700 shadow-blue-700/20',
    tiktok: 'bg-black shadow-black/20',
};

const PLATFORM_LABELS: Record<string, string> = {
    linkedin: 'LinkedIn',
    twitter: 'Twitter',
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
}

export function HistoryCard({ item }: HistoryCardProps) {
    const [copied, setCopied] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const platformColor = PLATFORM_COLORS[item.platform.toLowerCase()] || 'bg-gray-600';
    const platformLabel = PLATFORM_LABELS[item.platform.toLowerCase()] || item.platform;
    const modelLabel = item.model_used ? (MODEL_LABELS[item.model_used.toLowerCase()] || item.model_used) : null;
    const modelColor = item.model_used ? (MODEL_COLORS[item.model_used.toLowerCase()] || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300') : '';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(item.content_text);
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Card className="card-hover bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 overflow-hidden">
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
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.created_at)}
                    </div>
                </div>
                {/* Idea prompt preview */}
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate italic">
                    "{item.idea_prompt}"
                </p>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Content Text with scrollable area */}
                <div
                    className={`bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 ${expanded ? '' : 'card-scroll'
                        }`}
                >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-200">
                        {item.content_text}
                    </p>
                </div>

                {/* Character count */}
                {item.char_count && (
                    <div className="text-xs text-slate-400 dark:text-slate-500 text-right">
                        {item.char_count} characters
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        onClick={() => setExpanded(!expanded)}
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    >
                        {expanded ? (
                            <>
                                <ChevronUp className="mr-1 h-4 w-4" />
                                Collapse
                            </>
                        ) : (
                            <>
                                <ChevronDown className="mr-1 h-4 w-4" />
                                Expand
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={handleCopy}
                        variant="outline"
                        size="sm"
                        className={`flex-1 transition-all ${copied
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-600 dark:text-green-400'
                                : ''
                            }`}
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
                </div>
            </CardContent>
        </Card>
    );
}
