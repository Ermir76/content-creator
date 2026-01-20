import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Save, CheckCircle, Cpu } from 'lucide-react';
import { toast } from 'sonner';
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
    const modelColor = displayModel ? (MODEL_COLORS[displayModel.toLowerCase()] || 'bg-muted text-muted-foreground') : '';



    return (
        <>
            <Card className={`card-hover overflow-hidden animate-bounce-in ${saved ? 'ring-2 ring-success/50' : ''}`}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge className={`${platformColor} text-white shadow-sm transition-transform hover:scale-105`}>
                                {platformLabel}
                            </Badge>
                            {saved && (
                                <Badge variant="success">
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
                        className="bg-muted/50 p-4 rounded-xl border-2 border-border max-h-[500px] overflow-y-auto card-scroll"
                    >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                            {displayContent}
                        </p>
                    </div>

                    {displayContent && (
                        <div className="text-xs text-muted-foreground text-right">
                            {displayContent.length} characters
                        </div>
                    )}

                    <div className="flex gap-2">

                        <Button
                            onClick={handleCopy}
                            variant="outline"
                            size="sm"
                            className={`flex-1 transition-all ${copied ? 'bg-success/10 border-success text-success' : ''}`}
                            disabled={copied}
                        >
                            {copied ? <><Check className="mr-1 h-4 w-4" /> Copied!</> : <><Copy className="mr-1 h-4 w-4" /> Copy</>}
                        </Button>
                        {onSave && (
                            <Button
                                onClick={handleSave}
                                variant="success"
                                size="sm"
                                className={`flex-1 transition-all ${saved ? 'opacity-80' : ''}`}
                                disabled={saved || saving}
                            >
                                {saved ? <><CheckCircle className="mr-1 h-4 w-4" /> Saved</> : <><Save className="mr-1 h-4 w-4" /> Save</>}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>


        </>
    );
}
