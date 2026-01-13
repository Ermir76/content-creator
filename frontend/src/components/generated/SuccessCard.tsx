import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, Eye, Save, CheckCircle, Cpu } from 'lucide-react';
import { toast } from 'sonner';
import { ContentModal } from '../ContentModal';
import { DraftTabs } from './DraftTabs';
import { PLATFORM_COLORS, PLATFORM_LABELS, MODEL_LABELS, MODEL_COLORS } from './constants';
import type { Draft } from '../../types/content';

interface SuccessCardProps {
    platform: string;
    content: string;
    modelUsed?: string;
    drafts?: Draft[];
    onSave?: () => Promise<void>;
}

export function SuccessCard({
    platform,
    content: initialContent,
    modelUsed: initialModel,
    drafts,
    onSave
}: SuccessCardProps) {
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    // State for selected draft (defaults to last one)
    const [selectedDraftIndex, setSelectedDraftIndex] = useState<number>(
        drafts && drafts.length > 0 ? drafts.length - 1 : -1
    );

    // Determine what to show based on selection
    const displayContent = (selectedDraftIndex >= 0 && drafts)
        ? drafts[selectedDraftIndex].content
        : (initialContent || '');

    const displayModel = (selectedDraftIndex >= 0 && drafts)
        ? drafts[selectedDraftIndex].model
        : initialModel;

    const handleCopy = async () => {
        if (!displayContent) return;
        try {
            await navigator.clipboard.writeText(displayContent);
            setCopied(true);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy keys:', err);
            toast.error('Failed to copy');
        }
    };

    const handleSave = async () => {
        if (!onSave || saved || saving) return;
        setSaving(true);
        try {
            await onSave();
            setSaved(true);
            toast.success('Content saved!');
        } catch (err) {
            console.error('Failed to save:', err);
            toast.error('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const platformColor = PLATFORM_COLORS[platform.toLowerCase()] || 'bg-gray-600';
    const platformLabel = PLATFORM_LABELS[platform.toLowerCase()] || platform;
    const modelLabel = displayModel ? (MODEL_LABELS[displayModel.toLowerCase()] || displayModel) : null;
    const modelColor = displayModel ? (MODEL_COLORS[displayModel.toLowerCase()] || 'bg-slate-100 text-slate-700') : '';

    const previewText = displayContent && displayContent.length > 200
        ? displayContent.substring(0, 200) + '...'
        : displayContent;

    return (
        <>
            <Card className={`card-hover bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 overflow-hidden ${saved ? 'ring-2 ring-green-500/50' : ''}`}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge className={`${platformColor} text-white shadow-sm transition-transform hover:scale-105`}>
                                {platformLabel}
                            </Badge>
                            {saved && (
                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-700">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Saved
                                </Badge>
                            )}
                        </div>
                        {displayModel && (
                            <Badge variant="outline" className={`${modelColor} text-xs`}>
                                <Cpu className="w-3 h-3 mr-1" />
                                {modelLabel}
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <DraftTabs
                        drafts={drafts || []}
                        selectedIndex={selectedDraftIndex}
                        onSelect={setSelectedDraftIndex}
                    />

                    <div
                        onClick={() => setModalOpen(true)}
                        className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-200 line-clamp-4">
                            {previewText}
                        </p>
                    </div>

                    {displayContent && (
                        <div className="text-xs text-slate-400 dark:text-slate-500 text-right">
                            {displayContent.length} characters
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button
                            onClick={() => setModalOpen(true)}
                            variant="outline"
                            size="sm"
                            className="flex-1 border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        >
                            <Eye className="mr-1 h-4 w-4" />
                            View
                        </Button>
                        <Button
                            onClick={handleCopy}
                            variant="outline"
                            size="sm"
                            className={`flex-1 transition-all ${copied ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-600 dark:text-green-400' : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
                            disabled={copied}
                        >
                            {copied ? <><Check className="mr-1 h-4 w-4" /> Copied!</> : <><Copy className="mr-1 h-4 w-4" /> Copy</>}
                        </Button>
                        {onSave && (
                            <Button
                                onClick={handleSave}
                                variant="outline"
                                size="sm"
                                className={`flex-1 transition-all ${saved
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-600 dark:text-green-400'
                                    : 'border-green-400 dark:border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                                    }`}
                                disabled={saved || saving}
                            >
                                {saved ? <><CheckCircle className="mr-1 h-4 w-4" /> Saved</> : <><Save className="mr-1 h-4 w-4" /> Save</>}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <ContentModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                platform={platform}
                content={displayContent || ''}
                modelUsed={displayModel}
                canEdit={false}
            />
        </>
    );
}
