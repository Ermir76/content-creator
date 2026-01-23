import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { InspirationEmptyState } from './InspirationEmptyState';
import { GeneratedContentCard } from './GeneratedContentCard';
import { Loader2 } from 'lucide-react';
import type { PlatformResult } from '@/types/content';
import { cn } from '@/lib/utils';
import { PLATFORMS } from './ContentComposer'; // Borrowing platform list/icons

interface ContentViewerProps {
    results: PlatformResult[];
    isLoading: boolean;
    onRetry: (platform: string) => void;
    onSave: (result: PlatformResult) => Promise<void>;
}

export function ContentViewer({ results, isLoading, onRetry, onSave }: ContentViewerProps) {
    const [activePlatformId, setActivePlatformId] = useState<string | null>(null);

    // Auto-select first platform when results arrive
    useEffect(() => {
        if (results.length > 0 && !activePlatformId) {
            setActivePlatformId(results[0].platform);
        }
    }, [results]);

    // If loading, show centered loader
    if (isLoading) {
        return (
            <div className="h-full min-h-[500px] flex items-center justify-center rounded-2xl bg-card/50 border-2 border-border">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-highlight animate-spin" />
                    <p className="text-muted-foreground font-medium animate-pulse">Creating magic...</p>
                </div>
            </div>
        );
    }

    // If no results, show the Prophecy/Empty State
    if (results.length === 0) {
        return <InspirationEmptyState className="h-full" />;
    }

    const activeResult = results.find(r => r.platform === activePlatformId) || results[0];

    return (
        <Card className="h-full min-h-[500px] flex flex-col overflow-hidden transition-all duration-500 ease-in-out">
            <CardHeader className="border-b-2 border-border bg-muted/30 px-6 py-4">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {/* Platform Switcher Tabs */}
                    {results.map((result) => {
                        const platformDef = PLATFORMS.find(p => p.id === result.platform);
                        const Icon = platformDef?.icon;
                        const label = platformDef?.name || result.platform;
                        const isActive = activePlatformId === result.platform;

                        return (
                            <button
                                key={result.platform}
                                onClick={() => setActivePlatformId(result.platform)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap btn-bounce",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                {Icon && <Icon className="w-4 h-4" />}
                                {label}
                            </button>
                        );
                    })}
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 bg-muted/10">
                {/* The Content Area */}
                <div className="p-6 h-full">
                    {activeResult && (
                        <div className="animate-bounce-in">
                            <GeneratedContentCard
                                platform={activeResult.platform}
                                success={activeResult.success}
                                content={activeResult.content}
                                modelUsed={activeResult.model_used}
                                error={activeResult.error}
                                errorCode={activeResult.error_code}
                                drafts={activeResult.drafts}
                                onRetry={() => onRetry(activeResult.platform)}
                                onSave={async () => await onSave(activeResult)}
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
